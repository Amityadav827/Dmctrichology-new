import './globals.css';
import { BuilderProvider } from '../context/BuilderContext';
import { fetchSiteSettings, fetchHeader, fetchTopBar } from '../services/api';
import GlobalLayoutWrapper from '../components/GlobalLayoutWrapper';
import CustomScriptsInjector from '../components/CustomScriptsInjector';
import { Suspense } from 'react';
import Script from 'next/script';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const res = await fetchSiteSettings().catch(() => null);
  const s = res?.data || {};
  const title = s.siteTitle || s.websiteName || 'DMC Trichology | Best Hair Transplant Clinic In Delhi';
  const description = s.defaultMetaDescription || 'Experience The Art Of Natural Hair Restoration at DMC Trichology.';
  const ogImage = s.defaultOgImage || s.logo || undefined;

  return {
    title,
    description,
    icons: { icon: s.favicon || '/favicon.ico' },
    openGraph: {
      title,
      description,
      siteName: s.websiteName || 'DMC Trichology',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function RootLayout({ children }) {
  const [settingsRes, headerRes, topbarRes] = await Promise.all([
    fetchSiteSettings(),
    fetchHeader(),
    fetchTopBar()
  ]).catch(err => {
    console.error("Error in parallel layout pre-fetch:", err);
    return [null, null, null];
  });

  const s = settingsRes?.data || {};
  const ga4Id = s.ga4Id || "";
  const gtmId = s.gtmId || "";
  const metaPixelId = s.metaPixelId || "";
  const headScripts = s.headScripts || "";
  const bodyStartScripts = s.bodyStartScripts || "";
  const customScriptText = `${headScripts}\n${bodyStartScripts}`;
  const shouldInjectGa4 = ga4Id && !customScriptText.includes(ga4Id) && !customScriptText.includes('googletagmanager.com/gtag/js');
  const shouldInjectGtm = gtmId && !customScriptText.includes(gtmId) && !customScriptText.includes('googletagmanager.com/gtm.js');
  const shouldInjectMetaPixel = metaPixelId && !customScriptText.includes(metaPixelId) && !customScriptText.includes('connect.facebook.net/en_US/fbevents.js');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Marcellus&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CustomScriptsInjector headScripts={headScripts} bodyStartScripts={bodyStartScripts} />
        {shouldInjectGtm && (
          <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        )}

        <BuilderProvider>
          <Suspense fallback={null}>
            <GlobalLayoutWrapper
              initialHeader={headerRes?.data}
              initialTopBar={topbarRes?.data}
              initialSiteSettings={s}
            >
              {children}
            </GlobalLayoutWrapper>
          </Suspense>
        </BuilderProvider>

        <svg width="0" height="0" className="hidden" style={{ display: 'none' }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F09819" />
              <stop offset="47%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#EDDB5A" />
            </linearGradient>
          </defs>
        </svg>

        {shouldInjectGa4 && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}</Script>
          </>
        )}
        {shouldInjectGtm && (
          <Script id="gtm-init" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</Script>
        )}
        {shouldInjectMetaPixel && (
          <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}</Script>
        )}
      </body>
    </html>
  );
}
