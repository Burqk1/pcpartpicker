import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Star } from 'lucide-react';
import type { PartCategory, Product } from '@/types';
import Button from '@/components/ui/Button';

export interface ProductFiltersState {
  brands: string[];
  priceMin: number | null;
  priceMax: number | null;
  minRating: number;
  categorySpecific: Record<string, string[]>;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border-color)] pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-[var(--text-primary)] mb-3 hover:text-[var(--link-color)] transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

interface CategoryFilter {
  key: string;
  label: string;
  options: string[];
}

function getCategorySpecificFilters(category: PartCategory, products: Product[]): CategoryFilter[] {
  const getUniqueValues = (key: string): string[] => {
    const values = new Set<string>();
    products.forEach((p) => {
      const val = p.specs[key];
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          val.forEach((v) => values.add(String(v)));
        } else {
          values.add(String(val));
        }
      }
    });
    return Array.from(values).sort();
  };

  switch (category) {
    case 'cpu':
      return [
        { key: 'socket', label: 'Soket', options: getUniqueValues('socket') },
        {
          key: 'cores',
          label: 'Çekirdek Sayısı',
          options: getUniqueValues('cores'),
        },
        { key: 'architecture', label: 'Mimari', options: getUniqueValues('architecture') },
      ];
    case 'gpu':
      return [
        {
          key: 'chipsetBrand',
          label: 'Yonga Seti Markası',
          options: (() => {
            const brands = new Set<string>();
            products.forEach((p) => {
              const chipset = String(p.specs.chipset || '');
              if (chipset.includes('NVIDIA') || chipset.includes('GeForce')) brands.add('NVIDIA');
              if (chipset.includes('AMD') || chipset.includes('Radeon')) brands.add('AMD');
            });
            return Array.from(brands).sort();
          })(),
        },
        { key: 'memory', label: 'Bellek Miktarı', options: getUniqueValues('memory') },
        { key: 'memoryType', label: 'Bellek Türü', options: getUniqueValues('memoryType') },
      ];
    case 'motherboard':
      return [
        { key: 'socket', label: 'Soket', options: getUniqueValues('socket') },
        { key: 'formFactor', label: 'Form Faktörü', options: getUniqueValues('formFactor') },
        { key: 'memoryType', label: 'Bellek Türü', options: getUniqueValues('memoryType') },
        { key: 'chipset', label: 'Yonga Seti', options: getUniqueValues('chipset') },
      ];
    case 'ram':
      return [
        { key: 'type', label: 'Tür', options: getUniqueValues('type') },
        { key: 'speed', label: 'Hız (MHz)', options: getUniqueValues('speed') },
        { key: 'totalCapacity', label: 'Kapasite (GB)', options: getUniqueValues('totalCapacity') },
      ];
    case 'storage':
      return [
        { key: 'type', label: 'Tür', options: getUniqueValues('type') },
        { key: 'capacity', label: 'Kapasite', options: getUniqueValues('capacity') },
        { key: 'interface', label: 'Arayüz', options: getUniqueValues('interface') },
      ];
    case 'psu':
      return [
        { key: 'wattage', label: 'Güç (W)', options: getUniqueValues('wattage') },
        { key: 'efficiency', label: 'Verimlilik', options: getUniqueValues('efficiency') },
        { key: 'modular', label: 'Modülerlik', options: getUniqueValues('modular') },
      ];
    case 'case':
      return [
        { key: 'type', label: 'Tip', options: getUniqueValues('type') },
        { key: 'sidePanel', label: 'Yan Panel', options: getUniqueValues('sidePanel') },
      ];
    case 'cpu-cooler':
      return [
        { key: 'type', label: 'Soğutma Tipi', options: getUniqueValues('type') },
      ];
    default:
      return [];
  }
}

interface ProductFiltersProps {
  category: PartCategory;
  products: Product[];
  filters: ProductFiltersState;
  onFilterChange: (filters: ProductFiltersState) => void;
}

export default function ProductFilters({
  category,
  products,
  filters,
  onFilterChange,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceMinInput, setPriceMinInput] = useState(
    filters.priceMin !== null ? String(filters.priceMin) : ''
  );
  const [priceMaxInput, setPriceMaxInput] = useState(
    filters.priceMax !== null ? String(filters.priceMax) : ''
  );

  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => brands.add(p.brand));
    return Array.from(brands).sort();
  }, [products]);

  const categoryFilters = useMemo(
    () => getCategorySpecificFilters(category, products),
    [category, products]
  );

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handlePriceApply = () => {
    onFilterChange({
      ...filters,
      priceMin: priceMinInput ? Number(priceMinInput) : null,
      priceMax: priceMaxInput ? Number(priceMaxInput) : null,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const handleCategoryFilterToggle = (key: string, value: string) => {
    const current = filters.categorySpecific[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({
      ...filters,
      categorySpecific: { ...filters.categorySpecific, [key]: updated },
    });
  };

  const handleReset = () => {
    setPriceMinInput('');
    setPriceMaxInput('');
    onFilterChange({
      brands: [],
      priceMin: null,
      priceMax: null,
      minRating: 0,
      categorySpecific: {},
    });
  };

  const filterContent = (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Filtreler</h3>
        <button
          onClick={handleReset}
          className="text-sm text-[var(--link-color)] hover:underline"
        >
          Temizle
        </button>
      </div>

      {/* Brand Filter */}
      <FilterSection title="Marka">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {uniqueBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-0 accent-[#0066FF]"
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Fiyat Aralığı">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            placeholder="Min ₺"
            value={priceMinInput}
            onChange={(e) => setPriceMinInput(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none"
          />
          <span className="text-[var(--text-secondary)] text-sm">-</span>
          <input
            type="number"
            placeholder="Max ₺"
            value={priceMaxInput}
            onChange={(e) => setPriceMaxInput(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none"
          />
        </div>
        <Button size="sm" variant="primary" className="w-full" onClick={handlePriceApply}>
          Uygula
        </Button>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Minimum Puan">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                filters.minRating === rating
                  ? 'bg-[var(--bg-header)]'
                  : 'hover:bg-[var(--bg-header)]'
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < rating
                        ? 'text-[var(--star-color)] fill-[var(--star-color)]'
                        : 'text-[var(--star-color)]'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--text-secondary)]">ve üzeri</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Category-specific Filters */}
      {categoryFilters.map((cf) => (
        <FilterSection key={cf.key} title={cf.label}>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cf.options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(filters.categorySpecific[cf.key] || []).includes(option)}
                  onChange={() => handleCategoryFilterToggle(cf.key, option)}
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-0 accent-[#0066FF]"
                />
                {option}
              </label>
            ))}
          </div>
        </FilterSection>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 sticky top-[140px]">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal size={16} />
          Filtreler
        </Button>
      </div>

      {/* Mobile Slide-over Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-[var(--bg-card)] border-r border-[var(--border-color)] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Filtreler</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {filterContent}
            <div className="mt-6">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Sonuçları Gör
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
