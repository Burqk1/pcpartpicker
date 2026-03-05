export const CONFIG = {
  port: Number(process.env.PORT) || 3001,
  cacheTtlMs: 30 * 60 * 1000, // 30 minutes
  cacheDir: './cache',
  requestTimeoutMs: 15_000,
  rateLimitIntervalMs: 2_000,
  maxRetries: 2,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  },
  stores: {
    vatan: { id: 'vatan', name: 'Vatan Bilgisayar', baseUrl: 'https://www.vatanbilgisayar.com', enabled: true, type: 'cheerio' as const },
    n11: { id: 'n11', name: 'n11', baseUrl: 'https://www.n11.com', enabled: true, type: 'cheerio' as const },
    teknosa: { id: 'teknosa', name: 'Teknosa', baseUrl: 'https://www.teknosa.com', enabled: true, type: 'cheerio' as const },
    amazonTr: { id: 'amazon-tr', name: 'Amazon TR', baseUrl: 'https://www.amazon.com.tr', enabled: true, type: 'puppeteer' as const },
    hepsiburada: { id: 'hepsiburada', name: 'Hepsiburada', baseUrl: 'https://www.hepsiburada.com', enabled: true, type: 'puppeteer' as const },
    trendyol: { id: 'trendyol', name: 'Trendyol', baseUrl: 'https://www.trendyol.com', enabled: true, type: 'puppeteer' as const },
  },
};
