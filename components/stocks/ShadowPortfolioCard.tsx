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
                    <Bot className="w-6 h-6 animate-spin-slow" />
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
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-green-500/10 transition-colors duration-700" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bot className="w-5 h-5 text-green-400" />
                        Shadow Portfolio Agent
                        {data.is_mock && (
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60 ml-2">SIMULATED</span>
                        )}
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Deep Reinforcement Learning (PPO) Dynamic Allocation
                    </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm bg-background-dark/50 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#10E55A]" />
                        <span className="text-text-secondary">Agent PPO</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-600" />
                        <span className="text-text-secondary">Buy & Hold</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10">
                {/* Total Return */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Total Return (90D)</p>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${data.agent_metrics.total_return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPct(data.agent_metrics.total_return)}
                        </span>
                        <span className="text-sm text-text-secondary">vs {formatPct(data.baseline_metrics.total_return)}</span>
                    </div>
                </div>

                {/* Sharpe Ratio */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Sharpe Ratio</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">
                            {data.agent_metrics.sharpe_ratio.toFixed(2)}
                        </span>
                        <span className="text-sm text-text-secondary">vs {data.baseline_metrics.sharpe_ratio.toFixed(2)}</span>
                    </div>
                </div>

                {/* Max Drawdown */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Max Drawdown</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-300">
                            {formatPct(data.agent_metrics.max_drawdown)}
                        </span>
                        <span className="text-sm text-text-secondary">vs {formatPct(data.baseline_metrics.max_drawdown)}</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[350px] w-full mt-4 z-10 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            stroke="#ffffff40" 
                            fontSize={12}
                            tickFormatter={(val) => val.toFixed(2)}
                            domain={['auto', 'auto']}
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
            
            <div className="flex items-center gap-2 text-xs text-text-tertiary z-10 border-t border-white/5 pt-4">
                <TrendingUp className="w-4 h-4" />
                <p>The agent observes 17 technical indicators daily to dynamically allocate capital between {symbol} and cash to maximize the Differential Sharpe Ratio.</p>
            </div>
        </div>
    );
}
