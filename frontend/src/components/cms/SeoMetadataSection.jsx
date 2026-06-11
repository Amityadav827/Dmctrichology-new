import React from "react";
import { Search, Code2, CheckCircle2, AlertCircle } from "lucide-react";

const inputCls =
  "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all";

const extractSchemaJson = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const jsonLdScript = raw.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdScript) return jsonLdScript[1].trim();

  const anyScript = raw.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  if (anyScript) return anyScript[1].trim();

  return raw;
};

const validateSchemaJson = (value = "") => {
  const normalized = extractSchemaJson(value);
  if (!normalized) return { normalized, valid: null };

  try {
    JSON.parse(normalized);
    return { normalized, valid: true };
  } catch {
    return { normalized, valid: false };
  }
};

export default function SeoMetadataSection({ seo = {}, onChange }) {
  const update = (field, value) => {
    onChange?.(field, value);
  };

  const updateSchema = (value) => {
    update("schema", extractSchemaJson(value));
  };

  // Live validation of the JSON-LD schema box. Script-wrapped JSON-LD is
  // normalized to the inner JSON before validation and save.
  const schemaText = seo.schema ?? seo.schemaScript ?? "";
  const { valid: schemaValid } = validateSchemaJson(schemaText);

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

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            Meta Keywords
          </label>
          <input
            type="text"
            value={seo.keywords || ""}
            onChange={e => update("keywords", e.target.value)}
            className={inputCls}
            placeholder="keyword one, keyword two, ..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            Canonical URL
          </label>
          <input
            type="text"
            value={seo.canonicalUrl || ""}
            onChange={e => update("canonicalUrl", e.target.value)}
            className={inputCls}
            placeholder="https://dmctrichology.com/page"
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

        {/* Structured data / Schema markup (JSON-LD) */}
        <div className="md:col-span-2">
          <label className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2">
            <Code2 size={13} className="text-blue-600" />
            Schema Markup (JSON-LD)
            {schemaValid === true && (
              <span className="flex items-center gap-1 text-green-600 normal-case tracking-normal font-bold">
                <CheckCircle2 size={13} /> Valid JSON
              </span>
            )}
            {schemaValid === false && (
              <span className="flex items-center gap-1 text-red-500 normal-case tracking-normal font-bold">
                <AlertCircle size={13} /> Invalid JSON - fix before saving
              </span>
            )}
          </label>
          <textarea
            rows={10}
            value={schemaText}
            onChange={e => updateSchema(e.target.value)}
            className={`${inputCls} resize-y font-mono text-xs ${
              schemaValid === false ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""
            }`}
            placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "MedicalClinic",\n  "name": "DMC Trichology",\n  "url": "https://dmctrichology.com"\n}`}
          />
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Paste valid JSON-LD here. It will be added to this page's &lt;head&gt; as a
            <span className="font-bold"> &lt;script type="application/ld+json"&gt;</span> tag on save.
            Leave empty to skip. You can paste pure JSON or a full script tag from any schema generator.
          </p>
        </div>
      </div>
    </div>
  );
}
