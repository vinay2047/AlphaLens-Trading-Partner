export const QUOTE_CACHE_TTL_SECONDS = 20;
export const PORTFOLIO_CACHE_TTL_SECONDS = 30;
export const TRANSACTIONS_CACHE_TTL_SECONDS = 30;
export const LEADERBOARD_CACHE_TTL_SECONDS = 30;

export function quoteCacheKey(symbol: string) {
    return `quote:${symbol.toUpperCase()}`;
}

export function portfolioCacheKey(userId: string) {
    return `portfolio:${userId}`;
}

export function transactionsCacheKey(userId: string) {
    return `transactions:${userId}`;
}

export function leaderboardCacheKey() {
    return 'leaderboard:global';
}
