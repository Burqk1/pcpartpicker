import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../config.js';
import type { CacheEntry, ScrapedPrice, SearchQuery } from '../types/index.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry>();
  private cacheDir: string;
  private ttlMs: number;

  constructor() {
    this.cacheDir = path.resolve(CONFIG.cacheDir);
    this.ttlMs = CONFIG.cacheTtlMs;
  }

  private getCacheKey(query: SearchQuery, storeId: string): string {
    return `${slugify(query.brand)}_${slugify(query.model)}_${storeId}`;
  }

  get(query: SearchQuery, storeId: string): { prices: ScrapedPrice[]; isExpired: boolean } | null {
    const key = this.getCacheKey(query, storeId);
    const entry = this.memoryCache.get(key);

    if (!entry) return null;

    const isExpired = new Date(entry.expiresAt).getTime() < Date.now();
    return {
      prices: entry.prices.map(p => ({ ...p, dataSource: isExpired ? 'cache' as const : p.dataSource })),
      isExpired,
    };
  }

  set(query: SearchQuery, storeId: string, prices: ScrapedPrice[]): void {
    const key = this.getCacheKey(query, storeId);
    const now = new Date();
    const entry: CacheEntry = {
      key,
      prices,
      fetchedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + this.ttlMs).toISOString(),
    };

    this.memoryCache.set(key, entry);
    // Persist async (fire-and-forget)
    this.persistEntry(key, entry).catch(() => {});
  }

  private async persistEntry(key: string, entry: CacheEntry): Promise<void> {
    await fs.mkdir(this.cacheDir, { recursive: true });
    const filePath = path.join(this.cacheDir, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
  }

  async rehydrate(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      const files = await fs.readdir(this.cacheDir);
      let loaded = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        try {
          const content = await fs.readFile(path.join(this.cacheDir, file), 'utf-8');
          const entry: CacheEntry = JSON.parse(content);
          this.memoryCache.set(entry.key, entry);
          loaded++;
        } catch {
          // Skip corrupted files
        }
      }

      if (loaded > 0) {
        console.log(`[Cache] Loaded ${loaded} entries from disk`);
      }
    } catch {
      // Cache dir doesn't exist yet, that's fine
    }
  }

  clear(): void {
    this.memoryCache.clear();
  }

  get size(): number {
    return this.memoryCache.size;
  }
}

export const cacheManager = new CacheManager();
