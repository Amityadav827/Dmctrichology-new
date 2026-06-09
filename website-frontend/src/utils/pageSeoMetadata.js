const stripText = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const pickText = (...values) => {
  for (const value of values) {
    const text = stripText(value);
    if (text) return text;
  }
  return '';
};

export function buildCmsMetadata({ data = {}, titleFallback = '', descriptionFallback = '', imageFallback = '' }) {
  const seo = data?.seo || {};
  const title = pickText(seo.metaTitle, titleFallback);
  const description = pickText(seo.metaDescription, descriptionFallback);
  const ogImage = pickText(seo.ogImage, imageFallback);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
