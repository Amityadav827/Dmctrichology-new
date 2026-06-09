import VirtualTourHero from '../../components/VirtualTourHero';
import VirtualTourGallery from '../../components/VirtualTourGallery';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';
import '../service.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchVirtualTourData() {
  try {
    const res = await fetch(`${API_BASE}/virtual-tour?t=${Date.now()}`, {
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
  const data = await fetchVirtualTourData();
  return buildCmsMetadata({
    data,
    titleFallback: data?.hero?.title || 'Virtual Tour | DMC Trichology',
    descriptionFallback: 'Take a 360 virtual tour of DMC Trichology clinic. Explore our premium reception, consultation, and treatment rooms.',
    imageFallback: data?.hero?.bannerImage || data?.tourCards?.[0]?.image || ''
  });
}

export default async function VirtualTourPage() {
  const data = await fetchVirtualTourData();

  const hero = data?.hero || {};
  const tourCards = data?.tourCards || [];

  return (
    <div className="bg-white min-h-screen">
      <VirtualTourHero data={hero} />
      <VirtualTourGallery cards={tourCards} />
    </div>
  );
}
