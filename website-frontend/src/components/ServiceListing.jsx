"use client";
import React, { useState, useEffect } from 'react';
import { Star, Clock } from 'lucide-react';
import EditableText from './Editable/EditableText';
import Link from 'next/link';

const ServiceListing = ({ services = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState(services);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(s => s.category === activeCategory));
    }
  }, [activeCategory, services]);

  return (
    <div className="service-page-container">
      {/* Sidebar Filter */}
      <aside className="service-sidebar">
        <div className="results-count">
          {filteredServices.length} Results
        </div>
        
        <div className="sidebar-divider"></div>

        <div className="filter-group-title">Types</div>
        
        <div className="filter-list">
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
      </aside>

      {/* Main Grid Section */}
      <main className="service-premium-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <div 
              key={service._id || index}
              className="service-card-premium"
              data-section-id={`service-card-${index}`}
            >
              <div className="service-card-content">
                <h3 className="service-card-title">
                  <EditableText sectionId={`service-card-${index}`} fieldPath="title">
                    {service.title}
                  </EditableText>
                </h3>

                <div className="service-meta-row">
                  <div className="service-rating">
                    <span className="star">★</span>
                    <span>
                      <EditableText sectionId={`service-card-${index}`} fieldPath="rating">
                        {service.rating || "4.8"}
                      </EditableText>
                    </span>
                  </div>
                  <div className="service-duration">
                    <Clock size={14} className="service-duration-icon" />
                    <span>
                      <EditableText sectionId={`service-card-${index}`} fieldPath="duration">
                        {service.duration || "45 mins"}
                      </EditableText>
                    </span>
                  </div>
                </div>

                <div className="service-card-description">
                  <EditableText sectionId={`service-card-${index}`} fieldPath="shortDescription">
                    {service.shortDescription}
                  </EditableText>
                </div>

                <Link 
                  href={service.buttonLink || "/contact"} 
                  className="service-card-cta"
                >
                  <EditableText sectionId={`service-card-${index}`} fieldPath="buttonText">
                    {service.buttonText || "VIEW DETAILS"}
                  </EditableText>
                </Link>
              </div>

              <div className="service-card-image-box">
                <img 
                  src={service.image || "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png"} 
                  alt={service.title} 
                />
              </div>
            </div>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceListing;
