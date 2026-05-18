"use client";
import { useSearchParams, usePathname } from 'next/navigation';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GlobalLayoutWrapper({ children, initialHeader, initialTopBar }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Check if we are in isolation mode (e.g. editing ONLY header or ONLY footer)
  const isEditingHeader = pathname === '/header' || searchParams.get('component') === 'header';
  const isEditingFooter = pathname === '/footer' || searchParams.get('component') === 'footer';
  
  // If editing header, hide footer and main content (or show header only)
  // If editing footer, hide header and top bar
  
  return (
    <>
      {!isEditingFooter && <TopBar initialTopBar={initialTopBar} />}
      {!isEditingFooter && <Header initialHeader={initialHeader} />}
      
      <main>
        {/* Hide main content if we are JUST editing header/footer to avoid confusion */}
        {!(isEditingHeader || isEditingFooter) ? children : (
            <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                 <div style={{ textAlign: 'center', opacity: 0.5 }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Component Editor Mode
                    </p>
                    <p style={{ fontSize: '12px', color: '#ccc' }}>
                        Editing: {isEditingHeader ? 'Header & Top Bar' : 'Global Footer'}
                    </p>
                 </div>
            </div>
        )}
      </main>

      {!isEditingHeader && <Footer />}
    </>
  );
}
