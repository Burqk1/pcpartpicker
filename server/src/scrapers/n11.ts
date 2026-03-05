import { BaseScraper } from './base.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { findBestMatch } from '../services/productMatcher.js';
import { getBrowser } from '../services/browserManager.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';

interface N11Result {
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

export class N11Scraper extends BaseScraper {
  storeId = 'n11';
  storeName = 'n11';
  baseUrl = 'https://www.n11.com';

  protected buildSearchUrl(query: string): string {
    return `${this.baseUrl}/arama?q=${encodeURIComponent(query)}`;
  }

  async search(query: SearchQuery): Promise<ScrapedPrice[]> {
    await rateLimiter.waitForSlot('n11.com');

    const searchUrl = this.buildSearchUrl(query.model);
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});

      await new Promise(r => setTimeout(r, 5000));
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 2000));

      const baseUrl = this.baseUrl;
      const results = await page.evaluate((base: string) => {
        const items: N11Result[] = [];

        // n11 uses product links with /urun/ pattern
        const allLinks = document.querySelectorAll('a[href*="/urun/"]');
        const seen = new Set<string>();

        allLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          if (seen.has(href)) return;
          seen.add(href);

          // Get the parent card container
          const card = link.closest('li, div') || link;

          // Title from link title attribute or text
          let title = link.getAttribute('title') || link.textContent?.trim() || '';
          // Clean up: remove "ÜCRETSİZ KARGO" and other prefixes
          title = title.replace(/ÜCRETSİZ\s*KARGO/gi, '').trim();

          // Price from card text
          const allText = card.textContent || '';
          const priceMatch = allText.match(/(\d{1,3}(?:\.\d{3})*,\d{2})\s*TL/);
          let price = 0;
          if (priceMatch) {
            price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
          }

          if (title.length > 10 && price > 0) {
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
      console.error(`[n11] Scrape failed:`, error);
      return [];
    } finally {
      await page.close();
    }
  }
}
