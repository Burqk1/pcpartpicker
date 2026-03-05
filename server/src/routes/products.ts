import { Router } from 'express';

// Product catalog - we serve a static list that mirrors the frontend's mock data.
// In a production app this would come from a database.
// The backend imports are loaded lazily to avoid bundling frontend code.

const router = Router();

// Simple product catalog for the backend to know product names/brands for scraping
const productCatalog = [
  // CPUs - synced with frontend src/data/cpus.ts
  { id: 'cpu-1', name: 'AMD Ryzen 5 5600X', brand: 'AMD', model: 'Ryzen 5 5600X', category: 'cpu' },
  { id: 'cpu-2', name: 'AMD Ryzen 5 7600X', brand: 'AMD', model: 'Ryzen 5 7600X', category: 'cpu' },
  { id: 'cpu-3', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', model: 'Ryzen 7 7800X3D', category: 'cpu' },
  { id: 'cpu-4', name: 'AMD Ryzen 5 9600X', brand: 'AMD', model: 'Ryzen 5 9600X', category: 'cpu' },
  { id: 'cpu-5', name: 'AMD Ryzen 7 9700X', brand: 'AMD', model: 'Ryzen 7 9700X', category: 'cpu' },
  { id: 'cpu-6', name: 'AMD Ryzen 7 9800X3D', brand: 'AMD', model: 'Ryzen 7 9800X3D', category: 'cpu' },
  { id: 'cpu-7', name: 'AMD Ryzen 9 9900X', brand: 'AMD', model: 'Ryzen 9 9900X', category: 'cpu' },
  { id: 'cpu-8', name: 'Intel Core i5-13400F', brand: 'Intel', model: 'Core i5-13400F', category: 'cpu' },
  { id: 'cpu-9', name: 'Intel Core i5-14400F', brand: 'Intel', model: 'Core i5-14400F', category: 'cpu' },
  { id: 'cpu-10', name: 'Intel Core i5-14600K', brand: 'Intel', model: 'Core i5-14600K', category: 'cpu' },
  { id: 'cpu-11', name: 'Intel Core i7-13700K', brand: 'Intel', model: 'Core i7-13700K', category: 'cpu' },
  { id: 'cpu-12', name: 'Intel Core i7-14700K', brand: 'Intel', model: 'Core i7-14700K', category: 'cpu' },
  { id: 'cpu-13', name: 'Intel Core i9-14900K', brand: 'Intel', model: 'Core i9-14900K', category: 'cpu' },
  { id: 'cpu-14', name: 'Intel Core i5-12400F', brand: 'Intel', model: 'Core i5-12400F', category: 'cpu' },
  { id: 'cpu-15', name: 'AMD Ryzen 5 5500', brand: 'AMD', model: 'Ryzen 5 5500', category: 'cpu' },
  // GPUs - synced with frontend src/data/gpus.ts
  { id: 'gpu-1', name: 'MSI GeForce RTX 4060 VENTUS 2X BLACK 8G OC', brand: 'MSI', model: 'RTX 4060', category: 'gpu' },
  { id: 'gpu-2', name: 'ASUS DUAL GeForce RTX 4060 Ti OC 8GB', brand: 'ASUS', model: 'RTX 4060 Ti', category: 'gpu' },
  { id: 'gpu-3', name: 'Gigabyte GeForce RTX 4070 WINDFORCE OC 12G', brand: 'Gigabyte', model: 'RTX 4070', category: 'gpu' },
  { id: 'gpu-4', name: 'MSI GeForce RTX 4070 SUPER VENTUS 2X OC 12G', brand: 'MSI', model: 'RTX 4070 Super', category: 'gpu' },
  { id: 'gpu-5', name: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER OC 16GB', brand: 'ASUS', model: 'RTX 4070 Ti Super', category: 'gpu' },
  { id: 'gpu-6', name: 'Gigabyte GeForce RTX 4080 SUPER GAMING OC 16G', brand: 'Gigabyte', model: 'RTX 4080 Super', category: 'gpu' },
  { id: 'gpu-7', name: 'ASUS ROG STRIX GeForce RTX 4090 OC 24GB', brand: 'ASUS', model: 'RTX 4090', category: 'gpu' },
  { id: 'gpu-8', name: 'Sapphire PULSE AMD Radeon RX 7600 8GB', brand: 'Sapphire', model: 'RX 7600', category: 'gpu' },
  { id: 'gpu-9', name: 'Sapphire NITRO+ AMD Radeon RX 7700 XT 12GB', brand: 'Sapphire', model: 'RX 7700 XT', category: 'gpu' },
  { id: 'gpu-10', name: 'MSI Gaming Trio AMD Radeon RX 7800 XT 16GB', brand: 'MSI', model: 'RX 7800 XT', category: 'gpu' },
  { id: 'gpu-11', name: 'Sapphire NITRO+ AMD Radeon RX 7900 GRE 16GB', brand: 'Sapphire', model: 'RX 7900 GRE', category: 'gpu' },
  { id: 'gpu-12', name: 'ASUS TUF Gaming AMD Radeon RX 7900 XT OC 20GB', brand: 'ASUS', model: 'RX 7900 XT', category: 'gpu' },
  { id: 'gpu-13', name: 'Sapphire NITRO+ AMD Radeon RX 7900 XTX Vapor-X 24GB', brand: 'Sapphire', model: 'RX 7900 XTX', category: 'gpu' },
  { id: 'gpu-14', name: 'MSI GeForce RTX 5070 VENTUS 3X OC 12G', brand: 'MSI', model: 'RTX 5070', category: 'gpu' },
  { id: 'gpu-15', name: 'ASUS ROG STRIX GeForce RTX 5080 OC 16GB', brand: 'ASUS', model: 'RTX 5080', category: 'gpu' },
  // Motherboards - synced with frontend src/data/motherboards.ts
  { id: 'mb-1', name: 'MSI MAG B550 TOMAHAWK', brand: 'MSI', model: 'MAG B550 TOMAHAWK', category: 'motherboard' },
  { id: 'mb-2', name: 'Gigabyte B650 AORUS ELITE AX', brand: 'Gigabyte', model: 'B650 AORUS ELITE AX', category: 'motherboard' },
  { id: 'mb-3', name: 'ASUS ROG STRIX X670E-E GAMING WIFI', brand: 'ASUS', model: 'ROG STRIX X670E-E GAMING WIFI', category: 'motherboard' },
  { id: 'mb-4', name: 'MSI PRO B660M-A WIFI DDR4', brand: 'MSI', model: 'PRO B660M-A WIFI DDR4', category: 'motherboard' },
  { id: 'mb-5', name: 'Gigabyte B760 AORUS ELITE AX DDR5', brand: 'Gigabyte', model: 'B760 AORUS ELITE AX DDR5', category: 'motherboard' },
  { id: 'mb-6', name: 'ASUS PRIME Z690-P WIFI D4', brand: 'ASUS', model: 'PRIME Z690-P WIFI D4', category: 'motherboard' },
  { id: 'mb-7', name: 'MSI MAG Z790 TOMAHAWK WIFI DDR5', brand: 'MSI', model: 'MAG Z790 TOMAHAWK WIFI DDR5', category: 'motherboard' },
  { id: 'mb-8', name: 'ASUS ROG STRIX B650E-E GAMING WIFI', brand: 'ASUS', model: 'ROG STRIX B650E-E GAMING WIFI', category: 'motherboard' },
  { id: 'mb-9', name: 'Gigabyte B550M DS3H', brand: 'Gigabyte', model: 'B550M DS3H', category: 'motherboard' },
  { id: 'mb-10', name: 'MSI PRO B760M-P DDR4', brand: 'MSI', model: 'PRO B760M-P DDR4', category: 'motherboard' },
  { id: 'mb-11', name: 'ASUS PRIME Z790-P WIFI DDR5', brand: 'ASUS', model: 'PRIME Z790-P WIFI DDR5', category: 'motherboard' },
  { id: 'mb-12', name: 'MSI MAG B650M MORTAR WIFI', brand: 'MSI', model: 'MAG B650M MORTAR WIFI', category: 'motherboard' },
  // RAM - synced with frontend src/data/ram.ts
  { id: 'ram-1', name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', brand: 'Corsair', model: 'Vengeance LPX 16GB DDR4-3200', category: 'ram' },
  { id: 'ram-2', name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz', brand: 'G.Skill', model: 'Trident Z5 RGB 32GB DDR5-6000', category: 'ram' },
  { id: 'ram-3', name: 'Corsair Vengeance 32GB (2x16GB) DDR5 5600MHz', brand: 'Corsair', model: 'Vengeance 32GB DDR5-5600', category: 'ram' },
  { id: 'ram-4', name: 'Kingston FURY Beast 16GB (2x8GB) DDR4 3600MHz', brand: 'Kingston', model: 'FURY Beast 16GB DDR4-3600', category: 'ram' },
  { id: 'ram-5', name: 'G.Skill Trident Z Neo 32GB (2x16GB) DDR4 3600MHz', brand: 'G.Skill', model: 'Trident Z Neo 32GB DDR4-3600', category: 'ram' },
  { id: 'ram-6', name: 'Kingston FURY Beast 32GB (2x16GB) DDR5 5600MHz', brand: 'Kingston', model: 'FURY Beast 32GB DDR5-5600', category: 'ram' },
  { id: 'ram-7', name: 'Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5 6400MHz', brand: 'Corsair', model: 'Dominator Platinum RGB 32GB DDR5-6400', category: 'ram' },
  { id: 'ram-8', name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz', brand: 'Corsair', model: 'Vengeance LPX 32GB DDR4-3200', category: 'ram' },
  { id: 'ram-9', name: 'G.Skill Flare X5 32GB (2x16GB) DDR5 6000MHz', brand: 'G.Skill', model: 'Flare X5 32GB DDR5-6000', category: 'ram' },
  { id: 'ram-10', name: 'Kingston FURY Beast 16GB (2x8GB) DDR5 5600MHz', brand: 'Kingston', model: 'FURY Beast 16GB DDR5-5600', category: 'ram' },
  // Storage - synced with frontend src/data/storage.ts
  { id: 'storage-1', name: 'Samsung 980 PRO 1TB NVMe M.2 SSD', brand: 'Samsung', model: '980 PRO 1TB', category: 'storage' },
  { id: 'storage-2', name: 'Samsung 990 PRO 2TB NVMe M.2 SSD', brand: 'Samsung', model: '990 PRO 2TB', category: 'storage' },
  { id: 'storage-3', name: 'WD Black SN850X 1TB NVMe M.2 SSD', brand: 'Western Digital', model: 'SN850X 1TB', category: 'storage' },
  { id: 'storage-4', name: 'Kingston KC3000 1TB NVMe M.2 SSD', brand: 'Kingston', model: 'KC3000 1TB', category: 'storage' },
  { id: 'storage-5', name: 'Samsung 870 EVO 1TB SATA SSD', brand: 'Samsung', model: '870 EVO 1TB', category: 'storage' },
  { id: 'storage-6', name: 'Crucial MX500 1TB SATA SSD', brand: 'Crucial', model: 'MX500 1TB', category: 'storage' },
  { id: 'storage-7', name: 'Seagate Barracuda 2TB 7200RPM HDD', brand: 'Seagate', model: 'Barracuda 2TB', category: 'storage' },
  { id: 'storage-8', name: 'WD Blue 1TB 7200RPM HDD', brand: 'Western Digital', model: 'WD Blue 1TB', category: 'storage' },
  { id: 'storage-9', name: 'Samsung 990 PRO 1TB NVMe M.2 SSD', brand: 'Samsung', model: '990 PRO 1TB', category: 'storage' },
  { id: 'storage-10', name: 'Seagate Barracuda 4TB 5400RPM HDD', brand: 'Seagate', model: 'Barracuda 4TB', category: 'storage' },
  // PSUs - synced with frontend src/data/psus.ts
  { id: 'psu-1', name: 'Corsair RM650 650W 80+ Gold', brand: 'Corsair', model: 'RM650', category: 'psu' },
  { id: 'psu-2', name: 'Corsair RM850x 850W 80+ Gold', brand: 'Corsair', model: 'RM850x', category: 'psu' },
  { id: 'psu-3', name: 'Seasonic Focus GX-750 750W 80+ Gold', brand: 'Seasonic', model: 'Focus GX-750', category: 'psu' },
  { id: 'psu-4', name: 'be quiet! Straight Power 12 1000W 80+ Platinum', brand: 'be quiet!', model: 'Straight Power 12 1000W', category: 'psu' },
  { id: 'psu-5', name: 'Corsair RM550x 550W 80+ Gold', brand: 'Corsair', model: 'RM550x', category: 'psu' },
  { id: 'psu-6', name: 'Seasonic Prime TX-850 850W 80+ Titanium', brand: 'Seasonic', model: 'Prime TX-850', category: 'psu' },
  { id: 'psu-7', name: 'be quiet! Pure Power 12 M 750W 80+ Gold', brand: 'be quiet!', model: 'Pure Power 12 M 750W', category: 'psu' },
  { id: 'psu-8', name: 'EVGA SuperNOVA 850 G7 850W 80+ Gold', brand: 'EVGA', model: 'SuperNOVA 850 G7', category: 'psu' },
  // Cases - synced with frontend src/data/cases.ts
  { id: 'case-1', name: 'Corsair 4000D Airflow Mid-Tower', brand: 'Corsair', model: '4000D Airflow', category: 'case' },
  { id: 'case-2', name: 'NZXT H7 Flow Mid-Tower', brand: 'NZXT', model: 'H7 Flow', category: 'case' },
  { id: 'case-3', name: 'Fractal Design Meshify 2 Compact', brand: 'Fractal Design', model: 'Meshify 2 Compact', category: 'case' },
  { id: 'case-4', name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', model: 'O11 Dynamic EVO', category: 'case' },
  { id: 'case-5', name: 'be quiet! Pure Base 500DX', brand: 'be quiet!', model: 'Pure Base 500DX', category: 'case' },
  { id: 'case-6', name: 'Corsair 5000D Airflow Full Tower', brand: 'Corsair', model: '5000D Airflow', category: 'case' },
  { id: 'case-7', name: 'NZXT H510 Flow Compact Mid-Tower', brand: 'NZXT', model: 'H510 Flow', category: 'case' },
  { id: 'case-8', name: 'Fractal Design North Mesh Mid-Tower', brand: 'Fractal Design', model: 'North', category: 'case' },
  // Coolers - synced with frontend src/data/coolers.ts
  { id: 'cooler-1', name: 'Noctua NH-D15', brand: 'Noctua', model: 'NH-D15', category: 'cooler' },
  { id: 'cooler-2', name: 'be quiet! Dark Rock Pro 5', brand: 'be quiet!', model: 'Dark Rock Pro 5', category: 'cooler' },
  { id: 'cooler-3', name: 'Corsair iCUE H150i ELITE CAPELLIX XT 360mm', brand: 'Corsair', model: 'iCUE H150i ELITE CAPELLIX XT', category: 'cooler' },
  { id: 'cooler-4', name: 'Cooler Master Hyper 212 EVO V2', brand: 'Cooler Master', model: 'Hyper 212 EVO V2', category: 'cooler' },
  { id: 'cooler-5', name: 'Noctua NH-U12S Redux', brand: 'Noctua', model: 'NH-U12S Redux', category: 'cooler' },
  { id: 'cooler-6', name: 'Corsair iCUE H100i RGB ELITE 240mm', brand: 'Corsair', model: 'iCUE H100i RGB ELITE', category: 'cooler' },
  { id: 'cooler-7', name: 'be quiet! Dark Rock 4', brand: 'be quiet!', model: 'Dark Rock 4', category: 'cooler' },
  { id: 'cooler-8', name: 'Cooler Master MasterLiquid ML360L V2 ARGB 360mm', brand: 'Cooler Master', model: 'MasterLiquid ML360L V2 ARGB', category: 'cooler' },
];

router.get('/', (_req, res) => {
  res.json(productCatalog);
});

router.get('/:id', (req, res) => {
  const product = productCatalog.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Ürün bulunamadı' });
    return;
  }
  res.json(product);
});

router.get('/category/:category', (req, res) => {
  const products = productCatalog.filter(p => p.category === req.params.category);
  res.json(products);
});

export { router as productsRouter };
export { productCatalog };
