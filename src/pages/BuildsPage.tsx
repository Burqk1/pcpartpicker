import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Monitor, ArrowUp, MessageSquare, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getBuilds } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import type { CompletedBuild } from '@/types';

const buildGradients = [
  'from-violet-600 to-blue-600',
  'from-cyan-600 to-blue-600',
  'from-emerald-600 to-teal-600',
  'from-orange-600 to-amber-600',
  'from-rose-600 to-pink-600',
  'from-indigo-600 to-purple-600',
];

export default function BuildsPage() {
  const [builds, setBuilds] = useState<CompletedBuild[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'price'>('recent');

  useEffect(() => {
    getBuilds().then(setBuilds);
  }, []);

  const sortedBuilds = [...builds].sort((a, b) => {
    if (sortBy === 'popular') return b.upvotes - a.upvotes;
    if (sortBy === 'price') return b.totalPrice - a.totalPrice;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Layout>
      <Helmet>
        <title>Tamamlanan Yapılar - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Monitor className="w-8 h-8 text-[#0066FF]" />
              <h1 className="text-3xl font-bold">Tamamlanan Yapılar</h1>
            </div>
            <p className="text-[var(--text-secondary)]">
              Kullanıcıların parça listelerini, fotoğraflarını ve deneyimlerini keşfedin.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            {(['recent', 'popular', 'price'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === s
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {s === 'recent' ? 'En Yeni' : s === 'popular' ? 'En Popüler' : 'En Pahalı'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBuilds.map((build, index) => (
            <Link key={build.id} to={`/yapi/${build.id}`}>
              <Card hover className="h-full">
                <div className={`h-48 bg-gradient-to-br ${buildGradients[index % buildGradients.length]} flex items-center justify-center relative`}>
                  <Monitor className="w-20 h-20 text-white/20" />
                  {build.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="warning">
                        <Star className="w-3 h-3 inline mr-1" />
                        Öne Çıkan
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-white text-sm font-bold">
                      {build.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{build.userName}</span>
                  </div>
                  <h3 className="font-semibold text-[var(--link-color)] mb-2">{build.title}</h3>
                  <div className="text-sm text-[var(--text-secondary)] space-y-1 mb-3">
                    <div>{build.cpuName}</div>
                    <div>{build.gpuName}</div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                    <span className="font-bold text-[var(--link-color)]">{formatPrice(build.totalPrice)}</span>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4" /> {build.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" /> {build.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
