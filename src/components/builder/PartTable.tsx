import { useState, useMemo } from 'react';
import type { PartCategory, Product } from '@/types';
import { usePartListStore } from '@/stores/partListStore';
import { formatPrice } from '@/lib/utils';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import PartRow from './PartRow';
import PartPickerModal from './PartPickerModal';

const TABLE_TABS = [
  { id: 'overview', label: 'Genel Bakis' },
  { id: 'by-store', label: 'Saticiya Gore Fiyatlar' },
];

function PartTable() {
  const items = usePartListStore((s) => s.items);
  const setPart = usePartListStore((s) => s.setPart);
  const removePart = usePartListStore((s) => s.removePart);
  const getTotalPrice = usePartListStore((s) => s.getTotalPrice);

  const [activeTab, setActiveTab] = useState('overview');
  const [pickerCategory, setPickerCategory] = useState<PartCategory | null>(null);

  function handleSelectPart(product: Product) {
    if (pickerCategory) {
      setPart(pickerCategory, product);
      setPickerCategory(null);
    }
  }

  // Calculate per-store totals for the "by-store" tab
  const storeTotals = useMemo(() => {
    const storeMap: Record<string, { storeName: string; total: number; count: number }> = {};

    for (const item of items) {
      if (!item.product) continue;
      for (const sp of item.product.prices) {
        if (!sp.inStock) continue;
        if (!storeMap[sp.storeId]) {
          storeMap[sp.storeId] = { storeName: sp.storeName, total: 0, count: 0 };
        }
        // Only add the cheapest available price for each product at this store
      }
    }

    // For each store, compute total assuming all selected products are bought there
    const selectedItems = items.filter((i) => i.product);
    const allStoreIds = new Set<string>();

    for (const item of selectedItems) {
      for (const sp of item.product!.prices) {
        if (sp.inStock) {
          allStoreIds.add(sp.storeId);
        }
      }
    }

    const results: { storeId: string; storeName: string; total: number; availableCount: number; totalCount: number }[] = [];

    for (const storeId of allStoreIds) {
      let total = 0;
      let availableCount = 0;
      let storeName = '';

      for (const item of selectedItems) {
        const storePrice = item.product!.prices.find(
          (p) => p.storeId === storeId && p.inStock
        );
        if (storePrice) {
          total += storePrice.price * item.quantity;
          availableCount++;
          storeName = storePrice.storeName;
        }
      }

      if (availableCount > 0) {
        results.push({
          storeId,
          storeName,
          total,
          availableCount,
          totalCount: selectedItems.length,
        });
      }
    }

    results.sort((a, b) => {
      // Prefer stores that have all items, then by total price
      if (a.availableCount === a.totalCount && b.availableCount !== b.totalCount) return -1;
      if (b.availableCount === b.totalCount && a.availableCount !== a.totalCount) return 1;
      return a.total - b.total;
    });

    return results;
  }, [items]);

  const totalPrice = getTotalPrice();
  const selectedCount = items.filter((i) => i.product).length;

  return (
    <div>
      <Tabs tabs={TABLE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider py-3 px-4">
                  Bilesen
                </th>
                <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider py-3 px-4">
                  Secim
                </th>
                <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider py-3 px-4">
                  Fiyat
                </th>
                <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider py-3 px-4">
                  Satin Al
                </th>
                <th className="w-10 py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <PartRow
                  key={item.category}
                  category={item.category}
                  product={item.product}
                  onSelect={() => setPickerCategory(item.category)}
                  onRemove={() => removePart(item.category)}
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--border-color)]">
                <td className="py-4 px-4" colSpan={2}>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {selectedCount} bilesen secildi
                  </span>
                </td>
                <td className="py-4 px-4" colSpan={3}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-secondary)]">Toplam:</span>
                    <span className="text-xl font-bold text-[var(--text-primary)]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="py-4">
          {selectedCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)]">
                Saticiya gore fiyat karsilastirmasi icin en az bir bilesen secin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeTotals.map((store) => (
                <Card key={store.storeId} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                      {store.storeName}
                    </h3>
                    {store.availableCount < store.totalCount && (
                      <span className="text-xs text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-full">
                        {store.availableCount}/{store.totalCount} urun mevcut
                      </span>
                    )}
                    {store.availableCount === store.totalCount && (
                      <span className="text-xs text-[#28A745] bg-[#28A745]/10 px-2 py-0.5 rounded-full">
                        Tum urunler mevcut
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {items
                      .filter((i) => i.product)
                      .map((item) => {
                        const sp = item.product!.prices.find(
                          (p) => p.storeId === store.storeId && p.inStock
                        );
                        return (
                          <div
                            key={item.category}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-[var(--text-secondary)] truncate mr-2">
                              {item.product!.name}
                            </span>
                            {sp ? (
                              <span className="text-[var(--text-primary)] font-medium whitespace-nowrap">
                                {formatPrice(sp.price)}
                              </span>
                            ) : (
                              <span className="text-[#DC3545] text-xs whitespace-nowrap">
                                Mevcut degil
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  <div className="border-t border-[var(--border-color)] pt-2 flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Toplam:</span>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                      {formatPrice(store.total)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Part Picker Modal */}
      {pickerCategory && (
        <PartPickerModal
          isOpen={pickerCategory !== null}
          onClose={() => setPickerCategory(null)}
          category={pickerCategory}
          onSelect={handleSelectPart}
        />
      )}
    </div>
  );
}

export default PartTable;
