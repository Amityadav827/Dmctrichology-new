"use client";
import { useSearchParams, usePathname } from 'next/navigation';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GlobalLayoutWrapper({ children }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Check if we are in isolation mode (e.g. editing ONLY header or ONLY footer)
  const isEditingHeader = pathname === '/header' || searchParams.get('component') === 'header';
  const isEditingFooter = pathname === '/footer' || searchParams.get('component') === 'footer';
  
  // If editing header, hide footer and main content (or show header only)
  // If editing footer, hide header and top bar
  
  return (
    <>
      {!isEditingFooter && <TopBar />}
      {!isEditingFooter && <Header />}
      
      <main>
        {children}
      </main>

      {!isEditingHeader && <Footer />}
    </>
  );
}
