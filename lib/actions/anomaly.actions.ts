'use server';

/**
 * anomaly.actions.ts
 *
 * Server action that orchestrates the full anomaly detection pipeline:
 *  1. Fetch 90-day OHLCV candles from Finnhub (premium) OR quote fallback (free)
 *  2. Run statistical pre-filter (fast, no AI)
 *  3. If signals exist → call Gemini for contextual classification
 *  4. Return a strict AnomalyResult JSON
 *
 * Degrades gracefully when the Finnhub free plan blocks candle/sentiment endpoints.
 * Target latency: < 2 seconds end-to-end.
 */

import { getStockCandles, getSentimentScore, getQuote } from '@/lib/actions/finnhub.actions';
import { buildStatisticalSummary, hasAnySignal } from '@/lib/anomaly-engine';
import { callAIProviderWithFallback } from '@/lib/ai-provider';

// ── Helper: extract JSON from Gemini response ───────────────────────────────

function extractJSON(text: string): AnomalyResult | null {
    // Try strict parse first
    try {
        return JSON.parse(text.trim()) as AnomalyResult;
    } catch { /* fall through */ }

    // Extract from fenced code block or inline JSON object
    const match = text.match(/\{[\s\S]*"anomaly_detected"[\s\S]*\}/);
    if (match) {
        try {
            return JSON.parse(match[0]) as AnomalyResult;
        } catch { /* fall through */ }
    }

    return null;
}

// ── Fallback result when no anomaly is detected statistically ────────────────

function noAnomalyResult(): AnomalyResult {
    return {
        anomaly_detected: false,
        confidence_score: 5,
        anomaly_type: 'None',
        severity: 'low',
        reason: 'No unusual price or volume activity detected in the current period.',
        suggested_action: 'hold',
    };
}

// ── Fallback result on error ─────────────────────────────────────────────────

function errorResult(reason: string): AnomalyResult {
    return {
        anomaly_detected: false,
        confidence_score: 0,
        anomaly_type: 'Detection Error',
        severity: 'low',
        reason,
        suggested_action: 'hold',
    };
}

// ── Build Gemini prompt from statistical signals + market context ─────────────

function buildPrompt(
    symbol: string,
    signals: StatisticalSignals,
    sentiment: { buzz: number; bullishPercent: number } | null
): string {
    const { latestBar } = signals;
    const sentimentText = sentiment
        ? `News sentiment: buzz score ${(sentiment.buzz * 100).toFixed(0)}%, bullish ${(sentiment.bullishPercent * 100).toFixed(0)}% of articles.`
        : 'News sentiment data not available.';

    return `You are an expert quantitative analyst specializing in stock market anomaly detection.

You have been given the following statistical signals for the stock "${symbol}":

STATISTICAL ANALYSIS (last 90 days of daily OHLCV data):
- History length: ${signals.historyLength} bars
- Latest close price: ${latestBar ? `$${latestBar.c.toFixed(2)}` : 'N/A'}
- Latest volume: ${latestBar ? latestBar.v.toLocaleString() : 'N/A'}
- Price change (latest bar): ${signals.priceChangePercent.toFixed(2)}%
- Price Z-score vs 90-day history: ${signals.priceZScore.toFixed(2)}σ
- Volume Z-score vs history: ${signals.volumeZScore.toFixed(2)}σ
- Volume ratio vs 20-day avg: ${signals.volumeRatioToAvg.toFixed(2)}×

ANOMALY FLAGS:
- Price spike detected: ${signals.isPriceSpike}
- Volume anomaly detected: ${signals.isVolumeAnomaly}
- Price-volume divergence: ${signals.isPriceVolumeDivergence}
- Pump-and-dump pattern: ${signals.isPumpDump}

${sentimentText}

Based on these signals, classify this anomaly and return ONLY valid JSON in this exact format, with no additional text, no markdown, no explanation:

{
  "anomaly_detected": true,
  "confidence_score": <integer 0-100>,
  "anomaly_type": "<one of: High Risk Spike | Unusual Volume Activity | Possible Manipulation | Volatility Breakout | Price-Volume Divergence | Pump-and-Dump Pattern>",
  "severity": "<low | medium | high>",
  "reason": "<concise 1-2 sentence explanation referencing the actual numbers above>",
  "suggested_action": "<hold | caution | watch closely>"
}

Rules:
- confidence_score must reflect how many anomaly flags fired and the magnitude of z-scores
- severity "high" = 2+ flags OR z-score ≥ 3; "medium" = 1 flag with z-score 2-3; "low" = borderline
- reason must be specific and include the actual percentage and/or multiplier values
- Do NOT predict future prices. Focus only on describing what the data shows.
- Return ONLY the JSON object. No prose before or after.`;
}

// ── Main exported server action ──────────────────────────────────────────────

/**
 * Detect anomalies for a given stock symbol.
 * Returns an AnomalyResult with anomaly_detected, type, severity, reason, etc.
 * Degrades gracefully when premium Finnhub endpoints are unavailable (free plan).
 */
export async function detectStockAnomaly(symbol: string): Promise<AnomalyResult> {
    if (!symbol?.trim()) return errorResult('No symbol provided.');

    const upperSymbol = symbol.trim().toUpperCase();

    try {
        // ── Step 1: Fetch OHLCV data and sentiment in parallel ───────────────
        // getSentimentScore may 403 on free plans – always catches silently
        const [bars, sentiment] = await Promise.all([
            getStockCandles(upperSymbol, 90),
            getSentimentScore(upperSymbol).catch(() => null),
        ]);

        // ── Step 1b: Fallback to real-time quote when candle EP is blocked ────
        // Finnhub free plan blocks /stock/candle → fall back to /quote which is
        // always available and gives us the daily % move for a lightweight check.
        if (!bars || bars.length < 10) {
            const quote = await getQuote(upperSymbol);

            if (!quote || quote.c === undefined) {
                return errorResult(`No price data available for ${upperSymbol}.`);
            }

            // Fields: c=current, d=change, dp=change%, h=high, l=low, o=open, pc=prev close
            const changePercent: number = quote.dp ?? 0;
            const absChange = Math.abs(changePercent);

            // Apply simple thresholds on the daily move
            const isPriceSpike = absChange >= 5.0;
            const isMediumMove = absChange >= 3.0;

            if (!isPriceSpike && !isMediumMove) return noAnomalyResult();

            const direction = changePercent > 0 ? 'up' : 'down';
            const severity: AnomalyResult['severity'] = isPriceSpike ? 'high' : 'medium';

            const quotePrompt = `You are a quantitative risk analyst. A stock trading system has flagged ${upperSymbol} for unusual daily price movement.

REAL-TIME QUOTE DATA:
- Previous close: $${(quote.pc ?? 0).toFixed(2)}
- Current price: $${(quote.c ?? 0).toFixed(2)}
- Daily change: ${changePercent.toFixed(2)}% (${direction})
- Today's high: $${(quote.h ?? 0).toFixed(2)}
- Today's low: $${(quote.l ?? 0).toFixed(2)}
- Open: $${(quote.o ?? 0).toFixed(2)}

This ${changePercent.toFixed(2)}% single-day move is considered ${severity} severity.

Return ONLY valid JSON in this exact format with no additional text:
{
  "anomaly_detected": true,
  "confidence_score": <integer 40-85>,
  "anomaly_type": "<High Risk Spike | Volatility Breakout | Unusual Price Movement>",
  "severity": "${severity}",
  "reason": "<specific 1-sentence explanation using the actual numbers>",
  "suggested_action": "<hold | caution | watch closely>"
}`;

            try {
                const raw = await callAIProviderWithFallback(quotePrompt);
                const parsed = extractJSON(raw);
                if (parsed) return { ...parsed, anomaly_detected: true, severity };
            } catch { /* ignore AI errors – fall through to statistical result */ }

            // Statistical fallback if AI also fails
            return {
                anomaly_detected: true,
                confidence_score: isPriceSpike ? 70 : 50,
                anomaly_type: isPriceSpike ? 'High Risk Spike' : 'Volatility Breakout',
                severity,
                reason: `${upperSymbol} moved ${changePercent.toFixed(2)}% today (from $${(quote.pc ?? 0).toFixed(2)} to $${(quote.c ?? 0).toFixed(2)}), exceeding normal daily volatility thresholds.`,
                suggested_action: isPriceSpike ? 'watch closely' : 'caution',
            };
        }

        // ── Step 2: Statistical pre-filter (full 90-day candle path) ─────────
        const signals = buildStatisticalSummary(bars);

        if (!hasAnySignal(signals)) return noAnomalyResult();

        // ── Step 3: Call Gemini for contextual classification ────────────────
        const prompt = buildPrompt(upperSymbol, signals, sentiment);
        const rawResponse = await callAIProviderWithFallback(prompt);

        const parsed = extractJSON(rawResponse);
        if (!parsed) {
            const flagCount = [
                signals.isPriceSpike,
                signals.isVolumeAnomaly,
                signals.isPriceVolumeDivergence,
                signals.isPumpDump,
            ].filter(Boolean).length;

            return {
                anomaly_detected: true,
                confidence_score: Math.min(50 + flagCount * 10, 80),
                anomaly_type: signals.isPumpDump
                    ? 'Pump-and-Dump Pattern'
                    : signals.isPriceSpike
                        ? 'High Risk Spike'
                        : signals.isVolumeAnomaly
                            ? 'Unusual Volume Activity'
                            : 'Price-Volume Divergence',
                severity: flagCount >= 2 ? 'high' : 'medium',
                reason: `${flagCount} anomaly signal(s) detected: price Δ ${signals.priceChangePercent.toFixed(1)}%, volume ${signals.volumeRatioToAvg.toFixed(1)}× avg (z=${signals.volumeZScore.toFixed(1)}σ).`,
                suggested_action: flagCount >= 2 ? 'watch closely' : 'caution',
            };
        }

        return { ...parsed, anomaly_detected: true };

    } catch (err) {
        console.error('[detectStockAnomaly] Error:', err);
        return errorResult('Anomaly detection service encountered an error. Please try again.');
    }
}
