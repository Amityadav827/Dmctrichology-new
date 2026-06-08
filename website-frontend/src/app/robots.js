export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dmctrichology-new.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Assuming there's an admin path
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
