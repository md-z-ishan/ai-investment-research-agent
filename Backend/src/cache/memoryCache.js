/**
 * In-Memory LRU Cache with 24-hour TTL (Time to Live)
 */
class MemoryCache {
  constructor(maxSize = 100, ttlMs = 24 * 60 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /**
   * Retrieves an item from the cache.
   * If the item has expired, it is removed and null is returned.
   */
  get(key) {
    if (!key) return null;
    const normalizedKey = key.trim().toLowerCase();
    
    if (!this.cache.has(normalizedKey)) {
      return null;
    }

    const entry = this.cache.get(normalizedKey);
    const now = Date.now();

    // Check expiration
    if (now - entry.timestamp > this.ttlMs) {
      this.cache.delete(normalizedKey);
      return null;
    }

    // Refresh access order (LRU behavior)
    this.cache.delete(normalizedKey);
    this.cache.set(normalizedKey, entry);

    return entry.value;
  }

  /**
   * Stores an item in the cache.
   * Evicts the oldest items if the max size is exceeded.
   */
  set(key, value) {
    if (!key) return;
    const normalizedKey = key.trim().toLowerCase();

    // Evict oldest item if cache size exceeds limit
    if (this.cache.size >= this.maxSize && !this.cache.has(normalizedKey)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(normalizedKey, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Clears all items in the cache.
   */
  clear() {
    this.cache.clear();
  }
}

module.exports = new MemoryCache();
