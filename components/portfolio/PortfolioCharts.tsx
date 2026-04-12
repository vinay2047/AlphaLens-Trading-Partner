'use client';

import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area, LineChart, Line
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

// ─── Color palette ──────────────────────────────────────────────────────────────
const PIE_COLORS = [
    '#10E55A', '#0CB84A', '#178C3A', '#0D6B2C', '#0A5221',
    '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9',
];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, totalValue }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isPnl = data.pnl !== undefined;
        const isPositive = data.pnl >= 0;

        return (
            <div className="bg-[#000000] border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">
                    {data.name || data.symbol}
                </p>
                {isPnl ? (
                    <p className={`text-sm font-bold ${isPositive ? 'text-[#10E55A]' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{data.pnl?.toFixed(2)} USD
                    </p>
                ) : (
                    <>
                        <p className="text-sm font-bold text-white">${data.value?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {((data.value / totalValue) * 100).toFixed(1)}% of portfolio
                        </p>
                    </>
                )}
            </div>
        );
    }
    return null;
};

// ─── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) => (
    <div className="bg-[#000000] border border-white/5 rounded-2xl p-5 flex flex-col gap-1 hover:border-white/10 transition-all duration-300">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
        <p className={`text-2xl font-extrabold tracking-tight ${positive === undefined ? 'text-white' : positive ? 'text-[#10E55A]' : 'text-red-400'}`}>
            {value}
        </p>
        {sub && <p className="text-xs text-gray-500 font-medium">{sub}</p>}
    </div>
);

// ─── Main component ──────────────────────────────────────────────────────────────
const PortfolioCharts = ({ holdings }: { holdings: HoldingData[] }) => {
    if (holdings.length === 0) return null;

    // Derived data
    const pieData = holdings
        .map((h, i) => ({
            name: h.symbol,
            value: Math.round(h.currentValue * 100) / 100,
            color: PIE_COLORS[i % PIE_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

    const totalValue = pieData.reduce((sum, d) => sum + d.value, 0);

    const barData = holdings
        .map((h) => ({
            symbol: h.symbol,
            pnl: Math.round(h.pnl * 100) / 100,
            fill: h.pnl >= 0 ? '#10E55A' : '#EF4444',
        }))
        .sort((a, b) => b.pnl - a.pnl);

    const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
    const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
    const pnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    const winners = holdings.filter((h) => h.pnl >= 0).length;
    const winRate = holdings.length > 0 ? (winners / holdings.length) * 100 : 0;
    const bestHolding = [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];
    const worstHolding = [...holdings].sort((a, b) => a.pnlPercent - b.pnlPercent)[0];

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="flex items-center gap-3 px-1">
                <Activity className="h-4 w-4 text-[#10E55A]" />
                <h2 className="text-lg font-bold text-white tracking-tight">Portfolio Analytics</h2>
                <div className="flex-1 h-px bg-white/5"></div>
            </div>

            {/* Top stat summary row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Value"
                    value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    sub={`${holdings.length} positions`}
                />
                <StatCard
                    label="Total P&L"
                    value={`${totalPnl >= 0 ? '+' : ''}$${Math.abs(totalPnl).toFixed(2)}`}
                    sub={`${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}% vs invested`}
                    positive={totalPnl >= 0}
                />
                <StatCard
                    label="Win Rate"
                    value={`${winRate.toFixed(0)}%`}
                    sub={`${winners}/${holdings.length} positions profitable`}
                    positive={winRate >= 50}
                />
                <StatCard
                    label="Best Performer"
                    value={bestHolding ? `+${bestHolding.pnlPercent.toFixed(1)}%` : '—'}
                    sub={bestHolding?.symbol}
                    positive={true}
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Donut Allocation Chart — takes 2 columns */}
                <div className="lg:col-span-2 bg-[#000000] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-5 bg-[#10E55A] rounded-full"></div>
                        <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">Allocation</h3>
                    </div>
                    <div className="flex items-center gap-5">
                        {/* Donut */}
                        <div className="relative w-[150px] h-[150px] flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={48}
                                        outerRadius={72}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip totalValue={totalValue} />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Total</span>
                                <span className="text-base font-extrabold text-white">
                                    ${(totalValue / 1000).toFixed(1)}k
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 space-y-2 min-w-0">
                            {pieData.slice(0, 7).map((d) => (
                                <div key={d.name} className="flex items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                        <span className="text-gray-300 font-semibold truncate">{d.name}</span>
                                    </div>
                                    <span className="text-gray-500 flex-shrink-0 tabular-nums">
                                        {((d.value / totalValue) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                            {pieData.length > 7 && (
                                <p className="text-[10px] text-gray-600 font-medium">+{pieData.length - 7} more</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* P&L Bar Chart — takes 3 columns */}
                <div className="lg:col-span-3 bg-[#000000] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-[#10E55A] rounded-full"></div>
                            <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">P&L by Asset</h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#10E55A]"></span> Gain
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Loss
                            </span>
                        </div>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                                barCategoryGap="35%"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.04)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="symbol"
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <Tooltip
                                    content={<CustomTooltip totalValue={totalValue} />}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }}
                                />
                                {/* Zero reference line */}
                                <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={28}>
                                    {barData.map((entry, i) => (
                                        <Cell key={`bar-${i}`} fill={entry.fill} opacity={0.9} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom: Individual performance row */}
            <div className="bg-[#000000] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-5 bg-[#10E55A] rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">Position Performance</h3>
                </div>
                <div className="space-y-3">
                    {[...holdings]
                        .sort((a, b) => b.pnlPercent - a.pnlPercent)
                        .map((holding) => {
                            const pct = Math.abs(holding.pnlPercent);
                            const clampedWidth = Math.min(pct, 100);
                            const isPositive = holding.pnl >= 0;
                            return (
                                <div key={holding.symbol} className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-extrabold text-gray-200 w-12 uppercase">{holding.symbol}</span>
                                            <span className="text-xs text-gray-600 font-medium hidden sm:block truncate max-w-[200px]">{holding.company}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold tabular-nums">
                                            <span className={isPositive ? 'text-[#10E55A]' : 'text-red-400'}>
                                                {isPositive ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                                            </span>
                                            <span className="text-gray-500">
                                                ${holding.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${clampedWidth}%`,
                                                backgroundColor: isPositive ? '#10E55A' : '#EF4444',
                                                opacity: 0.85,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default PortfolioCharts;
