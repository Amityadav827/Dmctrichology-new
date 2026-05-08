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
    // 1. Prioritize Builder Data if in edit mode
    if (isEditMode && siteConfig) {
        // Handle services array
        const builderServices = siteConfig['service-listing'];
        if (Array.isArray(builderServices)) {
            setServices(builderServices);
        } else if (initialServices) {
            // Apply granular updates from siteConfig (e.g. "service-listing.0.title")
            const updatedServices = [...initialServices];
            Object.keys(siteConfig).forEach(key => {
                if (key.startsWith('service-listing.')) {
                    const parts = key.split('.'); // ["service-listing", "0", "title"]
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

        // Handle categories if needed
        const builderCategories = siteConfig['service-listing-categories'];
        if (Array.isArray(builderCategories)) setCategories(builderCategories);
    } else {
        // 2. Otherwise use initial props
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
        {/* Sidebar Filter */}
        <aside className="service-sidebar">
          <div className="sidebar-sticky">
            <div className="results-count-premium">
              <span className="count-number">{filteredServices.length}</span>
              <span className="count-label">Results Found</span>
            </div>
            
            <div className="sidebar-divider"></div>

            <div className="filter-group">
              <div className="filter-group-header">
                <span className="filter-group-title">Filter by Category</span>
                <span className="filter-active-dot"></span>
              </div>
              
              <div className="filter-list-premium">
                <div 
                  className={`filter-item-premium ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  <div className="filter-indicator"></div>
                  <span className="filter-label">All Services</span>
                  <span className="filter-badge">{services.length}</span>
                </div>

                {categories.length > 0 ? categories.map((cat) => (
                  <div 
                    key={cat._id || cat.slug}
                    className={`filter-item-premium ${activeCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.slug)}
                  >
                    <div className="filter-indicator"></div>
                    <span className="filter-label">{cat.categoryName}</span>
                    <span className="filter-badge">
                      {services.filter(s => s.category === cat.slug).length}
                    </span>
                  </div>
                )) : (
                  <div className="text-[10px] text-gray-400 font-medium py-4 uppercase tracking-widest px-6">
                    No categories found
                  </div>
                )}
              </div>
            </div>

            {/* Premium Quote/Promo Card in Sidebar */}
            <div className="sidebar-promo-card">
              <h4>Expert Consultation</h4>
              <p>Get personalized advice from our top trichologists.</p>
              <Link href="/contact" className="promo-link">Book Now →</Link>
            </div>
          </div>
        </aside>

        {/* Main Grid Section */}
        <main className="service-premium-grid">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {filteredServices.map((service, index) => (
                <div 
                  key={service._id || index}
                  className="service-card-premium group"
                  data-section-id={`service-card-${index}`}
                >
                  <div className="service-card-inner">
                    <div className="service-card-image-box">
                      <EditableImage 
                        sectionId="service-listing"
                        fieldPath={`${index}.image`}
                        src={service.image || "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png"} 
                        alt={service.title} 
                        className="h-full w-full"
                        imgClassName="group-hover:scale-110 transition-transform duration-700 h-full w-full object-cover"
                      />
                      <div className="category-tag-floating">
                        {categories.find(c => c.slug === service.category)?.categoryName || service.category}
                      </div>
                    </div>

                    <div className="service-card-content">
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

                      <h3 className="service-card-title">
                        <EditableText sectionId="service-listing" fieldPath={`${index}.title`}>
                          {service.title}
                        </EditableText>
                      </h3>

                      <div className="service-card-description">
                        <EditableText sectionId="service-listing" fieldPath={`${index}.shortDescription`}>
                          {service.shortDescription}
                        </EditableText>
                      </div>

                      <div className="service-card-footer">
                        <Link 
                          href={service.buttonLink || "/contact"} 
                          className="service-card-cta"
                        >
                          <EditableText sectionId="service-listing" fieldPath={`${index}.buttonText`}>
                            {service.buttonText || "VIEW DETAILS"}
                          </EditableText>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Plus size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Services Found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Try selecting a different category or check back later for new services.</p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="mt-6 text-blue-600 font-bold hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </EditableSection>
  );
};

export default ServiceListing;
