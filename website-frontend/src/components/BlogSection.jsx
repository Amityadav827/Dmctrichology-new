"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchBlogs, fetchHomeBlog } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { formatDate } from '../utils/dateFormatter';

const getBlogTimestamp = (blog = {}) => {
  const dateValue = blog.blogDate || blog.date || blog.createdAt || blog.updatedAt;
  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const mapLatestBlog = (blog = {}) => ({
  image: blog.blogImage || blog.image || blog.bannerImage || 'https://via.placeholder.com/600x400',
  title: blog.title || '',
  author: blog.author || 'DMC',
  date: blog.blogDate || blog.date || blog.createdAt || blog.updatedAt,
  buttonText: 'Explore More',
  buttonLink: blog.slug ? `/blog/${blog.slug}` : '/blog',
});

export default function BlogSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [homeRes, blogsRes] = await Promise.all([
        fetchHomeBlog(),
        fetchBlogs({ status: 'Published' }),
      ]);

      const latestBlogs = Array.isArray(blogsRes?.data)
        ? blogsRes.data
            .filter(blog => String(blog.status || 'Published').toLowerCase() === 'published')
            .sort((a, b) => getBlogTimestamp(b) - getBlogTimestamp(a))
            .slice(0, 3)
            .map(mapLatestBlog)
        : [];

      if (homeRes?.success) {
        setData({
          ...homeRes.data,
          blogs: latestBlogs.length > 0 ? latestBlogs : (homeRes.data?.blogs || []),
        });
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'blogs-home-section') {
        const { fieldPath, value } = e.detail;
        setData(prev => {
          if (!prev) return prev;
          const newData = { ...prev };
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let curr = newData;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = value;
          } else {
            newData[fieldPath] = value;
          }
          return newData;
        });
      }
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  if (!data?.enabled && data !== null) return null;

  const badgeText = data?.badgeText || "OUR LATEST BLOGS";
  const heading = data?.heading || "News & Wellness Advice";
  const subtitle = data?.subtitle || "Our Expert Therapists Work With You To Create Tailored Recovery Plans That Target Your Specific Needs And Goals.";
  const blogs = data?.blogs || [];

  return (
    <EditableSection sectionId="blogs-home-section" label="News & Wellness Advice">
      <section className="blogs-home-section" style={{ padding: '0 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="blog-section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
               <span className="blog-section-line" aria-hidden="true"></span>
               <EditableText sectionId="blogs-home-section" fieldPath="badgeText" tag="span" className="section-subtitle">
                 {badgeText}
               </EditableText>
            </div>
            <h2 className="section-title">
              <EditableText sectionId="blogs-home-section" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '15px', color: '#666', fontFamily: "'Marcellus', serif", lineHeight: '1.6' }}>
              <EditableText sectionId="blogs-home-section" fieldPath="subtitle" tag="span">
                {subtitle}
              </EditableText>
            </p>
          </div>

          {/* Blog Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
            {blogs.map((blog, index) => (
              <div 
                key={index} 
                className="home-blog-card"
                style={{
                  backgroundColor: '#E8EAF6',
                  borderRadius: '40px',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', marginBottom: '25px' }}>
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '30px' }} 
                  />
                  <div className="home-blog-date-pill" style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    left: '20px', 
                    backgroundColor: '#3B5998', 
                    color: '#fff', 
                    padding: '6px 20px', 
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontFamily: "'Marcellus', serif"
                  }}>
                    <EditableText sectionId="blogs-home-section" fieldPath={`blogs.${index}.date`} tag="span">
                      {formatDate(blog.date)}
                    </EditableText>
                  </div>
                </div>

                {/* Content */}
                <div className="home-blog-author-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div className="home-blog-author-icon">
                     <img src="/icons/blog/author.svg" alt="author" />
                  </div>
                  <span className="home-blog-author" style={{ fontSize: '16px', color: '#000', fontFamily: "'Marcellus', serif" }}>
                    <EditableText sectionId="blogs-home-section" fieldPath={`blogs.${index}.author`} tag="span">
                      {blog.author}
                    </EditableText>
                  </span>
                </div>

                <h3 className="home-blog-title" style={{ 
                  fontSize: '24px', 
                  color: '#000', 
                  fontFamily: "'Marcellus', serif", 
                  fontWeight: '400', 
                  marginBottom: '20px',
                  lineHeight: '1.3',
                  flexGrow: 1
                }}>
                  <Link className="home-blog-title-link" href={blog.buttonLink || '/blog'}>
                    <EditableText sectionId="blogs-home-section" fieldPath={`blogs.${index}.title`} tag="span">
                      {blog.title}
                    </EditableText>
                  </Link>
                </h3>

                <Link 
                  className="home-blog-link"
                  href={blog.buttonLink || '#'} 
                  style={{ 
                    fontSize: '14px', 
                    color: '#000', 
                    fontFamily: "'Marcellus', serif", 
                    textDecoration: 'underline',
                    fontWeight: 'bold'
                  }}
                >
                  <EditableText sectionId="blogs-home-section" fieldPath={`blogs.${index}.buttonText`} tag="span">
                    {blog.buttonText}
                  </EditableText>
                </Link>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/blog" className="view-all-blogs-btn" style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 15px 10px 25px',
              borderRadius: '50px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: "'Marcellus', serif",
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              zIndex: 1
            }}>
              View All
              <span className="blog-btn-arrow-wrap">
                <img 
                  src="/icons/faq-view-all-icon.svg"
                  className="blog-btn-arrow"
                  alt="arrow" 
                  style={{ width: '12px', height: '9px' }} 
                />
              </span>
            </Link>
          </div>

        </div>

        <style jsx>{`
          .home-blog-card:hover {
            background-color: #3B5998 !important;
            border-color: transparent !important;
          }

          .home-blog-card:hover .home-blog-author,
          .home-blog-card:hover .home-blog-title,
          .home-blog-card:hover .home-blog-title-link,
          .home-blog-card:hover .home-blog-link {
            color: #fff !important;
          }

          .home-blog-card:hover .home-blog-date-pill {
            background-color: #fff !important;
            color: #000 !important;
          }

          .home-blog-card:hover .home-blog-link,
          .home-blog-card:hover .home-blog-link span {
            color: #fff !important;
          }

          :global(.home-blog-card:hover .home-blog-link),
          :global(.home-blog-card:hover .home-blog-link span),
          :global(.home-blog-card:hover .home-blog-title-link),
          :global(.home-blog-card:hover .home-blog-title-link span) {
            color: #fff !important;
          }

          .home-blog-title-link {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .blog-section-line {
            width: 48px;
            height: 1px;
            background-color: #3B5998;
            position: relative;
            display: inline-block;
          }

          .blog-section-line::after {
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #3B5998;
            position: absolute;
            right: -4px;
            top: 50%;
            transform: translateY(-50%);
          }

          .blog-section-eyebrow .section-subtitle {
            color: #3B5998 !important;
          }

          .home-blog-author-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #3B5998;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            transition: background-color 0.3s ease;
          }

          .home-blog-author-icon img {
            width: 15px;
            height: 15px;
            object-fit: contain;
            filter: brightness(0) invert(1);
            transition: filter 0.3s ease;
          }

          .home-blog-card:hover .home-blog-author-icon {
            background-color: #fff;
          }

          .home-blog-card:hover .home-blog-author-icon img {
            filter: brightness(0) saturate(100%) invert(34%) sepia(19%) saturate(1704%) hue-rotate(183deg) brightness(92%) contrast(89%);
          }

          .view-all-blogs-btn:hover {
            background-color: #3B5998 !important;
            color: #fff !important;
            border-color: #3B5998 !important;
            box-shadow: 0 12px 24px rgba(59, 89, 152, 0.22);
          }

          .blog-btn-arrow-wrap {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #3B5998;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-45deg);
            transition: transform 0.3s ease;
          }

          .blog-btn-arrow {
            filter: brightness(0) invert(1);
            transition: transform 0.3s ease;
          }

          .view-all-blogs-btn:hover .blog-btn-arrow {
            transform: translateX(2px);
          }

          :global(.view-all-blogs-btn:hover .blog-btn-arrow) {
            transform: translateX(2px) !important;
          }

          @media (max-width: 1199px) {
            section {
              padding: 64px 4% !important;
              overflow: hidden;
            }
            section .section-title {
              font-size: clamp(34px, 5vw, 48px) !important;
              line-height: 1.1 !important;
            }
            .home-blog-card {
              border-radius: 30px !important;
            }
            .home-blog-card img {
              max-width: 100%;
            }
          }
          @media (max-width: 768px) {
            section { padding: 48px 16px !important; }
            section > div > div:first-child {
              margin-bottom: 34px !important;
            }
            section .section-title {
              font-size: clamp(30px, 8.5vw, 40px) !important;
            }
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
            .home-blog-card {
              padding: 18px !important;
              border-radius: 24px !important;
            }
            .home-blog-card img {
              height: 220px !important;
              border-radius: 20px !important;
            }
            .home-blog-title {
              font-size: 22px !important;
            }
            .view-all-blogs-btn {
              width: 100%;
              justify-content: center;
            }
          }
          @media (max-width: 390px) {
            .home-blog-card img {
              height: 190px !important;
            }
            .home-blog-date-pill {
              left: 12px !important;
              top: 12px !important;
              padding: 5px 12px !important;
              font-size: 12px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
