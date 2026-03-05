import type { PartCategory } from '@/types';

const SPEC_LABELS: Record<string, string> = {
  // CPU
  socket: 'Soket',
  cores: 'Çekirdek',
  threads: 'İş Parçacığı',
  baseClock: 'Temel Saat',
  boostClock: 'Boost Saat',
  cache: 'Önbellek',
  tdp: 'TDP',
  integratedGraphics: 'Dahili Grafik',
  architecture: 'Mimari',

  // GPU
  chipset: 'Yonga Seti',
  memory: 'Bellek',
  memoryType: 'Bellek Türü',
  coreClock: 'Çekirdek Saat',
  length: 'Uzunluk',
  outputs: 'Çıkışlar',
  powerConnector: 'Güç Konnektörü',

  // Motherboard
  formFactor: 'Form Faktörü',
  memorySlots: 'Bellek Yuvaları',
  maxMemory: 'Maksimum Bellek',
  m2Slots: 'M.2 Yuvaları',
  sataSlots: 'SATA Yuvaları',
  pciSlots: 'PCI Yuvaları',
  wifi: 'Wi-Fi',
  bluetooth: 'Bluetooth',

  // RAM
  type: 'Tür',
  speed: 'Hız',
  modules: 'Modüller',
  totalCapacity: 'Toplam Kapasite',
  casLatency: 'CAS Gecikmesi',
  voltage: 'Voltaj',
  rgb: 'RGB',

  // Storage
  capacity: 'Kapasite',
  interface: 'Arayüz',
  readSpeed: 'Okuma Hızı',
  writeSpeed: 'Yazma Hızı',
  rpm: 'Devir (RPM)',

  // PSU
  wattage: 'Güç',
  efficiency: 'Verimlilik',
  modular: 'Modülerlik',
  fanSize: 'Fan Boyutu',
  connectors: 'Konnektörler',

  // Case
  maxGPULength: 'Maks. GPU Uzunluğu',
  maxCoolerHeight: 'Maks. Soğutucu Yüksekliği',
  driveBays: 'Sürücü Yuvaları',
  expansionSlots: 'Genişleme Yuvaları',
  frontIO: 'Ön Panel I/O',
  fans: 'Fanlar',
  sidePanel: 'Yan Panel',

  // Cooler
  fanRPM: 'Fan Devri',
  noiseLevel: 'Gürültü Seviyesi',
  height: 'Yükseklik',
  radiatorSize: 'Radyatör Boyutu',
  sockets: 'Desteklenen Soketler',
};

function formatSpecValue(key: string, value: string | number | boolean | string[], _category: PartCategory): string {
  if (typeof value === 'boolean') {
    return value ? 'Var' : 'Yok';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Add units based on key
  if (typeof value === 'number') {
    if (key === 'baseClock' || key === 'boostClock' || key === 'coreClock') {
      return `${value} ${value >= 100 ? 'MHz' : 'GHz'}`;
    }
    if (key === 'tdp' || key === 'wattage') return `${value}W`;
    if (key === 'length' || key === 'maxGPULength' || key === 'maxCoolerHeight' || key === 'height') return `${value} mm`;
    if (key === 'maxMemory' || key === 'totalCapacity') return `${value} GB`;
    if (key === 'speed') return `${value} MHz`;
    if (key === 'voltage') return `${value}V`;
    if (key === 'casLatency') return `CL${value}`;
    if (key === 'fanSize') return `${value} mm`;
    if (key === 'readSpeed' || key === 'writeSpeed') return `${value} MB/s`;
    if (key === 'radiatorSize') return `${value} mm`;
  }

  return String(value);
}

interface SpecsTableProps {
  specs: Record<string, string | number | boolean | string[]>;
  category: PartCategory;
}

export default function SpecsTable({ specs, category }: SpecsTableProps) {
  const entries = Object.entries(specs).filter(
    ([, val]) => val !== undefined && val !== null && val !== ''
  );

  if (entries.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-8 text-center">
        <p className="text-[var(--text-secondary)]">Teknik özellik bilgisi bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Teknik Özellikler
        </h3>
      </div>
      <table className="w-full">
        <tbody>
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              className={`border-t border-[var(--border-color)] ${
                idx % 2 === 0 ? 'bg-[var(--bg-header)]/30' : ''
              }`}
            >
              <td className="px-6 py-3 text-sm font-medium text-[var(--text-secondary)] w-1/3 sm:w-1/4">
                {SPEC_LABELS[key] || key}
              </td>
              <td className="px-6 py-3 text-sm text-[var(--text-primary)]">
                {formatSpecValue(key, value, category)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
