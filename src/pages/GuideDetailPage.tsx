import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { getGuideById } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/types';
import type { BuildGuide } from '@/types';

export default function GuideDetailPage() {
  const { guideId } = useParams<{ guideId: string }>();
  const [guide, setGuide] = useState<BuildGuide | null>(null);

  useEffect(() => {
    if (guideId) {
      getGuideById(guideId).then((g) => setGuide(g ?? null));
    }
  }, [guideId]);

  if (!guide) {
    return (
      <Layout>
        <div className="py-20 text-center text-[var(--text-secondary)]">Yükleniyor...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{guide.title} - Yapı Rehberi - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
          <Link to="/" className="hover:text-[var(--link-color)]">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/rehberler" className="hover:text-[var(--link-color)]">Rehberler</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--text-primary)]">{guide.title}</span>
        </nav>

        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-6 mb-6">
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#0066FF]/20 text-[#6699FF] mb-3">
            {guide.useCase}
          </span>
          <h1 className="text-3xl font-bold mb-3">{guide.title}</h1>
          <p className="text-[var(--text-secondary)] max-w-3xl mb-4">{guide.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-[var(--link-color)]">
              {formatPrice(guide.totalPrice)}
            </span>
            <Button variant="primary" as={Link} href="/liste">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Yapılandırıcıda Aç
            </Button>
          </div>
        </div>

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
              {guide.parts.map((part) => (
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
                  {formatPrice(guide.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Layout>
  );
}
