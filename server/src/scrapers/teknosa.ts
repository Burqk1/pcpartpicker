import { BaseScraper } from './base.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { findBestMatch } from '../services/productMatcher.js';
import { getBrowser } from '../services/browserManager.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';

interface TeknosResult {
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

export class TeknosaScraper extends BaseScraper {
  storeId = 'teknosa';
  storeName = 'Teknosa';
  baseUrl = 'https://www.teknosa.com';

  protected buildSearchUrl(query: string): string {
    return `${this.baseUrl}/arama/?s=${encodeURIComponent(query)}`;
  }

  async search(query: SearchQuery): Promise<ScrapedPrice[]> {
    await rateLimiter.waitForSlot('teknosa.com');

    const searchUrl = this.buildSearchUrl(query.model);
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});

      await new Promise(r => setTimeout(r, 5000));

      const baseUrl = this.baseUrl;
      const category = query.category || '';
      const results = await page.evaluate((base: string, cat: string) => {
        const items: TeknosResult[] = [];

        // Map our categories to Teknosa's categories for filtering
        const componentCategories = ['gpu', 'cpu', 'motherboard', 'ram', 'storage', 'psu', 'cooler'];
        const isComponentSearch = componentCategories.includes(cat);

        document.querySelectorAll('#product-item').forEach(el => {
          const name = el.getAttribute('data-product-name') || '';
          const priceData = el.getAttribute('data-product-price') || '';
          const prodCategory = el.getAttribute('data-product-category') || '';

          // Skip laptops/systems when searching for components
          if (isComponentSearch) {
            const lowerCat = prodCategory.toLowerCase();
            if (lowerCat.includes('laptop') || lowerCat.includes('tablet') ||
                lowerCat.includes('masaüstü') || lowerCat.includes('bilgisayar & tablet')) {
              return;
            }
          }

          // Get link from first anchor
          const linkEl = el.querySelector('a[href]');
          const href = linkEl?.getAttribute('href') || '';

          // Price from data-product-price attribute (in TL, e.g. "27964.5")
          const price = parseFloat(priceData) || 0;

          if (name && price > 0) {
            items.push({
              title: name,
              price,
              url: href.startsWith('http') ? href : `${base}${href}`,
              inStock: true,
            });
          }
        });

        return items.slice(0, 15);
      }, baseUrl, category);

      const best = findBestMatch(results, query);
      if (best && best.price > 0) {
        return [this.createPrice(best.price, best.url, best.inStock)];
      }

      return [];
    } catch (error) {
      console.error(`[Teknosa] Scrape failed:`, error);
      return [];
    } finally {
      await page.close();
    }
  }
}
