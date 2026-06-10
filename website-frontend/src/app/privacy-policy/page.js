import TermsConditionsPage from '../../components/TermsConditionsPage';
import SchemaMarkup from '../../components/SchemaMarkup';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    isEnabled: true,
    pageTitle: 'Privacy Policy',
    breadcrumbLabel: 'Privacy Policy',
    backgroundImage: ''
  },
  content: '',
  seo: {
    metaTitle: 'Privacy Policy | DMC Trichology',
    metaDescription: 'Read the privacy policy of DMC Trichology.',
    ogImage: ''
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/privacy-policy?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? { ...staticFallback, ...(result.data || {}) } : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Privacy Policy):', error);
    return staticFallback;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const seo = data.seo || {};
  const title = seo.metaTitle || data.hero?.pageTitle || 'Privacy Policy';
  const description = seo.metaDescription || 'Privacy policy of DMC Trichology.';
  const ogImage = seo.ogImage || '';

  return {
    title,
    description,
    openGraph: ogImage ? { title, description, images: [{ url: ogImage }] } : { title, description }
  };
}

export default async function PrivacyPolicyRoute() {
  const data = await getPageData();
  return (<><SchemaMarkup seo={data?.seo} /><TermsConditionsPage data={data} /></>);
}
