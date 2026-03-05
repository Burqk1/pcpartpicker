import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { fetchWithRetry } from '../utils/httpClient.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { findBestMatch } from '../services/productMatcher.js';
import type { ScrapedPrice, SearchQuery } from '../types/index.js';

interface VatanResult {
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

export class VatanScraper extends BaseScraper {
  storeId = 'vatan';
  storeName = 'Vatan Bilgisayar';
  baseUrl = 'https://www.vatanbilgisayar.com';

  protected buildSearchUrl(query: string): string {
    return `${this.baseUrl}/arama/${encodeURIComponent(query)}/`;
  }

  async search(query: SearchQuery): Promise<ScrapedPrice[]> {
    await rateLimiter.waitForSlot('vatanbilgisayar.com');

    const searchUrl = this.buildSearchUrl(query.model);
    let html: string;

    try {
      html = await fetchWithRetry(searchUrl);
    } catch (error) {
      console.error(`[Vatan] Failed to fetch: ${searchUrl}`, error);
      return [];
    }

    const $ = cheerio.load(html);
    const results: VatanResult[] = [];

    // Vatan product cards
    $('.product-list--list-page .product-list-link, .product-list-item').each((_i, el) => {
      const $el = $(el);
      const titleEl = $el.find('.product-list__product-name, .product-name, h3');
      const priceEl = $el.find('.product-list__price, .product-price, .price');
      const linkEl = $el.is('a') ? $el : $el.find('a').first();

      const title = titleEl.text().trim();
      const priceText = priceEl.text().trim();
      const href = linkEl.attr('href') || '';

      if (title && priceText) {
        const price = this.parsePrice(priceText);
        if (price > 0) {
          results.push({
            title,
            price,
            url: href.startsWith('http') ? href : `${this.baseUrl}${href}`,
            inStock: !$el.find('.out-of-stock, .tukendi').length,
          });
        }
      }
    });

    const best = findBestMatch(results, query);
    if (best) {
      return [this.createPrice(best.price, best.url, best.inStock)];
    }

    return [];
  }
}
