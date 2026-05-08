import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

export default function ServiceHeroCMS() {
  const [hero, setHero] = useState({
    bannerImage: "",
    pageTitle: "",
    breadcrumbText: "",
    overlayOpacity: 0.5,
    bannerHeight: "400px",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await axios.get("/service-page-settings");
      if (data.success && data.data.hero) {
        setHero(data.data.hero);
      }
    } catch (error) {
      toast.error("Failed to load hero settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHero((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put("/service-page-settings", { hero });
      if (data.success) {
        toast.success("Hero banner updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update hero banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Service Page Hero CMS</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
            <div className="flex gap-4">
              <input
                type="text"
                name="bannerImage"
                value={hero.bannerImage}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {hero.bannerImage && (
                <img src={hero.bannerImage} alt="Preview" className="h-10 w-16 object-cover rounded border" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input
              type="text"
              name="pageTitle"
              value={hero.pageTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breadcrumb Text</label>
            <input
              type="text"
              name="breadcrumbText"
              value={hero.breadcrumbText}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity (0 to 1)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              name="overlayOpacity"
              value={hero.overlayOpacity}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Height (e.g. 400px)</label>
            <input
              type="text"
              name="bannerHeight"
              value={hero.bannerHeight}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
