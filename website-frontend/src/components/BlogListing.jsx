"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';
import { Search, User } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { fetchBlogCategories } from '../services/api';

const BlogListing = ({ data: initialData, blogs: initialBlogs = [] }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [pageData, setPageData] = useState(initialData?.listing || {});
  const [blogs, setBlogs] = useState(initialBlogs);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  console.log("[BlogListing] Component initialized with:", {
    initialBlogsCount: initialBlogs?.length || 0,
    blogsStateCount: blogs?.length || 0
  });

  // Sync state when initialData changes (SSR data)
  useEffect(() => {
    if (initialData?.listing) {
      setPageData(initialData.listing);
    }

    // Check URL params for pre-filtering
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const cat = params.get('category');
    if (search) setSearchQuery(search);
    if (cat) setActiveCategory(cat);
  }, [initialData]);

  useEffect(() => {
    if (initialBlogs) {
      console.log("[BlogListing] Updating blogs state with initialBlogs:", initialBlogs.length);
      setBlogs(initialBlogs);
    }
  }, [initialBlogs]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchBlogCategories();
      if (res?.success) {
        setDynamicCategories(res.data);
      }
    };
    loadCategories();
  }, []);

  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
    promoImage = "",
    promoLink = "",
    promoButtonText = "Special Offer",
    categories = [],
    recentPosts = []
  } = pageData;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      let result = [...blogs];

      // Filter by Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(blog =>
          blog.title?.toLowerCase().includes(q) ||
          blog.category?.name?.toLowerCase().includes(q) ||
          blog.author?.toLowerCase().includes(q) ||
          blog.shortDescription?.toLowerCase().includes(q)
        );
      }

      // Filter by Category
      if (activeCategory !== "All") {
        result = result.filter(blog =>
          blog.category?.name?.toLowerCase() === activeCategory.toLowerCase()
        );
      }

      setFilteredBlogs(result);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, activeCategory, blogs]);

  // Handle category click
  const handleCategoryClick = (catName) => {
    setActiveCategory(catName);
  };

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedListing = JSON.parse(JSON.stringify(pageData));
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('blog-listing.listing.')) {
          hasChanges = true;
          const path = key.replace('blog-listing.listing.', '');

          if (path.includes('.')) {
            const parts = path.split('.');
            let current = updatedListing;
            for (let i = 0; i < parts.length - 1; i++) {
              const part = parts[i];
              if (!current[part]) {
                current[part] = isNaN(parts[i + 1]) ? {} : [];
              }
              current = current[part];
            }
            current[parts[parts.length - 1]] = siteConfig[key];
          } else {
            updatedListing[path] = siteConfig[key];
          }
        }
      });

      if (hasChanges) {
        setPageData(updatedListing);
      }
    }
  }, [isEditMode, siteConfig]);

  console.log("[BlogListing Frontend] Received count:", blogs.length, "Rendering count of blogs in grid:", filteredBlogs.length);
  return (
    <EditableSection sectionId="blog-listing" label="Blog Listing Section">
      <section className="blog-listing-wrapper">
        <div className="blog-container">

          {/* Left Side: Blog Grid */}
          <div className="blog-grid-content">
            <div className="blog-grid">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, idx) => (
                  <div key={idx} className="blog-card">
                    {/* Image with date pill overlay — same as homepage */}
                    <div className="blog-card-image">
                      <Link href={`/blog/${blog.slug}`}>
                        <img src={blog.blogImage || 'https://via.placeholder.com/600x400'} alt={blog.title} />
                      </Link>
                      <div className="blog-card-date-pill">
                        {formatDate(blog.blogDate || blog.date)}
                      </div>
                    </div>
                    {/* Author row — blue circle icon + name */}
                    <div className="blog-card-author-row">
                      <div className="blog-card-author-icon">
                        <User size={14} />
                      </div>
                      <span className="blog-card-author-name">{blog.author}</span>
                    </div>
                    {/* Title */}
                    <h3 className="blog-card-title">
                      <Link href={`/blog/${blog.slug}`} className="blog-title-link">
                        {blog.title}
                      </Link>
                    </h3>
                    {/* Explore link */}
                    <Link href={`/blog/${blog.slug}`} className="explore-link">
                      Explore More
                    </Link>
                  </div>
                ))
              ) : (
                <div className="no-blogs-found" style={{ gridColumn: '1/-1', padding: '100px 0', textAlign: 'center', fontFamily: 'Marcellus', fontSize: '24px', color: '#1a3760' }}>
                  No matching blogs found
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-inner">
              {/* Search Widget */}
              <div className="sidebar-widget search-widget">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder={sidebarSearchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                  <li
                    className={activeCategory === "All" ? "active" : ""}
                    onClick={() => setActiveCategory("All")}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="category-name">All Categories</span>
                    <span className="count">({blogs.length})</span>
                  </li>
                  {dynamicCategories.map((cat, idx) => (
                    <li
                      key={idx}
                      className={activeCategory === cat.name ? "active" : ""}
                      onClick={() => setActiveCategory(cat.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="category-name">
                        {cat.name}
                      </span>
                      <span className="count">
                        ({cat.count})
                      </span>
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
                  {(blogs.slice(0, 4)).map((post, idx) => (
                    <div key={idx} className="recent-post-item">
                      <div
                        className="post-thumb"
                        style={{
                          backgroundImage: `url(${post.blogImage || post.image || 'https://via.placeholder.com/80'})`,
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
                          <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {post.title}
                          </Link>
                        </h5>
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
                    <EditableText sectionId="blog-listing" fieldPath="listing.promoButtonText">
                      {promoButtonText}
                    </EditableText>
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

          /* ── Blog Card — matches homepage .home-blog-card exactly ── */
          .blog-card {
            background: #E8EAF6;
            border-radius: 40px;
            padding: 25px;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0,0,0,0.05);
            transition: background 0.3s ease;
            cursor: pointer;
          }
          /* Hover: card turns solid blue — exactly like homepage */
          .blog-card:hover {
            background: #3B5998;
          }

          /* Image wrapper */
          .blog-card-image {
            width: 100%;
            height: 280px;
            border-radius: 30px;
            overflow: hidden;
            margin-bottom: 25px;
            position: relative;
          }
          .blog-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* Date pill — overlaid top-left on image */
          .blog-card-date-pill {
            position: absolute;
            top: 20px;
            left: 20px;
            background: #3B5998;
            color: #ffffff;
            padding: 6px 20px;
            border-radius: 30px;
            font-size: 13px;
            font-family: 'Marcellus', serif;
            transition: background 0.3s ease, color 0.3s ease;
          }
          /* Hover: pill inverts to white */
          .blog-card:hover .blog-card-date-pill {
            background: #ffffff;
            color: #000000;
          }

          /* Author row */
          .blog-card-author-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
          }
          .blog-card-author-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #3B5998;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: #ffffff;
            transition: background 0.3s ease, color 0.3s ease;
          }
          /* Hover: author icon inverts */
          .blog-card:hover .blog-card-author-icon {
            background: #ffffff;
            color: #3B5998;
          }
          .blog-card-author-name {
            font-size: 16px;
            color: #000000;
            font-family: 'Marcellus', serif;
            transition: color 0.3s ease;
          }

          /* Blog title */
          .blog-card-title {
            font-family: 'Marcellus', serif;
            font-size: 22px;
            line-height: 1.4;
            margin-bottom: 20px;
            font-weight: 400;
            flex-grow: 1;
            color: #000000;
          }

          /* Hover: all text turns white */
          .blog-card:hover .blog-card-author-name,
          .blog-card:hover .blog-card-title,
          .blog-card:hover .blog-title-link,
          .blog-card:hover .explore-link {
            color: #ffffff;
          }

          .blog-title-link {
            color: inherit;
            text-decoration: none !important;
          }
          .explore-link {
            font-size: 14px;
            color: #000000;
            font-weight: 600;
            font-family: 'Marcellus', serif;
            text-decoration: underline !important;
            display: inline-block;
            transition: color 0.3s ease;
          }

          /* Sidebar */
          .blog-sidebar {
            position: relative;
          }
          .sidebar-inner {
            position: sticky;
            top: 100px;
            background: #3B5998;
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
          .search-icon {
            opacity: 0.8;
            flex-shrink: 0;
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
