import RealResultsPage from '../../components/RealResultsPage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function getRealResultsData() {
  try {
    const response = await fetch(`${API_BASE}/real-results?t=${Date.now()}`, {
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
  const title = data?.hero?.pageTitle || 'Real Results';

  return {
    title: `${title} | DMC Trichology`,
    description: 'Real before and after treatment results from DMC Trichology.',
    alternates: {
      canonical: '/real-results'
    }
  };
}

export default async function Page() {
  const data = await getRealResultsData();
  return <RealResultsPage data={data || {}} />;
}
