import type { Product, PartCategory, CompletedBuild, BuildGuide, Store, StorePrice } from '@/types';
import { cpus } from '@/data/cpus';
import { gpus } from '@/data/gpus';
import { motherboards } from '@/data/motherboards';
import { ram } from '@/data/ram';
import { storage } from '@/data/storage';
import { psus } from '@/data/psus';
import { cases } from '@/data/cases';
import { coolers } from '@/data/coolers';
import { builds } from '@/data/builds';
import { guides } from '@/data/guides';
import { stores } from '@/data/stores';

const SIMULATED_DELAY = 150;

function delay(ms: number = SIMULATED_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const allProducts: Product[] = [
  ...cpus,
  ...gpus,
  ...motherboards,
  ...ram,
  ...storage,
  ...psus,
  ...cases,
  ...coolers,
];

const categoryProductMap: Partial<Record<PartCategory, Product[]>> = {
  'cpu': cpus,
  'gpu': gpus,
  'motherboard': motherboards,
  'ram': ram,
  'storage': storage,
  'psu': psus,
  'case': cases,
  'cpu-cooler': coolers,
};

export async function getProducts(category: PartCategory): Promise<Product[]> {
  await delay();
  return categoryProductMap[category] ?? [];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay();
  return allProducts.find((p) => p.id === id);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  await delay();
  return allProducts.filter((p) => ids.includes(p.id));
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay();
  const lowerQuery = query.toLowerCase();
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.model.toLowerCase().includes(lowerQuery)
  );
}

export async function getBuilds(): Promise<CompletedBuild[]> {
  await delay();
  return builds;
}

export async function getBuildById(id: string): Promise<CompletedBuild | undefined> {
  await delay();
  return builds.find((b) => b.id === id);
}

export async function getGuides(): Promise<BuildGuide[]> {
  await delay();
  return guides;
}

export async function getGuideById(id: string): Promise<BuildGuide | undefined> {
  await delay();
  return guides.find((g) => g.id === id);
}

export async function getStores(): Promise<Store[]> {
  await delay();
  return stores;
}

export async function getFeaturedBuilds(): Promise<CompletedBuild[]> {
  await delay();
  return builds.filter((b) => b.featured);
}

export async function getAllProducts(): Promise<Product[]> {
  await delay();
  return allProducts;
}

export async function getProductsByCategory(category: PartCategory): Promise<Product[]> {
  return getProducts(category);
}

// Live price fetching from backend scraping service
const API_BASE = '/api';

export async function getLivePrices(productId: string): Promise<StorePrice[]> {
  const res = await fetch(`${API_BASE}/prices/${productId}`);
  if (!res.ok) throw new Error('Fiyat bilgileri alınamadı');
  return res.json();
}
