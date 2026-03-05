export type PartCategory =
  | 'cpu'
  | 'cpu-cooler'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'gpu'
  | 'psu'
  | 'case'
  | 'case-fan'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headset'
  | 'speaker'
  | 'webcam'
  | 'sound-card'
  | 'wired-network'
  | 'wireless-network'
  | 'os'
  | 'thermal-paste'
  | 'external-storage'
  | 'optical-drive'
  | 'ups';

export const CATEGORY_LABELS: Record<PartCategory, string> = {
  'cpu': 'İşlemci',
  'cpu-cooler': 'CPU Soğutucu',
  'motherboard': 'Anakart',
  'ram': 'RAM',
  'storage': 'Depolama',
  'gpu': 'Ekran Kartı',
  'psu': 'Güç Kaynağı',
  'case': 'Kasa',
  'case-fan': 'Kasa Fanı',
  'monitor': 'Monitör',
  'keyboard': 'Klavye',
  'mouse': 'Mouse',
  'headset': 'Kulaklık',
  'speaker': 'Hoparlör',
  'webcam': 'Webcam',
  'sound-card': 'Ses Kartı',
  'wired-network': 'Kablolu Ağ',
  'wireless-network': 'Kablosuz Ağ',
  'os': 'İşletim Sistemi',
  'thermal-paste': 'Termal Macun',
  'external-storage': 'Harici Disk',
  'optical-drive': 'Optik Sürücü',
  'ups': 'UPS',
};

export const BUILDER_CATEGORIES: PartCategory[] = [
  'cpu', 'cpu-cooler', 'motherboard', 'ram', 'storage',
  'gpu', 'psu', 'case', 'case-fan', 'monitor',
  'keyboard', 'mouse', 'headset', 'speaker', 'os',
];

export interface StorePrice {
  storeId: string;
  storeName: string;
  price: number;
  url: string;
  inStock: boolean;
  shippingCost: number;
  dataSource?: 'live' | 'cache' | 'mock';
  scrapedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: PartCategory;
  brand: string;
  model: string;
  image: string;
  specs: Record<string, string | number | boolean | string[]>;
  prices: StorePrice[];
  bestPrice: number;
  rating: number;
  reviewCount: number;
  tdp?: number;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  date: string;
  price: number;
  store: string;
}

export interface CPU extends Product {
  category: 'cpu';
  specs: {
    socket: string;
    cores: number;
    threads: number;
    baseClock: number;
    boostClock: number;
    cache: string;
    tdp: number;
    integratedGraphics: string;
    architecture: string;
  };
}

export interface CPUCooler extends Product {
  category: 'cpu-cooler';
  specs: {
    type: 'Hava' | 'Sıvı';
    fanRPM: string;
    noiseLevel: string;
    height?: number;
    radiatorSize?: number;
    sockets: string[];
  };
}

export interface Motherboard extends Product {
  category: 'motherboard';
  specs: {
    socket: string;
    formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
    chipset: string;
    memoryType: 'DDR4' | 'DDR5';
    memorySlots: number;
    maxMemory: number;
    m2Slots: number;
    sataSlots: number;
    pciSlots: string;
    wifi: boolean;
    bluetooth: boolean;
  };
}

export interface RAM extends Product {
  category: 'ram';
  specs: {
    type: 'DDR4' | 'DDR5';
    speed: number;
    modules: string;
    totalCapacity: number;
    casLatency: number;
    voltage: number;
    rgb: boolean;
  };
}

export interface Storage extends Product {
  category: 'storage';
  specs: {
    type: 'SSD' | 'HDD' | 'NVMe';
    capacity: string;
    interface: string;
    formFactor: string;
    readSpeed?: number;
    writeSpeed?: number;
    rpm?: number;
    cache?: string;
  };
}

export interface GPU extends Product {
  category: 'gpu';
  specs: {
    chipset: string;
    memory: string;
    memoryType: string;
    coreClock: number;
    boostClock: number;
    length: number;
    tdp: number;
    outputs: string;
    powerConnector: string;
  };
}

export interface PSU extends Product {
  category: 'psu';
  specs: {
    wattage: number;
    efficiency: string;
    modular: 'Tam Modüler' | 'Yarı Modüler' | 'Modüler Değil';
    formFactor: string;
    fanSize: number;
    connectors: string;
  };
}

export interface Case extends Product {
  category: 'case';
  specs: {
    type: string;
    formFactor: string[];
    maxGPULength: number;
    maxCoolerHeight: number;
    driveBays: string;
    expansionSlots: number;
    frontIO: string;
    fans: string;
    sidePanel: string;
  };
}

export interface PartListItem {
  category: PartCategory;
  product: Product | null;
  quantity: number;
}

export interface PartList {
  id: string;
  name: string;
  items: PartListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  parts: PartCategory[];
}

export interface CompletedBuild {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar: string;
  images: string[];
  parts: { category: PartCategory; productId: string; productName: string }[];
  totalPrice: number;
  upvotes: number;
  commentCount: number;
  createdAt: string;
  featured: boolean;
  cpuName: string;
  gpuName: string;
}

export interface BuildGuide {
  id: string;
  title: string;
  description: string;
  useCase: string;
  budget: string;
  parts: { category: PartCategory; productId: string; productName: string }[];
  totalPrice: number;
  commentCount: number;
  image: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  builds: string[];
  savedLists: string[];
}

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  authorId: string;
  authorName: string;
  content: string;
  replies: number;
  views: number;
  lastActivity: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  url: string;
  color: string;
}
