/**
 * Simple in-memory cache for API responses
 * Provides request deduplication and stale-while-revalidate
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  promise?: Promise<T>
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes
  private readonly staleTTL = 10 * 60 * 1000 // 10 minutes

  /**
   * Get cached data or fetch if not cached/stale
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const entry = this.cache.get(key)
    const now = Date.now()

    // Return cached data if fresh
    if (entry && (now - entry.timestamp) < ttl) {
      return entry.data
    }

    // Return stale data immediately if available (stale-while-revalidate)
    if (entry && (now - entry.timestamp) < this.staleTTL) {
      // Revalidate in background
      this.revalidate(key, fetcher, ttl).catch(() => {
        // Silently fail revalidation
      })
      return entry.data
    }

    // Check if there's already a pending request
    if (entry?.promise) {
      return entry.promise
    }

    // Fetch new data
    const promise = fetcher().then((data) => {
      this.cache.set(key, {
        data,
        timestamp: now,
      })
      return data
    })

    // Store promise for request deduplication
    this.cache.set(key, {
      data: entry?.data, // Keep stale data if available
      timestamp: entry?.timestamp || now,
      promise,
    })

    return promise
  }

  /**
   * Revalidate cache entry in background
   */
  private async revalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<void> {
    try {
      const data = await fetcher()
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      })
    } catch (error) {
      // Keep stale data on error
      console.warn('Cache revalidation failed:', error)
    }
  }

  /**
   * Set cache entry manually
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all entries matching pattern
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }
}

export const apiCache = new ApiCache()

