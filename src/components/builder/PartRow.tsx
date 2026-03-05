import {
  Cpu,
  Fan,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Monitor,
  Zap,
  Box,
  Wind,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  AppWindow,
  type LucideIcon,
} from 'lucide-react';
import type { PartCategory, Product } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface PartRowProps {
  category: PartCategory;
  product: Product | null;
  onSelect: () => void;
  onRemove: () => void;
}

const CATEGORY_ICONS: Record<PartCategory, LucideIcon> = {
  'cpu': Cpu,
  'cpu-cooler': Fan,
  'motherboard': CircuitBoard,
  'ram': MemoryStick,
  'storage': HardDrive,
  'gpu': Monitor,
  'psu': Zap,
  'case': Box,
  'case-fan': Wind,
  'monitor': Monitor,
  'keyboard': Keyboard,
  'mouse': Mouse,
  'headset': Headphones,
  'speaker': Speaker,
  'webcam': Monitor,
  'sound-card': Speaker,
  'wired-network': CircuitBoard,
  'wireless-network': CircuitBoard,
  'os': AppWindow,
  'thermal-paste': Fan,
  'external-storage': HardDrive,
  'optical-drive': HardDrive,
  'ups': Zap,
};

function getMainSpec(product: Product): string {
  const specs = product.specs;
  switch (product.category) {
    case 'cpu':
      return `${specs.cores} Cekirdek / ${specs.threads} Is Parcacigi, ${specs.baseClock}GHz`;
    case 'cpu-cooler':
      return `${specs.type}${specs.fanRPM ? `, ${specs.fanRPM}` : ''}`;
    case 'motherboard':
      return `${specs.socket}, ${specs.chipset}, ${specs.formFactor}`;
    case 'ram':
      return `${specs.type} ${specs.speed}MHz, ${specs.modules}`;
    case 'storage':
      return `${specs.type} ${specs.capacity}${specs.interface ? `, ${specs.interface}` : ''}`;
    case 'gpu':
      return `${specs.chipset}, ${specs.memory}`;
    case 'psu':
      return `${specs.wattage}W, ${specs.efficiency}`;
    case 'case':
      return `${specs.type}${specs.sidePanel ? `, ${specs.sidePanel}` : ''}`;
    default:
      return '';
  }
}

function PartRow({ category, product, onSelect, onRemove }: PartRowProps) {
  const Icon = CATEGORY_ICONS[category] ?? Box;
  const label = CATEGORY_LABELS[category];

  const bestStorePrice = product
    ? product.prices.find((p) => p.price === product.bestPrice && p.inStock)
    : null;

  return (
    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-header)]/50 transition-colors group">
      {/* Category */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center shrink-0">
            <Icon size={16} className="text-[var(--link-color)]" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
            {label}
          </span>
        </div>
      </td>

      {/* Selection */}
      <td className="py-3 px-4">
        {product ? (
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 object-contain rounded bg-white/5 p-0.5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--link-color)] truncate max-w-[300px]">
                {product.name}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate max-w-[300px]">
                {getMainSpec(product)}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-[var(--text-secondary)] italic">Parca secilmedi</span>
        )}
      </td>

      {/* Price */}
      <td className="py-3 px-4">
        {product ? (
          <div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {formatPrice(product.bestPrice)}
            </span>
            {bestStorePrice && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {bestStorePrice.storeName}
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-[var(--text-secondary)]">-</span>
        )}
      </td>

      {/* Buy / Select */}
      <td className="py-3 px-4">
        {product ? (
          <div className="flex items-center gap-2">
            {bestStorePrice && (
              <a
                href={bestStorePrice.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="success" size="sm">
                  Satin Al
                </Button>
              </a>
            )}
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={onSelect}>
            + Parca Sec
          </Button>
        )}
      </td>

      {/* Remove */}
      <td className="py-3 px-2 w-10">
        {product ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSelect} className="text-xs">
              Degistir
            </Button>
            <button
              onClick={onRemove}
              className="text-[var(--text-secondary)] hover:text-[#DC3545] transition-colors p-1 rounded hover:bg-[#DC3545]/10"
              title="Kaldir"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>
        ) : null}
      </td>
    </tr>
  );
}

export default PartRow;
