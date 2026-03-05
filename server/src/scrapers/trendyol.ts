import { BaseScraper } from './base.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { findBestMatch } from '../services/productMatcher.js';
import { getBrowser } from '../services/browserManager.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';

interface TrendyolResult {
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

export class TrendyolScraper extends BaseScraper {
  storeId = 'trendyol';
  storeName = 'Trendyol';
  baseUrl = 'https://www.trendyol.com';

  protected buildSearchUrl(query: string): string {
    return `${this.baseUrl}/sr?q=${encodeURIComponent(query)}`;
  }

  async search(query: SearchQuery): Promise<ScrapedPrice[]> {
    await rateLimiter.waitForSlot('trendyol.com');

    const searchUrl = this.buildSearchUrl(query.model);
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});

      await page.waitForSelector('a.product-card', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 2000));

      const baseUrl = this.baseUrl;
      const results = await page.evaluate((base: string) => {
        const items: TrendyolResult[] = [];
        document.querySelectorAll('a.product-card').forEach(card => {
          const brandEl = card.querySelector('span.product-brand');
          const nameEl = card.querySelector('span.product-name');
          const brand = brandEl?.textContent?.trim() || '';
          const name = nameEl?.textContent?.trim() || '';
          const title = brand ? `${brand} ${name}` : name;

          // Price from specific elements first, then fallback to regex
          const priceValueEl = card.querySelector('span.price-value');
          const discountedEl = card.querySelector('div.discounted-price');
          let price = 0;

          const priceText = priceValueEl?.textContent?.trim() || discountedEl?.textContent?.trim() || '';
          if (priceText) {
            const cleaned = priceText.replace(/[^0-9.,]/g, '').trim();
            price = parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
          }

          // Fallback: regex from card text
          if (price === 0) {
            const allText = card.textContent || '';
            const priceMatches = allText.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/g);
            if (priceMatches) {
              for (const m of priceMatches) {
                const extracted = m.replace(/\s*TL/, '').trim();
                const parsed = parseFloat(extracted.replace(/\./g, '').replace(',', '.')) || 0;
                if (parsed > 100) price = parsed;
              }
            }
          }

          const href = card.getAttribute('href') || '';

          if (title && price > 0) {
            items.push({
              title,
              price,
              url: href.startsWith('http') ? href : `${base}${href}`,
              inStock: true,
            });
          }
        });
        return items.slice(0, 15);
      }, baseUrl);

      const best = findBestMatch(results, query);
      if (best && best.price > 0) {
        return [this.createPrice(best.price, best.url, best.inStock)];
      }

      return [];
    } catch (error) {
      console.error(`[Trendyol] Scrape failed:`, error);
      return [];
    } finally {
      await page.close();
    }
  }
}
