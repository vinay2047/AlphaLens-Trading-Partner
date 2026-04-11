'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { Holding } from '@/database/models/holding.model';
import {
    leaderboardCacheKey,
    LEADERBOARD_CACHE_TTL_SECONDS,
    QUOTE_CACHE_TTL_SECONDS,
    quoteCacheKey,
} from '@/lib/cache-keys';
import { getCacheJson, setCacheJson } from '@/lib/redis-cache';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE = process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

async function getStockPrice(symbol: string): Promise<number> {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedPrice = await getCacheJson<number>(quoteCacheKey(normalizedSymbol));
    if (cachedPrice !== null) {
        return cachedPrice;
    }

    try {
        const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${normalizedSymbol}&token=${FINNHUB_API_KEY}`, {
            next: { revalidate: 60 },
        });
        const data = await res.json();
        const price = data?.c || 0;
        await setCacheJson(quoteCacheKey(normalizedSymbol), price, QUOTE_CACHE_TTL_SECONDS);
        return price;
    } catch {
        return 0;
    }
}

export type LeaderboardEntry = {
    rank: number;
    userId: string;
    displayName: string;
    portfolioValue: number;
    totalPnL: number;
    totalPnLPercent: number;
    holdingsCount: number;
    topHolding?: string;
};

export async function getLeaderboard(): Promise<{ success: boolean; data?: LeaderboardEntry[]; error?: string }> {
    try {
        const cachedLeaderboard = await getCacheJson<LeaderboardEntry[]>(leaderboardCacheKey());
        if (cachedLeaderboard) {
            return { success: true, data: cachedLeaderboard };
        }

        await connectToDatabase();

        const portfolios = await Portfolio.find({}).lean();
        if (!portfolios.length) return { success: true, data: [] };

        const entries: LeaderboardEntry[] = [];

        for (const portfolio of portfolios) {
            const holdings = await Holding.find({ userId: portfolio.userId, shares: { $gt: 0 } }).lean();

            let totalValue = 0;
            let topHolding = '';
            let topValue = 0;

            for (const h of holdings) {
                const price = await getStockPrice(h.symbol);
                const value = price * h.shares;
                totalValue += value;
                if (value > topValue) {
                    topValue = value;
                    topHolding = h.symbol;
                }
            }

            const totalPortfolioValue = portfolio.balance + totalValue;
            const initialBalance = 10000; // Starting balance
            const totalPnL = totalPortfolioValue - initialBalance;
            const totalPnLPercent = (totalPnL / initialBalance) * 100;

            // Generate anonymous display name from userId
            const hash = portfolio.userId.slice(-6).toUpperCase();
            const displayName = `Trader_${hash}`;

            entries.push({
                rank: 0,
                userId: portfolio.userId,
                displayName,
                portfolioValue: totalPortfolioValue,
                totalPnL,
                totalPnLPercent,
                holdingsCount: holdings.length,
                topHolding: topHolding || undefined,
            });
        }

        // Sort by portfolio value descending
        entries.sort((a, b) => b.portfolioValue - a.portfolioValue);
        entries.forEach((entry, idx) => { entry.rank = idx + 1; });

        const data = entries.slice(0, 50);
        await setCacheJson(leaderboardCacheKey(), data, LEADERBOARD_CACHE_TTL_SECONDS);

        return { success: true, data };
    } catch (e) {
        console.error('Leaderboard error:', e);
        return { success: false, error: 'Failed to load leaderboard' };
    }
}
