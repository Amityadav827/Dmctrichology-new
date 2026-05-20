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
function getFallbackWhyChoose(service, staticFallback) {
  const dbSection = service.whyChooseUsSection || {};
  const dbFeatures = (dbSection.features || []).filter(f => f.isVisible !== false && f.featureText?.trim() !== "");
  
  if (dbFeatures.length > 0) {
    return { ...dbSection, features: dbFeatures };
  }
  
  const fallbackPoints = service.benefitsSection?.points || staticFallback.benefitsSection?.points || [];
  const features = fallbackPoints.map((p, idx) => ({
    featureText: p.benefitText || p.text || "",
    sortOrder: idx + 1,
    isVisible: true
  })).filter(f => f.featureText?.trim() !== "");

  return {
    sectionHeading: dbSection.sectionHeading || "Why Choose DMC?",
    introText: dbSection.introText || `Choose DMC Trichology because we offer world-class treatments to ensure the highest quality of care.`,
    features: features.length > 0 ? features : [
      { featureText: "Expert Team of Specialists", sortOrder: 1, isVisible: true },
      { featureText: "Advanced Treatment Protocols", sortOrder: 2, isVisible: true },
      { featureText: "State-of-the-Art Facilities", sortOrder: 3, isVisible: true },
      { featureText: "Outstanding Patient Care", sortOrder: 4, isVisible: true }
    ],
    isVisible: true
  };
}

function getFallbackAftercare(service, staticFallback) {
  const dbSection = service.aftercareSection || {};
  const dbBullets = (dbSection.bullets || []).filter(b => b.isVisible !== false && b.bulletText?.trim() !== "");
  
  if (dbBullets.length > 0) {
    return { ...dbSection, bullets: dbBullets };
  }
  
  const fallbackAfterPoints = service.beforeAfter?.afterPoints || staticFallback.beforeAfter?.afterPoints || [];
  const bullets = fallbackAfterPoints.map((pt, idx) => ({
    bulletText: pt,
    sortOrder: idx + 1,
    isVisible: true
  })).filter(b => b.bulletText?.trim() !== "");

  return {
    sectionHeading: dbSection.sectionHeading || "What to expect after the treatment?",
    introText: dbSection.introText || `Here are some essential guidelines to follow after your treatment to ensure optimal recovery and results.`,
    conclusionText: dbSection.conclusionText || "Expected Recovery & Results Timeline",
    bullets: bullets.length > 0 ? bullets : [
      { bulletText: "Keep the treated area clean and moisturized.", sortOrder: 1, isVisible: true },
      { bulletText: "Avoid direct sun exposure and apply sunscreen.", sortOrder: 2, isVisible: true },
      { bulletText: "Stay hydrated and follow prescribed medications.", sortOrder: 3, isVisible: true }
    ],
    isVisible: true
  };
}

function getFallbackNotCandidates(service, staticFallback) {
  const dbSection = service.notCandidatesSection || {};
  const dbBullets = (dbSection.bullets || []).filter(b => b.isVisible !== false && b.bulletText?.trim() !== "");
  
  if (dbBullets.length > 0) {
    return { ...dbSection, bullets: dbBullets };
  }
  
  const fallbackNotIdeal = service.idealFrequency?.notIdealForPoints || staticFallback.idealFrequency?.notIdealForPoints || [];
  const bullets = fallbackNotIdeal.map((pt, idx) => ({
    bulletText: pt,
    sortOrder: idx + 1,
    isVisible: true
  })).filter(b => b.bulletText?.trim() !== "");

  return {
    sectionHeading: dbSection.sectionHeading || `WHO IS NOT A CANDIDATE FOR THIS TREATMENT?`,
    bullets: bullets.length > 0 ? bullets : [
      { bulletText: "Those with active skin infections or inflammation on the treatment area.", sortOrder: 1, isVisible: true },
      { bulletText: "Pregnant or lactating women.", sortOrder: 2, isVisible: true },
      { bulletText: "Those with a history of keloidal tendency.", sortOrder: 3, isVisible: true }
    ],
    isVisible: true
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

  const isTransplantCategory = service.category === 'transplant' || slug.includes('transplant') || slug.includes('hair-transplant');
  const showTransplantInfo = isTransplantCategory || !!service.hairTransplantInfoSection;
  const showTransplantWhyChoose = isTransplantCategory || !!service.hairTransplantWhyChooseSection;
  const showIdealFrequency = !isTransplantCategory;
  const showBeforeAfter = !isTransplantCategory;

  const resolvedWhyChoose = getFallbackWhyChoose(service, staticFallback);
  const resolvedAftercare = getFallbackAftercare(service, staticFallback);
  const resolvedNotCandidates = getFallbackNotCandidates(service, staticFallback);

  return (
    <div className="bg-white min-h-screen">
      <DetailsBanner data={banner || {}} />
      <ServiceIntro data={intro || {}} banner={banner || {}} />
      <ServiceContentBlock data={service.contentBlocks || []} />
      <ServiceBenefits data={service.benefitsSection || null} />
      <ServiceIdealCandidates data={service.idealCandidates || null} pageSlug={slug} />
      <ServiceNotCandidates 
        data={resolvedNotCandidates} 
        serviceTitle={service.banner?.title || service.title || ''} 
      />
      <ServiceTechniques data={service.techniquesSection || null} />
      <ServiceInfoBlocks data={service.infoBlocksSection || null} pageSlug={slug} />
      <ProcessSlider data={process || {}} />
      <ServiceAftercare data={resolvedAftercare} pageSlug={slug} />
      <ServiceWhyChooseUs data={resolvedWhyChoose} pageSlug={slug} />
      {showTransplantInfo && (
        <HairTransplantInfoSection 
          data={service.hairTransplantInfoSection || null} 
          pageSlug={slug} 
        />
      )}
      {showTransplantWhyChoose && (
        <HairTransplantWhyChooseSection
          data={service.hairTransplantWhyChooseSection || null}
          image={service.benefitsSection?.image || service.idealCandidates?.sectionImage || staticFallback.benefitsSection?.image || ''}
          serviceTitle={service.banner?.title || service.title || ''}
          pageSlug={slug}
        />
      )}
      {showIdealFrequency && <IdealFrequency data={idealFrequency || {}} />}
      {showBeforeAfter && <BeforeAfterTreatment data={beforeAfter || {}} />}
      <ServiceEditorialFaq data={service.editorialFaqSection || null} pageSlug={slug} googleReviewCta={googleReviewCta} />
      <HairTransplantResultsSection data={resultsSection} />
      <HairTransplantVideosSection data={videosSection} />
      <FaqEnquiry data={faqEnquiry || {}} enquirySection={enquirySection} pageSlug={slug} />
    </div>
  );
}
