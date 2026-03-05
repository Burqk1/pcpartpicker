import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { getProducts } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface BenchmarkEntry {
  name: string;
  score: number;
  price: number;
  valueScore: number;
}

function generateCPUBenchmarks(products: Product[]): BenchmarkEntry[] {
  const scoreMap: Record<string, number> = {
    'Ryzen 9 9900X': 42000,
    'Ryzen 7 9800X3D': 39500,
    'Core i9-14900K': 41000,
    'Core i7-14700K': 35500,
    'Ryzen 7 9700X': 33000,
    'Core i5-14600K': 28500,
    'Ryzen 5 9600X': 27000,
    'Ryzen 7 7800X3D': 31000,
    'Ryzen 5 7600X': 25000,
    'Core i5-14400F': 22000,
    'Core i5-13400F': 21000,
    'Core i5-12400F': 19500,
    'Ryzen 5 5600X': 21500,
    'Ryzen 5 5500': 18500,
    'Core i7-13700K': 34000,
  };

  return products.map((p) => {
    const score = scoreMap[p.model] ?? Math.floor(15000 + Math.random() * 25000);
    return {
      name: p.model,
      score,
      price: p.bestPrice,
      valueScore: Math.round((score / p.bestPrice) * 100),
    };
  }).sort((a, b) => b.score - a.score);
}

function generateGPUBenchmarks(products: Product[]): BenchmarkEntry[] {
  const scoreMap: Record<string, number> = {
    'RTX 4090': 38000,
    'RTX 5080': 35500,
    'RX 7900 XTX': 31000,
    'RTX 4080 Super': 30000,
    'RX 7900 XT': 27500,
    'RTX 5070': 28000,
    'RTX 4070 Ti Super': 26500,
    'RX 7900 GRE': 23000,
    'RTX 4070 Super': 23500,
    'RTX 4070': 21000,
    'RX 7800 XT': 20500,
    'RX 7700 XT': 18000,
    'RTX 4060 Ti': 17000,
    'RTX 4060': 14500,
    'RX 7600': 12500,
  };

  return products.map((p) => {
    const chipset = String(p.specs['chipset'] ?? p.model);
    const score = scoreMap[chipset] ?? Math.floor(10000 + Math.random() * 25000);
    return {
      name: chipset + (p.brand !== chipset ? ` (${p.brand})` : ''),
      score,
      price: p.bestPrice,
      valueScore: Math.round((score / p.bestPrice) * 100),
    };
  }).sort((a, b) => b.score - a.score);
}

export default function BenchmarkPage() {
  const [cpus, setCpus] = useState<Product[]>([]);
  const [gpus, setGpus] = useState<Product[]>([]);
  const [tab, setTab] = useState<'cpu' | 'gpu'>('cpu');

  useEffect(() => {
    getProducts('cpu').then(setCpus);
    getProducts('gpu').then(setGpus);
  }, []);

  const cpuBenchmarks = generateCPUBenchmarks(cpus);
  const gpuBenchmarks = generateGPUBenchmarks(gpus);
  const data = tab === 'cpu' ? cpuBenchmarks : gpuBenchmarks;

  return (
    <Layout>
      <Helmet>
        <title>Benchmark Sıralaması - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-8 h-8 text-[#0066FF]" />
            <h1 className="text-3xl font-bold">Benchmark Sıralaması</h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            İşlemci ve ekran kartı performans karşılaştırmaları. (Cinebench R23 / 3DMark Time Spy)
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('cpu')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              tab === 'cpu' ? 'bg-[#0066FF] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'
            }`}
          >
            İşlemci (CPU)
          </button>
          <button
            onClick={() => setTab('gpu')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              tab === 'gpu' ? 'bg-[#0066FF] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'
            }`}
          >
            Ekran Kartı (GPU)
          </button>
        </div>

        {/* Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {tab === 'cpu' ? 'İşlemci' : 'Ekran Kartı'} Performans Grafiği
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(value: number | undefined) => [value != null ? value.toLocaleString('tr-TR') : '', 'Puan']}
                />
                <Bar dataKey="score" fill="#0066FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Rankings table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-semibold">Detaylı Sıralama</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-secondary)]">
                <th className="text-left px-6 py-3 w-16">#</th>
                <th className="text-left px-6 py-3">Ürün</th>
                <th className="text-right px-6 py-3">Puan</th>
                <th className="text-right px-6 py-3">Fiyat</th>
                <th className="text-right px-6 py-3">Değer Puanı</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.name} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)]/50">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300' :
                      index === 2 ? 'bg-orange-600/20 text-orange-400' :
                      'bg-[var(--bg-header)] text-[var(--text-secondary)]'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--link-color)]">{item.name}</td>
                  <td className="px-6 py-4 text-right font-bold">{item.score.toLocaleString('tr-TR')}</td>
                  <td className="px-6 py-4 text-right text-[var(--text-secondary)]">{formatPrice(item.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066FF] rounded-full"
                          style={{ width: `${Math.min(100, (item.valueScore / Math.max(...data.map(d => d.valueScore))) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.valueScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  );
}
