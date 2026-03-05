import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { PricePoint } from '@/types';
import { formatPrice } from '@/lib/utils';

const TURKISH_MONTHS: Record<string, string> = {
  '01': 'Oca',
  '02': 'Şub',
  '03': 'Mar',
  '04': 'Nis',
  '05': 'May',
  '06': 'Haz',
  '07': 'Tem',
  '08': 'Ağu',
  '09': 'Eyl',
  '10': 'Eki',
  '11': 'Kas',
  '12': 'Ara',
};

const STORE_COLORS: Record<string, string> = {
  'amazon-tr': '#FF9900',
  hepsiburada: '#FF6000',
  n11: '#7B2D8E',
  vatan: '#E31E24',
  teknosa: '#F27A1A',
  mediamarkt: '#DF0000',
  trendyol: '#F27A1A',
  itopya: '#00AEEF',
  incehesap: '#1BAE70',
  gamegaraj: '#8B5CF6',
};

function formatDateTurkish(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;
  const month = TURKISH_MONTHS[parts[1]] || parts[1];
  return `${month} ${parts[0]}`;
}

interface PriceHistoryChartProps {
  priceHistory: PricePoint[];
}

interface ChartDataPoint {
  date: string;
  dateLabel: string;
  [key: string]: string | number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--text-secondary)]">{entry.name}:</span>
          <span className="font-medium text-[var(--text-primary)]">
            {formatPrice(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps) {
  const { chartData, stores } = useMemo(() => {
    // Group data by store
    const storeSet = new Set<string>();
    priceHistory.forEach((p) => storeSet.add(p.store));
    const storeNames = Array.from(storeSet);

    // Group by date
    const dateMap = new Map<string, Record<string, number>>();
    priceHistory.forEach((p) => {
      if (!dateMap.has(p.date)) {
        dateMap.set(p.date, {});
      }
      dateMap.get(p.date)![p.store] = p.price;
    });

    // Sort by date
    const sortedDates = Array.from(dateMap.keys()).sort();

    const data: ChartDataPoint[] = sortedDates.map((date) => {
      const point: ChartDataPoint = {
        date,
        dateLabel: formatDateTurkish(date),
      };
      const pricesForDate = dateMap.get(date)!;
      for (const store of storeNames) {
        if (pricesForDate[store] !== undefined) {
          point[store] = pricesForDate[store];
        }
      }
      return point;
    });

    return { chartData: data, stores: storeNames };
  }, [priceHistory]);

  if (priceHistory.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-8 text-center">
        <p className="text-[var(--text-secondary)]">Fiyat geçmişi verisi bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Fiyat Geçmişi
      </h3>
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
            <XAxis
              dataKey="dateLabel"
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            {stores.length > 1 && (
              <Legend
                wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
              />
            )}
            {stores.map((store) => (
              <Line
                key={store}
                type="monotone"
                dataKey={store}
                name={store}
                stroke={STORE_COLORS[store] || '#6699FF'}
                strokeWidth={2}
                dot={{ r: 4, fill: STORE_COLORS[store] || '#6699FF' }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
