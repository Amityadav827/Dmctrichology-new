import React, { useEffect, useState } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
  User
} from "lucide-react";

const emptyData = {
  hero: {
    backgroundImage: "",
    leftImage: "",
    badgeText: "ABOUT DMC TRICHOLOGY®",
    mainHeading: "ABOUT DMC TRICHOLOGY®",
    subtitle: "INDIA'S PREMIUM HAIR & SCALP SPECIALIST SOLUTION",
    description: "",
    formTitle: "",
    submitButtonText: "Submit",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    heroImage: ""
  },
  intro: {
    sectionBadge: "",
    sectionHeading: "",
    sectionDescription: "",
    image: "",
    highlights: []
  },
  hairTreatmentCentre: {
    isEnabled: true,
    sectionBadge: "DMC TRICHOLOGY",
    heading: "Hair Treatment Centre In Delhi",
    description: "<p>Our focus is on the health of your scalp and hair. DMC-TRICHOLOGY® is a product of a massive transformation in clinical sciences developed by Dr. Nivedita Dadu, India’s most renowned Dermatology Expert. She has established the most advanced skin and <strong>hair treatment centre in Delhi</strong>, India, which is supported by her journey in the field of aesthetic cosmetology, combined with the latest tech and science-backed trichology procedures.</p><p>Our leading expert in the field of trichology is Dr. Nandini Dadu, a notable hair transplant surgeon. Her expertise in the combined technology of cosmetological and trichological sciences is growing swiftly, and she is committed to the latest innovative treatments at optimal client satisfaction. She is also a specialist in pain medicine, anaesthesia, and critical care. The two sisters combined their passion for holistic wellness with entrepreneurship and birthed a growing titan in the Dermatology, Cosmetology, and trichology industry, offering a professional-grade one-stop solution in New Delhi, India.</p><p>To bring our brand of hair expert treatment to as many people as possible, the company is rapidly expanding and growing and strategizing to add more across India.</p>",
    backgroundStyle: "white"
  },
  holisticApproach: {
    isEnabled: true,
    heading: "HOLISTIC & INTEGRATIVE APPROACH",
    description: "<p>With years of experience in clinical cosmetology, our experts at DMC-TRICHOLOGY®, the top <strong><em>hair treatment centre in Delhi</em></strong>, located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi) give comprehensive analysis of hair loss problems in its entirety by evaluating patients on the basis of clinical examination, trichoscopy, blood & hormonal evaluation, medical history, lifestyle, genetic factors and environmental conditions.</p><p>Based on this information, our trichology experts are able to suggest personalised treatments, maintain evaluative sessions, give product recommendation & nutritional advice, recommend lifestyle changes to improve the health and appearance of the hair & scalp.</p><p>As part of our specialised treatment regimes, our trichology experts spend a generous amount of time counselling our clients on how to best cope with their conditions.</p>",
    image: "",
    imageAlt: "DMC Trichology treatment procedure"
  },
  patientFirstApproach: {
    isEnabled: true,
    heading: "PATIENT-FIRST APPROACH",
    description: "<p>Making you feel comfortable & safe with our world class treatment procedures and effectively guiding you through every step is, above other services, our top-most priority.</p><p>Our trichologists also perform critical evaluative research and precise diagnostic strategies to detect any clinical problems linked with hair loss through clinical examination, Trichoscopy, Blood & Hormonal evaluation.</p><p>We started DMC-TRICHOLOGY® to help you feel more confident and assured that your hair & scalp health is on the right track. Our mission is to provide the most innovative and effective treatments with a gracious, patient-first approach.</p>"
  },
  ourExpertise: {
    isEnabled: true,
    badge: "DMC EXPERTISE",
    heading: "OUR EXPERTISE",
    description: "<p>Dadu Medical Centre -Trichology offers microsurgical, highly advanced, artistic DMC-GOLDEN TOUCH® hair restorations for both men and women. Over decades of research & practice, DMC-TRICHOLOGY®, the best <strong><em>hair treatment centre in Delhi</em></strong>, is fully equipped with expert doctors and advanced techniques to ensure outstanding results.</p><p>Our hair transplant specialists maintain sterile techniques in the hair implantation process. Our leading expert, Dr. Nandini Dadu is committed to hair loss treatments as well as skin revitalising procedures with high-tech advanced techniques provided at Dadu Medical Centre, New Delhi.</p>",
    backgroundImage: "",
    overlayEnabled: true,
    ctaText: "",
    ctaLink: ""
  },
  expertiseDetails: {
    isEnabled: true,
    heading: "OUR EXPERTISE",
    description: "<p>Dadu Medical Centre -Trichology offers microsurgical, highly advanced, artistic DMC-GOLDEN TOUCH® hair restorations for both men and women. Over decades of research & practice, DMC-TRICHOLOGY®, the best <strong><em>hair treatment centre in Delhi</em></strong>, is fully equipped with expert doctors and advanced techniques to ensure outstanding results.</p><p>Our hair transplant specialists maintain sterile techniques in the hair implantation process. Our leading expert, Dr. Nandini Dadu is committed to hair loss treatments as well as skin revitalising procedures with high-tech advanced techniques provided at Dadu Medical Centre, New Delhi.</p><p><strong>Our clinic offers everything from non-surgical face correction treatments to artistic FUE hair transplant surgery for men and women; including:</strong></p><p>DMC Trichology, the best <strong><em>hair treatment centre in Delhi</em></strong>, takes great pride in providing exceptional results and offering the latest techniques via the most advanced technologies available in the world.</p>",
    bulletPoints: [
      "Hair loss treatments with Advanced HGP 2.0",
      "Root Restore Therapy",
      "Mesotherapy",
      "Clinical therapeutic procedures for hair regrowth",
      "In-house trichology salon for optimum scalp health."
    ]
  },
  infrastructure: {
    isEnabled: true,
    heading: "OUR INFRASTRUCTURE",
    gallery: [],
    buttonText: "VIEW MORE",
    buttonLink: "/virtual-tour"
  }
};

export default function AboutDmcTrichologyCMS() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/about-dmc-trichology");
      if (res.success) {
        const hero = { ...emptyData.hero, ...(res.data?.hero || {}) };
        if (!hero.badgeText) hero.badgeText = emptyData.hero.badgeText;
        if (!hero.mainHeading) hero.mainHeading = emptyData.hero.mainHeading;
        if (!hero.subtitle) hero.subtitle = emptyData.hero.subtitle;
        if (!hero.submitButtonText) hero.submitButtonText = emptyData.hero.submitButtonText;
        setData({
          hero,
          intro: {
            ...emptyData.intro,
            ...(res.data?.intro || {}),
            highlights: Array.isArray(res.data?.intro?.highlights) ? res.data.intro.highlights : []
          },
          hairTreatmentCentre: { ...emptyData.hairTreatmentCentre, ...(res.data?.hairTreatmentCentre || {}) },
          holisticApproach: { ...emptyData.holisticApproach, ...(res.data?.holisticApproach || {}) },
          patientFirstApproach: { ...emptyData.patientFirstApproach, ...(res.data?.patientFirstApproach || {}) },
          ourExpertise: { ...emptyData.ourExpertise, ...(res.data?.ourExpertise || {}) },
          expertiseDetails: {
            ...emptyData.expertiseDetails,
            ...(res.data?.expertiseDetails || {}),
            bulletPoints: Array.isArray(res.data?.expertiseDetails?.bulletPoints) ? res.data.expertiseDetails.bulletPoints : emptyData.expertiseDetails.bulletPoints
          },
          infrastructure: {
            ...emptyData.infrastructure,
            ...(res.data?.infrastructure || {}),
            gallery: Array.isArray(res.data?.infrastructure?.gallery) ? res.data.infrastructure.gallery : []
          }
        });
      }
    } catch (error) {
      toast.error("Failed to load About DMC Trichology page settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateHighlight = (index, value) => {
    setData(prev => {
      const highlights = [...(prev.intro?.highlights || [])];
      highlights[index] = value;
      return {
        ...prev,
        intro: { ...prev.intro, highlights }
      };
    });
  };

  const addHighlight = () => {
    setData(prev => ({
      ...prev,
      intro: {
        ...prev.intro,
        highlights: [...(prev.intro?.highlights || []), ""]
      }
    }));
  };

  const removeHighlight = (index) => {
    setData(prev => ({
      ...prev,
      intro: {
        ...prev.intro,
        highlights: (prev.intro?.highlights || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const updateBulletPoint = (index, value) => {
    setData(prev => {
      const bulletPoints = [...(prev.expertiseDetails?.bulletPoints || [])];
      bulletPoints[index] = value;
      return { ...prev, expertiseDetails: { ...prev.expertiseDetails, bulletPoints } };
    });
  };

  const addBulletPoint = () => {
    setData(prev => ({
      ...prev,
      expertiseDetails: {
        ...prev.expertiseDetails,
        bulletPoints: [...(prev.expertiseDetails?.bulletPoints || []), ""]
      }
    }));
  };

  const removeBulletPoint = (index) => {
    setData(prev => ({
      ...prev,
      expertiseDetails: {
        ...prev.expertiseDetails,
        bulletPoints: (prev.expertiseDetails?.bulletPoints || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const updateGalleryItem = (index, field, value) => {
    setData(prev => {
      const gallery = [...(prev.infrastructure?.gallery || [])];
      gallery[index] = { ...(gallery[index] || {}), [field]: value };
      return { ...prev, infrastructure: { ...prev.infrastructure, gallery } };
    });
  };

  const addGalleryItem = () => {
    setData(prev => ({
      ...prev,
      infrastructure: {
        ...prev.infrastructure,
        gallery: [...(prev.infrastructure?.gallery || []), { image: "", imageAlt: "", caption: "" }]
      }
    }));
  };

  const removeGalleryItem = (index) => {
    setData(prev => ({
      ...prev,
      infrastructure: {
        ...prev.infrastructure,
        gallery: (prev.infrastructure?.gallery || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/about-dmc-trichology", data);
      if (res.success) {
        toast.success("About DMC Trichology page saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const { data: res } = await axios.post("/about-dmc-trichology/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success && res.url) {
        updateSectionField(section, field, res.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleGalleryImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const { data: res } = await axios.post("/about-dmc-trichology/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success && res.url) {
        updateGalleryItem(index, "image", res.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const previewUrl = `${import.meta.env.VITE_WEBSITE_URL || "http://localhost:3000"}/about-dadu-medical-centre`;

  const SectionTab = ({ id, label, icon: Icon }) => (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      className={`flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black tracking-wider transition-all border-b-2 whitespace-nowrap ${
        activeSection === id
          ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </button>
  );

  const ImageUploadField = ({ section, field, label }) => (
    <div>
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">{label}</label>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={data[section]?.[field] || ""}
          onChange={e => updateSectionField(section, field, e.target.value)}
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none"
          placeholder="https://..."
        />
        <label className="cursor-pointer shrink-0">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={e => handleImageUpload(e, section, field)}
            disabled={uploadingImage}
          />
          <span className="flex items-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100">
            {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
            Upload
          </span>
        </label>
      </div>
      {data[section]?.[field] && (
        <div className="mt-4 w-40 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={data[section][field]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium animate-pulse">Loading About DMC Trichology CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">About DMC Trichology CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hero and intro page builder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.open(previewUrl, "_blank")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} />
              Live Preview
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap items-center gap-1 border-t border-slate-100 bg-white py-1">
          <SectionTab id="hero" label="HERO SECTION" icon={User} />
          <SectionTab id="intro" label="INTRO SECTION" icon={Sparkles} />
          <SectionTab id="hair-treatment" label="HAIR TREATMENT CENTRE" icon={Sparkles} />
          <SectionTab id="holistic" label="HOLISTIC APPROACH" icon={Sparkles} />
          <SectionTab id="patient-first" label="PATIENT FIRST APPROACH" icon={Sparkles} />
          <SectionTab id="our-expertise" label="OUR EXPERTISE" icon={Sparkles} />
          <SectionTab id="expertise-details" label="EXPERTISE DETAILS" icon={Sparkles} />
          <SectionTab id="infrastructure" label="OUR INFRASTRUCTURE" icon={Sparkles} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {activeSection === "hero" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                Hero Section
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Badge Text</label>
                  <input type="text" value={data.hero?.badgeText || ""} onChange={e => updateSectionField("hero", "badgeText", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Main Heading</label>
                  <input type="text" value={data.hero?.mainHeading || ""} onChange={e => updateSectionField("hero", "mainHeading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Subtitle</label>
                  <input type="text" value={data.hero?.subtitle || ""} onChange={e => updateSectionField("hero", "subtitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Description</label>
                  <textarea rows={5} value={data.hero?.description || ""} onChange={e => updateSectionField("hero", "description", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Title</label>
                  <input type="text" value={data.hero?.formTitle || ""} onChange={e => updateSectionField("hero", "formTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Submit Button Text</label>
                  <input type="text" value={data.hero?.submitButtonText || ""} onChange={e => updateSectionField("hero", "submitButtonText", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField section="hero" field="backgroundImage" label="Background Image" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField section="hero" field="leftImage" label="Left Image" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Intro Section
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Badge</label>
                  <input type="text" value={data.intro?.sectionBadge || ""} onChange={e => updateSectionField("intro", "sectionBadge", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Heading</label>
                  <input type="text" value={data.intro?.sectionHeading || ""} onChange={e => updateSectionField("intro", "sectionHeading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Description (HTML supported)</label>
                  <textarea rows={7} value={data.intro?.sectionDescription || ""} onChange={e => updateSectionField("intro", "sectionDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField section="intro" field="image" label="Intro Image" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Sparkles size={18} />
                  </div>
                  Optional Highlights / Points
                </h3>
                <button type="button" onClick={addHighlight} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus size={16} />
                  Add Point
                </button>
              </div>

              <div className="space-y-4">
                {(data.intro?.highlights || []).map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={item || ""}
                      onChange={e => updateHighlight(index, e.target.value)}
                      className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none"
                    />
                    <button type="button" onClick={() => removeHighlight(index)} className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
                {(data.intro?.highlights || []).length === 0 && (
                  <p className="text-sm font-semibold text-slate-400">No highlights added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "hair-treatment" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Hair Treatment Centre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="flex items-center gap-3 md:col-span-2">
                  <input type="checkbox" checked={!!data.hairTreatmentCentre?.isEnabled} onChange={e => updateSectionField("hairTreatmentCentre", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Section</span>
                </label>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Badge</label>
                  <input type="text" value={data.hairTreatmentCentre?.sectionBadge || ""} onChange={e => updateSectionField("hairTreatmentCentre", "sectionBadge", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Heading</label>
                  <input type="text" value={data.hairTreatmentCentre?.heading || ""} onChange={e => updateSectionField("hairTreatmentCentre", "heading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Rich Description Editor</label>
                  <textarea rows={10} value={data.hairTreatmentCentre?.description || ""} onChange={e => updateSectionField("hairTreatmentCentre", "description", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-y" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Background Style</label>
                  <select value={data.hairTreatmentCentre?.backgroundStyle || "white"} onChange={e => updateSectionField("hairTreatmentCentre", "backgroundStyle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none">
                    <option value="white">White</option>
                    <option value="soft">Soft Blue</option>
                    <option value="blue">DMC Blue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "holistic" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Holistic & Integrative Approach
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="flex items-center gap-3 md:col-span-2">
                  <input type="checkbox" checked={!!data.holisticApproach?.isEnabled} onChange={e => updateSectionField("holisticApproach", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Section</span>
                </label>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Heading</label>
                  <input type="text" value={data.holisticApproach?.heading || ""} onChange={e => updateSectionField("holisticApproach", "heading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Rich Description</label>
                  <textarea rows={10} value={data.holisticApproach?.description || ""} onChange={e => updateSectionField("holisticApproach", "description", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-y" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField section="holisticApproach" field="image" label="Image Upload" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Image Alt Text</label>
                  <input type="text" value={data.holisticApproach?.imageAlt || ""} onChange={e => updateSectionField("holisticApproach", "imageAlt", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "patient-first" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Patient First Approach
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!data.patientFirstApproach?.isEnabled} onChange={e => updateSectionField("patientFirstApproach", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Section</span>
                </label>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Heading</label>
                  <input type="text" value={data.patientFirstApproach?.heading || ""} onChange={e => updateSectionField("patientFirstApproach", "heading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Rich Description</label>
                  <textarea rows={10} value={data.patientFirstApproach?.description || ""} onChange={e => updateSectionField("patientFirstApproach", "description", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-y" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "our-expertise" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Our Expertise
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="flex items-center gap-3 md:col-span-2">
                  <input type="checkbox" checked={!!data.ourExpertise?.isEnabled} onChange={e => updateSectionField("ourExpertise", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Section</span>
                </label>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Badge</label>
                  <input type="text" value={data.ourExpertise?.badge || ""} onChange={e => updateSectionField("ourExpertise", "badge", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Heading</label>
                  <input type="text" value={data.ourExpertise?.heading || ""} onChange={e => updateSectionField("ourExpertise", "heading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Rich Text Editor</label>
                  <textarea rows={9} value={data.ourExpertise?.description || ""} onChange={e => updateSectionField("ourExpertise", "description", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-y" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField section="ourExpertise" field="backgroundImage" label="Background Image" />
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!data.ourExpertise?.overlayEnabled} onChange={e => updateSectionField("ourExpertise", "overlayEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Overlay Enabled</span>
                </label>
                <div />
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">CTA Text</label>
                  <input type="text" value={data.ourExpertise?.ctaText || ""} onChange={e => updateSectionField("ourExpertise", "ctaText", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">CTA Link</label>
                  <input type="text" value={data.ourExpertise?.ctaLink || ""} onChange={e => updateSectionField("ourExpertise", "ctaLink", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "expertise-details" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Expertise Details
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!data.expertiseDetails?.isEnabled} onChange={e => updateSectionField("expertiseDetails", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Section</span>
                </label>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Heading</label>
                  <input type="text" value={data.expertiseDetails?.heading || ""} onChange={e => updateSectionField("expertiseDetails", "heading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Rich Description</label>
                  <textarea rows={10} value={data.expertiseDetails?.description || ""} onChange={e => updateSectionField("expertiseDetails", "description", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-y" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h3 className="text-lg font-black text-slate-800">Bullet Points</h3>
                <button type="button" onClick={addBulletPoint} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus size={16} /> Add Bullet
                </button>
              </div>
              <div className="space-y-4">
                {(data.expertiseDetails?.bulletPoints || []).map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <input type="text" value={item || ""} onChange={e => updateBulletPoint(index, e.target.value)} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                    <button type="button" onClick={() => removeBulletPoint(index)} className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "infrastructure" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Our Infrastructure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="flex items-center gap-3 md:col-span-2">
                  <input type="checkbox" checked={!!data.infrastructure?.isEnabled} onChange={e => updateSectionField("infrastructure", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Section</span>
                </label>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Heading</label>
                  <input type="text" value={data.infrastructure?.heading || ""} onChange={e => updateSectionField("infrastructure", "heading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Button Text</label>
                  <input type="text" value={data.infrastructure?.buttonText || ""} onChange={e => updateSectionField("infrastructure", "buttonText", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Button Link</label>
                  <input type="text" value={data.infrastructure?.buttonLink || ""} onChange={e => updateSectionField("infrastructure", "buttonLink", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h3 className="text-lg font-black text-slate-800">Gallery Repeater</h3>
                <button type="button" onClick={addGalleryItem} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus size={16} /> Add Image
                </button>
              </div>
              <div className="space-y-6">
                {(data.infrastructure?.gallery || []).map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-700">Gallery Image {index + 1}</h4>
                      <button type="button" onClick={() => removeGalleryItem(index)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" value={item.image || ""} onChange={e => updateGalleryItem(index, "image", e.target.value)} placeholder="Image URL" className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                      <label className="cursor-pointer">
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleGalleryImageUpload(e, index)} disabled={uploadingImage} />
                        <span className="flex items-center justify-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100">
                          {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload
                        </span>
                      </label>
                      <input type="text" value={item.imageAlt || ""} onChange={e => updateGalleryItem(index, "imageAlt", e.target.value)} placeholder="Image Alt" className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                      <input type="text" value={item.caption || ""} onChange={e => updateGalleryItem(index, "caption", e.target.value)} placeholder="Caption" className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                    </div>
                    {item.image && <img src={item.image} alt="" className="w-44 h-28 object-cover rounded-2xl border border-slate-200" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
