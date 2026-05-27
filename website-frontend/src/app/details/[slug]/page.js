import { notFound } from 'next/navigation';
import { servicesData } from '../../../data/servicesData';
import ServiceClassicTemplate from './ServiceClassicTemplate';
import ServiceWarmTemplate from './ServiceWarmTemplate';
import '../../service.css';
import '../../details.css';
import './serviceWarmTemplate.css';

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

  let service = await fetchServiceData(slug);
  const normalizedSlug = String(slug || '').toLowerCase().trim();

  if (!service && normalizedSlug === 'hair-transplant-cost-in-delhi') {
    service = servicesData.find(s => s.slug.toLowerCase() === 'hair-transplant-cost-in-delhi') || null;
  }

  if (!service) {
    notFound();
  }

  const staticFallback = servicesData.find(s => s.slug.toLowerCase() === normalizedSlug) || {};
  const templateVersion = service.templateVersion || service.data?.templateVersion;

  if (templateVersion === 'warm-v2') {
    return <ServiceWarmTemplate service={service} slug={slug} staticFallback={staticFallback} />;
  }

  return <ServiceClassicTemplate service={service} slug={slug} staticFallback={staticFallback} />;
}
