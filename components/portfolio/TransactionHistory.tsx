'use client';

import { ArrowDownCircle, ArrowUpCircle, CreditCard } from 'lucide-react';

const typeConfig = {
    DEPOSIT: { icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Deposit' },
    BUY: { icon: ArrowDownCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Buy' },
    SELL: { icon: ArrowUpCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Sell' },
};

const TransactionHistory = ({ transactions }: { transactions: TransactionData[] }) => {
    if (transactions.length === 0) {
        return (
            <div className="rounded-xl border border-gray-600 bg-gray-800 p-8 text-center">
                <p className="text-gray-500 text-lg">No transactions yet</p>
                <p className="text-gray-600 text-sm mt-2">Your trading history will appear here</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-600 bg-gray-800 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {transactions.map((tx) => {
                    const config = typeConfig[tx.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between px-4 py-3.5 border-b border-gray-600/50 hover:bg-gray-700/30 transition-colors last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${config.bg}`}>
                                    <Icon className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-200">
                                        {config.label}
                                        {tx.symbol && (
                                            <span className="text-teal-400 ml-1.5">{tx.symbol}</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {tx.shares && tx.pricePerShare
                                            ? `${tx.shares} shares @ $${tx.pricePerShare.toFixed(2)}`
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
                                <p className={`text-sm font-semibold ${
                                    tx.type === 'SELL' || tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                    {tx.type === 'BUY' ? '-' : '+'}${tx.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500">
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
