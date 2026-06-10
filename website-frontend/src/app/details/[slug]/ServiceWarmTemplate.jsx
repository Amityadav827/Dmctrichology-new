import DetailsBanner from '../../../components/DetailsBanner';
import SchemaMarkup from '../../../components/SchemaMarkup';
import AboutDrNiveditaAssociations from '../../../components/AboutDrNiveditaAssociations';
import AboutDrNiveditaFeaturedIn from '../../../components/AboutDrNiveditaFeaturedIn';
import ServiceStoryOpener from '../../../components/ServiceStoryOpener';
import ServiceEditorialExplainer from '../../../components/ServiceEditorialExplainer';
import ServiceDoctorQuote from '../../../components/ServiceDoctorQuote';
import ServiceCandidacy from '../../../components/ServiceCandidacy';
import ProcessSlider from '../../../components/ProcessSlider';
import BeforeAfterTreatment from '../../../components/BeforeAfterTreatment';
import TestimonialSection from '../../../components/TestimonialSection';
import ServiceAftercare from '../../../components/ServiceAftercare';
import ServiceEditorialFaq from '../../../components/ServiceEditorialFaq';
import FaqEnquiry from '../../../components/FaqEnquiry';

function fallbackAftercare(service) {
  const dbSection = service.aftercareSection || {};
  const dbBullets = (dbSection.bullets || []).filter(b => b.isVisible !== false && b.bulletText?.trim() !== '');
  if (dbBullets.length > 0) return { ...dbSection, bullets: dbBullets };
  return {
    sectionHeading: dbSection.sectionHeading || 'What to expect after',
    introText: dbSection.introText || 'Here is what your recovery and follow-up usually look like.',
    conclusionText: dbSection.conclusionText || 'Expected recovery & results timeline',
    bullets: [
      { bulletText: 'Keep the treated area clean and moisturised.', sortOrder: 1, isVisible: true },
      { bulletText: 'Avoid direct sun exposure and apply sunscreen.', sortOrder: 2, isVisible: true },
      { bulletText: 'Follow the prescribed medication and check-in schedule.', sortOrder: 3, isVisible: true },
    ],
    isVisible: true,
  };
}

export default function ServiceWarmTemplate({ service, slug, staticFallback = {} }) {
  const {
    banner,
    intro,
    process,
    beforeAfter,
    faqEnquiry,
    storyOpener,
    doctorQuote,
    idealCandidates,
    notCandidatesSection,
    editorialFaqSection,
  } = service;

  const enquirySection = service.enquirySection || staticFallback.enquirySection || null;
  const googleReviewCta = service.googleReviewCta || staticFallback.googleReviewCta || null;
  const resolvedAftercare = fallbackAftercare(service);

  // Compose the editorial-explainer body from intro + absorbed legacy SEO copy
  const composedExplainerParts = [];
  if (intro?.longDescription) composedExplainerParts.push(intro.longDescription);
  if (intro?.shortDescription && !intro?.longDescription) composedExplainerParts.push(intro.shortDescription);
  // Absorb retired sections' long-form copy so SEO surface is preserved
  if (service.techniquesSection?.sectionHeading || service.techniquesSection?.techniques) {
    const techIntro = service.techniquesSection?.introText;
    if (techIntro) composedExplainerParts.push(techIntro);
  }
  if (service.infoBlocksSection?.blocks?.length) {
    service.infoBlocksSection.blocks.forEach((blk) => {
      if (blk?.description) composedExplainerParts.push(blk.description);
    });
  }
  if (service.whyChooseUsSection?.introText) {
    composedExplainerParts.push(service.whyChooseUsSection.introText);
  }
  if (service.hairTransplantInfoSection?.sectionHeading) {
    const ht = service.hairTransplantInfoSection;
    if (ht.introText) composedExplainerParts.push(ht.introText);
  }
  const explainerLongDescription = composedExplainerParts
    .map((s) => String(s || '').trim())
    .filter(Boolean)
    .join('\n\n');

  const explainerData = {
    heading: intro?.introHeading || intro?.title || banner?.pageTitle || '',
    longDescription: explainerLongDescription,
    pullQuote: intro?.pullQuote || '',
    bannerImage: intro?.bannerImage || banner?.bannerImage || '',
  };

  return (
    <div className="bg-white min-h-screen dmc-service-warm">
      <SchemaMarkup seo={service.seo} />
      {/* 1. Cinematic hero */}
      <DetailsBanner data={banner || {}} variant="cinematic" />

      {/* 2. Trust microbar — associations + featured in */}
      <div className="dmc-service-warm-trust-band">
        <AboutDrNiveditaAssociations data={service.associations || {}} />
        <AboutDrNiveditaFeaturedIn data={service.featuredIn || {}} />
      </div>

      {/* 3. Story opener (empathy) */}
      <ServiceStoryOpener data={storyOpener || {}} pageSlug={slug} />

      {/* 4. Editorial explainer (absorbs retired-section SEO copy) */}
      <ServiceEditorialExplainer data={explainerData} pageSlug={slug} />

      {/* 5. Doctor's voice */}
      <ServiceDoctorQuote data={doctorQuote || {}} pageSlug={slug} />

      {/* 6. Is this you? (paired candidacy) */}
      <ServiceCandidacy
        idealData={idealCandidates || {}}
        notData={notCandidatesSection || {}}
        pageSlug={slug}
      />

      {/* 7. The journey (process) */}
      <ProcessSlider data={process || {}} />

      {/* 8. Real results (before/after) */}
      <BeforeAfterTreatment data={beforeAfter || {}} />

      {/* 9. Testimonials — global wall */}
      <TestimonialSection />

      {/* 10. Aftercare */}
      <ServiceAftercare data={resolvedAftercare} pageSlug={slug} />

      {/* 11. Editorial FAQ */}
      <ServiceEditorialFaq
        data={editorialFaqSection || null}
        pageSlug={slug}
        googleReviewCta={googleReviewCta}
      />

      {/* 12. Warm enquiry CTA */}
      <FaqEnquiry
        data={faqEnquiry || {}}
        enquirySection={enquirySection}
        pageSlug={slug}
      />
    </div>
  );
}
