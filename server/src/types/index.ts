export interface ScrapedPrice {
  storeId: string;
  storeName: string;
  price: number;
  url: string;
  inStock: boolean;
  shippingCost: number;
  dataSource: 'live' | 'cache' | 'mock';
  scrapedAt: string;
}

export interface ScrapeResult {
  success: boolean;
  storeId: string;
  prices: ScrapedPrice[];
  error?: string;
}

export interface CacheEntry {
  key: string;
  prices: ScrapedPrice[];
  fetchedAt: string;
  expiresAt: string;
}

export interface SearchQuery {
  productId: string;
  productName: string;
  brand: string;
  model: string;
  category: string;
}

export interface StoreConfig {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
  type: 'cheerio' | 'puppeteer';
}
