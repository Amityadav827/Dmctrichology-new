import { fetchBlogs } from '../services/api';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dmctrichology-mkm4.vercel.app';

  // 1. Fetch all blogs
  const blogsRes = await fetchBlogs({ limit: 1000, status: 'Published' });
  const blogs = blogsRes?.data || [];

  // 2. Map blogs to sitemap entries
  const blogEntries = blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.createdAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Static Pages
  const staticPages = [
    '',
    '/about',
    '/contact-us',
    '/blog',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticPages, ...blogEntries];
}
