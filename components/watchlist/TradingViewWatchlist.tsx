"use client";

import React, { useEffect, useState } from 'react';
import { getWatchlistData } from '@/lib/actions/finnhub.actions';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface TradingViewWatchlistProps {
    symbols: string[];
}

export default function TradingViewWatchlist({ symbols }: TradingViewWatchlistProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (symbols.length === 0) {
                setData([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // We use the existing finnhub actions to perfectly recreate the watchlist natively
                const results = await getWatchlistData(symbols);
                setData(results);
            } catch (err) {
                console.error("Failed to load native watchlist data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        
        // Refresh every 10 seconds to mimic live market quotes
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [symbols]);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center p-12 bg-gray-950/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl min-h-[300px]">
                <Loader2 className="animate-spin text-[#10E55A] w-10 h-10" />
            </div>
        );
    }

    if (symbols.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-gray-950/40 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden transition-all hover:border-[#10E55A]/20">
            <div className="overflow-x-auto relative">
                {/* Subtle screen glare effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
                
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500 bg-black/60">
                            <th className="p-5 font-semibold">Symbol / Name</th>
                            <th className="p-5 font-semibold text-right">Price</th>
                            <th className="p-5 font-semibold text-right">Change</th>
                            <th className="p-5 font-semibold text-right">Change %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((item) => {
                            const isPositive = item.change >= 0;
                            return (
                                <tr key={item.symbol} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            {item.logo ? (
                                                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:ring-[#10E55A]/30 transition-all">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.logo} alt={item.symbol} className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 font-bold flex-shrink-0 shadow-lg ring-1 ring-white/10 group-hover:ring-[#10E55A]/30 transition-all">
                                                    {item.symbol[0]}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-xl text-gray-200 group-hover:text-[#10E55A] transition-colors">{item.symbol}</div>
                                                <div className="text-sm text-gray-500 max-w-[200px] truncate">{item.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right align-middle">
                                        <div className="font-mono text-xl font-bold text-white group-hover:text-gray-100 transition-colors">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right align-middle">
                                        <div className={`font-mono text-lg font-medium flex justify-end items-center gap-1.5 ${isPositive ? 'text-[#10E55A]' : 'text-red-500'}`}>
                                            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                            {isPositive ? '+' : ''}{item.change.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right align-middle">
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-xl font-mono text-base font-bold shadow-sm ${isPositive ? 'bg-[#10E55A]/15 text-[#10E55A] border border-[#10E55A]/20' : 'bg-red-500/15 text-red-500 border border-red-500/20'}`}>
                                            {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
