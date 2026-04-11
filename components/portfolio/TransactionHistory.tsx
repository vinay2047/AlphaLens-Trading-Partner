'use client';

import { ArrowDownCircle, ArrowUpCircle, CreditCard } from 'lucide-react';

const typeConfig = {
    DEPOSIT: { icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20', label: 'Deposit' },
    BUY: { icon: ArrowDownCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border border-amber-500/20', label: 'Buy' },
    SELL: { icon: ArrowUpCircle, color: 'text-teal-400', bg: 'bg-teal-500/10 border border-teal-500/20', label: 'Sell' },
};

const TransactionHistory = ({ transactions }: { transactions: TransactionData[] }) => {
    if (transactions.length === 0) {
        return (
            <div className="rounded-[2xl] border border-gray-800 bg-[#000000] p-8 text-center shadow-lg">
                <p className="text-gray-400 text-lg font-medium">No transactions yet</p>
                <p className="text-gray-600 text-sm mt-2">Your trading history will appear here</p>
            </div>
        );
    }

    return (
        <div className="rounded-[2xl] border border-gray-800 bg-[#000000] overflow-hidden shadow-2xl relative">
            <div className="max-h-[440px] overflow-y-auto scrollbar-hide relative z-10">
                {transactions.map((tx) => {
                    const config = typeConfig[tx.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between px-5 py-4 border-b border-gray-800/80 hover:bg-gray-900/50 transition-colors last:border-b-0 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl shadow-inner ${config.bg} group-hover:scale-105 transition-transform`}>
                                    <Icon className={`h-5 w-5 ${config.color}`} />
                                </div>
                                <div>
                                    <p className="text-[15px] font-bold text-white tracking-tight">
                                        {config.label}
                                        {tx.symbol && (
                                            <span className="text-teal-400 ml-2 font-extrabold">{tx.symbol}</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">
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
                                <p className={`text-[15px] font-extrabold tracking-tight ${
                                    tx.type === 'SELL' || tx.type === 'DEPOSIT' ? 'text-teal-400' : 'text-gray-300'
                                }`}>
                                    {tx.type === 'BUY' ? '-' : '+'}${tx.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">
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
