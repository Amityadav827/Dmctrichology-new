import AboutDaduMedicalCentreClient from './AboutDaduMedicalCentreClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const staticFallback = {
  hero: {
    backgroundImage: '',
    leftImage: '',
    badgeText: 'ABOUT DMC TRICHOLOGY®',
    mainHeading: 'ABOUT DMC TRICHOLOGY®',
    subtitle: "INDIA'S PREMIUM HAIR & SCALP SPECIALIST SOLUTION",
    description: '',
    formTitle: '',
    submitButtonText: 'Schedule Your Visit',
    primaryCtaText: '',
    primaryCtaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    heroImage: ''
  },
  intro: {
    sectionBadge: '',
    sectionHeading: '',
    sectionDescription: '',
    image: '',
    highlights: []
  },
  hairTreatmentCentre: {
    isEnabled: true,
    sectionBadge: 'DMC TRICHOLOGY',
    heading: 'Hair Treatment Centre In Delhi',
    description: '<p>Our focus is on the health of your scalp and hair. DMC-TRICHOLOGY® is a product of a massive transformation in clinical sciences developed by Dr. Nivedita Dadu, India’s most renowned Dermatology Expert. She has established the most advanced skin and <strong>hair treatment centre in Delhi</strong>, India, which is supported by her journey in the field of aesthetic cosmetology, combined with the latest tech and science-backed trichology procedures.</p><p>Our leading expert in the field of trichology is Dr. Nandini Dadu, a notable hair transplant surgeon. Her expertise in the combined technology of cosmetological and trichological sciences is growing swiftly, and she is committed to the latest innovative treatments at optimal client satisfaction. She is also a specialist in pain medicine, anaesthesia, and critical care. The two sisters combined their passion for holistic wellness with entrepreneurship and birthed a growing titan in the Dermatology, Cosmetology, and trichology industry, offering a professional-grade one-stop solution in New Delhi, India.</p><p>To bring our brand of hair expert treatment to as many people as possible, the company is rapidly expanding and growing and strategizing to add more across India.</p>',
    backgroundStyle: 'white'
  },
  holisticApproach: {
    isEnabled: true,
    heading: 'HOLISTIC & INTEGRATIVE APPROACH',
    description: '<p>With years of experience in clinical cosmetology, our experts at DMC-TRICHOLOGY®, the top <strong><em>hair treatment centre in Delhi</em></strong>, located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi) give comprehensive analysis of hair loss problems in its entirety by evaluating patients on the basis of clinical examination, trichoscopy, blood & hormonal evaluation, medical history, lifestyle, genetic factors and environmental conditions.</p><p>Based on this information, our trichology experts are able to suggest personalised treatments, maintain evaluative sessions, give product recommendation & nutritional advice, recommend lifestyle changes to improve the health and appearance of the hair & scalp.</p><p>As part of our specialised treatment regimes, our trichology experts spend a generous amount of time counselling our clients on how to best cope with their conditions.</p>',
    image: '',
    imageAlt: 'DMC Trichology treatment procedure'
  },
  patientFirstApproach: {
    isEnabled: true,
    heading: 'PATIENT-FIRST APPROACH',
    description: '<p>Making you feel comfortable & safe with our world class treatment procedures and effectively guiding you through every step is, above other services, our top-most priority.</p><p>Our trichologists also perform critical evaluative research and precise diagnostic strategies to detect any clinical problems linked with hair loss through clinical examination, Trichoscopy, Blood & Hormonal evaluation.</p><p>We started DMC-TRICHOLOGY® to help you feel more confident and assured that your hair & scalp health is on the right track. Our mission is to provide the most innovative and effective treatments with a gracious, patient-first approach.</p>'
  },
  ourExpertise: {
    isEnabled: true,
    badge: 'DMC EXPERTISE',
    heading: 'OUR EXPERTISE',
    description: '<p>Dadu Medical Centre -Trichology offers microsurgical, highly advanced, artistic DMC-GOLDEN TOUCH® hair restorations for both men and women. Over decades of research & practice, DMC-TRICHOLOGY®, the best <strong><em>hair treatment centre in Delhi</em></strong>, is fully equipped with expert doctors and advanced techniques to ensure outstanding results.</p><p>Our hair transplant specialists maintain sterile techniques in the hair implantation process. Our leading expert, Dr. Nandini Dadu is committed to hair loss treatments as well as skin revitalising procedures with high-tech advanced techniques provided at Dadu Medical Centre, New Delhi.</p>',
    backgroundImage: '',
    overlayEnabled: true,
    ctaText: '',
    ctaLink: ''
  },
  expertiseDetails: {
    isEnabled: true,
    heading: 'OUR EXPERTISE',
    description: '<p>Dadu Medical Centre -Trichology offers microsurgical, highly advanced, artistic DMC-GOLDEN TOUCH® hair restorations for both men and women. Over decades of research & practice, DMC-TRICHOLOGY®, the best <strong><em>hair treatment centre in Delhi</em></strong>, is fully equipped with expert doctors and advanced techniques to ensure outstanding results.</p><p>Our hair transplant specialists maintain sterile techniques in the hair implantation process. Our leading expert, Dr. Nandini Dadu is committed to hair loss treatments as well as skin revitalising procedures with high-tech advanced techniques provided at Dadu Medical Centre, New Delhi.</p><p><strong>Our clinic offers everything from non-surgical face correction treatments to artistic FUE hair transplant surgery for men and women; including:</strong></p><p>DMC Trichology, the best <strong><em>hair treatment centre in Delhi</em></strong>, takes great pride in providing exceptional results and offering the latest techniques via the most advanced technologies available in the world.</p>',
    bulletPoints: [
      'Hair loss treatments with Advanced HGP 2.0',
      'Root Restore Therapy',
      'Mesotherapy',
      'Clinical therapeutic procedures for hair regrowth',
      'In-house trichology salon for optimum scalp health.'
    ]
  },
  infrastructure: {
    isEnabled: true,
    heading: 'OUR INFRASTRUCTURE',
    gallery: [],
    buttonText: 'VIEW MORE',
    buttonLink: '/virtual-tour'
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/about-dmc-trichology?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? { ...staticFallback, ...(result.data || {}) } : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (About DMC Trichology page):', error);
    return staticFallback;
  }
}

async function getHomeFaqData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/home-faq?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('SSR Fetch Error (Home FAQ for About DMC Trichology page):', error);
    return null;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const seo = data.seo || {};
  const title = seo.metaTitle || data.hero?.doctorName || data.hero?.mainHeading || 'About DMC Trichology';
  const heroDescription = data.hero?.descriptionParagraph || data.hero?.description || '';
  const description = seo.metaDescription || (heroDescription
    ? String(heroDescription).replace(/<[^>]+>/g, '').slice(0, 160)
    : 'About DMC Trichology');
  const ogImage = seo.ogImage || data.hero?.doctorImage || data.hero?.heroImage || data.hero?.leftImage || '';

  return {
    title,
    description,
    openGraph: ogImage ? { title, description, images: [{ url: ogImage }] } : { title, description }
  };
}

export default async function AboutDaduMedicalCentreRoute() {
  const [data, faqData] = await Promise.all([
    getPageData(),
    getHomeFaqData()
  ]);

  return <AboutDaduMedicalCentreClient initialData={data} initialFaqData={faqData} />;
}
