export const stripBlogHtml = (value = "") => String(value)
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/\s+/g, " ")
  .trim();

export const createBlogExcerpt = (fullDescription = "", maxLength = 220) => {
  const text = stripBlogHtml(fullDescription);
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const cleanText = (lastSpace > 140 ? truncated.slice(0, lastSpace) : truncated).trim();
  return `${cleanText.replace(/[.,;:!?-]+$/, "")}...`;
};

export const getBlogShortDescription = (blog = {}) => {
  const shortDescription = stripBlogHtml(blog.shortDescription || "");
  if (shortDescription) return shortDescription;
  const metaDescription = stripBlogHtml(blog.metaDescription || blog.meta_description || "");
  if (metaDescription) return metaDescription;
  return createBlogExcerpt(blog.fullDescription || blog.longDescription || "");
};

export const getBlogDisplayDescription = (blog = {}) => (
  getBlogShortDescription(blog) ||
  stripBlogHtml(blog.description || blog.adminDescription || blog.admin_description || "")
);
