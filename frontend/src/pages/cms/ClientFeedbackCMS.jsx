import React, { useEffect, useState } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Eye, Image as ImageIcon, Loader2, MessageSquare, Plus, Save, Settings, Trash2 } from "lucide-react";
import { FRONTEND_URL } from "../../utils/config";

const emptyData = {
  hero: {
    isEnabled: true,
    pageTitle: "Client Feedback",
    breadcrumbLabel: "Client Feedback",
    backgroundColor: "#EEF0FA"
  },
  feedbackSection: {
    isEnabled: true,
    itemsPerPage: 15,
    cards: []
  }
};

const inputClass = "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all";
const labelClass = "block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest";

function normalizeCard(card = {}, index = 0) {
  return {
    image: card.image || card.clientImage || "",
    clientImage: card.clientImage || card.image || "",
    clientName: card.clientName || card.name || "",
    name: card.name || card.clientName || "",
    feedbackText: card.feedbackText || card.feedback || "",
    feedback: card.feedback || card.feedbackText || "",
    rating: card.rating ?? 5,
    location: card.location || "",
    sortOrder: card.sortOrder ?? ((index + 1) * 10),
    isActive: card.isActive !== false
  };
}

export default function ClientFeedbackCMS() {
  const [data, setData] = useState(emptyData);
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/clients-feedback");
      if (res.success) {
        setData({
          hero: { ...emptyData.hero, ...(res.data?.hero || {}) },
          feedbackSection: {
            ...emptyData.feedbackSection,
            ...(res.data?.feedbackSection || {}),
            cards: Array.isArray(res.data?.feedbackSection?.cards)
              ? res.data.feedbackSection.cards.map(normalizeCard)
              : []
          }
        });
      }
    } catch (error) {
      toast.error("Failed to load Client Feedback CMS");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateCard = (index, field, value) => {
    setData(prev => {
      const cards = [...(prev.feedbackSection?.cards || [])];
      cards[index] = { ...(cards[index] || {}), [field]: value };
      if (field === "clientName") cards[index].name = value;
      if (field === "feedbackText") cards[index].feedback = value;
      if (field === "image") cards[index].clientImage = value;
      return { ...prev, feedbackSection: { ...prev.feedbackSection, cards } };
    });
  };

  const addCard = () => {
    setData(prev => ({
      ...prev,
      feedbackSection: {
        ...prev.feedbackSection,
        cards: [
          ...(prev.feedbackSection?.cards || []),
          normalizeCard({
            clientName: "",
            feedbackText: "",
            rating: 5,
            location: "",
            sortOrder: ((prev.feedbackSection?.cards || []).length + 1) * 10,
            isActive: true
          }, prev.feedbackSection?.cards?.length || 0)
        ]
      }
    }));
  };

  const removeCard = (index) => {
    setData(prev => ({
      ...prev,
      feedbackSection: {
        ...prev.feedbackSection,
        cards: (prev.feedbackSection?.cards || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const moveCard = (from, to) => {
    if (from === null || to === null || from === to) return;
    setData(prev => {
      const cards = [...(prev.feedbackSection?.cards || [])];
      const [item] = cards.splice(from, 1);
      cards.splice(to, 0, item);
      return {
        ...prev,
        feedbackSection: {
          ...prev.feedbackSection,
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
        feedbackSection: {
          ...data.feedbackSection,
          cards: (data.feedbackSection?.cards || []).map((card, index) => ({
            ...card,
            sortOrder: card.sortOrder ?? ((index + 1) * 10)
          }))
        }
      };
      const { data: res } = await axios.put("/clients-feedback", payload);
      if (res.success) {
        toast.success("Client Feedback page saved successfully");
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
    const { data: res } = await axios.post("/clients-feedback/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.url;
  };

  const handleCardImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      updateCard(index, "image", url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const previewUrl = `${FRONTEND_URL}/clients-feedback`;

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
      <MessageSquare size={14} />
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
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Client Feedback CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hero and feedback cards</p>
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
          <SectionTab id="cards" label="FEEDBACK CARDS" />
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
                  <input type="checkbox" checked={!!data.feedbackSection?.isEnabled} onChange={e => updateSectionField("feedbackSection", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Feedback Cards</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div>
                    <label className={labelClass}>Items Per Page</label>
                    <input type="number" min="1" value={data.feedbackSection?.itemsPerPage || 3} onChange={e => updateSectionField("feedbackSection", "itemsPerPage", Number(e.target.value))} className="w-36 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                  </div>
                  <button type="button" onClick={addCard} className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                    <Plus size={16} /> Add Feedback
                  </button>
                </div>
              </div>
            </div>

            {(data.feedbackSection?.cards || []).map((card, index) => (
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
                  <h3 className="text-lg font-black text-slate-800">Feedback {index + 1}</h3>
                  <button type="button" onClick={() => removeCard(index)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input value={card.clientName || ""} onChange={e => updateCard(index, "clientName", e.target.value)} placeholder="Client Name" className={inputClass} />
                  <input value={card.location || ""} onChange={e => updateCard(index, "location", e.target.value)} placeholder="Location (optional)" className={inputClass} />
                  <input type="number" min="0" max="5" step="0.1" value={card.rating ?? 5} onChange={e => updateCard(index, "rating", Number(e.target.value))} placeholder="Rating" className={inputClass} />
                  <input type="number" value={card.sortOrder ?? ""} onChange={e => updateCard(index, "sortOrder", Number(e.target.value))} placeholder="Sort Order" className={inputClass} />
                  <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" checked={card.isActive !== false} onChange={e => updateCard(index, "isActive", e.target.checked)} />
                    <span className="text-sm font-black text-slate-700">Active</span>
                  </label>
                  <textarea rows={5} value={card.feedbackText || ""} onChange={e => updateCard(index, "feedbackText", e.target.value)} placeholder="Feedback Text" className={`${inputClass} resize-none md:col-span-2`} />
                  <div className="md:col-span-2 flex gap-4 items-center">
                    <input value={card.image || ""} onChange={e => updateCard(index, "image", e.target.value)} placeholder="Client Image URL" className={`${inputClass} flex-1`} />
                    <label className="cursor-pointer shrink-0">
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleCardImageUpload(e, index)} disabled={uploadingImage} />
                      <span className="flex items-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm border border-indigo-100">
                        {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload
                      </span>
                    </label>
                  </div>
                  {card.image && <img src={card.image} alt="" className="w-28 h-28 object-cover rounded-full border border-slate-200" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
