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

// Fallback before/after results pulled from the homepage Results Slider CMS,
// so every service page can show results without per-service data entry.
async function fetchResultsFallback() {
  try {
    const res = await fetch(`${API_BASE}/results-slider`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const d = json?.data;
      if (json?.success && d) {
        const cards = Array.isArray(d.results) ? d.results.filter(r => r && r.enabled !== false) : [];
        if (cards.length > 0) {
          return {
            isVisible: d.enabled !== false,
            subtitle: d.badgeText || 'BEFORE AND AFTER',
            title: d.heading || 'RESULTS THAT SPEAK FOR THEMSELVES',
            cards
          };
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch results-slider fallback:', error);
  }
  return null;
}

// Fallback FAQs pulled from the homepage FAQ CMS (first 5 questions),
// so service pages with no FAQ of their own still show an accordion.
async function fetchFaqFallback() {
  try {
    const res = await fetch(`${API_BASE}/home-faq`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const d = json?.data;
      if (json?.success && d && Array.isArray(d.categories)) {
        const all = [];
        d.categories.forEach(cat => {
          (cat.faqs || []).forEach(f => {
            if (f && (f.question || f.answer)) {
              all.push({ question: f.question || '', answer: f.answer || '' });
            }
          });
        });
        if (all.length > 0) return all.slice(0, 5);
      }
    }
  } catch (error) {
    console.error('Failed to fetch home-faq fallback:', error);
  }
  return null;
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
  const resultsFallback = await fetchResultsFallback();
  const faqFallback = await fetchFaqFallback();

  if (templateVersion === 'warm-v2') {
    return <ServiceWarmTemplate service={service} slug={slug} staticFallback={staticFallback} resultsFallback={resultsFallback} faqFallback={faqFallback} />;
  }

  return <ServiceClassicTemplate service={service} slug={slug} staticFallback={staticFallback} resultsFallback={resultsFallback} faqFallback={faqFallback} />;
}
