"use client";
import EditableText from './Editable/EditableText';
import Link from 'next/link';

const ServiceHero = ({ data }) => {
  const heroData = data || {};
  const pageTitle = heroData.pageTitle || 'Service';
  const breadcrumbText = heroData.breadcrumbText || 'Home / Service';

  return (
    <section 
      data-section-id="service-hero"
      className="service-hero-premium"
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
