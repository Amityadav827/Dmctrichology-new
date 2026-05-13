"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHomeBlog } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { formatDate } from '../utils/dateFormatter';

export default function BlogSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchHomeBlog();
      if (res?.success) setData(res.data);
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
      <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
               <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto' }} />
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
                style={{
                  backgroundColor: blog.featured ? '#000' : '#F9F7F2',
                  borderRadius: '40px',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: blog.featured ? 'none' : '1px solid rgba(0,0,0,0.05)'
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', marginBottom: '25px' }}>
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '30px' }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    left: '20px', 
                    backgroundColor: blog.featured ? 'rgba(255,255,255,0.9)' : '#000', 
                    color: blog.featured ? '#000' : '#fff', 
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div>
                     <img src={blog.authorIcon} alt="author" style={{ width: '32px' }} />
                  </div>
                  <span style={{ fontSize: '16px', color: blog.featured ? 'rgba(255,255,255,0.7)' : '#666', fontFamily: "'Marcellus', serif" }}>
                    <EditableText sectionId="blogs-home-section" fieldPath={`blogs.${index}.author`} tag="span">
                      {blog.author}
                    </EditableText>
                  </span>
                </div>

                <h3 style={{ 
                  fontSize: '24px', 
                  color: blog.featured ? '#fff' : '#000', 
                  fontFamily: "'Marcellus', serif", 
                  fontWeight: '400', 
                  marginBottom: '20px',
                  lineHeight: '1.3',
                  flexGrow: 1
                }}>
                  <EditableText sectionId="blogs-home-section" fieldPath={`blogs.${index}.title`} tag="span">
                    {blog.title}
                  </EditableText>
                </h3>

                <Link 
                  href={blog.buttonLink || '#'} 
                  style={{ 
                    fontSize: '14px', 
                    color: blog.featured ? '#fff' : '#000', 
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
            <button className="view-all-blogs-btn" style={{
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
              <img 
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/dh9kblxoinqmi5kvoona.png" 
                className="btn-arrow"
                alt="arrow" 
                style={{ width: '32px', height: '32px', transition: 'all 0.3s ease' }} 
              />
            </button>
          </div>

        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            section { padding: 60px 5% !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
