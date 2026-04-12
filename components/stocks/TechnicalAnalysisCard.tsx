'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OHLCBar {
    t: number; o: number; h: number; l: number; c: number; v: number;
}

type Signal = 'BUY' | 'SELL' | 'NEUTRAL';

interface IndicatorRow {
    name: string;
    value: string;
    signal: Signal;
}

interface TechData {
    overall: Signal;
    buyCount: number;
    sellCount: number;
    neutralCount: number;
    indicators: IndicatorRow[];
}

// ─── Indicator calculations ────────────────────────────────────────────────────

function calcSMA(closes: number[], period: number): number | null {
    if (closes.length < period) return null;
    const slice = closes.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
}

function calcEMA(closes: number[], period: number): number[] {
    if (closes.length < period) return [];
    const k = 2 / (period + 1);
    const result: number[] = [];
    let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
    result.push(ema);
    for (let i = period; i < closes.length; i++) {
        ema = closes[i] * k + ema * (1 - k);
        result.push(ema);
    }
    return result;
}

function calcRSI(closes: number[], period = 14): number | null {
    if (closes.length < period + 1) return null;
    const deltas = closes.slice(1).map((c, i) => c - closes[i]);
    let gains = 0, losses = 0;
    for (let i = 0; i < period; i++) {
        if (deltas[i] > 0) gains += deltas[i];
        else losses -= deltas[i];
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    for (let i = period; i < deltas.length; i++) {
        const d = deltas[i];
        avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
    }
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
}

function calcMACD(closes: number[]): { macd: number; signal: number } | null {
    const ema12 = calcEMA(closes, 12);
    const ema26 = calcEMA(closes, 26);
    if (ema12.length < 9 || ema26.length < 9) return null;
    const diff = ema12.length - ema26.length;
    const macdLine = ema26.map((e26, i) => ema12[i + diff] - e26);
    const signalLine = calcEMA(macdLine, 9);
    if (!signalLine.length) return null;
    return {
        macd: macdLine[macdLine.length - 1],
        signal: signalLine[signalLine.length - 1],
    };
}

function computeTechData(bars: OHLCBar[]): TechData {
    const closes = bars.map(b => b.c);
    const last = closes[closes.length - 1];
    const rows: IndicatorRow[] = [];

    // RSI
    const rsi = calcRSI(closes, 14);
    if (rsi !== null) {
        const sig: Signal = rsi < 30 ? 'BUY' : rsi > 70 ? 'SELL' : 'NEUTRAL';
        rows.push({ name: 'RSI (14)', value: rsi.toFixed(1), signal: sig });
    }

    // MACD
    const macd = calcMACD(closes);
    if (macd) {
        const sig: Signal = macd.macd > macd.signal ? 'BUY' : macd.macd < macd.signal ? 'SELL' : 'NEUTRAL';
        rows.push({ name: 'MACD (12,26,9)', value: macd.macd.toFixed(2), signal: sig });
    }

    // SMA 20
    const sma20 = calcSMA(closes, 20);
    if (sma20 !== null) {
        const sig: Signal = last > sma20 ? 'BUY' : last < sma20 ? 'SELL' : 'NEUTRAL';
        rows.push({ name: 'SMA 20', value: sma20.toFixed(2), signal: sig });
    }

    // SMA 50
    const sma50 = calcSMA(closes, 50);
    if (sma50 !== null) {
        const sig: Signal = last > sma50 ? 'BUY' : last < sma50 ? 'SELL' : 'NEUTRAL';
        rows.push({ name: 'SMA 50', value: sma50.toFixed(2), signal: sig });
    }

    // EMA 20
    const ema20arr = calcEMA(closes, 20);
    if (ema20arr.length) {
        const ema20 = ema20arr[ema20arr.length - 1];
        const sig: Signal = last > ema20 ? 'BUY' : last < ema20 ? 'SELL' : 'NEUTRAL';
        rows.push({ name: 'EMA 20', value: ema20.toFixed(2), signal: sig });
    }

    // Momentum 10-bar ROC
    if (closes.length >= 11) {
        const prev = closes[closes.length - 11];
        const roc = ((last - prev) / prev) * 100;
        const sig: Signal = roc > 0 ? 'BUY' : roc < 0 ? 'SELL' : 'NEUTRAL';
        rows.push({ name: 'Momentum (10)', value: `${roc.toFixed(2)}%`, signal: sig });
    }

    const buyCount = rows.filter(r => r.signal === 'BUY').length;
    const sellCount = rows.filter(r => r.signal === 'SELL').length;
    const neutralCount = rows.filter(r => r.signal === 'NEUTRAL').length;
    const overall: Signal = buyCount > sellCount ? 'BUY' : sellCount > buyCount ? 'SELL' : 'NEUTRAL';

    return { overall, buyCount, sellCount, neutralCount, indicators: rows };
}

// ─── Gauge SVG ────────────────────────────────────────────────────────────────

function Gauge({ data }: { data: TechData }) {
    const total = data.buyCount + data.sellCount + data.neutralCount || 1;
    const ratio = (data.buyCount - data.sellCount) / total; // -1 to +1
    const angle = ratio * 85; // degrees from vertical

    const cx = 100, cy = 90, r = 68;

    function polarToXY(deg: number) {
        const rad = (deg * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    const sellEnd     = polarToXY(-120);
    const neutralEnd  = polarToXY(-60);
    const buyEnd      = polarToXY(0);
    const trackStart  = polarToXY(-180);

    const needleAngle = angle - 90;
    const needleX = cx + 52 * Math.cos((needleAngle * Math.PI) / 180);
    const needleY = cy + 52 * Math.sin((needleAngle * Math.PI) / 180);

    const overallColor = data.overall === 'BUY' ? '#10E55A' : data.overall === 'SELL' ? '#FF3B30' : '#FDD458';

    return (
        <svg viewBox="0 0 200 112" className="w-full max-w-[260px] mx-auto select-none">
            {/* Background track */}
            <path
                d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${buyEnd.x} ${buyEnd.y}`}
                fill="none" stroke="#1a1a1a" strokeWidth="14" strokeLinecap="round"
            />
            {/* Sell arc — red */}
            <path
                d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${sellEnd.x} ${sellEnd.y}`}
                fill="none" stroke="#FF3B30" strokeWidth="10" strokeLinecap="round" opacity="0.9"
            />
            {/* Neutral arc — amber */}
            <path
                d={`M ${sellEnd.x} ${sellEnd.y} A ${r} ${r} 0 0 1 ${neutralEnd.x} ${neutralEnd.y}`}
                fill="none" stroke="#FDD458" strokeWidth="10" opacity="0.9"
            />
            {/* Buy arc — neon green */}
            <path
                d={`M ${neutralEnd.x} ${neutralEnd.y} A ${r} ${r} 0 0 1 ${buyEnd.x} ${buyEnd.y}`}
                fill="none" stroke="#10E55A" strokeWidth="10" strokeLinecap="round" opacity="0.9"
            />
            {/* Needle glow */}
            <line x1={cx} y1={cy} x2={needleX} y2={needleY}
                stroke={overallColor} strokeWidth="4" strokeLinecap="round" opacity="0.15"
            />
            {/* Needle */}
            <line x1={cx} y1={cy} x2={needleX} y2={needleY}
                stroke="white" strokeWidth="2" strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r="5" fill="#0d0d0d" stroke="white" strokeWidth="1.5" />

            {/* Arc labels */}
            <text x="13" y="104" fontSize="8.5" fill="#FF3B30" fontWeight="700" fontFamily="sans-serif">Strong sell</text>
            <text x="68" y="30"  fontSize="8.5" fill="#94a3b8" fontFamily="sans-serif">Neutral</text>
            <text x="150" y="104" fontSize="8.5" fill="#10E55A" fontWeight="700" fontFamily="sans-serif">Strong buy</text>

            {/* Overall verdict */}
            <text x={cx} y={cy + 20} textAnchor="middle" fontSize="12" fontWeight="700"
                fill={overallColor} fontFamily="sans-serif" letterSpacing="1">
                {data.overall}
            </text>
        </svg>
    );
}

// ─── Signal Badge ─────────────────────────────────────────────────────────────

function SignalBadge({ signal }: { signal: Signal }) {
    const map: Record<Signal, { cls: string; icon: React.ReactNode }> = {
        BUY:     { cls: 'text-[#10E55A] bg-[#10E55A]/10 border-[#10E55A]/20', icon: <TrendingUp  className="h-3 w-3" /> },
        SELL:    { cls: 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20', icon: <TrendingDown className="h-3 w-3" /> },
        NEUTRAL: { cls: 'text-[#FDD458] bg-[#FDD458]/10 border-[#FDD458]/20', icon: <Minus        className="h-3 w-3" /> },
    };
    const { cls, icon } = map[signal];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${cls}`}>
            {icon} {signal}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TechnicalAnalysisCard({ symbol }: { symbol: string }) {
    const [data, setData] = useState<TechData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/candles/${symbol}`);
                if (!res.ok) throw new Error();
                const bars: OHLCBar[] = await res.json();
                if (!bars || bars.length < 30) throw new Error();
                setData(computeTechData(bars));
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [symbol]);

    return (
        <section className="rounded-2xl border border-gray-800 bg-gray-950/40 backdrop-blur-sm p-5">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 rounded-lg border border-gray-800 bg-black/20">
                    <Activity className="h-4 w-4 text-[#10E55A]" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Technical Analysis</p>
                    <h3 className="text-base font-bold text-gray-100">{symbol}</h3>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-10">
                    <div className="h-6 w-6 border-2 border-[#10E55A]/30 border-t-[#10E55A] rounded-full animate-spin" />
                </div>
            )}

            {/* Error / no data */}
            {error && !loading && (
                <p className="text-center text-sm text-gray-500 py-6">
                    Insufficient candle history for <span className="text-gray-300 font-semibold">{symbol}</span>.<br />
                    <span className="text-xs text-gray-600">Extended data requires a Finnhub paid plan.</span>
                </p>
            )}

            {/* Main content */}
            {data && !loading && (
                <>
                    {/* Gauge */}
                    <Gauge data={data} />

                    {/* Count boxes */}
                    <div className="grid grid-cols-3 gap-2 mt-4 mb-5">
                        {([
                            { label: 'Sell',    count: data.sellCount,    color: 'text-[#FF3B30]' },
                            { label: 'Neutral', count: data.neutralCount, color: 'text-[#FDD458]' },
                            { label: 'Buy',     count: data.buyCount,     color: 'text-[#10E55A]' },
                        ] as const).map(({ label, count, color }) => (
                            <div key={label} className="text-center rounded-xl border border-gray-800 bg-black/20 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-800 mb-4" />

                    {/* Indicator table */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">Indicators</p>
                    <div className="flex flex-col gap-1.5">
                        {data.indicators.map(row => (
                            <div key={row.name}
                                className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-800 bg-black/20 hover:border-gray-700 transition-colors">
                                <span className="text-sm text-gray-300 font-medium">{row.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 font-mono">{row.value}</span>
                                    <SignalBadge signal={row.signal} />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
