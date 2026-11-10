# PCParçaSeçici

Türkiye pazarına yönelik, PCPartPicker benzeri bir PC parça seçme ve uyumluluk kontrol uygulaması. Parçaları seçip bir sistem listesi oluşturabilir, parçaların birbiriyle uyumlu olup olmadığını görebilir ve ürün sayfalarında Türk e-ticaret sitelerinden çekilen canlı fiyatları karşılaştırabilirsiniz.

Proje iki parçadan oluşur:

- **Ön yüz** (repo kökü): React 19, TypeScript, Vite 7 ve Tailwind CSS 4
- **Fiyat sunucusu** (`server/`): Express + TypeScript. Mağaza sitelerini Cheerio ve Puppeteer ile tarar.

## Özellikler

### Sistem toplama (`/liste`)
- CPU, anakart, RAM, ekran kartı, depolama, PSU, kasa ve CPU soğutucu için parça seçme penceresi
- Toplam fiyat ve seçili parça sayısı
- Liste tarayıcıda saklanır (Zustand `persist`, `pcparca-partlist` anahtarı)
- Paylaşım linkini ve Markdown formatında parça listesini panoya kopyalama
- **Uyumluluk kontrolü** (`src/lib/compatibility.ts`):
  - İşlemci soketi ile anakart soketi
  - RAM tipi ile anakart bellek tipi, toplam RAM kapasitesi ile anakart sınırı
  - Tahmini toplam TDP ile PSU gücü (sınıra yakınsa uyarı, aşıyorsa hata)
  - Ekran kartı uzunluğu ve soğutucu yüksekliği ile kasa sınırları
  - Anakart form faktörü ile kasa
  - Soğutucunun desteklediği soketler
  - PSU seçilmediyse bilgilendirme

### Ürünler
- Kategori listeleri (`/urunler/:category`): marka, fiyat aralığı ve spesifikasyon filtreleri, sayfalama
- Ürün detayı (`/urun/:productId`): spesifikasyon tablosu, mağaza fiyat karşılaştırması ve Recharts ile fiyat geçmişi grafiği
- Canlı fiyatlar `/api/prices/:productId` ucundan TanStack Query ile alınır (5 dk stale time, 2 tekrar deneme). Sunucu yanıt vermezse veya sonuç boş dönerse, ürün verisindeki statik fiyatlar gösterilir.

### Diğer sayfalar
- Ana sayfa, sistem rehberleri (`/rehberler`, `/rehber/:guideId`), tamamlanmış sistemler (`/yapilar`, `/yapi/:buildId`)
- Fiyat trendleri (`/trendler`), benchmark (`/benchmark`) ve forum (`/forum`)
- Giriş, kayıt ve profil (`/giris`, `/kayit`, `/profil`)
- Açık ve koyu tema (varsayılan koyu)

### Fiyat sunucusu
- Desteklenen mağazalar (`server/src/config.ts`):
  - Cheerio ile: Vatan Bilgisayar, n11, Teknosa
  - Puppeteer (`puppeteer-extra` + stealth eklentisi) ile: Amazon TR, Hepsiburada, Trendyol
- Tüm mağazalar paralel sorgulanır. Sonuçlar fiyat + kargo toplamına göre sıralanır.
- `productMatcher.ts`, arama sonuçlarındaki başlıkları 0–100 arası puanlar ve yanlış ürünleri (farklı model, hazır sistem, laptop vb.) eler
- Önbellek: 30 dakika TTL, `server/cache/` altına JSON dosyası olarak yazılır ve sunucu açılışında diskten geri yüklenir. Tarama başarısız olursa süresi dolmuş önbellek döner.
- Mağaza başına istek aralığı 2 sn, istek zaman aşımı 15 sn, en fazla 2 tekrar deneme

## Teknolojiler

| | |
|---|---|
| Ön yüz | React 19, TypeScript 5.9, Vite 7, React Router 7 |
| Stil | Tailwind CSS 4 (`@tailwindcss/vite`), Framer Motion, lucide-react |
| Durum / veri | Zustand 5, TanStack Query 5 |
| Formlar | React Hook Form + Zod |
| Grafik | Recharts |
| SEO | react-helmet-async |
| Sunucu | Express 4, Cheerio, Axios, Puppeteer 23 (puppeteer-extra, stealth), tsx |

## Proje yapısı

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

## Gereksinimler

- Node.js. Vite 7 için Node 20.19+ veya 22.12+ gerekir.
- npm
- Sunucu tarafında Puppeteer, kurulum sırasında Chromium indirir

## Kurulum ve çalıştırma

Ön yüz ve sunucunun bağımlılıkları ayrı ayrı kurulur.

```bash
# Ön yüz
npm install
npm run dev        # http://localhost:5173

# Fiyat sunucusu (ayrı bir terminalde)
cd server
npm install
npm run dev        # tsx watch, http://localhost:3001
```

Geliştirme sırasında Vite, `/api` ile başlayan istekleri `http://localhost:3001` adresine yönlendirir. Sunucu çalışmıyorsa uygulama yine açılır ve statik fiyatlar gösterilir.

Diğer komutlar:

```bash
# kökte
npm run build      # tsc -b && vite build
npm run preview
npm run lint

# server/ içinde
npm run build      # tsc -> dist/
npm start          # node dist/index.js
```

## Yapılandırma

- `PORT`: sunucu portu (varsayılan `3001`). Başka bir ortam değişkeni yoktur.
- Önbellek süresi, istek aralığı, zaman aşımı ve mağazaları açıp kapatma ayarları `server/src/config.ts` içindedir.
- CORS yalnızca `http://localhost:5173` ve `http://localhost:4173` adreslerine açıktır.
- Önbellek dizini `./cache` olarak göreli tanımlıdır. Sunucuyu `server/` dizininden başlatın.

## API

| Uç nokta | Açıklama |
|---|---|
| `GET /api/health` | Sağlık kontrolü |
| `GET /api/products` | Sunucunun bildiği ürün kataloğu |
| `GET /api/products/:id` | Tek ürün |
| `GET /api/products/category/:category` | Kategoriye göre ürünler |
| `GET /api/prices/:productId` | Ürün için tüm mağazalardan canlı fiyatlar |
| `GET /api/prices/search?q=&brand=&model=&category=` | Serbest arama |

## Notlar ve sınırlamalar

- Ürünler, rehberler, sistemler ve fiyat geçmişi `src/data/` altındaki statik verilerden gelir. Ön yüzdeki "API" katmanı bu veriyi yapay bir gecikmeyle (150 ms) döndürür. Sunucu yalnızca canlı fiyat için kullanılır.
- Sunucudaki ürün kataloğu (`server/src/routes/products.ts`), ön yüzdeki verinin elle senkron tutulan bir kopyasıdır.
- Giriş ve kayıt sahtedir: herhangi bir e-posta ve şifre kabul edilir, kullanıcı yalnızca tarayıcıda saklanır.
- Paylaşım linki (`pcparcasecici.com/liste/<id>`) yalnızca metin olarak kopyalanır. Listeler sunucuda saklanmadığı için link başka bir cihazda listeyi açmaz.
- Benchmark sayfasındaki puanların bir kısmı sabit tablodan gelir, eşleşmeyen modeller için rastgele üretilir. Forum sayfası statik içerik gösterir.
- Mağaza sitelerinin HTML yapısı değişirse tarayıcılar bozulabilir. Bu sitelerin kullanım koşullarını kontrol etmek size kalmıştır.
- Lisans belirtilmemiştir.
