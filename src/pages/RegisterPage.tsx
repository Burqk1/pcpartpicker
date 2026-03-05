import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await new Promise((r) => setTimeout(r, 500));
    login({
      id: 'user-' + Date.now(),
      username: data.username,
      email: data.email,
      avatar: '',
      joinDate: new Date().toISOString(),
      builds: [],
      savedLists: [],
    });
    navigate('/profil');
  };

  return (
    <Layout>
      <Helmet>
        <title>Kayıt Ol - PCParçaSeçici</title>
      </Helmet>
      <div className="py-12 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#28A745]/20 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-[#28A745]" />
              </div>
              <h1 className="text-2xl font-bold">Kayıt Ol</h1>
              <p className="text-[var(--text-secondary)] mt-2">Yeni bir hesap oluşturun</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Kullanıcı Adı"
                placeholder="kullanici_adi"
                icon={User}
                error={errors.username?.message}
                {...register('username')}
              />
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
              <Input
                label="Şifre Tekrar"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="checkbox" required className="rounded border-[var(--border-color)]" />
                <span>
                  <Link to="#" className="text-[var(--link-color)] hover:underline">Kullanım Koşullarını</Link>
                  {' '}ve{' '}
                  <Link to="#" className="text-[var(--link-color)] hover:underline">Gizlilik Politikasını</Link>
                  {' '}kabul ediyorum
                </span>
              </label>

              <Button variant="success" type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
              Zaten hesabınız var mı?{' '}
              <Link to="/giris" className="text-[var(--link-color)] hover:underline font-medium">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
