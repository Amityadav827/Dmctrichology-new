const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'about_dmc_trichology';

const fallbackData = {
  hero: {
    mainImage: '',
    backgroundImage: '',
    leftImage: '',
    badgeText: '',
    mainHeading: '',
    doctorName: '',
    degreeText: '',
    descriptionParagraph: '',
    subtitle: '',
    description: '',
    formTitle: '',
    submitButtonText: '',
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
  },
  timeline: {
    eyebrow: 'TRUSTED CARE SERVICES',
    heading: '',
    steps: []
  },
  testimonialsSection: {
    heading: 'Patient Testimonials',
    testimonials: []
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections')
      .select('data')
      .eq('key', CMS_KEY)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return res.status(200).json({
      success: true,
      data: row?.data || fallbackData,
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching About DMC Trichology settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = {
      ...(req.body || {}),
      hero: { ...fallbackData.hero, ...(req.body?.hero || {}) },
      intro: {
        ...fallbackData.intro,
        ...(req.body?.intro || {}),
        highlights: Array.isArray(req.body?.intro?.highlights) ? req.body.intro.highlights : []
      },
      hairTreatmentCentre: { ...fallbackData.hairTreatmentCentre, ...(req.body?.hairTreatmentCentre || {}) },
      holisticApproach: { ...fallbackData.holisticApproach, ...(req.body?.holisticApproach || {}) },
      patientFirstApproach: { ...fallbackData.patientFirstApproach, ...(req.body?.patientFirstApproach || {}) },
      ourExpertise: { ...fallbackData.ourExpertise, ...(req.body?.ourExpertise || {}) },
      expertiseDetails: {
        ...fallbackData.expertiseDetails,
        ...(req.body?.expertiseDetails || {}),
        bulletPoints: Array.isArray(req.body?.expertiseDetails?.bulletPoints) ? req.body.expertiseDetails.bulletPoints : fallbackData.expertiseDetails.bulletPoints
      },
      infrastructure: {
        ...fallbackData.infrastructure,
        ...(req.body?.infrastructure || {}),
        gallery: Array.isArray(req.body?.infrastructure?.gallery) ? req.body.infrastructure.gallery : []
      },
      timeline: {
        ...fallbackData.timeline,
        ...(req.body?.timeline || {}),
        steps: Array.isArray(req.body?.timeline?.steps) ? req.body.timeline.steps : []
      },
      testimonialsSection: {
        ...fallbackData.testimonialsSection,
        ...(req.body?.testimonialsSection || {}),
        testimonials: Array.isArray(req.body?.testimonialsSection?.testimonials) ? req.body.testimonialsSection.testimonials : []
      }
    };

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: payload,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating About DMC Trichology settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const publicUrl = await uploadToSupabase(req.file, 'about_dmc_trichology_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading About DMC Trichology asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
