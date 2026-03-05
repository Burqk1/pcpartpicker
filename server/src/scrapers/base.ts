import type { ScrapedPrice, SearchQuery } from '../types/index.js';

export abstract class BaseScraper {
  abstract storeId: string;
  abstract storeName: string;
  abstract baseUrl: string;

  abstract search(query: SearchQuery): Promise<ScrapedPrice[]>;

  protected buildSearchUrl(searchTerm: string): string {
    return `${this.baseUrl}/search?q=${encodeURIComponent(searchTerm)}`;
  }

  /**
   * Parse Turkish price formats:
   * "3.299,00 TL" → 3299.00
   * "3.299 TL" → 3299
   * "3299" → 3299
   * "₺3.299,90" → 3299.90
   */
  protected parsePrice(priceText: string): number {
    if (!priceText) return 0;
    // Remove currency symbols and whitespace
    let cleaned = priceText.replace(/[₺TL\s]/gi, '').trim();
    // Handle Turkish number format: 3.299,00
    // Remove thousand separators (dots)
    cleaned = cleaned.replace(/\./g, '');
    // Replace decimal comma with dot
    cleaned = cleaned.replace(',', '.');
    const price = parseFloat(cleaned);
    return isNaN(price) ? 0 : price;
  }

  protected createPrice(
    price: number,
    url: string,
    inStock: boolean,
    shippingCost = 0
  ): ScrapedPrice {
    return {
      storeId: this.storeId,
      storeName: this.storeName,
      price,
      url,
      inStock,
      shippingCost,
      dataSource: 'live',
      scrapedAt: new Date().toISOString(),
    };
  }
}
