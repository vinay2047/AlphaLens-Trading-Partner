'use client';

import { TrendingUp, TrendingDown, Wallet, BarChart3, DollarSign, PieChart } from 'lucide-react';

const PortfolioSummary = ({ portfolio }: { portfolio: PortfolioData }) => {
    const cards = [
        {
            title: 'AlphaFunds Balance',
            value: `$${portfolio.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Wallet,
            hoverBorder: 'hover:border-teal-500/50',
            iconColor: 'text-teal-400',
            borderColor: 'border-teal-500/20',
            shadow: 'hover:shadow-[0_0_20px_rgba(16,229,90,0.15)]'
        },
        {
            title: 'Portfolio Value',
            value: `$${portfolio.totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: PieChart,
            hoverBorder: 'hover:border-blue-500/50',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/20',
            shadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
        },
        {
            title: 'Total Invested',
            value: `$${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            hoverBorder: 'hover:border-amber-500/50',
            iconColor: 'text-amber-400',
            borderColor: 'border-amber-500/20',
            shadow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
        },
        {
            title: 'Total P&L',
            value: `${portfolio.totalPnL >= 0 ? '+' : ''}$${portfolio.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: `${portfolio.totalPnLPercent >= 0 ? '+' : ''}${portfolio.totalPnLPercent.toFixed(2)}%`,
            icon: portfolio.totalPnL >= 0 ? TrendingUp : TrendingDown,
            hoverBorder: portfolio.totalPnL >= 0 ? 'hover:border-emerald-500/50' : 'hover:border-red-500/50',
            iconColor: portfolio.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400',
            borderColor: portfolio.totalPnL >= 0 ? 'border-emerald-500/20' : 'border-red-500/20',
            valueColor: portfolio.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400',
            shadow: portfolio.totalPnL >= 0 ? 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`relative overflow-hidden rounded-[2rem] border ${card.borderColor} bg-[#000000] p-6 transition-all duration-300 ${card.hoverBorder} ${card.shadow} group`}
                >
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">{card.title}</p>
                        <div className={`p-2 rounded-xl bg-gray-900 border border-gray-800 transition-colors group-hover:bg-gray-800 ${card.iconColor}`}>
                            <card.icon className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className={`text-3xl font-bold tracking-tight ${card.valueColor || 'text-white'}`}>
                            {card.value}
                        </p>
                        {card.subtitle && (
                            <p className={`text-sm mt-1 font-semibold ${card.valueColor || 'text-gray-400'}`}>
                                {card.subtitle}
                            </p>
                        )}
                    </div>
                    
                    {/* Decorative bottom glow */}
                    <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none bg-current ${card.iconColor}`} />
                </div>
            ))}
        </div>
    );
};

export default PortfolioSummary;
