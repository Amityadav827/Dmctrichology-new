import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogBySlug, fetchBlogPage, fetchBlogs, fetchBlogCategories, fetchComments } from '../../../services/api';
import BlogHero from '../../../components/BlogHero';
import BlogComments from '../../../components/BlogComments';
import BlogFaqAccordion from '../../../components/BlogFaqAccordion';
import { SidebarSearch, SidebarCategories } from '../../../components/SidebarWidgets';
import { Calendar, User, MessageCircle, ArrowRight } from 'lucide-react';
import { formatDate } from '../../../utils/dateFormatter';
import { getBlogShortDescription } from '../../../utils/blogExcerpt';
import '../../service.css';
import '../../blog-detail.css';

const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58zM9.75 15.02V8.98L15 12l-5.25 3.02z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
  </svg>
);

export const dynamic = "force-dynamic";

async function getData(slug) {
  try {
    console.log("[getData] Starting parallel fetch for:", slug);
    const [blogRes, pageRes, blogsRes, categoriesRes, commentsRes] = await Promise.all([
      fetchBlogBySlug(slug),
      fetchBlogPage(),
      fetchBlogs({ status: 'Published' }),
      fetchBlogCategories(),
      fetchComments(slug)
    ]);

    const blog = blogRes?.data || null;
    const allBlogs = blogsRes?.data || [];
    
    console.log("[getData] Success. Blog found:", !!blog, "All blogs count:", allBlogs.length);

    return {
      blog,
      pageSettings: pageRes?.data || {},
      recentBlogs: allBlogs,
      dynamicCategories: categoriesRes?.data || [],
      totalBlogCount: allBlogs.length,
      initialComments: commentsRes?.data || [],
      commentCount: (commentsRes?.data || []).length
    };
  } catch (error) {
    console.error("[getData] ERROR during fetch:", error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogRes = await fetchBlogBySlug(slug);
  const blog = blogRes?.data;
  
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dmctrichology-new.vercel.app';
  
  // SEO overrides from dashboard
  const title = blog?.metaTitle || (blog ? `${blog.title} | DMC Trichology` : 'Blog Detail | DMC Trichology');
  const description = blog?.metaDescription || getBlogShortDescription(blog) || blog?.excerpt || 'Read the latest updates and advice from DMC Trichology experts.';
  const keywords = blog?.metaKeywords || "";
  const canonical = blog?.canonicalUrl || `${siteUrl}/blog/${slug}`;
  const image = blog?.blogImage || `${siteUrl}/default-blog.jpg`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      siteName: 'DMC Trichology',
      images: [{ url: image }],
      type: 'article',
      publishedTime: blog?.blogDate || blog?.created_at,
      authors: [blog?.author || 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  if (slug === "contact-us") {
    notFound();
  }
  
  let data;
  try {
    console.log("[BlogDetailPage] Fetching data for slug:", slug);
    data = await getData(slug);
  } catch (error) {
    console.error("[BlogDetailPage] CRITICAL DATA FETCH ERROR:", error);
    data = { 
      blog: null, 
      pageSettings: {}, 
      recentBlogs: [], 
      dynamicCategories: [], 
      totalBlogCount: 0 
    };
  }

  // Ensure data exists with fallbacks
  const blog = data?.blog || null;
  const pageSettings = data?.pageSettings || {};
  const recentBlogs = Array.isArray(data?.recentBlogs) ? data.recentBlogs : [];
  const dynamicCategories = Array.isArray(data?.dynamicCategories) ? data.dynamicCategories : [];
  const totalBlogCount = Number(data?.totalBlogCount || 0);
  const initialComments = Array.isArray(data?.initialComments) ? data.initialComments : [];
  const commentCount = Number(data?.commentCount || 0);

  if (!blog) {
    console.warn("[BlogDetailPage] Blog not found for slug:", slug);
    notFound();
  }

  // Defensive parsing for pageSettings
  const listingSettings = pageSettings?.listing || {};
  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
  } = listingSettings;

  // Ensure content is a string
  const blogContent = typeof blog.fullDescription === 'string' 
    ? blog.fullDescription 
    : (typeof blog.fullDescription === 'object' ? JSON.stringify(blog.fullDescription) : String(blog.fullDescription || ""));

  // Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": String(blog.title || ""),
    "image": [String(blog.blogImage || blog.image || "")],
    "datePublished": blog.blogDate || blog.created_at,
    "dateModified": blog.updated_at || blog.blogDate || blog.created_at,
    "author": [{
        "@type": "Person",
        "name": String(blog.author || "Admin"),
        "url": "#"
    }],
    "description": String(getBlogShortDescription(blog) || blog.excerpt || "")
  };

  // FAQ Schema
  const faqJsonLd = (blog.faqs && blog.faqs.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map(faq => ({
      "@type": "Question",
      "name": String(faq.question || ""),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": String(faq.answer || "")
      }
    }))
  } : null;

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Blog Hero */}
      <BlogHero data={{
        ...(pageSettings?.hero || {}),
        title: String(blog.title || "Blog"),
        breadcrumbText: String(blog.title || "Blog"),
        titleTag: "h1"
      }} />

      {/* Main Content */}
      <div className="blog-detail-container">
        <div className="blog-detail-grid">
          
          {/* Left Column: Blog Content */}
          <article className="blog-main-content">
            <div className="blog-detail-image">
              <img 
                src={String(blog.blogImage || blog.image || 'https://via.placeholder.com/1200x600')} 
                alt={String(blog.altTag || blog.title || "Blog")} 
              />
            </div>

            <div className="blog-detail-meta">
              <div className="meta-item">
                <Calendar size={14} className="text-blue-600" />
                <span>{formatDate(blog.blogDate || blog.date)}</span>
              </div>
              <div className="meta-item">
                <User size={14} className="text-blue-600" />
                <span>Admin By {String(blog.author || 'Admin')}</span>
              </div>
              <div className="meta-item">
                <MessageCircle size={14} className="text-blue-600" />
                <span>Comments ({commentCount})</span>
              </div>
            </div>

            <h2 className="blog-detail-title">{String(blog.title || "")}</h2>

            <div 
              className="blog-content-body" 
              dangerouslySetInnerHTML={{ __html: blogContent }} 
            />

            {/* Dynamic Blog FAQs */}
            <BlogFaqAccordion faqs={blog.faqs} />

            <div className="blog-share-section">
                <span className="share-label">Follow Us On :</span>
                <div className="share-icons">
                    <a href="#"><FacebookIcon width={18} height={18} /></a>
                    <a href="#"><InstagramIcon width={18} height={18} /></a>
                    <a href="#"><TwitterIcon width={18} height={18} /></a>
                    <a href="#"><YoutubeIcon width={18} height={18} /></a>
                    <a href="#"><LinkedinIcon width={18} height={18} /></a>
                </div>
            </div>

            {/* Comments & Reply Form */}
            <BlogComments blogSlug={slug} initialComments={initialComments} />
          </article>

          {/* Right Side: Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-inner">
              {/* Search Widget */}
              <div className="sidebar-widget search-widget">
                <SidebarSearch placeholder={sidebarSearchPlaceholder} />
              </div>

              {/* Categories Widget */}
              <SidebarCategories 
                title={sidebarCategoriesTitle} 
                categories={dynamicCategories} 
                totalCount={totalBlogCount} 
              />

              {/* Recent Posts Widget */}
              <div className="sidebar-widget">
                <h4 className="sidebar-title">{String(sidebarRecentPostsTitle || "")}</h4>
                <div className="recent-posts">
                  {(Array.isArray(recentBlogs) ? recentBlogs.slice(0, 4) : []).map((post, idx) => (
                    <div key={idx} className="recent-post-item">
                      <div 
                        className="post-thumb"
                        style={{
                          backgroundImage: `url(${String(post?.blogImage || post?.image || 'https://via.placeholder.com/80')})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#D9D9D9'
                        }}
                      ></div>
                      <div className="post-content">
                        <span className="post-date">
                          {formatDate(post?.blogDate || post?.date)}
                        </span>
                        <h5 className="post-title">
                          <Link href={`/blog/${String(post?.slug || "")}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {String(post?.title || "")}
                          </Link>
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Banner Widget (Optional for detail page but part of listing) */}
            </div>
          </aside>

        </div>
      </div>


    </div>
  );
}
