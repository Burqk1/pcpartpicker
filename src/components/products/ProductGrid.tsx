import { LayoutGrid, List } from 'lucide-react';
import type { Product } from '@/types';
import Select from '@/components/ui/Select';
import ProductCard from './ProductCard';

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name';
export type ViewMode = 'grid' | 'list';

const sortOptions = [
  { value: 'price-asc', label: 'Fiyat (Artan)' },
  { value: 'price-desc', label: 'Fiyat (Azalan)' },
  { value: 'rating', label: 'Puan (Yüksek)' },
  { value: 'name', label: 'İsim (A-Z)' },
];

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount?: number;
}

export default function ProductGrid({
  products,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  totalCount,
}: ProductGridProps) {
  const count = totalCount ?? products.length;

  return (
    <div className="flex-1 min-w-0">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{count}</span> ürün
          bulundu
        </p>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="w-48">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(val) => onSortChange(val as SortOption)}
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-[var(--border-color)] rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#0066FF] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              }`}
              title="Izgara Görünümü"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#0066FF] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              }`}
              title="Liste Görünümü"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-12 text-center">
          <p className="text-[var(--text-secondary)]">
            Arama kriterlerinize uygun ürün bulunamadı.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}
