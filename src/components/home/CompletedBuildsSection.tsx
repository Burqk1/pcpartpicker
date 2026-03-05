import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ArrowUp, MessageSquare } from 'lucide-react';
import { getBuilds } from '@/services/api';
import type { CompletedBuild } from '@/types';
import { formatPrice } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const placeholderGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

function getAvatarColor(name: string): string {
  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function CompletedBuildsSection() {
  const [builds, setBuilds] = useState<CompletedBuild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBuilds()
      .then((data) => setBuilds(data.slice(0, 6)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-7 h-7 text-[#0066FF]" />
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Tamamlanan Yapılar
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
            Kullanıcıların parça listelerini, fotoğraflarını ve genel yapı
            deneyimlerini gösteren binlerce PC'ye göz atın.
          </p>
        </div>
        <Button as={Link} href="/yapilar" variant="secondary" size="md" className="shrink-0">
          Tüm Yapıları Gör
        </Button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg h-[420px] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {builds.map((build, index) => (
            <Link key={build.id} to={`/yapi/${build.id}`} className="block">
              <Card hover className="flex flex-col h-full">
                {/* Image area */}
                <div
                  className="relative h-[220px] flex items-center justify-center rounded-t-lg"
                  style={{ background: placeholderGradients[index % placeholderGradients.length] }}
                >
                  <Monitor className="w-16 h-16 text-white/20" />

                  {build.featured && (
                    <span className="absolute top-3 left-3 bg-[#f59e0b] text-black text-xs font-semibold px-2.5 py-1 rounded-md">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* User info */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: getAvatarColor(build.userName) }}
                    >
                      {build.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {build.userName}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg text-[var(--link-color)] mb-3 line-clamp-1">
                    {build.title}
                  </h3>

                  {/* Specs */}
                  <div className="text-sm text-[var(--text-secondary)] space-y-1 flex-1">
                    <p className="truncate">{build.cpuName}</p>
                    <p className="truncate">{build.gpuName}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--link-color)]">
                      {formatPrice(build.totalPrice)}
                    </span>

                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4" />
                        {build.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {build.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
