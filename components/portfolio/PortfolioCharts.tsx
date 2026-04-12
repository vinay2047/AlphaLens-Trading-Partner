'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

const COLORS = [
    '#10E55A', '#0EA846', '#268E46', '#177028', '#11521D',
    '#A3A3A3', '#737373', '#525252', '#404040', '#262626'
];

const PortfolioCharts = ({ holdings }: { holdings: HoldingData[] }) => {
    if (holdings.length === 0) return null;

    // Pie chart data — allocation by current value
    const pieData = holdings.map((h, i) => ({
        name: h.symbol,
        value: Math.round(h.currentValue * 100) / 100,
        color: COLORS[i % COLORS.length],
    })).sort((a, b) => b.value - a.value);

    const totalValue = pieData.reduce((sum, d) => sum + d.value, 0);

    // Bar chart data — P&L per stock
    const barData = holdings.map((h) => ({
        symbol: h.symbol,
        pnl: Math.round(h.pnl * 100) / 100,
        fill: h.pnl >= 0 ? '#10B981' : '#EF4444',
    })).sort((a, b) => b.pnl - a.pnl);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm font-semibold text-gray-200">{data.name || data.symbol}</p>
                    <p className="text-xs text-gray-400">
                        {data.value !== undefined
                            ? `$${data.value.toLocaleString()} (${((data.value / totalValue) * 100).toFixed(1)}%)`
                            : `P&L: $${data.pnl?.toFixed(2)}`
                        }
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocation Pie Chart */}
            <div className="rounded-2xl border border-gray-800 bg-[#000000] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <PieIcon className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-200">Portfolio Allocation</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-[180px] h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
                        {pieData.map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-gray-300 font-medium">{d.name}</span>
                                </div>
                                <span className="text-gray-500">{((d.value / totalValue) * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* P&L Bar Chart */}
            <div className="rounded-2xl border border-gray-800 bg-[#000000] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-200">P&L by Asset</h3>
                </div>
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30333A" />
                            <XAxis dataKey="symbol" tick={{ fontSize: 11, fill: '#9095A1' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9095A1' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} barSize={16}>
                                {barData.map((entry, i) => (
                                    <Cell key={`bar-${i}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PortfolioCharts;
