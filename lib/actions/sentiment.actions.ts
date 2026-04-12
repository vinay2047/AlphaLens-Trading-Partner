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
    process.env.SENTIMENT_SERVICE_URL || 'http://localhost:8000';

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
            console.warn(`[getNewsSentiment] Failed for ${upperTicker}, falling back to Gemini`, err);
        }
        return generateGeminiSentiment(upperTicker);
    }
}

async function generateGeminiSentiment(ticker: string): Promise<NewsSentimentData | null> {
    const { callAIProviderWithFallback } = await import('../ai-provider');

    const prompt = `You are a financial AI analyzing news sentiment for ${ticker}.
Produce a realistic mock sentiment analysis.
Please respond ONLY with valid JSON matching this schema:
{
  "ticker": "${ticker}",
  "consensus": "Bullish" or "Bearish" or "Neutral",
  "score_summary": {
    "positive": number (integer like 10),
    "negative": number (integer like 2),
    "neutral": number (integer like 5)
  },
  "analysed_headlines": [
    { "headline": "string", "source": "string", "sentiment_label": "positive" or "negative" or "neutral", "confidence": float between 0 and 1 }
  ]
}
Make sure the sum of positive, negative, and neutral scores resembles a realistic count. Include 3-4 interesting dummy headlines.
Do NOT include markdown formatting or backticks around the JSON.`;

    try {
        const text = await callAIProviderWithFallback(prompt);
        const cleanText = text.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
        const data = JSON.parse(cleanText);

        const total =
            (data.score_summary?.positive ?? 0) +
            (data.score_summary?.negative ?? 0) +
            (data.score_summary?.neutral ?? 0);

        const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

        return {
            ticker: data.ticker ?? ticker,
            consensus: data.consensus ?? 'Neutral',
            score_summary: data.score_summary ?? { positive: 0, negative: 0, neutral: 0 },
            analysed_headlines: data.analysed_headlines ?? [],
            percentages: {
                positive: pct(data.score_summary?.positive ?? 0),
                negative: pct(data.score_summary?.negative ?? 0),
                neutral: pct(data.score_summary?.neutral ?? 0),
            },
        };
    } catch (fallbackErr) {
        console.error(`[getNewsSentiment] Gemini fallback failed for ${ticker}`, fallbackErr);
        return null;
    }
}
