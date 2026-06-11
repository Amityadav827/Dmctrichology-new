import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save,
  Loader2,
  MapPin,
  Phone,
  Clock,
  Settings,
  Layout,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  GripVertical
} from "lucide-react";
import SeoMetadataSection from "../../components/cms/SeoMetadataSection";

const DEFAULT_MAP_ITEM = {
  id: "",
  branchName: "",
  city: "",
  area: "",
  googleMapEmbedUrl: "",
  displayOrder: 10,
  isEnabled: true
};

const normalizeMapItem = (item = {}, index = 0) => ({
  id: item.id || `map-${Date.now()}-${index}`,
  branchName: item.branchName || item.name || item.area || `Map ${index + 1}`,
  city: item.city || "",
  area: item.area || "",
  googleMapEmbedUrl: item.googleMapEmbedUrl || item.embedUrl || "",
  displayOrder: Number.isFinite(Number(item.displayOrder)) ? Number(item.displayOrder) : (index + 1) * 10,
  isEnabled: item.isEnabled !== false
});

const normalizeMapData = (map = {}) => {
  const legacyMap = normalizeMapItem({
    id: "legacy-map-1",
    branchName: map.branchName || map.area || map.city || "Map 1",
    city: map.city || "",
    area: map.area || "",
    googleMapEmbedUrl: map.googleMapEmbedUrl || "",
    displayOrder: 10,
    isEnabled: true
  }, 0);
  const maps = Array.isArray(map.maps) && map.maps.length > 0
    ? map.maps.map(normalizeMapItem)
    : [legacyMap];
  const sortedMaps = maps.sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
  const firstMap = sortedMaps[0] || legacyMap;

  return {
    ...map,
    multipleMapsEnabled: map.multipleMapsEnabled === true,
    maps: sortedMaps,
    city: map.city || firstMap.city || "",
    area: map.area || firstMap.area || "",
    googleMapEmbedUrl: map.googleMapEmbedUrl || firstMap.googleMapEmbedUrl || ""
  };
};

const prepareMapForSave = (map = {}) => {
  const maps = (Array.isArray(map.maps) ? map.maps : [])
    .map(normalizeMapItem)
    .map((item, index) => ({ ...item, displayOrder: item.displayOrder ?? ((index + 1) * 10) }))
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
  const firstMap = maps[0] || normalizeMapItem(map, 0);

  return {
    ...map,
    maps,
    city: firstMap.city || map.city || "",
    area: firstMap.area || map.area || "",
    googleMapEmbedUrl: firstMap.googleMapEmbedUrl || map.googleMapEmbedUrl || ""
  };
};

export default function ContactPageCMS() {
  const [data, setData] = useState({
    hero: {
      title: "Contact Us",
      breadcrumbText: "Home / Contact Us",
      backgroundColor: "#F7F7F7",
      paddingTop: "80px",
      paddingBottom: "80px",
    },
    consultation: {
      badgeText: "WHY CHOOSE US SERVICES",
      heading: "REQUEST A CONSULTATION",
      subtitle: "Clinic Timings ( By Appointments Only)",
      phoneNumber: "+91-8527830194",
      serviceTimingMonSat: "9:00 AM To 8:00 PM",
      serviceTimingSunday: "10:00 AM To 7:00 PM",
      buttonText: "Schedule Your Visit",
      beforeImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png",
      serviceOptions: []
    },
    map: {
      city: "New Delhi",
      area: "Vasant Vihar",
      googleMapEmbedUrl: "",
      mapHeight: "600px",
      cardBackground: "#2D4A8A",
      iconColor: "#C8102E",
      textColor: "#FFFFFF",
      multipleMapsEnabled: false,
      maps: []
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      ogImage: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [dragMapIndex, setDragMapIndex] = useState(null);

  useEffect(() => {
    axios.get("/contact-page")
      .then(res => {
        if (res.data?.data) {
          setData(prev => ({
            ...prev,
            ...res.data.data,
            hero: { ...prev.hero, ...(res.data.data.hero || {}) },
            consultation: { ...prev.consultation, ...(res.data.data.consultation || {}) },
            map: normalizeMapData({ ...prev.map, ...(res.data.data.map || {}) }),
            seo: { ...prev.seo, ...(res.data.data.seo || {}) }
          }));
        }
      })
      .catch(() => toast.error("Failed to load contact page data"))
      .finally(() => setLoading(false));
  }, []);

  const updateSectionField = (section, field, val) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: val }
    }));
  };

  const updateMapField = (index, field, value) => {
    setData(prev => {
      const maps = [...(prev.map?.maps || [])];
      maps[index] = { ...(maps[index] || DEFAULT_MAP_ITEM), [field]: value };
      return { ...prev, map: { ...prev.map, maps } };
    });
  };

  const addMap = () => {
    setData(prev => {
      const maps = [...(prev.map?.maps || [])];
      maps.push({
        ...DEFAULT_MAP_ITEM,
        id: `map-${Date.now()}`,
        branchName: `Map ${maps.length + 1}`,
        city: prev.map?.city || "",
        area: "",
        displayOrder: (maps.length + 1) * 10
      });
      return { ...prev, map: { ...prev.map, multipleMapsEnabled: true, maps } };
    });
  };

  const removeMap = (index) => {
    setData(prev => {
      const maps = (prev.map?.maps || []).filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, displayOrder: (i + 1) * 10 }));
      return { ...prev, map: { ...prev.map, maps } };
    });
  };

  const moveMap = (from, to) => {
    if (from === null || to === null || from === to) return;
    setData(prev => {
      const maps = [...(prev.map?.maps || [])];
      const [item] = maps.splice(from, 1);
      maps.splice(to, 0, item);
      return {
        ...prev,
        map: {
          ...prev.map,
          maps: maps.map((mapItem, index) => ({ ...mapItem, displayOrder: (index + 1) * 10 }))
        }
      };
    });
  };

  const addServiceOption = () => {
    const options = [...(data.consultation.serviceOptions || [])];
    options.push("New Service");
    updateSectionField("consultation", "serviceOptions", options);
  };

  const updateServiceOption = (idx, val) => {
    const options = [...(data.consultation.serviceOptions || [])];
    options[idx] = val;
    updateSectionField("consultation", "serviceOptions", options);
  };

  const removeServiceOption = (idx) => {
    const options = (data.consultation.serviceOptions || []).filter((_, i) => i !== idx);
    updateSectionField("consultation", "serviceOptions", options);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/contact-page", { ...data, map: prepareMapForSave(data.map) });
      toast.success("Contact page saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contact Us Page CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage Hero, Consultation, and Location Map sections</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving Changes..." : "Publish Page Updates"}
        </button>
      </div>

      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 w-fit">
        <button onClick={() => setActiveTab("hero")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hero' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Hero Banner</button>
        <button onClick={() => setActiveTab("consultation")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'consultation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Consultation Form</button>
        <button onClick={() => setActiveTab("map")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Location Map</button>
        <button onClick={() => setActiveTab("seo")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'seo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>SEO</button>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'hero' && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <Layout size={14} className="text-blue-600" /> Hero Banner Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Image URL</label>
                <div className="flex gap-4">
                  <input type="text" value={data.hero.bannerImage} onChange={e => updateSectionField("hero", "bannerImage", e.target.value)}
                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                  {data.hero.bannerImage && (
                    <img src={data.hero.bannerImage} alt="Preview" className="h-14 w-24 object-cover rounded-xl border border-slate-100 shadow-sm" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Page Title</label>
                <input type="text" value={data.hero.title} onChange={e => updateSectionField("hero", "title", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Breadcrumb Text</label>
                <input type="text" value={data.hero.breadcrumbText} onChange={e => updateSectionField("hero", "breadcrumbText", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Overlay Opacity (0 to 1)</label>
                <input type="number" step="0.1" min="0" max="1" value={data.hero.overlayOpacity || 0.5} onChange={e => updateSectionField("hero", "overlayOpacity", parseFloat(e.target.value))}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Height (e.g. 400px)</label>
                <input type="text" value={data.hero.bannerHeight || "400px"} onChange={e => updateSectionField("hero", "bannerHeight", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                  <Layout size={14} className="text-blue-600" /> Content Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.consultation.badgeText} onChange={e => updateSectionField("consultation", "badgeText", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Heading</label>
                    <input type="text" value={data.consultation.heading} onChange={e => updateSectionField("consultation", "heading", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Subtitle</label>
                    <input type="text" value={data.consultation.subtitle} onChange={e => updateSectionField("consultation", "subtitle", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Background Color</label>
                    <div className="flex gap-4 items-center">
                      <input type="color" value={data.consultation.backgroundColor || "#ffffff"} onChange={e => updateSectionField("consultation", "backgroundColor", e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer" />
                      <input type="text" value={data.consultation.backgroundColor || "#ffffff"} onChange={e => updateSectionField("consultation", "backgroundColor", e.target.value)} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Name Placeholder</label>
                    <input type="text" value={data.consultation.namePlaceholder || ""} onChange={e => updateSectionField("consultation", "namePlaceholder", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Email Placeholder</label>
                    <input type="text" value={data.consultation.emailPlaceholder || ""} onChange={e => updateSectionField("consultation", "emailPlaceholder", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Message Placeholder</label>
                    <input type="text" value={data.consultation.messagePlaceholder || ""} onChange={e => updateSectionField("consultation", "messagePlaceholder", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                  <Phone size={14} className="text-blue-600" /> Contact & Timings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Phone Number</label>
                    <input type="text" value={data.consultation.phoneNumber} onChange={e => updateSectionField("consultation", "phoneNumber", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Mon-Sat Timing</label>
                    <input type="text" value={data.consultation.serviceTimingMonSat} onChange={e => updateSectionField("consultation", "serviceTimingMonSat", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Sunday Timing</label>
                    <input type="text" value={data.consultation.serviceTimingSunday} onChange={e => updateSectionField("consultation", "serviceTimingSunday", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Settings size={14} className="text-blue-600" /> Service Options
                  </h2>
                  <button onClick={addServiceOption} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {(data.consultation.serviceOptions || []).map((opt, i) => (
                    <div key={i} className="flex gap-3 group">
                      <input type="text" value={opt} onChange={e => updateServiceOption(i, e.target.value)}
                        className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                      <button onClick={() => removeServiceOption(i)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue-600" /> Comparison Image
                </h2>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Image URL</label>
                  <input type="text" value={data.consultation.beforeImage} onChange={e => updateSectionField("consultation", "beforeImage", e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all mb-4" />
                  {data.consultation.beforeImage && (
                    <img src={data.consultation.beforeImage} className="w-full h-40 object-cover rounded-2xl border border-slate-100 shadow-sm" alt="Preview" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-600" /> Map & Location Details
                </h2>
                <button type="button" onClick={addMap} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  <Plus size={16} /> Add Map
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="flex items-center gap-3 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={data.map?.multipleMapsEnabled === true}
                    onChange={e => updateSectionField("map", "multipleMapsEnabled", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-black text-slate-700">Enable Multiple Maps</span>
                </label>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Map Height (e.g. 600px)</label>
                  <input type="text" value={data.map?.mapHeight || "600px"} onChange={e => updateSectionField("map", "mapHeight", e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Floating Card Background</label>
                  <div className="flex gap-4 items-center">
                    <input type="color" value={data.map?.cardBackground || "#2D4A8A"} onChange={e => updateSectionField("map", "cardBackground", e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer" />
                    <input type="text" value={data.map?.cardBackground || "#2D4A8A"} onChange={e => updateSectionField("map", "cardBackground", e.target.value)} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {(data.map?.maps || []).map((mapItem, index) => (
              <div
                key={mapItem.id || index}
                draggable
                onDragStart={() => setDragMapIndex(index)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => {
                  moveMap(dragMapIndex, index);
                  setDragMapIndex(null);
                }}
                className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8"
              >
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <GripVertical size={18} className="text-slate-300 cursor-move" />
                    <h3 className="text-lg font-black text-slate-800">Map {index + 1}</h3>
                  </div>
                  <button type="button" onClick={() => removeMap(index)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" checked={mapItem.isEnabled !== false} onChange={e => updateMapField(index, "isEnabled", e.target.checked)} />
                    <span className="text-sm font-black text-slate-700">Enable Map</span>
                  </label>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Branch Name</label>
                    <input type="text" value={mapItem.branchName || ""} onChange={e => updateMapField(index, "branchName", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Display Order</label>
                    <input type="number" value={mapItem.displayOrder ?? ((index + 1) * 10)} onChange={e => updateMapField(index, "displayOrder", Number(e.target.value))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">City Name</label>
                    <input type="text" value={mapItem.city || ""} onChange={e => updateMapField(index, "city", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Area Name</label>
                    <input type="text" value={mapItem.area || ""} onChange={e => updateMapField(index, "area", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Google Map Embed URL</label>
                    <input type="text" value={mapItem.googleMapEmbedUrl || ""} onChange={e => updateMapField(index, "googleMapEmbedUrl", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" placeholder="Paste Google Maps embed src URL here..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <SeoMetadataSection
            seo={data.seo || {}}
            onChange={(field, value) => updateSectionField("seo", field, value)}
          />
        )}
      </div>
    </div>
  );
}
