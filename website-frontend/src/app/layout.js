import './globals.css';
import { BuilderProvider } from '../context/BuilderContext';
import { fetchSiteSettings, fetchHeader, fetchTopBar } from '../services/api';
import GlobalLayoutWrapper from '../components/GlobalLayoutWrapper';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'DMC Trichology | Best Hair Transplant Clinic In Delhi',
  description: 'Experience The Art Of Natural Hair Restoration at DMC Trichology.',
};

export default async function RootLayout({ children }) {
  const [settings, headerRes, topbarRes] = await Promise.all([
    fetchSiteSettings(),
    fetchHeader(),
    fetchTopBar()
  ]).catch(err => {
    console.error("Error in parallel layout pre-fetch:", err);
    return [null, null, null];
  });

  const primaryColor = settings?.primaryColor || "#C19A5B";
  const secondaryColor = settings?.secondaryColor || "#000000";

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Marcellus&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
          }
        `}} />
      </head>
      <body>
        <BuilderProvider>
          <Suspense fallback={null}>
            <GlobalLayoutWrapper 
              initialHeader={headerRes?.data} 
              initialTopBar={topbarRes?.data}
            >
              {children}
            </GlobalLayoutWrapper>
          </Suspense>
        </BuilderProvider>
        <svg width="0" height="0" className="hidden" style={{ display: 'none' }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F09819" />
              <stop offset="47%" stopColor="#E4B753" />
              <stop offset="100%" stopColor="#EDDB5A" />
            </linearGradient>
          </defs>
        </svg>
      </body>
    </html>
  );
}
