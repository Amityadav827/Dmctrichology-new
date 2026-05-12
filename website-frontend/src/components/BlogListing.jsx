"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';
import { Search, Calendar, User } from 'lucide-react';

const BlogListing = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [pageData, setPageData] = useState(initialData?.listing || {});

  // Sync state when initialData changes (SSR data)
  useEffect(() => {
    if (initialData?.listing) {
      setPageData(initialData.listing);
    }
  }, [initialData]);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedListing = { ...pageData };
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('blog-listing.listing.')) {
          hasChanges = true;
          const field = key.replace('blog-listing.listing.', '');
          updatedListing[field] = siteConfig[key];
        }
      });

      if (hasChanges) {
        setPageData(updatedListing);
      }
    }
  }, [isEditMode, siteConfig, pageData]);

  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
    promoImage = "",
    promoLink = ""
  } = pageData;

  const dummyBlogs = [
    {
      id: 1,
      title: "Overcoming Physical Setbacks: How Physiotherapy Recovery.",
      image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      date: "May 10, 2025",
      author: "Dr. Meera Joshi, Posture & Spine",
      slug: "overcoming-physical-setbacks",
      active: true
    },
    {
      id: 2,
      title: "Revolutionizing Rehab: How Emerging Physiotherapy Technologies.",
      image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      date: "May 11, 2025",
      author: "Dr. Rahul Kapoor, Neuro Expert",
      slug: "revolutionizing-rehab"
    },
    {
      id: 3,
      title: "Revolutionizing Rehab: How Emerging Physiotherapy Technologies.",
      image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      date: "May 11, 2025",
      author: "Dr. Rahul Kapoor, Neuro Expert",
      slug: "revolutionizing-rehab-2"
    },
    {
      id: 4,
      title: "Revolutionizing Rehab: How Emerging Physiotherapy Technologies.",
      image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      date: "May 11, 2025",
      author: "Dr. Rahul Kapoor, Neuro Expert",
      slug: "revolutionizing-rehab-3"
    }
  ];

  const categories = [
    { name: "Back & Spine Therapy", count: 4 },
    { name: "Sports Injury Rehab", count: 3 },
    { name: "Post-Surgical Recovery", count: 2 },
    { name: "Joint & Muscle Mobilization", count: 3 },
    { name: "Neurological Physiotherapy", count: 2 }
  ];

  const recentPosts = [
    { title: "How Physiotherapy Helps You Heal Faster", date: "Mar 06, 2025", image: "" },
    { title: "Best Exercises For Shoulder Pain Relief", date: "Mar 08, 2025", image: "" },
    { title: "Improve Posture With Simple Daily Stretches", date: "Mar 10, 2025", image: "" },
    { title: "Best Exercises For Shoulder Pain Relief", date: "Mar 08, 2025", image: "" }
  ];

  return (
    <EditableSection sectionId="blog-listing" label="Blog Listing Section">
      <section className="blog-listing-wrapper">
        <div className="blog-container">
          
          {/* Left Side: Blog Grid */}
          <div className="blog-grid-content">
            <div className="blog-grid">
              {dummyBlogs.map((blog) => (
                <div key={blog.id} className={`blog-card ${blog.active ? 'active-card' : ''}`}>
                  <div className="blog-card-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                  <div className="blog-card-info">
                    <div className="blog-card-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{blog.date}</span>
                      </div>
                      <div className="meta-item">
                        <User size={14} />
                        <span>{blog.author}</span>
                      </div>
                    </div>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <a href={`/blog/${blog.slug}`} className="explore-link">Explore More</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Sidebar */}
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
                <h4 className="sidebar-title">
                   <EditableText sectionId="blog-listing" fieldPath="listing.sidebarCategoriesTitle">
                      {sidebarCategoriesTitle}
                   </EditableText>
                </h4>
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
                <h4 className="sidebar-title">
                   <EditableText sectionId="blog-listing" fieldPath="listing.sidebarRecentPostsTitle">
                      {sidebarRecentPostsTitle}
                   </EditableText>
                </h4>
                <div className="recent-posts">
                  {recentPosts.map((post, idx) => (
                    <div key={idx} className="recent-post-item">
                      <div className="post-thumb"></div>
                      <div className="post-content">
                        <span className="post-date">{post.date}</span>
                        <h5 className="post-title">{post.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Banner Widget */}
              <div className="sidebar-widget promo-widget">
                <div 
                  className="promo-banner"
                  style={{
                    backgroundImage: `url(${promoImage || 'https://via.placeholder.com/320x350/D9D9D9/888888?text=Promo+Banner'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="promo-overlay">
                    <span>Special Offer</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>

        <style jsx>{`
          .blog-listing-wrapper {
            padding: 100px 5%;
            background-color: #ffffff;
          }
          .blog-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 40px;
          }

          /* Blog Grid */
          .blog-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          /* Blog Card */
          .blog-card {
            background: #F4F5FB;
            border-radius: 40px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
          }
          .blog-card.active-card {
            background: #2D4A8A;
            color: #ffffff;
          }
          .blog-card-image {
            width: 100%;
            height: 280px;
            border-radius: 30px;
            overflow: hidden;
            margin-bottom: 25px;
          }
          .blog-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .blog-card-info {
            text-align: center;
          }
          .blog-card-meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            font-size: 13px;
            margin-bottom: 20px;
            opacity: 0.8;
          }
          .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .blog-card-title {
            font-family: 'Marcellus', serif;
            font-size: 22px;
            line-height: 1.4;
            margin-bottom: 20px;
            font-weight: 400;
          }
          .explore-link {
            font-size: 14px;
            text-decoration: underline;
            color: inherit;
            font-weight: 600;
          }

          /* Sidebar */
          .blog-sidebar {
            position: relative;
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
          .sidebar-widget:last-child {
            margin-bottom: 0;
          }

          /* Search Widget */
          .search-box {
            position: relative;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 10px;
          }
          .search-box input {
            background: transparent;
            border: none;
            color: #ffffff;
            width: 100%;
            padding-right: 30px;
            font-family: 'Marcellus', serif;
            outline: none;
          }
          .search-box input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          .search-icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.8;
          }

          /* Sidebar Titles */
          .sidebar-title {
            font-family: 'Marcellus', serif;
            font-size: 32px;
            margin-bottom: 25px;
            font-weight: 400;
          }

          /* Category List */
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
            font-family: 'Lato', sans-serif;
            opacity: 0.9;
          }
          .category-list li:last-child {
            border-bottom: none;
          }

          /* Recent Posts */
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
          .recent-post-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
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
            font-weight: 400;
          }

          /* Promo Widget */
          .promo-banner {
            width: 100%;
            height: 350px;
            background: #D9D9D9;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
          }
          .promo-overlay {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 15px;
            text-align: center;
            color: #111;
            font-family: 'Marcellus', serif;
            font-weight: bold;
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .blog-container {
              grid-template-columns: 1fr 320px;
              gap: 30px;
            }
          }
          @media (max-width: 992px) {
            .blog-container {
              grid-template-columns: 1fr;
            }
            .blog-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .sidebar-inner {
              position: relative;
              top: 0;
            }
          }
          @media (max-width: 768px) {
            .blog-grid {
              grid-template-columns: 1fr;
            }
            .blog-card-image {
              height: 220px;
            }
            .sidebar-title {
              font-size: 28px;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default BlogListing;
