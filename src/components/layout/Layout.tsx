import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Layout({ children, fullWidth = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Navbar />
      {fullWidth ? (
        <main className="flex-1 pt-[104px]">
          {children}
        </main>
      ) : (
        <main className="flex-1 pt-[104px]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
