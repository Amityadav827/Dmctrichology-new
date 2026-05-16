import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Settings, 
  MousePointer2, 
  ChevronRight,
  CheckCircle2,
  Layout,
  PlayCircle
} from "lucide-react";

export default function ServiceIntroCMS() {
  const [data, setData] = useState({
    badgeText: "HAIR TREATMENT",
    title: "Follicular Unit Extraction (FUE)",
    rating: "4.85",
    duration: "180 mins",
    shortDescription: "Safe, smart & skin-friendly hair repair",
    longDescription: "",
    benefits: [],
    introImages: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content"); // content, gallery, settings

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const intro = res.data?.data?.intro || {};
        // Merge with defaults to ensure all fields exist
        setData(prev => ({ 
          ...prev, 
          ...intro
        }));
      })
      .catch(() => toast.error("Failed to load intro data"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, val) => setData(d => ({ ...d, [field]: val }));
  
  const updateNestedField = (parent, field, val) => {
    setData(d => ({
      ...d,
      [parent]: { ...d[parent], [field]: val }
    }));
  };

  // Images Repeater
  const addImage = () => updateField("introImages", [...(data.introImages || []), { title: "", image: "", alt: "" }]);
  const updateImage = (i, field, val) => {
    const imgs = [...(data.introImages || [])];
    imgs[i] = { ...imgs[i], [field]: val };
    updateField("introImages", imgs);
  };
  const removeImage = (i) => updateField("introImages", (data.introImages || []).filter((_, idx) => idx !== i));

  // Benefits Repeater
  const addBenefit = () => updateField("benefits", [...(data.benefits || []), { text: "" }]);
  const updateBenefit = (i, val) => {
    const pts = [...(data.benefits || [])];
    pts[i] = { text: val };
    updateField("benefits", pts);
  };
  const removeBenefit = (i) => updateField("benefits", (data.benefits || []).filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { intro: data });
      toast.success("Service intro saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout className="text-blue-600" size={20} />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service Details Intro</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium italic">Professional video slider + service information management</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Publish Updates"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab("content")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Right Side Content
        </button>
        <button 
          onClick={() => setActiveTab("gallery")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'gallery' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Left Side Gallery
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  Service Text Information
                </h2>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Badge Text</label>
                      <input type="text" value={data.badgeText} onChange={e => updateField("badgeText", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. HAIR TREATMENT" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Rating Value</label>
                      <input type="text" value={data.rating} onChange={e => updateField("rating", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. 4.85" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Main Service Title</label>
                    <input type="text" value={data.title} onChange={e => updateField("title", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="Follicular Unit Extraction (FUE)" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Duration Text</label>
                      <input type="text" value={data.duration} onChange={e => updateField("duration", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. 180 mins" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Short Catchy Description</label>
                      <input type="text" value={data.shortDescription} onChange={e => updateField("shortDescription", e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="e.g. Safe, smart & skin-friendly" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Long Detailed Description</label>
                    <textarea value={data.longDescription} onChange={e => updateField("longDescription", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none min-h-[160px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none" placeholder="Enter full details about the service..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Repeater */}
            <div className="space-y-8">
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    Benefits Checklist
                  </h2>
                  <button onClick={addBenefit} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm shadow-blue-100">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(data.benefits || []).map((benefit, i) => (
                    <div key={i} className="flex gap-3 group">
                      <div className="flex-1 relative">
                        <input type="text" value={benefit.text} onChange={e => updateBenefit(i, e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder={`Benefit #${i + 1}`} />
                        <CheckCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                      </div>
                      <button onClick={() => removeBenefit(i)} className="p-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(data.benefits || []).length === 0 && (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-400">No benefits added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    Service Gallery Images
                  </h2>
                  <p className="text-xs text-slate-500 font-medium italic">Manage multiple images for the premium gallery slider</p>
                </div>
                <button onClick={addImage} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                  <Plus size={16} /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(data.introImages || []).map((img, i) => (
                  <div key={i} className="group relative bg-slate-50/50 rounded-[28px] border border-slate-100 p-8 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                    <button onClick={() => removeImage(i)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors bg-white p-2.5 rounded-xl shadow-sm opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <span className="text-sm font-black">{i + 1}</span>
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Image Configuration</h4>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image Title</label>
                        <input type="text" value={img.title} onChange={e => updateImage(i, "title", e.target.value)}
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. Treatment Room" />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image URL</label>
                        <div className="relative">
                          <input type="text" value={img.image} onChange={e => updateImage(i, "image", e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="https://..." />
                          <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alt Text</label>
                        <input type="text" value={img.alt} onChange={e => updateImage(i, "alt", e.target.value)}
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Describe the image..." />
                      </div>

                      {img.image && (
                        <div className="mt-4">
                          <img src={img.image} className="w-full h-32 object-cover rounded-2xl shadow-md border-2 border-white" alt="" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(data.introImages || []).length === 0 && (
                  <div className="md:col-span-2 text-center py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <ImageIcon size={48} className="text-slate-200 mx-auto mb-4" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Images Added</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Click the button above to add your first gallery image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
