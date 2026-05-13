import React from 'react';
import { fetchBlogBySlug, fetchBlogPage, fetchBlogs } from '../../../services/api';
import BlogHero from '../../../components/BlogHero';
import { Calendar, User, MessageCircle, Search, Facebook, Twitter, Instagram, Youtube, Linkedin, Send } from 'lucide-react';
import { formatDate } from '../../../utils/dateFormatter';
import '../../service.css';

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
  const { slug } = params;
  const blogRes = await fetchBlogBySlug(slug);
  const blog = blogRes?.data;
  
  return {
    title: blog ? `${blog.title} | DMC Trichology` : 'Blog Detail | DMC Trichology',
    description: blog?.excerpt || 'Read the latest updates and advice from DMC Trichology experts.',
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = params;
  const { blog, pageSettings, recentBlogs } = await getData(slug);

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <a href="/blog" className="text-blue-600 hover:underline">Return to Blog Listing</a>
        </div>
      </div>
    );
  }

  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
    categories = []
  } = pageSettings.listing || {};

  return (
    <div className="bg-white min-h-screen">
      {/* Blog Hero */}
      <BlogHero data={{
        ...pageSettings.hero,
        title: "Blog Detail",
        breadcrumbText: "Blog Detail"
      }} />

      {/* Main Content */}
      <div className="blog-detail-container">
        <div className="blog-detail-grid">
          
          {/* Left Column: Blog Content */}
          <article className="blog-main-content">
            <div className="blog-detail-image">
              <img src={blog.blogImage || 'https://via.placeholder.com/1200x600'} alt={blog.title} />
            </div>

            <div className="blog-detail-meta">
              <div className="meta-item">
                <Calendar size={14} className="text-blue-600" />
                <span>{formatDate(blog.blogDate || blog.date)}</span>
              </div>
              <div className="meta-item">
                <User size={14} className="text-blue-600" />
                <span>Admin By {blog.author || 'Admin'}</span>
              </div>
              <div className="meta-item">
                <MessageCircle size={14} className="text-blue-600" />
                <span>Comments (30)</span>
              </div>
            </div>

            <h2 className="blog-detail-title">{blog.title}</h2>

            <div 
              className="blog-content-body" 
              dangerouslySetInnerHTML={{ __html: blog.content }} 
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
                    <a href="#"><Facebook size={18} /></a>
                    <a href="#"><Instagram size={18} /></a>
                    <a href="#"><Twitter size={18} /></a>
                    <a href="#"><Youtube size={18} /></a>
                    <a href="#"><Linkedin size={18} /></a>
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
                <h4 className="sidebar-title">{sidebarCategoriesTitle}</h4>
                <ul className="category-list">
                  {categories.map((cat, idx) => (
                    <li key={idx}>
                      <span>{cat.name}</span>
                      <span className="count">({cat.count})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Posts Widget */}
              <div className="sidebar-widget">
                <h4 className="sidebar-title">{sidebarRecentPostsTitle}</h4>
                <div className="recent-posts">
                  {(recentBlogs.slice(0, 4)).map((post, idx) => (
                    <div key={idx} className="recent-post-item">
                      <div 
                        className="post-thumb"
                        style={{
                          backgroundImage: `url(${post.blogImage || 'https://via.placeholder.com/80'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#D9D9D9'
                        }}
                      ></div>
                      <div className="post-content">
                        <span className="post-date">
                          {formatDate(post.blogDate || post.date)}
                        </span>
                        <h5 className="post-title">
                          <a href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {post.title}
                          </a>
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

      <style jsx>{`
        .blog-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 100px 5%;
          background-color: #ffffff;
        }
        .blog-detail-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 70px;
        }

        /* Blog Main Content */
        .blog-main-content {
          min-width: 0;
        }
        .blog-detail-image {
          width: 100%;
          border-radius: 40px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        .blog-detail-image img {
          width: 100%;
          height: auto;
          display: block;
        }
        .blog-detail-meta {
          display: flex;
          gap: 30px;
          margin-bottom: 25px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          color: #555;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .blog-detail-title {
          font-family: 'Marcellus', serif;
          font-size: 42px;
          line-height: 1.2;
          color: #111;
          margin-bottom: 30px;
          font-weight: 400;
        }
        .blog-content-body {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 40px;
        }
        .blog-quote {
          background-color: #F4F5FB;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 40px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .quote-icon {
          color: #2D4A8A;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .blog-quote p {
          font-family: 'Lato', sans-serif;
          font-size: 18px;
          line-height: 1.6;
          color: #111;
          font-weight: 500;
          margin: 0;
        }
        .blog-image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .image-placeholder {
            height: 400px;
            background-color: #E8E8E8;
            border-radius: 30px;
        }
        .blog-post-footer-text {
            font-family: 'Lato', sans-serif;
            font-size: 15px;
            line-height: 1.8;
            color: #666;
            margin-bottom: 40px;
        }

        .blog-share-section {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 25px 0;
            border-top: 1px solid #EEE;
            border-bottom: 1px solid #EEE;
            margin-bottom: 50px;
        }
        .share-label {
            font-family: 'Marcellus', serif;
            font-size: 20px;
            color: #111;
        }
        .share-icons {
            display: flex;
            gap: 15px;
        }
        .share-icons a {
            width: 36px;
            height: 36px;
            background-color: #2D4A8A;
            color: #FFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        .share-icons a:hover {
            transform: translateY(-3px);
        }

        /* Comments Section */
        .comments-section {
            margin-bottom: 60px;
        }
        .section-title {
            font-family: 'Marcellus', serif;
            font-size: 32px;
            color: #111;
            margin-bottom: 30px;
            font-weight: 400;
        }
        .comments-list {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .comment-item {
            display: flex;
            gap: 20px;
            padding-bottom: 40px;
            border-bottom: 1px solid #EEE;
        }
        .comment-item.replied {
            margin-left: 80px;
            border-bottom: none;
            padding-bottom: 0;
        }
        .comment-avatar {
            width: 100px;
            height: 100px;
            background-color: #D9D9D9;
            border-radius: 12px;
            flex-shrink: 0;
        }
        .comment-content {
            flex: 1;
        }
        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .comment-author {
            font-family: 'Marcellus', serif;
            font-size: 18px;
            color: #111;
        }
        .comment-date {
            font-size: 12px;
            color: #999;
        }
        .comment-text {
            font-family: 'Lato', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 15px;
        }
        .comment-reply {
            font-family: 'Marcellus', serif;
            font-size: 14px;
            color: #111;
            font-weight: 600;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            text-decoration: underline;
        }

        /* Reply Form */
        .reply-form-section {
            margin-bottom: 50px;
        }
        .form-subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
        }
        .reply-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 15px 20px;
            background-color: #F4F5FB;
            border: none;
            border-radius: 10px;
            font-family: 'Lato', sans-serif;
            font-size: 14px;
            outline: none;
        }
        .form-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: #666;
        }
        .submit-btn {
            width: fit-content;
            background-color: #2D4A8A;
            color: #FFF;
            padding: 15px 35px;
            border-radius: 50px;
            font-family: 'Marcellus', serif;
            font-weight: 600;
            display: flex;
            align-items: center;
            border: none;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .submit-btn:hover {
            background-color: #1a3266;
        }

        /* Sidebar Styles (Reused from Listing) */
        .blog-sidebar {
          min-width: 0;
        }
        .sidebar-inner {
          position: sticky;
          top: 100px;
          background: #2D4A8A;
          border-radius: 40px;
          padding: 40px 30px;
          color: #ffffff;
        }
        .sidebar-widget {
          margin-bottom: 40px;
        }
        .sidebar-title {
          font-family: 'Marcellus', serif;
          font-size: 32px;
          margin-bottom: 25px;
          font-weight: 400;
        }
        .search-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 12px;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: #ffffff;
          flex: 1;
          font-family: 'Marcellus', serif;
          outline: none;
          font-size: 20px;
          padding-right: 15px;
        }
        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.9);
        }
        .category-list {
          list-style: none;
          padding: 0;
        }
        .category-list li {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          opacity: 0.9;
        }
        .recent-posts {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .recent-post-item {
          display: flex;
          gap: 15px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .post-thumb {
          width: 80px;
          height: 80px;
          background: #D9D9D9;
          border-radius: 12px;
          flex-shrink: 0;
        }
        .post-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .post-date {
          font-size: 11px;
          opacity: 0.6;
        }
        .post-title {
          font-family: 'Marcellus', serif;
          font-size: 18px;
          line-height: 1.3;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .blog-detail-grid {
            grid-template-columns: 1fr 320px;
            gap: 40px;
          }
          .blog-detail-title {
            font-size: 34px;
          }
        }
        @media (max-width: 992px) {
          .blog-detail-grid {
            grid-template-columns: 1fr;
          }
          .sidebar-inner {
            position: relative;
            top: 0;
          }
        }
        @media (max-width: 768px) {
          .blog-detail-title {
            font-size: 28px;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .comment-item.replied {
            margin-left: 40px;
          }
          .blog-image-grid {
              grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
