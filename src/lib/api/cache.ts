import { NextResponse } from "next/server";

type CacheStrategy = "no-store" | "private" | "public";

interface CacheOptions {
  strategy?: CacheStrategy;
  maxAge?: number; // seconds
  staleWhileRevalidate?: number; // seconds
}

/**
 * Add cache control headers to a NextResponse
 */
export function withCacheHeaders<T>(
  data: T,
  options: CacheOptions = {}
): NextResponse<T> {
  const {
    strategy = "private",
    maxAge = 60,
    staleWhileRevalidate = 120,
  } = options;

  let cacheControl: string;

  switch (strategy) {
    case "no-store":
      cacheControl = "no-store, no-cache, must-revalidate";
      break;
    case "public":
      cacheControl = `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
      break;
    case "private":
    default:
      cacheControl = `private, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
      break;
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}

/**
 * Common cache configurations
 */
export const cacheConfigs = {
  // No caching for sensitive data
  sensitive: { strategy: "no-store" as const },

  // Short cache for frequently changing data (1 minute)
  short: { strategy: "private" as const, maxAge: 60, staleWhileRevalidate: 120 },

  // Medium cache for moderately changing data (5 minutes)
  medium: { strategy: "private" as const, maxAge: 300, staleWhileRevalidate: 600 },

  // Long cache for rarely changing data (1 hour)
  long: { strategy: "private" as const, maxAge: 3600, staleWhileRevalidate: 7200 },

  // Public cache for static data (1 day)
  staticPublic: { strategy: "public" as const, maxAge: 86400, staleWhileRevalidate: 172800 },
};

/**
 * Simple in-memory cache for expensive computations
 */
class MemoryCache {
  private cache = new Map<string, { value: unknown; expiry: number }>();

  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  memoryCache.cleanup();
}, 5 * 60 * 1000);

/**
 * Cache wrapper for async functions
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = 60000
): Promise<T> {
  const cached = memoryCache.get<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  const result = await fn();
  memoryCache.set(key, result, ttlMs);
  return result;
}
