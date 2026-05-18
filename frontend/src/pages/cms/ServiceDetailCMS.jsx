import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Layout, Type, List, CheckCircle, HelpCircle,
  Image as ImageIcon, Video, Plus, Trash2, RefreshCw, Globe, 
  ArrowUp, ArrowDown, Upload, Film, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Unified Media Item Editor (supports Image + Video) ───────────────────────
function MediaItemEditor({ item, index, onUpdate, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);

  const uploadFile = async (file, fieldName, setLoadingFn) => {
    const fd = new FormData();
    fd.append('image', file);
    setLoadingFn(true);
    try {
      const res = await axios.post('/service-details/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        onUpdate(fieldName, res.data.url);
        toast.success(fieldName === 'url' ? "Media uploaded!" : "Thumbnail uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setLoadingFn(false);
    }
  };

  const isVideo = item.type === 'video';
  const previewUrl = isVideo ? (item.thumbnail || '') : (item.url || '');

  return (
    <div className="group relative bg-white rounded-[24px] border-2 border-slate-100 hover:border-blue-200 p-6 transition-all duration-300 shadow-sm hover:shadow-lg">
      {/* Slide Number + Remove */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-xs font-black text-white">{index + 1}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slide {index + 1}</span>
        </div>
        <button 
          onClick={onRemove} 
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Media Type Toggle */}
      <div className="mb-5">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Media Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onUpdate('type', 'image')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
              !isVideo 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <ImageIcon size={13} /> Image
          </button>
          <button
            type="button"
            onClick={() => onUpdate('type', 'video')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
              isVideo 
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Film size={13} /> Video
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Slide Title</label>
        <input 
          type="text" 
          value={item.title || ''} 
          onChange={e => onUpdate('title', e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="e.g. Treatment Overview"
        />
      </div>

      {/* Main Media URL + Upload */}
      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">
          {isVideo ? 'Video File URL or Embed URL' : 'Image URL'}
        </label>
        <div className="flex gap-3 items-center">
          {/* Preview Thumbnail */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {isVideo ? <Film size={20} className="text-slate-300" /> : <ImageIcon size={20} className="text-slate-300" />}
              </div>
            )}
            {isVideo && previewUrl && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                  <Film size={12} className="text-violet-600" />
                </div>
              </div>
            )}
          </div>

          {/* URL Input */}
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={item.url || ''} 
              onChange={e => onUpdate('url', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-24"
              placeholder={isVideo ? 'https://... (mp4/webm/embed)' : 'https://...'}
            />
            {!isVideo && (
              <label className="absolute right-2 top-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all flex items-center gap-1">
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                Upload
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'url', setUploading)} 
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Video Thumbnail (only for video type) */}
      {isVideo && (
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Video Thumbnail Image</label>
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={20} className="text-slate-300" />
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={item.thumbnail || ''} 
                onChange={e => onUpdate('thumbnail', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all pr-24"
                placeholder="Thumbnail URL..."
              />
              <label className="absolute right-2 top-1.5 bg-violet-50 text-violet-600 hover:bg-violet-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all flex items-center gap-1">
                {thumbUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                Upload
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'thumbnail', setThumbUploading)} 
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Alt Text */}
      <div>
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Alt Text (SEO)</label>
        <input 
          type="text" 
          value={item.alt || ''} 
          onChange={e => onUpdate('alt', e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Describe this media for SEO..."
        />
      </div>
    </div>
  );
}

// ─── Standard Media Uploader (for other sections) ────────────────────────────
function MediaUploader({ label, value, onChange }) {
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
    } catch {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-slate-200" />
        )}
        <div className="flex-1 relative">
           <input 
             type="text" 
             value={value || ""} 
             onChange={e => onChange(e.target.value)} 
             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl pr-28 outline-none focus:border-blue-500 transition-all text-sm" 
             placeholder="https://..."
           />
           <label className="absolute right-2 top-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1">
             {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
             Upload
             <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
        </div>
      </div>
    </div>
  );
}

// Reordering helper
const moveArrayItem = (arr, index, direction) => {
  const newArr = [...arr];
  if (direction === 'up' && index > 0) {
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
  } else if (direction === 'down' && index < newArr.length - 1) {
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
  }
  return newArr;
};

export default function ServiceDetailCMS() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [data, setData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("banner");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: "", category: "Laser" });
  const [creating, setCreating] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get("/service-listing-cards");
      if (res.data?.data) {
        setServices(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      toast.error("Failed to load services list");
    }
    return [];
  };

  useEffect(() => {
    fetchServices().then(data => {
      if (data.length > 0) {
        setSelectedSlug(data[0].slug);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    
    setFetchingDetails(true);
    axios.get(`/service-details/${selectedSlug}`)
      .then(res => {
        if (res.data?.data) {
          const fetchedData = res.data.data;
          // Normalize intro media — convert any legacy format to introMedia
          if (fetchedData.intro) {
            const intro = fetchedData.intro;
            if (!intro.introMedia || intro.introMedia.length === 0) {
              if (Array.isArray(intro.videos) && intro.videos.length > 0) {
                intro.introMedia = intro.videos.map(v => ({
                  type: v.videoUrl ? 'video' : 'image',
                  url: v.thumbnail || v.image || v.videoUrl || '',
                  title: v.title || '',
                  alt: v.title || '',
                  thumbnail: v.thumbnail || v.image || ''
                }));
              } else if (Array.isArray(intro.introImages) && intro.introImages.length > 0) {
                intro.introMedia = intro.introImages.map(img => ({
                  type: 'image',
                  url: img.image || img.url || '',
                  title: img.title || '',
                  alt: img.alt || img.title || '',
                  thumbnail: img.image || img.url || ''
                }));
              } else {
                intro.introMedia = [];
              }
            }
          }
          setData(fetchedData);
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          const serviceInfo = services.find(s => s.slug === selectedSlug) || {};
          setData({
            slug: selectedSlug,
            title: serviceInfo.title || "",
            category: serviceInfo.category || "",
            banner: { badgeText: "PREMIUM TREATMENT", title: serviceInfo.title || "", subtitle: "", duration: "45 mins", rating: "4.9", buttonText: "Book Consultation", backgroundImage: "" },
            intro: { badgeText: "ABOUT THE TREATMENT", title: serviceInfo.title || "", rating: "4.9", duration: "45 mins", shortDescription: "", longDescription: "", benefits: [], closingText: "", introMedia: [] },
            process: { sectionTitle: "How it works?", processSteps: [] },
            idealFrequency: { frequencyTitle: "Treatment Frequency & Suitability", frequencyDescription: "", idealForPoints: [], notIdealForPoints: [], ctaTitle: "", ctaDescription: "", ctaButtonText: "", ctaButtonLink: "", ctaImage: "" },
            beforeAfter: { beforeTitle: "Before Treatment Checklist", afterTitle: "Aftercare Instructions", beforePoints: [], afterPoints: [], sectionBackground: "#f9f7f2" },
            faqEnquiry: { faqTitle: "Common Concerns Addressed", faqSubtitle: "", faqItems: [], serviceOptions: [], formTitle: "Enquire About This Treatment", buttonText: "Schedule Your Visit", namePlaceholder: "Name*", emailPlaceholder: "E-Mail Address*", servicePlaceholder: "Type Of Service Enquiry*", datePlaceholder: "Select Date & Time*" },
            footerCta: { heading: "", description: "", emailPlaceholder: "", buttonText: "" },
            seo: { metaTitle: "", metaDescription: "", canonicalUrl: "", ogImage: "", schemaScript: "" }
          });
        } else {
          toast.error("Failed to load service details");
        }
      })
      .finally(() => setFetchingDetails(false));
  }, [selectedSlug, services]);

  const updateSectionField = (section, field, val) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: val }
    }));
  };

  const addArrayItem = (section, arrayField, defaultItem) => {
    const arr = [...(data[section][arrayField] || [])];
    arr.push(defaultItem);
    updateSectionField(section, arrayField, arr);
  };
  
  const updateArrayItem = (section, arrayField, idx, field, val) => {
    const arr = [...(data[section][arrayField] || [])];
    if (typeof arr[idx] === 'object') {
      arr[idx] = { ...arr[idx], [field]: val };
    } else {
      arr[idx] = val;
    }
    updateSectionField(section, arrayField, arr);
  };

  const removeArrayItem = (section, arrayField, idx) => {
    const arr = (data[section][arrayField] || []).filter((_, i) => i !== idx);
    updateSectionField(section, arrayField, arr);
  };

  const reorderArrayItem = (section, arrayField, idx, direction) => {
    const newArr = moveArrayItem(data[section][arrayField] || [], idx, direction);
    updateSectionField(section, arrayField, newArr);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await axios.put(`/service-details/${selectedSlug}`, data);
      toast.success("Service details saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.title.trim()) return toast.error("Title is required");
    setCreating(true);
    try {
      const slug = newService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await axios.post('/service-listing-cards', { title: newService.title, category: newService.category, slug: slug, status: "Published" });
      if (res.data?.success) {
        toast.success("Service created!");
        await fetchServices();
        setIsCreateModalOpen(false);
        setNewService({ title: "", category: "Laser" });
        setSelectedSlug(slug);
      }
    } catch (err) {
      toast.error("Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Service CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage individual service page content</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate(`/cms/visual-builder/details?service=${selectedSlug}`)} disabled={fetchingDetails || !data} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-200 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all">
             <Layout size={16} /> Visual Builder
           </button>
           <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
             <Plus size={16} /> New Service
           </button>
           <button onClick={handleSave} disabled={saving || fetchingDetails || !data}
             className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
             {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {saving ? "Saving..." : "Publish Updates"}
           </button>
        </div>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-[12px] font-black uppercase text-slate-500 tracking-widest min-w-max">Select Service to Edit:</label>
        <select 
          value={selectedSlug} 
          onChange={e => setSelectedSlug(e.target.value)}
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
        >
          {services.map(s => (
            <option key={s.slug} value={s.slug}>{s.title} ({s.category})</option>
          ))}
        </select>
      </div>

      {!data || fetchingDetails ? (
         <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center">
            <RefreshCw className="animate-spin mb-4 text-blue-600" size={32} />
            Loading structure...
         </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 bg-slate-200/50 p-1.5 rounded-[20px] mb-8 w-fit">
            {[
              { id: "banner", label: "Hero & Intro", icon: Layout },
              { id: "process", label: "Process Steps", icon: List },
              { id: "idealFrequency", label: "Suitability & CTA", icon: CheckCircle },
              { id: "beforeAfter", label: "Before/After", icon: RefreshCw },
              { id: "faqEnquiry", label: "FAQs & Options", icon: HelpCircle },
              { id: "footerCta", label: "Footer CTA", icon: Layout },
              { id: "seo", label: "SEO Settings", icon: Globe }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === 'banner' && (
              <>
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Layout size={18} className="text-blue-500"/> Hero Banner Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.banner.badgeText || ""} onChange={e => updateSectionField("banner", "badgeText", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Title</label>
                    <input type="text" value={data.banner.title || ""} onChange={e => updateSectionField("banner", "title", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 mt-8">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Service Intro Description</h3>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Intro Heading</label>
                      <input type="text" value={data.intro.introHeading || ""} onChange={e => updateSectionField("intro", "introHeading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Short Description</label>
                      <input type="text" value={data.intro.shortDescription || ""} onChange={e => updateSectionField("intro", "shortDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Long Description</label>
                    <textarea value={data.intro.longDescription || ""} onChange={e => updateSectionField("intro", "longDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[120px]" />
                  </div>

                  {/* RESTORED GRID FOR BENEFITS AND MEDIA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 pt-8 mt-4">
                    {/* LEFT: Benefits */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Benefits Bullet Points</label>
                        <button onClick={() => addArrayItem("intro", "benefits", { text: "" })} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14}/></button>
                      </div>
                      <div className="space-y-3">
                        {(data.intro.benefits || []).map((b, i) => (
                           <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <input type="text" value={b.text || ""} onChange={e => updateArrayItem("intro", "benefits", i, "text", e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Benefit Point..." />
                              <button onClick={() => removeArrayItem("intro", "benefits", i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                           </div>
                        ))}
                      </div>
                    </div>

                     <div>
                       <div className="flex justify-between items-center mb-6">
                         <div>
                           <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Intro Media</label>
                           <p className="text-[10px] text-slate-400 mt-1">Images & videos for the gallery slider</p>
                         </div>
                         <button 
                           onClick={() => addArrayItem("intro", "introMedia", { type: "image", url: "", title: "", alt: "", thumbnail: "" })} 
                           className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                         >
                           <Plus size={13}/> Add Slide
                         </button>
                       </div>
                       <div className="space-y-4">
                         {(data.intro.introMedia || []).map((item, i) => (
                           <MediaItemEditor
                             key={i}
                             item={item}
                             index={i}
                             onUpdate={(field, val) => updateArrayItem("intro", "introMedia", i, field, val)}
                             onRemove={() => removeArrayItem("intro", "introMedia", i)}
                           />
                         ))}
                         {(data.intro.introMedia || []).length === 0 && (
                           <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                             <ImageIcon size={28} className="text-slate-300 mx-auto mb-3" />
                             <p className="text-xs text-slate-400 font-semibold">No media slides yet</p>
                             <p className="text-[10px] text-slate-300 mt-1">Click "Add Slide" to start building your gallery</p>
                           </div>
                         )}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
              </>
            )}

            {/* Other tabs remain as in stable version */}
            {activeTab === 'process' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="mb-8">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title</label>
                    <input type="text" value={data.process.sectionTitle || ""} onChange={e => updateSectionField("process", "sectionTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                 </div>
                 <div className="flex justify-between items-center mb-6 border-t border-slate-100 pt-8">
                    <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Process Step Cards</label>
                    <button onClick={() => addArrayItem("process", "processSteps", { stepNumber: `STEP ${(data.process.processSteps?.length || 0) + 1}`, title: "", description: "", image: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"><Plus size={14}/> Add Step</button>
                 </div>
                 <div className="space-y-6">
                    {(data.process.processSteps || []).map((step, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group flex gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" value={step.stepNumber} onChange={e => updateArrayItem("process", "processSteps", i, "stepNumber", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold" placeholder="STEP 1" />
                             <input type="text" value={step.title} onChange={e => updateArrayItem("process", "processSteps", i, "title", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold" placeholder="Title" />
                             <textarea value={step.description} onChange={e => updateArrayItem("process", "processSteps", i, "description", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl min-h-[80px] md:col-span-2" placeholder="Description" />
                             <div className="md:col-span-2">
                                <MediaUploader label="Step Image" value={step.image} onChange={val => updateArrayItem("process", "processSteps", i, "image", val)} />
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem("process", "processSteps", i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Ideal Frequency / Suitability */}
            {activeTab === 'idealFrequency' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Heading</label>
                     <input type="text" value={data.idealFrequency.frequencyTitle || ""} onChange={e => updateSectionField("idealFrequency", "frequencyTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  {/* Ideal For */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-green-600 mb-4 tracking-widest">Ideal For Points</label>
                    <div className="space-y-3 mb-4">
                      {(data.idealFrequency.idealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "idealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "idealForPoints", i)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "idealForPoints", "")} className="text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-3 py-2 rounded-xl"><Plus size={14}/> Add Point</button>
                  </div>
                  {/* Not Ideal For */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-red-500 mb-4 tracking-widest">NOT Ideal For Points</label>
                    <div className="space-y-3 mb-4">
                      {(data.idealFrequency.notIdealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "notIdealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "notIdealForPoints", i)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "notIdealForPoints", "")} className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-3 py-2 rounded-xl"><Plus size={14}/> Add Point</button>
                  </div>
                </div>
              </div>
            )}
            
            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800">SEO & Meta Attributes</h3>
                <div className="grid grid-cols-1 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meta Title</label>
                      <input type="text" value={data.seo?.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meta Description</label>
                      <textarea value={data.seo?.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" />
                   </div>
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-2">Create New Service</h2>
            <form onSubmit={handleCreateService} className="space-y-4">
              <input type="text" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none font-bold text-sm" placeholder="Service Name" required />
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm">
                  {creating ? <Loader2 size={16} className="animate-spin" /> : "Create & Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
