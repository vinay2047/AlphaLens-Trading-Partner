const REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type RedisResponse<T> = {
    result?: T;
    error?: string;
};

function isRedisConfigured() {
    return Boolean(REDIS_REST_URL && REDIS_REST_TOKEN);
}

async function runRedisCommand<T>(command: (string | number)[]): Promise<T | null> {
    if (!isRedisConfigured()) {
        return null;
    }

    try {
        const response = await fetch(REDIS_REST_URL!, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${REDIS_REST_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(command),
            cache: 'no-store',
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error(`Redis command failed (${command[0]}): ${response.status} ${text}`);
            return null;
        }

        const payload = (await response.json()) as RedisResponse<T>;
        if (payload.error) {
            console.error(`Redis command error (${command[0]}):`, payload.error);
            return null;
        }

        return payload.result ?? null;
    } catch (error) {
        console.error(`Redis request failed (${command[0]}):`, error);
        return null;
    }
}

export async function getCacheJson<T>(key: string): Promise<T | null> {
    const value = await runRedisCommand<string>(['GET', key]);
    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value) as T;
    } catch (error) {
        console.error(`Failed to parse cached JSON for key ${key}:`, error);
        return null;
    }
}

export async function setCacheJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await runRedisCommand(['SETEX', key, ttlSeconds, JSON.stringify(value)]);
}

export async function deleteCacheKeys(keys: string[]): Promise<void> {
    if (keys.length === 0) {
        return;
    }

    await runRedisCommand(['DEL', ...keys]);
}

export function cacheEnabled() {
    return isRedisConfigured();
}
