import React, { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, Type, BarChart3 } from "lucide-react";
import api from "../../api/client";
import toast from "react-hot-toast";

const defaultStats = [
  {
    value: "2k+",
    label: "Patients Healed",
    description: "Experience Compassionate Care Healthier Care Certified Brighter Smile.",
    showDivider: true,
  },
  {
    value: "15+",
    label: "Certified Doctors",
    description: "Experience Compassionate Care Healthier Care Certified Brighter Smile.",
    showDivider: true,
  },
  {
    value: "4.7",
    label: "Average Patient Rating",
    description: "Experience Compassionate Care Healthier Care Certified Brighter Smile.",
    showDivider: true,
  },
  {
    value: "100+",
    label: "New Equipments",
    description: "Experience Compassionate Care Healthier Care Certified Brighter Smile.",
    showDivider: true,
  },
];

const defaultSectionData = {
  subtitle: "ABOUT US CARE",
  title: "WELCOME TO DMC TRICHOLOGY®",
  description:
    "At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence",
  icon:
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png",
  stats: defaultStats,
};

export default function HomepageAboutUsCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullPayload, setFullPayload] = useState({});
  const [sectionData, setSectionData] = useState(defaultSectionData);

  useEffect(() => {
    fetchSectionData();
  }, []);

  const fetchSectionData = async () => {
    try {
      const { data: res } = await api.get("/about-us");
      const payload = res?.data || {};
      setFullPayload(payload);
      setSectionData({
        subtitle: payload?.subtitle || defaultSectionData.subtitle,
        title: payload?.title || defaultSectionData.title,
        description: payload?.description || defaultSectionData.description,
        icon: payload?.icon || defaultSectionData.icon,
        stats:
          Array.isArray(payload?.stats) && payload.stats.length > 0
            ? payload.stats.map((stat, index) => ({
                value: stat?.value || defaultStats[index]?.value || "",
                label: stat?.label || defaultStats[index]?.label || "",
                description: stat?.description || defaultStats[index]?.description || "",
                showDivider: stat?.showDivider !== false,
              }))
            : defaultStats,
      });
    } catch (error) {
      toast.error("Failed to load homepage welcome section");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setSectionData((prev) => ({ ...prev, [field]: value }));
  };

  const updateStat = (index, field, value) => {
    setSectionData((prev) => {
      const nextStats = [...prev.stats];
      nextStats[index] = { ...nextStats[index], [field]: value };
      return { ...prev, stats: nextStats };
    });
  };

  const addStat = () => {
    setSectionData((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          value: "",
          label: "",
          description: "",
          showDivider: true,
        },
      ],
    }));
  };

  const removeStat = (index) => {
    setSectionData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...fullPayload,
        subtitle: sectionData.subtitle,
        title: sectionData.title,
        description: sectionData.description,
        icon: sectionData.icon,
        stats: sectionData.stats,
      };

      const { data: res } = await api.put("/about-us", payload);
      if (res?.success) {
        setFullPayload(payload);
        toast.success("Homepage welcome section saved");
      } else {
        toast.error("Failed to save section");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Homepage Welcome Section</h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage the About Us Care section shown on the homepage
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
          <Type className="text-blue-600" size={20} />
          <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">Section Content</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Eyebrow</label>
            <input
              type="text"
              value={sectionData.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Section Icon URL</label>
            <input
              type="text"
              value={sectionData.icon}
              onChange={(e) => updateField("icon", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Heading</label>
            <textarea
              rows={3}
              value={sectionData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              rows={4}
              value={sectionData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">
              Statistics Cards ({sectionData.stats.length})
            </h2>
          </div>
          <button
            onClick={addStat}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all"
          >
            <Plus size={16} /> Add Stat
          </button>
        </div>

        <div className="space-y-5">
          {sectionData.stats.map((stat, index) => (
            <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-700">Stat #{index + 1}</p>
                <button
                  onClick={() => removeStat(index)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                  title="Remove stat"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                    className="w-full p-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                    className="w-full p-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={stat.description}
                    onChange={(e) => updateStat(index, "description", e.target.value)}
                    className="w-full p-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none"
                  />
                </div>

                <label className="inline-flex items-center gap-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={stat.showDivider !== false}
                    onChange={(e) => updateStat(index, "showDivider", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Divider Icon
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
