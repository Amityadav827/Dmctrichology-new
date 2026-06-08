import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileText, Save, RefreshCcw, Info, Check, ShieldAlert, Bot } from "lucide-react";
import Loader from "../components/Loader";
import { getRobotsContent, updateRobotsContent } from "../api/services";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://dmctrichology-new.vercel.app/sitemap.xml`;

function RobotsEditor() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRobotsContent();
      const rawContent = response.data?.content || DEFAULT_ROBOTS;
      setContent(rawContent);
      setOriginalContent(rawContent);
    } catch (error) {
      toast.error("Failed to load robots.txt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRobotsContent({ content });
      toast.success("robots.txt updated successfully");
      setOriginalContent(content);
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset to default template? Current changes will be lost.")) {
      setContent(DEFAULT_ROBOTS);
    }
  };

  if (loading) return <Loader label="Configuring search bot access..." />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Robots.txt Editor</h3>
          <p className="text-sm text-slate-500 mt-1">Direct search engine crawlers and manage indexing rules</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCcw size={14} />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-800">
            <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editor: robots.txt</span>
              </div>
              {hasChanges && (
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest animate-pulse">Unsaved Changes</span>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck="false"
              className="w-full h-[500px] bg-transparent p-8 text-blue-300 font-mono text-sm leading-relaxed outline-none resize-none"
              placeholder="User-agent: *..."
            />
            <div className="px-8 py-3 bg-slate-800/30 border-t border-slate-800 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex justify-between">
              <span>Lines: {content.split('\n').length}</span>
              <span>UTF-8 Encoding</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Bot size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Bot Intelligence</h4>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>User-agent: *</strong> targets all crawlers like Googlebot, Bingbot, etc.
                </p>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Disallow: /admin/</strong> keeps sensitive internal paths private.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  Be careful with Disallow rules as they can accidentally block your entire site from search results.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <div className="bg-blue-50/50 p-4 rounded-2xl flex gap-3">
                <Info size={18} className="text-blue-500 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  After saving, search engines will typically detect changes within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RobotsEditor;
