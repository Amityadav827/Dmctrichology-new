import React from "react";
import { Search } from "lucide-react";

const inputCls =
  "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all";

export default function SeoMetadataSection({ seo = {}, onChange }) {
  const update = (field, value) => {
    onChange?.(field, value);
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
      <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
        <Search size={18} className="text-blue-600" />
        SEO & Metadata
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            Meta Title Tag
          </label>
          <input
            type="text"
            value={seo.metaTitle || ""}
            onChange={e => update("metaTitle", e.target.value)}
            className={inputCls}
            placeholder="Page title for search results"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            Meta Description Tag
          </label>
          <textarea
            rows={4}
            value={seo.metaDescription || ""}
            onChange={e => update("metaDescription", e.target.value)}
            className={`${inputCls} resize-y`}
            placeholder="Short search/social description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            OG Image URL (Social Sharing Image)
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={seo.ogImage || ""}
              onChange={e => update("ogImage", e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
            {seo.ogImage && (
              <img
                src={seo.ogImage}
                alt="OG preview"
                className="h-16 w-28 object-cover rounded-2xl border border-slate-100 shadow-sm"
                onError={e => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
