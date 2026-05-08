import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Plus, Trash2, Copy,
  Image as ImageIcon, ChevronUp, ChevronDown
} from "lucide-react";

export default function MarqueeFeaturesCMS() {
  const [data, setData] = useState({
    enabled: true,
    backgroundColor: "transparent",
    paddingTop: "60px",
    paddingBottom: "60px",
    marqueeSpeed: 30,
    pauseOnHover: true,
    items: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get("/marquee-features");
      if (res.success && res.data) {
        setData({
          ...res.data,
          items: Array.isArray(res.data.items) ? res.data.items : []
        });
      }
    } catch (error) {
      toast.error("Failed to load Marquee Features settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ── Item helpers ──────────────────────────────────────────────
  const safeItems = Array.isArray(data.items) ? data.items : [];

  const handleItemChange = (index, field, value) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, items: updated });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...safeItems, { title: "", icon: "", link: "", enabled: true }]
    });
  };

  const duplicateItem = (index) => {
    const copy = { ...safeItems[index], title: safeItems[index].title + " (copy)" };
    const updated = [...safeItems];
    updated.splice(index + 1, 0, copy);
    setData({ ...data, items: updated });
  };

  const removeItem = (index) => {
    setData({ ...data, items: safeItems.filter((_, i) => i !== index) });
  };

  const moveItem = (index, direction) => {
    const updated = [...safeItems];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= updated.length) return;
    [updated[index], updated[swapIdx]] = [updated[swapIdx], updated[index]];
    setData({ ...data, items: updated });
  };

  // ── Save / Publish ─────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        enabled: data.enabled,
        backgroundColor: data.backgroundColor,
        paddingTop: data.paddingTop,
        paddingBottom: data.paddingBottom,
        marqueeSpeed: Number(data.marqueeSpeed),
        pauseOnHover: data.pauseOnHover,
        items: safeItems,
      };
      const { data: res } = await axios.put("/marquee-features", payload);
      if (res.success) {
        toast.success("Marquee Features saved successfully");
        setData({
          ...res.data,
          items: Array.isArray(res.data.items) ? res.data.items : []
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save Marquee Features");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await handleSave();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marquee Features CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the scrolling features strip section</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-200"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ── Section Settings ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            1. Section Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Enable toggle */}
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={!!data.enabled}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                Section Enabled (visible on website)
              </label>
            </div>

            {/* Background color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="backgroundColor"
                  value={data.backgroundColor === 'transparent' ? '#ffffff' : data.backgroundColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  name="backgroundColor"
                  value={data.backgroundColor}
                  onChange={handleChange}
                  placeholder="transparent or #FFFFFF"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Marquee speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marquee Speed (seconds per loop — lower = faster)
              </label>
              <input
                type="number"
                name="marqueeSpeed"
                min={5}
                max={120}
                value={data.marqueeSpeed}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Padding Top */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding Top</label>
              <input
                type="text"
                name="paddingTop"
                value={data.paddingTop}
                onChange={handleChange}
                placeholder="e.g. 60px"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Padding Bottom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding Bottom</label>
              <input
                type="text"
                name="paddingBottom"
                value={data.paddingBottom}
                onChange={handleChange}
                placeholder="e.g. 60px"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Pause on hover */}
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                id="pauseOnHover"
                name="pauseOnHover"
                checked={!!data.pauseOnHover}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="pauseOnHover" className="text-sm font-medium text-gray-700 cursor-pointer">
                Pause Marquee on Hover
              </label>
            </div>
          </div>
        </div>

        {/* ── Feature Items Repeater ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              2. Feature Items ({safeItems.length})
            </h2>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium"
            >
              <Plus className="h-4 w-4" /> Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {safeItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl bg-gray-50 overflow-hidden"
              >
                {/* Card header */}
                <div className="flex justify-between items-center px-5 py-3 bg-white border-b">
                  <span className="text-sm font-semibold text-gray-600">
                    #{index + 1} — {item.title || <span className="text-gray-300 italic">untitled</span>}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === safeItems.length - 1}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() => duplicateItem(index)}
                      className="p-1.5 text-gray-400 hover:text-blue-500"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Enable toggle */}
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`item-enabled-${index}`}
                      checked={item.enabled !== false}
                      onChange={e => handleItemChange(index, "enabled", e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor={`item-enabled-${index}`} className="text-xs font-medium text-gray-500 cursor-pointer">
                      Item Enabled (visible in marquee)
                    </label>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={e => handleItemChange(index, "title", e.target.value)}
                      placeholder="e.g. At-Home Sessions"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Icon URL + Preview */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Icon / Image URL
                    </label>
                    <div className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={item.icon || ""}
                        onChange={e => handleItemChange(index, "icon", e.target.value)}
                        placeholder="Paste Cloudinary image URL"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt="icon preview"
                          className="w-16 h-16 object-contain rounded-lg border bg-white flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Link */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Link (optional)
                    </label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={e => handleItemChange(index, "link", e.target.value)}
                      placeholder="e.g. /services or leave blank"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            {safeItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">
                  No feature items yet. Click "Add Feature" to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
