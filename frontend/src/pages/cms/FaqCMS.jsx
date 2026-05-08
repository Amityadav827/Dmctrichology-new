import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2, Layout, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FaqCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: '',
    heading: '',
    categories: [],
    buttonText: '',
    buttonLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/home-faq');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch FAQ data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/home-faq', data);
      toast.success('Changes saved and published!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const addCategory = () => {
    setData({
      ...data,
      categories: [...data.categories, { title: 'New Category', faqs: [] }]
    });
  };

  const updateCategory = (index, field, value) => {
    const newCats = [...data.categories];
    newCats[index][field] = value;
    setData({ ...data, categories: newCats });
  };

  const removeCategory = (index) => {
    setData({ ...data, categories: data.categories.filter((_, i) => i !== index) });
  };

  const addFaq = (catIndex) => {
    const newCats = [...data.categories];
    newCats[catIndex].faqs = [...newCats[catIndex].faqs, { question: 'New Question', answer: '', icon: '' }];
    setData({ ...data, categories: newCats });
  };

  const updateFaq = (catIndex, faqIndex, field, value) => {
    const newCats = [...data.categories];
    newCats[catIndex].faqs[faqIndex][field] = value;
    setData({ ...data, categories: newCats });
  };

  const removeFaq = (catIndex, faqIndex) => {
    const newCats = [...data.categories];
    newCats[catIndex].faqs = newCats[catIndex].faqs.filter((_, i) => i !== faqIndex);
    setData({ ...data, categories: newCats });
  };

  if (loading) return <div className="p-8">Loading FAQ Editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage FAQ Editor</h1>
            <p className="text-gray-500">Manage categories and accordion questions</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Global Info</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
              <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input type="text" value={data.buttonText} onChange={(e) => setData({ ...data, buttonText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
              <input type="text" value={data.buttonLink} onChange={(e) => setData({ ...data, buttonLink: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Categories & FAQs</h2>
            <button onClick={addCategory} className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all">
              <Plus size={18} /> Add Category
            </button>
          </div>

          {data.categories.map((cat, catIndex) => (
            <div key={catIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                className="p-6 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-gray-100 hover:bg-slate-100 transition-all"
                onClick={() => setExpandedCat(expandedCat === catIndex ? null : catIndex)}
              >
                <div className="flex items-center gap-4 flex-1 mr-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><HelpCircle size={20} /></div>
                  <input 
                    type="text" 
                    value={cat.title} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateCategory(catIndex, 'title', e.target.value)} 
                    className="bg-transparent border-b border-transparent focus:border-indigo-600 outline-none font-bold text-gray-800 text-lg w-full max-w-md"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); removeCategory(catIndex); }} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={20} /></button>
                  {expandedCat === catIndex ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {expandedCat === catIndex && (
                <div className="p-8 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">FAQs in this Category</h4>
                    <button onClick={() => addFaq(catIndex)} className="text-xs font-bold text-indigo-600">+ Add Question</button>
                  </div>
                  {cat.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 group relative">
                      <button onClick={() => removeFaq(catIndex, faqIndex)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                           <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Question</label>
                           <input type="text" value={faq.question} onChange={(e) => updateFaq(catIndex, faqIndex, 'question', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Answer</label>
                           <textarea value={faq.answer} onChange={(e) => updateFaq(catIndex, faqIndex, 'answer', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none min-h-[80px]" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Icon URL</label>
                           <input type="text" value={faq.icon} onChange={(e) => updateFaq(catIndex, faqIndex, 'icon', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqCMS;
