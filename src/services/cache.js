// Cache successful API reads for one minute. Keys are arrays describing a resource.
export const CACHE_TTL_MS = 60_000;
const entries = new Map();
const latestRequests = new Map();

export async function readCached(key, load, { signal, ttl = CACHE_TTL_MS } = {}) {
  if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
  const cacheKey = JSON.stringify(key);
  const cached = entries.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return structuredClone(cached.data);
  entries.delete(cacheKey);

  // A newer request or invalidation prevents an old response from filling the cache.
  const request = { key };
  latestRequests.set(cacheKey, request);
  try {
    const data = await load();
    if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
    if (latestRequests.get(cacheKey) === request) {
      entries.set(cacheKey, { key, data: structuredClone(data), expiresAt: Date.now() + ttl });
    }
    return data;
  } finally {
    if (latestRequests.get(cacheKey) === request) latestRequests.delete(cacheKey);
  }
}

export function invalidateCache(prefix = []) {
  for (const [cacheKey, entry] of entries) {
    if (prefix.every((part, index) => part === entry.key[index])) entries.delete(cacheKey);
  }
  for (const [cacheKey, request] of latestRequests) {
    if (prefix.every((part, index) => part === request.key[index])) latestRequests.delete(cacheKey);
  }
}
