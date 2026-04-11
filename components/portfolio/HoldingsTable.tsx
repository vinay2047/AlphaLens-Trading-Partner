'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const HoldingsTable = ({ holdings }: { holdings: HoldingData[] }) => {
    if (holdings.length === 0) {
        return (
            <div className="rounded-[2xl] border border-gray-800 bg-[#000000] p-10 text-center shadow-lg">
                <p className="text-gray-400 text-lg font-medium">No active positions</p>
                <p className="text-gray-600 text-sm mt-2">Discover and secure your first asset today</p>
            </div>
        );
    }

    return (
        <div className="rounded-[2xl] border border-gray-800 bg-[#000000] shadow-2xl relative overflow-hidden group">
            {/* Ambient table glow */}
            <div className="absolute top-0 right-1/2 w-[300px] h-[200px] bg-teal-500/5 blur-[80px] pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-gray-800/80 bg-black/50 backdrop-blur-md">
                            <th className="px-6 py-5">Asset</th>
                            <th className="text-right px-6 py-5">Shares</th>
                            <th className="text-right px-6 py-5">Entry Price</th>
                            <th className="text-right px-6 py-5">Current Price</th>
                            <th className="text-right px-6 py-5">Total Value</th>
                            <th className="text-right px-6 py-5">P&L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {holdings.map((h) => (
                            <tr
                                key={h.symbol}
                                className="group/row hover:bg-gray-900/40 transition-colors duration-200"
                            >
                                <td className="px-6 py-5">
                                    <Link href={`/stocks/${h.symbol}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center font-bold text-teal-400 group-hover/row:border-teal-500/30 group-hover/row:shadow-[0_0_10px_rgba(16,229,90,0.2)] transition-all">
                                                {h.symbol.substring(0,2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white group-hover/row:text-teal-400 transition-colors text-lg tracking-tight">
                                                    {h.symbol}
                                                </div>
                                                <div className="text-xs font-semibold text-gray-500 truncate max-w-[180px]">
                                                    {h.company}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="text-right px-6 py-5 font-bold text-gray-300">
                                    {h.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </td>
                                <td className="text-right px-6 py-5 text-gray-400 font-medium">
                                    ${h.avgBuyPrice.toFixed(2)}
                                </td>
                                <td className="text-right px-6 py-5 text-white font-bold">
                                    ${h.currentPrice.toFixed(2)}
                                </td>
                                <td className="text-right px-6 py-5 text-white font-extrabold tracking-tight">
                                    ${h.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="text-right px-6 py-5">
                                    <div className={`flex items-center justify-end gap-1.5 font-bold text-base ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {h.pnl >= 0 ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        <span>${Math.abs(h.pnl).toFixed(2)}</span>
                                    </div>
                                    <div className={`text-xs text-right font-semibold mt-0.5 ${h.pnlPercent >= 0 ? 'text-emerald-500/60' : 'text-red-500/60'}`}>
                                        {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HoldingsTable;
