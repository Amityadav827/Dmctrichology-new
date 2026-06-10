import HairTransplantClinicClient from './HairTransplantClinicClient';
import SchemaMarkup from '../../components/SchemaMarkup';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const clinicImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp';
const transplantImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780555354716-797376172.png';
const clinicReceptionImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780555295549-140347372.png';
const hairlineImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780555281260-376668060.png';

const pageData = {
  hero: {
    mainImage: '',
    galleryImage: clinicImage,
    doctorImage: clinicImage,
    secondaryImage: clinicImage,
    mainHeading: 'BEST HAIR TRANSPLANT CLINIC IN DELHI',
    doctorName: 'DMC Trichology',
    degreeText: 'Advanced Hair Restoration & Scalp Care Centre',
    descriptionParagraph: 'DMC Trichology is a premium hair transplant clinic in Delhi offering advanced hair restoration, FUE, FUT, beard transplant, eyebrow restoration, PRP, mesotherapy, and customized scalp care programs. Every treatment plan is designed after detailed diagnosis, hairline planning, donor-area assessment, and long-term restoration goals.',
    namePlaceholder: 'Your Name',
    phonePlaceholder: 'Mobile Number *',
    captchaPlaceholder: 'Enter Code',
    submitButtonText: 'Schedule Your Visit'
  },
  breadcrumb: {
    title: 'Hair Transplant Clinic In Delhi',
    parentLabel: 'Home',
    parentUrl: '/',
    currentPageText: 'Hair Transplant Clinic In Delhi'
  },
  formSettings: {
    title: 'Request A Private Consultation',
    subtitle: 'Book a confidential scalp and hair restoration assessment with DMC Trichology.',
    successMessage: 'Your consultation request has been received. Our team will contact you shortly.'
  },
  specialist: {
    heading: 'Why Choose DMC Trichology?',
    description1: 'DMC Trichology combines medical expertise, clinical precision, and a refined aesthetic approach to deliver natural-looking hair restoration outcomes. The clinic focuses on identifying the cause of hair loss, protecting donor site health, and planning each procedure around the patient’s facial balance, density goals, and long-term scalp condition.',
    description2: 'From FUE and FUT hair transplants to beard transplant, eyebrow restoration, PRP therapy, mesotherapy, and advanced scalp rejuvenation, DMC Trichology provides a complete ecosystem for hair and scalp care under one premium clinical setting.',
    highlightedText: '',
    bullets: []
  },
  timeline: {
    eyebrow: 'TRUSTED CARE SERVICES',
    heading: 'What Makes DMC Trichology A Trusted Hair Transplant Clinic In Delhi?',
    description: '',
    steps: [
      {
        title: 'Advanced Hair Restoration',
        description: 'Modern transplant planning, graft handling, and hairline design help create natural density with a medically precise approach.'
      },
      {
        title: 'Experienced Medical Team',
        description: 'Patients are guided by trained hair restoration specialists with a strong focus on diagnosis, safety, and predictable outcomes.'
      },
      {
        title: 'Personalized Treatment Plans',
        description: 'Every plan is tailored according to hair loss grade, donor area quality, scalp health, lifestyle, and future progression.'
      },
      {
        title: 'Latest Technology',
        description: 'Advanced imaging, sterile clinical protocols, graft preservation methods, and refined implantation techniques support better results.'
      }
    ]
  },
  trustSection: {
    eyebrow: 'TRUSTED CARE SERVICES',
    heading: 'Clinical Expertise For Hair Restoration, Scalp Health And Natural Results',
    image: transplantImage,
    imageAlt: 'DMC Trichology hair transplant planning',
    trustPoints: [
      {
        title: 'Complete Hair Restoration Planning',
        description: 'The clinic evaluates hair loss pattern, donor availability, scalp condition, hair calibre, and facial structure before recommending FUE, FUT, PRP, or combination therapy.'
      },
      {
        title: 'Natural Hairline Design',
        description: 'Hairline planning is approached with both medical accuracy and aesthetic balance so the final result looks age-appropriate, refined, and natural.'
      },
      {
        title: 'Scalp-Focused Treatment Protocols',
        description: 'Along with surgical restoration, DMC Trichology supports scalp health through PRP, mesotherapy, hair growth boosters, and customized post-care routines.'
      },
      {
        title: 'Beard And Eyebrow Restoration',
        description: 'Specialized restoration options help improve patchy beard growth, reshape eyebrows, and restore density in targeted areas with careful graft placement.'
      }
    ],
    conclusionParagraph: 'DMC Trichology is designed for patients who want a responsible, premium, and medically guided approach to hair restoration in Delhi. The clinic focuses on long-term planning, natural results, and careful aftercare instead of one-size-fits-all procedures.'
  },
  educationExperience: {
    experienceTabLabel: 'Experience',
    educationTabLabel: 'Facilities',
    credentialsTabLabel: 'Technology',
    topImage: clinicReceptionImage,
    bottomImage: hairlineImage,
    experienceItems: [
      {
        role: 'Advanced Hair Transplant Consultations',
        hospital: 'Detailed scalp diagnosis, donor assessment, and treatment planning.',
        duration: 'Clinic Protocol'
      },
      {
        role: 'FUE & FUT Restoration Workflow',
        hospital: 'Structured extraction, preservation, and implantation planning for natural density.',
        duration: 'Surgical Care'
      },
      {
        role: 'Long-Term Hair Growth Management',
        hospital: 'Ongoing support with PRP, mesotherapy, medications, and scalp care.',
        duration: 'Follow-Up'
      }
    ],
    educationItems: [
      {
        degree: 'Dedicated Hair Consultation Rooms',
        institution: 'Private consultation environment for scalp examination and treatment planning.',
        year: 'Facility'
      },
      {
        degree: 'Sterile Procedure Zones',
        institution: 'Clinical setup designed for safe graft handling and patient comfort.',
        year: 'Facility'
      },
      {
        degree: 'Patient Recovery & Review System',
        institution: 'Post-procedure guidance and progress monitoring for better long-term care.',
        year: 'Facility'
      }
    ]
  },
  credentialsSection: {
    heading: 'Technology',
    credentialsList: [
      { text: 'Digital scalp and hairline assessment' },
      { text: 'Advanced graft preservation protocols' },
      { text: 'High-density placement planning' },
      { text: 'Customized post-transplant care guidance' }
    ],
    leftHeading: 'Expertise',
    leftText: 'DMC Trichology combines medical planning, donor-area evaluation, and natural hairline design to create responsible restoration plans for every patient.',
    rightHeading: 'Commitment',
    rightText: 'Every treatment is supported by consultation, procedure planning, post-care guidance, and follow-up so patients understand each step clearly.',
    bannerImage: transplantImage,
    overlayOpacity: 0.25,
    paddingTop: '',
    paddingBottom: ''
  },
  otherSpecialitiesSection: {
    heading: 'Other Specialities',
    introParagraph: 'Along with hair transplant procedures, DMC Trichology provides a wide range of non-surgical and surgical hair restoration solutions for different stages of hair loss and scalp concerns.',
    specialitiesList: [
      { title: 'Hair Transplant' },
      { title: 'Hair Treatments' },
      { title: 'PRP Therapy' },
      { title: 'Mesotherapy' },
      { title: 'Beard Transplant' }
    ],
    conclusionParagraph: 'For patients looking for a **hair transplant clinic in Delhi**, DMC Trichology offers customized consultation, advanced treatment planning, and follow-up support for better hair and scalp health.',
    image: clinicReceptionImage,
    imageAlt: 'DMC Trichology clinic care'
  },
  testimonialsSection: {
    heading: 'Patient Testimonials',
    testimonials: []
  }
};

const faqData = {
  enabled: true,
  badgeText: 'TRUSTED CARE SERVICES',
  heading: 'Frequently Asked Question?',
  buttonText: 'View All Questions',
  categories: [
    {
      title: 'General',
      faqs: [
        {
          question: 'What makes DMC Trichology a trusted hair transplant clinic in Delhi?',
          answer: 'DMC Trichology offers detailed diagnosis, personalized planning, advanced restoration techniques, and structured post-care for natural-looking hair transplant results.'
        },
        {
          question: 'Which hair transplant techniques are available at DMC Trichology?',
          answer: 'The clinic provides FUE, FUT, beard transplant, eyebrow restoration, PRP therapy, mesotherapy, and customized scalp treatment programs.'
        },
        {
          question: 'Is the treatment plan customized for every patient?',
          answer: 'Yes. Treatment is planned after reviewing hair loss grade, donor site quality, scalp health, facial balance, lifestyle, and future hair loss progression.'
        }
      ]
    },
    {
      title: 'Pricing & Billing',
      faqs: [
        {
          question: 'How is hair transplant cost decided?',
          answer: 'Pricing depends on graft requirement, donor area condition, technique used, complexity, and the treatment plan recommended during consultation.'
        },
        {
          question: 'Is consultation required before confirming cost?',
          answer: 'Yes. A consultation helps the clinical team assess the scalp, donor area, and restoration goals before confirming an accurate treatment estimate.'
        }
      ]
    },
    {
      title: 'Our Treatments',
      faqs: [
        {
          question: 'Does DMC Trichology offer non-surgical hair treatments?',
          answer: 'Yes. PRP, mesotherapy, hair growth boosters, and scalp care treatments may be suggested depending on the stage and cause of hair loss.'
        },
        {
          question: 'Can beard and eyebrow restoration be done at the clinic?',
          answer: 'Yes. DMC Trichology offers targeted beard and eyebrow restoration with careful planning for shape, density, and natural placement.'
        },
        {
          question: 'How long does recovery take after hair transplant?',
          answer: 'Most patients return to routine activities within a few days, but healing, shedding, and new growth follow a gradual timeline explained during aftercare.'
        }
      ]
    }
  ]
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

function hasFaqContent(faqSection) {
  return Boolean(
    faqSection?.categories?.some(category => Array.isArray(category.faqs) && category.faqs.length > 0) ||
    faqSection?.faqItems?.length ||
    faqSection?.faqs?.length
  );
}

async function getClinicData() {
  try {
    const response = await fetch(`${API_URL}/hair-transplant-clinic?t=${Date.now()}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    const result = await response.json();
    if (result?.success && result.data) {
      return mergeDeep(pageData, result.data);
    }
  } catch (error) {
    console.error('Failed to fetch Hair Transplant Clinic page CMS data:', error);
  }
  return pageData;
}

export async function generateMetadata() {
  const data = await getClinicData();
  const seo = data.seo || {};
  const title = seo.metaTitle || 'Hair Transplant Clinic In Delhi | DMC Trichology';
  const description = seo.metaDescription || 'Explore DMC Trichology, a premium hair transplant clinic in Delhi for FUE, FUT, beard transplant, eyebrow restoration, PRP, mesotherapy and advanced scalp care.';
  const ogImage = seo.ogImage || data.trustSection?.image || transplantImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }]
    }
  };
}

export default async function HairTransplantClinicPage() {
  const cmsData = await getClinicData();
  return (<><SchemaMarkup seo={cmsData?.seo} /><HairTransplantClinicClient pageData={cmsData} faqData={hasFaqContent(cmsData.faqSection) ? cmsData.faqSection : faqData} /></>);
}
