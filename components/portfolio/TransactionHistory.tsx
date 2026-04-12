'use client';

import { ArrowDownCircle, ArrowUpCircle, CreditCard } from 'lucide-react';

const typeConfig = {
    DEPOSIT: { icon: CreditCard, color: 'text-teal-400', bg: 'bg-[#0a0a0a] border border-gray-800', label: 'Deposit' },
    BUY: { icon: ArrowDownCircle, color: 'text-gray-300', bg: 'bg-[#0a0a0a] border border-gray-800', label: 'Buy' },
    SELL: { icon: ArrowUpCircle, color: 'text-gray-400', bg: 'bg-[#0a0a0a] border border-gray-800', label: 'Sell' },
};

const TransactionHistory = ({ transactions }: { transactions: TransactionData[] }) => {
    if (transactions.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-800 bg-[#000000] p-8 text-center shadow-sm">
                <p className="text-gray-400 text-sm font-semibold">No transactions yet</p>
                <p className="text-gray-600 text-xs mt-1">Your trading history will appear here</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-800 bg-[#000000] overflow-hidden shadow-sm relative">
            <div className="max-h-[440px] overflow-y-auto scrollbar-hide relative z-10">
                {transactions.map((tx) => {
                    const config = typeConfig[tx.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between px-5 py-4 border-b border-gray-800/60 hover:bg-white/[0.02] transition-colors last:border-b-0 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${config.bg} group-hover:border-gray-700 transition-colors`}>
                                    <Icon className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-200 tracking-tight">
                                        {config.label}
                                        {tx.symbol && (
                                            <span className="text-white ml-2">{tx.symbol}</span>
                                        )}
                                    </p>
                                    <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-0.5">
                                        {tx.shares && tx.pricePerShare
                                            ? `${tx.shares.toLocaleString()} shares @ $${tx.pricePerShare.toFixed(2)}`
                                            : new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                              })
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold tracking-tight ${
                                    tx.type === 'SELL' || tx.type === 'DEPOSIT' ? 'text-teal-400' : 'text-gray-300'
                                }`}>
                                    {tx.type === 'BUY' ? '-' : '+'}${tx.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-[11px] text-gray-500 font-medium uppercase mt-0.5">
                                    {new Date(tx.createdAt).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TransactionHistory;
