import DetailsBanner from '../../../components/DetailsBanner';
import ServiceIntro from '../../../components/ServiceIntro';
import ProcessSlider from '../../../components/ProcessSlider';
import BeforeAfterTreatment from '../../../components/BeforeAfterTreatment';
import FaqEnquiry from '../../../components/FaqEnquiry';
import IdealFrequency from '../../../components/IdealFrequency';
import ServiceContentBlock from '../../../components/ServiceContentBlock';
import ServiceBenefits from '../../../components/ServiceBenefits';
import FueProcedureSection from '../../../components/FueProcedureSection';
import FueCostSection from '../../../components/FueCostSection';
import FueOptingBenefitsSection from '../../../components/FueOptingBenefitsSection';
import BodyHairIntroSection from '../../../components/BodyHairIntroSection';
import BodyHairSuitableSection from '../../../components/BodyHairSuitableSection';
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
import ServiceGlobalSections from '../../../components/ServiceGlobalSections';

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
    isVisible: dbSection.isVisible !== false
  };
}

export default function ServiceClassicTemplate({ service, slug, staticFallback }) {
  const { banner, intro, process, beforeAfter, faqEnquiry, idealFrequency } = service;
  const normalizedSlug = String(slug || '').toLowerCase().trim();

  const googleReviewCta = service.googleReviewCta || staticFallback.googleReviewCta || null;
  const resultsSection = service.resultsSection || staticFallback.resultsSection || null;
  const videosSection = service.videosSection || staticFallback.videosSection || null;
  const enquirySection = service.enquirySection || staticFallback.enquirySection || null;
  const isHairCostDelhiPage = ['hair-transplant-cost-in-delhi', 'hair-transplant-cost-in-india'].includes(normalizedSlug);
  const isFueHairTransplantPage = normalizedSlug === 'fue-hair-transplant';
  const showVideosSection = !isHairCostDelhiPage || videosSection?.showOnCostPage === true;

  const isTransplantCategory = service.category === 'transplant' || slug.includes('transplant') || slug.includes('hair-transplant');
  const showTransplantInfo = isTransplantCategory || !!service.hairTransplantInfoSection;
  const showTransplantWhyChoose = isTransplantCategory || !!service.hairTransplantWhyChooseSection;
  const showIdealFrequency = !isTransplantCategory;
  const showBeforeAfter = !isTransplantCategory;

  const resolvedWhyChoose = getFallbackWhyChoose(service, staticFallback);
  const resolvedAftercare = getFallbackAftercare(service, staticFallback);
  const resolvedNotCandidates = getFallbackNotCandidates(service, staticFallback);

  const layout = service.sectionsLayout || {};
  const show = (id) => layout[id] !== false;

  return (
    <div className="bg-white min-h-screen">
      {show('banner') && <DetailsBanner data={banner || {}} />}
      {show('banner') && <ServiceIntro data={intro || {}} banner={banner || {}} />}
      <ServiceGlobalSections service={service} layout={layout} pageSlug={slug} />
      {show('bodyHairIntroSection') && <BodyHairIntroSection data={service.bodyHairIntroSection || null} pageSlug={slug} />}
      {show('contentBlocks') && <ServiceContentBlock data={service.contentBlocks || []} pageSlug={slug} />}
      {show('benefitsSection') && (
        <ServiceBenefits
          data={isHairCostDelhiPage ? (service.benefitsSection || staticFallback.benefitsSection || {}) : (service.benefitsSection || null)}
          pageSlug={slug}
        />
      )}
      {show('fueProcedureSection') && <FueProcedureSection data={service.fueProcedureSection || null} pageSlug={slug} />}
      {show('idealCandidates') && !isHairCostDelhiPage && <ServiceIdealCandidates data={service.idealCandidates || null} pageSlug={slug} />}
      {show('notCandidates') && !isHairCostDelhiPage && (
        <ServiceNotCandidates
          data={resolvedNotCandidates}
          serviceTitle={service.banner?.title || service.title || ''}
        />
      )}
      {show('bodyHairSuitableSection') && <BodyHairSuitableSection data={service.bodyHairSuitableSection || null} pageSlug={slug} />}
      {show('fueCostSection') && <FueCostSection data={service.fueCostSection || null} pageSlug={slug} />}
      {show('fueOptingBenefitsSection') && <FueOptingBenefitsSection data={service.fueOptingBenefitsSection || null} pageSlug={slug} />}
      {show('techniques') && !isHairCostDelhiPage && <ServiceTechniques data={service.techniquesSection || null} />}
      {show('infoBlocks') && !isHairCostDelhiPage && <ServiceInfoBlocks data={service.infoBlocksSection || null} pageSlug={slug} />}
      {show('process') && !isHairCostDelhiPage && <ProcessSlider data={process || {}} />}
      {show('aftercare') && !isHairCostDelhiPage && !isFueHairTransplantPage && <ServiceAftercare data={resolvedAftercare} pageSlug={slug} />}
      {show('whyChooseUs') && !isHairCostDelhiPage && !isFueHairTransplantPage && <ServiceWhyChooseUs data={resolvedWhyChoose} pageSlug={slug} />}
      {show('hairTransplantInfo') && !isHairCostDelhiPage && showTransplantInfo && (
        <HairTransplantInfoSection data={service.hairTransplantInfoSection || null} pageSlug={slug} />
      )}
      {show('hairTransplantWhy') && !isHairCostDelhiPage && showTransplantWhyChoose && (
        <HairTransplantWhyChooseSection
          data={service.hairTransplantWhyChooseSection || null}
          image={service.benefitsSection?.image || service.idealCandidates?.sectionImage || staticFallback.benefitsSection?.image || ''}
          serviceTitle={service.banner?.title || service.title || ''}
          pageSlug={slug}
        />
      )}
      {show('idealFrequency') && showIdealFrequency && <IdealFrequency data={idealFrequency || {}} />}
      {show('beforeAfter') && showBeforeAfter && <BeforeAfterTreatment data={beforeAfter || {}} />}
      {show('editorialFaq') && <ServiceEditorialFaq data={service.editorialFaqSection || null} pageSlug={slug} googleReviewCta={googleReviewCta} />}
      {show('resultsSection') && <HairTransplantResultsSection data={resultsSection} />}
      {show('videosSection') && showVideosSection && <HairTransplantVideosSection data={videosSection} />}
      {show('faqEnquiry') && <FaqEnquiry data={faqEnquiry || {}} enquirySection={enquirySection} pageSlug={slug} />}
    </div>
  );
}
