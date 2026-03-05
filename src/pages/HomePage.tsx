import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import BuildGuidesSection from '@/components/home/BuildGuidesSection';
import CompletedBuildsSection from '@/components/home/CompletedBuildsSection';

export default function HomePage() {
  return (
    <Layout fullWidth>
      <Helmet>
        <title>PCParçaSeçici - PC Parça Seçimi ve Uyumluluk</title>
      </Helmet>

      <HeroSection />

      {/* Guides Section - full width bg */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <BuildGuidesSection />
        </div>
      </section>

      {/* Builds Section - slightly different bg for contrast */}
      <section className="w-full bg-[var(--bg-card)]/30 py-16 md:py-20 border-t border-[var(--border-color)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <CompletedBuildsSection />
        </div>
      </section>
    </Layout>
  );
}
