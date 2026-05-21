import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import {
  Save,
  Loader2,
  Layout,
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Settings,
  Users,
  Video,
  Link as LinkIcon
} from 'lucide-react';

// ─── Image preview helper ──────────────────────────────────────────────────────
const ImgPreview = ({ src, className = '' }) => {
  if (!src) return null;
  return (
    <img
      src={src}
      alt="Preview"
      className={`object-cover rounded-xl border border-slate-100 shadow-sm ${className}`}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
};

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 mt-1 italic">{hint}</p>}
  </div>
);

const inputCls =
  'w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all';

// ─── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_HERO = {
  title: 'Influencers',
  breadcrumbText: 'Influencers',
  backgroundColor: '#3b5998',
  overlayOpacity: 0.55,
  bannerHeight: '420px',
  bannerImage: '',
  ctaText: 'Watch Stories',
  ctaLink: '#influencer-showcase',
};

const DEFAULT_CARD = {
  id: '',
  videoUrl: '',
  autoplay: false,
  muted: true,
  loop: true,
  isVisible: true,
  order: 0,
};

export default function InfluencerCMS() {
  const [data, setData] = useState({ hero: { ...DEFAULT_HERO }, influencerCards: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/influencers');
      if (res.data.success) {
        setData({
          hero: { ...DEFAULT_HERO, ...(res.data.data.hero || {}) },
          influencerCards: Array.isArray(res.data.data.influencerCards) ? res.data.data.influencerCards : [],
        });
      }
    } catch (err) {
      toast.error('Failed to load Influencers data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        hero: data.hero,
        influencerCards: data.influencerCards.map((c, i) => ({ ...c, order: i })),
      };
      await axios.put('/influencers', payload);
      toast.success('Saved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to save');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ─── Hero handlers ───────────────────────────────────────────────────────────
  const updateHero = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      toast.loading('Uploading banner...', { id: 'upload' });
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        updateHero('bannerImage', res.data.url);
        toast.success('Uploaded successfully', { id: 'upload' });
      }
    } catch (err) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  // ─── Card handlers ───────────────────────────────────────────────────────────
  const addCard = () => {
    setData((prev) => ({
      ...prev,
      influencerCards: [
        ...prev.influencerCards,
        { ...DEFAULT_CARD, id: Date.now().toString(), order: prev.influencerCards.length },
      ],
    }));
  };

  const updateCard = (index, field, value) => {
    setData((prev) => {
      const newCards = [...prev.influencerCards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, influencerCards: newCards };
    });
  };

  const removeCard = (index) => {
    if (!window.confirm('Delete this card?')) return;
    setData((prev) => {
      const newCards = prev.influencerCards.filter((_, i) => i !== index);
      return { ...prev, influencerCards: newCards };
    });
  };

  const moveCard = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === data.influencerCards.length - 1)) return;
    setData((prev) => {
      const newCards = [...prev.influencerCards];
      const temp = newCards[index];
      newCards[index] = newCards[index + direction];
      newCards[index + direction] = temp;
      return { ...prev, influencerCards: newCards };
    });
  };

  const handleCardVideoUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('video', file);
    try {
      toast.loading('Uploading video...', { id: 'upload-video' });
      const res = await axios.post('/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        updateCard(index, 'videoUrl', res.data.url);
        toast.success('Uploaded successfully', { id: 'upload-video' });
      }
    } catch (err) {
      toast.error('Upload failed or endpoint not ready. Using direct URL instead.', { id: 'upload-video' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-24 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Influencers Page</h1>
          <p className="text-slate-500 font-medium">Manage influencer reel cards (Supports Video Uploads, YouTube & Vimeo).</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('/cms/visual-builder/influencers', '_blank')}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Monitor size={18} />
            Visual Builder
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Publish Live'}
          </button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex items-center gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'hero', icon: Layout, label: 'Hero Banner' },
          { id: 'cards', icon: Users, label: 'Influencer Reels' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Hero Tab ─── */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Layout size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Content</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Field label="Main Title">
                  <input
                    type="text"
                    value={data.hero.title}
                    onChange={(e) => updateHero('title', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Breadcrumb Text">
                  <input
                    type="text"
                    value={data.hero.breadcrumbText}
                    onChange={(e) => updateHero('breadcrumbText', e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <ImageIcon size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Background Media</h2>
              </div>
              <Field label="Banner Background Image">
                <div className="space-y-4">
                  <ImgPreview src={data.hero.bannerImage} className="w-full h-48 object-cover rounded-2xl" />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={data.hero.bannerImage}
                      onChange={(e) => updateHero('bannerImage', e.target.value)}
                      placeholder="Image URL"
                      className={`${inputCls} flex-1`}
                    />
                    <label className="flex items-center justify-center px-6 bg-slate-900 text-white rounded-2xl cursor-pointer hover:bg-slate-800 transition-colors font-bold text-sm shrink-0">
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
                    </label>
                  </div>
                </div>
              </Field>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Settings size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Design</h2>
              </div>
              <div className="space-y-6">
                <Field label="Banner Height">
                  <input
                    type="text"
                    value={data.hero.bannerHeight}
                    onChange={(e) => updateHero('bannerHeight', e.target.value)}
                    className={inputCls}
                    placeholder="e.g., 420px"
                  />
                </Field>
                <Field label="Background Color (Theme)">
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={data.hero.backgroundColor}
                      onChange={(e) => updateHero('backgroundColor', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={data.hero.backgroundColor}
                      onChange={(e) => updateHero('backgroundColor', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </Field>
                <Field label={`Overlay Opacity: ${data.hero.overlayOpacity}`}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={data.hero.overlayOpacity}
                    onChange={(e) => updateHero('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Cards Section ─── */}
      {activeTab === 'cards' && (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Influencer Cards</h2>
            <p className="text-slate-500 font-medium mt-1">Add vertical video reels and captions.</p>
          </div>
          <button
            onClick={addCard}
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Plus size={18} /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.influencerCards.map((card, index) => (
            <div
              key={card.id || index}
              className={`bg-white p-6 rounded-3xl shadow-sm border transition-all ${
                card.isVisible ? 'border-slate-200' : 'border-slate-200 opacity-60 grayscale-[0.5]'
              }`}
            >
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {index + 1}
                  </div>
                  <span className="font-bold text-slate-700">Card</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCard(index, 'isVisible', !card.isVisible)}
                    className={`p-2 rounded-lg transition-colors ${
                      card.isVisible ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Toggle Visibility"
                  >
                    {card.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-2"></div>
                  <button
                    onClick={() => moveCard(index, -1)}
                    disabled={index === 0}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    onClick={() => moveCard(index, 1)}
                    disabled={index === data.influencerCards.length - 1}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-2"></div>
                  <button
                    onClick={() => removeCard(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                
                <Field label="Media URL (Upload .mp4 OR Paste YouTube/Vimeo/IG Link)">
                  <div className="flex gap-2">
                      <input
                        type="text"
                        value={card.videoUrl}
                        onChange={(e) => updateCard(index, 'videoUrl', e.target.value)}
                        placeholder="Direct URL or YouTube/Vimeo Link"
                        className={`${inputCls} flex-1`}
                      />
                      <label className="flex items-center justify-center px-4 bg-slate-100 text-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors font-bold text-sm shrink-0">
                        <Video size={16} className="mr-2"/> Upload
                        <input type="file" className="hidden" accept="video/mp4,video/webm" onChange={(e) => handleCardVideoUpload(e, index)} />
                      </label>
                  </div>
                </Field>

                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={card.autoplay} 
                            onChange={(e) => updateCard(index, 'autoplay', e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                        /> Autoplay
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={card.muted} 
                            onChange={(e) => updateCard(index, 'muted', e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                        /> Muted
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={card.loop} 
                            onChange={(e) => updateCard(index, 'loop', e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                        /> Loop
                    </label>
                </div>

              </div>
            </div>
          ))}
          {data.influencerCards.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No influencer cards yet</h3>
              <p className="text-slate-500 mb-6">Add cards to showcase your digital creator collaborations.</p>
              <button
                onClick={addCard}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} /> Add First Card
              </button>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
