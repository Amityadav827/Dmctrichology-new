import OurTeamPage from '../../components/OurTeamPage';
import SchemaMarkup from '../../components/SchemaMarkup';
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
    badgeText: 'OUR MEDICAL EXPERTS',
    heading: 'Meet Our Expert Doctors',
    members: []
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
    const response = await fetch(`${API_URL}/our-team?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    if (!result.success) return staticFallback;

    return {
      ...staticFallback,
      ...(result.data || {}),
      hero: {
        ...staticFallback.hero,
        ...(result.data?.hero || {})
      },
      teamMembers: {
        ...staticFallback.teamMembers,
        ...(result.data?.teamMembers || {}),
        members: Array.isArray(result.data?.teamMembers?.members)
          ? result.data.teamMembers.members
          : staticFallback.teamMembers.members
      },
      seo: {
        ...staticFallback.seo,
        ...(result.data?.seo || {})
      }
    };
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
  return (<><SchemaMarkup seo={data?.seo} /><OurTeamPage data={data} /></>);
}
