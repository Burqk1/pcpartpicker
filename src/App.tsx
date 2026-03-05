import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = React.lazy(() => import('@/pages/HomePage'));
const BuilderPage = React.lazy(() => import('@/pages/BuilderPage'));
const ProductListPage = React.lazy(() => import('@/pages/ProductListPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const GuidesPage = React.lazy(() => import('@/pages/GuidesPage'));
const GuideDetailPage = React.lazy(() => import('@/pages/GuideDetailPage'));
const BuildsPage = React.lazy(() => import('@/pages/BuildsPage'));
const BuildDetailPage = React.lazy(() => import('@/pages/BuildDetailPage'));
const TrendsPage = React.lazy(() => import('@/pages/TrendsPage'));
const BenchmarkPage = React.lazy(() => import('@/pages/BenchmarkPage'));
const ForumPage = React.lazy(() => import('@/pages/ForumPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm">Yukleniyor...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/liste" element={<BuilderPage />} />
        <Route path="/liste/:listId" element={<BuilderPage />} />
        <Route path="/urunler/:category" element={<ProductListPage />} />
        <Route path="/urun/:productId" element={<ProductDetailPage />} />
        <Route path="/rehberler" element={<GuidesPage />} />
        <Route path="/rehber/:guideId" element={<GuideDetailPage />} />
        <Route path="/yapilar" element={<BuildsPage />} />
        <Route path="/yapi/:buildId" element={<BuildDetailPage />} />
        <Route path="/trendler" element={<TrendsPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route path="/profil" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  );
}
