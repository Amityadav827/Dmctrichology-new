import AboutDrNiveditaClient from './AboutDrNiveditaClient';
import SchemaMarkup from '../../components/SchemaMarkup';

const fallbackMetadata = {
  title: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi | DMC Trichology',
  description: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi. Expert in advanced hair restoration, scalp treatments, and comprehensive dermatological care.',
  alternates: {
    canonical: 'https://dmctrichology-new.vercel.app/about-dr-nivedita-dadu'
  },
  openGraph: {
    title: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist',
    description: 'Consult Dr. Nivedita Dadu at DMC Trichology. Expert dermatologist and trichologist in Delhi.',
    url: 'https://dmctrichology-new.vercel.app/about-dr-nivedita-dadu',
    siteName: 'DMC Trichology',
    type: 'website'
  }
};

const staticFallback = {
  hero: {
    backgroundImage: '',
    mainImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI',
    doctorName: 'Dr. Nivedita Dadu',
    degreeText: 'MBBS, MD (Dermatology)',
    descriptionParagraph: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Schedule Your Visit',
    backgroundColor: '#3b5998',
    overlayOpacity: 0.45
  },
  breadcrumb: {
    parentLabel: 'Home',
    parentUrl: '/',
    currentPageText: 'About Dr Nivedita Dadu',
    backgroundColor: '#f8f9fa'
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
  membership: {
    sectionHeading: 'MEMBERSHIP',
    sectionBgColor: '#ffffff',
    paddingTop: '60px',
    paddingBottom: '60px',
    logos: [
      { id: 1, title: 'EADV', imageUrl: '', link: '', enabled: true },
      { id: 2, title: 'IAM', imageUrl: '', link: '', enabled: true },
      { id: 3, title: 'IADVL', imageUrl: '', link: '', enabled: true },
      { id: 4, title: 'Trichology Society', imageUrl: '', link: '', enabled: true },
      { id: 5, title: 'ISOINEL', imageUrl: '', link: '', enabled: true }
    ]
  },
  educationExperience: {
    sectionBgColor: '#FFFFFF',
    educationTitle: 'EDUCATION',
    experienceTitle: 'EXPERIENCE',
    educationItems: [
      { degree: 'MBBS', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2000' },
      { degree: 'MD (Dermatology)', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2004' }
    ],
    experienceItems: [
      { role: 'Senior Dermatologist', hospital: 'Dr. Ram Manohar Lohia Hospital, New Delhi', duration: '2004 - 2008' },
      { role: 'Fellowship In Hair Science & Trichology', hospital: 'King Edward Memorial Hospital, Mumbai', duration: '2008 - 2010' },
      { role: 'Consultant Dermatologist', hospital: 'Primus Hospital, New Delhi', duration: '2010 - 2012' },
      { role: 'Co-Founder & Senior Dermatologist', hospital: 'DMC Trichology, New Delhi', duration: '2012 - Present' }
    ]
  },
  credentialsSection: {
    bannerImage: '',
    overlayOpacity: 0.35,
    heading: 'Credentials',
    credentialsList: [
      { text: 'Fellowship In Aesthetic Dermatology' },
      { text: 'Fellowship In Hair Science' },
      { text: 'Member — IADVL (Indian Association of Dermatologists)' }
    ],
    leftHeading: 'EXPERTISE IN DERMATOLOGY & HAIR TREATMENT',
    leftText: "<p>Dr. Nivedita Dadu's cutting-edge Hair Loss Treatment techniques have made a significant difference. She is recognized as a <strong>leading dermatologist and trichologist in Delhi</strong> available at DMC Trichology, Vasant Vihar (South Delhi), & Rajouri Garden (West Delhi).</p>",
    rightHeading: 'COMMITMENT TO PATIENT CARE',
    rightText: "<p>Dr. Nivedita Dadu places a high value on the doctor-patient relationship, ensuring individualized care at every step of the treatment journey at DMC Trichology.</p>",
    paddingBottom: '80px'
  },
  otherSpecialitiesSection: {
    heading: 'Other Specialities',
    introParagraph: 'Apart from being a leading expert in Trichological Sciences, Dr. Nivedita Dadu is also a diligent specialist in advanced dermatology, performing a number of cosmetic procedures such as:',
    specialitiesList: [
      { title: 'Laser Skin Resurfacing & Rejuvenation,' },
      { title: 'Chemical Peels & Advanced Facials,' },
      { title: 'Botox, Fillers & Anti-Ageing Treatments,' },
      { title: 'Pigmentation & Melasma Management,' },
      { title: 'Acne & Scar Treatment Protocols.' }
    ],
    conclusionParagraph: 'For more information, contact the **best dermatologist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).',
    image: '',
    imageAlt: 'Dr. Nivedita Other Specialities',
    backgroundColor: '#ffffff',
    cardBackgroundColor: '#3b5998',
    contentMaxWidth: '1200px',
    paddingTop: '100px',
    paddingBottom: '100px',
    gridGap: '70px'
  },
  featuredInSection: {
    sectionHeading: 'As Featured In',
    descriptionText: 'For her strong focus on the doctor-patient relationship, Dr. Nivedita Dadu has become the most sought-after Dermatology expert and also featured in various national and regional publications including:',
    sectionBgColor: '#ffffff',
    paddingTop: '72px',
    paddingBottom: '72px',
    publications: [
      { id: 1, title: 'Dainik Bhaskar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dainik_Bhaskar_logo.svg/320px-Dainik_Bhaskar_logo.svg.png', link: '', enabled: true },
      { id: 2, title: 'NDTV', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/NDTV_logo.svg/320px-NDTV_logo.svg.png', link: '', enabled: true },
      { id: 3, title: 'Femina', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Femina_magazine_logo.svg/320px-Femina_magazine_logo.svg.png', link: '', enabled: true },
      { id: 4, title: 'Deccan Herald', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Deccan_Herald_logo.svg/320px-Deccan_Herald_logo.svg.png', link: '', enabled: true },
      { id: 5, title: "Woman's Era", imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Woman%27s_Era_magazine_logo.svg/320px-Woman%27s_Era_magazine_logo.svg.png', link: '', enabled: true },
      { id: 6, title: 'Hindustan Times', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hindustan_times_logo.svg/320px-hindustan_times_logo.svg.png', link: '', enabled: true },
      { id: 7, title: 'Stayfit', imageUrl: '', link: '', enabled: true },
      { id: 8, title: 'Practo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Practo_Logo.svg/320px-Practo_Logo.svg.png', link: '', enabled: true },
      { id: 9, title: 'Mail Today', imageUrl: '', link: '', enabled: true }
    ]
  },
  patientCareSection: {
    sectionBgColor: '#f8f9fa',
    paddingTop: '80px',
    paddingBottom: '80px',
    maxWidth: '1200px',
    cardBorderRadius: '0px',
    cardShadowIntensity: '0 6px 32px rgba(0,0,0,0.07)',
    gridGap: '32px',
    leftCardTitle: 'Patient Centred Care',
    leftCardBgColor: '#ffffff',
    leftCardContent: "<p>Dr. Nivedita Dadu offers professional-grade, most personalised skin & hair care treatments to each individual patient. She, along with her team of dermatologists & aestheticians, has treated over 100 thousands critical cases throughout her career with optimal results. She is always available to her patients, offering compassionate care and utmost respect to ensure healthy skin & hair for all.</p><p>Dr. Nivedita takes the practice of skin & hair care seriously and will make sure you receive the care you deserve.</p>",
    rightCardTitle: 'Professionalism',
    rightCardBgColor: '#ffffff',
    rightCardContent: "<p>Dr. Nivedita Dadu maintains a highly professional environment to offer quality clinical care. She is one of the most recognised and respected skin & hair specialist professionals making her the best dermatologist giving customised treatment solutions that work- not just today, but for life.</p>"
  },
  associationsSection: {
    sectionHeading:  'ASSOCIATIONS',
    sectionBgColor:  '#ffffff',
    paddingTop:      '72px',
    paddingBottom:   '72px',
    logoSpacing:     '24px',
    logoHeight:      '90px',
    logoCardPadding: '20px 28px',
    associations: [
      { id: 1, title: 'IADVL',                            imageUrl: '', link: '', enabled: true },
      { id: 2, title: 'World Trichology Society',          imageUrl: '', link: '', enabled: true },
      { id: 3, title: 'AAM MMI',                           imageUrl: '', link: '', enabled: true },
      { id: 4, title: 'EADV',                              imageUrl: '', link: '', enabled: true },
      { id: 5, title: 'Association of Cutaneous Surgeons', imageUrl: '', link: '', enabled: true }
    ]
  },
  seo: {
    metaTitle: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi',
    metaDescription: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi.',
    ogImage: ''
  }
};

function mergeDeep(base, source) {
  if (Array.isArray(base)) return Array.isArray(source) ? source : base;
  if (!base || typeof base !== 'object') return source ?? base;
  const output = { ...base, ...(source && typeof source === 'object' ? source : {}) };
  Object.keys(base).forEach((key) => {
    output[key] = mergeDeep(base[key], source?.[key]);
  });
  return output;
}



async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/about-dr-nivedita?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? mergeDeep(staticFallback, result.data || {}) : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Dr. Nivedita page):', error);
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
    console.error('SSR Fetch Error (Home FAQ for Dr. Nivedita page):', error);
    return null;
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const seo = data.seo || {};
  const title = seo.metaTitle || fallbackMetadata.title;
  const description = seo.metaDescription || fallbackMetadata.description;
  const ogImage = seo.ogImage || data.hero?.doctorImage || '';

  return {
    ...fallbackMetadata,
    title,
    description,
    openGraph: {
      ...fallbackMetadata.openGraph,
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {})
    }
  };
}

export default async function AboutDrNiveditaPage() {
  const [pageData, faqData] = await Promise.all([
    getPageData(),
    getHomeFaqData()
  ]);

  return (<><SchemaMarkup seo={pageData?.seo} /><AboutDrNiveditaClient initialData={pageData} initialFaqData={faqData} /></>);
}
