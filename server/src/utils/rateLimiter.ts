import { CONFIG } from '../config.js';

class RateLimiter {
  private lastRequestTime = new Map<string, number>();
  private minInterval = CONFIG.rateLimitIntervalMs;

  async waitForSlot(domain: string): Promise<void> {
    const last = this.lastRequestTime.get(domain) || 0;
    const elapsed = Date.now() - last;

    if (elapsed < this.minInterval) {
      const jitter = Math.random() * 500;
      const waitTime = this.minInterval - elapsed + jitter;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime.set(domain, Date.now());
  }
}

export const rateLimiter = new RateLimiter();
