import PressMediaHero from '../../components/PressMediaHero';
import PressMediaShowcase from '../../components/PressMediaShowcase';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';
import '../service.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchPressMediaData() {
  try {
    const res = await fetch(`${API_BASE}/press-media?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const data = await fetchPressMediaData();
  return buildCmsMetadata({
    data,
    titleFallback: data?.hero?.title || 'Press & Media | DMC Trichology',
    descriptionFallback: 'Explore DMC Trichology\'s press and media coverage. See how leading publications feature our award-winning hair transplant and trichology expertise.',
    imageFallback: data?.hero?.bannerImage || data?.mediaCards?.[0]?.mediaImage || ''
  });
}

export default async function PressMediaPage() {
  const data = await fetchPressMediaData();

  const hero = data?.hero || {};
  const mediaCards = data?.mediaCards || [];

  return (
    <div className="bg-white min-h-screen">
      <PressMediaHero data={hero} />
      <PressMediaShowcase cards={mediaCards} />
    </div>
  );
}
