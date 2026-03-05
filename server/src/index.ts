import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { pricesRouter } from './routes/prices.js';
import { productsRouter } from './routes/products.js';
import { cacheManager } from './services/cacheManager.js';

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

// Routes
app.use('/api/prices', pricesRouter);
app.use('/api/products', productsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(CONFIG.port, () => {
  console.log(`[Server] PCParçaSeçici API running on port ${CONFIG.port}`);
  cacheManager.rehydrate().then(() => {
    console.log('[Cache] Rehydrated from disk');
  }).catch(() => {
    console.log('[Cache] No cache to rehydrate');
  });
});
