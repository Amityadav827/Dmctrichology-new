import React, { useState, useEffect } from "react";
import axios from "../api/client";
import toast from "react-hot-toast";
import { Upload, Save, Loader2, BarChart2, Code2, Search } from "lucide-react";

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    websiteName: "",
    logo: "",
    favicon: "",
    phone1: "",
    phone2: "",
    email: "",
    address: "",
    primaryColor: "#C19A5B",
    secondaryColor: "#000000",
    appointmentButtonText: "",
    socialLinks: { facebook: "", instagram: "", youtube: "", linkedin: "" },
    footerCopyright: "",
    patientCount: "",
    ratingStars: 5,
    ratingText: "",
    siteTitle: "",
    defaultMetaDescription: "",
    defaultOgImage: "",
    ga4Id: "",
    gtmId: "",
    metaPixelId: "",
    headScripts: "",
    bodyStartScripts: "",
  });

  const [files, setFiles] = useState({ logo: null, favicon: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/site-settings");
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in settings.socialLinks) {
      setSettings((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, field) => {
    if (e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();

    Object.keys(settings).forEach((key) => {
      if (key === "socialLinks") {
        formData.append(key, JSON.stringify(settings[key]));
      } else {
        formData.append(key, settings[key] || "");
      }
    });

    if (files.logo) formData.append("logo", files.logo);
    if (files.favicon) formData.append("favicon", files.favicon);

    try {
      const { data } = await axios.put("/site-settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Settings updated successfully");
        setSettings(data.data);
        setFiles({ logo: null, favicon: null });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Website Settings</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Branding */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">1. Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
              <input
                type="text"
                name="websiteName"
                value={settings.websiteName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Button Text</label>
              <input
                type="text"
                name="appointmentButtonText"
                value={settings.appointmentButtonText}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="flex items-center gap-4">
                {settings.logo && (
                  <img src={settings.logo} alt="Logo" className="h-12 object-contain bg-gray-50 p-1 rounded border" />
                )}
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{files.logo ? files.logo.name : "Upload new logo"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
              <div className="flex items-center gap-4">
                {settings.favicon && (
                  <img src={settings.favicon} alt="Favicon" className="h-8 w-8 object-contain bg-gray-50 p-1 rounded border" />
                )}
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "favicon")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{files.favicon ? files.favicon.name : "Upload new favicon"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">2. Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label>
              <input type="text" name="phone1" value={settings.phone1} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
              <input type="text" name="phone2" value={settings.phone2} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">3. Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} className="h-10 w-10 p-1 border rounded" />
                <input type="text" name="primaryColor" value={settings.primaryColor} onChange={handleChange} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input type="color" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} className="h-10 w-10 p-1 border rounded" />
                <input type="text" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">4. Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["facebook", "instagram", "youtube", "linkedin"].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                <input
                  type="url"
                  name={platform}
                  value={settings.socialLinks[platform] || ""}
                  onChange={handleChange}
                  placeholder={`https://${platform}.com/...`}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">5. Footer Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright Text</label>
            <input type="text" name="footerCopyright" value={settings.footerCopyright} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Homepage Hero Callback Form Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">6. Homepage Hero Callback Form Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Count Text</label>
              <input
                type="text"
                name="patientCount"
                value={settings.patientCount}
                onChange={handleChange}
                placeholder="e.g. 225+ Patients"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating Stars Number</label>
              <input
                type="number"
                name="ratingStars"
                min="1"
                max="10"
                value={settings.ratingStars}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating Text (Alternative)</label>
              <input
                type="text"
                name="ratingText"
                value={settings.ratingText}
                onChange={handleChange}
                placeholder="e.g. ★★★★★"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" /> 7. SEO Defaults
          </h2>
          <p className="text-xs text-gray-400 mb-4 pb-2 border-b">Used as fallback on pages that don't have custom meta tags.</p>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Site Title</label>
              <input
                type="text"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                placeholder="DMC Trichology | Best Hair Transplant Clinic In Delhi"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Shown in browser tab and Google search results.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Description</label>
              <textarea
                name="defaultMetaDescription"
                value={settings.defaultMetaDescription}
                onChange={handleChange}
                rows="2"
                placeholder="Experience The Art Of Natural Hair Restoration at DMC Trichology."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Shown below the title in Google results. Keep under 160 characters.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default OG Image URL</label>
              <input
                type="url"
                name="defaultOgImage"
                value={settings.defaultOgImage}
                onChange={handleChange}
                placeholder="https://yoursite.com/og-default.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Image shown when the site is shared on WhatsApp, Facebook, Twitter etc.</p>
            </div>
          </div>
        </div>

        {/* Tracking & Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-green-500" /> 8. Tracking & Analytics
          </h2>
          <p className="text-xs text-gray-400 mb-4 pb-2 border-b">Enter your IDs — scripts will be auto-injected on every page of the website.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics 4 (GA4)</label>
              <input
                type="text"
                name="ga4Id"
                value={settings.ga4Id}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Measurement ID from Google Analytics.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager (GTM)</label>
              <input
                type="text"
                name="gtmId"
                value={settings.gtmId}
                onChange={handleChange}
                placeholder="GTM-XXXXXXX"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Container ID from GTM workspace.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel (Facebook)</label>
              <input
                type="text"
                name="metaPixelId"
                value={settings.metaPixelId}
                onChange={handleChange}
                placeholder="123456789012345"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Pixel ID from Meta Events Manager.</p>
            </div>
          </div>
        </div>

        {/* Custom Scripts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-purple-500" /> 9. Custom Scripts
          </h2>
          <p className="text-xs text-gray-400 mb-4 pb-2 border-b">Paste raw HTML/script tags. These are injected as-is — handle with care.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Head Scripts</label>
              <textarea
                name="headScripts"
                value={settings.headScripts}
                onChange={handleChange}
                rows="6"
                placeholder={'<!-- Paste <script> or <link> tags here -->\n<!-- Injected inside <head> on every page -->'}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs resize-none bg-gray-50"
              />
              <p className="text-xs text-gray-400 mt-1">e.g. Hotjar, Clarity, Tawk.to, custom fonts.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Scripts</label>
              <textarea
                name="bodyStartScripts"
                value={settings.bodyStartScripts}
                onChange={handleChange}
                rows="6"
                placeholder={'<!-- Paste scripts here -->\n<!-- Injected right after <body> opens -->'}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs resize-none bg-gray-50"
              />
              <p className="text-xs text-gray-400 mt-1">e.g. GTM noscript fallback, live chat widgets.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
