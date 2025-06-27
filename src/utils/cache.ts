/**
 * Simple in-memory cache to throttle identical prompts and responses
 * Helps reduce API calls for repeated vision analysis or RAG queries
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  constructor(private defaultTTL: number = 5000) {} // 5 seconds default

  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create shared cache instances for different types of data
export const visionCache = new SimpleCache<any>(10000); // 10 seconds for vision results
export const ragCache = new SimpleCache<any>(30000); // 30 seconds for RAG responses
export const embeddingCache = new SimpleCache<number[]>(300000); // 5 minutes for embeddings

// Utility function to create cache keys
export const createCacheKey = (...parts: (string | number)[]): string => {
  return parts.map(p => String(p)).join(':');
};