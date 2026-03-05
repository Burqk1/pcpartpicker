import type { BaseScraper } from '../scrapers/base.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';
import { cacheManager } from './cacheManager.js';
import { VatanScraper } from '../scrapers/vatan.js';
import { N11Scraper } from '../scrapers/n11.js';
import { TeknosaScraper } from '../scrapers/teknosa.js';
import { AmazonTrScraper } from '../scrapers/amazon-tr.js';
import { HepsiburadaScraper } from '../scrapers/hepsiburada.js';
import { TrendyolScraper } from '../scrapers/trendyol.js';
import { CONFIG } from '../config.js';

class ScrapeOrchestrator {
  private scrapers: BaseScraper[] = [];

  constructor() {
    // Initialize enabled scrapers
    if (CONFIG.stores.vatan.enabled) this.scrapers.push(new VatanScraper());
    if (CONFIG.stores.n11.enabled) this.scrapers.push(new N11Scraper());
    if (CONFIG.stores.teknosa.enabled) this.scrapers.push(new TeknosaScraper());
    if (CONFIG.stores.amazonTr.enabled) this.scrapers.push(new AmazonTrScraper());
    if (CONFIG.stores.hepsiburada.enabled) this.scrapers.push(new HepsiburadaScraper());
    if (CONFIG.stores.trendyol.enabled) this.scrapers.push(new TrendyolScraper());

    console.log(`[Orchestrator] Initialized with ${this.scrapers.length} scrapers`);
  }

  async fetchPrices(query: SearchQuery): Promise<ScrapedPrice[]> {
    const results = await Promise.allSettled(
      this.scrapers.map(scraper => this.fetchFromScraper(scraper, query))
    );

    const allPrices: ScrapedPrice[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allPrices.push(...result.value);
      }
    }

    // Sort by total price (price + shipping)
    allPrices.sort((a, b) => (a.price + a.shippingCost) - (b.price + b.shippingCost));

    return allPrices;
  }

  private async fetchFromScraper(
    scraper: BaseScraper,
    query: SearchQuery
  ): Promise<ScrapedPrice[]> {
    // 1. Check cache
    const cached = cacheManager.get(query, scraper.storeId);
    if (cached && !cached.isExpired) {
      console.log(`[Orchestrator] Cache hit for ${scraper.storeName} - ${query.model}`);
      return cached.prices;
    }

    // 2. Try live scrape
    try {
      console.log(`[Orchestrator] Scraping ${scraper.storeName} for: ${query.model}`);
      const prices = await scraper.search(query);

      if (prices.length > 0) {
        cacheManager.set(query, scraper.storeId, prices);
        return prices;
      }
    } catch (error) {
      console.error(`[Orchestrator] ${scraper.storeName} failed:`, error);
    }

    // 3. Return stale cache if available
    if (cached) {
      console.log(`[Orchestrator] Using stale cache for ${scraper.storeName} - ${query.model}`);
      return cached.prices.map(p => ({ ...p, dataSource: 'cache' as const }));
    }

    // 4. No data available
    return [];
  }
}

export const scrapeOrchestrator = new ScrapeOrchestrator();
