import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductFilters, {
  type ProductFiltersState,
} from '@/components/products/ProductFilters';
import ProductGrid, {
  type SortOption,
  type ViewMode,
} from '@/components/products/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { getProducts } from '@/services/api';
import { CATEGORY_LABELS, type PartCategory, type Product } from '@/types';

const ITEMS_PER_PAGE = 12;

const defaultFilters: ProductFiltersState = {
  brands: [],
  priceMin: null,
  priceMax: null,
  minRating: 0,
  categorySpecific: {},
};

export default function ProductListPage() {
  const { category } = useParams<{ category: string }>();
  const partCategory = (category || 'cpu') as PartCategory;
  const categoryLabel = CATEGORY_LABELS[partCategory] || category || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFiltersState>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setFilters(defaultFilters);
    setCurrentPage(1);
    getProducts(partCategory).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [partCategory]);

  // Reset page when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleFilterChange = useCallback((newFilters: ProductFiltersState) => {
    setFilters(newFilters);
  }, []);

  // Apply client-side filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Price range filter
    if (filters.priceMin !== null) {
      result = result.filter((p) => p.bestPrice >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter((p) => p.bestPrice <= filters.priceMax!);
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Category-specific filters
    for (const [key, values] of Object.entries(filters.categorySpecific)) {
      if (values.length === 0) continue;

      if (key === 'chipsetBrand') {
        // Special handling for GPU chipset brand
        result = result.filter((p) => {
          const chipset = String(p.specs.chipset || '');
          return values.some((v) => {
            if (v === 'NVIDIA') return chipset.includes('NVIDIA') || chipset.includes('GeForce');
            if (v === 'AMD') return chipset.includes('AMD') || chipset.includes('Radeon');
            return false;
          });
        });
      } else {
        result = result.filter((p) => {
          const specVal = p.specs[key];
          if (specVal === undefined || specVal === null) return false;
          return values.includes(String(specVal));
        });
      }
    }

    return result;
  }, [products, filters]);

  // Apply client-side sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.bestPrice - b.bestPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.bestPrice - a.bestPrice);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  return (
    <Layout>
      <Helmet>
        <title>{categoryLabel} Fiyatları ve Karşılaştırma | PC Parça Seçici</title>
        <meta
          name="description"
          content={`${categoryLabel} ürünlerini karşılaştırın, en iyi fiyatları bulun. Türkiye'nin en kapsamlı bilgisayar parçası karşılaştırma sitesi.`}
        />
      </Helmet>

      <div className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            to="/"
            className="text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors"
          >
            Ana Sayfa
          </Link>
          <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          <span className="text-[var(--text-secondary)]">Ürünler</span>
          <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          <span className="text-[var(--text-primary)] font-medium">{categoryLabel}</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          {categoryLabel}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Mobile filter button */}
            <div className="lg:hidden">
              <ProductFilters
                category={partCategory}
                products={products}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="flex gap-6">
              {/* Desktop sidebar filters */}
              <div className="hidden lg:block">
                <ProductFilters
                  category={partCategory}
                  products={products}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Product grid */}
              <div className="flex-1 min-w-0">
                <ProductGrid
                  products={paginatedProducts}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  totalCount={sortedProducts.length}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
