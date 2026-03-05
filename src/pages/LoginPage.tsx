import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    // Mock login
    await new Promise((r) => setTimeout(r, 500));
    if (data.email === 'demo@pcparca.com' && data.password === 'demo123') {
      login({
        id: 'user-1',
        username: 'DemoKullanıcı',
        email: data.email,
        avatar: '',
        joinDate: '2024-01-01',
        builds: [],
        savedLists: [],
      });
      navigate('/profil');
    } else {
      // Accept any email/password for demo
      login({
        id: 'user-' + Date.now(),
        username: data.email.split('@')[0],
        email: data.email,
        avatar: '',
        joinDate: new Date().toISOString(),
        builds: [],
        savedLists: [],
      });
      navigate('/profil');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Giriş Yap - PCParçaSeçici</title>
      </Helmet>
      <div className="py-12 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#0066FF]/20 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h1 className="text-2xl font-bold">Giriş Yap</h1>
              <p className="text-[var(--text-secondary)] mt-2">Hesabınıza giriş yapın</p>
            </div>

            {error && (
              <div className="bg-[#DC3545]/20 text-[#DC3545] px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="E-posta"
                type="email"
                placeholder="ornek@email.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Şifre"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <input type="checkbox" className="rounded border-[var(--border-color)]" />
                  Beni hatırla
                </label>
                <Link to="#" className="text-[var(--link-color)] hover:underline">
                  Şifremi unuttum
                </Link>
              </div>

              <Button variant="primary" type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
              Hesabınız yok mu?{' '}
              <Link to="/kayit" className="text-[var(--link-color)] hover:underline font-medium">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
