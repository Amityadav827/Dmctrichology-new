import OurTeamPage from '../../components/OurTeamPage';

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
    members: [
      {
        image: '',
        name: 'Dr. Nandini Dadu',
        designation: 'Hair Transplant Surgeon',
        qualification: 'MBBS, Senior Consultant, Dadu Medical Centre',
        shortDescription: 'A leading hair restoration expert focused on advanced, natural-looking scalp and hair solutions.',
        profileLink: '/about-dr-nandani-dadu',
        sortOrder: 10
      },
      {
        image: '',
        name: 'Dr. Nivedita Dadu',
        designation: 'Founder, Dadu Medical Centre',
        qualification: 'M.B.B.S., D.D.V.L., D.N.B., M.N.A.M.S (Dermatology)',
        shortDescription: 'A renowned dermatologist and trichology specialist known for clinically refined patient care.',
        profileLink: '/about-dr-nivedita-dadu',
        sortOrder: 20
      }
    ]
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
  return {
    title: data.hero?.pageTitle || 'Our Team',
    description: 'Meet the DMC Trichology team.'
  };
}

export default async function TeamOfDmcRoute() {
  const data = await getPageData();
  return <OurTeamPage data={data} />;
}
