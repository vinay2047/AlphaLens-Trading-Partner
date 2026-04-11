/**
 * anomaly-engine.ts
 *
 * Pure statistical anomaly detection for OHLCV time-series data.
 * No network calls, no AI – only math. Designed to be a fast pre-filter
 * that decides whether the more expensive Gemini call is warranted.
 */

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Arithmetic mean of an array */
function mean(series: number[]): number {
    if (series.length === 0) return 0;
    return series.reduce((a, b) => a + b, 0) / series.length;
}

/** Population standard deviation */
function stdDev(series: number[], avg?: number): number {
    if (series.length < 2) return 0;
    const mu = avg ?? mean(series);
    const variance = series.reduce((sum, v) => sum + (v - mu) ** 2, 0) / series.length;
    return Math.sqrt(variance);
}

/** Z-score of `value` against a historical series */
export function computeZScore(history: number[], value: number): number {
    if (history.length < 5) return 0;
    const mu = mean(history);
    const sigma = stdDev(history, mu);
    if (sigma === 0) return 0;
    return (value - mu) / sigma;
}

// ── Price Spike Detection ────────────────────────────────────────────────────

const PRICE_ZSCORE_THRESHOLD = 2.0;   // 2σ
const PRICE_PCT_THRESHOLD    = 5.0;   // 5% single-bar move

/**
 * Detect whether the latest bar's close-to-close change is an outlier.
 * Uses both z-score on daily returns AND a hard % threshold.
 */
export function detectPriceSpike(bars: OHLCBar[]): {
    detected: boolean;
    zScore: number;
    changePercent: number;
} {
    if (bars.length < 10) return { detected: false, zScore: 0, changePercent: 0 };

    // Daily returns: (close[i] - close[i-1]) / close[i-1] * 100
    const returns: number[] = [];
    for (let i = 1; i < bars.length; i++) {
        const prev = bars[i - 1].c;
        const curr = bars[i].c;
        if (prev > 0) returns.push(((curr - prev) / prev) * 100);
    }

    const latestReturn = returns[returns.length - 1];
    const historyReturns = returns.slice(0, -1);       // exclude the very last
    const zScore = computeZScore(historyReturns, latestReturn);

    const detected =
        Math.abs(zScore) >= PRICE_ZSCORE_THRESHOLD &&
        Math.abs(latestReturn) >= PRICE_PCT_THRESHOLD;

    return { detected, zScore, changePercent: latestReturn };
}

// ── Volume Anomaly Detection ─────────────────────────────────────────────────

const VOLUME_RATIO_THRESHOLD = 2.5;   // 2.5× 20-day average
const VOLUME_ZSCORE_THRESHOLD = 2.0;

/**
 * Check whether today's volume is significantly above the 20-day average.
 */
export function detectVolumeAnomaly(bars: OHLCBar[]): {
    detected: boolean;
    zScore: number;
    ratioToAvg: number;
} {
    if (bars.length < 21) return { detected: false, zScore: 0, ratioToAvg: 1 };

    const volumes = bars.map(b => b.v);
    const latestVol = volumes[volumes.length - 1];
    const history20 = volumes.slice(-21, -1);                // last 20 bars before today
    const avg20 = mean(history20);

    const ratioToAvg = avg20 > 0 ? latestVol / avg20 : 1;
    const zScore = computeZScore(volumes.slice(0, -1), latestVol);

    const detected =
        ratioToAvg >= VOLUME_RATIO_THRESHOLD &&
        zScore >= VOLUME_ZSCORE_THRESHOLD;

    return { detected, zScore, ratioToAvg };
}

// ── Price–Volume Divergence ──────────────────────────────────────────────────

const PRICE_MOVE_MIN_PCT = 3.0;    // at least 3% price move
const VOLUME_LOW_RATIO   = 0.6;    // volume < 60% of average = "unsupported"

/**
 * Price moved significantly but volume is abnormally low – a red flag
 * suggesting the move may lack conviction or could be manipulated.
 */
export function detectPriceVolumeDivergence(bars: OHLCBar[]): {
    detected: boolean;
    priceChangePct: number;
    volumeRatio: number;
} {
    if (bars.length < 21) return { detected: false, priceChangePct: 0, volumeRatio: 1 };

    const latest = bars[bars.length - 1];
    const prev    = bars[bars.length - 2];
    const priceChangePct = prev.c > 0
        ? ((latest.c - prev.c) / prev.c) * 100
        : 0;

    const volumes = bars.map(b => b.v);
    const avg20 = mean(volumes.slice(-21, -1));
    const volumeRatio = avg20 > 0 ? latest.v / avg20 : 1;

    const detected =
        Math.abs(priceChangePct) >= PRICE_MOVE_MIN_PCT &&
        volumeRatio < VOLUME_LOW_RATIO;

    return { detected, priceChangePct, volumeRatio };
}

// ── Pump-and-Dump Pattern ────────────────────────────────────────────────────

const PUMP_WINDOW    = 5;    // bars to look back for the "pump"
const PUMP_THRESHOLD = 10;   // total rise ≥ 10%
const DUMP_THRESHOLD = 6;    // subsequent drop ≥ 6%

/**
 * Look for a rapid price rise (pump) through the window, followed by a
 * notable reversal in the latest 2 bars (potential dump).
 */
export function detectPumpDump(bars: OHLCBar[]): {
    detected: boolean;
    pumpPct: number;
    dumpPct: number;
} {
    if (bars.length < PUMP_WINDOW + 2)
        return { detected: false, pumpPct: 0, dumpPct: 0 };

    const window = bars.slice(-(PUMP_WINDOW + 2));
    const startPrice  = window[0].c;
    const peakBar     = window[window.length - 3];   // 3 bars ago
    const currentBar  = window[window.length - 1];

    const pumpPct = startPrice > 0
        ? ((peakBar.c - startPrice) / startPrice) * 100
        : 0;
    const dumpPct = peakBar.c > 0
        ? ((peakBar.c - currentBar.c) / peakBar.c) * 100
        : 0;

    const detected = pumpPct >= PUMP_THRESHOLD && dumpPct >= DUMP_THRESHOLD;

    return { detected, pumpPct, dumpPct };
}

// ── Master Summary Builder ───────────────────────────────────────────────────

/**
 * Run all detectors over a full OHLCV series and return a consolidated
 * `StatisticalSignals` object that the server action feeds to the AI prompt.
 */
export function buildStatisticalSummary(bars: OHLCBar[]): StatisticalSignals {
    if (!bars || bars.length === 0) {
        return {
            priceZScore:             0,
            volumeZScore:            0,
            priceChangePercent:      0,
            volumeRatioToAvg:        1,
            isPriceSpike:            false,
            isVolumeAnomaly:         false,
            isPriceVolumeDivergence: false,
            isPumpDump:              false,
            latestBar:               null,
            historyLength:           0,
        };
    }

    const spike     = detectPriceSpike(bars);
    const volume    = detectVolumeAnomaly(bars);
    const diverge   = detectPriceVolumeDivergence(bars);
    const pumpDump  = detectPumpDump(bars);

    return {
        priceZScore:             spike.zScore,
        volumeZScore:            volume.zScore,
        priceChangePercent:      spike.changePercent,
        volumeRatioToAvg:        volume.ratioToAvg,
        isPriceSpike:            spike.detected,
        isVolumeAnomaly:         volume.detected,
        isPriceVolumeDivergence: diverge.detected,
        isPumpDump:              pumpDump.detected,
        latestBar:               bars[bars.length - 1] ?? null,
        historyLength:           bars.length,
    };
}

/** Returns true if any anomaly signal is raised – used for early-exit logic */
export function hasAnySignal(signals: StatisticalSignals): boolean {
    return (
        signals.isPriceSpike            ||
        signals.isVolumeAnomaly         ||
        signals.isPriceVolumeDivergence ||
        signals.isPumpDump
    );
}
