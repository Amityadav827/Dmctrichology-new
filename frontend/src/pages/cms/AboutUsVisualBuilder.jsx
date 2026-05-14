import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Loader2, 
  Save, 
  X,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  ChevronLeft,
  Settings as SettingsIcon,
  Layers,
  MousePointer2,
  RefreshCw,
  Eye,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FRONTEND_URL } from "../../utils/config";

export default function AboutUsVisualBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [activeTab, setActiveTab] = useState("sections");
  const [activeSection, setActiveSection] = useState(null);
  const [siteConfig, setSiteConfig] = useState({});
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  const sections = [
    { id: 'about-hero', label: 'About Us Hero' },
    { id: 'about-story', label: 'Our Story' },
    { id: 'about-vision', label: 'Vision & Values' },
    { id: 'about-journey', label: 'Journey Milestones' },
    { id: 'about-experts', label: 'Team Experts' },
    { id: 'about-testimonials', label: 'Patient Testimonials' }
  ];

  const frontendUrl = `${FRONTEND_URL}/about?edit=true`;
  const pendingChanges = useRef({});
  const saveTimeout = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'SECTION_CLICKED') {
        const clickedSectionId = event.data.payload.sectionId;
        const matched = sections.find(s => s.id === clickedSectionId);
        if (matched) {
            setActiveSection(event.data.payload);
            setActiveTab("settings");
        }
      }
      if (event.data.type === 'FIELD_UPDATED') {
        const { sectionId, fieldPath, value } = event.data.payload;
        
        setSiteConfig(prev => ({
          ...prev,
          [`${sectionId}.${fieldPath}`]: value
        }));

        if (!pendingChanges.current[sectionId]) {
          pendingChanges.current[sectionId] = {};
        }
        
        pendingChanges.current[sectionId][fieldPath] = value;
        
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          persistChanges();
        }, 2000);
      }
    };

    window.addEventListener("message", handleMessage);
    setLoading(false);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_CONFIG',
        payload: siteConfig
      }, '*');
    }
  }, [siteConfig]);

  const persistChanges = async () => {
    const sectionsToUpdate = Object.keys(pendingChanges.current);
    if (sectionsToUpdate.length === 0) return;

    setSaving(true);
    try {
      // For About Us, we save the entire document since it's a single model
      const { data: currentData } = await axios.get("/about-us");
      const updatedPayload = JSON.parse(JSON.stringify(currentData.data || {}));

      sectionsToUpdate.forEach(sectionId => {
        const updates = pendingChanges.current[sectionId];
        Object.keys(updates).forEach(path => {
          // Path format in About Us: "hero.title", "story.heading" etc.
          // The fieldPath sent from component already includes the section prefix if needed, 
          // or we handle it here.
          
          const fullPath = path; // e.g. "hero.title"
          const parts = fullPath.split('.');
          let current = updatedPayload;
          for (let i = 0; i < parts.length - 1; i++) {
            const key = parts[i];
            const nextKey = parts[i + 1];
            if (!current[key]) {
              current[key] = isNaN(nextKey) ? {} : [];
            }
            if (!isNaN(nextKey) && Array.isArray(current[key])) {
              const idx = parseInt(nextKey, 10);
              if (!current[key][idx]) current[key][idx] = {};
            }
            current = current[key];
          }
          current[parts[parts.length - 1]] = updates[path];
        });
      });

      await axios.put("/about-us", updatedPayload);
      pendingChanges.current = {};
      toast.success("Changes saved successfully", { id: 'auto-save' });
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to auto-save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (Object.keys(pendingChanges.current).length > 0) {
      await persistChanges();
    } else {
      toast.success("No pending changes to save");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black animate-pulse uppercase tracking-widest">Initializing About Us Builder...</div>;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>
          <div>
            <h1 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
              <Layers size={16} className="text-blue-400" />
              About Us Visual Builder
            </h1>
          </div>
        </div>

        {/* Viewport Switches */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setViewMode("desktop")} className={`p-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}><Monitor size={18} /></button>
          <button onClick={() => setViewMode("tablet")} className={`p-1.5 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}><Tablet size={18} /></button>
          <button onClick={() => setViewMode("mobile")} className={`p-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}><Smartphone size={18} /></button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all text-xs shadow-lg shadow-blue-900/40">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Publishing..." : "Publish Live"}
          </button>
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Control Panel */}
        <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xl z-10">
          <div className="flex border-b border-slate-100">
            <button onClick={() => setActiveTab("sections")} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'sections' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Sections</button>
            <button onClick={() => setActiveTab("settings")} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Settings</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'sections' && (
              <div className="space-y-4">
                {sections.map((section, i) => (
                  <div key={i} onClick={() => { setActiveSection(section); setActiveTab("settings"); }} className={`flex items-center justify-between p-3 border rounded-xl group transition-all cursor-pointer ${activeSection?.id === section.id ? 'border-blue-600 bg-blue-50' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}>
                    <div className="flex items-center gap-3">
                      <Layers size={14} className={activeSection?.id === section.id ? 'text-blue-600' : 'text-slate-300'} />
                      <span className={`text-xs font-bold ${activeSection?.id === section.id ? 'text-blue-700' : 'text-slate-700'}`}>{section.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && activeSection && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editing: {activeSection.label}</h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">Modify content directly in the preview or use the full CMS editor.</p>
                  <button onClick={() => navigate('/cms/about-us')} className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    <SettingsIcon size={14} /> Open Full Form Editor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-slate-100 flex flex-col items-center justify-start p-8 overflow-hidden relative">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-500" style={{ width: viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%', height: '100%' }}>
            <iframe ref={iframeRef} src={frontendUrl} title="About Us Preview" className="w-full h-full border-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
