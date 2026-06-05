const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'faqs_page';
const allowedCategories = ['General', 'Pricing & Billing', 'Our Treatments'];

const defaultFaqs = [
  {
    isEnabled: true,
    category: 'General',
    question: 'What Is The DMC-Golden Touch Technique?',
    answer: 'The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.',
    sortOrder: 10
  },
  {
    isEnabled: true,
    category: 'General',
    question: 'Who Performs The Hair Transplants At DMC Trichology?',
    answer: 'Our procedures are performed by experienced DMC Trichology specialists using personalized planning and advanced clinical care.',
    sortOrder: 20
  },
  {
    isEnabled: true,
    category: 'General',
    question: 'Can Both Men And Women Undergo Hair Transplant Procedures At DMC Trichology?',
    answer: 'Yes. Treatment plans are customized for both men and women based on scalp condition, donor availability, and the desired result.',
    sortOrder: 30
  },
  {
    isEnabled: true,
    category: 'Pricing & Billing',
    question: 'How Is Hair Transplant Pricing Decided?',
    answer: 'Pricing depends on graft requirement, donor area health, treatment complexity, and the final plan confirmed during consultation.',
    sortOrder: 10
  },
  {
    isEnabled: true,
    category: 'Pricing & Billing',
    question: 'Is The Consultation Fee Adjusted In Treatment Cost?',
    answer: 'The billing and adjustment details are explained clearly by the clinic team during your consultation and treatment planning.',
    sortOrder: 20
  },
  {
    isEnabled: true,
    category: 'Pricing & Billing',
    question: 'Are EMI Or Payment Options Available?',
    answer: 'Available payment options can be discussed with the DMC Trichology team before confirming your treatment schedule.',
    sortOrder: 30
  },
  {
    isEnabled: true,
    category: 'Our Treatments',
    question: 'What Types Of Hair Treatments Are Available At DMC Trichology?',
    answer: 'DMC Trichology offers advanced hair transplant, scalp restoration, non-surgical hair therapies, and personalized trichology protocols.',
    sortOrder: 10
  },
  {
    isEnabled: true,
    category: 'Our Treatments',
    question: 'What Should I Wear To My Appointment?',
    answer: 'Wear loose, comfortable clothes. Avoid tight or formal clothing if you are coming for a procedure or detailed consultation.',
    sortOrder: 20
  },
  {
    isEnabled: true,
    category: 'Our Treatments',
    question: 'How Can I Book A Consultation At DMC Trichology?',
    answer: 'You can book a consultation through the website form, call the clinic, or contact the DMC Trichology team directly.',
    sortOrder: 30
  }
];

const fallbackData = {
  hero: {
    isEnabled: true,
    backgroundImage: '',
    pageTitle: 'Frequently Asked Questions',
    breadcrumbLabel: 'Frequently Asked Questions',
    overlayOpacity: 0.64
  },
  faqSection: {
    isEnabled: true,
    faqs: defaultFaqs
  }
};

const normalizeFaq = (faq = {}, index = 0) => ({
  isEnabled: faq.isEnabled !== false,
  question: faq.question || '',
  answer: faq.answer || '',
  category: allowedCategories.includes(faq.category) ? faq.category : 'General',
  sortOrder: Number.isFinite(Number(faq.sortOrder)) ? Number(faq.sortOrder) : (index + 1) * 10
});

const normalizePayload = (source = fallbackData) => ({
  hero: { ...fallbackData.hero, ...(source.hero || {}) },
  faqSection: {
    ...fallbackData.faqSection,
    ...(source.faqSection || {}),
    faqs: Array.isArray(source.faqSection?.faqs) && source.faqSection.faqs.length > 0
      ? source.faqSection.faqs.map(normalizeFaq)
      : defaultFaqs.map(normalizeFaq)
  }
});

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
      data: normalizePayload(row?.data || fallbackData),
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching FAQs page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = normalizePayload(req.body || fallbackData);

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    return res.status(200).json({ success: true, data: payload, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating FAQs page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const publicUrl = await uploadToSupabase(req.file, 'faqs_page_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading FAQs page asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
