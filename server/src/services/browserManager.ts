import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Browser } from 'puppeteer';
import { CONFIG } from '../config.js';
import { getRandomUserAgent } from '../utils/httpClient.js';

puppeteer.use(StealthPlugin());

let browserInstance: Browser | null = null;
let launchPromise: Promise<Browser> | null = null;

export async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  // Prevent multiple simultaneous launches (race condition)
  if (launchPromise) {
    return launchPromise;
  }

  launchPromise = (async () => {
    console.log('[Browser] Launching new Puppeteer instance...');
    browserInstance = await puppeteer.launch({
      headless: true,
      args: CONFIG.puppeteer.args,
    });

    // Set default user agent for all new pages
    browserInstance.on('targetcreated', async (target) => {
      const page = await target.page();
      if (page) {
        await page.setUserAgent(getRandomUserAgent());
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        });
      }
    });

    launchPromise = null;
    return browserInstance;
  })();

  return launchPromise;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    console.log('[Browser] Closed');
  }
}

// Cleanup on process exit
process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit(0);
});
