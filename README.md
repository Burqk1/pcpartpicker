# PCParçaSeçici

A PCPartPicker-style PC part picker and compatibility checker aimed at the Turkish market. You can pick parts to build a system list, see whether the parts are compatible with each other, and compare live prices scraped from Turkish e-commerce sites on product pages.

The project has two parts:

- **Frontend** (repo root): React 19, TypeScript, Vite 7 and Tailwind CSS 4
- **Price server** (`server/`): Express + TypeScript. Scrapes store sites with Cheerio and Puppeteer.

## Features

### System builder (`/liste`)
- Part picker dialog for CPU, motherboard, RAM, graphics card, storage, PSU, case and CPU cooler
- Total price and number of selected parts
- The list is stored in the browser (Zustand `persist`, key `pcparca-partlist`)
- Copy a share link and a Markdown-formatted part list to the clipboard
- **Compatibility check** (`src/lib/compatibility.ts`):
  - CPU socket vs. motherboard socket
  - RAM type vs. motherboard memory type, total RAM capacity vs. motherboard limit
  - Estimated total TDP vs. PSU wattage (warning if close to the limit, error if over it)
  - Graphics card length and cooler height vs. case limits
  - Motherboard form factor vs. case
  - Sockets supported by the cooler
  - Info message if no PSU is selected

### Products
- Category lists (`/urunler/:category`): brand, price range and spec filters, pagination
- Product detail (`/urun/:productId`): spec table, store price comparison and a price history chart with Recharts
- Live prices are fetched from the `/api/prices/:productId` endpoint with TanStack Query (5 min stale time, 2 retries). If the server doesn't respond or returns an empty result, the static prices from the product data are shown.

### Other pages
- Home page, build guides (`/rehberler`, `/rehber/:guideId`), completed builds (`/yapilar`, `/yapi/:buildId`)
- Price trends (`/trendler`), benchmark (`/benchmark`) and forum (`/forum`)
- Login, sign-up and profile (`/giris`, `/kayit`, `/profil`)
- Light and dark theme (dark by default)

### Price server
- Supported stores (`server/src/config.ts`):
  - With Cheerio: Vatan Bilgisayar, n11, Teknosa
  - With Puppeteer (`puppeteer-extra` + stealth plugin): Amazon TR, Hepsiburada, Trendyol
- All stores are queried in parallel. Results are sorted by price + shipping total.
- `productMatcher.ts` scores titles in search results from 0 to 100 and filters out wrong products (different model, prebuilt system, laptop, etc.)
- Cache: 30 minute TTL, written as JSON files under `server/cache/` and reloaded from disk on server startup. If scraping fails, the expired cache is returned.
- Per-store request interval 2 s, request timeout 15 s, at most 2 retries

## Tech stack

| | |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7, React Router 7 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), Framer Motion, lucide-react |
| State / data | Zustand 5, TanStack Query 5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| SEO | react-helmet-async |
| Server | Express 4, Cheerio, Axios, Puppeteer 23 (puppeteer-extra, stealth), tsx |

## Project structure

```
.
├── src/
│   ├── App.tsx              # rotalar (lazy yüklenen sayfalar)
│   ├── pages/               # Home, Builder, ProductList, ProductDetail, Guides, Builds, Trends, ...
│   ├── components/          # builder/, product/, products/, home/, layout/, ui/
│   ├── data/                # statik ürün, mağaza, rehber ve sistem verileri
│   ├── services/api.ts      # statik veriye erişim + canlı fiyat isteği
│   ├── hooks/useLivePrices.ts
│   ├── lib/compatibility.ts # uyumluluk kuralları
│   ├── stores/              # partListStore, authStore, themeStore
│   └── types/
├── server/
│   ├── src/
│   │   ├── index.ts         # Express uygulaması, CORS, rotalar
│   │   ├── config.ts        # port, önbellek, mağaza ayarları
│   │   ├── routes/          # prices.ts, products.ts
│   │   ├── scrapers/        # mağaza başına bir tarayıcı (base.ts'den türetilir)
│   │   ├── services/        # scrapeOrchestrator, cacheManager, productMatcher, browserManager
│   │   └── utils/           # httpClient, rateLimiter
│   └── cache/               # tarama önbelleği (JSON)
└── vite.config.ts           # @ alias, /api -> localhost:3001 proxy
```

## Requirements

- Node.js. Vite 7 requires Node 20.19+ or 22.12+.
- npm
- On the server side, Puppeteer downloads Chromium during installation

## Installation and running

The frontend and server dependencies are installed separately.

```bash
# Ön yüz
npm install
npm run dev        # http://localhost:5173

# Fiyat sunucusu (ayrı bir terminalde)
cd server
npm install
npm run dev        # tsx watch, http://localhost:3001
```

During development, Vite forwards requests starting with `/api` to `http://localhost:3001`. If the server isn't running, the app still opens and shows static prices.

Other commands:

```bash
# kökte
npm run build      # tsc -b && vite build
npm run preview
npm run lint

# server/ içinde
npm run build      # tsc -> dist/
npm start          # node dist/index.js
```

## Configuration

- `PORT`: server port (default `3001`). There are no other environment variables.
- Cache duration, request interval, timeout and per-store on/off settings are in `server/src/config.ts`.
- CORS is only open to `http://localhost:5173` and `http://localhost:4173`.
- The cache directory is defined as the relative path `./cache`. Start the server from the `server/` directory.

## API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check |
| `GET /api/products` | Product catalog known to the server |
| `GET /api/products/:id` | Single product |
| `GET /api/products/category/:category` | Products by category |
| `GET /api/prices/:productId` | Live prices for a product from all stores |
| `GET /api/prices/search?q=&brand=&model=&category=` | Free-text search |

## Notes and limitations

- Products, guides, builds and price history come from static data under `src/data/`. The frontend "API" layer returns this data with an artificial delay (150 ms). The server is only used for live prices.
- The server's product catalog (`server/src/routes/products.ts`) is a manually synced copy of the frontend data.
- Login and sign-up are fake: any email and password are accepted, and the user is stored only in the browser.
- The share link (`pcparcasecici.com/liste/<id>`) is copied as text only. Since lists aren't stored on the server, the link won't open the list on another device.
- Some of the scores on the benchmark page come from a fixed table; for unmatched models they are generated randomly. The forum page shows static content.
- The scrapers may break if the HTML structure of the store sites changes. Checking those sites' terms of use is up to you.
- No license is specified.
