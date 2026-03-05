import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';

const footerColumns = [
  {
    title: 'PCPARCASECICI',
    links: [
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Yapilandirici', path: '/liste' },
      { name: 'Urunler', path: '/urunler/cpu' },
      { name: 'Rehberler', path: '/rehberler' },
      { name: 'Tamamlanan Yapilar', path: '/yapilar' },
      { name: 'Trendler', path: '/trendler' },
      { name: 'Forum', path: '/forum' },
    ],
  },
  {
    title: 'Hesap',
    links: [
      { name: 'Giris Yap', path: '/giris' },
      { name: 'Kayit Ol', path: '/kayit' },
    ],
  },
  {
    title: 'Sirket',
    links: [
      { name: 'Hakkinda', path: '/hakkinda' },
      { name: 'Gizlilik Politikasi', path: '/gizlilik' },
      { name: 'Kullanim Kosullari', path: '/kosullar' },
      { name: 'Iletisim', path: '/iletisim' },
    ],
  },
  {
    title: 'Bilgi',
    links: [
      { name: 'Kullanici Davranis Kurallari', path: '/kurallar' },
      { name: 'SSS', path: '/sss' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-navbar)] border-t border-[var(--border-color)]">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {/* Footer Top - Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Box className="w-6 h-6 text-[var(--color-primary)]" />
          <span className="text-[var(--text-primary)] font-bold text-lg tracking-tight">
            PCPARCASECICI
          </span>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.path + link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline hover:no-underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <p className="text-center text-xs text-[var(--text-secondary)]">
            &copy;2025 PCParcaSecici. Tum haklari saklidir.
          </p>
        </div>
      </div>
    </footer>
  );
}
