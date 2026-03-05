import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Wrench,
  Monitor,
  BookOpen,
  Building,
  BarChart3,
  Award,
  MessageSquare,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const productCategories = {
  'Bilesenler': [
    { name: 'Islemci', path: '/urunler/cpu' },
    { name: 'CPU Sogutucu', path: '/urunler/cpu-cooler' },
    { name: 'Anakart', path: '/urunler/motherboard' },
    { name: 'RAM', path: '/urunler/ram' },
    { name: 'Depolama', path: '/urunler/storage' },
    { name: 'Ekran Karti', path: '/urunler/gpu' },
    { name: 'Guc Kaynagi', path: '/urunler/psu' },
    { name: 'Kasa', path: '/urunler/case' },
  ],
  'Cevre Birimleri': [
    { name: 'Kulaklik', path: '/urunler/headset' },
    { name: 'Klavye', path: '/urunler/keyboard' },
    { name: 'Mouse', path: '/urunler/mouse' },
    { name: 'Hoparlor', path: '/urunler/speaker' },
    { name: 'Webcam', path: '/urunler/webcam' },
  ],
  'Ekranlar': [
    { name: 'Monitor', path: '/urunler/monitor' },
  ],
  'Genisleme': [
    { name: 'Ses Karti', path: '/urunler/sound-card' },
    { name: 'Kablolu Ag', path: '/urunler/wired-network' },
    { name: 'Kablosuz Ag', path: '/urunler/wireless-network' },
  ],
  'Aksesuar': [
    { name: 'Kasa Fani', path: '/urunler/case-fan' },
    { name: 'Termal Macun', path: '/urunler/thermal-paste' },
    { name: 'UPS', path: '/urunler/ups' },
  ],
};

const navLinks = [
  { name: 'Yapilandirici', path: '/liste', icon: Wrench },
  { name: 'Urunler', path: '#', icon: Monitor, hasDropdown: true },
  { name: 'Rehberler', path: '/rehberler', icon: BookOpen },
  { name: 'Tamamlanan Yapilar', path: '/yapilar', icon: Building },
  { name: 'Trendler', path: '/trendler', icon: BarChart3 },
  { name: 'Benchmark', path: '/benchmark', icon: Award },
  { name: 'Forum', path: '/forum', icon: MessageSquare },
];

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/urunler/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-[var(--bg-navbar)] border-b border-[var(--border-color)]">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline hover:no-underline">
            <Box className="w-7 h-7 text-[var(--color-primary)]" />
            <span className="text-[var(--text-primary)] font-bold text-lg tracking-tight">
              PCPARCASECICI
            </span>
          </Link>

          {/* Right: Auth buttons, Flag, Theme toggle */}
          <div className="flex items-center gap-3">
            {/* Auth buttons - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/giris"
                className="px-4 py-1.5 text-sm border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors no-underline hover:no-underline"
              >
                Giris Yap
              </Link>
              <Link
                to="/kayit"
                className="px-4 py-1.5 text-sm border border-[var(--color-primary)] rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors no-underline hover:no-underline"
              >
                Kayit Ol
              </Link>
            </div>

            {/* TR Flag Dropdown (visual only) */}
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors cursor-default">
              <span className="text-base">🇹🇷</span>
              <span className="hidden sm:inline text-xs">TR</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Tema degistir"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Desktop Navigation */}
      <div className="hidden lg:block bg-[var(--bg-navbar)] border-b border-[var(--border-color)]" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-navbar) 85%, var(--bg-card))' }}>
        <div className="max-w-[1400px] mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                ref={link.hasDropdown ? dropdownRef : undefined}
                onMouseEnter={link.hasDropdown ? handleDropdownEnter : undefined}
                onMouseLeave={link.hasDropdown ? handleDropdownLeave : undefined}
              >
                {link.hasDropdown ? (
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors no-underline hover:no-underline"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                )}

                {/* Mega Dropdown */}
                {link.hasDropdown && isProductsDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-0 w-[700px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 grid grid-cols-3 gap-6"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {Object.entries(productCategories).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                          {category}
                        </h4>
                        <ul className="space-y-1">
                          {items.map((item) => (
                            <li key={item.path}>
                              <Link
                                to={item.path}
                                className="block px-2 py-1 text-sm text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-primary)] transition-colors no-underline hover:no-underline"
                                onClick={() => setIsProductsDropdownOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            aria-label="Ara"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar (slide-down) */}
      <div
        className={`bg-[var(--bg-navbar)] border-b border-[var(--border-color)] overflow-hidden transition-all duration-300 ${
          isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Urun, kategori veya marka ara..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Ara
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Aramay\u0131 kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Side Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Side Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[var(--bg-navbar)] border-r border-[var(--border-color)] overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* Auth buttons on mobile */}
              <div className="flex gap-2 pb-4 border-b border-[var(--border-color)]">
                <Link
                  to="/giris"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors no-underline hover:no-underline"
                >
                  Giris Yap
                </Link>
                <Link
                  to="/kayit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm border border-[var(--color-primary)] rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors no-underline hover:no-underline"
                >
                  Kayit Ol
                </Link>
              </div>

              {/* Search on mobile */}
              <div className="pb-4 border-b border-[var(--border-color)]">
                <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ara..."
                      className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg"
                  >
                    Ara
                  </button>
                </form>
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <link.icon className="w-4 h-4" />
                          {link.name}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMobileProductsOpen && (
                        <div className="ml-4 mt-1 space-y-3 pb-2">
                          {Object.entries(productCategories).map(([category, items]) => (
                            <div key={category}>
                              <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-3 mb-1">
                                {category}
                              </h4>
                              {items.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3 py-1.5 text-sm text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-card)] transition-colors no-underline hover:no-underline"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors no-underline hover:no-underline"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
