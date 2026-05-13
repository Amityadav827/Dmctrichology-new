import DetailsBanner from '../../components/DetailsBanner';
import ServiceIntro from '../../components/ServiceIntro';
import ProcessSlider from '../../components/ProcessSlider';
import BeforeAfterTreatment from '../../components/BeforeAfterTreatment';
import FaqEnquiry from '../../components/FaqEnquiry';
import IdealFrequency from '../../components/IdealFrequency';
import '../service.css';
import '../details.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchDetailsPage() {
  try {
    const res = await fetch(`${API_BASE}/details-page?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export default async function DetailsPage() {
  const pageData = await fetchDetailsPage();

  const banner = pageData?.banner || {};
  const intro = pageData?.intro || {};
  const process = pageData?.process || {};
  const beforeAfter = pageData?.beforeAfter || {};
  const faqEnquiry = pageData?.faqEnquiry || {};
  const idealFrequency = pageData?.idealFrequency || {};

  return (
    <div className="bg-white min-h-screen">
      <DetailsBanner data={banner} />
      <ServiceIntro data={intro} />
      <ProcessSlider data={process} />
      <IdealFrequency data={idealFrequency} />
      <BeforeAfterTreatment data={beforeAfter} />
      <FaqEnquiry data={faqEnquiry} />
    </div>
  );
}
