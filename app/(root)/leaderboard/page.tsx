'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, TrendingDown, Crown, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LeaderboardEntry = {
    rank: number;
    userId: string;
    displayName: string;
    portfolioValue: number;
    totalPnL: number;
    totalPnLPercent: number;
    holdingsCount: number;
    topHolding?: string;
};

const rankStyles: Record<number, { bg: string; border: string; icon: React.ReactNode }> = {
    1: { bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15', border: 'border-amber-500/40', icon: <Crown className="h-5 w-5 text-amber-400" /> },
    2: { bg: 'bg-gradient-to-r from-slate-300/10 to-gray-400/10', border: 'border-slate-400/30', icon: <Medal className="h-5 w-5 text-slate-300" /> },
    3: { bg: 'bg-gradient-to-r from-orange-600/10 to-amber-700/10', border: 'border-orange-600/30', icon: <Medal className="h-5 w-5 text-orange-500" /> },
};

const LeaderboardPage = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const response = await fetch('/api/leaderboard', { cache: 'no-store' });
            const data = await response.json();
            if (response.ok) {
                setEntries(data);
            }
        } catch {
            console.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                    <p className="text-gray-400 text-lg">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Trophy className="h-8 w-8 text-amber-400" />
                        <h1 className="text-3xl font-bold text-gray-100">Leaderboard</h1>
                    </div>
                    <p className="text-gray-500">Top traders ranked by portfolio performance</p>
                </div>
                <Button
                    onClick={() => loadData(true)}
                    disabled={refreshing}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl"
                    size="sm"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Top 3 Cards */}
            {entries.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {entries.slice(0, 3).map((entry) => {
                        const style = rankStyles[entry.rank];
                        return (
                            <div
                                key={entry.userId}
                                className={`relative rounded-xl border ${style.border} ${style.bg} p-5 transition-all duration-300 hover:scale-[1.02] overflow-hidden`}
                            >
                                <div className="absolute top-3 right-3 opacity-20">
                                    <Trophy className="h-16 w-16 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 border border-gray-600/50">
                                        {style.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">#{entry.rank}</p>
                                        <p className="font-bold text-gray-100">{entry.displayName}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Portfolio Value</span>
                                        <span className="text-sm font-bold text-gray-100">${entry.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">P&L</span>
                                        <span className={`text-sm font-bold flex items-center gap-1 ${entry.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {entry.totalPnL >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {entry.totalPnL >= 0 ? '+' : ''}${entry.totalPnL.toFixed(2)} ({entry.totalPnLPercent.toFixed(1)}%)
                                        </span>
                                    </div>
                                    {entry.topHolding && (
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Top Holding</span>
                                            <span className="text-xs font-medium text-teal-400">{entry.topHolding}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <div className="rounded-xl border border-gray-600 bg-gray-800 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-400 font-medium bg-gray-700 border-b border-gray-600">
                            <th className="text-left px-4 py-3 text-sm">Rank</th>
                            <th className="text-left px-4 py-3 text-sm">Trader</th>
                            <th className="text-right px-4 py-3 text-sm">Portfolio Value</th>
                            <th className="text-right px-4 py-3 text-sm">P&L</th>
                            <th className="text-right px-4 py-3 text-sm hidden md:table-cell">Return %</th>
                            <th className="text-right px-4 py-3 text-sm hidden md:table-cell">Holdings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.userId} className="border-b border-gray-600/50 hover:bg-gray-700/30 transition-colors">
                                <td className="px-4 py-3.5">
                                    <span className={`text-sm font-bold ${entry.rank <= 3 ? 'text-amber-400' : 'text-gray-400'}`}>
                                        #{entry.rank}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="text-sm font-medium text-gray-200">{entry.displayName}</span>
                                    {entry.topHolding && (
                                        <span className="text-xs text-gray-500 ml-2">📈 {entry.topHolding}</span>
                                    )}
                                </td>
                                <td className="text-right px-4 py-3.5 text-sm font-semibold text-gray-100">
                                    ${entry.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="text-right px-4 py-3.5">
                                    <span className={`text-sm font-semibold ${entry.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {entry.totalPnL >= 0 ? '+' : ''}${entry.totalPnL.toFixed(2)}
                                    </span>
                                </td>
                                <td className="text-right px-4 py-3.5 hidden md:table-cell">
                                    <span className={`text-sm font-medium ${entry.totalPnLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {entry.totalPnLPercent >= 0 ? '+' : ''}{entry.totalPnLPercent.toFixed(2)}%
                                    </span>
                                </td>
                                <td className="text-right px-4 py-3.5 text-sm text-gray-400 hidden md:table-cell">
                                    {entry.holdingsCount}
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-500">
                                    No traders yet. Be the first to start trading!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;
