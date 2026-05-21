import InfluencerHero from '../../components/InfluencerHero';
import InfluencerShowcase from '../../components/InfluencerShowcase';
import '../service.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Influencers | DMC Trichology',
  description:
    'Hear from our digital creator collaborators about their premium experience at DMC Trichology.',
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchInfluencerData() {
  try {
    const res = await fetch(`${API_BASE}/influencers?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export default async function InfluencersPage() {
  const data = await fetchInfluencerData();

  const hero = data?.hero || {};
  const influencerCards = data?.influencerCards || [];

  return (
    <div className="bg-white min-h-screen">
      <InfluencerHero data={hero} />
      <InfluencerShowcase cards={influencerCards} />
    </div>
  );
}
