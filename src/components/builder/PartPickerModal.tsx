import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowUpDown, Loader2 } from 'lucide-react';
import type { PartCategory, Product } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { formatPrice } from '@/lib/utils';
import { getProducts } from '@/services/api';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Rating from '@/components/ui/Rating';

interface PartPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: PartCategory;
  onSelect: (product: Product) => void;
}

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name';

function PartPickerModal({ isOpen, onClose, category, onSelect }: PartPickerModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setSearchQuery('');
      setSelectedBrands([]);
      setPriceMin('');
      setPriceMax('');
      setSortBy('price-asc');

      getProducts(category)
        .then((data) => {
          setProducts(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, category]);

  const brands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand));
    return Array.from(brandSet).sort();
  }, [products]);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price filter
    const min = priceMin ? parseFloat(priceMin) : 0;
    const max = priceMax ? parseFloat(priceMax) : Infinity;
    result = result.filter((p) => p.bestPrice >= min && p.bestPrice <= max);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.bestPrice - b.bestPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.bestPrice - a.bestPrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
    }

    return result;
  }, [products, searchQuery, selectedBrands, priceMin, priceMax, sortBy]);

  function getKeySpecs(product: Product): string[] {
    const specs = product.specs;
    const result: string[] = [];

    switch (product.category) {
      case 'cpu':
        if (specs.cores) result.push(`${specs.cores} Cekirdek`);
        if (specs.boostClock) result.push(`${specs.boostClock} GHz`);
        if (specs.socket) result.push(`${specs.socket}`);
        if (specs.tdp) result.push(`${specs.tdp}W TDP`);
        break;
      case 'cpu-cooler':
        if (specs.type) result.push(`${specs.type}`);
        if (specs.fanRPM) result.push(`${specs.fanRPM}`);
        if (specs.noiseLevel) result.push(`${specs.noiseLevel}`);
        break;
      case 'motherboard':
        if (specs.socket) result.push(`${specs.socket}`);
        if (specs.chipset) result.push(`${specs.chipset}`);
        if (specs.formFactor) result.push(`${specs.formFactor}`);
        if (specs.memoryType) result.push(`${specs.memoryType}`);
        break;
      case 'ram':
        if (specs.type) result.push(`${specs.type}`);
        if (specs.speed) result.push(`${specs.speed}MHz`);
        if (specs.modules) result.push(`${specs.modules}`);
        if (specs.casLatency) result.push(`CL${specs.casLatency}`);
        break;
      case 'storage':
        if (specs.type) result.push(`${specs.type}`);
        if (specs.capacity) result.push(`${specs.capacity}`);
        if (specs.interface) result.push(`${specs.interface}`);
        break;
      case 'gpu':
        if (specs.chipset) result.push(`${specs.chipset}`);
        if (specs.memory) result.push(`${specs.memory}`);
        if (specs.boostClock) result.push(`${specs.boostClock} MHz`);
        if (specs.tdp) result.push(`${specs.tdp}W`);
        break;
      case 'psu':
        if (specs.wattage) result.push(`${specs.wattage}W`);
        if (specs.efficiency) result.push(`${specs.efficiency}`);
        if (specs.modular) result.push(`${specs.modular}`);
        break;
      case 'case':
        if (specs.type) result.push(`${specs.type}`);
        if (specs.sidePanel) result.push(`${specs.sidePanel}`);
        if (specs.maxGPULength) result.push(`GPU: ${specs.maxGPULength}mm`);
        break;
      default:
        break;
    }

    return result;
  }

  function handleSelect(product: Product) {
    onSelect(product);
    onClose();
  }

  const title = `${CATEGORY_LABELS[category]} Sec`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="full">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder={`${CATEGORY_LABELS[category]} ara...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-[var(--text-secondary)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#0066FF] cursor-pointer"
          >
            <option value="price-asc">Fiyat (Dusuk)</option>
            <option value="price-desc">Fiyat (Yuksek)</option>
            <option value="rating">Puan</option>
            <option value="name">Ad</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters Sidebar */}
        <div className="w-full md:w-56 shrink-0 space-y-4">
          {/* Brand filter */}
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Marka</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-[var(--border-color)] bg-[var(--bg-card)] text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-0"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Fiyat Araligi</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#0066FF]"
              />
              <span className="text-[var(--text-secondary)] text-sm">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          {/* Reset filters */}
          {(selectedBrands.length > 0 || priceMin || priceMax) && (
            <button
              onClick={() => {
                setSelectedBrands([]);
                setPriceMin('');
                setPriceMax('');
              }}
              className="text-sm text-[var(--link-color)] hover:underline w-full text-center"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Product List */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[var(--link-color)]" />
              <span className="ml-3 text-[var(--text-secondary)]">Yukleniyor...</span>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)]">
                {searchQuery || selectedBrands.length > 0
                  ? 'Filtrelere uyan urun bulunamadi.'
                  : 'Bu kategoride urun bulunmuyor.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Results count */}
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                {filteredAndSorted.length} urun bulundu
              </p>

              {filteredAndSorted.map((product) => {
                const keySpecs = getKeySpecs(product);
                return (
                  <div
                    key={product.id}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:border-[var(--link-color)] transition-colors"
                  >
                    {/* Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded bg-white/5 p-1 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {product.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {keySpecs.map((spec, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs px-2 py-0.5 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="shrink-0">
                      <Rating rating={product.rating} size="sm" showValue />
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {product.reviewCount} degerlendirme
                      </p>
                    </div>

                    {/* Price + Select */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-base font-bold text-[var(--text-primary)]">
                          {formatPrice(product.bestPrice)}
                        </p>
                        {product.prices.length > 1 && (
                          <p className="text-xs text-[var(--text-secondary)]">
                            {product.prices.filter((p) => p.inStock).length} magaza
                          </p>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSelect(product)}
                      >
                        Sec
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PartPickerModal;
