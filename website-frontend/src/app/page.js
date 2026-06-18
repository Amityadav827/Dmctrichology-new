import HeroSlider from '@/components/HeroSlider';
import LeadForm from '@/components/LeadForm';
import AboutUs from '@/components/AboutUs';
import AboutUsCare from '@/components/AboutUsCare';
import SurgeonsSection from '@/components/SurgeonsSection';
import EnquirySection from '@/components/EnquirySection';
import TestimonialSection from '@/components/TestimonialSection';
import ServiceSlider from '@/components/ServiceSlider';
import FeaturesBar from '@/components/FeaturesBar';
import WhyChooseUs from '@/components/WhyChooseUs';
import TreatmentSection from '@/components/TreatmentSection';
import FaqSection from '@/components/FaqSection';
import BlogSection from '@/components/BlogSection';
import PressMediaSection from '@/components/PressMediaSection';
import ResultsSlider from '@/components/ResultsSlider';
import GradeSlider from '@/components/GradeSlider';
import SchemaMarkup from '@/components/SchemaMarkup';
import FaqSchema from '@/components/FaqSchema';
import { fetchSiteSettings, fetchHomeFAQ } from '@/services/api';

export default async function Home() {
  const [settingsRes, faqRes] = await Promise.all([
    fetchSiteSettings().catch(() => null),
    fetchHomeFAQ().catch(() => null),
  ]);
  const siteSchema = settingsRes?.data?.schema || settingsRes?.data?.seo?.schema || '';
  const homeFaqs = (faqRes?.data?.categories || []).flatMap((c) => c?.faqs || c?.questions || []);
  return (
    <div className="home-page">
      <SchemaMarkup schema={siteSchema} />
      <FaqSchema faqs={homeFaqs} />
      <div className="home-hero-stage" style={{ position: 'relative' }}>
        <HeroSlider />
        <div className="hero-right">
          <LeadForm />
        </div>
      </div>
      <AboutUs />

      <ServiceSlider />
      <FeaturesBar />
      <WhyChooseUs />
      <ResultsSlider />
      <GradeSlider />
      <AboutUsCare />
      <SurgeonsSection />
      <EnquirySection />
      <TestimonialSection showBadge={false} />
      <TreatmentSection />
      <FaqSection showBadge={false} />
      <BlogSection />
      <PressMediaSection />

    </div>
  );
}
