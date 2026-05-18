import { notFound } from 'next/navigation';
import { servicesData } from '../../../data/servicesData';
import DetailsBanner from '../../../components/DetailsBanner';
import ServiceIntro from '../../../components/ServiceIntro';
import ProcessSlider from '../../../components/ProcessSlider';
import BeforeAfterTreatment from '../../../components/BeforeAfterTreatment';
import FaqEnquiry from '../../../components/FaqEnquiry';
import IdealFrequency from '../../../components/IdealFrequency';
import ServiceContentBlock from '../../../components/ServiceContentBlock';
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

  return (
    <div className="bg-white min-h-screen">
      <DetailsBanner data={banner || {}} />
      <ServiceIntro data={intro || {}} banner={banner || {}} />
      <ServiceContentBlock data={service.contentBlocks || []} />
      <ProcessSlider data={process || {}} />
      <IdealFrequency data={idealFrequency || {}} />
      <BeforeAfterTreatment data={beforeAfter || {}} />
      <FaqEnquiry data={faqEnquiry || {}} />
    </div>
  );
}
