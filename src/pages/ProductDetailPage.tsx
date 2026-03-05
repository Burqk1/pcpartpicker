import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronRight,
  Cpu,
  MonitorSpeaker,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  Star,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Tabs from '@/components/ui/Tabs';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PriceComparison from '@/components/product/PriceComparison';
import SpecsTable from '@/components/product/SpecsTable';
import PriceHistoryChart from '@/components/product/PriceHistoryChart';
import { getProductById } from '@/services/api';
import { useLivePrices } from '@/hooks/useLivePrices';
import { formatPrice } from '@/lib/utils';
import { CATEGORY_LABELS, type PartCategory, type Product } from '@/types';

const categoryGradients: Record<string, string> = {
  cpu: 'from-blue-600/30 to-purple-600/30',
  gpu: 'from-green-600/30 to-teal-600/30',
  motherboard: 'from-orange-600/30 to-red-600/30',
  ram: 'from-purple-600/30 to-pink-600/30',
  storage: 'from-cyan-600/30 to-blue-600/30',
  psu: 'from-yellow-600/30 to-orange-600/30',
  case: 'from-indigo-600/30 to-violet-600/30',
  'cpu-cooler': 'from-sky-600/30 to-cyan-600/30',
};

const categoryIcons: Partial<Record<PartCategory, React.ElementType>> = {
  cpu: Cpu,
  gpu: MonitorSpeaker,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  'cpu-cooler': Fan,
};

const DETAIL_TABS = [
  { id: 'prices', label: 'Fiyatlar' },
  { id: 'specs', label: 'Özellikler' },
  { id: 'history', label: 'Fiyat Geçmişi' },
  { id: 'reviews', label: 'Değerlendirmeler' },
];

// Placeholder reviews for the reviews tab
const placeholderReviews = [
  {
    id: '1',
    userName: 'Ahmet K.',
    rating: 5,
    title: 'Mükemmel performans',
    content:
      'Ürünü yaklaşık 3 aydır kullanıyorum. Performansından çok memnunum, hiçbir sorun yaşamadım. Fiyat-performans oranı da gayet iyi.',
    helpful: 24,
    createdAt: '2026-02-15',
  },
  {
    id: '2',
    userName: 'Mehmet S.',
    rating: 4,
    title: 'Genel olarak iyi',
    content:
      'Beklentilerimi karşıladı. Kurulumu kolaydı. Tek eksi yanı biraz gürültülü olması ama genel olarak memnunum.',
    helpful: 12,
    createdAt: '2026-01-28',
  },
  {
    id: '3',
    userName: 'Elif D.',
    rating: 5,
    title: 'Tavsiye ederim',
    content:
      'Bu fiyata bu kalite başka yerde yok. Herkese tavsiye ederim. Kargo da çok hızlı geldi.',
    helpful: 18,
    createdAt: '2026-01-10',
  },
];

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('prices');

  // Fetch live prices from backend scraping service
  const { data: livePrices, isLoading: pricesLoading, isError: pricesError } = useLivePrices(productId);

  // Use live prices if available, otherwise fall back to mock data
  const displayPrices = livePrices && livePrices.length > 0 ? livePrices : product?.prices ?? [];
  const isLiveData = !!(livePrices && livePrices.length > 0);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getProductById(productId).then((data) => {
      setProduct(data || null);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Ürün Bulunamadı
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Aradığınız ürün bulunamadı veya kaldırılmış olabilir.
          </p>
          <Button as={Link} href="/" variant="primary">
            Ana Sayfaya Dön
          </Button>
        </div>
      </Layout>
    );
  }

  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const Icon = categoryIcons[product.category] || Cpu;
  const gradient = categoryGradients[product.category] || categoryGradients.cpu;

  return (
    <Layout>
      <Helmet>
        <title>
          {product.name} | Fiyat Karşılaştırma | PC Parça Seçici
        </title>
        <meta
          name="description"
          content={`${product.name} en ucuz fiyat, mağaza karşılaştırma ve teknik özellikler. ${formatPrice(product.bestPrice)}'den başlayan fiyatlarla.`}
        />
      </Helmet>

      <div className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
          <Link
            to="/"
            className="text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors"
          >
            Ana Sayfa
          </Link>
          <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          <span className="text-[var(--text-secondary)]">Ürünler</span>
          <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          <Link
            to={`/urunler/${product.category}`}
            className="text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors"
          >
            {categoryLabel}
          </Link>
          <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          <span className="text-[var(--text-primary)] font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Top Section: Image + Info */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Image Placeholder */}
          <div
            className={`w-full lg:w-[400px] h-[300px] lg:h-[400px] flex-shrink-0 bg-gradient-to-br ${gradient} rounded-lg border border-[var(--border-color)] flex items-center justify-center`}
          >
            <Icon size={80} className="text-[var(--text-secondary)]" />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <Badge variant="info">{categoryLabel}</Badge>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">
              {product.name}
            </h1>

            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Marka: <span className="text-[var(--text-primary)]">{product.brand}</span>
              {' | '}
              Model: <span className="text-[var(--text-primary)]">{product.model}</span>
            </p>

            <div className="mb-6">
              <Rating
                rating={product.rating}
                showValue
                reviewCount={product.reviewCount}
              />
            </div>

            {/* Best Price */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-[var(--text-secondary)]">En İyi Fiyat</p>
                {pricesLoading && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <span className="w-3 h-3 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                    Canlı fiyatlar yükleniyor...
                  </span>
                )}
                {isLiveData && !pricesLoading && (
                  <span className="text-xs bg-[#28A745]/20 text-[#28A745] px-2 py-0.5 rounded-full font-medium">
                    Canlı Fiyat
                  </span>
                )}
                {pricesError && (
                  <span className="text-xs text-[var(--text-secondary)]">
                    (önbellek verisi)
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-3">
                {displayPrices.length > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-[var(--link-color)]">
                      {formatPrice(
                        [...displayPrices].sort(
                          (a, b) => a.price + a.shippingCost - (b.price + b.shippingCost)
                        )[0].price
                      )}
                    </span>
                    {displayPrices.length > 1 && (
                      <span className="text-sm text-[var(--text-secondary)]">
                        ({displayPrices.length} mağazada)
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-bold text-[var(--link-color)]">
                    {formatPrice(product.bestPrice)}
                  </span>
                )}
              </div>
              {displayPrices.length > 0 && (
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  En ucuz:{' '}
                  {
                    [...displayPrices].sort(
                      (a, b) => a.price + a.shippingCost - (b.price + b.shippingCost)
                    )[0].storeName
                  }
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg">
                Yapılandırıcıya Ekle
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setActiveTab('prices')}
              >
                Fiyatları Karşılaştır
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={DETAIL_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {/* Prices Tab */}
          {activeTab === 'prices' && (
            <PriceComparison
              prices={displayPrices}
              isLoading={pricesLoading}
              isLiveData={isLiveData}
            />
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <SpecsTable specs={product.specs} category={product.category} />
          )}

          {/* Price History Tab */}
          {activeTab === 'history' && (
            <PriceHistoryChart priceHistory={product.priceHistory} />
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Reviews Summary */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[var(--text-primary)]">
                      {product.rating.toFixed(1)}
                    </div>
                    <Rating rating={product.rating} size="md" />
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {product.reviewCount} değerlendirme
                    </p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      // Simulated distribution
                      const pcts: Record<number, number> = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };
                      const pct = pcts[star] || 0;
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-xs text-[var(--text-secondary)]">{star}</span>
                            <Star
                              size={12}
                              className="text-[var(--star-color)] fill-[var(--star-color)]"
                            />
                          </div>
                          <div className="flex-1 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--star-color)] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--text-secondary)] w-10 text-right">
                            %{pct}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {placeholderReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-[var(--text-primary)]">
                          {review.userName}
                        </span>
                        <Rating rating={review.rating} size="sm" />
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {review.title}
                      </h4>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    {review.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                    <button className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
                      <ThumbsUp size={14} />
                      Faydalı ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
                      <MessageSquare size={14} />
                      Yanıtla
                    </button>
                  </div>
                </div>
              ))}

              {/* Write Review CTA */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 text-center">
                <p className="text-[var(--text-secondary)] mb-3">
                  Bu ürünü kullandınız mı? Deneyiminizi paylaşın!
                </p>
                <Button variant="primary">Değerlendirme Yaz</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
