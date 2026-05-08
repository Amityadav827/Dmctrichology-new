import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2, Layout, FileText, Image as ImageIcon, Star } from 'lucide-react';

const BlogsHomeCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: '',
    heading: '',
    subtitle: '',
    blogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/blogs-home');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch blog section data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/blogs-home', data);
      toast.success('Changes saved and published!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const addBlog = () => {
    setData({
      ...data,
      blogs: [...data.blogs, { title: 'New Blog Entry', author: '', date: '', image: '', authorIcon: '', buttonText: 'Explore More', buttonLink: '#', featured: false }]
    });
  };

  const updateBlog = (index, field, value) => {
    const newBlogs = [...data.blogs];
    newBlogs[index][field] = value;
    setData({ ...data, blogs: newBlogs });
  };

  const removeBlog = (index) => {
    setData({ ...data, blogs: data.blogs.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8">Loading Blog Section Editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Blog Section</h1>
            <p className="text-gray-500">Manage featured blog cards and advice section</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layout size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Section Header</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
              <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle Paragraph</label>
              <textarea value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none min-h-[80px]" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Blog Cards</h2>
            <button onClick={addBlog} className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all">
              <Plus size={18} /> Add Blog Card
            </button>
          </div>

          {data.blogs.map((blog, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-sm border ${blog.featured ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-gray-100'} group relative`}>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={() => updateBlog(index, 'featured', !blog.featured)} 
                  className={`p-2 rounded-lg transition-all ${blog.featured ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                  title="Feature this blog (black background)"
                >
                  <Star size={20} fill={blog.featured ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => removeBlog(index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Image URL</label>
                    <input type="text" value={blog.image} onChange={(e) => updateBlog(index, 'image', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Publish Date</label>
                    <input type="text" value={blog.date} onChange={(e) => updateBlog(index, 'date', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Blog Title</label>
                    <input type="text" value={blog.title} onChange={(e) => updateBlog(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none font-semibold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Author Name</label>
                      <input type="text" value={blog.author} onChange={(e) => updateBlog(index, 'author', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Author Icon URL</label>
                      <input type="text" value={blog.authorIcon} onChange={(e) => updateBlog(index, 'authorIcon', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Button Text</label>
                      <input type="text" value={blog.buttonText} onChange={(e) => updateBlog(index, 'buttonText', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Button Link</label>
                      <input type="text" value={blog.buttonLink} onChange={(e) => updateBlog(index, 'buttonLink', e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsHomeCMS;
