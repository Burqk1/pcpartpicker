import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ArrowUp, MessageSquare, Monitor, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { getBuildById } from '@/services/api';
import { formatPrice, timeAgo } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/types';
import type { CompletedBuild } from '@/types';

export default function BuildDetailPage() {
  const { buildId } = useParams<{ buildId: string }>();
  const [build, setBuild] = useState<CompletedBuild | null>(null);

  useEffect(() => {
    if (buildId) {
      getBuildById(buildId).then((b) => setBuild(b ?? null));
    }
  }, [buildId]);

  if (!build) {
    return (
      <Layout>
        <div className="py-20 text-center text-[var(--text-secondary)]">Yükleniyor...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{build.title} - Tamamlanan Yapı - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
          <Link to="/" className="hover:text-[var(--link-color)]">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/yapilar" className="hover:text-[var(--link-color)]">Yapılar</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--text-primary)]">{build.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image placeholder */}
            <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg h-80 flex items-center justify-center">
              <Monitor className="w-24 h-24 text-white/20" />
            </div>

            {/* Description */}
            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-6">
              <h2 className="text-xl font-semibold mb-3">Açıklama</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{build.description}</p>
            </div>

            {/* Parts table */}
            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-semibold">Parça Listesi</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-xs uppercase text-[var(--text-secondary)]">
                    <th className="text-left px-6 py-3">Bileşen</th>
                    <th className="text-left px-6 py-3">Ürün</th>
                  </tr>
                </thead>
                <tbody>
                  {build.parts.map((part) => (
                    <tr key={part.category} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)]/50">
                      <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)] w-48">
                        {CATEGORY_LABELS[part.category]}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/urun/${part.productId}`} className="text-[var(--link-color)] hover:underline">
                          {part.productName}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[var(--bg-header)]">
                    <td className="px-6 py-4 font-bold">Toplam</td>
                    <td className="px-6 py-4 font-bold text-[var(--link-color)] text-lg">
                      {formatPrice(build.totalPrice)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-6">
              <h1 className="text-2xl font-bold mb-4">{build.title}</h1>
              {build.featured && (
                <Badge variant="warning" className="mb-3">Öne Çıkan Yapı</Badge>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center text-white font-bold">
                  {build.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{build.userName}</div>
                  <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {timeAgo(build.createdAt)}
                  </div>
                </div>
              </div>
              <div className="space-y-3 border-t border-[var(--border-color)] pt-4">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Toplam Fiyat</span>
                  <span className="font-bold text-[var(--link-color)]">{formatPrice(build.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">İşlemci</span>
                  <span className="text-sm">{build.cpuName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Ekran Kartı</span>
                  <span className="text-sm">{build.gpuName}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-color)]">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-header)] transition-colors">
                  <ArrowUp className="w-4 h-4" /> {build.upvotes}
                </button>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <MessageSquare className="w-4 h-4" /> {build.commentCount} yorum
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
