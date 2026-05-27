"use client";
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';

// Elements below the fold get .sr class and animate in when they enter viewport.
// Cards in grids get a stagger delay so they appear one after another.
function useScrollReveal(pathname) {
  useEffect(() => {
    let observer;

    const isAboveFold = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    const run = () => {
      // Staggered card grids — scale-up entrance
      const cardGroups = [
        '.service-techniques-card',
        '.service-whychoose-card',
        '.service-aftercare-item',
        '.result-card',
        '.hair-transplant-video-card',
        '.hair-transplant-card',
        '.best-hair-transplant-not-candidate-item',
        '.process-card',
        '.hair-transplant-why-item',
        '.hair-cost-benefit-item',
      ];
      cardGroups.forEach(sel => {
        document.querySelectorAll(`${sel}:not(.sr)`).forEach((el, i) => {
          if (!isAboveFold(el)) {
            el.classList.add('sr', 'sr-scale');
            el.style.transitionDelay = `${i * 0.07}s`;
          }
        });
      });

      // Slide in from left
      [
        '.service-candidates-content-col',
        '.service-aftercare-intro-col',
        '.hair-transplant-why-content',
        '.service-infoblocks-container',
        '.hair-transplant-why-section .hair-transplant-why-container > *:first-child',
      ].forEach(sel => {
        document.querySelectorAll(`${sel}:not(.sr)`).forEach(el => {
          if (!isAboveFold(el)) el.classList.add('sr', 'sr-left');
        });
      });

      // Slide in from right
      [
        '.service-candidates-image-col',
        '.service-aftercare-list-col',
        '.hair-transplant-why-image-wrap',
      ].forEach(sel => {
        document.querySelectorAll(`${sel}:not(.sr)`).forEach(el => {
          if (!isAboveFold(el)) el.classList.add('sr', 'sr-right');
        });
      });

      // Fade-up for section headings and kickers (skip above-fold ones)
      [
        '.dmc-kicker',
        '.dmc-heading',
        '.section-title:not(.service-hero-title)',
        '.section-subtitle',
        '.hair-transplant-why-heading',
        '.hair-transplant-why-intro',
        '.process-slider-title',
        '.service-infoblocks-heading',
        '.hair-transplant-videos-heading',
        '.hair-transplant-results-section .dmc-heading',
        '.service-techniques-heading',
        '.service-whychoose-heading',
        '.service-aftercare-heading',
      ].forEach(sel => {
        document.querySelectorAll(`${sel}:not(.sr)`).forEach(el => {
          if (!isAboveFold(el)) el.classList.add('sr');
        });
      });

      // Observe all newly-marked elements
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('in-view');
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.sr:not(.in-view)').forEach(el => observer.observe(el));
    };

    const timer = setTimeout(run, 250);
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [pathname]);
}

export default function GlobalLayoutWrapper({ children, initialHeader, initialTopBar }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useScrollReveal(pathname);
  
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
      {!(isEditingHeader || isEditingFooter) && <ScrollToTopButton />}
    </>
  );
}
