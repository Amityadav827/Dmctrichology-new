import React, { Suspense } from 'react';
import AboutDrNiveditaClient from './AboutDrNiveditaClient';

export const metadata = {
  title: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi | DMC Trichology',
  description: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi. Expert in advanced hair restoration, scalp treatments, and comprehensive dermatological care.',
  alternates: {
    canonical: 'https://dmctrichology-mkm4.vercel.app/about-dr-nivedita-dadu'
  },
  openGraph: {
    title: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist',
    description: 'Consult Dr. Nivedita Dadu at DMC Trichology. Expert dermatologist and trichologist in Delhi.',
    url: 'https://dmctrichology-mkm4.vercel.app/about-dr-nivedita-dadu',
    siteName: 'DMC Trichology',
    type: 'website'
  }
};

const staticFallback = {
  hero: {
    backgroundImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI',
    doctorName: 'Dr. Nivedita Dadu',
    degreeText: 'MBBS, MD (Dermatology)',
    descriptionParagraph: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    emailPlaceholder: 'E-Mail Address*',
    datePlaceholder: 'Select Preferred Date*',
    messagePlaceholder: 'Enter Your Message Here',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Schedule Your Visit',
    backgroundColor: '#1a1a2e',
    overlayOpacity: 0.45
  },
  specialist: {
    heading: 'Best Dermatologist & Hair Specialist in Delhi',
    description1: 'Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for her exceptional patient outcomes and research contributions. A fellow of prestigious dermatological societies, she brings unparalleled clinical depth to every patient interaction at DMC Trichology.',
    description2: 'Combining her mastery in dermatology with advanced trichological sciences, Dr. Nivedita delivers comprehensive scalp health solutions — from non-surgical hair restoration therapies to advanced diagnostic protocols — ensuring each patient receives the most effective, evidence-based care.',
    highlightedText: 'She specializes in cutting-edge treatments including:',
    bullets: [
      'Advanced PRP & GFC Therapy',
      'FUE Hair Transplant Surgery',
      'Scalp Micropigmentation',
      'LLLT (Laser Hair Therapy)',
      'Custom Trichological Protocols'
    ],
    sectionBgColor: '#ffffff',
    cardBgColor: '#3b5998'
  },
  seo: {
    metaTitle: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi',
    metaDescription: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi.',
    ogImage: ''
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/about-dr-nivedita?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? result.data : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Dr. Nivedita page):', error);
    return staticFallback;
  }
}

export default async function AboutDrNiveditaPage() {
  const pageData = await getPageData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutDrNiveditaClient initialData={pageData} />
    </Suspense>
  );
}
