import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, FileText, Search } from "lucide-react";

// Standalone rich text editor (defined outside the page component so its
// identity stays stable and the contentEditable keeps focus while typing).
function RichEditor({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const cmd = (command, arg = null) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML || "");
  };

  const buttons = [
    { label: "Paragraph", action: () => cmd("formatBlock", "P") },
    { label: "H2", action: () => cmd("formatBlock", "H2") },
    { label: "H3", action: () => cmd("formatBlock", "H3") },
    { label: "Bold", action: () => cmd("bold") },
    { label: "Italic", action: () => cmd("italic") },
    { label: "Underline", action: () => cmd("underline") },
    { label: "• List", action: () => cmd("insertUnorderedList") },
    { label: "1. List", action: () => cmd("insertOrderedList") },
    { label: "Link", action: () => { const u = window.prompt("Enter URL"); if (u) cmd("createLink", u); } },
    { label: "Unlink", action: () => cmd("unlink") },
    { label: "Clear", action: () => cmd("removeFormat") }
  ];

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-100 bg-slate-50">
        {buttons.map(b => (
          <button
            key={b.label}
            type="button"
            onMouseDown={e => { e.preventDefault(); b.action(); }}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            {b.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={e => onChange(e.currentTarget.innerHTML)}
        onBlur={e => onChange(e.currentTarget.innerHTML)}
        className="tc-cms-editor min-h-[420px] max-h-[640px] overflow-y-auto px-6 py-5 text-sm leading-relaxed text-slate-800 outline-none"
      />
      <style>{`
        .tc-cms-editor h2 { font-size: 22px; font-weight: 600; margin: 18px 0 8px; }
        .tc-cms-editor h3 { font-size: 18px; font-weight: 600; margin: 16px 0 6px; }
        .tc-cms-editor p { margin: 0 0 12px; }
        .tc-cms-editor ul, .tc-cms-editor ol { margin: 0 0 12px 22px; }
        .tc-cms-editor a { color: #2563eb; text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default function TermsConditionsCMS() {
  const [data, setData] = useState({
    hero: { isEnabled: true, pageTitle: "Terms & Conditions", breadcrumbLabel: "Terms & Conditions", backgroundImage: "" },
    content: "",
    seo: { metaTitle: "", metaDescription: "", ogImage: "" }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    axios.get("/terms-conditions")
      .then(res => { if (res.data?.data) setData(res.data.data); })
      .catch(() => toast.error("Failed to load Terms & Conditions data"))
      .finally(() => setLoading(false));
  }, []);

  const setHero = (field, val) => setData(prev => ({ ...prev, hero: { ...prev.hero, [field]: val } }));
  const setSeo = (field, val) => setData(prev => ({ ...prev, seo: { ...prev.seo, [field]: val } }));
  const setContent = (val) => setData(prev => ({ ...prev, content: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/terms-conditions", data);
      toast.success("Terms & Conditions saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  const inputCls = "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all";
  const labelCls = "block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest";

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terms &amp; Conditions CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage the Terms &amp; Conditions page content and SEO</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl mb-8 w-fit">
        <button onClick={() => setActiveTab("content")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Content</button>
        <button onClick={() => setActiveTab("seo")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'seo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>SEO</button>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <FileText size={14} className="text-blue-600" /> Page Heading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelCls}>Page Title</label>
                <input type="text" value={data.hero?.pageTitle || ""} onChange={e => setHero("pageTitle", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Breadcrumb Label</label>
                <input type="text" value={data.hero?.breadcrumbLabel || ""} onChange={e => setHero("breadcrumbLabel", e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <FileText size={14} className="text-blue-600" /> Page Content
            </h2>
            <RichEditor value={data.content || ""} onChange={setContent} />
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <Search size={14} className="text-blue-600" /> SEO Settings
          </h2>
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Meta Title</label>
              <input type="text" value={data.seo?.metaTitle || ""} onChange={e => setSeo("metaTitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea rows={4} value={data.seo?.metaDescription || ""} onChange={e => setSeo("metaDescription", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>OG Image URL</label>
              <input type="text" value={data.seo?.ogImage || ""} onChange={e => setSeo("ogImage", e.target.value)} className={inputCls} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>Schema Markup (JSON-LD)</label>
              <textarea rows={8} value={data.seo?.schema || ""} onChange={e => setSeo("schema", e.target.value)} className={`${inputCls} font-mono`} placeholder='{"@context":"https://schema.org","@type":"WebPage","name":"Terms"}' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
