import ContactHero from '../../components/ContactHero';
import EnquirySection from '../../components/EnquirySection';
import MapSection from '../../components/MapSection';
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

export default async function ContactPage() {
  const pageData = await fetchContactPage();

  const hero = pageData?.hero || {};
  const consultation = pageData?.consultation || {};
  const map = pageData?.map || {};

  return (
    <div className="bg-white min-h-screen">
      <ContactHero data={hero} />
      <EnquirySection sectionId="contact-consultation" data={consultation} />
      <MapSection data={map} />
    </div>
  );
}

// Deployment sync update - v1.0.1
