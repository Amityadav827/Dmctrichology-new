import { fetchBlogs } from '../services/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function safeFetchList(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dmctrichology-new.vercel.app';
  const now = new Date();

  // 1. All static / fixed pages
  const staticRoutes = [
    '',
    '/about',
    '/contact-us',
    '/service',
    '/blog',
    '/results',
    '/faqs',
    '/virtual-tour',
    '/press-media',
    '/influencers',
    '/team-of-dmc',
    '/clients-feedback',
    '/terms-conditions',
    '/privacy-policy',
    '/science-at-dmc',
    '/hair-transplant-clinic-in-delhi',
    '/about-dadu-medical-centre',
    '/about-dr-nandani-dadu',
    '/about-dr-nivedita-dadu',
  ];
  const staticPages = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. All service detail pages -> /{slug}
  const services = await safeFetchList('/service-details');
  const serviceEntries = services
    .filter((s) => s && s.slug)
    .map((s) => ({
      url: `${siteUrl}/${s.slug}`,
      lastModified: s.updatedAt || s.updated_at || now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // 3. All published blog posts -> /blog/{slug}
  const blogsRes = await fetchBlogs({ limit: 1000, status: 'Published' });
  const blogs = blogsRes?.data || [];
  const blogEntries = blogs
    .filter((b) => b && b.slug)
    .map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt || now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  // 4. All custom CMS pages -> /{slug}
  const pages = await safeFetchList('/pages');
  const pageEntries = pages
    .filter((p) => p && p.slug && p.status !== 'Draft')
    .map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified: p.updatedAt || p.updated_at || now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticPages, ...serviceEntries, ...blogEntries, ...pageEntries];
}
