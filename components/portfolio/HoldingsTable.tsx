'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const HoldingsTable = ({ holdings }: { holdings: HoldingData[] }) => {
    if (holdings.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-800 bg-[#000000] p-10 text-center shadow-sm">
                <p className="text-gray-400 text-sm font-semibold">No active positions</p>
                <p className="text-gray-600 text-xs mt-1">Discover and secure your first asset today</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-800 bg-[#000000] shadow-sm relative overflow-hidden">
            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold border-b border-gray-800 bg-[#050505]">
                            <th className="px-6 py-4">Asset</th>
                            <th className="text-right px-6 py-4">Shares</th>
                            <th className="text-right px-6 py-4">Entry Price</th>
                            <th className="text-right px-6 py-4">Current Price</th>
                            <th className="text-right px-6 py-4">Total Value</th>
                            <th className="text-right px-6 py-4">P&L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                        {holdings.map((h) => (
                            <tr
                                key={h.symbol}
                                className="group/row hover:bg-white/[0.02] transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <Link href={`/stocks/${h.symbol}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-[#0a0a0a] border border-gray-800 flex items-center justify-center font-bold text-gray-300 group-hover/row:border-gray-600 transition-colors text-xs">
                                                {h.symbol.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-200 group-hover/row:text-white transition-colors text-sm">
                                                    {h.symbol}
                                                </div>
                                                <div className="text-[11px] font-medium text-gray-500 truncate max-w-[180px]">
                                                    {h.company}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="text-right px-6 py-4 font-semibold text-gray-300 text-sm">
                                    {h.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </td>
                                <td className="text-right px-6 py-4 text-gray-400 font-medium text-sm">
                                    ${h.avgBuyPrice.toFixed(2)}
                                </td>
                                <td className="text-right px-6 py-4 text-gray-200 font-semibold text-sm">
                                    ${h.currentPrice.toFixed(2)}
                                </td>
                                <td className="text-right px-6 py-4 text-white font-bold text-sm">
                                    ${h.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="text-right px-6 py-4">
                                    <div className={`flex items-center justify-end gap-1.5 font-semibold text-sm ${h.pnl >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                                        {h.pnl >= 0 ? (
                                            <TrendingUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5" />
                                        )}
                                        <span>${Math.abs(h.pnl).toFixed(2)}</span>
                                    </div>
                                    <div className={`text-[11px] text-right font-medium mt-0.5 ${h.pnlPercent >= 0 ? 'text-teal-500/70' : 'text-red-500/70'}`}>
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
