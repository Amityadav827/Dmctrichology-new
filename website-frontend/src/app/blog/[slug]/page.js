import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogBySlug, fetchBlogPage, fetchBlogs } from '../../../services/api';
import BlogHero from '../../../components/BlogHero';
import { Calendar, User, MessageCircle, Search, Send } from 'lucide-react';
import { formatDate } from '../../../utils/dateFormatter';
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
  const [blogRes, pageRes, blogsRes] = await Promise.all([
    fetchBlogBySlug(slug),
    fetchBlogPage(),
    fetchBlogs({ status: 'Published' })
  ]);

  return {
    blog: blogRes?.data || null,
    pageSettings: pageRes?.data || {},
    recentBlogs: blogsRes?.data || []
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogRes = await fetchBlogBySlug(slug);
  const blog = blogRes?.data;
  
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dmctrichology-mkm4.vercel.app';
  
  return {
    title: blog ? `${blog.title} | DMC Trichology` : 'Blog Detail | DMC Trichology',
    description: blog?.shortDescription || blog?.excerpt || 'Read the latest updates and advice from DMC Trichology experts.',
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: blog?.title,
      description: blog?.shortDescription,
      images: blog?.blogImage ? [{ url: blog.blogImage }] : [],
      type: 'article',
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  
  const { blog, pageSettings, recentBlogs } = await getData(slug);

  // TEMPORARY DIAGNOSTIC LOGS
  console.log("[BlogDetailPage] slug:", slug);
  console.log("[BlogDetailPage] blog.title type:", typeof blog?.title);
  console.log("[BlogDetailPage] blog.content type:", typeof blog?.content);
  if (blog?.content && typeof blog.content === 'object') {
     console.log("[BlogDetailPage] CRITICAL: blog.content is an OBJECT!", blog.content);
  }

  if (!blog) {
    notFound();
  }

  // Defensive parsing for pageSettings
  const listingSettings = pageSettings?.listing || {};
  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
    categories = []
  } = listingSettings;

  // Ensure content is a string
  const blogContent = typeof blog.content === 'string' 
    ? blog.content 
    : (typeof blog.content === 'object' ? JSON.stringify(blog.content) : String(blog.content || ""));

  return (
    <div className="bg-white min-h-screen">
      {/* Blog Hero */}
      <BlogHero data={{
        ...(pageSettings?.hero || {}),
        title: "Blog Detail",
        breadcrumbText: "Blog Detail"
      }} />

      {/* Main Content */}
      <div className="blog-detail-container">
        <div className="blog-detail-grid">
          
          {/* Left Column: Blog Content */}
          <article className="blog-main-content">
            <div className="blog-detail-image">
              <img src={String(blog.blogImage || blog.image || 'https://via.placeholder.com/1200x600')} alt={String(blog.title || "Blog")} />
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
                <span>Comments (30)</span>
              </div>
            </div>

            <h2 className="blog-detail-title">{String(blog.title || "")}</h2>

            <div 
              className="blog-content-body" 
              dangerouslySetInnerHTML={{ __html: blogContent }} 
            />

            {/* Blockquote Example (If content doesn't have one, we can show how it looks or just rely on CSS) */}
            {/* The user design shows a quote block */}
            <div className="blog-quote">
                <div className="quote-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>
                </div>
                <p>
                    Music Events Bring People Together, Creating Magical Moments Through Live Performances, Stunning Visuals, And Immersive Sound. From Intimate Acoustic Sets To Grand Stadium Concerts, Each Experience Leaves A Lasting Impact On Audiences.
                </p>
            </div>

            {/* Placeholder for images from design */}
            <div className="blog-image-grid">
                <div className="image-placeholder"></div>
                <div className="image-placeholder"></div>
            </div>

            <p className="blog-post-footer-text">
                From Intimate Acoustic Sets To Grand Stadium Concerts, Each Experience Leaves A Lasting Impact On Audiences. The Energy Of The Crowd, The Passion Of The Artists, And The Atmosphere All Combine To Make Every Event Unique. Whether It's A Music Festival, A Cultural Celebration, Or An Exclusive They Create. Discover How The Right Mix Of Music, Technology, And Creativity Turns An Event Into An Unforgettable Experience.
            </p>

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

            {/* Comments Section */}
            <div className="comments-section">
                <h3 className="section-title">Comments (30)</h3>
                <div className="comments-list">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`comment-item ${i === 3 ? 'replied' : ''}`}>
                            <div className="comment-avatar"></div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <h4 className="comment-author">Elisa Gabriella</h4>
                                    <span className="comment-date">March 2020</span>
                                </div>
                                <p className="comment-text">
                                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Aliquet Erat Non Velit Consequat, Eu Pharetra Est Malesuada. Renting Power Tools Allows You To Access High-Performance Drills, Saws, And Sanders Without The Upfront Cost Id Vestibulum Nulla Consequat. Tackle Landscaping And Gardening Tasks
                                </p>
                                <button className="comment-reply">Reply</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Form */}
            <div className="reply-form-section">
                <h3 className="section-title">Leave A Reply</h3>
                <p className="form-subtitle">Your Email Address Will Not Be Published. Required Fields Are Marked *</p>
                
                <form className="reply-form">
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder="Name*" required />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Your Email Address*" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <textarea placeholder="Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Aliquet Erat Non Velit Consequat, Eu Pharetra Est Malesuada. Renting Power Tools Allows You To Access High-Performance Drills, Saws, And Sanders Without The Upfront Cost Id Vestibulum Nulla Consequat. Tackle Landscaping And Gardening Tasks" rows="6"></textarea>
                    </div>
                    <div className="form-checkbox">
                        <input type="checkbox" id="save-info" />
                        <label htmlFor="save-info">Save My Name, Email, And Website In This Browser For The Next Time I Comment.</label>
                    </div>
                    <button type="submit" className="submit-btn">
                        Post Comment
                        <Send size={14} className="ml-2" />
                    </button>
                </form>
            </div>

          </article>

          {/* Right Column: Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-inner">
              {/* Search Widget */}
              <div className="sidebar-widget search-widget">
                <div className="search-box">
                  <input type="text" placeholder={sidebarSearchPlaceholder} />
                  <Search size={20} className="search-icon" />
                </div>
              </div>

              {/* Categories Widget */}
              <div className="sidebar-widget">
                <h4 className="sidebar-title">{String(sidebarCategoriesTitle || "")}</h4>
                <ul className="category-list">
                  {(Array.isArray(categories) ? categories : []).map((cat, idx) => (
                    <li key={idx}>
                      <span>{String(cat?.name || "")}</span>
                      <span className="count">({String(cat?.count || "0")})</span>
                    </li>
                  ))}
                </ul>
              </div>

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
