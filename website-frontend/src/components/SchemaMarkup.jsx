// Server component: renders page-specific Schema.org JSON-LD (from CMS seo.schema)
// into the HTML so search engines can read it. Invalid/empty schema is skipped.
export default function SchemaMarkup({ seo, schema }) {
  const source = schema ?? seo?.schema ?? seo?.schemaScript ?? "";
  if (!source) return null;

  let parsed;
  try {
    if (typeof source === "object") {
      parsed = source;
    } else {
      const raw = String(source).trim();
      const jsonLdScript = raw.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      const anyScript = raw.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
      const json = (jsonLdScript?.[1] || anyScript?.[1] || raw).trim();
      if (!json) return null;
      parsed = JSON.parse(json);
    }
  } catch {
    // Invalid JSON entered in the dashboard - render nothing rather than break the page.
    return null;
  }

  if (!parsed || (typeof parsed === "object" && Object.keys(parsed).length === 0)) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(parsed) }}
    />
  );
}
