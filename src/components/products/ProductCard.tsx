import { Link } from 'react-router-dom';
import {
  Cpu,
  MonitorSpeaker,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
} from 'lucide-react';
import type { Product, PartCategory } from '@/types';
import Card from '@/components/ui/Card';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

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

function getKeySpecs(product: Product): string[] {
  const specs = product.specs;
  switch (product.category) {
    case 'cpu':
      return [
        `${specs.cores} Çekirdek / ${specs.threads} İş Parçacığı`,
        `${specs.baseClock} - ${specs.boostClock} GHz`,
        `${specs.socket} | ${specs.tdp}W TDP`,
      ];
    case 'gpu':
      return [
        `${specs.chipset}`,
        `${specs.memory} ${specs.memoryType}`,
        `${specs.tdp}W TDP`,
      ];
    case 'motherboard':
      return [
        `${specs.socket} | ${specs.chipset}`,
        `${specs.formFactor} | ${specs.memoryType}`,
        `${specs.memorySlots} Bellek Yuvası | M.2: ${specs.m2Slots}`,
      ];
    case 'ram':
      return [
        `${specs.type} ${specs.speed} MHz`,
        `${specs.modules} (${specs.totalCapacity} GB)`,
        `CL${specs.casLatency}`,
      ];
    case 'storage':
      return [
        `${specs.type} | ${specs.capacity}`,
        `${specs.interface}`,
        specs.readSpeed ? `Okuma: ${specs.readSpeed} MB/s` : '',
      ].filter(Boolean);
    case 'psu':
      return [
        `${specs.wattage}W`,
        `${specs.efficiency}`,
        `${specs.modular}`,
      ];
    case 'case':
      return [
        `${specs.type}`,
        `Maks GPU: ${specs.maxGPULength}mm`,
        `${specs.sidePanel}`,
      ];
    case 'cpu-cooler':
      return [
        `${specs.type}`,
        `${specs.fanRPM}`,
        `${specs.noiseLevel}`,
      ];
    default:
      return [];
  }
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const Icon = categoryIcons[product.category] || Cpu;
  const gradient = categoryGradients[product.category] || categoryGradients.cpu;
  const keySpecs = getKeySpecs(product);

  if (viewMode === 'list') {
    return (
      <Card hover className="flex flex-row items-stretch">
        {/* Image placeholder */}
        <div
          className={`w-40 min-h-[140px] flex-shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <Icon size={40} className="text-[var(--text-secondary)]" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <Link
              to={`/urun/${product.id}`}
              className="text-[var(--link-color)] font-medium hover:underline line-clamp-1"
            >
              {product.name}
            </Link>
            <div className="mt-1 space-y-0.5">
              {keySpecs.map((spec, i) => (
                <p key={i} className="text-xs text-[var(--text-secondary)] truncate">
                  {spec}
                </p>
              ))}
            </div>
            <div className="mt-2">
              <Rating rating={product.rating} size="sm" reviewCount={product.reviewCount} />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-lg font-bold text-[var(--link-color)]">
              {formatPrice(product.bestPrice)}
            </span>
            <Button as={Link} href={`/urun/${product.id}`} size="sm" variant="primary">
              Fiyatları Gör
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card hover className="flex flex-col h-full">
      {/* Image placeholder with gradient */}
      <div
        className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <Icon size={48} className="text-[var(--text-secondary)]" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/urun/${product.id}`}
          className="text-[var(--link-color)] font-medium hover:underline line-clamp-2 text-sm"
        >
          {product.name}
        </Link>

        <div className="mt-2 space-y-0.5 flex-1">
          {keySpecs.slice(0, 3).map((spec, i) => (
            <p key={i} className="text-xs text-[var(--text-secondary)] truncate">
              {spec}
            </p>
          ))}
        </div>

        <div className="mt-3">
          <Rating rating={product.rating} size="sm" reviewCount={product.reviewCount} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-[var(--link-color)]">
            {formatPrice(product.bestPrice)}
          </span>
        </div>

        <div className="mt-3">
          <Button
            as={Link}
            href={`/urun/${product.id}`}
            size="sm"
            variant="primary"
            className="w-full"
          >
            Fiyatları Gör
          </Button>
        </div>
      </div>
    </Card>
  );
}
