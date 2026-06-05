import React, { useEffect, useState } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Eye, HelpCircle, Image as ImageIcon, Loader2, Plus, Save, Settings, Trash2 } from "lucide-react";

const defaultFaqs = [
  { isEnabled: true, category: "General", question: "What Is The DMC-Golden Touch Technique?", answer: "The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.", sortOrder: 10 },
  { isEnabled: true, category: "General", question: "Who Performs The Hair Transplants At DMC Trichology?", answer: "Our procedures are performed by experienced DMC Trichology specialists using personalized planning and advanced clinical care.", sortOrder: 20 },
  { isEnabled: true, category: "General", question: "Can Both Men And Women Undergo Hair Transplant Procedures At DMC Trichology?", answer: "Yes. Treatment plans are customized for both men and women based on scalp condition, donor availability, and the desired result.", sortOrder: 30 },
  { isEnabled: true, category: "Pricing & Billing", question: "How Is Hair Transplant Pricing Decided?", answer: "Pricing depends on graft requirement, donor area health, treatment complexity, and the final plan confirmed during consultation.", sortOrder: 10 },
  { isEnabled: true, category: "Pricing & Billing", question: "Is The Consultation Fee Adjusted In Treatment Cost?", answer: "The billing and adjustment details are explained clearly by the clinic team during your consultation and treatment planning.", sortOrder: 20 },
  { isEnabled: true, category: "Pricing & Billing", question: "Are EMI Or Payment Options Available?", answer: "Available payment options can be discussed with the DMC Trichology team before confirming your treatment schedule.", sortOrder: 30 },
  { isEnabled: true, category: "Our Treatments", question: "What Types Of Hair Treatments Are Available At DMC Trichology?", answer: "DMC Trichology offers advanced hair transplant, scalp restoration, non-surgical hair therapies, and personalized trichology protocols.", sortOrder: 10 },
  { isEnabled: true, category: "Our Treatments", question: "What Should I Wear To My Appointment?", answer: "Wear loose, comfortable clothes. Avoid tight or formal clothing if you are coming for a procedure or detailed consultation.", sortOrder: 20 },
  { isEnabled: true, category: "Our Treatments", question: "How Can I Book A Consultation At DMC Trichology?", answer: "You can book a consultation through the website form, call the clinic, or contact the DMC Trichology team directly.", sortOrder: 30 }
];

const emptyData = {
  hero: {
    isEnabled: true,
    backgroundImage: "",
    pageTitle: "Frequently Asked Questions",
    breadcrumbLabel: "Frequently Asked Questions",
    overlayOpacity: 0.64
  },
  faqSection: {
    isEnabled: true,
    faqs: defaultFaqs
  }
};

const faqCategories = ["General", "Pricing & Billing", "Our Treatments"];

export default function FaqsPageCMS() {
  const [data, setData] = useState(emptyData);
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/faqs-page");
      if (res.success) {
        setData({
          hero: { ...emptyData.hero, ...(res.data?.hero || {}) },
          faqSection: {
            ...emptyData.faqSection,
          ...(res.data?.faqSection || {}),
            faqs: Array.isArray(res.data?.faqSection?.faqs)
              ? res.data.faqSection.faqs.map((faq, index) => ({
                  ...faq,
                  category: faqCategories.includes(faq.category) ? faq.category : "General",
                  sortOrder: faq.sortOrder ?? ((index + 1) * 10)
                }))
              : []
          }
        });
      }
    } catch (error) {
      toast.error("Failed to load FAQ page CMS");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateFaq = (index, field, value) => {
    setData(prev => {
      const faqs = [...(prev.faqSection?.faqs || [])];
      faqs[index] = { ...(faqs[index] || {}), [field]: value };
      return { ...prev, faqSection: { ...prev.faqSection, faqs } };
    });
  };

  const addFaq = () => {
    setData(prev => ({
      ...prev,
      faqSection: {
        ...prev.faqSection,
        faqs: [
          ...(prev.faqSection?.faqs || []),
          { isEnabled: true, question: "", answer: "", category: "General", sortOrder: ((prev.faqSection?.faqs || []).length + 1) * 10 }
        ]
      }
    }));
  };

  const removeFaq = (index) => {
    setData(prev => ({
      ...prev,
      faqSection: {
        ...prev.faqSection,
        faqs: (prev.faqSection?.faqs || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/faqs-page", data);
      if (res.success) {
        toast.success("FAQ page saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const { data: res } = await axios.post("/faqs-page/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success && res.url) {
        updateSectionField("hero", "backgroundImage", res.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const previewUrl = `${import.meta.env.VITE_WEBSITE_URL || "http://localhost:3000"}/faqs`;

  const SectionTab = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      className={`flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black tracking-wider transition-all border-b-2 whitespace-nowrap ${
        activeSection === id ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      <HelpCircle size={14} />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
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
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Frequently Asked Questions CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hero and FAQ management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => window.open(previewUrl, "_blank")} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Eye size={16} /> Live Preview
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-200 transition-all active:scale-95">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap items-center gap-1 border-t border-slate-100 bg-white py-1">
          <SectionTab id="hero" label="HERO SECTION" />
          <SectionTab id="faqs" label="FAQ MANAGEMENT" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {activeSection === "hero" && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h3 className="text-lg font-black mb-8 text-slate-800">Hero Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="flex items-center gap-3 md:col-span-2">
                <input type="checkbox" checked={!!data.hero?.isEnabled} onChange={e => updateSectionField("hero", "isEnabled", e.target.checked)} />
                <span className="text-sm font-black text-slate-700">Enable Hero</span>
              </label>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Page Title</label>
                <input value={data.hero?.pageTitle || ""} onChange={e => updateSectionField("hero", "pageTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Label</label>
                <input value={data.hero?.breadcrumbLabel || ""} onChange={e => updateSectionField("hero", "breadcrumbLabel", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Overlay Opacity</label>
                <input type="number" min="0" max="1" step="0.05" value={data.hero?.overlayOpacity ?? 0.64} onChange={e => updateSectionField("hero", "overlayOpacity", Number(e.target.value))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Background Image</label>
                <div className="flex gap-4 items-center">
                  <input value={data.hero?.backgroundImage || ""} onChange={e => updateSectionField("hero", "backgroundImage", e.target.value)} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" placeholder="https://..." />
                  <label className="cursor-pointer shrink-0">
                    <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} disabled={uploadingImage} />
                    <span className="flex items-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm border border-indigo-100">
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "faqs" && (
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!data.faqSection?.isEnabled} onChange={e => updateSectionField("faqSection", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable FAQ Listing</span>
                </label>
                <button type="button" onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus size={16} /> Add FAQ
                </button>
              </div>
            </div>

            {(data.faqSection?.faqs || []).map((faq, index) => (
              <div key={index} className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h3 className="text-lg font-black text-slate-800">FAQ {index + 1}</h3>
                  <button type="button" onClick={() => removeFaq(index)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" checked={faq.isEnabled !== false} onChange={e => updateFaq(index, "isEnabled", e.target.checked)} />
                    <span className="text-sm font-black text-slate-700">Enable FAQ</span>
                  </label>
                  <input value={faq.question || ""} onChange={e => updateFaq(index, "question", e.target.value)} placeholder="Question" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none md:col-span-2" />
                  <textarea rows={5} value={faq.answer || ""} onChange={e => updateFaq(index, "answer", e.target.value)} placeholder="Answer" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none resize-y md:col-span-2" />
                  <select value={faqCategories.includes(faq.category) ? faq.category : "General"} onChange={e => updateFaq(index, "category", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none">
                    {faqCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input type="number" value={faq.sortOrder ?? ""} onChange={e => updateFaq(index, "sortOrder", Number(e.target.value))} placeholder="Sort Order" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
