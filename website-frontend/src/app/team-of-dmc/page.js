import OurTeamPage from '../../components/OurTeamPage';
import { buildCmsMetadata } from '../../utils/pageSeoMetadata';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    isEnabled: true,
    backgroundImage: '',
    pageTitle: 'Our Team',
    breadcrumbLabel: 'Our Team',
    overlayOpacity: 0.62
  },
  teamMembers: {
    isEnabled: true,
    members: []
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/our-team?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? { ...staticFallback, ...(result.data || {}) } : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Our Team page):', error);
    return staticFallback;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const firstMember = data.teamMembers?.members?.find(member => member?.name || member?.description || member?.shortDescription);
  return buildCmsMetadata({
    data,
    titleFallback: data.hero?.pageTitle || 'Our Team',
    descriptionFallback: firstMember?.shortDescription || firstMember?.description || 'Meet the DMC Trichology team.',
    imageFallback: data.hero?.backgroundImage || firstMember?.image || ''
  });
}

export default async function TeamOfDmcRoute() {
  const data = await getPageData();
  return <OurTeamPage data={data} />;
}
