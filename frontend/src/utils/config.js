// Centralized configuration for the DMC Trichology system
// This ensures a single source of truth for all environment-specific URLs

const isLocal = typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// The active frontend deployment domain (Next.js website)
export const FRONTEND_URL = isLocal 
  ? "http://localhost:3000" 
  : "https://dmctrichology-mkm4.vercel.app";

/**
 * Generates a preview URL for a given page slug
 * Adds ?v1 to bypass cache as requested by the user
 * @param {string} slug - The page slug (e.g., 'home', 'contact', 'service')
 * @param {boolean} editMode - Whether to enable edit mode parameters
 * @returns {string} The full preview URL
 */
export const getFrontendPreviewUrl = (slug, editMode = true) => {
  const cleanSlug = slug === 'home' ? '' : slug;
  const base = FRONTEND_URL.endsWith('/') ? FRONTEND_URL.slice(0, -1) : FRONTEND_URL;
  
  let url = `${base}/${cleanSlug}`;
  
  const params = new URLSearchParams();
  if (editMode) {
    params.set('edit', 'true');
    params.set('preview', 'true');
  }
  params.set('v1', Date.now().toString()); // Cache busting version tag
  
  return `${url}?${params.toString()}`;
};

export default {
  FRONTEND_URL,
  getFrontendPreviewUrl
};
