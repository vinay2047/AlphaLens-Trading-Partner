'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const HoldingsTable = ({ holdings }: { holdings: HoldingData[] }) => {
    if (holdings.length === 0) {
        return (
            <div className="rounded-xl border border-gray-600 bg-gray-800 p-8 text-center">
                <p className="text-gray-500 text-lg">No holdings yet</p>
                <p className="text-gray-600 text-sm mt-2">Buy stocks to see them appear here</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-600 bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-400 font-medium bg-gray-700 border-b border-gray-600">
                            <th className="text-left px-4 py-3 text-sm">Stock</th>
                            <th className="text-right px-4 py-3 text-sm">Shares</th>
                            <th className="text-right px-4 py-3 text-sm">Avg Price</th>
                            <th className="text-right px-4 py-3 text-sm">Current</th>
                            <th className="text-right px-4 py-3 text-sm">Value</th>
                            <th className="text-right px-4 py-3 text-sm">P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((h) => (
                            <tr
                                key={h.symbol}
                                className="border-b border-gray-600/50 hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="px-4 py-4">
                                    <Link href={`/stocks/${h.symbol}`} className="group">
                                        <div className="font-semibold text-gray-100 group-hover:text-teal-400 transition-colors">
                                            {h.symbol}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                            {h.company}
                                        </div>
                                    </Link>
                                </td>
                                <td className="text-right px-4 py-4 font-medium text-gray-200">
                                    {h.shares.toLocaleString()}
                                </td>
                                <td className="text-right px-4 py-4 text-gray-400">
                                    ${h.avgBuyPrice.toFixed(2)}
                                </td>
                                <td className="text-right px-4 py-4 text-gray-200 font-medium">
                                    ${h.currentPrice.toFixed(2)}
                                </td>
                                <td className="text-right px-4 py-4 text-gray-200 font-semibold">
                                    ${h.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="text-right px-4 py-4">
                                    <div className={`flex items-center justify-end gap-1 font-semibold ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {h.pnl >= 0 ? (
                                            <TrendingUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5" />
                                        )}
                                        <span>${Math.abs(h.pnl).toFixed(2)}</span>
                                    </div>
                                    <div className={`text-xs text-right ${h.pnlPercent >= 0 ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
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
