import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Layout, Type, List, CheckCircle, HelpCircle,
  Image as ImageIcon, Plus, Trash2, RefreshCw, Globe, ArrowUp, ArrowDown, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGalleryItems } from "../../api/services";
import { Film } from "lucide-react";

// Helper component for Media Uploads (Image Only)
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

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: "", category: "Laser" });
  const [creating, setCreating] = useState(false);
  
  // Gallery Picker state
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [activeMediaTarget, setActiveMediaTarget] = useState(null); // { section, arrayField, idx, field }

  // Fetch all services for the dropdown
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

  // Fetch specific service details when slug changes
  useEffect(() => {
    if (!selectedSlug) return;
    
    setFetchingDetails(true);
    axios.get(`/service-details/${selectedSlug}`)
      .then(res => {
        if (res.data?.data) {
          setData(res.data.data);
        }
      })
      .catch(err => {
        // If not found (404), initialize empty structure
        if (err.response?.status === 404) {
          const serviceInfo = services.find(s => s.slug === selectedSlug) || {};
          setData({
            slug: selectedSlug,
            title: serviceInfo.title || "",
            category: serviceInfo.category || "",
            banner: { badgeText: "PREMIUM TREATMENT", title: serviceInfo.title || "", subtitle: "", duration: "45 mins", rating: "4.9", buttonText: "Book Consultation", backgroundImage: "" },
            intro: { badgeText: "ABOUT THE TREATMENT", title: serviceInfo.title || "", rating: "4.9", duration: "45 mins", shortDescription: "", longDescription: "", benefits: [], closingText: "", introImages: [] },
            process: { sectionTitle: "How it works?", processSteps: [] },
            idealFrequency: { frequencyTitle: "Treatment Frequency & Suitability", frequencyDescription: "", idealForPoints: [], notIdealForPoints: [], ctaTitle: "Not sure which treatment is right for YOU?", ctaDescription: "We can help with that!", ctaButtonText: "Book a free consultation", ctaButtonLink: "/contact", ctaImage: "" },
            beforeAfter: { beforeTitle: "Before Treatment Checklist", afterTitle: "Aftercare Instructions", beforePoints: [], afterPoints: [], sectionBackground: "#f9f7f2" },
            faqEnquiry: { faqTitle: "Common Concerns Addressed", faqSubtitle: "", faqItems: [], serviceOptions: ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"], formTitle: "Enquire About This Treatment", buttonText: "Schedule Your Visit", namePlaceholder: "Name*", emailPlaceholder: "E-Mail Address*", servicePlaceholder: "Type Of Service Enquiry*", datePlaceholder: "Select Date & Time*" },
            footerCta: { heading: "Stay Connected With Expert Care Support", description: "We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.", emailPlaceholder: "Your Email Adress", buttonText: "Submit" },
            seo: { metaTitle: "", metaDescription: "", canonicalUrl: "", ogImage: "", schemaScript: "" }
          });
          toast("Initialized new details for this service.", { icon: 'ℹ️' });
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

  // Generic Array Updaters
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
      // Ensure we don't send legacy videos if we have introMedia
      const payload = { ...data };
      if (payload.intro && payload.intro.introImages && payload.intro.introImages.length > 0) {
        // cleaned
      }
      
      await axios.put(`/service-details/${selectedSlug}`, payload);
      toast.success("Service details saved successfully");
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
    const { section, arrayField, idx, field } = activeMediaTarget;
    const url = item.url;
    
    if (arrayField) {
      updateArrayItem(section, arrayField, idx, field, url);
    } else {
      updateSectionField(section, field, url);
    }
    
    setShowGalleryPicker(false);
    toast.success("Media selected from gallery");
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.title.trim()) return toast.error("Title is required");
    
    setCreating(true);
    try {
      const slug = newService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // Check if slug exists
      if (services.find(s => s.slug === slug)) {
        toast.error("A service with this name/slug already exists!");
        setCreating(false);
        return;
      }

      // Create ServiceCard
      const res = await axios.post('/service-listing-cards', {
        title: newService.title,
        category: newService.category,
        slug: slug,
        status: "Published"
      });

      if (res.data?.success) {
        toast.success("Service created!");
        const updatedServices = await fetchServices();
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
          <p className="text-sm text-slate-500 font-medium italic">Manage dynamic field-level content for individual service pages</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate(`/cms/visual-builder/details?service=${selectedSlug}`)} disabled={fetchingDetails || !data} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-200 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm">
             <Layout size={16} /> Visual Builder
           </button>
           <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm">
             <Plus size={16} /> New Service
           </button>
           <button onClick={handleSave} disabled={saving || fetchingDetails || !data}
             className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
             {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {saving ? "Saving..." : "Publish Page Updates"}
           </button>
        </div>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-[12px] font-black uppercase text-slate-500 tracking-widest min-w-max">Select Service to Edit:</label>
        <select 
          value={selectedSlug} 
          onChange={e => setSelectedSlug(e.target.value)}
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
        >
          {services.map(s => (
            <option key={s.slug} value={s.slug}>{s.title} ({s.category})</option>
          ))}
        </select>
        {fetchingDetails && <Loader2 className="animate-spin text-blue-600" size={24} />}
      </div>

      {!data || fetchingDetails ? (
         <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center">
            <RefreshCw className="animate-spin mb-4 text-blue-600" size={32} />
            Loading structure...
         </div>
      ) : (
        <>
          {/* Tabs */}
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
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* ================= HERO & INTRO ================= */}
            {activeTab === 'banner' && (
              <>
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Layout size={18} className="text-blue-500"/> Hero Banner Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.banner.badgeText || ""} onChange={e => updateSectionField("banner", "badgeText", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Title</label>
                    <input type="text" value={data.banner.title || ""} onChange={e => updateSectionField("banner", "title", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                     <div>
                       <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Rating</label>
                       <input type="text" value={data.banner.rating || ""} onChange={e => updateSectionField("banner", "rating", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Duration</label>
                       <input type="text" value={data.banner.duration || ""} onChange={e => updateSectionField("banner", "duration", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                     </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 mt-8">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Service Intro Description</h3>
                <div className="grid grid-cols-1 gap-8">
                   <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Intro Heading (Above Description)</label>
                    <input type="text" value={data.intro.introHeading || ""} onChange={e => updateSectionField("intro", "introHeading", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Short Description</label>
                    <textarea value={data.intro.shortDescription || ""} onChange={e => {
                      updateSectionField("intro", "shortDescription", e.target.value);
                    }}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[80px]" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Long Description</label>
                    <textarea value={data.intro.longDescription || ""} onChange={e => updateSectionField("intro", "longDescription", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[150px]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Closing Text</label>
                    <textarea value={data.intro.closingText || ""} onChange={e => updateSectionField("intro", "closingText", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[80px]" />
                  </div>
                  
                  {/* Benefits Array with Reorder */}
                  <div className="border-t border-slate-100 pt-8 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Benefits Bullet Points</label>
                      <button onClick={() => addArrayItem("intro", "benefits", { text: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                        <Plus size={14}/> Add Point
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(data.intro.benefits || []).map((b, i) => (
                         <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <div className="flex flex-col gap-1 px-1">
                               <button onClick={() => reorderArrayItem("intro", "benefits", i, "up")} className="text-slate-400 hover:text-blue-600"><ArrowUp size={14}/></button>
                               <button onClick={() => reorderArrayItem("intro", "benefits", i, "down")} className="text-slate-400 hover:text-blue-600"><ArrowDown size={14}/></button>
                            </div>
                            <input type="text" value={b.text || ""} onChange={e => updateArrayItem("intro", "benefits", i, "text", e.target.value)}
                              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="e.g. Clinically proven results" />
                            <button onClick={() => removeArrayItem("intro", "benefits", i)} className="p-2 text-slate-400 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                         </div>
                      ))}
                    </div>
                  </div>

                  {/* Intro Images Gallery */}
                  <div className="border-t border-slate-100 pt-8 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Intro Gallery Images</label>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Manage multiple images for the premium gallery slider</p>
                      </div>
                      <button onClick={() => addArrayItem("intro", "introImages", { image: "", title: "", alt: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                        <Plus size={14}/> Add Image
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(data.intro.introImages || []).map((m, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 relative group hover:shadow-xl transition-all duration-500">
                          <button onClick={() => removeArrayItem("intro", "introImages", i)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-xl">
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black italic">
                              {i + 1}
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Asset Configuration</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Image Title</label>
                                <input type="text" value={m.title || ""} onChange={e => updateArrayItem("intro", "introImages", i, "title", e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                              </div>
                              <MediaUploader 
                                label="High-Res Image" 
                                value={m.image} 
                                onChange={val => updateArrayItem("intro", "introImages", i, "image", val)} 
                                onGalleryClick={() => openGalleryPicker({ section: "intro", arrayField: "introImages", idx: i, field: "image" })}
                              />
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Alt Text (SEO)</label>
                                <input type="text" value={m.alt || ""} onChange={e => updateArrayItem("intro", "introImages", i, "alt", e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium italic" />
                              </div>
                            </div>
                            
                            <div className="relative aspect-square rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-inner">
                              {m.image ? (
                                <img src={m.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                              ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                  <ImageIcon size={48} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!data.intro.introImages || data.intro.introImages.length === 0) && (
                        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 text-sm font-bold uppercase tracking-widest">
                          No images added yet
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
              </>
            )}

            {/* ================= PROCESS STEPS ================= */}
            {activeTab === 'process' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="mb-8">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title</label>
                    <input type="text" value={data.process.sectionTitle || ""} onChange={e => updateSectionField("process", "sectionTitle", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                 </div>

                 <div className="flex justify-between items-center mb-6 border-t border-slate-100 pt-8">
                    <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Process Step Cards</label>
                    <button onClick={() => addArrayItem("process", "processSteps", { stepNumber: `STEP ${(data.process.processSteps?.length || 0) + 1}`, title: "", description: "", image: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                      <Plus size={14}/> Add Step
                    </button>
                 </div>
                 
                 <div className="space-y-6">
                    {(data.process.processSteps || []).map((step, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group flex gap-4">
                          <div className="flex flex-col gap-2 pt-2">
                             <button onClick={() => reorderArrayItem("process", "processSteps", i, "up")} className="text-slate-400 hover:text-blue-600 p-1 bg-white rounded shadow-sm border border-slate-100"><ArrowUp size={16}/></button>
                             <button onClick={() => reorderArrayItem("process", "processSteps", i, "down")} className="text-slate-400 hover:text-blue-600 p-1 bg-white rounded shadow-sm border border-slate-100"><ArrowDown size={16}/></button>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Step Number (e.g. STEP 1)</label>
                              <input type="text" value={step.stepNumber || ""} onChange={e => updateArrayItem("process", "processSteps", i, "stepNumber", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                              <input type="text" value={step.title || ""} onChange={e => updateArrayItem("process", "processSteps", i, "title", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                              <textarea value={step.description || ""} onChange={e => updateArrayItem("process", "processSteps", i, "description", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl min-h-[80px]" />
                            </div>
                            <div className="md:col-span-2">
                              <MediaUploader label="Step Image" value={step.image} onChange={val => updateArrayItem("process", "processSteps", i, "image", val)} onGalleryClick={() => openGalleryPicker({ section: "process", arrayField: "processSteps", idx: i, field: "image" })} />
                            </div>
                          </div>
                          <button onClick={() => removeArrayItem("process", "processSteps", i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* ================= IDEAL FREQUENCY / SUITABILITY ================= */}
            {activeTab === 'idealFrequency' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Heading</label>
                     <input type="text" value={data.idealFrequency.frequencyTitle || ""} onChange={e => updateSectionField("idealFrequency", "frequencyTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Description</label>
                     <textarea value={data.idealFrequency.frequencyDescription || ""} onChange={e => updateSectionField("idealFrequency", "frequencyDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[80px]" />
                  </div>
                  
                  {/* Ideal For */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-green-600 mb-4 tracking-widest flex items-center gap-2"><CheckCircle size={14}/> Ideal For Points</label>
                    <div className="space-y-3 mb-4">
                      {(data.idealFrequency.idealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <button onClick={() => reorderArrayItem("idealFrequency", "idealForPoints", i, "up")} className="text-slate-400 hover:text-blue-500"><ArrowUp size={12}/></button>
                          <button onClick={() => reorderArrayItem("idealFrequency", "idealForPoints", i, "down")} className="text-slate-400 hover:text-blue-500"><ArrowDown size={12}/></button>
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "idealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "idealForPoints", i)} className="text-slate-400 hover:text-red-500 px-2"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "idealForPoints", "")} className="text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-3 py-2 rounded-xl hover:bg-green-100 transition-all"><Plus size={14}/> Add Point</button>
                  </div>
                  
                  {/* Not Ideal For */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-red-500 mb-4 tracking-widest flex items-center gap-2"><Settings size={14}/> NOT Ideal For Points</label>
                    <div className="space-y-3 mb-4">
                      {(data.idealFrequency.notIdealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <button onClick={() => reorderArrayItem("idealFrequency", "notIdealForPoints", i, "up")} className="text-slate-400 hover:text-blue-500"><ArrowUp size={12}/></button>
                          <button onClick={() => reorderArrayItem("idealFrequency", "notIdealForPoints", i, "down")} className="text-slate-400 hover:text-blue-500"><ArrowDown size={12}/></button>
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "notIdealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "notIdealForPoints", i)} className="text-slate-400 hover:text-red-500 px-2"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "notIdealForPoints", "")} className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100 transition-all"><Plus size={14}/> Add Point</button>
                  </div>
                  
                  <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-2">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6">Consultation CTA Box</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">CTA Heading</label>
                        <input type="text" value={data.idealFrequency.ctaTitle || ""} onChange={e => updateSectionField("idealFrequency", "ctaTitle", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Button Text</label>
                        <input type="text" value={data.idealFrequency.ctaButtonText || ""} onChange={e => updateSectionField("idealFrequency", "ctaButtonText", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">CTA Description</label>
                        <textarea value={data.idealFrequency.ctaDescription || ""} onChange={e => updateSectionField("idealFrequency", "ctaDescription", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                      </div>
                      <div className="md:col-span-2">
                         <MediaUploader label="CTA Representative Image" value={data.idealFrequency.ctaImage} onChange={val => updateSectionField("idealFrequency", "ctaImage", val)} onGalleryClick={() => openGalleryPicker({ section: "idealFrequency", field: "ctaImage" })} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= BEFORE / AFTER ================= */}
            {activeTab === 'beforeAfter' && (
               <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                         <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Before Section Title</label>
                         <input type="text" value={data.beforeAfter.beforeTitle || ""} onChange={e => updateSectionField("beforeAfter", "beforeTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">After Section Title</label>
                         <input type="text" value={data.beforeAfter.afterTitle || ""} onChange={e => updateSectionField("beforeAfter", "afterTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                      </div>
                    </div>
                    {/* Before Points */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Before Treatment Points</label>
                      <div className="space-y-3 mb-4">
                        {(data.beforeAfter.beforePoints || []).map((pt, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <button onClick={() => reorderArrayItem("beforeAfter", "beforePoints", i, "up")} className="text-slate-400 hover:text-blue-500"><ArrowUp size={12}/></button>
                            <button onClick={() => reorderArrayItem("beforeAfter", "beforePoints", i, "down")} className="text-slate-400 hover:text-blue-500"><ArrowDown size={12}/></button>
                            <input type="text" value={pt} onChange={e => updateArrayItem("beforeAfter", "beforePoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm shadow-sm" />
                            <button onClick={() => removeArrayItem("beforeAfter", "beforePoints", i)} className="text-slate-400 hover:text-red-500 px-2"><Trash2 size={16}/></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addArrayItem("beforeAfter", "beforePoints", "")} className="text-blue-600 text-xs font-bold flex items-center gap-1 w-full justify-center bg-white py-2 rounded-xl border border-dashed border-blue-200 hover:bg-blue-50 transition-all"><Plus size={14}/> Add Point</button>
                    </div>

                    {/* After Points */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">After Treatment Points</label>
                      <div className="space-y-3 mb-4">
                        {(data.beforeAfter.afterPoints || []).map((pt, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <button onClick={() => reorderArrayItem("beforeAfter", "afterPoints", i, "up")} className="text-slate-400 hover:text-blue-500"><ArrowUp size={12}/></button>
                            <button onClick={() => reorderArrayItem("beforeAfter", "afterPoints", i, "down")} className="text-slate-400 hover:text-blue-500"><ArrowDown size={12}/></button>
                            <input type="text" value={pt} onChange={e => updateArrayItem("beforeAfter", "afterPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm shadow-sm" />
                            <button onClick={() => removeArrayItem("beforeAfter", "afterPoints", i)} className="text-slate-400 hover:text-red-500 px-2"><Trash2 size={16}/></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addArrayItem("beforeAfter", "afterPoints", "")} className="text-blue-600 text-xs font-bold flex items-center gap-1 w-full justify-center bg-white py-2 rounded-xl border border-dashed border-blue-200 hover:bg-blue-50 transition-all"><Plus size={14}/> Add Point</button>
                    </div>
                 </div>
               </div>
            )}

            {/* ================= FAQs ================= */}
            {activeTab === 'faqEnquiry' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8">
                   <div>
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">FAQ Title</label>
                     <input type="text" value={data.faqEnquiry.faqTitle || ""} onChange={e => updateSectionField("faqEnquiry", "faqTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">FAQ Subtitle</label>
                     <input type="text" value={data.faqEnquiry.faqSubtitle || ""} onChange={e => updateSectionField("faqEnquiry", "faqSubtitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-center mb-6">
                    <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Frequently Asked Questions</label>
                    <button onClick={() => addArrayItem("faqEnquiry", "faqItems", { question: "", answer: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                      <Plus size={14}/> Add FAQ
                    </button>
                 </div>
                 <div className="space-y-4 mb-10 border-b border-slate-100 pb-10">
                    {(data.faqEnquiry.faqItems || []).map((faq, i) => (
                       <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4 items-start relative group">
                          <div className="flex flex-col gap-2 pt-1">
                             <button onClick={() => reorderArrayItem("faqEnquiry", "faqItems", i, "up")} className="text-slate-400 hover:text-blue-600 p-1 bg-white rounded border border-slate-200 shadow-sm"><ArrowUp size={14}/></button>
                             <button onClick={() => reorderArrayItem("faqEnquiry", "faqItems", i, "down")} className="text-slate-400 hover:text-blue-600 p-1 bg-white rounded border border-slate-200 shadow-sm"><ArrowDown size={14}/></button>
                          </div>
                          <div className="flex-1 space-y-3">
                            <input type="text" value={faq.question || ""} onChange={e => updateArrayItem("faqEnquiry", "faqItems", i, "question", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm" placeholder="Question..." />
                            <textarea value={faq.answer || ""} onChange={e => updateArrayItem("faqEnquiry", "faqItems", i, "answer", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm min-h-[60px]" placeholder="Answer..." />
                          </div>
                          <button onClick={() => removeArrayItem("faqEnquiry", "faqItems", i)} className="text-slate-300 hover:text-red-500 mt-2">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>

                 {/* Enquiry Form Labels */}
                 <h3 className="text-lg font-bold mb-6 text-slate-800">Enquiry Form Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Form Heading</label>
                     <input type="text" value={data.faqEnquiry.formTitle || ""} onChange={e => updateSectionField("faqEnquiry", "formTitle", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Button Text</label>
                     <input type="text" value={data.faqEnquiry.buttonText || ""} onChange={e => updateSectionField("faqEnquiry", "buttonText", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Name Placeholder</label>
                     <input type="text" value={data.faqEnquiry.namePlaceholder || ""} onChange={e => updateSectionField("faqEnquiry", "namePlaceholder", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email Placeholder</label>
                     <input type="text" value={data.faqEnquiry.emailPlaceholder || ""} onChange={e => updateSectionField("faqEnquiry", "emailPlaceholder", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Service Type Placeholder</label>
                     <input type="text" value={data.faqEnquiry.servicePlaceholder || ""} onChange={e => updateSectionField("faqEnquiry", "servicePlaceholder", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date & Time Placeholder</label>
                     <input type="text" value={data.faqEnquiry.datePlaceholder || ""} onChange={e => updateSectionField("faqEnquiry", "datePlaceholder", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                   </div>
                 </div>
              </div>
            )}

            {/* ================= FOOTER CTA ================= */}
            {activeTab === 'footerCta' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Layout size={18} className="text-blue-500"/> Footer CTA Section</h3>
                <p className="text-sm text-slate-500 mb-8">Override the global footer CTA specifically for this service page. If left blank, it will use global defaults.</p>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Heading</label>
                    <input type="text" value={data.footerCta?.heading || ""} onChange={e => updateSectionField("footerCta", "heading", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                    <textarea value={data.footerCta?.description || ""} onChange={e => updateSectionField("footerCta", "description", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl min-h-[80px]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email Input Placeholder</label>
                      <input type="text" value={data.footerCta?.emailPlaceholder || ""} onChange={e => updateSectionField("footerCta", "emailPlaceholder", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Button Text</label>
                      <input type="text" value={data.footerCta?.buttonText || ""} onChange={e => updateSectionField("footerCta", "buttonText", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SEO SETTINGS ================= */}
            {activeTab === 'seo' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Globe size={18} className="text-blue-500"/> SEO & Meta Attributes</h3>
                <div className="grid grid-cols-1 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meta Title</label>
                      <input type="text" value={data.seo?.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" placeholder="Dynamic Meta Title..." />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meta Description</label>
                      <textarea value={data.seo?.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" placeholder="Optimized description for search engines..." />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Canonical URL (Optional)</label>
                      <input type="text" value={data.seo?.canonicalUrl || ""} onChange={e => updateSectionField("seo", "canonicalUrl", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" placeholder="https://..." />
                   </div>
                   <div>
                      <MediaUploader label="Open Graph (OG) Image" value={data.seo?.ogImage || ""} onChange={val => updateSectionField("seo", "ogImage", val)} onGalleryClick={() => openGalleryPicker({ section: "seo", field: "ogImage" })} />
                   </div>
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* CREATE NEW SERVICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-2">Create New Service</h2>
            <p className="text-sm text-slate-500 mb-6">Initialize a new CMS block for a service.</p>
            
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Service Name</label>
                <input 
                  type="text" 
                  value={newService.title} 
                  onChange={e => setNewService({...newService, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
                  placeholder="e.g. PRP Hair Loss Therapy"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
                <select 
                  value={newService.category} 
                  onChange={e => setNewService({...newService, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
                >
                  <option value="Laser">Laser Treatment</option>
                  <option value="Transplant">Hair Transplant</option>
                  <option value="Regrowth">Hair Regrowth</option>
                  <option value="Facial">Facial/Skin</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                  {creating ? <Loader2 size={16} className="animate-spin" /> : "Create & Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* GALLERY PICKER MODAL */}
      {showGalleryPicker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Media Library</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Select an asset for this section</p>
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
                  {galleryItems.map((item) => {
                    const isVideo = item.url.match(/\.(mp4|webm|mov|ogg)$/i);
                    return (
                      <div 
                        key={item._id} 
                        onClick={() => handleGallerySelect(item)}
                        className="group relative aspect-square rounded-3xl overflow-hidden border-4 border-transparent hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-xl"
                      >
                        {isVideo ? (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Film size={32} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase">Video</div>
                          </div>
                        ) : (
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        )}
                        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">Select Asset</div>
                        </div>
                      </div>
                    );
                  })}
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
