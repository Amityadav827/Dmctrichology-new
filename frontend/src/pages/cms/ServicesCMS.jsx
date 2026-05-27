import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

export default function ServicesCMS() {
  const [data, setData] = useState({
    subtitle: "",
    title: "",
    viewAllText: "",
    viewAllLink: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/services").then(({ data: res }) => {
      if (res.success && res.data) {
        setData({
          subtitle: res.data.subtitle || "",
          title: res.data.title || "",
          viewAllText: res.data.viewAllText || "",
          viewAllLink: res.data.viewAllLink || "",
        });
      }
    }).catch(() => {
      toast.error("Failed to load Services section settings");
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/services", data);
      if (res.success) {
        toast.success("Services section saved");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services Slider CMS</h1>
          <p className="text-sm text-gray-500 mt-1">
            Heading for the home page services slider. Service cards are managed in{" "}
            <a href="/cms/service-listing" className="text-blue-600 underline">Service Listing</a>
            {" "}— mark cards as <strong>Featured</strong> to show them here.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b">Section Heading</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text (Subtitle)</label>
          <input
            type="text"
            name="subtitle"
            value={data.subtitle}
            onChange={handleChange}
            placeholder="e.g. SERVICES"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="e.g. Our Hair Transplant Services"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View All Text</label>
            <input
              type="text"
              name="viewAllText"
              value={data.viewAllText}
              onChange={handleChange}
              placeholder="e.g. View All"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View All Link</label>
            <input
              type="text"
              name="viewAllLink"
              value={data.viewAllLink}
              onChange={handleChange}
              placeholder="e.g. /service"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
