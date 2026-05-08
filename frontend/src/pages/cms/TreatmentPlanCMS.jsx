import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2, Layout, FileText, Image as ImageIcon } from 'lucide-react';

const TreatmentPlanCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: '',
    heading: '',
    cards: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/treatment-plan');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch treatment plan data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/treatment-plan', data);
      toast.success('Changes saved and published!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const addCard = () => {
    setData({
      ...data,
      cards: [...data.cards, { title: 'New Treatment', description: '', image: '', buttonText: 'TAKE THE TEST', buttonLink: '#' }]
    });
  };

  const updateCard = (index, field, value) => {
    const newCards = [...data.cards];
    newCards[index][field] = value;
    setData({ ...data, cards: newCards });
  };

  const removeCard = (index) => {
    setData({ ...data, cards: data.cards.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8">Loading Treatment Plan Editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treatment Plan Editor</h1>
            <p className="text-gray-500">Manage treatment cards and section info</p>
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
              <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Treatment Cards</h2>
            <button onClick={addCard} className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all">
              <Plus size={18} /> Add Card
            </button>
          </div>

          {data.cards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 group relative">
              <button onClick={() => removeCard(index)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" value={card.title} onChange={(e) => updateCard(index, 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea value={card.description} onChange={(e) => updateCard(index, 'description', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none min-h-[100px]" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input type="text" value={card.image} onChange={(e) => updateCard(index, 'image', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                      <input type="text" value={card.buttonText} onChange={(e) => updateCard(index, 'buttonText', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                      <input type="text" value={card.buttonLink} onChange={(e) => updateCard(index, 'buttonLink', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
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

export default TreatmentPlanCMS;
