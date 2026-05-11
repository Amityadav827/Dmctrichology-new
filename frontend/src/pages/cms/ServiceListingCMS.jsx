import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, Save, X, Loader2, Star, Clock, ArrowLeft } from "lucide-react";

export default function ServiceListingCMS() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState({
    title: "",
    slug: "",
    image: "",
    rating: 4.8,
    duration: "45-60 mins",
    shortDescription: "",
    category: "",
    buttonText: "View Details",
    buttonLink: "/contact",
    featured: false,
    status: "Published",
    sortOrder: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        axios.get("/service-listing-cards"),
        axios.get("/service-listing-categories")
      ]);
      setServices(sRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setCurrentService(s);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service card?")) return;
    try {
      await axios.delete(`/service-listing-cards/${id}`);
      toast.success("Service deleted");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentService._id) {
        await axios.put(`/service-listing-cards/${currentService._id}`, currentService);
        toast.success("Service updated successfully");
      } else {
        await axios.post("/service-listing-cards", currentService);
        toast.success("Service created successfully");
      }
      setIsEditing(false);
      setCurrentService({ title: "", slug: "", image: "", rating: 4.8, duration: "45-60 mins", shortDescription: "", category: categories[0]?.slug || "", buttonText: "View Details", buttonLink: "/contact", featured: false, status: "Published", sortOrder: 0 });
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const openNewForm = () => {
    setCurrentService({ title: "", slug: "", image: "", rating: 4.8, duration: "45-60 mins", shortDescription: "", category: categories[0]?.slug || "", buttonText: "View Details", buttonLink: "/contact", featured: false, status: "Published", sortOrder: 0 });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ─── Page Header ─── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Service Listing Cards</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">{services.length} services published</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 shadow-lg transition-all font-bold text-sm"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* ─── Edit / Create Form ─── */}
      {isEditing && (
        <div className="mb-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-800">
                {currentService._id ? "Edit Service Card" : "Create New Service Card"}
              </h2>
            </div>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Service Title *
              </label>
              <input
                type="text"
                value={currentService.title}
                onChange={(e) => setCurrentService({
                  ...currentService,
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="e.g. FUE Hair Transplant"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Category
              </label>
              <select
                value={currentService.category}
                onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">— Select Category —</option>
                {categories.map(c => (
                  <option key={c._id} value={c.slug}>{c.categoryName}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Image URL (Cloudinary / Supabase)
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="text"
                  value={currentService.image}
                  onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Paste Cloudinary/Supabase image URL..."
                />
                {currentService.image && (
                  <img
                    src={currentService.image}
                    alt="preview"
                    className="w-20 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                  />
                )}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Rating (0–5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={currentService.rating}
                onChange={(e) => setCurrentService({ ...currentService, rating: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Duration
              </label>
              <input
                type="text"
                value={currentService.duration}
                onChange={(e) => setCurrentService({ ...currentService, duration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
                placeholder="e.g. 45-60 mins"
              />
            </div>

            {/* Featured */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Featured?
              </label>
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentService({ ...currentService, featured: !currentService.featured })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentService.featured ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${currentService.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-bold text-gray-600">
                  {currentService.featured ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Short Description
              </label>
              <textarea
                value={currentService.shortDescription}
                onChange={(e) => setCurrentService({ ...currentService, shortDescription: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] text-sm resize-none"
                placeholder="Write a compelling overview of the service... (2-3 sentences recommended)"
              />
            </div>

            {/* Button Text + Link */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                CTA Button Text
              </label>
              <input
                type="text"
                value={currentService.buttonText}
                onChange={(e) => setCurrentService({ ...currentService, buttonText: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
                placeholder="e.g. View Details"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                CTA Button Link
              </label>
              <input
                type="text"
                value={currentService.buttonLink}
                onChange={(e) => setCurrentService({ ...currentService, buttonLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
                placeholder="e.g. /contact or /services/fue"
              />
            </div>

            {/* Form Actions */}
            <div className="md:col-span-3 flex justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 bg-gray-50 text-gray-500 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-3 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-700 shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={14} />
                {currentService._id ? "Update Service" : "Create Service"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ─── Services Grid ─── */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-700 mb-2 tracking-tight">No Services Yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">
            Create your first service card. It will automatically appear in the Services Grid on the website.
          </p>
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all"
          >
            <Plus size={14} /> Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {services.map((s) => (
            <div
              key={s._id}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-[220px] overflow-hidden bg-gray-100">
                {s.image ? (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-300 text-xs uppercase font-bold tracking-widest">No Image</span>
                  </div>
                )}

                {/* Category Badge */}
                {s.category && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] text-gray-800 shadow-md">
                    {categories.find(c => c.slug === s.category)?.categoryName || s.category}
                  </div>
                )}

                {/* Featured Badge */}
                {s.featured && (
                  <div className="absolute top-4 right-4 bg-amber-400 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow">
                    Featured
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-all"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <Star size={11} fill="#D4AF37" color="#D4AF37" />
                    {s.rating || "4.8"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={11} />
                    {s.duration || "45 mins"}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-black text-gray-900 text-base mb-2 tracking-tight leading-tight" style={{ fontFamily: "'Marcellus', serif" }}>
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {s.shortDescription || <em className="text-gray-300">No description</em>}
                </p>

                {/* CTA Row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-900">
                    {s.buttonText || "View Details"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all text-gray-400"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-gray-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
