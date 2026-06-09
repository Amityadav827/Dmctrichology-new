"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';
import { Search, User } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { getBlogDisplayDescription } from '../utils/blogExcerpt';
import { fetchBlogCategories, fetchBlogs } from '../services/api';

const BLOGS_PER_PAGE = 10;

const getBlogItems = (response) => response?.blogs || response?.data || [];

const normalizePagination = (source = {}, fallbackPage = 1, fallbackTotal = 0) => {
  const totalBlogs = Number(source.totalBlogs ?? source.pagination?.total ?? fallbackTotal) || 0;
  const totalPages = Math.max(1, Number(source.totalPages ?? source.pagination?.totalPages ?? 1) || 1);
  const currentPage = Math.min(
    Math.max(Number(source.currentPage ?? source.pagination?.page ?? fallbackPage) || 1, 1),
    totalPages
  );

  return {
    totalBlogs,
    totalPages,
    currentPage,
    hasNextPage: Boolean(source.hasNextPage ?? source.pagination?.hasNextPage ?? currentPage < totalPages),
    hasPreviousPage: Boolean(source.hasPreviousPage ?? source.pagination?.hasPreviousPage ?? currentPage > 1),
  };
};

const BlogListing = ({
  data: initialData,
  blogs: initialBlogs = [],
  recentBlogs: initialRecentBlogs = [],
  pagination: initialPagination,
  initialFilters = {},
}) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [pageData, setPageData] = useState(initialData?.listing || {});
  const [blogs, setBlogs] = useState(initialBlogs);
  const [recentBlogs] = useState(initialRecentBlogs);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [activeCategory, setActiveCategory] = useState(initialFilters.categoryId || "All");
  const [paginationState, setPaginationState] = useState(() =>
    normalizePagination(initialPagination, 1, initialBlogs.length)
  );
  const [isLoading, setIsLoading] = useState(false);
  const searchDebounceReady = useRef(false);

  useEffect(() => {
    if (initialData?.listing) {
      setPageData(initialData.listing);
    }
  }, [initialData]);

  useEffect(() => {
    setBlogs(initialBlogs);
    setPaginationState(normalizePagination(initialPagination, 1, initialBlogs.length));
  }, [initialBlogs, initialPagination]);

  const updateUrl = useCallback(({ page, search, categoryId }) => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.delete("search");
    params.delete("category");
    params.delete("categoryId");

    if (page > 1) params.set("page", String(page));
    if (search?.trim()) params.set("search", search.trim());
    if (categoryId && categoryId !== "All") params.set("categoryId", categoryId);

    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, []);

  const loadBlogs = useCallback(async ({ page = 1, search = searchQuery, categoryId = activeCategory } = {}) => {
    setIsLoading(true);

    try {
      const trimmedSearch = search.trim();
      const params = {
        status: 'Published',
        page,
        limit: BLOGS_PER_PAGE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        ...(categoryId && categoryId !== "All" ? { categoryId } : {}),
      };

      const response = await fetchBlogs(params);
      const nextBlogs = getBlogItems(response);
      const nextPagination = normalizePagination(response, page, nextBlogs.length);

      setBlogs(nextBlogs);
      setPaginationState(nextPagination);
      updateUrl({
        page: nextPagination.currentPage,
        search: trimmedSearch,
        categoryId,
      });
    } catch (error) {
      console.error("[BlogListing] Failed to load paginated blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchQuery, updateUrl]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchBlogCategories();
      if (res?.success) {
        setDynamicCategories(res.data || []);

        const params = new URLSearchParams(window.location.search);
        const categoryName = params.get('category');
        const categoryId = params.get('categoryId');

        if (!categoryId && categoryName) {
          const matchedCategory = (res.data || []).find((cat) =>
            cat.name?.toLowerCase() === categoryName.toLowerCase() ||
            cat.slug?.toLowerCase() === categoryName.toLowerCase()
          );

          if (matchedCategory?.id) {
            setActiveCategory(matchedCategory.id);
          }
        }
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!searchDebounceReady.current) {
      searchDebounceReady.current = true;
      return;
    }

    const handler = setTimeout(() => {
      loadBlogs({ page: 1, search: searchQuery, categoryId: activeCategory });
    }, 300);

    return () => clearTimeout(handler);
  }, [activeCategory, loadBlogs, searchQuery]);

  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
  } = pageData;

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > paginationState.totalPages || page === paginationState.currentPage || isLoading) {
      return;
    }

    loadBlogs({ page, search: searchQuery, categoryId: activeCategory });
  };

  const handlePaginationClick = (event, page, disabled = false) => {
    event.preventDefault();
    if (!disabled) {
      handlePageChange(page);
    }
  };

  const getPaginationHref = (page) => {
    const params = new URLSearchParams();
    const trimmedSearch = searchQuery.trim();

    if (page > 1) params.set("page", String(page));
    if (trimmedSearch) params.set("search", trimmedSearch);
    if (activeCategory && activeCategory !== "All") params.set("categoryId", activeCategory);

    const query = params.toString();
    return `/blog${query ? `?${query}` : ""}`;
  };

  const pageNumbers = useMemo(
    () => Array.from({ length: paginationState.totalPages }, (_, index) => index + 1),
    [paginationState.totalPages]
  );

  const recentPosts = recentBlogs.length > 0 ? recentBlogs : blogs.slice(0, 4);
  const allCategoryCount = dynamicCategories.reduce((total, cat) => total + (Number(cat.count) || 0), 0)
    || paginationState.totalBlogs
    || blogs.length;

  useEffect(() => {
    if (isEditMode && siteConfig) {
      setPageData((currentPageData) => {
        const updatedListing = JSON.parse(JSON.stringify(currentPageData));
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

        return hasChanges ? updatedListing : currentPageData;
      });
    }
  }, [isEditMode, siteConfig]);

  return (
    <EditableSection sectionId="blog-listing" label="Blog Listing Section">
      <section className="blog-listing-wrapper">
        <div className="blog-container">
          <div className={`blog-grid-content ${isLoading ? 'is-loading' : ''}`}>
            <div className="blog-grid">
              {blogs.length > 0 ? (
                blogs.map((blog) => {
                  const description = getBlogDisplayDescription(blog);

                  return (
                    <div key={blog.id || blog._id || blog.slug} className="blog-card">
                      <div className="blog-card-image">
                        <Link href={`/blog/${blog.slug}`}>
                          <img src={blog.blogImage || 'https://via.placeholder.com/600x400'} alt={blog.title} />
                        </Link>
                        <div className="blog-card-date-pill">
                          {formatDate(blog.blogDate || blog.date)}
                        </div>
                      </div>
                      <div className="blog-card-author-row">
                        <div className="blog-card-author-icon">
                          <User size={14} />
                        </div>
                        <span className="blog-card-author-name">{blog.author}</span>
                      </div>
                      <h3 className="blog-card-title">
                        <Link href={`/blog/${blog.slug}`} className="blog-title-link">
                          {blog.title}
                        </Link>
                      </h3>
                      {description && (
                        <p className="blog-card-description">
                          {description}
                        </p>
                      )}
                      <Link href={`/blog/${blog.slug}`} className="explore-link">
                        Explore More
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="no-blogs-found">
                  No matching blogs found
                </div>
              )}
            </div>

            {paginationState.totalPages > 1 && (
              <nav className="blog-pagination" aria-label="Blog pagination">
                <a
                  href={getPaginationHref(paginationState.currentPage - 1)}
                  className={`pagination-button ${!paginationState.hasPreviousPage || isLoading ? 'disabled' : ''}`}
                  aria-disabled={!paginationState.hasPreviousPage || isLoading}
                  onClick={(event) => handlePaginationClick(
                    event,
                    paginationState.currentPage - 1,
                    !paginationState.hasPreviousPage || isLoading
                  )}
                >
                  Previous
                </a>

                {pageNumbers.map((page) => (
                  <a
                    key={page}
                    href={getPaginationHref(page)}
                    className={`pagination-number ${page === paginationState.currentPage ? 'active' : ''}`}
                    aria-current={page === paginationState.currentPage ? 'page' : undefined}
                    aria-disabled={isLoading}
                    onClick={(event) => handlePaginationClick(event, page, isLoading)}
                  >
                    {page}
                  </a>
                ))}

                <a
                  href={getPaginationHref(paginationState.currentPage + 1)}
                  className={`pagination-button ${!paginationState.hasNextPage || isLoading ? 'disabled' : ''}`}
                  aria-disabled={!paginationState.hasNextPage || isLoading}
                  onClick={(event) => handlePaginationClick(
                    event,
                    paginationState.currentPage + 1,
                    !paginationState.hasNextPage || isLoading
                  )}
                >
                  Next
                </a>
              </nav>
            )}
          </div>

          <aside className="blog-sidebar">
            <div className="sidebar-inner">
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

              <div className="sidebar-widget">
                <h4 className="sidebar-title">
                  <EditableText sectionId="blog-listing" fieldPath="listing.sidebarCategoriesTitle">
                    {sidebarCategoriesTitle}
                  </EditableText>
                </h4>
                <ul className="category-list">
                  <li
                    className={activeCategory === "All" ? "active" : ""}
                    onClick={() => handleCategoryClick("All")}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="category-name">All Categories</span>
                    <span className="count">({allCategoryCount})</span>
                  </li>
                  {dynamicCategories.map((cat) => (
                    <li
                      key={cat.id || cat.slug || cat.name}
                      className={activeCategory === cat.id ? "active" : ""}
                      onClick={() => handleCategoryClick(cat.id)}
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

              <div className="sidebar-widget">
                <h4 className="sidebar-title">
                  <EditableText sectionId="blog-listing" fieldPath="listing.sidebarRecentPostsTitle">
                    {sidebarRecentPostsTitle}
                  </EditableText>
                </h4>
                <div className="recent-posts">
                  {recentPosts.map((post) => (
                    <div key={post.id || post._id || post.slug} className="recent-post-item">
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

          .blog-grid-content.is-loading {
            opacity: 0.65;
            pointer-events: none;
          }
          .blog-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

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
          .blog-card:hover {
            background: #3B5998;
          }

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
          .blog-card:hover .blog-card-date-pill {
            background: #ffffff;
            color: #000000;
          }

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

          .blog-card-title {
            font-family: 'Marcellus', serif;
            font-size: 22px;
            line-height: 1.4;
            margin-bottom: 12px;
            font-weight: 400;
            color: #000000;
          }
          .blog-card-description {
            color: #666;
            display: -webkit-box;
            flex-grow: 1;
            font-family: 'Lato', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 20px;
            max-height: 3.2em;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .blog-card:hover .blog-card-author-name,
          .blog-card:hover .blog-card-title,
          .blog-card:hover .blog-card-description,
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

          .no-blogs-found {
            grid-column: 1/-1;
            padding: 100px 0;
            text-align: center;
            font-family: 'Marcellus', serif;
            font-size: 24px;
            color: #1a3760;
          }

          .blog-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 45px;
          }
          .pagination-button,
          .pagination-number {
            min-width: 44px;
            height: 44px;
            border: 1px solid rgba(59, 89, 152, 0.25);
            border-radius: 999px;
            background: #ffffff;
            color: #3B5998;
            font-family: 'Lato', sans-serif;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none !important;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          }
          .pagination-button {
            padding: 0 18px;
          }
          .pagination-button:hover:not(.disabled),
          .pagination-number:hover:not(.disabled),
          .pagination-number.active {
            background: #3B5998;
            border-color: #3B5998;
            color: #ffffff;
          }
          .pagination-button.disabled,
          .pagination-number.disabled {
            cursor: not-allowed;
            opacity: 0.45;
          }

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

          .sidebar-title {
            font-family: 'Marcellus', serif;
            font-size: 32px;
            margin-bottom: 25px;
            font-weight: 400;
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
            font-family: 'Lato', sans-serif;
            opacity: 0.9;
          }
          .category-list li.active {
            opacity: 1;
            font-weight: 700;
          }
          .category-list li:last-child {
            border-bottom: none;
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
