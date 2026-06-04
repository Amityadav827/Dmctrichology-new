import FaqsPage from '../../components/FaqsPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    isEnabled: true,
    backgroundImage: '',
    pageTitle: 'Frequently Asked Questions',
    breadcrumbLabel: 'Frequently Asked Questions',
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
  return {
    title: data.hero?.pageTitle || 'Frequently Asked Questions',
    description: 'Frequently asked questions about DMC Trichology.'
  };
}

export default async function FaqsRoute() {
  const data = await getPageData();
  return <FaqsPage data={data} />;
}
