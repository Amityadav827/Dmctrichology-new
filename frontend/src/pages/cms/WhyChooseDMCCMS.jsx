import React, { useState, useEffect } from "react";
import { Save, Globe, Plus, Trash2, MoveUp, MoveDown, Layout, Image as ImageIcon, Settings, Type, AlignLeft } from "lucide-react";
import api from "../../api/client";
import { toast } from "react-hot-toast";

const WhyChooseDMCCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: "",
    heading: "",
    description: "",
    mainImage: "",
    bottomImage: "",
    backgroundColor: "#ffffff",
    features: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/why-choose-dmc");
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load Why Choose DMC data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isPublish = false) => {
    try {
      const res = await api.put("/why-choose-dmc", data);
      if (res.data.success) {
        toast.success(isPublish ? "Published successfully!" : "Changes saved!");
      }
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const addFeature = () => {
    setData({
      ...data,
      features: [
        ...data.features,
        { text: "New Feature", enabled: true }
      ]
    });
  };

  const removeFeature = (index) => {
    const newList = [...data.features];
    newList.splice(index, 1);
    setData({ ...data, features: newList });
  };

  const updateFeature = (index, field, value) => {
    const newList = [...data.features];
    newList[index][field] = value;
    setData({ ...data, features: newList });
  };

  const moveFeature = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.features.length - 1) return;
    const newList = [...data.features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setData({ ...data, features: newList });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Why Choose DMC CMS</h1>
          <p className="text-slate-500 text-sm font-medium">Manage the Why Choose DMC section with features list</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all">
            <Save size={18} /> Save Changes
          </button>
          <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            <Globe size={18} /> Publish Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
              <Settings className="text-blue-600" size={20} />
              <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">General Content</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-700 text-sm">Enable Section</p>
                <p className="text-xs text-slate-500">Show/hide this section</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Badge Text</label>
                <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Heading</label>
                <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all h-32 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Main Image URL</label>
                <input type="text" value={data.mainImage} onChange={(e) => setData({ ...data, mainImage: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Bottom Box Image URL</label>
                <input type="text" value={data.bottomImage} onChange={(e) => setData({ ...data, bottomImage: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Background Color</label>
                <div className="flex gap-3">
                  <input type="color" value={data.backgroundColor} onChange={(e) => setData({ ...data, backgroundColor: e.target.value })} className="h-11 w-20 rounded-xl cursor-pointer border border-slate-100" />
                  <input type="text" value={data.backgroundColor} onChange={(e) => setData({ ...data, backgroundColor: e.target.value })} className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Features Repeater */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <AlignLeft className="text-blue-600" size={20} />
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">Feature List ({data.features.length})</h2>
              </div>
              <button onClick={addFeature} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all">
                <Plus size={16} /> Add New Feature
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.features.map((feature, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-[10px] font-black text-slate-400 border border-slate-100">{index + 1}</span>
                    <input type="text" value={feature.text} onChange={(e) => updateFeature(index, 'text', e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 text-sm p-0" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button onClick={() => moveFeature(index, 'up')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><MoveUp size={14} /></button>
                    <button onClick={() => moveFeature(index, 'down')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><MoveDown size={14} /></button>
                    <button onClick={() => removeFeature(index)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"><Trash2 size={14} /></button>
                    <input type="checkbox" checked={feature.enabled} onChange={(e) => updateFeature(index, 'enabled', e.target.checked)} className="w-3.5 h-3.5 text-blue-600 bg-white border-slate-300 rounded ml-1" />
                  </div>
                </div>
              ))}
            </div>

            {data.features.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No features defined. Click "Add New Feature" to start.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseDMCCMS;
