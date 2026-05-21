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
  ExternalLink,
  Settings,
  Layers,
  Monitor,
  Star,
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
  title: 'Press & Media',
  breadcrumbText: 'Press & Media',
  backgroundColor: '#3b5998',
  overlayOpacity: 0.55,
  bannerHeight: '420px',
  bannerImage: '',
};

const DEFAULT_CARD = {
  id: '',
  mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
  mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
  mediaTitle: '',
  mediaLink: '#',
  isVisible: true,
  order: 0,
};

// ─── Main component ────────────────────────────────────────────────────────────
export default function PressMediaCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [expandedCard, setExpandedCard] = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get('/press-media');
        if (res.success) {
          const d = res.data;
          // Ensure hero exists
          if (!d.hero) d.hero = { ...DEFAULT_HERO };
          // Ensure mediaCards exists
          if (!d.mediaCards) d.mediaCards = [];
          setData(d);
        }
      } catch {
        toast.error('Failed to load Press & Media data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/press-media', data);
      toast.success('Press & Media page saved!');
    } catch {
      toast.error('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Hero field update ─────────────────────────────────────────────────────────
  const updateHero = useCallback((field, value) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  }, []);

  // ── Card helpers ─────────────────────────────────────────────────────────────
  const addCard = () => {
    const newCard = {
      ...DEFAULT_CARD,
      id: Date.now().toString(),
      order: data.mediaCards.length,
    };
    setData(prev => ({
      ...prev,
      mediaCards: [...prev.mediaCards, newCard],
    }));
    setExpandedCard(data.mediaCards.length);
  };

  const updateCard = (idx, field, value) => {
    setData(prev => {
      const cards = [...prev.mediaCards];
      cards[idx] = { ...cards[idx], [field]: value };
      return { ...prev, mediaCards: cards };
    });
  };

  const removeCard = (idx) => {
    if (!window.confirm('Remove this media card?')) return;
    setData(prev => {
      const cards = prev.mediaCards.filter((_, i) => i !== idx);
      return { ...prev, mediaCards: cards };
    });
    setExpandedCard(null);
  };

  const toggleVisibility = (idx) => {
    updateCard(idx, 'isVisible', !data.mediaCards[idx].isVisible);
  };

  const moveCard = (idx, direction) => {
    const cards = [...data.mediaCards];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= cards.length) return;
    [cards[idx], cards[swapIdx]] = [cards[swapIdx], cards[idx]];
    // Re-assign order values
    cards.forEach((c, i) => { c.order = i; });
    setData(prev => ({ ...prev, mediaCards: cards }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-red-500 font-medium">
        Failed to load Press &amp; Media data. Please refresh.
      </div>
    );
  }

  const visibleCount = data.mediaCards.filter(c => c.isVisible).length;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-yellow-500 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Press & Media CMS
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Press &amp; Media Page
          </h1>
          <p className="text-sm text-slate-500 italic mt-0.5">
            {visibleCount} visible card{visibleCount !== 1 ? 's' : ''} &nbsp;·&nbsp;
            {data.mediaCards.length} total
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Publish Changes'}
        </button>
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 w-fit">
        {[
          { id: 'hero',  icon: <Layout size={13} />,  label: 'Hero Banner' },
          { id: 'cards', icon: <Layers size={13} />,  label: `Media Cards (${data.mediaCards.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: HERO BANNER
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 space-y-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Layout size={14} className="text-blue-600" /> Hero Banner Settings
          </h2>

          {/* Live preview strip */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              minHeight: '110px',
              backgroundColor: data.hero.backgroundColor || '#3b5998',
              backgroundImage: data.hero.bannerImage ? `url(${data.hero.bannerImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2))', opacity: data.hero.overlayOpacity ?? 0.55 }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full py-6 text-white text-center">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Live Preview</p>
              <h3 style={{ fontFamily: 'Marcellus, serif', fontSize: 26, margin: 0 }}>
                {data.hero.title || 'Press & Media'}
              </h3>
              <p className="text-xs opacity-60 mt-1">Home / {data.hero.breadcrumbText || 'Press & Media'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Banner Image */}
            <div className="md:col-span-2">
              <Field label="Banner Image URL (optional — background color is used if empty)" hint="Leave empty to use the solid background color only.">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={data.hero.bannerImage || ''}
                    onChange={e => updateHero('bannerImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={inputCls}
                  />
                  <ImgPreview src={data.hero.bannerImage} className="h-14 w-24" />
                </div>
              </Field>
            </div>

            {/* Page Title */}
            <Field label="Page Title (H1)">
              <input
                type="text"
                value={data.hero.title || ''}
                onChange={e => updateHero('title', e.target.value)}
                className={inputCls}
              />
            </Field>

            {/* Breadcrumb Text */}
            <Field label="Breadcrumb Text">
              <input
                type="text"
                value={data.hero.breadcrumbText || ''}
                onChange={e => updateHero('breadcrumbText', e.target.value)}
                className={inputCls}
              />
            </Field>

            {/* Background Color */}
            <Field label="Background Color" hint="Used when no banner image is set, or as overlay base.">
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={data.hero.backgroundColor || '#3b5998'}
                  onChange={e => updateHero('backgroundColor', e.target.value)}
                  className="h-14 w-14 rounded-xl border border-slate-100 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={data.hero.backgroundColor || '#3b5998'}
                  onChange={e => updateHero('backgroundColor', e.target.value)}
                  className={`${inputCls} font-mono`}
                  placeholder="#3b5998"
                />
              </div>
            </Field>

            {/* Overlay Opacity */}
            <Field label="Overlay Opacity (0 = transparent → 1 = fully dark)">
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={data.hero.overlayOpacity ?? 0.55}
                  onChange={e => updateHero('overlayOpacity', parseFloat(e.target.value))}
                  className="flex-1 h-2 accent-blue-600"
                />
                <span className="text-sm font-black text-slate-600 w-12 text-center">
                  {(data.hero.overlayOpacity ?? 0.55).toFixed(2)}
                </span>
              </div>
            </Field>

            {/* Banner Height */}
            <Field label="Banner Height" hint='e.g. "420px" or "50vh"'>
              <input
                type="text"
                value={data.hero.bannerHeight || '420px'}
                onChange={e => updateHero('bannerHeight', e.target.value)}
                className={inputCls}
                placeholder="420px"
              />
            </Field>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: MEDIA CARDS
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {/* Add card button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500 italic">
              Drag reorder not yet available — use ↑ ↓ buttons to reorder cards.
            </p>
            <button
              onClick={addCard}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Plus size={15} /> Add Media Card
            </button>
          </div>

          {data.mediaCards.length === 0 && (
            <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-200 p-20 text-center">
              <Layers size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-400 font-medium">No media cards yet.</p>
              <p className="text-slate-400 text-sm">Click "Add Media Card" to get started.</p>
            </div>
          )}

          {/* Card list */}
          {data.mediaCards.map((card, idx) => (
            <div
              key={card.id || idx}
              className={`bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden transition-all ${
                !card.isVisible ? 'opacity-60' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 px-8 py-5 border-b border-slate-100">
                {/* Drag indicator / order number */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveCard(idx, 'up')}
                    disabled={idx === 0}
                    title="Move up"
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp size={14} className="text-slate-500" />
                  </button>
                  <button
                    onClick={() => moveCard(idx, 'down')}
                    disabled={idx === data.mediaCards.length - 1}
                    title="Move down"
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown size={14} className="text-slate-500" />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                  {card.mediaImage ? (
                    <img src={card.mediaImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={16} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Title & index */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate">
                    {card.mediaTitle || `Media Card #${idx + 1}`}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    Card {idx + 1} &nbsp;·&nbsp; {card.isVisible ? 'Visible' : 'Hidden'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleVisibility(idx)}
                    title={card.isVisible ? 'Hide card' : 'Show card'}
                    className={`p-2 rounded-xl border transition-all ${
                      card.isVisible
                        ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                        : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {card.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => removeCard(idx)}
                    title="Delete card"
                    className="p-2 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all"
                  >
                    {expandedCard === idx ? 'Collapse' : 'Edit'}
                  </button>
                </div>
              </div>

              {/* Card Edit Form (expandable) */}
              {expandedCard === idx && (
                <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Media Image */}
                  <div className="md:col-span-2">
                    <Field label="Main Screenshot / Media Image URL">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={card.mediaImage || ''}
                          onChange={e => updateCard(idx, 'mediaImage', e.target.value)}
                          placeholder="https://example.com/screenshot.jpg"
                          className={inputCls}
                        />
                        <ImgPreview src={card.mediaImage} className="h-14 w-24" />
                      </div>
                    </Field>
                  </div>

                  {/* Media Logo */}
                  <div className="md:col-span-2">
                    <Field label="Media Outlet Logo URL">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={card.mediaLogo || ''}
                          onChange={e => updateCard(idx, 'mediaLogo', e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className={inputCls}
                        />
                        <ImgPreview src={card.mediaLogo} className="h-14 w-24" />
                      </div>
                    </Field>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-2">
                    <Field label="Article / Feature Title">
                      <input
                        type="text"
                        value={card.mediaTitle || ''}
                        onChange={e => updateCard(idx, 'mediaTitle', e.target.value)}
                        placeholder="e.g. DMC Trichology Featured in Health Today"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {/* External Link */}
                  <div className="md:col-span-2">
                    <Field label="External Article Link" hint='Use "#" if there is no direct link.'>
                      <div className="flex gap-3 items-center">
                        <input
                          type="url"
                          value={card.mediaLink || '#'}
                          onChange={e => updateCard(idx, 'mediaLink', e.target.value)}
                          placeholder="https://publication.com/article"
                          className={inputCls}
                        />
                        {card.mediaLink && card.mediaLink !== '#' && (
                          <a
                            href={card.mediaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-3 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all"
                            title="Open link"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </Field>
                  </div>

                  {/* Show/Hide toggle */}
                  <Field label="Visibility">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleVisibility(idx)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                          card.isVisible
                            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {card.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {card.isVisible ? 'Visible on Page' : 'Hidden from Page'}
                      </button>
                    </div>
                  </Field>

                  {/* Order (read-only display) */}
                  <Field label="Sort Order (use ↑↓ buttons above to reorder)">
                    <input
                      type="number"
                      value={card.order ?? idx}
                      onChange={e => updateCard(idx, 'order', parseInt(e.target.value))}
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}
            </div>
          ))}

          {/* Bottom save reminder */}
          {data.mediaCards.length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving…' : 'Publish Changes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
