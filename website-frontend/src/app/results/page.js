import RealResultsPage from '../../components/RealResultsPage';
import SchemaMarkup from '../../components/SchemaMarkup';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function getRealResultsData() {
  try {
    const response = await fetch(`${API_BASE}/results-page?t=${Date.now()}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch (error) {
    console.error('Failed to fetch Real Results data:', error);
    return null;
  }
}

export async function generateMetadata() {
  const data = await getRealResultsData();

  return {
    ...buildCmsMetadata({
      data,
      titleFallback: 'Real Results | DMC Trichology',
      descriptionFallback: 'Explore real hair treatment and hair transplant results achieved at DMC Trichology through advanced restoration solutions.',
      imageFallback: data?.hero?.bannerImage || data?.hero?.backgroundImage || ''
    }),
    alternates: {
      canonical: '/results'
    }
  };
}

export default async function Page() {
  const data = await getRealResultsData();
  return (<><SchemaMarkup seo={data?.seo} /><RealResultsPage data={data || {}} /></>);
}
