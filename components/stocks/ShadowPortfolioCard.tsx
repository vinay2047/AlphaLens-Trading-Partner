'use client';

import React, { useEffect, useState } from 'react';
import { getShadowPortfolioInference, ShadowPortfolioResponse } from '@/lib/actions/shadow-portfolio.actions';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Bot, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
    symbol: string;
}

export default function ShadowPortfolioCard({ symbol }: Props) {
    const [data, setData] = useState<ShadowPortfolioResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Default to last 90 days for inference
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 90);

                const startDate = start.toISOString().split('T')[0];
                const endDate = end.toISOString().split('T')[0];

                const res = await getShadowPortfolioInference(symbol, startDate, endDate);
                
                if (res) {
                    setData(res);
                } else {
                    setError('Failed to load portfolio analysis.');
                }
            } catch (err) {
                console.error('Shadow Portfolio error:', err);
                setError('Service temporarily unavailable.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    if (loading) {
        return (
            <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
                    {/* <Bot className="w-6 h-6 animate-spin-slow" /> */}
                    <span>RL Agent Compiling Strategy...</span>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3 text-red-400">
                    <AlertTriangle className="w-8 h-8" />
                    <span>{error || 'No shadow portfolio data.'}</span>
                </div>
            </div>
        );
    }

    const formatPct = (val: number) => (val * 100).toFixed(2) + '%';
    const chartData = data.daily_results.map(d => ({
        date: d.date,
        'Agent (PPO)': d.agent_portfolio_value,
        'Baseline (Hold)': d.baseline_portfolio_value,
        allocation: d.allocation * 100
    }));

    return (
        <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#10E55A]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#10E55A]/20 transition-all duration-700" />

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 z-10">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                        <Bot className="w-5 h-5 text-[#10E55A]" />
                        Shadow Portfolio Agent
                    </h2>
                    <p className="text-[10px] text-text-secondary mt-1 max-w-[240px] leading-relaxed">
                        Deep Reinforcement Learning (PPO) Dynamic Allocation
                    </p>
                </div>
                
                <div className="flex items-center gap-3 text-[10px] bg-black/40 px-3 py-1.5 rounded-full border border-white/5 w-fit">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#10E55A]" />
                        <span className="text-text-secondary uppercase tracking-wider font-medium">Agent PPO</span>
                    </div>
                    <div className="w-px h-3 bg-white/10 mx-1" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                        <span className="text-text-secondary uppercase tracking-wider font-medium">Hold</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 z-10">
                {/* Total Return */}
                <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 shadow-inner backdrop-blur-sm flex flex-col justify-between h-full">
                    <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] mb-2 font-bold opacity-80">Total Return</p>
                    <div className="flex flex-col gap-0.5">
                        <span className={`text-xl font-black tracking-tighter ${data.agent_metrics.total_return >= data.baseline_metrics.total_return ? 'text-[#10E55A]' : 'text-red-400'}`}>
                            {formatPct(data.agent_metrics.total_return)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-text-tertiary">vs</span>
                            <span className="text-text-secondary">{formatPct(data.baseline_metrics.total_return)}</span>
                        </div>
                    </div>
                </div>

                {/* Sharpe Ratio */}
                <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 shadow-inner backdrop-blur-sm flex flex-col justify-between h-full">
                    <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] mb-2 font-bold opacity-80">Sharpe Ratio</p>
                    <div className="flex flex-col gap-0.5">
                        <span className={`text-xl font-black tracking-tighter ${data.agent_metrics.sharpe_ratio >= data.baseline_metrics.sharpe_ratio ? 'text-[#10E55A]' : 'text-red-400'}`}>
                            {data.agent_metrics.sharpe_ratio.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-text-tertiary">vs</span>
                            <span className="text-text-secondary">{data.baseline_metrics.sharpe_ratio.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Max Drawdown */}
                <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 shadow-inner backdrop-blur-sm flex flex-col justify-between h-full">
                    <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] mb-2 font-bold opacity-80">Max Drawdown</p>
                    <div className="flex flex-col gap-0.5">
                        <span className={`text-xl font-black tracking-tighter ${data.agent_metrics.max_drawdown <= data.baseline_metrics.max_drawdown ? 'text-[#10E55A]' : 'text-red-400'}`}>
                            {formatPct(data.agent_metrics.max_drawdown)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-text-tertiary">vs</span>
                            <span className="text-text-secondary">{formatPct(data.baseline_metrics.max_drawdown)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[350px] w-full mt-4 z-10 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10E55A" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10E55A" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            stroke="#ffffff40" 
                            fontSize={12}
                            tickFormatter={(tick) => tick.slice(5)} // MM-DD
                            tickMargin={10}
                            minTickGap={30}
                        />
                        <YAxis 
                            stroke="#ffffff20" 
                            fontSize={10}
                            tickFormatter={(val) => val.toFixed(2)}
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1a1d27', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ fontSize: '14px' }}
                            labelStyle={{ color: '#8b949e', marginBottom: '4px' }}
                            formatter={(value: number, name: string) => [
                                name === 'allocation' ? value.toFixed(0) + '%' : value.toFixed(3), 
                                name
                            ]}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Agent (PPO)" 
                            stroke="#10E55A" 
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: "#10E55A", stroke: "#1a1d27", strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Baseline (Hold)" 
                            stroke="#475569" 
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex items-start gap-2 text-[10px] text-text-tertiary z-10 border-t border-white/5 pt-4">
                <TrendingUp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <p className="leading-normal">The agent observes 17 technical indicators daily to dynamically allocate capital between {symbol} and cash, optimizing the Differential Sharpe Ratio.</p>
            </div>
        </div>
    );
}
