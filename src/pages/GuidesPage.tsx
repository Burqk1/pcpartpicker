import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { getGuides } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import type { BuildGuide } from '@/types';

const gradients = [
  'from-blue-600 to-purple-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-red-600',
  'from-pink-600 to-rose-600',
];

export default function GuidesPage() {
  const [guides, setGuides] = useState<BuildGuide[]>([]);

  useEffect(() => {
    getGuides().then(setGuides);
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Yapı Rehberleri - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-[#0066FF]" />
            <h1 className="text-3xl font-bold">Yapı Rehberleri</h1>
          </div>
          <p className="text-[var(--text-secondary)] max-w-3xl">
            Kendi PC'nizi kurmak isteyip nereden başlayacağınızı bilmiyorsanız, çeşitli kullanım
            senaryoları ve bütçeler için yapı rehberlerimize göz atın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, index) => (
            <Link key={guide.id} to={`/rehber/${guide.id}`}>
              <Card hover className="h-full">
                <div className={`h-40 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
                  <BookOpen className="w-16 h-16 text-white/30" />
                </div>
                <div className="p-5">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#0066FF]/20 text-[#6699FF] mb-3">
                    {guide.useCase}
                  </span>
                  <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    {guide.parts.slice(0, 4).map((part) => (
                      <div key={part.category} className="text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--text-primary)]">{part.productName}</span>
                      </div>
                    ))}
                    {guide.parts.length > 4 && (
                      <div className="text-sm text-[var(--text-secondary)]">
                        +{guide.parts.length - 4} parça daha
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                    <span className="text-lg font-bold text-[var(--link-color)]">
                      {formatPrice(guide.totalPrice)}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                      <MessageSquare className="w-4 h-4" />
                      <span>{guide.commentCount}</span>
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
