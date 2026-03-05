import { BaseScraper } from './base.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { findBestMatch } from '../services/productMatcher.js';
import { getBrowser } from '../services/browserManager.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';

interface HepsiburadaResult {
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

export class HepsiburadaScraper extends BaseScraper {
  storeId = 'hepsiburada';
  storeName = 'Hepsiburada';
  baseUrl = 'https://www.hepsiburada.com';

  protected buildSearchUrl(query: string): string {
    return `${this.baseUrl}/ara?q=${encodeURIComponent(query)}`;
  }

  async search(query: SearchQuery): Promise<ScrapedPrice[]> {
    await rateLimiter.waitForSlot('hepsiburada.com');

    const searchUrl = this.buildSearchUrl(query.model);
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});

      await page.waitForSelector('li[class*="productListContent"]', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 2000));

      const baseUrl = this.baseUrl;
      const results = await page.evaluate((base: string) => {
        const items: HepsiburadaResult[] = [];
        document.querySelectorAll('li[class*="productListContent"]').forEach(card => {
          const article = card.querySelector('article');
          if (!article) return;

          // Title from a[title] attribute (most reliable)
          const link = article.querySelector('a[title]') || article.querySelector('a[href*="/"]');
          const title = link?.getAttribute('title') || '';

          // Price: extract from card text using regex
          const allText = card.textContent || '';
          const priceMatch = allText.match(/(\d{1,3}(?:\.\d{3})*,\d{2})\s*TL/);
          let price = 0;
          if (priceMatch) {
            price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
          }

          // URL - get the best non-ad link
          let href = '';
          const allAnchors = article.querySelectorAll('a[href]');
          for (const a of allAnchors) {
            const h = a.getAttribute('href') || '';
            // Skip ad service links
            if (h.includes('adservice.') || h.includes('event/api')) continue;
            // Prefer product links starting with /
            if (h.startsWith('/') && !href) {
              href = h;
              break;
            }
            if (h.startsWith('http') && h.includes('hepsiburada.com') && !h.includes('adservice')) {
              href = h;
              break;
            }
          }
          // Fallback to the link element's href if no better found
          if (!href) {
            href = link?.getAttribute('href') || '';
          }

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
      console.error(`[Hepsiburada] Scrape failed:`, error);
      return [];
    } finally {
      await page.close();
    }
  }
}
