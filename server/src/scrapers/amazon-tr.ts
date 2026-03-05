import { BaseScraper } from './base.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { findBestMatch } from '../services/productMatcher.js';
import { getBrowser } from '../services/browserManager.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';

interface AmazonResult {
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

export class AmazonTrScraper extends BaseScraper {
  storeId = 'amazon-tr';
  storeName = 'Amazon TR';
  baseUrl = 'https://www.amazon.com.tr';

  protected buildSearchUrl(query: string): string {
    return `${this.baseUrl}/s?k=${encodeURIComponent(query)}`;
  }

  async search(query: SearchQuery): Promise<ScrapedPrice[]> {
    await rateLimiter.waitForSlot('amazon.com.tr');

    const searchUrl = this.buildSearchUrl(query.model);
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});

      await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

      const baseUrl = this.baseUrl;
      const results = await page.evaluate((base: string) => {
        const items: AmazonResult[] = [];
        document.querySelectorAll('[data-component-type="s-search-result"]').forEach(card => {
          const h2 = card.querySelector('h2');
          const titleSpan = h2?.querySelector('a span') || h2?.querySelector('span');
          const title = titleSpan?.textContent?.trim() || '';

          // Get price from .a-offscreen inside .a-price
          let priceText = '';
          const priceTags = card.querySelectorAll('.a-price .a-offscreen');
          priceTags.forEach(p => {
            if (!priceText) priceText = p.textContent?.trim() || '';
          });

          // Get link from h2 > a or data-asin
          const linkEl = h2?.querySelector('a') || card.querySelector('a.a-link-normal[href*="/dp/"]');
          let href = linkEl?.getAttribute('href') || '';
          if (!href) {
            const asin = card.getAttribute('data-asin');
            if (asin) href = `/dp/${asin}`;
          }

          if (title && priceText) {
            const price = parseFloat(
              priceText.replace(/[₺TL\s]/gi, '').replace(/\./g, '').replace(',', '.')
            ) || 0;
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
      console.error(`[Amazon TR] Scrape failed:`, error);
      return [];
    } finally {
      await page.close();
    }
  }
}
