import TermsConditionsPage from '../../components/TermsConditionsPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    isEnabled: true,
    pageTitle: 'Terms & Conditions',
    breadcrumbLabel: 'Terms & Conditions',
    backgroundImage: ''
  },
  content: '',
  seo: {
    metaTitle: 'Terms & Conditions | DMC Trichology',
    metaDescription: 'Read the terms and conditions on which DMC Trichology offers its services.',
    ogImage: ''
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/terms-conditions?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? { ...staticFallback, ...(result.data || {}) } : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Terms & Conditions):', error);
    return staticFallback;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const seo = data.seo || {};
  const title = seo.metaTitle || data.hero?.pageTitle || 'Terms & Conditions';
  const description = seo.metaDescription || 'Terms and conditions of DMC Trichology.';
  const ogImage = seo.ogImage || '';

  return {
    title,
    description,
    openGraph: ogImage ? { title, description, images: [{ url: ogImage }] } : { title, description }
  };
}

export default async function TermsConditionsRoute() {
  const data = await getPageData();
  return <TermsConditionsPage data={data} />;
}
