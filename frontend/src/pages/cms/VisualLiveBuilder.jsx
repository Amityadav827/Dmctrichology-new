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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getFrontendPreviewUrl, FRONTEND_URL } from "../../utils/config";

export default function VisualLiveBuilder() {
  const { slug = "home" } = useParams();
  const [searchParams] = useSearchParams();
  const serviceSlug = searchParams.get('service') || 'soprano-titanium-laser'; // default fallback
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("desktop"); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState("sections"); // sections, settings
  const [activeSection, setActiveSection] = useState(null);
  const [siteConfig, setSiteConfig] = useState({});
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // URL for the real frontend
  // Composition mapping for different editor modes
  const getSectionsForSlug = (currentSlug) => {
    const allSections = [
      { id: 'topbar', label: 'Top Bar' },
      { id: 'header', label: 'Header' },
      { id: 'hero', label: 'Hero Slider' },
      { id: 'about-us', label: 'About Us' },
      { id: 'services', label: 'Services Slider' },
      { id: 'marquee-features', label: 'Marquee Features' },
      { id: 'why-choose-us', label: 'Why Choose Us' },
      { id: 'results-slider', label: 'Before & After Results' },
      { id: 'grade-slider', label: 'Hair Transplant Grades' },
      { id: 'why-choose-dmc', label: 'Why Choose DMC' },
      { id: 'surgeons-section', label: 'Meet Our Surgeons' },
      { id: 'consultation-section', label: 'Request Consultation' },
      { id: 'reviews-section', label: 'Reviews & Stories' },
      { id: 'treatment-plan-section', label: 'Know The Right Treatment' },
      { id: 'faq-section', label: 'Frequently Asked Question?' },
      { id: 'blogs-home-section', label: 'News & Wellness Advice' },
      { id: 'press-media-section', label: 'Press & Media' },
      { id: 'footer-section', label: 'Footer' }
    ];

    if (currentSlug === 'header') {
      return allSections.filter(s => ['topbar', 'header'].includes(s.id));
    }
    if (currentSlug === 'footer') {
      return allSections.filter(s => ['footer-section'].includes(s.id));
    }
    if (currentSlug === 'home') {
      return allSections.filter(s => !['topbar', 'header', 'footer-section'].includes(s.id));
    }
    if (currentSlug === 'service') {
      return [
        { id: 'service-hero', label: 'Service Banner' },
        { id: 'service-listing', label: 'Services Grid' }
      ];
    }
    if (currentSlug === 'details') {
      return [
        { id: 'details-banner', label: 'Details Banner' },
        { id: 'service-intro', label: 'Service Intro' },
        { id: 'process-slider', label: 'Process Slider' },
        { id: 'before-after-section', label: 'Before/After Treatment' },
        { id: 'faq-enquiry-section', label: 'FAQ & Enquiry Form' },
        { id: 'ideal-frequency-section', label: 'Ideal Frequency & CTA' }
      ];
    }
    if (currentSlug === 'contact-us') {
      return [
        { id: 'contact-hero', label: 'Contact Hero Banner' },
        { id: 'contact-consultation', label: 'Contact Page Consultation' },
        { id: 'contact-map', label: 'Location Map Section' }
      ];
    }
    if (currentSlug === 'blog') {
      return [
        { id: 'blog-hero', label: 'Blog Hero Banner' },
        { id: 'blog-listing', label: 'Blog Listing Section' }
      ];
    }
    if (currentSlug === 'press-media') {
      return [
        { id: 'press-media-hero', label: 'Press Media Hero Banner' },
        { id: 'press-media-cards', label: 'Press Media Featured Cards' }
      ];
    }
    if (currentSlug === 'virtual-tour') {
      return [
        { id: 'virtual-tour-hero', label: 'Virtual Tour Hero Banner' },
        { id: 'virtual-tour-cards', label: 'Virtual Tour Gallery Cards' }
      ];
    }
    if (currentSlug === 'influencers') {
      return [
        { id: 'influencer-hero', label: 'Influencer Hero Banner' },
        { id: 'influencer-cards', label: 'Influencer Showcase Cards' }
      ];
    }
    return allSections;
  };

  const sections = getSectionsForSlug(slug);

  // Determine iframe URL
  const frontendUrl = slug === 'details' ? `${FRONTEND_URL}/details/${serviceSlug}` : getFrontendPreviewUrl(slug);
  const baseUrl = FRONTEND_URL;

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
        } else {
            console.log("Section not in current composition:", clickedSectionId);
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
    return () => {
      window.removeEventListener("message", handleMessage);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [sections]);

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
      for (const sectionId of sectionsToUpdate) {
        const updates = pendingChanges.current[sectionId];
        let endpoint = '';
        let isServiceDetailEndpoint = false;
        
        switch(sectionId) {
          case 'topbar': endpoint = '/topbar'; break;
          case 'header': endpoint = '/header'; break;
          case 'hero': endpoint = '/hero'; break;
          case 'about-us': endpoint = '/about-us'; break;
          case 'services': endpoint = '/services'; break;
          case 'marquee-features': endpoint = '/marquee-features'; break;
          case 'why-choose-us': endpoint = '/why-choose-us'; break;
          case 'results-slider': endpoint = '/results-slider'; break;
          case 'grade-slider': endpoint = '/grade-slider'; break;
          case 'why-choose-dmc': endpoint = '/why-choose-dmc'; break;
          case 'surgeons-section': endpoint = '/surgeons'; break;
          case 'consultation-section': endpoint = '/consultation'; break;
          case 'reviews-section': endpoint = '/reviews'; break;
          case 'treatment-plan-section': endpoint = '/treatment-plan'; break;
          case 'faq-section': endpoint = '/home-faq'; break;
          case 'blogs-home-section': endpoint = '/blogs-home'; break;
          case 'press-media-section': endpoint = '/press-media'; break;
          case 'footer-section': endpoint = '/footer'; break;
          case 'service-hero': endpoint = '/service-page-settings'; break;
          case 'service-listing': endpoint = '/service-listing-cards'; break;
          case 'service-listing-categories': endpoint = '/service-listing-categories'; break;
          case 'details-banner': endpoint = `/service-details/${serviceSlug}`; isServiceDetailEndpoint = true; break;
          case 'service-intro': endpoint = `/service-details/${serviceSlug}`; isServiceDetailEndpoint = true; break;
          case 'process-slider': endpoint = `/service-details/${serviceSlug}`; isServiceDetailEndpoint = true; break;
          case 'before-after-section': endpoint = `/service-details/${serviceSlug}`; isServiceDetailEndpoint = true; break;
          case 'faq-enquiry-section': endpoint = `/service-details/${serviceSlug}`; isServiceDetailEndpoint = true; break;
          case 'ideal-frequency-section': endpoint = `/service-details/${serviceSlug}`; isServiceDetailEndpoint = true; break;
          case 'contact-hero': endpoint = '/contact-page'; break;
          case 'contact-consultation': endpoint = '/contact-page'; break;
          case 'contact-map': endpoint = '/contact-page'; break;
          case 'blog-hero': endpoint = '/blog-page'; break;
          case 'blog-listing': endpoint = '/blog-page'; break;
          case 'press-media-hero': endpoint = '/press-media'; break;
          case 'press-media-cards': endpoint = '/press-media'; break;
          case 'virtual-tour-hero': endpoint = '/virtual-tour'; break;
          case 'virtual-tour-cards': endpoint = '/virtual-tour'; break;
          case 'influencer-hero': endpoint = '/influencers'; break;
          case 'influencer-cards': endpoint = '/influencers'; break;
          default: endpoint = `/sections/${sectionId}`;
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
              Visual Builder — {slug.toUpperCase()}
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
                    {sections.map((section, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setActiveSection({ sectionId: section.id, label: section.label });
                          setActiveTab("settings");
                        }}
                        className={`flex items-center justify-between p-3 border rounded-xl group transition-all cursor-pointer ${activeSection?.sectionId === section.id ? 'border-blue-600 bg-blue-50' : 'bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-white'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={activeSection?.sectionId === section.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-400 transition-colors'}>
                            <Layers size={14} />
                          </div>
                          <span className={`text-xs font-bold ${activeSection?.sectionId === section.id ? 'text-blue-700' : 'text-slate-700'}`}>{section.label}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${activeSection?.sectionId === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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
                            'Marquee Features': '/cms/marquee-features',
                            'Why Choose Us': '/cms/why-choose-us',
                            'Before & After Results': '/cms/before-after-results',
                            'Hair Transplant Grades': '/cms/hair-transplant-grades',
                            'Why Choose DMC': '/cms/why-choose-dmc',
                            'Meet Our Surgeons': '/cms/surgeons',
                            'Request Consultation': '/cms/consultation',
                            'Reviews & Stories': '/cms/reviews',
                            'Know The Right Treatment': '/cms/treatment-plan',
                            'Frequently Asked Question?': '/cms/faq',
                            'News & Wellness Advice': '/cms/blogs-home',
                            'Press & Media Section': '/cms/press-media',
                            'Footer Section': '/cms/footer',
                            'Service Banner': '/cms/service-hero',
                            'Services Grid': '/cms/service-listing',
                            'Service Categories': '/cms/service-categories',
                            'Details Banner': '/cms/details-banner',
                            'Service Intro': '/cms/service-intro',
                            'Process Slider': '/cms/process-slider',
                            'Before/After Treatment': '/cms/before-after',
                            'FAQ & Enquiry Form': '/cms/faq-enquiry',
                            'Ideal Frequency & CTA': '/cms/ideal-frequency',
                            'Contact Hero Banner': '/cms/contact-page',
                            'Location Map Section': '/cms/contact-page',
                            'Contact Page Consultation': '/cms/contact-page',
                            'Blog Hero Banner': '/cms/blog-page',
                            'Blog Listing Section': '/cms/blog-page',
                            'Press Media Hero Banner': '/cms/press-media',
                            'Press Media Featured Cards': '/cms/press-media',
                            'Virtual Tour Hero Banner': '/cms/virtual-tour',
                            'Virtual Tour Gallery Cards': '/cms/virtual-tour',
                            'Influencer Hero Banner': '/cms/influencers',
                            'Influencer Showcase Cards': '/cms/influencers'
                          };
                          if(routeMap[activeSection.label]) navigate(routeMap[activeSection.label]);
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                      >
                        <Plus size={14} /> {activeSection.label === 'Services Grid' ? 'Add / Manage Services' : 'Open Full Form Editor'}
                      </button>
                    </div>

                    {activeSection.label === 'Services Grid' && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                             <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3">Quick Actions</h5>
                             <div className="space-y-2">
                                <button 
                                    onClick={() => navigate('/cms/service-listing')}
                                    className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:border-blue-300 transition-all flex items-center justify-between px-3"
                                >
                                    <span>Manage Service Cards</span>
                                    <ChevronLeft size={14} className="rotate-180 text-slate-300" />
                                </button>
                                <button 
                                    onClick={() => navigate('/cms/service-categories')}
                                    className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:border-blue-300 transition-all flex items-center justify-between px-3"
                                >
                                    <span>Manage Categories</span>
                                    <ChevronLeft size={14} className="rotate-180 text-slate-300" />
                                </button>
                             </div>
                        </div>
                    )}

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
            <span className="text-[10px] font-bold text-slate-400">{baseUrl.replace('https://', '').replace('http://', '')}/{slug === 'home' ? '' : slug}</span>
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
