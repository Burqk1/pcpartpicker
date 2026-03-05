import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock, Pin, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const forumCategories = [
  { id: 'genel', name: 'Genel Tartışma', description: 'PC toplamak hakkında genel konuşmalar', threads: 234, color: '#0066FF' },
  { id: 'yardim', name: 'Yardım ve Destek', description: 'Teknik sorunlar ve çözümler', threads: 567, color: '#28A745' },
  { id: 'incelemeler', name: 'İncelemeler', description: 'Donanım incelemeleri ve karşılaştırmalar', threads: 123, color: '#FFC107' },
  { id: 'firsatlar', name: 'Fırsatlar ve İndirimler', description: 'Türkiye\'deki en iyi fırsatları paylaşın', threads: 89, color: '#DC3545' },
  { id: 'vitrin', name: 'Yapı Vitrini', description: 'Tamamlanan yapılarınızı sergileyin', threads: 345, color: '#6699FF' },
];

const recentThreads = [
  { id: '1', title: 'RTX 5070 vs RX 7900 XT - Hangi kart daha iyi?', category: 'genel', author: 'oyuncu42', replies: 23, views: 456, time: '2 saat önce', pinned: true },
  { id: '2', title: 'Ryzen 7 9800X3D stok sorunu - Ne zaman gelecek?', category: 'genel', author: 'amdFan', replies: 45, views: 891, time: '4 saat önce', pinned: true },
  { id: '3', title: 'Bütçe dostu 1080p oyun PC önerileri (₺15.000 altı)', category: 'yardim', author: 'yeniBaslayan', replies: 12, views: 234, time: '6 saat önce', pinned: false },
  { id: '4', title: 'Corsair 4000D Airflow incelemem - Fotoğraflarla', category: 'incelemeler', author: 'techReviewer', replies: 8, views: 167, time: '1 gün önce', pinned: false },
  { id: '5', title: 'Hepsiburada Black Friday indirimleri başladı!', category: 'firsatlar', author: 'firsatAvcisi', replies: 67, views: 1234, time: '1 gün önce', pinned: false },
  { id: '6', title: 'İlk PC toplamam - Tavsiyelerinizi bekliyorum', category: 'yardim', author: 'merakli', replies: 15, views: 289, time: '2 gün önce', pinned: false },
  { id: '7', title: 'DDR5 6000MHz vs 5600MHz - Fark var mı?', category: 'genel', author: 'ramExpert', replies: 19, views: 445, time: '2 gün önce', pinned: false },
  { id: '8', title: 'Samsung 990 Pro vs WD SN850X karşılaştırma', category: 'incelemeler', author: 'storageGuru', replies: 7, views: 156, time: '3 gün önce', pinned: false },
];

export default function ForumPage() {
  return (
    <Layout>
      <Helmet>
        <title>Forum - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-8 h-8 text-[#0066FF]" />
            <h1 className="text-3xl font-bold">Forum</h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            Toplulukla tartışın, sorular sorun ve deneyimlerinizi paylaşın.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {forumCategories.map((cat) => (
            <Card key={cat.id} hover className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                  <MessageSquare className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--link-color)]">{cat.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{cat.description}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">{cat.threads} konu</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent threads */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h2 className="text-xl font-semibold">Son Konular</h2>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {recentThreads.map((thread) => (
              <div key={thread.id} className="px-6 py-4 hover:bg-[var(--bg-primary)]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.pinned && (
                        <Pin className="w-3 h-3 text-[#FFC107]" />
                      )}
                      <Link to="#" className="font-medium text-[var(--link-color)] hover:underline">
                        {thread.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <Badge variant="default">{forumCategories.find(c => c.id === thread.category)?.name}</Badge>
                      <span>{thread.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {thread.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> {thread.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {thread.views}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
