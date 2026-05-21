import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Eye, 
  Settings, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Globe,
  Award
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

  // Helper functions for Hero Credentials list
  const updateCredential = (index, value) => {
    const updated = [...(data.hero?.credentials || [])];
    updated[index] = value;
    updateSectionField("hero", "credentials", updated);
  };

  const addCredential = () => {
    const updated = [...(data.hero?.credentials || [])];
    updated.push("New board certification / degree");
    updateSectionField("hero", "credentials", updated);
  };

  const removeCredential = (index) => {
    const updated = [...(data.hero?.credentials || [])];
    updated.splice(index, 1);
    updateSectionField("hero", "credentials", updated);
  };

  // Helper functions for Intro Bullets list
  const updateBullet = (index, value) => {
    const updated = [...(data.intro?.bulletList || [])];
    updated[index] = value;
    updateSectionField("intro", "bulletList", updated);
  };

  const addBullet = () => {
    const updated = [...(data.intro?.bulletList || [])];
    updated.push("New treatment highlight detail");
    updateSectionField("intro", "bulletList", updated);
  };

  const removeBullet = (index) => {
    const updated = [...(data.intro?.bulletList || [])];
    updated.splice(index, 1);
    updateSectionField("intro", "bulletList", updated);
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
      className={`flex items-center justify-center gap-2 px-3 py-4 text-[11px] font-black tracking-wider transition-all border-b-2 whitespace-nowrap flex-1 ${
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
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Isolated Page Configuration Module</p>
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

        {/* Section Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between overflow-x-auto border-t border-slate-100 bg-white scrollbar-hide">
          <SectionTab id="hero" label="HERO SECTION" icon={User} />
          <SectionTab id="intro" label="HAIR SPECIALIST INTRO" icon={Sparkles} />
          <SectionTab id="form" label="FORM SETTINGS" icon={ShieldCheck} />
          <SectionTab id="seo" label="SEO & METADATA" icon={Globe} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {/* HERO SECTION CONFIG */}
        {activeSection === "hero" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                Hero Content Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Eyebrow Badge</label>
                  <input type="text" value={data.hero?.badge || ""} onChange={e => updateSectionField("hero", "badge", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Hero Title</label>
                  <input type="text" value={data.hero?.title || ""} onChange={e => updateSectionField("hero", "title", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Hero Subtitle</label>
                  <textarea rows={3} value={data.hero?.subtitle || ""} onChange={e => updateSectionField("hero", "subtitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Button CTA Text</label>
                  <input type="text" value={data.hero?.ctaText || ""} onChange={e => updateSectionField("hero", "ctaText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Doctor Profile Image</label>
                  <div className="flex gap-4 items-center">
                    <input type="text" value={data.hero?.image || ""} onChange={e => updateSectionField("hero", "image", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "hero", "image")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* DOCTOR CREDENTIALS LIST */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <ShieldCheck size={18} />
                  </div>
                  Doctor Professional Credentials
                </h3>
                <button onClick={addCredential} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-all uppercase tracking-wider">
                  <Plus size={14} /> Add Credential
                </button>
              </div>

              <div className="space-y-4">
                {(data.hero?.credentials || []).map((cred, idx) => (
                  <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-[10px] font-black text-slate-400 w-8 text-center">{idx + 1}</div>
                    <input type="text" value={cred} onChange={e => updateCredential(idx, e.target.value)} 
                      className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                    <button onClick={() => removeCredential(idx)} className="p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(data.hero?.credentials || []).length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">No credentials added. Click "Add Credential" to insert professional details.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HAIR SPECIALIST INTRO CONFIG */}
        {activeSection === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sparkles size={18} />
                </div>
                Intro Section Configuration
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Main Heading</label>
                  <input type="text" value={data.intro?.heading || ""} onChange={e => updateSectionField("intro", "heading", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Secondary Button CTA Text</label>
                  <input type="text" value={data.intro?.ctaText || ""} onChange={e => updateSectionField("intro", "ctaText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Doctor Bio (HTML Supported)</label>
                  <textarea rows={8} value={data.intro?.description || ""} onChange={e => updateSectionField("intro", "description", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-y" />
                </div>
              </div>
            </div>

            {/* TREATMENT HIGHLIGHT BULLETS */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Award size={18} />
                  </div>
                  Treatment Highlights (Bullet points)
                </h3>
                <button onClick={addBullet} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-all uppercase tracking-wider">
                  <Plus size={14} /> Add Highlight
                </button>
              </div>

              <div className="space-y-4">
                {(data.intro?.bulletList || []).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-[10px] font-black text-slate-400 w-8 text-center">{idx + 1}</div>
                    <input type="text" value={bullet} onChange={e => updateBullet(idx, e.target.value)} 
                      className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                    <button onClick={() => removeBullet(idx)} className="p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(data.intro?.bulletList || []).length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">No highlights added. Click "Add Highlight" to insert items.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FORM SETTINGS CONFIG */}
        {activeSection === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={18} />
                </div>
                Consultation Request Form Settings
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Section Title</label>
                  <input type="text" value={data.formSettings?.title || ""} onChange={e => updateSectionField("formSettings", "title", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Section Subtitle</label>
                  <input type="text" value={data.formSettings?.subtitle || ""} onChange={e => updateSectionField("formSettings", "subtitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Successful Submit Notification Message</label>
                  <textarea rows={4} value={data.formSettings?.successMessage || ""} onChange={e => updateSectionField("formSettings", "successMessage", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" />
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
                  <input type="text" value={data.seo?.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">SEO Meta Description</label>
                  <textarea rows={4} value={data.seo?.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">OG Shared Preview Image (Social Link Image)</label>
                  <div className="flex gap-4 items-center">
                    <input type="text" value={data.seo?.ogImage || ""} onChange={e => updateSectionField("seo", "ogImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
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
