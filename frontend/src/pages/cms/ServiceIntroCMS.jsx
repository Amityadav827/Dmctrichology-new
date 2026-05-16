import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Settings, 
  Layout,
  List
} from "lucide-react";
import { getGalleryItems } from "../../api/services";

// Helper component for Media Uploads
function MediaUploader({ label, value, onChange, onGalleryClick }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('/service-details/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        onChange(res.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
           <input 
             type="text" 
             value={value || ""} 
             onChange={e => onChange(e.target.value)} 
             className="w-full pl-5 pr-44 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
             placeholder="https://..."
           />
           <div className="absolute right-2 top-2 flex gap-1">
             <button onClick={onGalleryClick} type="button" className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1">
               <List size={14} /> Gallery
             </button>
             <label className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1">
               {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
               Upload
               <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
             </label>
           </div>
        </div>
      </div>
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState("content"); // content, gallery

  // Gallery Picker state
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState(null); // { idx, field }

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const intro = res.data?.data?.intro || {};
        setData(prev => ({ 
          ...prev, 
          ...intro
        }));
      })
      .catch(() => toast.error("Failed to load intro data"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, val) => setData(d => ({ ...d, [field]: val }));
  
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

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await getGalleryItems({ page: 1, limit: 100 });
      setGalleryItems(res.data || []);
    } catch (err) {
      toast.error("Failed to load gallery");
    } finally {
      setGalleryLoading(false);
    }
  };

  const openGalleryPicker = (target) => {
    setActiveMediaTarget(target);
    fetchGallery();
    setShowGalleryPicker(true);
  };

  const handleGallerySelect = (item) => {
    if (!activeMediaTarget) return;
    const { idx, field } = activeMediaTarget;
    const url = item.url;
    
    if (idx !== undefined) {
      updateImage(idx, field, url);
    }
    
    setShowGalleryPicker(false);
    toast.success("Image selected from gallery");
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
          <p className="text-sm text-slate-500 font-medium italic">Premium image gallery slider + service information management</p>
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
                        <MediaUploader 
                          label="Image Asset" 
                          value={img.image} 
                          onChange={val => updateImage(i, "image", val)} 
                          onGalleryClick={() => openGalleryPicker({ idx: i, field: "image" })} 
                        />
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

      {/* GALLERY PICKER MODAL */}
      {showGalleryPicker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Media Library</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Select an asset for the service intro</p>
              </div>
              <button 
                onClick={() => setShowGalleryPicker(false)}
                className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400 hover:text-slate-900"
              >
                <Trash2 size={24} />
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              {galleryLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p className="font-bold uppercase tracking-widest text-xs">Loading your assets...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {galleryItems.map((item) => (
                    <div 
                      key={item._id} 
                      onClick={() => handleGallerySelect(item)}
                      className="group relative aspect-square rounded-3xl overflow-hidden border-4 border-transparent hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-xl"
                    >
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">Select Asset</div>
                      </div>
                    </div>
                  ))}
                  {galleryItems.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">No assets found in gallery.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
