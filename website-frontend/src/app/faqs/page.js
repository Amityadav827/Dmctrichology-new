import FaqsPage from '../../components/FaqsPage';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    isEnabled: true,
    backgroundImage: '',
    pageTitle: 'Frequently Asked Question',
    breadcrumbLabel: 'Faq',
    overlayOpacity: 0.64
  },
  faqSection: {
    isEnabled: true,
    faqs: []
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/faqs-page?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? { ...staticFallback, ...(result.data || {}) } : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (FAQs page):', error);
    return staticFallback;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const firstFaq = data.faqSection?.faqs?.find(faq => faq?.isEnabled !== false);
  return buildCmsMetadata({
    data,
    titleFallback: data.hero?.pageTitle || 'Frequently Asked Question',
    descriptionFallback: firstFaq?.answer || 'Frequently asked questions about DMC Trichology.',
    imageFallback: data.hero?.backgroundImage || ''
  });
}

export default async function FaqsRoute() {
  const data = await getPageData();
  return <FaqsPage data={data} />;
}
