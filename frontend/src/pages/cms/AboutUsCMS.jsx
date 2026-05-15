import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Settings, 
  User, 
  Clock, 
  Target, 
  Heart, 
  Quote,
  Star
} from "lucide-react";

export default function AboutUsCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const { data: res } = await axios.get("/about-us");
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Failed to load About Us settings");
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
      const { data: res } = await axios.put("/about-us", data);
      if (res.success) {
        toast.success("About Us saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update About Us");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Enterprise CMS...</p>
        </div>
      </div>
    );
  }

  const SectionTab = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
        activeSection === id 
        ? "border-blue-600 text-blue-600 bg-blue-50/50" 
        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">About Us Enterprise CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Page Management Module</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/about', '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <Eye size={16} />
              Live Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="max-w-[1600px] mx-auto px-8 flex overflow-x-auto no-scrollbar border-t border-slate-100">
          <SectionTab id="banner" label="ABOUT BANNER" icon={ImageIcon} />
          <SectionTab id="hero" label="HERO SECTION" icon={ImageIcon} />
          <SectionTab id="story" label="OUR STORY" icon={Clock} />
          <SectionTab id="vision" label="VISION & VALUES" icon={Target} />
          <SectionTab id="journey" label="MILESTONES" icon={Settings} />
          <SectionTab id="experts" label="TEAM EXPERTS" icon={User} />
          <SectionTab id="testimonials" label="TESTIMONIALS" icon={Quote} />
          <SectionTab id="seo" label="SEO SETTINGS" icon={Settings} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {/* ABOUT BANNER SECTION */}
        {activeSection === "banner" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <ImageIcon size={18} />
                  </div>
                  About Page Top Banner
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.banner?.badgeText || ""} onChange={e => updateSectionField("banner", "badgeText", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Banner Title</label>
                    <input type="text" value={data.banner?.title || ""} onChange={e => updateSectionField("banner", "title", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Text</label>
                    <input type="text" value={data.banner?.breadcrumbText || ""} onChange={e => updateSectionField("banner", "breadcrumbText", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Background Image URL</label>
                    <input type="text" value={data.banner?.backgroundImage || ""} onChange={e => updateSectionField("banner", "backgroundImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Overlay Opacity (0 to 1)</label>
                    <input type="number" step="0.1" min="0" max="1" value={data.banner?.overlayOpacity || 0.5} onChange={e => updateSectionField("banner", "overlayOpacity", parseFloat(e.target.value))} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Overlay Color</label>
                    <input type="color" value={data.banner?.overlayColor || "#000000"} onChange={e => updateSectionField("banner", "overlayColor", e.target.value)} 
                      className="w-full h-[54px] bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer" />
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* HERO SECTION */}
        {activeSection === "hero" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <ImageIcon size={18} />
                  </div>
                  Hero Section Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.hero.badge || ""} onChange={e => updateSectionField("hero", "badge", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Main Title</label>
                    <input type="text" value={data.hero.title || ""} onChange={e => updateSectionField("hero", "title", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Subtitle / Mission Statement</label>
                    <textarea value={data.hero.subtitle || ""} onChange={e => updateSectionField("hero", "subtitle", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all min-h-[100px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Cinematic Image URL</label>
                    <input type="text" value={data.hero.backgroundImage || ""} onChange={e => updateSectionField("hero", "backgroundImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Video Embed URL (YouTube/Vimeo)</label>
                    <input type="text" value={data.hero.videoUrl || ""} onChange={e => updateSectionField("hero", "videoUrl", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all" />
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100">
                  <h4 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest">Performance Stats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.hero.stats.map((stat, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2">Value</label>
                            <input type="text" value={stat.value} onChange={e => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].value = e.target.value;
                              updateSectionField("hero", "stats", newStats);
                            }} className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2">Suffix</label>
                            <input type="text" value={stat.suffix} onChange={e => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].suffix = e.target.value;
                              updateSectionField("hero", "stats", newStats);
                            }} className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2">Label</label>
                            <input type="text" value={stat.label} onChange={e => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].label = e.target.value;
                              updateSectionField("hero", "stats", newStats);
                            }} className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* STORY SECTION */}
        {activeSection === "story" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Clock size={18} />
                  </div>
                  Brand Story & Heritage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Label</label>
                    <input type="text" value={data.story.sectionTitle || ""} onChange={e => updateSectionField("story", "sectionTitle", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Years of Experience</label>
                    <input type="number" value={data.story.experienceYears || 0} onChange={e => updateSectionField("story", "experienceYears", parseInt(e.target.value))} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Story Heading</label>
                    <input type="text" value={data.story.heading || ""} onChange={e => updateSectionField("story", "heading", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Detailed Story Description</label>
                    <textarea value={data.story.description || ""} onChange={e => updateSectionField("story", "description", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[150px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Main Story Image URL</label>
                    <input type="text" value={data.story.mainImage || ""} onChange={e => updateSectionField("story", "mainImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Secondary Floating Image URL</label>
                    <input type="text" value={data.story.secondaryImage || ""} onChange={e => updateSectionField("story", "secondaryImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Key Highlights</h4>
                    <button onClick={() => {
                      const newPoints = [...data.story.points, { text: "" }];
                      updateSectionField("story", "points", newPoints);
                    }} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black">
                      <Plus size={14} /> ADD HIGHLIGHT
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.story.points.map((point, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <input type="text" value={point.text} onChange={e => {
                          const newPoints = [...data.story.points];
                          newPoints[idx].text = e.target.value;
                          updateSectionField("story", "points", newPoints);
                        }} className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" placeholder="Enter highlight text..." />
                        <button onClick={() => {
                          const newPoints = data.story.points.filter((_, i) => i !== idx);
                          updateSectionField("story", "points", newPoints);
                        }} className="p-3 text-red-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           </div>
        )}

        {/* VISION SECTION */}
        {activeSection === "vision" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Target size={18} />
                  </div>
                  Vision, Mission & Core Values
                </h3>

                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Vision Statement</label>
                    <textarea value={data.vision.visionText || ""} onChange={e => updateSectionField("vision", "visionText", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Mission Statement</label>
                    <textarea value={data.vision.missionText || ""} onChange={e => updateSectionField("vision", "missionText", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" />
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100">
                   <h4 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest text-center">Core Values Cards</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {data.vision.values.map((val, idx) => (
                        <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <Heart size={20} className="text-blue-600" />
                          </div>
                          <input type="text" value={val.title} onChange={e => {
                            const newValues = [...data.vision.values];
                            newValues[idx].title = e.target.value;
                            updateSectionField("vision", "values", newValues);
                          }} className="w-full bg-transparent border-b border-slate-200 mb-4 pb-2 text-sm font-black outline-none focus:border-blue-500" placeholder="Value Title" />
                          <textarea value={val.description} onChange={e => {
                            const newValues = [...data.vision.values];
                            newValues[idx].description = e.target.value;
                            updateSectionField("vision", "values", newValues);
                          }} className="w-full bg-transparent text-xs font-bold text-slate-500 leading-relaxed outline-none min-h-[80px]" placeholder="Value description..." />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           </div>
        )}

        {/* JOURNEY SECTION */}
        {activeSection === "journey" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-50">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Clock size={18} />
                    </div>
                    Historical Milestones Timeline
                  </h3>
                  <button onClick={() => {
                    const newMilestones = [...data.journey.milestones, { year: "2024", title: "", description: "" }];
                    updateSectionField("journey", "milestones", newMilestones);
                  }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200">
                    ADD MILESTONE
                  </button>
                </div>

                <div className="space-y-8">
                  {data.journey.milestones.map((ms, idx) => (
                    <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-8 items-start relative group">
                      <div className="w-24 flex-shrink-0 pt-2">
                        <input type="text" value={ms.year} onChange={e => {
                          const newMS = [...data.journey.milestones];
                          newMS[idx].year = e.target.value;
                          updateSectionField("journey", "milestones", newMS);
                        }} className="w-full bg-white px-4 py-2 rounded-xl text-lg font-black text-blue-600 text-center border border-slate-100" />
                      </div>
                      <div className="flex-1">
                        <input type="text" value={ms.title} onChange={e => {
                          const newMS = [...data.journey.milestones];
                          newMS[idx].title = e.target.value;
                          updateSectionField("journey", "milestones", newMS);
                        }} className="w-full bg-transparent border-b border-slate-200 mb-4 pb-2 text-md font-black outline-none focus:border-blue-500 uppercase tracking-tight" placeholder="Milestone Title" />
                        <textarea value={ms.description} onChange={e => {
                          const newMS = [...data.journey.milestones];
                          newMS[idx].description = e.target.value;
                          updateSectionField("journey", "milestones", newMS);
                        }} className="w-full bg-transparent text-sm font-bold text-slate-500 leading-relaxed outline-none min-h-[60px]" placeholder="Briefly describe this milestone..." />
                      </div>
                      <button onClick={() => {
                        const newMS = data.journey.milestones.filter((_, i) => i !== idx);
                        updateSectionField("journey", "milestones", newMS);
                      }} className="p-3 text-red-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        )}

        {/* EXPERTS SECTION */}
        {activeSection === "experts" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <User size={18} />
                    </div>
                    Medical Board & Expert Team
                  </h3>
                  <button onClick={() => {
                    const newTeam = [...data.experts.team, { name: "", designation: "", specialization: "", image: "", bio: "" }];
                    updateSectionField("experts", "team", newTeam);
                  }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200">
                    ADD EXPERT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.experts.team.map((expert, idx) => (
                    <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative">
                       <button onClick={() => {
                        const newTeam = data.experts.team.filter((_, i) => i !== idx);
                        updateSectionField("experts", "team", newTeam);
                      }} className="absolute top-6 right-6 text-slate-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="flex gap-6 mb-8">
                        <div className="w-24 h-24 bg-white rounded-2xl border border-slate-100 overflow-hidden flex-shrink-0">
                          {expert.image ? <img src={expert.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300"><ImageIcon size={30} /></div>}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Expert Full Name</label>
                            <input type="text" value={expert.name} onChange={e => {
                              const newTeam = [...data.experts.team];
                              newTeam[idx].name = e.target.value;
                              updateSectionField("experts", "team", newTeam);
                            }} className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Professional Designation</label>
                            <input type="text" value={expert.designation} onChange={e => {
                              const newTeam = [...data.experts.team];
                              newTeam[idx].designation = e.target.value;
                              updateSectionField("experts", "team", newTeam);
                            }} className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Core Specialization</label>
                          <input type="text" value={expert.specialization} onChange={e => {
                            const newTeam = [...data.experts.team];
                            newTeam[idx].specialization = e.target.value;
                            updateSectionField("experts", "team", newTeam);
                          }} className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Expert Profile Photo URL</label>
                          <input type="text" value={expert.image} onChange={e => {
                            const newTeam = [...data.experts.team];
                            newTeam[idx].image = e.target.value;
                            updateSectionField("experts", "team", newTeam);
                          }} className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Short Professional Bio</label>
                          <textarea value={expert.bio} onChange={e => {
                            const newTeam = [...data.experts.team];
                            newTeam[idx].bio = e.target.value;
                            updateSectionField("experts", "team", newTeam);
                          }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold min-h-[80px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        )}

        {/* TESTIMONIALS SECTION */}
        {activeSection === "testimonials" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Quote size={18} />
                    </div>
                    Patient Success Testimonials
                  </h3>
                  <button onClick={() => {
                    const newTesti = [...data.testimonials.reviews, { patientName: "", reviewText: "", rating: 5, image: "", treatment: "" }];
                    updateSectionField("testimonials", "reviews", newTesti);
                  }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200">
                    ADD TESTIMONIAL
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.testimonials.reviews.map((review, idx) => (
                    <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative">
                       <button onClick={() => {
                        const newTesti = data.testimonials.reviews.filter((_, i) => i !== idx);
                        updateSectionField("testimonials", "reviews", newTesti);
                      }} className="absolute top-6 right-6 text-slate-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>

                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "#fbbf24" : "#e2e8f0"} color={i < review.rating ? "#fbbf24" : "#e2e8f0"} />
                        ))}
                      </div>

                      <textarea value={review.reviewText} onChange={e => {
                        const newTesti = [...data.testimonials.reviews];
                        newTesti[idx].reviewText = e.target.value;
                        updateSectionField("testimonials", "reviews", newTesti);
                      }} className="w-full bg-white px-5 py-4 rounded-2xl border border-slate-100 text-sm font-bold italic text-slate-600 min-h-[120px] mb-6" placeholder="Patient review text..." />

                      <div className="flex items-center gap-4">
                        <div className="relative group w-14 h-14 flex-shrink-0">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-slate-100">
                            {review.image ? <img src={review.image} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-slate-200" />}
                          </div>
                          <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                            <ImageIcon size={16} className="text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append('image', file);
                              toast.loading("Uploading...", { id: "upload-" + idx });
                              try {
                                const token = localStorage.getItem("dmc_admin_token");
                                const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
                                const baseURL = import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:10000/api" : "https://dmctrichology-1.onrender.com/api");
                                
                                const res = await fetch(`${baseURL}/service-details/upload`, {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: fd
                                });
                                
                                const data = await res.json();
                                
                                if (res.ok && data?.success) {
                                  const newTesti = [...data.testimonials.reviews];
                                  newTesti[idx].image = data.url;
                                  updateSectionField("testimonials", "reviews", newTesti);
                                  toast.success("Uploaded!", { id: "upload-" + idx });
                                } else {
                                  toast.error(data?.message || "Upload failed", { id: "upload-" + idx });
                                  console.error("Upload failed with status:", res.status, data);
                                }
                              } catch(err) { 
                                toast.error("Error", { id: "upload-" + idx }); 
                                console.error("Upload error:", err);
                              }
                            }} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-3">
                           <input type="text" value={review.patientName} onChange={e => {
                             const newTesti = [...data.testimonials.reviews];
                             newTesti[idx].patientName = e.target.value;
                             updateSectionField("testimonials", "reviews", newTesti);
                           }} className="w-full bg-transparent border-b border-slate-200 pb-1 text-sm font-black outline-none" placeholder="Patient Name" />
                           <input type="text" value={review.treatment} onChange={e => {
                             const newTesti = [...data.testimonials.reviews];
                             newTesti[idx].treatment = e.target.value;
                             updateSectionField("testimonials", "reviews", newTesti);
                           }} className="w-full bg-transparent text-xs font-bold text-blue-600 outline-none" placeholder="Treatment received" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        )}

        {/* SEO SECTION */}
        {activeSection === "seo" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Settings size={18} />
                  </div>
                  SEO & Meta Configuration
                </h3>

                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Meta Title Tag</label>
                    <input type="text" value={data.seo.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Meta Description Tag</label>
                    <textarea value={data.seo.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">OG Image URL (Social Sharing)</label>
                    <input type="text" value={data.seo.ogImage || ""} onChange={e => updateSectionField("seo", "ogImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
