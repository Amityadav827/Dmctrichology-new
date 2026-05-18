"use client";
import React, { useState, useEffect } from 'react';
import { Star, StarHalf, Clock } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';
import Link from 'next/link';
import { useBuilder } from '../context/BuilderContext';
import EditableSection from './Editable/EditableSection';

const renderListingStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    if (numericRating >= i) {
      stars.push(<Star key={i} size={11} fill="#F5B301" color="#F5B301" className="listing-star" />);
    } else if (numericRating >= i - 0.5) {
      stars.push(<StarHalf key={i} size={11} fill="#F5B301" color="#F5B301" className="listing-star" />);
    } else {
      stars.push(<Star key={i} size={11} color="#D1D5DB" className="listing-star" />);
    }
  }

  return stars;
};

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setServices(updatedServices);
      }

      const builderCategories = siteConfig['service-listing-categories'];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(builderCategories)) setCategories(builderCategories);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (initialServices) setServices(initialServices);
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

            {/* Results Count: large number + small label */}
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
                )) : null}
              </div>
            </div>

            {/* Sidebar Promo */}
            <div className="sidebar-promo-card">
              <h4>Expert Consultation</h4>
              <p>Get personalized advice from our top trichologists.</p>
              <Link href="/contact-us" className="promo-link">Book Now →</Link>
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
                >
                  {/*
                   * FIGMA CARD STRUCTURE:
                   * [LEFT: text content] [RIGHT: image]
                   * Controlled by CSS order: content=1, image=2
                   */}
                  <div className="service-card-inner">

                    {/* ─ LEFT: Text Content ─ */}
                    <div className="service-card-content">

                      {/* Title */}
                      <h3 className="service-card-title">
                        <EditableText sectionId="service-listing" fieldPath={`${index}.title`}>
                          {service.title}
                        </EditableText>
                      </h3>

                      {/* Rating + Duration */}
                      <div className="service-meta-row-premium">
                        <span className="rating-num-premium">
                          <EditableText sectionId="service-listing" fieldPath={`${index}.rating`}>
                            {String(service.rating || "4.8")}
                          </EditableText>
                        </span>
                        
                        <div className="listing-stars-box">
                          {renderListingStars(service.rating || 4.8)}
                        </div>

                        <span className="meta-separator-premium">•</span>
                        
                        <div className="service-duration-premium">
                          <Clock size={12} className="duration-icon-premium" />
                          <span>
                            <EditableText sectionId="service-listing" fieldPath={`${index}.duration`}>
                              {service.duration || "45 mins"}
                            </EditableText>
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="service-card-description">
                        <EditableText sectionId="service-listing" fieldPath={`${index}.shortDescription`}>
                          {service.shortDescription}
                        </EditableText>
                      </div>

                      {/* CTA Button — small outlined Figma style */}
                      <div className="service-card-footer">
                        <Link
                          href={`/details/${service.slug}`}
                          className="service-card-cta"
                        >
                          <EditableText sectionId="service-listing" fieldPath={`${index}.buttonText`}>
                            {service.buttonText || "View Details"}
                          </EditableText>
                        </Link>
                      </div>

                    </div>

                    {/* ─ RIGHT: Image ─ */}
                    <div className="service-card-image-box">
                      <EditableImage
                        sectionId="service-listing"
                        fieldPath={`${index}.image`}
                        src={service.image || "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png"}
                        alt={service.title}
                        className="h-full w-full"
                        imgClassName="h-full w-full object-cover"
                      />
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
                style={{
                  marginTop: '24px',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#111111',
                  background: 'none',
                  border: '1.5px solid #cccccc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '8px 18px'
                }}
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
