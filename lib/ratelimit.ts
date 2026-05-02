type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const storeKey = "__rate_limit_store__";

const getStore = (): Map<string, RateLimitEntry> => {
  const globalStore = globalThis as unknown as { [key: string]: Map<string, RateLimitEntry> };
  if (!globalStore[storeKey]) {
    globalStore[storeKey] = new Map<string, RateLimitEntry>();
  }
  return globalStore[storeKey];
};

export const checkRateLimit = (key: string, windowMs: number, max: number) => {
  const store = getStore();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  store.set(key, entry);

  return { allowed: true, retryAfterMs: 0 };
};
