import HairTransplantClinicClient from './HairTransplantClinicClient';

const clinicImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp';
const transplantImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780555354716-797376172.png';
const clinicReceptionImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780555295549-140347372.png';
const hairlineImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780555281260-376668060.png';

const pageData = {
  hero: {
    galleryImage: clinicImage,
    doctorImage: clinicImage,
    mainHeading: 'BEST HAIR TRANSPLANT CLINIC IN DELHI',
    doctorName: 'DMC Trichology',
    degreeText: 'Advanced Hair Restoration & Scalp Care Centre',
    descriptionParagraph: 'DMC Trichology is a premium hair transplant clinic in Delhi offering advanced hair restoration, FUE, FUT, beard transplant, eyebrow restoration, PRP, mesotherapy, and customized scalp care programs. Every treatment plan is designed after detailed diagnosis, hairline planning, donor-area assessment, and long-term restoration goals.',
    namePlaceholder: 'Your Name',
    phonePlaceholder: 'Mobile Number *',
    emailPlaceholder: 'E-Mail Address *',
    datePlaceholder: 'Select Preferred Date *',
    messagePlaceholder: 'Tell us about your hair concerns...',
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
    highlightedText: 'Our advanced hair and scalp care solutions include:',
    bullets: [
      'FUE HAIR TRANSPLANT',
      'FUT HAIR TRANSPLANT',
      'BEARD TRANSPLANT',
      'EYEBROW RESTORATION',
      'PRP & MESOTHERAPY'
    ]
  },
  timeline: {
    eyebrow: 'TRUSTED CARE SERVICES',
    heading: 'What Makes DMC Trichology A Trusted Hair Transplant Clinic In Delhi?',
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
    credentialsList: [
      { text: 'Digital scalp and hairline assessment' },
      { text: 'Advanced graft preservation protocols' },
      { text: 'High-density placement planning' },
      { text: 'Customized post-transplant care guidance' }
    ]
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
    testimonials: [
      {
        text: 'DMC Trichology made the consultation very clear and comfortable. The team explained my donor area, hairline design, and treatment options in detail before recommending the right plan.',
        patientName: 'Rohit Sharma',
        disclaimer: '* Opinions/Results may vary from person to person.',
        stars: 5
      },
      {
        text: 'I visited the clinic for hair thinning and scalp concerns. The diagnosis was detailed, the treatment plan was practical, and the follow-up care felt very professional.',
        patientName: 'Amit Verma',
        disclaimer: '* Opinions/Results may vary from person to person.',
        stars: 5
      },
      {
        text: 'The clinic has a premium and hygienic setup. I appreciated how carefully the team discussed FUE, recovery time, and what results I could realistically expect.',
        patientName: 'Karan Mehta',
        disclaimer: '* Opinions/Results may vary from person to person.',
        stars: 5
      },
      {
        text: 'My beard restoration consultation was handled with patience and precision. The team helped me understand density, placement, and aftercare before the procedure.',
        patientName: 'Nikhil Arora',
        disclaimer: '* Opinions/Results may vary from person to person.',
        stars: 5
      }
    ]
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

export const metadata = {
  title: 'Hair Transplant Clinic In Delhi | DMC Trichology',
  description: 'Explore DMC Trichology, a premium hair transplant clinic in Delhi for FUE, FUT, beard transplant, eyebrow restoration, PRP, mesotherapy and advanced scalp care.',
  openGraph: {
    title: 'Hair Transplant Clinic In Delhi | DMC Trichology',
    description: 'Premium hair restoration, FUE, FUT, beard transplant and scalp care treatments at DMC Trichology in Delhi.',
    images: [{ url: transplantImage }]
  }
};

export default function HairTransplantClinicPage() {
  return <HairTransplantClinicClient pageData={pageData} faqData={faqData} />;
}
