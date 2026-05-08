import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, Save, X, Loader2, Star, Clock } from "lucide-react";

export default function ServiceListingCMS() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState({
    title: "",
    slug: "",
    image: "",
    rating: 5,
    duration: "45-60 mins",
    shortDescription: "",
    category: "",
    buttonText: "Book Now",
    buttonLink: "/book-appointment",
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
      setServices(sRes.data.data);
      setCategories(cRes.data.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setCurrentService(s);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
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
        toast.success("Service updated");
      } else {
        await axios.post("/service-listing-cards", currentService);
        toast.success("Service created");
      }
      setIsEditing(false);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Service Listing Cards</h1>
        <button 
          onClick={() => { setIsEditing(true); setCurrentService({ title: "", slug: "", image: "", rating: 5, duration: "45-60 mins", shortDescription: "", category: categories[0]?.slug || "", buttonText: "Book Now", buttonLink: "/book-appointment", featured: false, status: "Published", sortOrder: 0 }); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold"
        >
          <Plus size={18} /> Create New Service
        </button>
      </div>

      {isEditing && (
        <div className="mb-10 bg-white p-8 rounded-3xl border border-blue-100 shadow-xl animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">{currentService._id ? "Edit Service" : "Add Service"}</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Service Title</label>
              <input 
                type="text" 
                value={currentService.title} 
                onChange={(e) => setCurrentService({...currentService, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Laser Hair Removal"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Category</label>
              <select 
                value={currentService.category}
                onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map(c => <option key={c._id} value={c.slug}>{c.categoryName}</option>)}
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Image URL</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={currentService.image}
                  onChange={(e) => setCurrentService({...currentService, image: e.target.value})}
                  className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Cloudinary image URL"
                />
                {currentService.image && <img src={currentService.image} alt="" className="w-16 h-10 object-cover rounded-lg border" />}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Rating</label>
              <input type="number" step="0.1" value={currentService.rating} onChange={(e) => setCurrentService({...currentService, rating: e.target.value})} className="w-full px-4 py-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Duration</label>
              <input type="text" value={currentService.duration} onChange={(e) => setCurrentService({...currentService, duration: e.target.value})} className="w-full px-4 py-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Featured?</label>
              <div className="flex items-center gap-2 pt-3">
                <input type="checkbox" checked={currentService.featured} onChange={(e) => setCurrentService({...currentService, featured: e.target.checked})} className="w-5 h-5 rounded" />
                <span className="text-sm font-bold text-gray-600">Yes, highlight this service</span>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Short Description</label>
              <textarea 
                value={currentService.shortDescription}
                onChange={(e) => setCurrentService({...currentService, shortDescription: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                placeholder="Write a brief overview of the service..."
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 border-t pt-6">
              <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-gray-50 text-gray-500 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Cancel</button>
              <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <Save size={14} /> Save Service Data
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s._id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
            <div className="h-48 overflow-hidden relative">
              <img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                <button onClick={() => handleEdit(s)} className="p-2 bg-white rounded-lg text-blue-600 shadow-xl hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id)} className="p-2 bg-white rounded-lg text-red-600 shadow-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s.category}</span>
                {s.featured && <span className="text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{s.shortDescription}</p>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {s.rating}</div>
                <div className="flex items-center gap-1"><Clock size={12} /> {s.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
