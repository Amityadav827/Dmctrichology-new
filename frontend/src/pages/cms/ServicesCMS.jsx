import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function ServicesCMS() {
  const [data, setData] = useState({
    subtitle: "",
    title: "",
    viewAllText: "",
    viewAllLink: "",
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: res } = await axios.get("/services");
      if (res.success && res.data) {
        // Normalize: always ensure services is an array
        setData({
          ...res.data,
          services: Array.isArray(res.data.services) ? res.data.services : []
        });
      }
    } catch (error) {
      toast.error("Failed to load Services settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const current = Array.isArray(data.services) ? data.services : [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, services: updated });
  };

  const addService = () => {
    const current = Array.isArray(data.services) ? data.services : [];
    setData({
      ...data,
      services: [...current, { title: "", image: "", link: "#" }],
    });
  };

  const removeService = (index) => {
    const current = Array.isArray(data.services) ? data.services : [];
    const updated = current.filter((_, i) => i !== index);
    setData({ ...data, services: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const safeServices = Array.isArray(data.services) ? data.services : [];
      const payload = {
        subtitle: data.subtitle,
        title: data.title,
        viewAllText: data.viewAllText,
        viewAllLink: data.viewAllLink,
        services: safeServices,
      };
      const { data: res } = await axios.put("/services", payload);
      if (res.success) {
        toast.success("Services section saved successfully");
        // Normalize on response too
        setData({
          ...res.data,
          services: Array.isArray(res.data.services) ? res.data.services : []
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update Services");
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Manage "Our Hair Transplant Services" section</p>
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
        {/* Section Header Fields */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            1. Section Header
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Text (Subtitle)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Title
              </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  View All Text
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  View All Link
                </label>
                <input
                  type="text"
                  name="viewAllLink"
                  value={data.viewAllLink}
                  onChange={handleChange}
                  placeholder="e.g. /services"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards Repeater */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              2. Service Cards (Repeater)
            </h2>
            <button
              onClick={addService}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" /> Add Service
            </button>
          </div>

          <div className="space-y-6">
            {(Array.isArray(data.services) ? data.services : []).map((service, index) => (
              <div key={index} className="border p-6 rounded-xl bg-gray-50 relative group">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-600">
                    Service #{index + 1}
                  </span>
                  <button
                    onClick={() => removeService(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                      placeholder="e.g. Follicular Unit Extraction (FUE)"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Image URL (Cloudinary)
                    </label>
                    <div className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={service.image}
                        onChange={(e) => handleServiceChange(index, "image", e.target.value)}
                        placeholder="Paste Cloudinary image URL"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      {service.image ? (
                        <img
                          src={service.image}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
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
                      Service Link / URL
                    </label>
                    <input
                      type="text"
                      value={service.link}
                      onChange={(e) => handleServiceChange(index, "link", e.target.value)}
                      placeholder="e.g. /services/fue"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            {(!Array.isArray(data.services) || data.services.length === 0) && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">
                  No services yet. Click "Add Service" to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
