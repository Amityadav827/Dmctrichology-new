import { notFound } from 'next/navigation';
import { servicesData } from '../../../data/servicesData';
import DetailsBanner from '../../../components/DetailsBanner';
import ServiceIntro from '../../../components/ServiceIntro';
import ProcessSlider from '../../../components/ProcessSlider';
import BeforeAfterTreatment from '../../../components/BeforeAfterTreatment';
import FaqEnquiry from '../../../components/FaqEnquiry';
import IdealFrequency from '../../../components/IdealFrequency';
import ServiceContentBlock from '../../../components/ServiceContentBlock';
import ServiceBenefits from '../../../components/ServiceBenefits';
import ServiceIdealCandidates from '../../../components/ServiceIdealCandidates';
import ServiceNotCandidates from '../../../components/ServiceNotCandidates';
import ServiceTechniques from '../../../components/ServiceTechniques';
import ServiceInfoBlocks from '../../../components/ServiceInfoBlocks';
import ServiceAftercare from '../../../components/ServiceAftercare';
import ServiceWhyChooseUs from '../../../components/ServiceWhyChooseUs';
import ServiceEditorialFaq from '../../../components/ServiceEditorialFaq';
import HairTransplantInfoSection from '../../../components/HairTransplantInfoSection';
import HairTransplantWhyChooseSection from '../../../components/HairTransplantWhyChooseSection';
import HairTransplantResultsSection from '../../../components/HairTransplantResultsSection';
import HairTransplantVideosSection from '../../../components/HairTransplantVideosSection';
import '../../service.css';
import '../../details.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchServiceData(slug) {
  try {
    const res = await fetch(`${API_BASE}/service-details/${slug}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch CMS data for ${slug}:`, error);
  }
  
  // Fallback to static data
  const normalizedSlug = String(slug || '').toLowerCase().trim();
  return servicesData.find(s => s.slug.toLowerCase() === normalizedSlug) || null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const service = await fetchServiceData(slug);

  if (!service) {
    return {
      title: 'Service Not Found | DMC Trichology',
    };
  }

  const seo = service.seo || {};

  return {
    title: seo.metaTitle || `${service.banner?.title || service.title} | DMC Trichology`,
    description: seo.metaDescription || service.banner?.subtitle || '',
    alternates: {
      canonical: seo.canonicalUrl || `/details/${slug}`
    },
    openGraph: {
      images: seo.ogImage ? [{ url: seo.ogImage }] : []
    }
  };
}

export default async function DynamicDetailsPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const service = await fetchServiceData(slug);

  if (!service) {
    notFound();
  }

  const { banner, intro, process, beforeAfter, faqEnquiry, idealFrequency } = service;

  // Resolve dynamic sections gracefully falling back to pre-seeded static objects if not present in DB
  const staticFallback = servicesData.find(s => s.slug.toLowerCase() === String(slug || "").toLowerCase().trim()) || {};
  const googleReviewCta = service.googleReviewCta || staticFallback.googleReviewCta || null;
  const resultsSection = service.resultsSection || staticFallback.resultsSection || null;
  const videosSection = service.videosSection || staticFallback.videosSection || null;
  const enquirySection = service.enquirySection || staticFallback.enquirySection || null;

  return (
    <div className="bg-white min-h-screen">
      <DetailsBanner data={banner || {}} />
      <ServiceIntro data={intro || {}} banner={banner || {}} />
      <ServiceContentBlock data={service.contentBlocks || []} />
      <ServiceBenefits data={service.benefitsSection || null} />
      <ServiceIdealCandidates data={service.idealCandidates || null} pageSlug={slug} />
      <ServiceNotCandidates data={service.notCandidatesSection || null} />
      <ServiceTechniques data={service.techniquesSection || null} />
      <ServiceInfoBlocks data={service.infoBlocksSection || null} pageSlug={slug} />
      <ProcessSlider data={process || {}} />
      <ServiceAftercare data={service.aftercareSection || null} pageSlug={slug} />
      <ServiceWhyChooseUs data={service.whyChooseUsSection || null} pageSlug={slug} />
      {slug === 'best-hair-transplant' && <HairTransplantInfoSection />}
      {slug === 'best-hair-transplant' && (
        <HairTransplantWhyChooseSection
          image={service.benefitsSection?.image || service.idealCandidates?.sectionImage || ''}
        />
      )}
      {slug !== 'best-hair-transplant' && <IdealFrequency data={idealFrequency || {}} />}
      {slug !== 'best-hair-transplant' && <BeforeAfterTreatment data={beforeAfter || {}} />}
      <ServiceEditorialFaq data={service.editorialFaqSection || null} pageSlug={slug} googleReviewCta={googleReviewCta} />
      <HairTransplantResultsSection data={resultsSection} />
      <HairTransplantVideosSection data={videosSection} />
      <FaqEnquiry data={faqEnquiry || {}} enquirySection={enquirySection} />
    </div>
  );
}
