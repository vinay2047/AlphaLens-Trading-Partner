'use server';

export interface HeadlineResult {
    headline: string;
    source: string;
    sentiment_label: 'positive' | 'negative' | 'neutral';
    confidence: number;
}

export interface NewsSentimentData {
    ticker: string;
    consensus: 'Bullish' | 'Bearish' | 'Neutral';
    score_summary: {
        positive: number;
        negative: number;
        neutral: number;
    };
    analysed_headlines: HeadlineResult[];
    /** Percentage breakdown (0-100) */
    percentages: {
        positive: number;
        negative: number;
        neutral: number;
    };
}

/**
 * Calls the Python FastAPI sentiment service directly.
 * Direct server→service call avoids the self-HTTP anti-pattern and is much faster.
 */
const SENTIMENT_SERVICE_URL =
    process.env.SENTIMENT_SERVICE_URL || 'http://localhost:8003';

export async function getNewsSentiment(ticker: string): Promise<NewsSentimentData | null> {
    if (!ticker?.trim()) return null;

    const upperTicker = ticker.trim().toUpperCase();

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8_000);

        let res: Response;
        try {
            res = await fetch(
                `${SENTIMENT_SERVICE_URL}/api/sentiment/${encodeURIComponent(upperTicker)}`,
                {
                    signal: controller.signal,
                    // Cache per-ticker for 5 minutes
                    next: { revalidate: 300 },
                },
            );
        } finally {
            clearTimeout(timeout);
        }

        if (!res.ok) {
            console.warn(`[getNewsSentiment] Sentiment service returned ${res.status} for ${upperTicker}`);
            return null;
        }

        const data = await res.json();

        const total =
            (data.score_summary?.positive ?? 0) +
            (data.score_summary?.negative ?? 0) +
            (data.score_summary?.neutral ?? 0);

        const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

        return {
            ticker: data.ticker ?? upperTicker,
            consensus: data.consensus ?? 'Neutral',
            score_summary: data.score_summary ?? { positive: 0, negative: 0, neutral: 0 },
            analysed_headlines: data.analysed_headlines ?? [],
            percentages: {
                positive: pct(data.score_summary?.positive ?? 0),
                negative: pct(data.score_summary?.negative ?? 0),
                neutral: pct(data.score_summary?.neutral ?? 0),
            },
        };
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            console.warn(`[getNewsSentiment] Timed out fetching sentiment for ${upperTicker}`);
        } else {
            console.error(`[getNewsSentiment] Failed for ${upperTicker}`, err);
        }
        return null;
    }
}
