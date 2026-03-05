import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { getAllProducts } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/types';
import type { Product, PartCategory } from '@/types';

export default function TrendsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('gpu');

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  const categoryProducts = products.filter((p) => p.category === selectedCategory);

  const trendData = categoryProducts.slice(0, 5).map((p) => {
    const history = p.priceHistory;
    const firstPrice = history[0]?.price ?? p.bestPrice;
    const lastPrice = history[history.length - 1]?.price ?? p.bestPrice;
    const change = lastPrice - firstPrice;
    const changePercent = ((change / firstPrice) * 100).toFixed(1);
    return { product: p, change, changePercent, firstPrice, lastPrice };
  });

  const chartProducts = categoryProducts.slice(0, 3);
  const chartData = chartProducts[0]?.priceHistory.map((_, i) => {
    const point: Record<string, string | number> = { date: chartProducts[0].priceHistory[i].date };
    chartProducts.forEach((p) => {
      if (p.priceHistory[i]) {
        point[p.name] = p.priceHistory[i].price;
      }
    });
    return point;
  }) ?? [];

  const categories: PartCategory[] = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu'];
  const colors = ['#0066FF', '#28A745', '#FFC107', '#DC3545', '#6699FF', '#FF6600'];

  return (
    <Layout>
      <Helmet>
        <title>Fiyat Trendleri - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Fiyat Trendleri</h1>
          <p className="text-[var(--text-secondary)]">
            Bilgisayar parçalarının fiyat değişimlerini ve piyasa trendlerini takip edin.
          </p>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {CATEGORY_LABELS[selectedCategory]} Fiyat Geçmişi
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v: number) => `₺${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(value: number | undefined) => [value != null ? formatPrice(value) : '', '']}
                />
                {chartProducts.map((p, i) => (
                  <Line
                    key={p.id}
                    type="monotone"
                    dataKey={p.name}
                    stroke={colors[i]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {chartProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
                <span className="text-[var(--text-secondary)]">{p.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Trend table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-semibold">Fiyat Değişimleri</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-secondary)]">
                <th className="text-left px-6 py-3">Ürün</th>
                <th className="text-right px-6 py-3">Mevcut Fiyat</th>
                <th className="text-right px-6 py-3">6 Ay Önce</th>
                <th className="text-right px-6 py-3">Değişim</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map(({ product, change, changePercent, firstPrice }) => (
                <tr key={product.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)]/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--link-color)]">{product.name}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{product.brand}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">{formatPrice(product.bestPrice)}</td>
                  <td className="px-6 py-4 text-right text-[var(--text-secondary)]">{formatPrice(firstPrice)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 font-medium ${
                      change < 0 ? 'text-[#28A745]' : change > 0 ? 'text-[#DC3545]' : 'text-[var(--text-secondary)]'
                    }`}>
                      {change < 0 ? <TrendingDown className="w-4 h-4" /> : change > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      <span>{change > 0 ? '+' : ''}{changePercent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  );
}
