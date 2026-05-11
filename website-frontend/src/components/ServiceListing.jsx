"use client";
import React, { useState, useEffect } from 'react';
import { Star, Clock } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';
import Link from 'next/link';
import { useBuilder } from '../context/BuilderContext';
import EditableSection from './Editable/EditableSection';

const ServiceListing = ({ services: initialServices = [], categories: initialCategories = [] }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState(initialServices);
  const [categories, setCategories] = useState(initialCategories);

  // Sync with visual builder or props
  useEffect(() => {
    if (isEditMode && siteConfig) {
      const builderServices = siteConfig['service-listing'];
      if (Array.isArray(builderServices)) {
        setServices(builderServices);
      } else if (initialServices) {
        const updatedServices = [...initialServices];
        Object.keys(siteConfig).forEach(key => {
          if (key.startsWith('service-listing.')) {
            const parts = key.split('.');
            if (parts.length === 3) {
              const index = parseInt(parts[1], 10);
              const field = parts[2];
              if (updatedServices[index]) {
                updatedServices[index] = { ...updatedServices[index], [field]: siteConfig[key] };
              }
            }
          }
        });
        setServices(updatedServices);
      }

      const builderCategories = siteConfig['service-listing-categories'];
      if (Array.isArray(builderCategories)) setCategories(builderCategories);
    } else {
      if (initialServices) setServices(initialServices);
      if (initialCategories) setCategories(initialCategories);
    }
  }, [initialServices, initialCategories, isEditMode, siteConfig]);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <EditableSection sectionId="service-listing" label="Services Grid">
      <div className="service-page-container">

        {/* ─── LEFT SIDEBAR ─────────────────────────────── */}
        <aside className="service-sidebar">
          <div className="sidebar-sticky">

            {/* Results Count */}
            <div className="results-count-premium">
              <span className="count-number">{filteredServices.length}</span>
              <span className="count-label">Results Found</span>
            </div>

            {/* Category Filters */}
            <div className="filter-group">
              <div className="filter-group-header">
                <span className="filter-group-title">Filter by Category</span>
                <span className="filter-active-dot"></span>
              </div>

              <div className="filter-list-premium">
                {/* All Services */}
                <div
                  className={`filter-item-premium ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setActiveCategory('all')}
                >
                  <div className="filter-indicator"></div>
                  <span className="filter-label">All Services</span>
                  <span className="filter-badge">{services.length}</span>
                </div>

                {/* Dynamic Categories */}
                {categories.length > 0 ? categories.map((cat) => (
                  <div
                    key={cat._id || cat.slug}
                    className={`filter-item-premium ${activeCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setActiveCategory(cat.slug)}
                  >
                    <div className="filter-indicator"></div>
                    <span className="filter-label">{cat.categoryName}</span>
                    <span className="filter-badge">
                      {services.filter(s => s.category === cat.slug).length}
                    </span>
                  </div>
                )) : (
                  <div className="text-[10px] text-gray-400 font-medium py-4 uppercase tracking-widest px-2">
                    No categories found
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Promo */}
            <div className="sidebar-promo-card">
              <h4>Expert Consultation</h4>
              <p>Get personalized advice from our top trichologists.</p>
              <Link href="/contact" className="promo-link">Book Now →</Link>
            </div>
          </div>
        </aside>

        {/* ─── MAIN GRID ────────────────────────────────── */}
        <main className="service-premium-grid">
          {filteredServices.length > 0 ? (
            <div className="grid">
              {filteredServices.map((service, index) => (
                <div
                  key={service._id || index}
                  className="service-card-premium group"
                  data-section-id={`service-card-${index}`}
                >
                  <div className="service-card-inner">

                    {/* ─ Card Image ─ */}
                    <div className="service-card-image-box">
                      <EditableImage
                        sectionId="service-listing"
                        fieldPath={`${index}.image`}
                        src={service.image || "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png"}
                        alt={service.title}
                        className="h-full w-full"
                        imgClassName="h-full w-full object-cover"
                      />
                      {/* Floating Category Badge */}
                      <div className="category-tag-floating">
                        {categories.find(c => c.slug === service.category)?.categoryName || service.category || 'Treatment'}
                      </div>
                    </div>

                    {/* ─ Card Content ─ */}
                    <div className="service-card-content">
                      {/* Rating + Duration */}
                      <div className="service-meta-row">
                        <div className="service-rating">
                          <Star size={12} fill="#D4AF37" color="#D4AF37" />
                          <span>
                            <EditableText sectionId="service-listing" fieldPath={`${index}.rating`}>
                              {service.rating || "4.8"}
                            </EditableText>
                          </span>
                        </div>
                        <div className="service-duration">
                          <Clock size={12} className="service-duration-icon" />
                          <span>
                            <EditableText sectionId="service-listing" fieldPath={`${index}.duration`}>
                              {service.duration || "45 mins"}
                            </EditableText>
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="service-card-title">
                        <EditableText sectionId="service-listing" fieldPath={`${index}.title`}>
                          {service.title}
                        </EditableText>
                      </h3>

                      {/* Description */}
                      <div className="service-card-description">
                        <EditableText sectionId="service-listing" fieldPath={`${index}.shortDescription`}>
                          {service.shortDescription}
                        </EditableText>
                      </div>
                    </div>

                    {/* ─ Card Footer / CTA ─ */}
                    <div className="service-card-footer">
                      <Link
                        href={service.buttonLink || "/contact"}
                        className="service-card-cta"
                      >
                        <EditableText sectionId="service-listing" fieldPath={`${index}.buttonText`}>
                          {service.buttonText || "View Details"}
                        </EditableText>
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="service-empty-state">
              <h3>No Services Found</h3>
              <p>Try selecting a different category or check back later.</p>
              <button
                onClick={() => setActiveCategory('all')}
                style={{ marginTop: '24px', fontFamily: "'Lato', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#111111', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1.5px solid #111111', paddingBottom: '2px' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>

      </div>
    </EditableSection>
  );
};

export default ServiceListing;
