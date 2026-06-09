import ClientFeedbackPage from '../../components/ClientFeedbackPage';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    isEnabled: true,
    pageTitle: 'Client Feedback',
    breadcrumbLabel: 'Client Feedback',
    backgroundColor: '#EEF0FA'
  },
  feedbackSection: {
    isEnabled: true,
    itemsPerPage: 15,
    cards: []
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/clients-feedback?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? { ...staticFallback, ...(result.data || {}) } : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Client Feedback page):', error);
    return staticFallback;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  return {
    ...buildCmsMetadata({
      data,
      titleFallback: 'Client Feedback | DMC Trichology',
      descriptionFallback: 'Read authentic client feedback and patient experiences at DMC Trichology. Discover real success stories and hair restoration journeys.',
      imageFallback: data.hero?.bannerImage || data.hero?.backgroundImage || ''
    }),
    alternates: {
      canonical: '/clients-feedback'
    }
  };
}

export default async function ClientFeedbackRoute() {
  const data = await getPageData();
  return <ClientFeedbackPage data={data} />;
}
