'use client';

import { useState, useEffect } from 'react';
import { getMLPricePrediction, type PredictionResponse } from '@/lib/actions/prediction.actions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Loader2, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function PricePredictionCard({ symbol }: { symbol: string }) {
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const data = await getMLPricePrediction(symbol);
                console.log(`[PricePredictionCard] Data received from backend for ${symbol}:`, data);
                setPrediction(data);
            } catch (error) {
                console.error("Failed to fetch ML prediction", error);
                toast.error("ML Prediction engine temporarily unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [symbol]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-800 bg-[#000000] p-6 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
                <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium text-sm">Initializing ML Models...</p>
                <p className="text-gray-600 text-xs mt-1">Generating 7-day forecast for {symbol}</p>
            </div>
        );
    }

    if (!prediction || prediction.forecast.length === 0) {
        return null;
    }

    // Format chart data: we prepend the current price as Day 0 to anchor the line
    const chartData = [
        {
            date: 'Today',
            price: prediction.current_price,
            isHistorical: true,
        },
        ...prediction.forecast.map(day => ({
            date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: day.price,
            isHistorical: false,
        }))
    ];

    const isPositive = prediction.direction === 'BULLISH';
    const mainColor = isPositive ? '#10E55A' : '#EF4444';

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 shadow-xl">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{label === 'Today' ? 'Current Price' : `Forecast: ${label}`}</p>
                    <p className="text-base font-bold text-white">${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-[#000000] p-6 shadow-sm relative overflow-hidden group">
            {/* Glow effect based on sentiment */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-10 transition-opacity duration-700 bg-[${mainColor}]`}></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-gray-800">
                        <BrainCircuit className="h-5 w-5 text-teal-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">AI Price Forecast</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">7-Day Trajectory</span>
                            {prediction.is_mock && (
                                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold flex items-center gap-1">
                                    <Info className="h-3 w-3" /> Offline (Mocked)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">${prediction.predicted_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-sm font-semibold flex items-center justify-end gap-1 ${isPositive ? 'text-teal-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {prediction.price_change_pct > 0 ? '+' : ''}{prediction.price_change_pct}% target
                    </p>
                </div>
            </div>

            <div className="h-[240px] w-full relative z-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 11, fill: '#737373' }} 
                            axisLine={false} 
                            tickLine={false}
                            dy={10} 
                        />
                        <YAxis 
                            domain={['auto', 'auto']} 
                            tick={{ fontSize: 11, fill: '#737373' }} 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke={mainColor}
                            strokeWidth={3}
                            dot={{ fill: mainColor, r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#FFFFFF', stroke: mainColor, strokeWidth: 2 }}
                            strokeDasharray="5 5" // Dashed line to indicate projection
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-5 border-t border-gray-800/80 pt-4 flex items-center justify-between relative z-10">
                <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">Ensemble Models</p>
                    <p className="text-sm text-gray-300 font-medium mt-1">{prediction.models_used.join(' + ')}</p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">AI Confidence</p>
                    <p className="text-sm font-bold text-white mt-1">{prediction.confidence}%</p>
                </div>
            </div>
        </div>
    );
}
