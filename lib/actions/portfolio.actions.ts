'use server';

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/database/mongoose";
import { Portfolio } from "@/database/models/portfolio.model";
import { Holding } from "@/database/models/holding.model";
import { Transaction } from "@/database/models/transaction.model";

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE = process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

async function getStockPrice(symbol: string): Promise<number> {
    try {
        const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
            next: { revalidate: 30 },
        });
        const data = await res.json();
        return data?.c || 0;
    } catch {
        return 0;
    }
}

export async function getOrCreatePortfolio(): Promise<{ success: boolean; data?: PortfolioData; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();

        let portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            portfolio = await Portfolio.create({ userId, balance: 10000, totalInvested: 0 });
        }

        const holdings = await Holding.find({ userId, shares: { $gt: 0 } }).lean();

        // Fetch current prices for all holdings
        const holdingsWithPrices: HoldingData[] = await Promise.all(
            holdings.map(async (h) => {
                const currentPrice = await getStockPrice(h.symbol);
                const currentValue = currentPrice * h.shares;
                const pnl = currentValue - h.totalInvested;
                const pnlPercent = h.totalInvested > 0 ? (pnl / h.totalInvested) * 100 : 0;
                return {
                    symbol: h.symbol,
                    company: h.company,
                    shares: h.shares,
                    avgBuyPrice: h.avgBuyPrice,
                    totalInvested: h.totalInvested,
                    currentPrice,
                    currentValue,
                    pnl,
                    pnlPercent,
                };
            })
        );

        const totalPortfolioValue = holdingsWithPrices.reduce((sum, h) => sum + h.currentValue, 0);
        const totalPnL = holdingsWithPrices.reduce((sum, h) => sum + h.pnl, 0);
        const totalPnLPercent = portfolio.totalInvested > 0 ? (totalPnL / portfolio.totalInvested) * 100 : 0;

        return {
            success: true,
            data: {
                balance: portfolio.balance,
                totalInvested: portfolio.totalInvested,
                holdings: holdingsWithPrices,
                totalPortfolioValue,
                totalPnL,
                totalPnLPercent,
            },
        };
    } catch (e) {
        console.error('getOrCreatePortfolio error:', e);
        return { success: false, error: 'Failed to load portfolio' };
    }
}

export async function getTransactions(): Promise<{ success: boolean; data?: TransactionData[]; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        const data: TransactionData[] = transactions.map((t) => ({
            id: t._id?.toString() || '',
            type: t.type,
            symbol: t.symbol,
            company: t.company,
            shares: t.shares,
            pricePerShare: t.pricePerShare,
            totalAmount: t.totalAmount,
            status: t.status,
            createdAt: t.createdAt?.toISOString?.() || new Date().toISOString(),
        }));

        return { success: true, data };
    } catch (e) {
        console.error('getTransactions error:', e);
        return { success: false, error: 'Failed to load transactions' };
    }
}

export async function buyStock(symbol: string, company: string, shares: number): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };
        if (shares <= 0) return { success: false, error: 'Invalid share count' };

        await connectToDatabase();

        const currentPrice = await getStockPrice(symbol);
        if (currentPrice <= 0) return { success: false, error: 'Could not fetch stock price' };

        const totalCost = currentPrice * shares;

        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) return { success: false, error: 'Portfolio not found' };
        if (portfolio.balance < totalCost) return { success: false, error: `Insufficient funds. You need $${totalCost.toFixed(2)} but have $${portfolio.balance.toFixed(2)}` };

        // Update portfolio balance
        portfolio.balance -= totalCost;
        portfolio.totalInvested += totalCost;
        await portfolio.save();

        // Update or create holding
        const existing = await Holding.findOne({ userId, symbol: symbol.toUpperCase() });
        if (existing) {
            const newTotalInvested = existing.totalInvested + totalCost;
            const newShares = existing.shares + shares;
            existing.avgBuyPrice = newTotalInvested / newShares;
            existing.shares = newShares;
            existing.totalInvested = newTotalInvested;
            await existing.save();
        } else {
            await Holding.create({
                userId,
                symbol: symbol.toUpperCase(),
                company,
                shares,
                avgBuyPrice: currentPrice,
                totalInvested: totalCost,
            });
        }

        // Record transaction
        await Transaction.create({
            userId,
            type: 'BUY',
            symbol: symbol.toUpperCase(),
            company,
            shares,
            pricePerShare: currentPrice,
            totalAmount: totalCost,
            status: 'COMPLETED',
        });

        return { success: true };
    } catch (e) {
        console.error('buyStock error:', e);
        return { success: false, error: 'Failed to execute buy order' };
    }
}

export async function sellStock(symbol: string, shares: number): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };
        if (shares <= 0) return { success: false, error: 'Invalid share count' };

        await connectToDatabase();

        const holding = await Holding.findOne({ userId, symbol: symbol.toUpperCase() });
        if (!holding || holding.shares < shares) {
            return { success: false, error: `Insufficient shares. You have ${holding?.shares || 0} shares of ${symbol}.` };
        }

        const currentPrice = await getStockPrice(symbol);
        if (currentPrice <= 0) return { success: false, error: 'Could not fetch stock price' };

        const totalRevenue = currentPrice * shares;

        // Update portfolio
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) return { success: false, error: 'Portfolio not found' };

        portfolio.balance += totalRevenue;
        // Reduce totalInvested proportionally
        const proportionSold = shares / holding.shares;
        const investedReduction = holding.totalInvested * proportionSold;
        portfolio.totalInvested = Math.max(0, portfolio.totalInvested - investedReduction);
        await portfolio.save();

        // Update holding
        holding.shares -= shares;
        holding.totalInvested -= investedReduction;
        if (holding.shares <= 0) {
            await Holding.deleteOne({ _id: holding._id });
        } else {
            await holding.save();
        }

        // Record transaction
        await Transaction.create({
            userId,
            type: 'SELL',
            symbol: symbol.toUpperCase(),
            company: holding.company,
            shares,
            pricePerShare: currentPrice,
            totalAmount: totalRevenue,
            status: 'COMPLETED',
        });

        return { success: true };
    } catch (e) {
        console.error('sellStock error:', e);
        return { success: false, error: 'Failed to execute sell order' };
    }
}

export async function addFundsToPortfolio(amount: number, stripePaymentId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();

        let portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            portfolio = await Portfolio.create({ userId, balance: 10000, totalInvested: 0 });
        }

        portfolio.balance += amount;
        await portfolio.save();

        await Transaction.create({
            userId,
            type: 'DEPOSIT',
            totalAmount: amount,
            stripePaymentId,
            status: 'COMPLETED',
        });

        return { success: true };
    } catch (e) {
        console.error('addFundsToPortfolio error:', e);
        return { success: false, error: 'Failed to add funds' };
    }
}

export async function getUserHoldingForSymbol(symbol: string): Promise<{ shares: number; avgBuyPrice: number } | null> {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        await connectToDatabase();

        const holding = await Holding.findOne({ userId, symbol: symbol.toUpperCase() }).lean();
        if (!holding || holding.shares <= 0) return null;

        return { shares: holding.shares, avgBuyPrice: holding.avgBuyPrice };
    } catch {
        return null;
    }
}

export async function getPortfolioBalance(): Promise<number> {
    try {
        const { userId } = await auth();
        if (!userId) return 0;

        await connectToDatabase();

        const portfolio = await Portfolio.findOne({ userId });
        return portfolio?.balance || 0;
    } catch {
        return 0;
    }
}
