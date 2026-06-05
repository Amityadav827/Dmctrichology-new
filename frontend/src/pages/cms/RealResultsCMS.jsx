import React, { useEffect, useState } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Activity, Eye, Image as ImageIcon, Loader2, Plus, Save, Settings, Trash2 } from "lucide-react";

const beforeImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png";
const afterImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png";

const defaultCards = [
  ["Korean Facial Illumination", "After 6 sessions"],
  ["Acne Arrestor Facial With Salicylic Peel", "After 4 sessions"],
  ["Elastin Boost Facial", "After 5 sessions"],
  ["Derma Revive Facial", "After 4 sessions"],
  ["Hair Growth Restoration", "After 6 sessions"],
  ["Scalp Renewal Therapy", "After 5 sessions"],
  ["PRP Hair Treatment", "After 4 sessions"],
  ["Golden Touch Result", "After 6 sessions"]
].map(([treatmentName, sessionsText], index) => ({
  treatmentName,
  title: treatmentName,
  beforeImage,
  afterImage,
  sessionsText,
  sessions: sessionsText,
  sortOrder: (index + 1) * 10,
  isActive: true
}));

const emptyData = {
  hero: {
    isEnabled: true,
    pageTitle: "Real Results",
    breadcrumbLabel: "Real Results",
    backgroundColor: "#EEF0FA"
  },
  resultsSection: {
    isEnabled: true,
    cards: defaultCards
  }
};

const inputClass = "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all";
const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest";

function normalizeCard(card = {}, index = 0) {
  return {
    treatmentName: card.treatmentName || card.title || "",
    title: card.title || card.treatmentName || "",
    beforeImage: card.beforeImage || "",
    afterImage: card.afterImage || "",
    sessionsText: card.sessionsText || card.sessions || "",
    sessions: card.sessions || card.sessionsText || "",
    sortOrder: card.sortOrder ?? ((index + 1) * 10),
    isActive: card.isActive !== false
  };
}

export default function RealResultsCMS() {
  const [data, setData] = useState(emptyData);
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/results-page");
      if (res.success) {
        setData({
          hero: { ...emptyData.hero, ...(res.data?.hero || {}) },
          resultsSection: {
            ...emptyData.resultsSection,
            ...(res.data?.resultsSection || {}),
            cards: Array.isArray(res.data?.resultsSection?.cards)
              ? res.data.resultsSection.cards.map(normalizeCard)
              : defaultCards
          }
        });
      }
    } catch (error) {
      toast.error("Failed to load Real Results CMS");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateCard = (index, field, value) => {
    setData(prev => {
      const cards = [...(prev.resultsSection?.cards || [])];
      cards[index] = { ...(cards[index] || {}), [field]: value };
      if (field === "treatmentName") cards[index].title = value;
      if (field === "sessionsText") cards[index].sessions = value;
      return { ...prev, resultsSection: { ...prev.resultsSection, cards } };
    });
  };

  const addCard = () => {
    setData(prev => ({
      ...prev,
      resultsSection: {
        ...prev.resultsSection,
        cards: [
          ...(prev.resultsSection?.cards || []),
          normalizeCard({
            treatmentName: "",
            beforeImage,
            afterImage,
            sessionsText: "",
            sortOrder: ((prev.resultsSection?.cards || []).length + 1) * 10,
            isActive: true
          }, prev.resultsSection?.cards?.length || 0)
        ]
      }
    }));
  };

  const removeCard = (index) => {
    setData(prev => ({
      ...prev,
      resultsSection: {
        ...prev.resultsSection,
        cards: (prev.resultsSection?.cards || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const moveCard = (from, to) => {
    if (from === null || to === null || from === to) return;
    setData(prev => {
      const cards = [...(prev.resultsSection?.cards || [])];
      const [item] = cards.splice(from, 1);
      cards.splice(to, 0, item);
      return {
        ...prev,
        resultsSection: {
          ...prev.resultsSection,
          cards: cards.map((card, index) => ({ ...card, sortOrder: (index + 1) * 10 }))
        }
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        resultsSection: {
          ...data.resultsSection,
          cards: (data.resultsSection?.cards || []).map((card, index) => ({
            ...card,
            sortOrder: card.sortOrder ?? ((index + 1) * 10)
          }))
        }
      };
      const { data: res } = await axios.put("/results-page", payload);
      if (res.success) {
        toast.success("Real Results page saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data: res } = await axios.post("/results-page/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.url;
  };

  const handleImageUpload = async (event, index, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingIndex(`${index}-${field}`);
    try {
      const url = await uploadImage(file);
      updateCard(index, field, url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  const previewUrl = `${import.meta.env.VITE_WEBSITE_URL || "http://localhost:3000"}/results`;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const SectionTab = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      className={`flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black tracking-wider transition-all border-b-2 whitespace-nowrap ${
        activeSection === id ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Activity size={14} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Real Results CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hero and before-after result cards</p>
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
          <SectionTab id="hero" label="HERO BANNER" />
          <SectionTab id="cards" label="REAL RESULTS CARDS" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {activeSection === "hero" && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h3 className="text-lg font-black mb-8 text-slate-800">Hero Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="flex items-center gap-3 md:col-span-2">
                <input type="checkbox" checked={!!data.hero?.isEnabled} onChange={e => updateSectionField("hero", "isEnabled", e.target.checked)} />
                <span className="text-sm font-black text-slate-700">Enable Hero</span>
              </label>
              <div>
                <label className={labelClass}>Page Title</label>
                <input value={data.hero?.pageTitle || ""} onChange={e => updateSectionField("hero", "pageTitle", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Breadcrumb Text</label>
                <input value={data.hero?.breadcrumbLabel || ""} onChange={e => updateSectionField("hero", "breadcrumbLabel", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Background Color</label>
                <div className="flex gap-4 items-center">
                  <input type="color" value={data.hero?.backgroundColor || "#EEF0FA"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} className="w-14 h-14 rounded-xl border-0 p-0 bg-transparent cursor-pointer" />
                  <input value={data.hero?.backgroundColor || ""} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "cards" && (
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!data.resultsSection?.isEnabled} onChange={e => updateSectionField("resultsSection", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Real Results Grid</span>
                </label>
                <button type="button" onClick={addCard} className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus size={16} /> Add Result
                </button>
              </div>
            </div>

            {(data.resultsSection?.cards || []).map((card, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  moveCard(dragIndex, index);
                  setDragIndex(null);
                }}
                className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 cursor-move"
              >
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h3 className="text-lg font-black text-slate-800">Result {index + 1}</h3>
                  <button type="button" onClick={() => removeCard(index)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input value={card.treatmentName || ""} onChange={e => updateCard(index, "treatmentName", e.target.value)} placeholder="Treatment Name" className={inputClass} />
                  <input value={card.sessionsText || ""} onChange={e => updateCard(index, "sessionsText", e.target.value)} placeholder="Sessions Text" className={inputClass} />
                  <input type="number" value={card.sortOrder ?? ""} onChange={e => updateCard(index, "sortOrder", Number(e.target.value))} placeholder="Sort Order" className={inputClass} />
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={card.isActive !== false} onChange={e => updateCard(index, "isActive", e.target.checked)} />
                    <span className="text-sm font-black text-slate-700">Active</span>
                  </label>

                  {["beforeImage", "afterImage"].map((field) => (
                    <div key={field} className="space-y-4">
                      <label className={labelClass}>{field === "beforeImage" ? "Before Image" : "After Image"}</label>
                      <div className="flex gap-4 items-center">
                        <input value={card[field] || ""} onChange={e => updateCard(index, field, e.target.value)} placeholder={`${field === "beforeImage" ? "Before" : "After"} Image URL`} className={`${inputClass} flex-1`} />
                        <label className="cursor-pointer shrink-0">
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, index, field)} disabled={!!uploadingIndex} />
                          <span className="flex items-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm border border-indigo-100">
                            {uploadingIndex === `${index}-${field}` ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload
                          </span>
                        </label>
                      </div>
                      {card[field] && <img src={card[field]} alt="" className="w-full max-w-xs h-40 object-cover rounded-2xl border border-slate-200" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
