// Server component: builds FAQPage JSON-LD (a Google "rich result" type) from FAQ items,
// so FAQ sections become eligible for FAQ rich results / show up in the Rich Results Test.
const stripHtml = (s) =>
  String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function FaqSchema({ faqs = [] }) {
  const valid = (Array.isArray(faqs) ? faqs : [])
    .map((f) => ({ q: stripHtml(f?.question ?? f?.q), a: stripHtml(f?.answer ?? f?.a) }))
    .filter((f) => f.q && f.a);

  if (valid.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
