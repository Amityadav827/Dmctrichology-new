import React, { useState, useEffect } from "react";
import { Save, Globe, Plus, Trash2, MoveUp, MoveDown, Layout, Image as ImageIcon, Settings, Info } from "lucide-react";
import api from "../../api/client";
import { toast } from "react-hot-toast";

const ResultsSliderCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: "",
    heading: "",
    backgroundColor: "#FFFAF1",
    results: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/results-slider");
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load Results Slider data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isPublish = false) => {
    try {
      const res = await api.put("/results-slider", data);
      if (res.data.success) {
        toast.success(isPublish ? "Published successfully!" : "Changes saved!");
      }
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const addResult = () => {
    setData({
      ...data,
      results: [
        ...data.results,
        { title: "New Treatment", beforeImg: "", afterImg: "", sessions: "After 1 session", enabled: true }
      ]
    });
  };

  const removeResult = (index) => {
    const newList = [...data.results];
    newList.splice(index, 1);
    setData({ ...data, results: newList });
  };

  const updateResult = (index, field, value) => {
    const newList = [...data.results];
    newList[index][field] = value;
    setData({ ...data, results: newList });
  };

  const moveResult = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.results.length - 1) return;
    const newList = [...data.results];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setData({ ...data, results: newList });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Before & After Results CMS</h1>
          <p className="text-slate-500 text-sm font-medium">Manage the results slider on the homepage</p>
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
              <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">Section Settings</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-700 text-sm">Enable Section</p>
                <p className="text-xs text-slate-500">Show/hide this section on frontend</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Badge Text</label>
                <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" placeholder="BEFORE AND AFTER" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Section Title</label>
                <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" placeholder="Results that speak for themselves" />
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

        {/* Right Column: Cards Repeater */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Layout className="text-blue-600" size={20} />
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">Result Cards ({data.results.length})</h2>
              </div>
              <button onClick={addResult} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all">
                <Plus size={16} /> Add New Result
              </button>
            </div>

            <div className="space-y-4">
              {data.results.map((result, index) => (
                <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-xs font-black text-slate-400 border border-slate-100">{index + 1}</span>
                      <h4 className="font-bold text-slate-700">{result.title || "Untitled Result"}</h4>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveResult(index, 'up')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><MoveUp size={16} /></button>
                      <button onClick={() => moveResult(index, 'down')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><MoveDown size={16} /></button>
                      <button onClick={() => removeResult(index)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Treatment Name</label>
                      <input type="text" value={result.title} onChange={(e) => updateResult(index, 'title', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Before Image URL</label>
                      <input type="text" value={result.beforeImg} onChange={(e) => updateResult(index, 'beforeImg', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">After Image URL</label>
                      <input type="text" value={result.afterImg} onChange={(e) => updateResult(index, 'afterImg', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Sessions Text</label>
                      <input type="text" value={result.sessions} onChange={(e) => updateResult(index, 'sessions', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all" />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={result.enabled} onChange={(e) => updateResult(index, 'enabled', e.target.checked)} className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Card Enabled</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {data.results.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No result cards yet. Click "Add New Result" to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSliderCMS;
