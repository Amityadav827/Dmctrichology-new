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
import { useNavigate, useParams } from "react-router-dom";

export default function VisualLiveBuilder() {
  const { slug = "home" } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("desktop"); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState("sections"); // sections, settings
  const [activeSection, setActiveSection] = useState(null);
  const [siteConfig, setSiteConfig] = useState({});
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // URL for the real frontend
  const frontendUrl = `https://dmctrichology-mkm4.vercel.app/${slug === 'home' ? '' : slug}?edit=true`;

  const pendingChanges = useRef({});
  const saveTimeout = useRef(null);

  useEffect(() => {
    // Listen for messages from the iframe (frontend)
    const handleMessage = (event) => {
      if (event.data.type === 'SECTION_CLICKED') {
        setActiveSection(event.data.payload);
        setActiveTab("settings");
      }
      if (event.data.type === 'FIELD_UPDATED') {
        const { sectionId, fieldPath, value } = event.data.payload;
        
        // 1. Update local UI state
        setSiteConfig(prev => ({
          ...prev,
          [`${sectionId}.${fieldPath}`]: value
        }));

        // 2. Queue for persistence
        if (!pendingChanges.current[sectionId]) {
          pendingChanges.current[sectionId] = {};
        }
        
        // Handle nested fields like slides.0.title
        pendingChanges.current[sectionId][fieldPath] = value;
        
        // 3. Debounced Auto-save
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          persistChanges();
        }, 2000); // 2 second debounce
      }
    };

    window.addEventListener("message", handleMessage);
    setLoading(false);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  const persistChanges = async () => {
    const sectionsToUpdate = Object.keys(pendingChanges.current);
    if (sectionsToUpdate.length === 0) return;

    setSaving(true);
    try {
      for (const sectionId of sectionsToUpdate) {
        const updates = pendingChanges.current[sectionId];
        let endpoint = '';
        
        // Map sectionId to correct API endpoint
        switch(sectionId) {
          case 'topbar': endpoint = '/topbar'; break;
          case 'header': endpoint = '/header'; break;
          case 'hero': endpoint = '/hero'; break;
          case 'about-us': endpoint = '/about-us'; break;
          case 'services': endpoint = '/services'; break;
          case 'marquee-features': endpoint = '/marquee-features'; break;
          default: continue;
        }

        // Fetch current data first to avoid overwriting other fields
        const { data: currentData } = await axios.get(endpoint);
        const rawExisting = currentData.data || {};

        // CRITICAL: Deep-clone via JSON to strip Mongoose document wrappers.
        // Mongoose subdocuments (e.g. services[0]) cannot be mutated directly
        // via bracket notation — they need to be plain JS objects first.
        const existingData = JSON.parse(JSON.stringify(rawExisting));
        
        // Merge updates
        const updatedPayload = { ...existingData };
        
        Object.keys(updates).forEach(path => {
          // Nested path handling (e.g. "services.0.title", "slides.0.title")
          if (path.includes('.')) {
            const parts = path.split('.');
            let current = updatedPayload;
            for (let i = 0; i < parts.length - 1; i++) {
              const key = parts[i];
              const nextKey = parts[i + 1];
              // If next key is a number index, ensure current slot is an array
              if (!current[key]) {
                current[key] = isNaN(nextKey) ? {} : [];
              }
              // Ensure the indexed slot exists as a plain object
              if (!isNaN(nextKey) && Array.isArray(current[key])) {
                const idx = parseInt(nextKey, 10);
                if (current[key][idx] === undefined || current[key][idx] === null) {
                  current[key][idx] = {};
                }
              }
              current = current[key];
            }
            if (current !== undefined && current !== null) {
              current[parts[parts.length - 1]] = updates[path];
            }
          } else {
            updatedPayload[path] = updates[path];
          }
        });

        await axios.put(endpoint, updatedPayload);
        delete pendingChanges.current[sectionId];
      }
      
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

  const getIframeWidth = () => {
    switch(viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>
          <div>
            <h1 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
              <Layers size={16} className="text-blue-400" />
              Visual Builder
            </h1>
          </div>
        </div>

        {/* Viewport Switches */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode("desktop")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => setViewMode("tablet")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Tablet size={18} />
          </button>
          <button 
            onClick={() => setViewMode("mobile")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Draft Saved</span>
            <span className="text-[9px] text-slate-500 uppercase">Just now</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all text-xs shadow-lg shadow-blue-900/40"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Publishing..." : "Publish Live"}
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Control Panel */}
        <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xl z-10">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab("sections")}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'sections' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Sections
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Element Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'sections' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Composition</h3>
                  <div className="space-y-2">
                    {['Top Bar', 'Header', 'Hero Section', 'About Us', 'Services'].map((name, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-blue-200 hover:bg-white transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
                            <Layers size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{name}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                          <button className="p-1 hover:text-blue-600"><RefreshCw size={12} /></button>
                          <button className="p-1 hover:text-blue-600"><SettingsIcon size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MousePointer2 size={60} />
                  </div>
                  <h4 className="text-sm font-bold mb-2">Visual Mode Active</h4>
                  <p className="text-[11px] text-blue-100 leading-relaxed font-medium">Click any element in the live preview to edit its content instantly.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                {activeSection ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editing: {activeSection.label}</h3>
                      <button onClick={() => setActiveSection(null)} className="text-[10px] text-blue-600 font-bold hover:underline">Clear</button>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">Changes you make here or inline will reflect in the live preview instantly.</p>
                      <button 
                        onClick={() => {
                          const routeMap = { 
                            'Top Bar': '/cms/topbar', 
                            'Header': '/cms/header', 
                            'Hero Slider': '/cms/hero',
                            'About Us': '/cms/about-us',
                            'Services Slider': '/cms/services',
                            'Marquee Features': '/cms/marquee-features'
                          };
                          if(routeMap[activeSection.label]) navigate(routeMap[activeSection.label]);
                        }}
                        className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <SettingsIcon size={14} /> Open Full Form Editor
                      </button>
                    </div>

                    <div className="space-y-4">
                       <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-2xl">
                         <h5 className="text-[10px] font-black text-blue-600 uppercase mb-2">Live Status</h5>
                         <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-700">Syncing real-time</span>
                         </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <MousePointer2 size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Select an Element</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Click any section or text on the right to start visual editing.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
             <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <Plus size={14} /> Add New Section
             </button>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-slate-100 flex flex-col items-center justify-start p-8 overflow-hidden relative">
          
          <div className="mb-4 flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-200">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time Preview</span>
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-[10px] font-bold text-slate-400">dmctrichology.com/{slug === 'home' ? '' : slug}</span>
          </div>

          <div 
            className="bg-white shadow-[0_30px_100px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out border border-slate-200"
            style={{ 
              width: getIframeWidth(),
              height: '100%',
              maxWidth: '100%'
            }}
          >
            <iframe 
              ref={iframeRef}
              src={frontendUrl} 
              title="Visual Preview"
              className="w-full h-full border-none"
            />
          </div>

          {/* Floating UI Indicator */}
          <div className="absolute bottom-12 right-12 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Eye size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Editing Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
