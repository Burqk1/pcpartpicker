import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PartCategory, PartListItem, Product, CompatibilityIssue } from '@/types';
import { BUILDER_CATEGORIES } from '@/types';
import { checkCompatibility, calculateTotalTDP } from '@/lib/compatibility';
import { generateId } from '@/lib/utils';

interface PartListState {
  listId: string;
  items: PartListItem[];
  compatibilityIssues: CompatibilityIssue[];
  estimatedWattage: number;

  setPart: (category: PartCategory, product: Product) => void;
  removePart: (category: PartCategory) => void;
  clearAll: () => void;
  newList: () => void;
  getTotalPrice: () => number;
  getSelectedCount: () => number;
}

function createEmptyItems(): PartListItem[] {
  return BUILDER_CATEGORIES.map((cat) => ({
    category: cat,
    product: null,
    quantity: 1,
  }));
}

export const usePartListStore = create<PartListState>()(
  persist(
    (set, get) => ({
      listId: generateId(),
      items: createEmptyItems(),
      compatibilityIssues: [],
      estimatedWattage: 0,

      setPart: (category, product) => {
        const newItems = get().items.map((item) =>
          item.category === category ? { ...item, product } : item
        );
        const issues = checkCompatibility(newItems);
        const wattage = calculateTotalTDP(newItems);
        set({ items: newItems, compatibilityIssues: issues, estimatedWattage: wattage });
      },

      removePart: (category) => {
        const newItems = get().items.map((item) =>
          item.category === category ? { ...item, product: null } : item
        );
        const issues = checkCompatibility(newItems);
        const wattage = calculateTotalTDP(newItems);
        set({ items: newItems, compatibilityIssues: issues, estimatedWattage: wattage });
      },

      clearAll: () => {
        set({
          listId: generateId(),
          items: createEmptyItems(),
          compatibilityIssues: [],
          estimatedWattage: 0,
        });
      },

      newList: () => {
        set({
          listId: generateId(),
          items: createEmptyItems(),
          compatibilityIssues: [],
          estimatedWattage: 0,
        });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          if (item.product) {
            return total + item.product.bestPrice * item.quantity;
          }
          return total;
        }, 0);
      },

      getSelectedCount: () => {
        return get().items.filter((item) => item.product !== null).length;
      },
    }),
    { name: 'pcparca-partlist' }
  )
);
