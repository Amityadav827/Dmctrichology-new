import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import {
  Save,
  Loader2,
  Layout,
  Image as ImageIcon,
  Monitor,
  Settings,
  AlignLeft,
  Columns,
  MessageSquare
} from 'lucide-react';
import SeoMetadataSection from '../../components/cms/SeoMetadataSection';

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

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all';
const textareaCls = 'w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[120px]';

export default function ScienceDmcCMS() {
  const [data, setData] = useState({
    hero: {},
    introSection: {},
    dualFeatureSection: { leftCard: { bullets: [] }, rightCard: { bullets: [] } },
    consultationSection: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/science-dmc');
      if (res.data.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load data');
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
      await axios.put('/science-dmc', data);
      toast.success('Saved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to save');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateNested = (section, nestedObj, field, value) => {
     setData((prev) => ({
       ...prev,
       [section]: {
         ...prev[section],
         [nestedObj]: {
           ...prev[section][nestedObj],
           [field]: value
         }
       }
     }));
  };

  const handleImageUpload = async (e, section, field, nestedObj = null) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      toast.loading('Uploading image...', { id: 'upload' });
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        if (nestedObj) {
           updateNested(section, nestedObj, field, res.data.url);
        } else {
           updateSection(section, field, res.data.url);
        }
        toast.success('Uploaded successfully', { id: 'upload' });
      }
    } catch (err) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  const handleBullets = (section, nestedObj, valStr) => {
      const bullets = valStr.split('\n').filter(b => b.trim() !== '');
      updateNested(section, nestedObj, 'bullets', bullets);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { hero, introSection, dualFeatureSection, consultationSection } = data;

  return (
    <div className="max-w-[1200px] mx-auto pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Science at DMC</h1>
          <p className="text-slate-500 font-medium">Manage content for the Science at DMC Trichology page.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('/cms/visual-builder/science-at-dmc-trichology', '_blank')}
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

      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'hero', icon: Layout, label: 'Hero Banner' },
          { id: 'intro', icon: AlignLeft, label: 'Intro Section' },
          { id: 'dual', icon: Columns, label: 'Dual Features' },
          { id: 'consult', icon: MessageSquare, label: 'Consultation Form' },
          { id: 'seo', icon: Settings, label: 'SEO & Schema' },
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

      {activeTab === 'seo' && (
        <SeoMetadataSection seo={data.seo || {}} onChange={(f, v) => updateSection('seo', f, v)} />
      )}

      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold mb-6">Content</h2>
             <Field label="Main Title"><input type="text" value={hero.title || ''} onChange={e => updateSection('hero', 'title', e.target.value)} className={inputCls} /></Field>
             <Field label="Subtitle / Eyebrow"><input type="text" value={hero.subtitle || ''} onChange={e => updateSection('hero', 'subtitle', e.target.value)} className={inputCls} /></Field>
             <Field label="Breadcrumb Text"><input type="text" value={hero.breadcrumbText || ''} onChange={e => updateSection('hero', 'breadcrumbText', e.target.value)} className={inputCls} /></Field>
             <Field label="CTA Text"><input type="text" value={hero.ctaText || ''} onChange={e => updateSection('hero', 'ctaText', e.target.value)} className={inputCls} /></Field>
             <Field label="CTA Link"><input type="text" value={hero.ctaLink || ''} onChange={e => updateSection('hero', 'ctaLink', e.target.value)} className={inputCls} /></Field>
             <label className="flex items-center gap-2 mt-4 font-bold"><input type="checkbox" checked={hero.isEnabled ?? true} onChange={e => updateSection('hero', 'isEnabled', e.target.checked)} className="w-4 h-4" /> Enable Section</label>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold mb-6">Media & Design</h2>
             <Field label="Background Image">
                 <ImgPreview src={hero.bannerImage} className="w-full h-40 mb-4" />
                 <input type="file" onChange={e => handleImageUpload(e, 'hero', 'bannerImage')} />
             </Field>
             <Field label="Background Color"><input type="color" value={hero.backgroundColor || '#000000'} onChange={e => updateSection('hero', 'backgroundColor', e.target.value)} /></Field>
             <Field label="Overlay Opacity"><input type="range" min="0" max="1" step="0.05" value={hero.overlayOpacity || 0} onChange={e => updateSection('hero', 'overlayOpacity', e.target.value)} className="w-full" /></Field>
          </div>
        </div>
      )}

      {activeTab === 'intro' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <Field label="Heading"><input type="text" value={introSection.heading || ''} onChange={e => updateSection('introSection', 'heading', e.target.value)} className={inputCls} /></Field>
             <Field label="Description"><textarea value={introSection.description || ''} onChange={e => updateSection('introSection', 'description', e.target.value)} className={textareaCls} /></Field>
             <Field label="Background Image (Optional)">
                 <ImgPreview src={introSection.backgroundImage} className="w-full h-40 mb-4" />
                 <input type="file" onChange={e => handleImageUpload(e, 'introSection', 'backgroundImage')} />
             </Field>
             <label className="flex items-center gap-2 mt-4 font-bold"><input type="checkbox" checked={introSection.isEnabled ?? true} onChange={e => updateSection('introSection', 'isEnabled', e.target.checked)} className="w-4 h-4" /> Enable Section</label>
        </div>
      )}

      {activeTab === 'dual' && (
        <div>
          <label className="flex items-center gap-2 mb-6 font-bold bg-white p-4 rounded-xl shadow-sm"><input type="checkbox" checked={dualFeatureSection.isEnabled ?? true} onChange={e => updateSection('dualFeatureSection', 'isEnabled', e.target.checked)} className="w-4 h-4" /> Enable Dual Features Section</label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-6">Left Card</h2>
               <Field label="Title"><input type="text" value={dualFeatureSection.leftCard?.title || ''} onChange={e => updateNested('dualFeatureSection', 'leftCard', 'title', e.target.value)} className={inputCls} /></Field>
               <Field label="Description"><textarea value={dualFeatureSection.leftCard?.description || ''} onChange={e => updateNested('dualFeatureSection', 'leftCard', 'description', e.target.value)} className={textareaCls} /></Field>
               <Field label="Bullets (one per line)">
                  <textarea value={(dualFeatureSection.leftCard?.bullets || []).join('\n')} onChange={e => handleBullets('dualFeatureSection', 'leftCard', e.target.value)} className={textareaCls} />
               </Field>
               <Field label="Image">
                   <ImgPreview src={dualFeatureSection.leftCard?.image} className="w-full h-40 mb-4" />
                   <input type="file" onChange={e => handleImageUpload(e, 'dualFeatureSection', 'image', 'leftCard')} />
               </Field>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-6">Right Card</h2>
               <Field label="Title"><input type="text" value={dualFeatureSection.rightCard?.title || ''} onChange={e => updateNested('dualFeatureSection', 'rightCard', 'title', e.target.value)} className={inputCls} /></Field>
               <Field label="Description"><textarea value={dualFeatureSection.rightCard?.description || ''} onChange={e => updateNested('dualFeatureSection', 'rightCard', 'description', e.target.value)} className={textareaCls} /></Field>
               <Field label="Bullets (one per line)">
                  <textarea value={(dualFeatureSection.rightCard?.bullets || []).join('\n')} onChange={e => handleBullets('dualFeatureSection', 'rightCard', e.target.value)} className={textareaCls} />
               </Field>
               <Field label="Image">
                   <ImgPreview src={dualFeatureSection.rightCard?.image} className="w-full h-40 mb-4" />
                   <input type="file" onChange={e => handleImageUpload(e, 'dualFeatureSection', 'image', 'rightCard')} />
               </Field>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'consult' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <Field label="Title"><input type="text" value={consultationSection.title || ''} onChange={e => updateSection('consultationSection', 'title', e.target.value)} className={inputCls} /></Field>
             <Field label="Timing Text"><input type="text" value={consultationSection.timingText || ''} onChange={e => updateSection('consultationSection', 'timingText', e.target.value)} className={inputCls} /></Field>
             <Field label="Background Color"><input type="color" value={consultationSection.backgroundColor || '#0D0D1A'} onChange={e => updateSection('consultationSection', 'backgroundColor', e.target.value)} /></Field>
             <Field label="Background Image (Optional override)">
                 <ImgPreview src={consultationSection.backgroundImage} className="w-full h-40 mb-4" />
                 <input type="file" onChange={e => handleImageUpload(e, 'consultationSection', 'backgroundImage')} />
             </Field>
             <label className="flex items-center gap-2 mt-4 font-bold"><input type="checkbox" checked={consultationSection.isEnabled ?? true} onChange={e => updateSection('consultationSection', 'isEnabled', e.target.checked)} className="w-4 h-4" /> Enable Section</label>
        </div>
      )}
    </div>
  );
}
