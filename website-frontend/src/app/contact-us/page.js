import ContactHero from '../../components/ContactHero';
import EnquirySection from '../../components/EnquirySection';
import MapSection from '../../components/MapSection';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';
import SchemaMarkup from '../../components/SchemaMarkup';
import '../service.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchContactPage() {
  try {
    const res = await fetch(`${API_BASE}/contact-page?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const data = await fetchContactPage();
  return buildCmsMetadata({
    data,
    titleFallback: data?.hero?.title || 'Contact Us',
    descriptionFallback: data?.consultation?.heading || data?.consultation?.subtitle || 'Contact DMC Trichology for consultation and clinic details.',
    imageFallback: data?.hero?.bannerImage || data?.consultation?.beforeImage || ''
  });
}

export default async function ContactPage() {
  const pageData = await fetchContactPage();

  const hero = pageData?.hero || {};
  const consultation = {
    ...(pageData?.consultation || {}),
    badgeText: '',
  };
  const map = pageData?.map || {};

  return (
    <div className="bg-white min-h-screen">
      <SchemaMarkup seo={pageData?.seo} />
      <ContactHero data={hero} />
      <EnquirySection 
        sectionId="contact-consultation" 
        data={consultation} 
        label="Contact Page Consultation" 
      />
      <MapSection data={map} />
    </div>
  );
}
