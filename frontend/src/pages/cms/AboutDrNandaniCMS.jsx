import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  Eye, 
  Settings, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Globe,
  Sliders,
  Award,
  Plus,
  Trash2
} from "lucide-react";

export default function AboutDrNandaniCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/about-dr-nandani");
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Failed to load page settings");
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

  const updateNestedField = (path, value) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = isNaN(parts[i+1]) ? {} : [];
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/about-dr-nandani", data);
      if (res.success) {
        toast.success("Dr. Nandani Dadu CMS saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const { data: res } = await axios.post("/about-dr-nandani/upload-image", formData, {
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
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Dr. Nandani CMS...</p>
        </div>
      </div>
    );
  }

  const SectionTab = ({ id, label, icon: Icon }) => (
    <button
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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Header Panel */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">About Dr. Nandani Dadu CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Section 1 isolated builder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/about-dr-nandani-dadu', '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} />
              Live Preview
            </button>
            <button
              onClick={() => window.open('/cms/visual-builder/about-dr-nandani-dadu', '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-xl font-bold text-sm hover:bg-cyan-100 transition-all shadow-sm"
            >
              <Sparkles size={16} />
              Visual Builder
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {/* Section Tabs - Strictly Isolated & Wrapping for 100% Visibility */}
        <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap items-center gap-1 border-t border-slate-100 bg-white py-1">
          <SectionTab id="hero" label="HERO DESIGN & COPY" icon={User} />
          <SectionTab id="breadcrumb" label="BREADCRUMB CONFIG" icon={Sliders} />
          <SectionTab id="form" label="CONSULTATION FORM DESIGN" icon={ShieldCheck} />
          <SectionTab id="specialist" label="SPECIALIST INFO" icon={Sparkles} />
          <SectionTab id="timeline" label="TIMELINE FLOW" icon={Sliders} />
          <SectionTab id="education" label="EDU & EXP ITEMS" icon={Award} />
          <SectionTab id="credentials" label="CREDENTIALS SECTION" icon={Award} />
          <SectionTab id="trust" label="TRUST SECTION" icon={ShieldCheck} />
          <SectionTab id="seo" label="SEO & METADATA" icon={Globe} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {/* HERO CORE DESIGN & COPY */}
        {activeSection === "hero" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                Hero Content & Spacing Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Eyebrow Heading</label>
                  <input 
                    type="text" 
                    value={data.hero?.mainHeading || ""} 
                    onChange={e => updateSectionField("hero", "mainHeading", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Doctor Name</label>
                  <input 
                    type="text" 
                    value={data.hero?.doctorName || ""} 
                    onChange={e => updateSectionField("hero", "doctorName", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Degree Badge Text</label>
                  <input 
                    type="text" 
                    value={data.hero?.degreeText || ""} 
                    onChange={e => updateSectionField("hero", "degreeText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Hero Background Color (Default: #3b5998)</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.hero?.backgroundColor || "#3b5998"} 
                      onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.hero?.backgroundColor || ""} 
                      onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Editorial Doctor Description Paragraph</label>
                  <textarea 
                    rows={4} 
                    value={data.hero?.descriptionParagraph || ""} 
                    onChange={e => updateSectionField("hero", "descriptionParagraph", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Doctor Portrait Image</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.hero?.doctorImage || ""} 
                      onChange={e => updateSectionField("hero", "doctorImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "hero", "doctorImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Hero Background Image (Optional)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.hero?.backgroundImage || ""} 
                      onChange={e => updateSectionField("hero", "backgroundImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "hero", "backgroundImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Background Overlay Opacity</label>
                    <span className="text-xs font-black text-indigo-600">{data.hero?.overlayOpacity ?? 0.4}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={data.hero?.overlayOpacity ?? 0.4} 
                    onChange={e => updateSectionField("hero", "overlayOpacity", parseFloat(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BREADCRUMB CONFIG */}
        {activeSection === "breadcrumb" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Breadcrumb Section Controls
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Title</label>
                  <input 
                    type="text" 
                    value={data.breadcrumb?.title || ""} 
                    onChange={e => updateSectionField("breadcrumb", "title", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Parent Label</label>
                  <input 
                    type="text" 
                    value={data.breadcrumb?.parentLabel || ""} 
                    onChange={e => updateSectionField("breadcrumb", "parentLabel", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Parent URL</label>
                  <input 
                    type="text" 
                    value={data.breadcrumb?.parentUrl || ""} 
                    onChange={e => updateSectionField("breadcrumb", "parentUrl", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Current Page Text</label>
                  <input 
                    type="text" 
                    value={data.breadcrumb?.currentPageText || ""} 
                    onChange={e => updateSectionField("breadcrumb", "currentPageText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Background Color (Default: #f8f9fa)</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.breadcrumb?.backgroundColor || "#f8f9fa"} 
                      onChange={e => updateSectionField("breadcrumb", "backgroundColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.breadcrumb?.backgroundColor || ""} 
                      onChange={e => updateSectionField("breadcrumb", "backgroundColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONSULTATION FORM DESIGN */}
        {activeSection === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Form Headings & Success Messages
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Section Title</label>
                  <input 
                    type="text" 
                    value={data.formSettings?.title || ""} 
                    onChange={e => updateSectionField("formSettings", "title", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Section Subtitle</label>
                  <input 
                    type="text" 
                    value={data.formSettings?.subtitle || ""} 
                    onChange={e => updateSectionField("formSettings", "subtitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Successful Submit Notification Message</label>
                  <textarea 
                    rows={4} 
                    value={data.formSettings?.successMessage || ""} 
                    onChange={e => updateSectionField("formSettings", "successMessage", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={18} />
                </div>
                Form Input Placeholders & CTA Text
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Name Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.namePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "namePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Email Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.emailPlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "emailPlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Mobile Number Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.phonePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "phonePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Preferred Date Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.datePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "datePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Captcha Code Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.captchaPlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "captchaPlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Submit Button CTA Text</label>
                  <input 
                    type="text" 
                    value={data.hero?.submitButtonText || ""} 
                    onChange={e => updateSectionField("hero", "submitButtonText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Message Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.messagePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "messagePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPECIALIST INFO */}
        {activeSection === "specialist" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Specialist Section Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Heading</label>
                  <input 
                    type="text" 
                    value={data.specialist?.heading || ""} 
                    onChange={e => updateNestedField("specialist.heading", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Paragraph 1</label>
                  <textarea 
                    rows={4} 
                    value={data.specialist?.description1 || ""} 
                    onChange={e => updateNestedField("specialist.description1", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Paragraph 2</label>
                  <textarea 
                    rows={4} 
                    value={data.specialist?.description2 || ""} 
                    onChange={e => updateNestedField("specialist.description2", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Highlighted Bullet Header Text</label>
                  <input 
                    type="text" 
                    value={data.specialist?.highlightedText || ""} 
                    onChange={e => updateNestedField("specialist.highlightedText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Background Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.specialist?.sectionBgColor || "#FFFFFF"} 
                      onChange={e => updateNestedField("specialist.sectionBgColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.specialist?.sectionBgColor || ""} 
                      onChange={e => updateNestedField("specialist.sectionBgColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Card Background Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.specialist?.cardBgColor || "#3b5998"} 
                      onChange={e => updateNestedField("specialist.cardBgColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.specialist?.cardBgColor || ""} 
                      onChange={e => updateNestedField("specialist.cardBgColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Dynamic Bullets List */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Treatment Bullet Items</label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentBullets = data.specialist?.bullets || [];
                        updateNestedField("specialist.bullets", [...currentBullets, "NEW TREATMENT TECHNIQUE"]);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
                    >
                      <Plus size={12} />
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(data.specialist?.bullets || []).map((bullet, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input 
                          type="text" 
                          value={bullet} 
                          onChange={e => updateNestedField(`specialist.bullets.${idx}`, e.target.value)} 
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.specialist.bullets.filter((_, bIdx) => bIdx !== idx);
                            updateNestedField("specialist.bullets", filtered);
                          }}
                          className="p-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE FLOW */}
        {activeSection === "timeline" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Timeline Infographic Config
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Heading</label>
                  <input 
                    type="text" 
                    value={data.timeline?.heading || ""} 
                    onChange={e => updateNestedField("timeline.heading", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Dynamic Image (Centered Below Heading)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.timeline?.sectionImage || ""} 
                      onChange={e => updateSectionField("timeline", "sectionImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "timeline", "sectionImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Background Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.timeline?.sectionBgColor || "#FFFFFF"} 
                      onChange={e => updateNestedField("timeline.sectionBgColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.timeline?.sectionBgColor || ""} 
                      onChange={e => updateNestedField("timeline.sectionBgColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Config List */}
            <div className="space-y-6">
              {(data.timeline?.steps || []).map((step, idx) => (
                <div key={idx} className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                  <h4 className="text-sm font-black mb-6 text-slate-700 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    Timeline Step: {step.title || `Step ${idx+1}`}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Step Number Label</label>
                      <input 
                        type="text" 
                        value={step.numberLabel || ""} 
                        onChange={e => updateNestedField(`timeline.steps.${idx}.numberLabel`, e.target.value)} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Step Title</label>
                      <input 
                        type="text" 
                        value={step.title || ""} 
                        onChange={e => updateNestedField(`timeline.steps.${idx}.title`, e.target.value)} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Step Description</label>
                      <input 
                        type="text" 
                        value={step.description || ""} 
                        onChange={e => updateNestedField(`timeline.steps.${idx}.description`, e.target.value)} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Color Theme (alternating gold/navy)</label>
                      <select
                        value={step.colorMode || "gold"}
                        onChange={e => updateNestedField(`timeline.steps.${idx}.colorMode`, e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none"
                      >
                        <option value="gold">Gold Theme</option>
                        <option value="navy">Navy Theme</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Icon Graphic Shape</label>
                      <select
                        value={step.iconName || "heart"}
                        onChange={e => updateNestedField(`timeline.steps.${idx}.iconName`, e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none"
                      >
                        <option value="heart">Heart (Step 1 default)</option>
                        <option value="brain">Brain (Step 2 default)</option>
                        <option value="kit">Medical Kit (Step 3 default)</option>
                        <option value="tech">Technology Chip (Step 4 default)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION & EXPERIENCE */}
        {activeSection === "education" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Award size={18} />
                </div>
                Education & Experience General Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Education Column Title</label>
                  <input 
                    type="text" 
                    value={data.educationExperience?.educationTitle || ""} 
                    onChange={e => updateNestedField("educationExperience.educationTitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Experience Column Title</label>
                  <input 
                    type="text" 
                    value={data.educationExperience?.experienceTitle || ""} 
                    onChange={e => updateNestedField("educationExperience.experienceTitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Background Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.educationExperience?.sectionBgColor || "#FFFFFF"} 
                      onChange={e => updateNestedField("educationExperience.sectionBgColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.educationExperience?.sectionBgColor || ""} 
                      onChange={e => updateNestedField("educationExperience.sectionBgColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SINGLE PREMIUM CONTAINER FOR BOTH EDUCATION & EXPERIENCE */}
            <div 
              className="premium-inline-editor bg-white rounded-[14px] border p-6 md:p-8 space-y-10"
              style={{ 
                borderColor: "rgba(59,89,152,0.12)",
                fontFamily: "'Marcellus', serif"
              }}
            >
              <style>{`
                .premium-inline-editor input,
                .premium-inline-editor span,
                .premium-inline-editor button,
                .premium-inline-editor h3,
                .premium-inline-editor h4 {
                  font-family: 'Marcellus', serif !important;
                }
                .premium-inline-editor input::placeholder {
                  font-family: 'Marcellus', serif !important;
                  color: #94a3b8;
                }
              `}</style>

              {/* EDUCATION SECTION */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                    Education:
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = data.educationExperience?.educationItems || [];
                      updateNestedField("educationExperience.educationItems", [...currentItems, { degree: "NEW DEGREE / BADGE", institution: "UNIVERSAL INSTITUTE", year: "2026" }]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
                  >
                    <Plus size={12} />
                    Add Qualification
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.educationExperience?.educationItems || []).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col md:flex-row items-center gap-2 md:gap-4 py-2 px-3 hover:bg-slate-50/50 rounded-xl transition-all group"
                    >
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1.5fr_auto_1fr] items-center gap-2 md:gap-3">
                        <input 
                          type="text" 
                          placeholder="Degree Name"
                          value={item.degree || ""} 
                          onChange={e => updateNestedField(`educationExperience.educationItems.${idx}.degree`, e.target.value)} 
                          className="w-full px-3 py-2 bg-transparent border-b border-slate-100 hover:border-slate-300 focus:border-indigo-400 text-sm font-medium text-slate-800 outline-none transition-all" 
                        />
                        <span className="hidden md:inline text-slate-300 font-light">—</span>
                        <input 
                          type="text" 
                          placeholder="Institute Name"
                          value={item.institution || ""} 
                          onChange={e => updateNestedField(`educationExperience.educationItems.${idx}.institution`, e.target.value)} 
                          className="w-full px-3 py-2 bg-transparent border-b border-slate-100 hover:border-slate-300 focus:border-indigo-400 text-sm font-medium text-slate-800 outline-none transition-all" 
                        />
                        <span className="hidden md:inline text-slate-300 font-light">—</span>
                        <input 
                          type="text" 
                          placeholder="Year"
                          value={item.year || ""} 
                          onChange={e => updateNestedField(`educationExperience.educationItems.${idx}.year`, e.target.value)} 
                          className="w-full px-3 py-2 bg-transparent border-b border-slate-100 hover:border-slate-300 focus:border-indigo-400 text-sm font-medium text-slate-800 outline-none transition-all" 
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = data.educationExperience.educationItems.filter((_, iIdx) => iIdx !== idx);
                          updateNestedField("educationExperience.educationItems", filtered);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg opacity-80 hover:opacity-100 transition-all self-end md:self-auto"
                        title="Delete Qualification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(data.educationExperience?.educationItems || []).length === 0 && (
                    <div className="text-sm text-slate-400 italic py-2 pl-3">No education qualifications added. Click Add Qualification to add one.</div>
                  )}
                </div>
              </div>

              {/* EXPERIENCE SECTION */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                    Experience:
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = data.educationExperience?.experienceItems || [];
                      updateNestedField("educationExperience.experienceItems", [...currentItems, { role: "NEW MEDICAL ROLE", hospital: "CLINIC OR HOSPITAL PLACE", duration: "2026 - Present" }]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
                  >
                    <Plus size={12} />
                    Add Experience
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.educationExperience?.experienceItems || []).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col md:flex-row items-center gap-2 md:gap-4 py-2 px-3 hover:bg-slate-50/50 rounded-xl transition-all group"
                    >
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1.5fr_auto_1fr] items-center gap-2 md:gap-3">
                        <input 
                          type="text" 
                          placeholder="Role"
                          value={item.role || ""} 
                          onChange={e => updateNestedField(`educationExperience.experienceItems.${idx}.role`, e.target.value)} 
                          className="w-full px-3 py-2 bg-transparent border-b border-slate-100 hover:border-slate-300 focus:border-indigo-400 text-sm font-medium text-slate-800 outline-none transition-all" 
                        />
                        <span className="hidden md:inline text-slate-300 font-light">—</span>
                        <input 
                          type="text" 
                          placeholder="Hospital"
                          value={item.hospital || ""} 
                          onChange={e => updateNestedField(`educationExperience.experienceItems.${idx}.hospital`, e.target.value)} 
                          className="w-full px-3 py-2 bg-transparent border-b border-slate-100 hover:border-slate-300 focus:border-indigo-400 text-sm font-medium text-slate-800 outline-none transition-all" 
                        />
                        <span className="hidden md:inline text-slate-300 font-light">—</span>
                        <input 
                          type="text" 
                          placeholder="Duration"
                          value={item.duration || ""} 
                          onChange={e => updateNestedField(`educationExperience.experienceItems.${idx}.duration`, e.target.value)} 
                          className="w-full px-3 py-2 bg-transparent border-b border-slate-100 hover:border-slate-300 focus:border-indigo-400 text-sm font-medium text-slate-800 outline-none transition-all" 
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = data.educationExperience.experienceItems.filter((_, iIdx) => iIdx !== idx);
                          updateNestedField("educationExperience.experienceItems", filtered);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg opacity-80 hover:opacity-100 transition-all self-end md:self-auto"
                        title="Delete Experience"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(data.educationExperience?.experienceItems || []).length === 0 && (
                    <div className="text-sm text-slate-400 italic py-2 pl-3">No professional experience records added. Click Add Experience to add one.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREDENTIALS SECTION */}
        {activeSection === "credentials" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Award size={18} />
                </div>
                Credentials Cinematic Banner & Opacity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Cinematic Background Banner Image</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.credentialsSection?.bannerImage || ""} 
                      onChange={e => updateNestedField("credentialsSection.bannerImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "credentialsSection", "bannerImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Banner Overlay Opacity</label>
                    <span className="text-xs font-black text-indigo-600">{data.credentialsSection?.overlayOpacity ?? 0.35}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={data.credentialsSection?.overlayOpacity ?? 0.35} 
                    onChange={e => updateNestedField("credentialsSection.overlayOpacity", parseFloat(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Heading & Repeatable Credentials List
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Main Heading</label>
                  <input 
                    type="text" 
                    value={data.credentialsSection?.heading || ""} 
                    onChange={e => updateNestedField("credentialsSection.heading", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>

                {/* Repeatable Checklist */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Repeatable Credentials Items</label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentList = data.credentialsSection?.credentialsList || [];
                        updateNestedField("credentialsSection.credentialsList", [...currentList, { text: "NEW FELLOWSHIP RECORD" }]);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
                    >
                      <Plus size={12} />
                      Add Credential
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(data.credentialsSection?.credentialsList || []).map((cred, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input 
                          type="text" 
                          value={cred.text || ""} 
                          onChange={e => updateNestedField(`credentialsSection.credentialsList.${idx}.text`, e.target.value)} 
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = data.credentialsSection.credentialsList.filter((_, cIdx) => cIdx !== idx);
                            updateNestedField("credentialsSection.credentialsList", filtered);
                          }}
                          className="p-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Bottom Columns Editorial Content (Expertise & Commitment)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column Fields */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider pb-2 border-b">Left Column: Expertise</h4>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Left Heading</label>
                    <input 
                      type="text" 
                      value={data.credentialsSection?.leftHeading || ""} 
                      onChange={e => updateNestedField("credentialsSection.leftHeading", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Left Body Text (Rich Text HTML)</label>
                    <textarea 
                      rows={12}
                      value={data.credentialsSection?.leftText || ""} 
                      onChange={e => updateNestedField("credentialsSection.leftText", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                    />
                  </div>
                </div>

                {/* Right Column Fields */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider pb-2 border-b">Right Column: Commitment</h4>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Right Heading</label>
                    <input 
                      type="text" 
                      value={data.credentialsSection?.rightHeading || ""} 
                      onChange={e => updateNestedField("credentialsSection.rightHeading", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Right Body Text (Rich Text HTML)</label>
                    <textarea 
                      rows={12}
                      value={data.credentialsSection?.rightText || ""} 
                      onChange={e => updateNestedField("credentialsSection.rightText", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                    />
                  </div>
                </div>

                {/* Padding Control Fields */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Section Padding Top (Default: 120px)</label>
                    <input 
                      type="text" 
                      value={data.credentialsSection?.paddingTop || ""} 
                      onChange={e => updateNestedField("credentialsSection.paddingTop", e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Section Padding Bottom (Default: 80px)</label>
                    <input 
                      type="text" 
                      value={data.credentialsSection?.paddingBottom || ""} 
                      onChange={e => updateNestedField("credentialsSection.paddingBottom", e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TRUST SECTION */}
        {activeSection === "trust" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Heading, Image & Layout config */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={18} />
                </div>
                Trust Section Heading & Left Graphic Card
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Section Main Title Heading</label>
                  <input 
                    type="text" 
                    value={data.trustSection?.heading || ""} 
                    onChange={e => updateNestedField("trustSection.heading", e.target.value)} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Left Portrait Image URL</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.trustSection?.image || ""} 
                      onChange={e => updateNestedField("trustSection.image", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "trustSection", "image")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image Alt Description</label>
                  <input 
                    type="text" 
                    value={data.trustSection?.imageAlt || ""} 
                    onChange={e => updateNestedField("trustSection.imageAlt", e.target.value)} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image Max Width (e.g. 100%, 450px)</label>
                  <input 
                    type="text" 
                    value={data.trustSection?.imageMaxWidth || ""} 
                    onChange={e => updateNestedField("trustSection.imageMaxWidth", e.target.value)} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Section Background Color (Default: #ffffff)</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.trustSection?.backgroundColor || "#ffffff"} 
                      onChange={e => updateNestedField("trustSection.backgroundColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.trustSection?.backgroundColor || ""} 
                      onChange={e => updateNestedField("trustSection.backgroundColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Content Max Width (e.g. 1280px, 100%)</label>
                  <input 
                    type="text" 
                    value={data.trustSection?.contentMaxWidth || ""} 
                    onChange={e => updateNestedField("trustSection.contentMaxWidth", e.target.value)} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Repeatable Trust Point Items List */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <ShieldCheck size={18} />
                  </div>
                  Repeatable Trust Points Checklist
                </h3>
                <button
                  onClick={() => {
                    const currentPoints = data.trustSection?.trustPoints || [];
                    updateNestedField("trustSection.trustPoints", [...currentPoints, { title: "NEW TRUST TITLE", description: "Trust point description goes here..." }]);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                >
                  + Add Trust Point
                </button>
              </div>

              <div className="space-y-6">
                {(data.trustSection?.trustPoints || []).map((point, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-[20px] border border-slate-100 space-y-4 relative">
                    <button
                      onClick={() => {
                        const filtered = data.trustSection.trustPoints.filter((_, cIdx) => cIdx !== idx);
                        updateNestedField("trustSection.trustPoints", filtered);
                      }}
                      className="absolute top-6 right-6 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove trust point"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-10">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Point Title</label>
                        <input 
                          type="text" 
                          value={point.title || ""} 
                          onChange={e => updateNestedField(`trustSection.trustPoints.${idx}.title`, e.target.value)} 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-800 focus:border-indigo-300 transition-all outline-none" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Point Supporting Description</label>
                        <textarea 
                          rows={2}
                          value={point.description || ""} 
                          onChange={e => updateNestedField(`trustSection.trustPoints.${idx}.description`, e.target.value)} 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-semibold text-slate-800 focus:border-indigo-300 transition-all outline-none resize-none" 
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(data.trustSection?.trustPoints || []).length === 0 && (
                  <div className="text-center py-12 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400">No trust points configured yet. Click the button above to add one.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Conclusion & Spacing Control Panel */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Conclusion Text & Spacing Layouts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Bottom Conclusion Editorial Paragraph</label>
                  <textarea 
                    rows={4}
                    value={data.trustSection?.conclusionParagraph || ""} 
                    onChange={e => updateNestedField("trustSection.conclusionParagraph", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Section Spacing Top (Default: 110px)</label>
                  <input 
                    type="text" 
                    value={data.trustSection?.paddingTop || ""} 
                    onChange={e => updateNestedField("trustSection.paddingTop", e.target.value)} 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Section Spacing Bottom (Default: 110px)</label>
                  <input 
                    type="text" 
                    value={data.trustSection?.paddingBottom || ""} 
                    onChange={e => updateNestedField("trustSection.paddingBottom", e.target.value)} 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO SETTINGS CONFIG */}
        {activeSection === "seo" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Globe size={18} />
                </div>
                Search Engine Optimization & Social Sharing
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">SEO Meta Title</label>
                  <input 
                    type="text" 
                    value={data.seo?.metaTitle || ""} 
                    onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">SEO Meta Description</label>
                  <textarea 
                    rows={4} 
                    value={data.seo?.metaDescription || ""} 
                    onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">OG Shared Preview Image (Social Link Image)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.seo?.ogImage || ""} 
                      onChange={e => updateSectionField("seo", "ogImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "seo", "ogImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
