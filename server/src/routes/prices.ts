import { Router } from 'express';
import { productCatalog } from './products.js';
import { scrapeOrchestrator } from '../services/scrapeOrchestrator.js';
import type { SearchQuery } from '../types/index.js';

const router = Router();

// GET /api/prices/:productId - Fetch live prices for a product
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  const product = productCatalog.find(p => p.id === productId);
  if (!product) {
    res.status(404).json({ error: 'Ürün bulunamadı' });
    return;
  }

  const query: SearchQuery = {
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    model: product.model,
    category: product.category,
  };

  try {
    console.log(`[Prices] Fetching prices for: ${product.name}`);
    const prices = await scrapeOrchestrator.fetchPrices(query);
    console.log(`[Prices] Found ${prices.length} prices for: ${product.name}`);
    res.json(prices);
  } catch (error) {
    console.error(`[Prices] Error fetching prices for ${product.name}:`, error);
    res.status(500).json({ error: 'Fiyat bilgileri alınamadı' });
  }
});

// GET /api/prices/search?q=AMD+Ryzen+5+5600X&brand=AMD&model=Ryzen+5+5600X&category=cpu
router.get('/search', async (req, res) => {
  const { q, brand, model, category } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'Arama sorgusu (q) gerekli' });
    return;
  }

  const query: SearchQuery = {
    productId: 'search',
    productName: q,
    brand: (brand as string) || '',
    model: (model as string) || q,
    category: (category as string) || '',
  };

  try {
    const prices = await scrapeOrchestrator.fetchPrices(query);
    res.json(prices);
  } catch (error) {
    console.error(`[Prices] Search error for "${q}":`, error);
    res.status(500).json({ error: 'Arama başarısız' });
  }
});

export { router as pricesRouter };
