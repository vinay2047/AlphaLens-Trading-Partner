import { NextRequest, NextResponse } from 'next/server';

const SENTIMENT_SERVICE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://alpha-lens-3464.onrender.com';

const CACHE_SECONDS = 300; // 5-minute cache per ticker

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ ticker: string }> },
) {
    const { ticker } = await params;

    if (!ticker || ticker.length > 10) {
        return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
    }

    const upstream = `${SENTIMENT_SERVICE_URL}/api/sentiment/${encodeURIComponent(ticker.toUpperCase())}`;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8_000);

        let res: Response;
        try {
            res = await fetch(upstream, {
                signal: controller.signal,
                next: { revalidate: CACHE_SECONDS },
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.error(`[sentiment-proxy] upstream ${res.status}: ${text}`);
            return NextResponse.json(
                { error: 'Sentiment service error', detail: text },
                { status: res.status },
            );
        }

        const data = await res.json();

        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=60`,
            },
        });
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            return NextResponse.json({ error: 'Sentiment service timed out' }, { status: 504 });
        }
        console.error('[sentiment-proxy] unexpected error', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
