import {
    QUOTE_CACHE_TTL_SECONDS,
    quoteCacheKey,
} from '@/lib/cache-keys';
import { getCacheJson, setCacheJson } from '@/lib/redis-cache';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE = process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

async function fetchQuote(symbol: string): Promise<number> {
    try {
        const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
            next: { revalidate: 30 },
        });
        const data = await res.json();
        const price = data?.c || 0;
        await setCacheJson(quoteCacheKey(symbol), price, QUOTE_CACHE_TTL_SECONDS);
        return price;
    } catch {
        return 0;
    }
}

export async function getStockPrice(symbol: string): Promise<number> {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedPrice = await getCacheJson<number>(quoteCacheKey(normalizedSymbol));
    if (cachedPrice !== null) {
        return cachedPrice;
    }

    return fetchQuote(normalizedSymbol);
}

export async function getStockPrices(symbols: string[]): Promise<Map<string, number>> {
    const uniqueSymbols = [...new Set(symbols.map((symbol) => symbol.toUpperCase()).filter(Boolean))];
    const prices = new Map<string, number>();

    if (uniqueSymbols.length === 0) {
        return prices;
    }

    const cacheResults = await Promise.all(
        uniqueSymbols.map(async (symbol) => ({
            symbol,
            price: await getCacheJson<number>(quoteCacheKey(symbol)),
        })),
    );

    const missingSymbols: string[] = [];

    for (const { symbol, price } of cacheResults) {
        if (price === null) {
            missingSymbols.push(symbol);
        } else {
            prices.set(symbol, price);
        }
    }

    if (missingSymbols.length > 0) {
        const fetchedPrices = await Promise.all(
            missingSymbols.map(async (symbol) => ({
                symbol,
                price: await fetchQuote(symbol),
            })),
        );

        for (const { symbol, price } of fetchedPrices) {
            prices.set(symbol, price);
        }
    }

    return prices;
}
