const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

const CMS_KEY = "hair_transplant_clinic";

const fallbackImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";

const fallbackData = {
  hero: {
    galleryImage: fallbackImage,
    doctorImage: fallbackImage,
    secondaryImage: fallbackImage,
    mainHeading: "BEST HAIR TRANSPLANT CLINIC IN DELHI",
    doctorName: "DMC Trichology",
    degreeText: "Advanced Hair Restoration & Scalp Care Centre",
    descriptionParagraph: "DMC Trichology is a premium hair transplant clinic in Delhi offering advanced hair restoration, FUE, FUT, beard transplant, eyebrow restoration, PRP, mesotherapy, and customized scalp care programs.",
    submitButtonText: "Schedule Your Visit"
  },
  breadcrumb: {
    title: "Hair Transplant Clinic In Delhi",
    parentLabel: "Home",
    parentUrl: "/",
    currentPageText: "Hair Transplant Clinic In Delhi"
  },
  formSettings: {
    title: "Request A Private Consultation",
    subtitle: "Book a confidential scalp and hair restoration assessment with DMC Trichology.",
    successMessage: "Your consultation request has been received. Our team will contact you shortly."
  },
  specialist: {
    heading: "Why Choose DMC Trichology?",
    description1: "DMC Trichology combines medical expertise, clinical precision, and a refined aesthetic approach to deliver natural-looking hair restoration outcomes.",
    description2: "From FUE and FUT hair transplants to beard transplant, eyebrow restoration, PRP therapy, mesotherapy, and advanced scalp rejuvenation, DMC Trichology provides a complete ecosystem for hair and scalp care.",
    highlightedText: "",
    bullets: []
  },
  timeline: {
    eyebrow: "TRUSTED CARE SERVICES",
    heading: "What Makes DMC Trichology A Trusted Hair Transplant Clinic In Delhi?",
    description: "",
    steps: []
  },
  trustSection: { eyebrow: "TRUSTED CARE SERVICES", heading: "Clinical Expertise For Hair Restoration, Scalp Health And Natural Results", image: fallbackImage, imageAlt: "DMC Trichology hair transplant planning", trustPoints: [], conclusionParagraph: "" },
  educationExperience: { experienceTabLabel: "Experience", educationTabLabel: "Facilities", credentialsTabLabel: "Technology", topImage: fallbackImage, bottomImage: fallbackImage, experienceItems: [], educationItems: [] },
  credentialsSection: {
    heading: "Credentials",
    credentialsList: [],
    bannerImage: "",
    overlayOpacity: 0.35,
    leftHeading: "",
    leftText: "",
    rightHeading: "",
    rightText: "",
    paddingTop: "",
    paddingBottom: ""
  },
  otherSpecialitiesSection: { heading: "Other Specialities", introParagraph: "", specialitiesList: [], conclusionParagraph: "", image: fallbackImage, imageAlt: "DMC Trichology clinic care" },
  testimonialsSection: { heading: "Patient Testimonials", testimonials: [] },
  faqSection: { enabled: true, badgeText: "TRUSTED CARE SERVICES", heading: "Frequently Asked Question?", buttonText: "View All Questions", categories: [] },
  seo: {
    metaTitle: "Hair Transplant Clinic In Delhi | DMC Trichology",
    metaDescription: "Explore DMC Trichology, a premium hair transplant clinic in Delhi for FUE, FUT, beard transplant, eyebrow restoration, PRP, mesotherapy and advanced scalp care.",
    ogImage: fallbackImage
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from("cms_sections")
      .select("data")
      .eq("key", CMS_KEY)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return res.status(200).json({
      success: true,
      data: row?.data || fallbackData,
      isFallback: !row
    });
  } catch (error) {
    console.error("Error fetching Hair Transplant Clinic settings:", error);
    return res.status(500).json({ success: false, message: "Server error fetching settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = req.body || {};
    const { error } = await supabase
      .from("cms_sections")
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: "key" });

    if (error) throw error;
    return res.status(200).json({ success: true, data: payload, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating Hair Transplant Clinic settings:", error);
    return res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image provided" });
    const publicUrl = await uploadToSupabase(req.file, "hair_transplant_clinic_assets");
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error uploading Hair Transplant Clinic asset:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
