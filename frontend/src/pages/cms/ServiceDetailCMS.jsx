import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save,
  Loader2,
  Layout,
  Type,
  List,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Plus,
  Trash2,
  RefreshCw
} from "lucide-react";

export default function ServiceDetailCMS() {
  const [services, setServices] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [data, setData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("banner");

  // Fetch all services for the dropdown
  useEffect(() => {
    axios.get("/service-listing-cards")
      .then(res => {
        if (res.data?.data) {
          setServices(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedSlug(res.data.data[0].slug);
          }
        }
      })
      .catch(() => toast.error("Failed to load services list"))
      .finally(() => setLoading(false));
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
            intro: { badgeText: "ABOUT THE TREATMENT", title: serviceInfo.title || "", rating: "4.9", duration: "45 mins", shortDescription: "", longDescription: "", benefits: [], closingText: "", videos: [] },
            process: { sectionTitle: "How it works?", processSteps: [] },
            idealFrequency: { frequencyTitle: "Treatment Frequency & Suitability", frequencyDescription: "", idealForPoints: [], notIdealForPoints: [], ctaTitle: "Not sure which treatment is right for YOU?", ctaDescription: "We can help with that!", ctaButtonText: "Book a free consultation", ctaButtonLink: "/contact", ctaImage: "" },
            beforeAfter: { beforeTitle: "Before Treatment Checklist", afterTitle: "Aftercare Instructions", beforePoints: [], afterPoints: [], sectionBackground: "#f9f7f2" },
            faqEnquiry: { faqTitle: "Common Concerns Addressed", faqSubtitle: "", faqItems: [], serviceOptions: ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"], formTitle: "Enquire About This Treatment", buttonText: "Schedule Your Visit" }
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

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service Details CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage dynamic content for individual service pages</p>
        </div>
        <button onClick={handleSave} disabled={saving || fetchingDetails || !data}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving Changes..." : "Publish Page Updates"}
        </button>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-[12px] font-black uppercase text-slate-500 tracking-widest min-w-max">Select Service:</label>
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
            Loading service data...
         </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 bg-slate-200/50 p-1.5 rounded-[20px] mb-8 w-fit">
            {[
              { id: "banner", label: "Hero Banner", icon: Layout },
              { id: "intro", label: "Service Intro", icon: Type },
              { id: "process", label: "Process Steps", icon: List },
              { id: "idealFrequency", label: "Suitability & CTA", icon: CheckCircle },
              { id: "beforeAfter", label: "Before/After", icon: RefreshCw },
              { id: "faqEnquiry", label: "FAQs & Enquiry", icon: HelpCircle }
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
            {/* ================= HERO BANNER ================= */}
            {activeTab === 'banner' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.banner.badgeText || ""} onChange={e => updateSectionField("banner", "badgeText", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Title</label>
                    <input type="text" value={data.banner.title || ""} onChange={e => updateSectionField("banner", "title", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Subtitle / Short Description</label>
                    <textarea value={data.banner.subtitle || ""} onChange={e => updateSectionField("banner", "subtitle", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Background Image URL</label>
                    <div className="flex gap-4">
                      <input type="text" value={data.banner.backgroundImage || ""} onChange={e => updateSectionField("banner", "backgroundImage", e.target.value)}
                        className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" placeholder="https://..." />
                      {data.banner.backgroundImage && (
                        <img src={data.banner.backgroundImage} alt="Preview" className="h-14 w-24 object-cover rounded-xl border border-slate-100 shadow-sm" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SERVICE INTRO ================= */}
            {activeTab === 'intro' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="grid grid-cols-1 gap-8">
                   <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Long Description</label>
                    <textarea value={data.intro.longDescription || ""} onChange={e => updateSectionField("intro", "longDescription", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[120px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Closing Text</label>
                    <textarea value={data.intro.closingText || ""} onChange={e => updateSectionField("intro", "closingText", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[80px]" />
                  </div>
                  
                  {/* Benefits */}
                  <div className="border-t border-slate-100 pt-8 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Benefits Bullet Points</label>
                      <button onClick={() => addArrayItem("intro", "benefits", { text: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                        <Plus size={14}/> Add Point
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(data.intro.benefits || []).map((b, i) => (
                         <div key={i} className="flex gap-3">
                            <input type="text" value={b.text || ""} onChange={e => updateArrayItem("intro", "benefits", i, "text", e.target.value)}
                              className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" placeholder="e.g. Clinically proven results" />
                            <button onClick={() => removeArrayItem("intro", "benefits", i)} className="p-3 text-slate-300 hover:text-red-500">
                              <Trash2 size={18} />
                            </button>
                         </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ================= PROCESS STEPS ================= */}
            {activeTab === 'process' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="mb-8">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title</label>
                    <input type="text" value={data.process.sectionTitle || ""} onChange={e => updateSectionField("process", "sectionTitle", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                 </div>

                 <div className="flex justify-between items-center mb-6">
                    <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Process Steps Cards</label>
                    <button onClick={() => addArrayItem("process", "processSteps", { stepNumber: `STEP ${(data.process.processSteps?.length || 0) + 1}`, title: "", description: "", image: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                      <Plus size={14}/> Add Step
                    </button>
                 </div>
                 
                 <div className="space-y-6">
                    {(data.process.processSteps || []).map((step, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                          <button onClick={() => removeArrayItem("process", "processSteps", i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Step Number</label>
                              <input type="text" value={step.stepNumber || ""} onChange={e => updateArrayItem("process", "processSteps", i, "stepNumber", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                              <input type="text" value={step.title || ""} onChange={e => updateArrayItem("process", "processSteps", i, "title", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                              <textarea value={step.description || ""} onChange={e => updateArrayItem("process", "processSteps", i, "description", e.target.value)} className="w-full px-4 py-2 border rounded-xl min-h-[60px]" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Image URL</label>
                              <input type="text" value={step.image || ""} onChange={e => updateArrayItem("process", "processSteps", i, "image", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                            </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* ================= IDEAL FREQUENCY / SUITABILITY ================= */}
            {activeTab === 'idealFrequency' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Ideal For Points</label>
                    <div className="space-y-2 mb-3">
                      {(data.idealFrequency.idealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "idealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "idealForPoints", i)} className="text-red-400 hover:text-red-600 px-2"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "idealForPoints", "")} className="text-blue-600 text-xs font-bold flex items-center gap-1"><Plus size={14}/> Add Ideal For Point</button>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">NOT Ideal For Points</label>
                    <div className="space-y-2 mb-3">
                      {(data.idealFrequency.notIdealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "notIdealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "notIdealForPoints", i)} className="text-red-400 hover:text-red-600 px-2"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "notIdealForPoints", "")} className="text-blue-600 text-xs font-bold flex items-center gap-1"><Plus size={14}/> Add Not Ideal Point</button>
                  </div>
                  
                  <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">CTA Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">CTA Title</label>
                        <input type="text" value={data.idealFrequency.ctaTitle || ""} onChange={e => updateSectionField("idealFrequency", "ctaTitle", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Button Text</label>
                        <input type="text" value={data.idealFrequency.ctaButtonText || ""} onChange={e => updateSectionField("idealFrequency", "ctaButtonText", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">CTA Description</label>
                        <textarea value={data.idealFrequency.ctaDescription || ""} onChange={e => updateSectionField("idealFrequency", "ctaDescription", e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
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
                    {/* Before Points */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Before Treatment Points</label>
                      <div className="space-y-3 mb-4">
                        {(data.beforeAfter.beforePoints || []).map((pt, i) => (
                          <div key={i} className="flex gap-2">
                            <input type="text" value={pt} onChange={e => updateArrayItem("beforeAfter", "beforePoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border rounded-xl text-sm shadow-sm" />
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
                          <div key={i} className="flex gap-2">
                            <input type="text" value={pt} onChange={e => updateArrayItem("beforeAfter", "afterPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border rounded-xl text-sm shadow-sm" />
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
                 <div className="flex justify-between items-center mb-6">
                    <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Frequently Asked Questions</label>
                    <button onClick={() => addArrayItem("faqEnquiry", "faqItems", { question: "", answer: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                      <Plus size={14}/> Add FAQ
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(data.faqEnquiry.faqItems || []).map((faq, i) => (
                       <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4 items-start">
                          <div className="flex-1 space-y-3">
                            <input type="text" value={faq.question || ""} onChange={e => updateArrayItem("faqEnquiry", "faqItems", i, "question", e.target.value)} className="w-full px-4 py-2 border rounded-xl font-bold text-sm" placeholder="Question..." />
                            <textarea value={faq.answer || ""} onChange={e => updateArrayItem("faqEnquiry", "faqItems", i, "answer", e.target.value)} className="w-full px-4 py-2 border rounded-xl text-sm min-h-[60px]" placeholder="Answer..." />
                          </div>
                          <button onClick={() => removeArrayItem("faqEnquiry", "faqItems", i)} className="text-slate-300 hover:text-red-500 mt-2">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
