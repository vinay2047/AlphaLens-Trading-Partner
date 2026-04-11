'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/database/mongoose';
import { DCAPlan } from '@/database/models/dca.model';
import { Portfolio } from '@/database/models/portfolio.model';
import { Holding } from '@/database/models/holding.model';
import { Transaction } from '@/database/models/transaction.model';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE = process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

function getNextExecutionDate(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
        case 'DAILY': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case 'WEEKLY': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'BIWEEKLY': return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        case 'MONTHLY': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        default: return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
}

export type DCAFormData = {
    symbol: string;
    company: string;
    amount: number;
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
};

export type DCAPlanData = {
    id: string;
    symbol: string;
    company: string;
    amount: number;
    frequency: string;
    active: boolean;
    nextExecutionAt: string;
    totalExecuted: number;
    totalInvested: number;
};

export async function createDCAPlan(data: DCAFormData): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };
        if (data.amount < 1) return { success: false, error: 'Minimum amount is $1' };

        await connectToDatabase();

        const existing = await DCAPlan.findOne({ userId, symbol: data.symbol.toUpperCase() });
        if (existing) {
            return { success: false, error: `You already have a DCA plan for ${data.symbol}. Delete it first.` };
        }

        await DCAPlan.create({
            userId,
            symbol: data.symbol.toUpperCase(),
            company: data.company,
            amount: data.amount,
            frequency: data.frequency,
            active: true,
            nextExecutionAt: getNextExecutionDate(data.frequency),
        });

        return { success: true };
    } catch (e) {
        console.error('createDCAPlan error:', e);
        return { success: false, error: 'Failed to create DCA plan' };
    }
}

export async function getUserDCAPlans(): Promise<{ success: boolean; data?: DCAPlanData[]; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();

        const plans = await DCAPlan.find({ userId }).sort({ createdAt: -1 }).lean();
        const data: DCAPlanData[] = plans.map(p => ({
            id: p._id?.toString() || '',
            symbol: p.symbol,
            company: p.company,
            amount: p.amount,
            frequency: p.frequency,
            active: p.active,
            nextExecutionAt: p.nextExecutionAt?.toISOString() || '',
            totalExecuted: p.totalExecuted,
            totalInvested: p.totalInvested,
        }));

        return { success: true, data };
    } catch (e) {
        console.error('getUserDCAPlans error:', e);
        return { success: false, error: 'Failed to load DCA plans' };
    }
}

export async function toggleDCAPlan(planId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();

        const plan = await DCAPlan.findOne({ _id: planId, userId });
        if (!plan) return { success: false, error: 'Plan not found' };

        plan.active = !plan.active;
        if (plan.active) {
            plan.nextExecutionAt = getNextExecutionDate(plan.frequency);
        }
        await plan.save();

        return { success: true };
    } catch (e) {
        console.error('toggleDCAPlan error:', e);
        return { success: false, error: 'Failed to toggle plan' };
    }
}

export async function deleteDCAPlan(planId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Not authenticated' };

        await connectToDatabase();
        await DCAPlan.deleteOne({ _id: planId, userId });

        return { success: true };
    } catch (e) {
        console.error('deleteDCAPlan error:', e);
        return { success: false, error: 'Failed to delete plan' };
    }
}

// Called by Inngest cron — executes due DCA plans
export async function executeDueDCAPlans(): Promise<{ executed: number; failed: number }> {
    await connectToDatabase();

    const now = new Date();
    const duePlans = await DCAPlan.find({
        active: true,
        nextExecutionAt: { $lte: now },
    });

    let executed = 0;
    let failed = 0;

    for (const plan of duePlans) {
        try {
            // Fetch current price
            const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${plan.symbol}&token=${FINNHUB_API_KEY}`);
            const quote = await res.json();
            const currentPrice = quote?.c;
            if (!currentPrice || currentPrice <= 0) {
                failed++;
                continue;
            }

            // Calculate shares (fractional rounded down to whole shares)
            const shares = Math.floor(plan.amount / currentPrice);
            if (shares <= 0) {
                failed++;
                continue;
            }

            const totalCost = shares * currentPrice;

            // Check balance
            const portfolio = await Portfolio.findOne({ userId: plan.userId });
            if (!portfolio || portfolio.balance < totalCost) {
                console.log(`DCA skip: Insufficient funds for ${plan.userId} ${plan.symbol}`);
                plan.active = false; // Pause plan if insufficient funds
                await plan.save();
                failed++;
                continue;
            }

            // Execute buy
            portfolio.balance -= totalCost;
            portfolio.totalInvested += totalCost;
            await portfolio.save();

            // Update holding
            const existing = await Holding.findOne({ userId: plan.userId, symbol: plan.symbol });
            if (existing) {
                const newTotal = existing.totalInvested + totalCost;
                const newShares = existing.shares + shares;
                existing.avgBuyPrice = newTotal / newShares;
                existing.shares = newShares;
                existing.totalInvested = newTotal;
                await existing.save();
            } else {
                await Holding.create({
                    userId: plan.userId,
                    symbol: plan.symbol,
                    company: plan.company,
                    shares,
                    avgBuyPrice: currentPrice,
                    totalInvested: totalCost,
                });
            }

            // Record transaction
            await Transaction.create({
                userId: plan.userId,
                type: 'BUY',
                symbol: plan.symbol,
                company: plan.company,
                shares,
                pricePerShare: currentPrice,
                totalAmount: totalCost,
                status: 'COMPLETED',
            });

            // Update DCA plan
            plan.totalExecuted += 1;
            plan.totalInvested += totalCost;
            plan.nextExecutionAt = getNextExecutionDate(plan.frequency);
            await plan.save();

            console.log(`✅ DCA executed: ${shares} shares of ${plan.symbol} for $${totalCost.toFixed(2)}`);
            executed++;
        } catch (e) {
            console.error(`DCA execution failed for ${plan.symbol}:`, e);
            failed++;
        }
    }

    return { executed, failed };
}
