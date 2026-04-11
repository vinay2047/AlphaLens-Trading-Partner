'use client';

import { TrendingUp, TrendingDown, Wallet, BarChart3, DollarSign, PieChart } from 'lucide-react';

const PortfolioSummary = ({ portfolio }: { portfolio: PortfolioData }) => {
    const cards = [
        {
            title: 'AlphaFunds Balance',
            value: `$${portfolio.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Wallet,
            gradient: 'from-teal-500/20 to-cyan-500/20',
            iconColor: 'text-teal-400',
            borderColor: 'border-teal-500/30',
        },
        {
            title: 'Portfolio Value',
            value: `$${portfolio.totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: PieChart,
            gradient: 'from-blue-500/20 to-indigo-500/20',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/30',
        },
        {
            title: 'Total Invested',
            value: `$${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            gradient: 'from-amber-500/20 to-orange-500/20',
            iconColor: 'text-amber-400',
            borderColor: 'border-amber-500/30',
        },
        {
            title: 'Total P&L',
            value: `${portfolio.totalPnL >= 0 ? '+' : ''}$${portfolio.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: `${portfolio.totalPnLPercent >= 0 ? '+' : ''}${portfolio.totalPnLPercent.toFixed(2)}%`,
            icon: portfolio.totalPnL >= 0 ? TrendingUp : TrendingDown,
            gradient: portfolio.totalPnL >= 0 ? 'from-emerald-500/20 to-green-500/20' : 'from-red-500/20 to-rose-500/20',
            iconColor: portfolio.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400',
            borderColor: portfolio.totalPnL >= 0 ? 'border-emerald-500/30' : 'border-red-500/30',
            valueColor: portfolio.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`relative overflow-hidden rounded-xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <p className="text-sm font-medium text-gray-400">{card.title}</p>
                        <div className={`p-2 rounded-lg bg-gray-800/50 ${card.iconColor}`}>
                            <card.icon className="h-4 w-4" />
                        </div>
                    </div>
                    <p className={`text-2xl font-bold ${card.valueColor || 'text-gray-100'}`}>
                        {card.value}
                    </p>
                    {card.subtitle && (
                        <p className={`text-sm mt-1 font-medium ${card.valueColor || 'text-gray-400'}`}>
                            {card.subtitle}
                        </p>
                    )}
                    {/* Decorative glow */}
                    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${card.gradient}`} />
                </div>
            ))}
        </div>
    );
};

export default PortfolioSummary;
