'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { Holding } from '@/database/models/holding.model';
import {
    leaderboardCacheKey,
    LEADERBOARD_CACHE_TTL_SECONDS,
} from '@/lib/cache-keys';
import { getCacheJson, setCacheJson } from '@/lib/redis-cache';
import { getStockPrices } from '@/lib/market-data';

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
            const priceMap = await getStockPrices(holdings.map((holding) => holding.symbol));

            let totalValue = 0;
            let topHolding = '';
            let topValue = 0;

            for (const h of holdings) {
                const price = priceMap.get(h.symbol.toUpperCase()) ?? 0;
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
