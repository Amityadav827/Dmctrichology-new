"use client";
import EditableText from './Editable/EditableText';
import Link from 'next/link';

const ServiceHero = ({ data }) => {
  // Robust fallbacks to ensure it never looks blank
  const heroData = data || {};
  const bannerImage = heroData.bannerImage || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png';
  const pageTitle = heroData.pageTitle || 'Premium Hair & Body Services';
  const breadcrumbText = heroData.breadcrumbText || 'Home / Services';
  const overlayOpacity = heroData.overlayOpacity ?? 0.5;
  const bannerHeight = heroData.bannerHeight || '450px';

  return (
    <section 
      data-section-id="service-hero"
      className="relative flex items-center justify-center overflow-hidden w-full"
      style={{ height: bannerHeight }}
    >
      {/* Background Image with subtle parallax-like scale */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Premium Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-[#C19A5B]"></div>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#C19A5B] font-sans">
             Experience Excellence
          </p>
          <div className="h-[1px] w-8 bg-[#C19A5B]"></div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight" style={{ fontFamily: 'Marcellus, serif' }}>
          <EditableText sectionId="service-hero" fieldPath="hero.pageTitle" value={pageTitle} />
        </h1>

        <div className="flex items-center justify-center gap-3 text-white/70 text-[10px] md:text-xs uppercase tracking-[0.2em] font-sans font-bold">
          <Link href="/" className="hover:text-[#C19A5B] transition-colors">Home</Link>
          <span className="text-[#C19A5B] opacity-50">/</span>
          <span className="text-white">
             <EditableText sectionId="service-hero" fieldPath="hero.breadcrumbText" value={breadcrumbText} />
          </span>
        </div>
      </div>

      {/* Bottom Curve/Shadow for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
};

export default ServiceHero;
