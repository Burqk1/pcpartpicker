import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { StorePrice } from '@/types';
import { formatPriceDecimal } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

const STORE_COLORS: Record<string, string> = {
  'amazon-tr': '#FF9900',
  hepsiburada: '#FF6000',
  n11: '#7B2D8E',
  vatan: '#E31E24',
  teknosa: '#F27A1A',
  mediamarkt: '#DF0000',
  trendyol: '#F27A1A',
  itopya: '#00AEEF',
  incehesap: '#1BAE70',
  gamegaraj: '#8B5CF6',
};

interface PriceComparisonProps {
  prices: StorePrice[];
  isLoading?: boolean;
  isLiveData?: boolean;
}

export default function PriceComparison({ prices, isLoading, isLiveData }: PriceComparisonProps) {
  const sortedPrices = useMemo(() => {
    return [...prices]
      .map((p) => ({
        ...p,
        total: p.price + p.shippingCost,
      }))
      .sort((a, b) => a.total - b.total);
  }, [prices]);

  const bestTotal = sortedPrices.length > 0 ? sortedPrices[0].total : 0;

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Mağaza fiyatları yükleniyor...</p>
        </div>
        <div className="mt-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-[var(--bg-header)] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-8 text-center">
        <p className="text-[var(--text-secondary)]">Fiyat bilgisi bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Mağaza Fiyatları
          </h3>
          {isLiveData && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-[#28A745]/20 text-[#28A745] px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-[#28A745] rounded-full animate-pulse" />
              Canlı Fiyatlar
            </span>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-[var(--border-color)] bg-[var(--bg-header)]">
              <th className="text-left px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">
                Mağaza
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">
                Fiyat
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">
                Kargo
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">
                Toplam
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">
                Durum
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPrices.map((sp, idx) => {
              const isBest = sp.total === bestTotal;
              return (
                <tr
                  key={sp.storeId}
                  className={`border-b border-[var(--border-color)] last:border-b-0 transition-colors ${
                    isBest ? 'bg-[#28A745]/5' : idx % 2 === 1 ? 'bg-[var(--bg-header)]/30' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            STORE_COLORS[sp.storeId] || '#6699FF',
                        }}
                      />
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {sp.storeName}
                      </span>
                      {isBest && <Badge variant="success">En İyi Fiyat</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-[var(--text-primary)]">
                    {formatPriceDecimal(sp.price)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">
                    {sp.shippingCost === 0 ? (
                      <span className="text-[#28A745]">Ücretsiz</span>
                    ) : (
                      formatPriceDecimal(sp.shippingCost)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        isBest ? 'text-[#28A745]' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {formatPriceDecimal(sp.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {sp.inStock ? (
                      <Badge variant="success">Stokta</Badge>
                    ) : (
                      <Badge variant="error">Stok Yok</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={sp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#28A745] hover:bg-[#1e7e34] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Satın Al
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-[var(--border-color)]">
        {sortedPrices.map((sp) => {
          const isBest = sp.total === bestTotal;
          return (
            <div
              key={sp.storeId}
              className={`p-4 ${isBest ? 'bg-[#28A745]/5' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        STORE_COLORS[sp.storeId] || '#6699FF',
                    }}
                  />
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {sp.storeName}
                  </span>
                </div>
                {isBest && <Badge variant="success">En İyi</Badge>}
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-[var(--text-secondary)]">
                  <span>Fiyat: {formatPriceDecimal(sp.price)}</span>
                  <span className="mx-2">|</span>
                  <span>
                    Kargo:{' '}
                    {sp.shippingCost === 0 ? (
                      <span className="text-[#28A745]">Ücretsiz</span>
                    ) : (
                      formatPriceDecimal(sp.shippingCost)
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`font-semibold ${
                    isBest ? 'text-[#28A745]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {formatPriceDecimal(sp.total)}
                </span>
                <a
                  href={sp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#28A745] hover:bg-[#1e7e34] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Satın Al
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
