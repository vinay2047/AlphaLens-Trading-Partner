'use client';

import { TrendingUp, TrendingDown, Wallet, BarChart3, DollarSign, PieChart } from 'lucide-react';

const PortfolioSummary = ({ portfolio }: { portfolio: PortfolioData }) => {
    const cards = [
        {
            title: 'AlphaFunds Balance',
            value: `$${portfolio.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Wallet,
        },
        {
            title: 'Portfolio Value',
            value: `$${portfolio.totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: PieChart,
        },
        {
            title: 'Total Invested',
            value: `$${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
        },
        {
            title: 'Total P&L',
            value: `${portfolio.totalPnL >= 0 ? '+' : ''}$${portfolio.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: `${portfolio.totalPnLPercent >= 0 ? '+' : ''}${portfolio.totalPnLPercent.toFixed(2)}%`,
            icon: portfolio.totalPnL >= 0 ? TrendingUp : TrendingDown,
            isSemantic: true,
            isPositive: portfolio.totalPnL >= 0,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#000000] p-6 transition-all duration-300 hover:border-gray-700 hover:bg-[#050505] shadow-sm group"
                >
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <p className="text-xs font-semibold tracking-wide text-gray-500">{card.title}</p>
                        <div className={`p-2 rounded-lg bg-[#0a0a0a] border border-gray-800 transition-colors group-hover:border-gray-700 ${
                            card.isSemantic ? (card.isPositive ? 'text-teal-400' : 'text-red-400') : 'text-gray-400 group-hover:text-teal-400'
                        }`}>
                            <card.icon className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className={`text-2xl font-bold tracking-tight ${
                            card.isSemantic ? (card.isPositive ? 'text-teal-400' : 'text-red-400') : 'text-white'
                        }`}>
                            {card.value}
                        </p>
                        {card.subtitle && (
                            <p className="text-xs mt-1.5 font-medium text-gray-400">
                                <span className={card.isPositive ? 'text-teal-400/80' : 'text-red-400/80'}>
                                    {card.subtitle}
                                </span> all time
                            </p>
                        )}
                    </div>
                    
                    {/* Very subtle glow only on hover */}
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none bg-teal-500" />
                </div>
            ))}
        </div>
    );
};

export default PortfolioSummary;
