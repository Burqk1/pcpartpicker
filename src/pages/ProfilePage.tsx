import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Calendar, LogOut, Settings, BookOpen, Monitor } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { timeAgo } from '@/lib/utils';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <User className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" />
          <h1 className="text-2xl font-bold mb-2">Giriş Yapmanız Gerekiyor</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Profilinizi görüntülemek için giriş yapın.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" as={Link} href="/giris">Giriş Yap</Button>
            <Button variant="secondary" as={Link} href="/kayit">Kayıt Ol</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <Helmet>
        <title>Profil - PCParçaSeçici</title>
      </Helmet>
      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#0066FF] flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-xl font-bold">{user.username}</h1>
                <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-1 mt-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
                <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" /> Katılım: {timeAgo(user.joinDate)}
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" /> Ayarlar
                </Button>
                <Button variant="danger" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
                </Button>
              </div>
            </Card>
          </div>

          {/* Content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Monitor className="w-6 h-6 mx-auto mb-2 text-[#0066FF]" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-[var(--text-secondary)]">Yapılar</div>
              </Card>
              <Card className="p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-[#28A745]" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-[var(--text-secondary)]">Rehberler</div>
              </Card>
              <Card className="p-4 text-center">
                <Settings className="w-6 h-6 mx-auto mb-2 text-[#FFC107]" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-[var(--text-secondary)]">Kayıtlı Listeler</div>
              </Card>
            </div>

            {/* Recent activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Son Aktivite</h2>
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <p>Henüz bir aktiviteniz yok.</p>
                <p className="mt-2">
                  <Link to="/liste" className="text-[var(--link-color)] hover:underline">
                    Yapılandırıcıya giderek
                  </Link>{' '}
                  ilk PC'nizi oluşturun!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
