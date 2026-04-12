'use client';

import { useEffect, useRef, useState } from 'react';

type SentimentLabel = 'positive' | 'negative' | 'neutral';

interface HeadlineResult {
    headline: string;
    source: string;
    sentiment_label: SentimentLabel;
    confidence: number;
}

interface NewsSentimentData {
    ticker: string;
    consensus: 'Bullish' | 'Bearish' | 'Neutral';
    score_summary: {
        positive: number;
        negative: number;
        neutral: number;
    };
    analysed_headlines: HeadlineResult[];
    percentages: {
        positive: number;
        negative: number;
        neutral: number;
    };
}

interface Props {
    data: NewsSentimentData | null;
}

// ─── Sentiment config ─────────────────────────────────────────────────────────

const SEG = {
    positive: { color: '#10E55A', label: 'Positive', textColor: 'text-[#10E55A]', bg: 'bg-[#10E55A]/10 border-[#10E55A]/20' },
    neutral:  { color: '#FDD458', label: 'Neutral',  textColor: 'text-[#FDD458]', bg: 'bg-[#FDD458]/10 border-[#FDD458]/20' },
    negative: { color: '#FF3B30', label: 'Negative', textColor: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/10 border-[#FF3B30]/20' },
} as const;

// ─── Stacked Vertical Bar ─────────────────────────────────────────────────────

interface StackedBarProps {
    positive: number;
    neutral: number;
    negative: number;
    posCount: number;
    neuCount: number;
    negCount: number;
}

function StackedBar({ positive, neutral, negative, posCount, neuCount, negCount }: StackedBarProps) {
    const [hovered, setHovered] = useState<SentimentLabel | null>(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 60);
        return () => clearTimeout(t);
    }, []);

    const segments: { key: SentimentLabel; pct: number; count: number }[] = [
        { key: 'positive', pct: positive, count: posCount },
        { key: 'neutral',  pct: neutral,  count: neuCount },
        { key: 'negative', pct: negative, count: negCount },
    ];

    return (
        <div className="flex flex-col gap-3">
            {/* Horizontal bar */}
            <div className="relative flex h-2 w-full rounded-full overflow-hidden bg-white/5 border border-white/10">
                {segments.map(({ key, pct, count }) => (
                    <div
                        key={key}
                        className="relative h-full cursor-pointer transition-all duration-700 ease-out group"
                        style={{
                            width: animated ? `${pct}%` : '0%',
                            backgroundColor: SEG[key].color,
                            opacity: hovered && hovered !== key ? 0.3 : 1,
                            flexShrink: 0,
                        }}
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* Shine */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

                        {/* Tooltip above segment */}
                        <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none transition-all duration-150"
                            style={{ opacity: hovered === key ? 1 : 0 }}
                        >
                            <div
                                className="whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs shadow-lg"
                                style={{
                                    borderColor: `${SEG[key].color}40`,
                                    backgroundColor: '#06140A',
                                    color: SEG[key].color,
                                }}
                            >
                                <span className="font-bold">{pct}%</span>
                                <span className="text-gray-400 font-normal ml-1">
                                    · {count} article{count !== 1 ? 's' : ''}
                                </span>
                                <div className="text-[10px] mt-0.5" style={{ color: `${SEG[key].color}99` }}>
                                    {SEG[key].label}
                                </div>
                                {/* Arrow pointing down */}
                                <div
                                    className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                                    style={{ borderTopColor: `${SEG[key].color}40` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend below bar */}
            <div className="flex items-center justify-between gap-2">
                {segments.map(({ key, pct, count }) => (
                    <div
                        key={key}
                        className={`flex items-center gap-1.5 cursor-default transition-opacity duration-150 ${
                            hovered && hovered !== key ? 'opacity-35' : 'opacity-100'
                        }`}
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: SEG[key].color }} />
                        <span className="text-[10px] text-gray-400 font-medium">{SEG[key].label}</span>
                        <span className="text-[10px] font-bold" style={{ color: SEG[key].color }}>{pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Consensus Badge ──────────────────────────────────────────────────────────

function ConsensusBadge({ consensus }: { consensus: string }) {
    const map: Record<string, { bg: string; text: string; glow: string }> = {
        Bullish: { bg: 'bg-[#10E55A]/15 border-[#10E55A]/30', text: 'text-[#10E55A]', glow: 'shadow-[0_0_12px_rgba(16,229,90,0.25)]' },
        Bearish: { bg: 'bg-[#FF3B30]/15 border-[#FF3B30]/30', text: 'text-[#FF3B30]', glow: 'shadow-[0_0_12px_rgba(255,59,48,0.25)]' },
        Neutral: { bg: 'bg-[#FDD458]/15 border-[#FDD458]/30', text: 'text-[#FDD458]', glow: 'shadow-[0_0_12px_rgba(253,212,88,0.2)]' },
    };
    const cfg = map[consensus] ?? map.Neutral;
    const icon = consensus === 'Bullish' ? '▲' : consensus === 'Bearish' ? '▼' : '◆';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.glow}`}>
            {icon} {consensus}
        </span>
    );
}

// ─── Headline / Source Item ───────────────────────────────────────────────────

function HeadlineItem({ item }: { item: HeadlineResult }) {
    const cfg = SEG[item.sentiment_label] ?? SEG.neutral;
    return (
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-black/20 hover:border-gray-700 transition-colors">
            <p className="text-sm font-medium text-gray-200 leading-snug line-clamp-2">{item.headline}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${cfg.bg} ${cfg.textColor}`}>
                    {cfg.label}
                </span>
                <span className="text-[11px] text-gray-500">{item.source}</span>
                <span className="ml-auto text-[11px] text-gray-600">{Math.round(item.confidence * 100)}% conf.</span>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewsSentimentMeter({ data }: Props) {
    if (!data) {
        return (
            <section className="rounded-2xl border border-gray-800 bg-gray-950/40 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 mb-4">News Sentiment</p>
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-xl">📡</div>
                    <p className="text-sm text-gray-500">Sentiment service offline</p>
                    <p className="text-xs text-gray-600">
                        Start the Python service at <code className="text-green-400/70">localhost:8000</code>
                    </p>
                </div>
            </section>
        );
    }

    const { ticker, consensus, score_summary, analysed_headlines, percentages } = data;
    const total = score_summary.positive + score_summary.negative + score_summary.neutral;

    return (
        <section
            id="news-sentiment-meter"
            className="rounded-2xl border border-gray-800 bg-gray-950/40 p-5 backdrop-blur-sm"
        >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                        News Sentiment · AI Analysis
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold text-white">{ticker} Market Pulse</h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {total} headline{total !== 1 ? 's' : ''} via DistilRoBERTa
                    </p>
                </div>
                <ConsensusBadge consensus={consensus} />
            </div>

            {/* ── Stacked vertical bar ── */}
            <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-3">
                    Sentiment Breakdown
                </p>
                <StackedBar
                    positive={percentages.positive}
                    neutral={percentages.neutral}
                    negative={percentages.negative}
                    posCount={score_summary.positive}
                    neuCount={score_summary.neutral}
                    negCount={score_summary.negative}
                />
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-gray-800 mb-4" />

            {/* ── Analysed headlines / sources ── */}
            {analysed_headlines.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-1">
                        Sources
                    </p>
                    {analysed_headlines.map((h, i) => (
                        <HeadlineItem key={i} item={h} />
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-600 text-center py-2">No headlines found for this ticker.</p>
            )}
        </section>
    );
}
