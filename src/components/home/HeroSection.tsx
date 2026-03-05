import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#0D0E1A] via-[#1B1D2E] to-[#2A2D45] border-b border-[var(--border-color)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
            Parçaları Seç. PC'ni Kur.
            <br />
            <span className="text-[#6699FF]">Karşılaştır</span> ve <span className="text-[#6699FF]">Paylaş.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Kendin yapım bilgisayar kurucuları için parça seçimi, fiyatlandırma
            ve uyumluluk rehberliği sunuyoruz.
          </p>

          <div className="mt-12">
            <Button as={Link} href="/liste" size="lg" variant="primary" className="text-lg px-8 py-4">
              <Wrench className="w-5 h-5 mr-2" />
              Yapılandırmaya Başla
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
