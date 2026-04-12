'use client';

/**
 * AnomalyBanner.tsx
 *
 * A glassmorphic red warning banner that fires anomaly detection on mount
 * and auto-refreshes every 5 minutes. Shows a pulsing severity-coded alert
 * when anomaly_detected = true, stays hidden on clean signals.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { detectStockAnomaly } from '@/lib/actions/anomaly.actions';
import {
    AlertTriangle,
    ShieldAlert,
    TrendingUp,
    Activity,
    Zap,
    RefreshCw,
    X,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface AnomalyBannerProps {
    symbol: string;
    /** Auto-refresh interval in milliseconds. Default: 5 minutes */
    refreshIntervalMs?: number;
}

// ── Severity styles ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
    high: {
        gradient:    'from-red-950/90 via-red-900/80 to-red-950/90',
        border:      'border-red-500/80',
        badge:       'bg-red-500 text-white shadow-red-500/60',
        glow:        'shadow-red-500/40',
        pulse:       'animate-pulse',
        icon:        ShieldAlert,
        iconColor:   'text-red-400',
        titleColor:  'text-red-300',
        dot:         'bg-red-400',
        dotPulse:    'bg-red-500/80',
    },
    medium: {
        gradient:    'from-emerald-950/90 via-emerald-900/80 to-emerald-950/90',
        border:      'border-emerald-500/60',
        badge:       'bg-emerald-500 text-black shadow-emerald-500/40',
        glow:        'shadow-emerald-500/20',
        pulse:       'animate-pulse',
        icon:        AlertTriangle,
        iconColor:   'text-emerald-400',
        titleColor:  'text-emerald-300',
        dot:         'bg-emerald-400',
        dotPulse:    'bg-emerald-500/60',
    },
    low: {
        gradient:    'from-green-950/90 via-green-900/40 to-green-950/90',
        border:      'border-green-500/30',
        badge:       'bg-green-600/50 text-green-200 shadow-green-500/30',
        glow:        'shadow-green-500/10',
        pulse:       '',
        icon:        Activity,
        iconColor:   'text-green-500',
        titleColor:  'text-green-400',
        dot:         'bg-green-500',
        dotPulse:    'bg-green-600/50',
    },
} as const;

const ANOMALY_TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
    'High Risk Spike':         TrendingUp,
    'Unusual Volume Activity': Activity,
    'Possible Manipulation':   ShieldAlert,
    'Volatility Breakout':     Zap,
    'Price-Volume Divergence': Activity,
    'Pump-and-Dump Pattern':   AlertTriangle,
};

// ── Action badge ─────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<string, string> = {
    'hold':         'bg-gray-700/80 text-gray-300 border border-gray-600',
    'caution':      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    'watch closely':'bg-red-500/20 text-red-300 border border-red-500/40',
};

// ── Component ────────────────────────────────────────────────────────────────

const REFRESH_INTERVAL_DEFAULT = 5 * 60 * 1000; // 5 minutes

export default function AnomalyBanner({
    symbol,
    refreshIntervalMs = REFRESH_INTERVAL_DEFAULT,
}: AnomalyBannerProps) {
    const [result,    setResult]    = useState<AnomalyResult | null>(null);
    const [loading,   setLoading]   = useState(true);
    const [checking,  setChecking]  = useState(false);   // re-check spinner
    const [dismissed, setDismissed] = useState(false);
    const [expanded,  setExpanded]  = useState(true);
    const [lastCheck, setLastCheck] = useState<Date | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const runDetection = useCallback(async (isManual = false) => {
        if (isManual) {
            setChecking(true);
            setDismissed(false);
        }
        try {
            const data = await detectStockAnomaly(symbol);
            setResult(data);
            setLastCheck(new Date());
        } catch {
            // Fail silently – don't surface errors as false positives
        } finally {
            setLoading(false);
            setChecking(false);
        }
    }, [symbol]);

    // Initial fetch + auto-refresh
    useEffect(() => {
        runDetection();

        intervalRef.current = setInterval(() => {
            runDetection();
        }, refreshIntervalMs);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [runDetection, refreshIntervalMs]);

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="rounded-xl border border-gray-700/60 bg-gray-800/40 backdrop-blur-sm p-4 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/60" />
                    <div className="flex-1 space-y-2">
                        <div className="w-36 h-3.5 rounded bg-gray-700/60" />
                        <div className="w-56 h-3 rounded bg-gray-700/40" />
                    </div>
                    <div className="w-16 h-6 rounded-full bg-gray-700/60" />
                </div>
            </div>
        );
    }

    // ── No anomaly / dismissed ───────────────────────────────────────────────
    if (!result?.anomaly_detected || dismissed) {
        return (
            <div className="rounded-xl border border-gray-700/40 bg-gray-800/20 backdrop-blur-sm px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-emerald-400">No Anomaly Detected</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                {symbol} – Market activity appears normal
                                {lastCheck && (
                                    <span className="ml-1">
                                        · checked {lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => runDetection(true)}
                        disabled={checking}
                        title="Re-run anomaly detection"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-700/60 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                        {checking ? 'Checking…' : 'Re-check'}
                    </button>
                </div>
            </div>
        );
    }

    // ── Anomaly detected banner ──────────────────────────────────────────────
    const sev = result.severity as keyof typeof SEVERITY_CONFIG;
    const cfg = SEVERITY_CONFIG[sev] ?? SEVERITY_CONFIG.medium;
    const SeverityIcon = cfg.icon;
    const TypeIcon = ANOMALY_TYPE_ICONS[result.anomaly_type] ?? AlertTriangle;

    return (
        <div
            className={`
                relative rounded-xl border ${cfg.border}
                bg-gradient-to-r ${cfg.gradient}
                backdrop-blur-md shadow-xl ${cfg.glow}
                overflow-hidden transition-all duration-500
            `}
            role="alert"
            aria-live="assertive"
        >
            {/* Animated top accent bar */}
            <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                    sev === 'high'   ? 'from-red-500 via-red-400 to-red-500' :
                    sev === 'medium' ? 'from-emerald-500 via-emerald-400 to-emerald-500' :
                                      'from-green-600 via-green-500 to-green-600'
                } ${cfg.pulse}`}
            />

            {/* Subtle corner glow */}
            <div
                className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 ${
                    sev === 'high' ? 'bg-red-500' : sev === 'medium' ? 'bg-emerald-500' : 'bg-green-600'
                }`}
            />

            {/* ── Header row ── */}
            <div className="relative px-4 py-3.5 flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl
                    ${sev === 'high'   ? 'bg-red-500/20 border border-red-500/40' :
                      sev === 'medium' ? 'bg-emerald-500/20 border border-emerald-500/40' :
                                        'bg-green-600/20 border border-green-600/40'}
                `}>
                    <SeverityIcon className={`w-4.5 h-4.5 ${cfg.iconColor}`} />
                </div>

                {/* Title + type */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        {/* Live dot */}
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dotPulse}`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                        </span>

                        <span className={`text-sm font-bold tracking-wide ${cfg.titleColor}`}>
                            [ANOMALY] {result.anomaly_type}
                        </span>

                        {/* Severity badge */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow ${cfg.badge}`}>
                            {result.severity}
                        </span>

                        {/* Confidence */}
                        <span className="text-[10px] text-gray-500 font-mono">
                            {result.confidence_score}% confidence
                        </span>
                    </div>

                    {/* Reason */}
                    {expanded && (
                        <p className="text-[12.5px] text-gray-300 leading-relaxed mt-1">
                            {result.reason}
                        </p>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                        title={expanded ? 'Collapse' : 'Expand'}
                    >
                        {expanded
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />
                        }
                    </button>
                    <button
                        onClick={() => setDismissed(true)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                        title="Dismiss alert"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* ── Expanded details ── */}
            {expanded && (
                <div className={`relative px-4 pb-3.5 border-t ${
                    sev === 'high'   ? 'border-red-500/20' :
                    sev === 'medium' ? 'border-emerald-500/20' :
                                      'border-green-600/20'
                }`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                        {/* Anomaly type + action */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                <TypeIcon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                                <span className="font-medium text-gray-300">{result.anomaly_type}</span>
                            </div>

                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                                ACTION_STYLES[result.suggested_action] ?? ACTION_STYLES.hold
                            }`}>
                                {result.suggested_action === 'hold'          && '[Hold]'}
                                {result.suggested_action === 'caution'       && '[Caution]'}
                                {result.suggested_action === 'watch closely' && '[Watch closely]'}
                            </span>
                        </div>

                        {/* Re-check + timestamp */}
                        <div className="flex items-center gap-2">
                            {lastCheck && (
                                <span className="text-[10px] text-gray-600 font-mono">
                                    {lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                            <button
                                onClick={() => runDetection(true)}
                                disabled={checking}
                                className={`
                                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                                    text-[11px] font-medium transition-all disabled:opacity-50
                                    ${sev === 'high'
                                        ? 'text-red-400 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50'
                                        : sev === 'medium'
                                            ? 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50'
                                            : 'text-green-400 hover:bg-green-500/10 border border-green-500/30 hover:border-green-500/50'
                                    }
                                `}
                            >
                                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                                {checking ? 'Re-checking…' : 'Re-check'}
                            </button>
                        </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Confidence</span>
                            <span className={`text-[10px] font-bold font-mono ${cfg.titleColor}`}>
                                {result.confidence_score}%
                            </span>
                        </div>
                        <div className="h-1 rounded-full bg-gray-700/60 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    sev === 'high'   ? 'bg-gradient-to-r from-red-600 to-red-400' :
                                    sev === 'medium' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                                                      'bg-gradient-to-r from-green-700 to-green-500'
                                }`}
                                style={{ width: `${result.confidence_score}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
