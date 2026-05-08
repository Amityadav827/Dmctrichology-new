"use client";
import React, { useState } from 'react';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { EditableText } from '../context/BuilderContext';

const ServiceListing = ({ services = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <section data-section-id="service-listing" className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${
              activeCategory === 'all' 
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-black hover:text-black'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat.slug 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-black hover:text-black'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service, index) => (
            <div 
              key={service._id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png'} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {service.featured && (
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-900">{service.rating || '5.0'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{service.duration || '45-60 min'}</span>
                  </div>
                </div>

                <h3 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Marcellus, serif' }}>
                  <EditableText sectionId="service-listing" fieldPath={`${index}.title`} value={service.title} />
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                  <EditableText sectionId="service-listing" fieldPath={`${index}.shortDescription`} value={service.shortDescription} />
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <div 
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                   >
                     <EditableText sectionId="service-listing" fieldPath={`${index}.buttonText`} value={service.buttonText || 'Book Now'} />
                     <ChevronRight size={14} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-serif italic text-xl">No services found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServiceListing;
