import type { SearchQuery } from '../types/index.js';

/**
 * Normalize text for matching: lowercase, strip special chars (™®©), collapse whitespace.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[™®©]/g, ' ')
    .replace(/[^a-z0-9çğıöşü\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Scores how well a search result title matches the intended product.
 * Returns a score 0-100; higher = better match.
 */
export function matchScore(resultTitle: string, query: SearchQuery): number {
  const title = normalize(resultTitle);
  const modelLower = normalize(query.model);
  const brandLower = normalize(query.brand);
  const nameLower = normalize(query.productName);
  let score = 0;

  // Exact model string in title: +40 points
  if (title.includes(modelLower)) {
    score += 40;

    // Penalize variant mismatches (e.g. "RTX 4060" matching "RTX 4060 Ti")
    const modelIdx = title.indexOf(modelLower);
    const afterModel = title.substring(modelIdx + modelLower.length).trim();
    const variantSuffixes = ['ti', 'super', 'xt', 'xtx', 'ultra'];
    for (const suffix of variantSuffixes) {
      if (afterModel.startsWith(suffix) && !modelLower.includes(suffix)) {
        score -= 35; // Heavy penalty - this is a different product
      }
    }
  }

  // Brand name in title: +15 points
  if (title.includes(brandLower)) {
    score += 15;
  }

  // Token overlap: check each word from the product name
  const nameTokens = nameLower.split(/\s+/).filter(t => t.length > 1);
  const matchedTokens = nameTokens.filter(token => title.includes(token));
  const tokenRatio = nameTokens.length > 0 ? matchedTokens.length / nameTokens.length : 0;
  score += Math.round(tokenRatio * 30); // up to +30 points

  // Penalize if title is way longer (likely a bundle or combo)
  const titleWords = title.split(/\s+/).length;
  const nameWords = nameLower.split(/\s+/).length;
  if (titleWords > nameWords * 3) {
    score -= 10;
  }

  // Penalize common false-positive keywords
  const falsePositives = ['set', 'bundle', 'paket', 'combo', 'kit', 'aksesuar', 'sticker', 'etiket', 'kilif', 'kılıf', 'charm', 'poster', 'figur', 'soket', 'connektor', 'connector', 'kablo', 'cable', 'adaptör', 'adapter', 'fan', 'bracket', 'backplate'];
  for (const fp of falsePositives) {
    if (title.includes(fp) && !nameLower.includes(fp)) {
      score -= 15;
    }
  }

  // Penalize full PC systems and laptops when searching for components
  const systemKeywords = ['masaustu', 'masaüstü', 'bilgisayar', 'desktop', 'oyuncu bilgisayar', 'hazir sistem', 'pc sistem', 'laptop', 'notebook', 'dizustu', 'dizüstü', 'monitor'];
  const categoryIsComponent = ['gpu', 'cpu', 'motherboard', 'ram', 'storage', 'psu', 'cooler', 'case'].includes(query.category || '');
  if (categoryIsComponent) {
    for (const kw of systemKeywords) {
      if (title.includes(kw) && !nameLower.includes(kw)) {
        score -= 30;
      }
    }

    // Detect full systems/laptops by presence of unrelated components in title
    // GPU search shouldn't match products with CPU specs (and vice versa)
    const category = query.category || '';
    if (category === 'gpu') {
      // If title has CPU identifiers, it's likely a laptop/system
      const hasCpu = /\bi[3579][\s-]\d{4,5}|\bryzen[\s-]*\d[\s-]*\d{3,4}|\bryzen\s+\d\b/i.test(title);
      const hasSsd = /\bssd\b/i.test(title) && !nameLower.includes('ssd');
      const hasRam = /\b\d+\s*gb\b.*\b\d+\s*gb\b/i.test(title); // Multiple GB specs = system
      if (hasCpu) {
        score -= 45; // Heavy penalty - CPU in GPU listing = system/laptop
      } else if (hasSsd && hasRam) {
        score -= 40;
      }
    }
    if (category === 'cpu') {
      // CPU search matching full systems with GPU specs
      const hasGpu = /\brtx\s*\d{4}|\bgtx\s*\d{4}|\brx\s*\d{4}/i.test(title) && !/\brtx|\bgtx|\brx/i.test(modelLower);
      if (hasGpu) {
        score -= 40;
      }
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Minimum score threshold for a result to be considered a match.
 */
export const MATCH_THRESHOLD = 45;

/**
 * Filter and sort results by match quality.
 * Returns the single best match (if above threshold).
 */
export function findBestMatch<T extends { title: string }>(
  results: T[],
  query: SearchQuery
): T | null {
  let best: T | null = null;
  let bestScore = 0;

  for (const result of results) {
    const score = matchScore(result.title, query);
    if (score >= MATCH_THRESHOLD && score > bestScore) {
      best = result;
      bestScore = score;
    }
  }

  return best;
}
