import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Layout, 
  Image as ImageIcon,
  Settings
} from "lucide-react";

export default function BlogHeroCMS() {
  const [data, setData] = useState({
    hero: {
      title: "Blog",
      breadcrumbText: "Blog",
      bannerImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      overlayOpacity: 0.5,
      bannerHeight: "400px",
    },
    listing: {
      sidebarSearchPlaceholder: "Enter Key Word",
      sidebarCategoriesTitle: "Blog Categories",
      sidebarRecentPostsTitle: "Recent Post",
      promoImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      promoLink: "",
      promoButtonText: "Special Offer",
      categories: [
        { name: "Back & Spine Therapy", count: 4 },
        { name: "Sports Injury Rehab", count: 3 },
        { name: "Post-Surgical Recovery", count: 2 },
        { name: "Joint & Muscle Mobilization", count: 3 },
        { name: "Neurological Physiotherapy", count: 2 }
      ],
      recentPosts: [
        { title: "How Physiotherapy Helps You Heal Faster", date: "Mar 06, 2025", image: "" },
        { title: "Best Exercises For Shoulder Pain Relief", date: "Mar 08, 2025", image: "" },
        { title: "Improve Posture With Simple Daily Stretches", date: "Mar 10, 2025", image: "" },
        { title: "Best Exercises For Shoulder Pain Relief", date: "Mar 08, 2025", image: "" }
      ],
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");



  useEffect(() => {
    axios.get("/blog-page")
      .then(res => {
        if (res.data?.data) {
          const fetchedData = res.data.data;
          // Ensure listing exists
          if (!fetchedData.listing) fetchedData.listing = {};
          
          // Hydrate with defaults if fields are missing or empty

          if (!fetchedData.listing.categories || !Array.isArray(fetchedData.listing.categories) || fetchedData.listing.categories.length === 0) {
            fetchedData.listing.categories = [
              { name: "Back & Spine Therapy", count: 4 },
              { name: "Sports Injury Rehab", count: 3 },
              { name: "Post-Surgical Recovery", count: 2 },
              { name: "Joint & Muscle Mobilization", count: 3 },
              { name: "Neurological Physiotherapy", count: 2 }
            ];
          }
          if (!fetchedData.listing.recentPosts || !Array.isArray(fetchedData.listing.recentPosts) || fetchedData.listing.recentPosts.length === 0) {
            fetchedData.listing.recentPosts = [
              { title: "How Physiotherapy Helps You Heal Faster", date: "Mar 06, 2025", image: "" },
              { title: "Best Exercises For Shoulder Pain Relief", date: "Mar 08, 2025", image: "" },
              { title: "Improve Posture With Simple Daily Stretches", date: "Mar 10, 2025", image: "" },
              { title: "Best Exercises For Shoulder Pain Relief", date: "Mar 08, 2025", image: "" }
            ];
          }
          
          setData(fetchedData);
        }
      })
      .catch(() => toast.error("Failed to load blog page data"))
      .finally(() => setLoading(false));
  }, []);

  const updateSectionField = (section, field, val) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: val }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/blog-page", data);
      toast.success("Blog page saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blog Page CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage Hero Banner and Listing section settings</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving Changes..." : "Publish Page Updates"}
        </button>
      </div>

      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 w-fit">
        <button onClick={() => setActiveTab("hero")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hero' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Hero Banner</button>
        <button onClick={() => setActiveTab("listing")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'listing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Listing Section</button>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'hero' && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <Layout size={14} className="text-blue-600" /> Hero Banner Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Image URL</label>
                <div className="flex gap-4">
                  <input type="text" value={data.hero.bannerImage} onChange={e => updateSectionField("hero", "bannerImage", e.target.value)}
                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                  {data.hero.bannerImage && (
                    <img src={data.hero.bannerImage} alt="Preview" className="h-14 w-24 object-cover rounded-xl border border-slate-100 shadow-sm" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Page Title</label>
                <input type="text" value={data.hero.title} onChange={e => updateSectionField("hero", "title", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Breadcrumb Text</label>
                <input type="text" value={data.hero.breadcrumbText} onChange={e => updateSectionField("hero", "breadcrumbText", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Overlay Opacity (0 to 1)</label>
                <input type="number" step="0.1" min="0" max="1" value={data.hero.overlayOpacity || 0.5} onChange={e => updateSectionField("hero", "overlayOpacity", parseFloat(e.target.value))}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Height (e.g. 400px)</label>
                <input type="text" value={data.hero.bannerHeight || "400px"} onChange={e => updateSectionField("hero", "bannerHeight", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listing' && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <Settings size={14} className="text-blue-600" /> Listing Section Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Search Placeholder</label>
                <input type="text" value={data.listing.sidebarSearchPlaceholder} onChange={e => updateSectionField("listing", "sidebarSearchPlaceholder", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Categories Title</label>
                <input type="text" value={data.listing.sidebarCategoriesTitle} onChange={e => updateSectionField("listing", "sidebarCategoriesTitle", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Recent Posts Title</label>
                <input type="text" value={data.listing.sidebarRecentPostsTitle} onChange={e => updateSectionField("listing", "sidebarRecentPostsTitle", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Promo Image URL</label>
                <div className="flex gap-4">
                  <input type="text" value={data.listing.promoImage} onChange={e => updateSectionField("listing", "promoImage", e.target.value)}
                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
                  {data.listing.promoImage && (
                    <img src={data.listing.promoImage} className="h-14 w-24 object-cover rounded-xl border border-slate-100" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Promo Button Text</label>
                <input type="text" value={data.listing.promoButtonText || "Special Offer"} onChange={e => updateSectionField("listing", "promoButtonText", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Promo Link</label>
                <input type="text" value={data.listing.promoLink} onChange={e => updateSectionField("listing", "promoLink", e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all" />
              </div>

              {/* Categories Management */}
              <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Manage Categories</h3>
                  <button type="button" onClick={() => {
                    const newCats = [...(data.listing.categories || [])];
                    newCats.push({ name: "New Category", count: 0 });
                    updateSectionField("listing", "categories", newCats);
                  }} className="text-[10px] font-black text-blue-600 uppercase hover:underline">+ Add Category</button>
                </div>
                <div className="space-y-4">
                  {(data.listing.categories || []).map((cat, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex-1">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Category Name</label>
                        <input type="text" value={cat.name} onChange={e => {
                          const newCats = [...data.listing.categories];
                          newCats[idx].name = e.target.value;
                          updateSectionField("listing", "categories", newCats);
                        }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                      </div>
                      <div className="w-24">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Count</label>
                        <input type="number" value={cat.count} onChange={e => {
                          const newCats = [...data.listing.categories];
                          newCats[idx].count = parseInt(e.target.value);
                          updateSectionField("listing", "categories", newCats);
                        }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                      </div>
                      <button type="button" onClick={() => {
                        const newCats = data.listing.categories.filter((_, i) => i !== idx);
                        updateSectionField("listing", "categories", newCats);
                      }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Posts Management */}
              <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Manage Recent Posts</h3>
                  <button type="button" onClick={() => {
                    const newPosts = [...(data.listing.recentPosts || [])];
                    newPosts.push({ title: "New Post", date: "Mar 10, 2025", image: "" });
                    updateSectionField("listing", "recentPosts", newPosts);
                  }} className="text-[10px] font-black text-blue-600 uppercase hover:underline">+ Add Post</button>
                </div>
                <div className="space-y-4">
                  {(data.listing.recentPosts || []).map((post, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Post Title</label>
                          <input type="text" value={post.title} onChange={e => {
                            const newPosts = [...data.listing.recentPosts];
                            newPosts[idx].title = e.target.value;
                            updateSectionField("listing", "recentPosts", newPosts);
                          }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Date</label>
                          <input type="text" value={post.date} onChange={e => {
                            const newPosts = [...data.listing.recentPosts];
                            newPosts[idx].date = e.target.value;
                            updateSectionField("listing", "recentPosts", newPosts);
                          }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image URL</label>
                          <input type="text" value={post.image} onChange={e => {
                            const newPosts = [...data.listing.recentPosts];
                            newPosts[idx].image = e.target.value;
                            updateSectionField("listing", "recentPosts", newPosts);
                          }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button type="button" onClick={() => {
                          const newPosts = data.listing.recentPosts.filter((_, i) => i !== idx);
                          updateSectionField("listing", "recentPosts", newPosts);
                        }} className="text-[10px] font-black text-red-500 uppercase hover:underline">Remove Post</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        )}
      </div>
    </div>
  );
}
