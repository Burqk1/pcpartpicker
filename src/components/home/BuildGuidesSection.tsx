import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen } from 'lucide-react';
import { getGuides } from '@/services/api';
import type { BuildGuide } from '@/types';
import { formatPrice } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const gradientColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

export default function BuildGuidesSection() {
  const [guides, setGuides] = useState<BuildGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGuides()
      .then((data) => setGuides(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-7 h-7 text-[#0066FF]" />
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Yapı Rehberleri
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
            Kendi PC'nizi kurmak isteyip nereden başlayacağınızı bilmiyorsanız,
            çeşitli kullanım senaryoları ve bütçeler için yapı rehberlerimize göz atın.
          </p>
        </div>
        <Button as={Link} href="/rehberler" variant="secondary" size="md" className="shrink-0">
          Tüm Rehberleri Gör
        </Button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg h-80 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => {
            const cpuPart = guide.parts.find((p) => p.category === 'cpu');
            const gpuPart = guide.parts.find((p) => p.category === 'gpu');

            return (
              <Link key={guide.id} to={`/rehber/${guide.id}`}>
                <Card hover className="h-full flex flex-col">
                  {/* Gradient banner */}
                  <div
                    className="h-24 rounded-t-lg flex items-center justify-center"
                    style={{ background: gradientColors[index % gradientColors.length] }}
                  >
                    <BookOpen className="w-10 h-10 text-white/30" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-4">
                      {guide.title}
                    </h3>

                    <div className="space-y-2 text-sm text-[var(--text-secondary)] flex-1">
                      {cpuPart && (
                        <div className="flex items-start gap-2">
                          <span className="text-[var(--text-secondary)] opacity-60 shrink-0 font-medium">CPU:</span>
                          <span className="truncate">{cpuPart.productName}</span>
                        </div>
                      )}
                      {gpuPart && (
                        <div className="flex items-start gap-2">
                          <span className="text-[var(--text-secondary)] opacity-60 shrink-0 font-medium">GPU:</span>
                          <span className="truncate">{gpuPart.productName}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                      <span className="text-lg font-bold text-[var(--link-color)]">
                        {formatPrice(guide.totalPrice)}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                        <MessageSquare className="w-4 h-4" />
                        {guide.commentCount}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
