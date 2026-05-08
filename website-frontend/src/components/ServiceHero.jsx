"use client";
import EditableText from './Editable/EditableText';
import Link from 'next/link';

const ServiceHero = ({ data }) => {
  const heroData = data || {};
  const pageTitle = heroData.pageTitle || 'Service';
  const breadcrumbText = heroData.breadcrumbText || 'Home / Service';
  const bannerImage = heroData.bannerImage || 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png';

  return (
    <section 
      data-section-id="service-hero"
      className="service-hero-premium"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="max-w-[1400px] mx-auto">
        <h1 className="service-hero-title">
          <EditableText sectionId="service-hero" fieldPath="hero.pageTitle" value={pageTitle} />
        </h1>

        <div className="service-hero-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>
             <EditableText sectionId="service-hero" fieldPath="hero.breadcrumbText" value={breadcrumbText} />
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
