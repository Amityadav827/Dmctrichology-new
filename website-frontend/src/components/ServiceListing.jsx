"use client";
import React, { useState, useMemo } from 'react';
import { Star, Clock } from 'lucide-react';
import EditableText from './Editable/EditableText';

const ServiceListing = ({ services = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [services, activeCategory]);

  return (
    <section data-section-id="service-listing" className="service-page-container">
      {/* Left Sidebar */}
      <aside className="service-sidebar">
        <div className="sidebar-results-count">
          {filteredServices.length} Results
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Types</h4>
          <div className="filter-group">
            <div 
              className={`filter-item ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <div className="filter-radio"></div>
              <span className="filter-label">All Services</span>
            </div>
            {categories.map((cat) => (
              <div 
                key={cat._id}
                className={`filter-item ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                <div className="filter-radio"></div>
                <span className="filter-label">{cat.categoryName}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="service-content-area">
        <div className="service-premium-grid">
          {filteredServices.map((service, index) => (
            <div 
              key={service._id}
              className="service-card-premium"
            >
              {/* Card Info Left */}
              <div className="service-card-info">
                <h3 className="service-card-title">
                   <EditableText sectionId="service-listing" fieldPath={`${index}.title`} value={service.title} />
                </h3>
                
                <div className="service-card-meta">
                  <div className="meta-item meta-rating">
                    <Star size={12} fill="currentColor" />
                    <span>{service.rating || '4.9'}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={12} />
                    <span>{service.duration || '60 mins'}</span>
                  </div>
                </div>

                <p className="service-card-desc">
                   <EditableText sectionId="service-listing" fieldPath={`${index}.shortDescription`} value={service.shortDescription} />
                </p>

                <button className="view-details-btn">
                   <EditableText sectionId="service-listing" fieldPath={`${index}.buttonText`} value={service.buttonText || 'View Details'} />
                </button>
              </div>

              {/* Card Image Right */}
              <div className="service-card-image-box">
                <img 
                  src={service.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png'} 
                  alt={service.title}
                />
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="service-card-title" style={{ fontSize: '24px' }}>No Treatments Found</h3>
            <p className="service-card-desc">
               We couldn't find any services in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceListing;
