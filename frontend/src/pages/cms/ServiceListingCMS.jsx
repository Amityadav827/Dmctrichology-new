import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, Loader2, Star, Clock, FileText } from "lucide-react";

export default function ServiceListingCMS() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Services</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">{services.length} services • Mark as Featured to show on home page slider</p>
        </div>
        <button
          onClick={() => navigate('/cms/service-details')}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 shadow-lg transition-all font-bold text-sm"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* ─── Services Grid ─── */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-700 mb-2 tracking-tight">No Services Yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">
            Create your first service. It will appear on the Services listing page and, if marked Featured, on the home page slider too.
          </p>
          <button
            onClick={() => navigate('/cms/service-details')}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all"
          >
            <Plus size={14} /> Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {services.map((s) => (
            <div
              key={s.id || s._id}
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => navigate(`/cms/service-details?service=${encodeURIComponent(s.slug)}`)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all"
                  >
                    <FileText size={13} /> Edit Page
                  </button>
                  <button
                    onClick={() => navigate(`/cms/service-details?service=${encodeURIComponent(s.slug)}`)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-all"
                  >
                    <Edit2 size={13} /> Card Info
                  </button>
                  <button
                    onClick={() => handleDelete(s.id || s._id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={13} /> Delete
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

                {/* Permalink */}
                {s.slug && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-gray-400 font-mono truncate">/details/{s.slug}</span>
                  </div>
                )}

                {/* Actions row */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/cms/service-details?service=${encodeURIComponent(s.slug)}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-100 transition-all"
                  >
                    <FileText size={13} /> Edit Page Content
                  </button>
                  <button
                    onClick={() => navigate(`/cms/service-details?service=${encodeURIComponent(s.slug)}`)}
                    className="p-2 bg-gray-50 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all text-gray-400"
                    title="Edit card info"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id || s._id)}
                    className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-gray-400"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
