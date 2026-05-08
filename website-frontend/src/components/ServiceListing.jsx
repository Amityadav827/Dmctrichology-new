"use client";
import React, { useState, useMemo } from 'react';
import { Star, Clock, ChevronRight, Filter } from 'lucide-react';
import EditableText from './Editable/EditableText';

const ServiceListing = ({ services = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Memoize filtered services to improve performance
  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [services, activeCategory]);

  return (
    <section data-section-id="service-listing" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header & Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl text-gray-900 font-serif mb-3" style={{ fontFamily: 'Marcellus, serif' }}>
              Explore Our Expertise
            </h2>
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Showing {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
             <div className="flex items-center gap-2 mr-4 text-gray-400">
                <Filter size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filter By:</span>
             </div>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                activeCategory === 'all' 
                  ? 'bg-black text-white border-black shadow-[0_10px_20px_rgba(0,0,0,0.2)]' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-[#C19A5B] hover:text-[#C19A5B]'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                  activeCategory === cat.slug 
                    ? 'bg-black text-white border-black shadow-[0_10px_20px_rgba(0,0,0,0.2)]' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-[#C19A5B] hover:text-[#C19A5B]'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredServices.map((service, index) => (
            <div 
              key={service._id}
              className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-transparent hover:border-[#C19A5B]/20 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]"
            >
              {/* Image Container with Overlay */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={service.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png'} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {service.featured && (
                  <div className="absolute top-6 left-6 bg-[#C19A5B] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Top Rated
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full text-yellow-600">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black tracking-tighter">{service.rating || '4.9'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{service.duration || '60 min'}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-[#C19A5B] transition-colors duration-500 leading-snug" style={{ fontFamily: 'Marcellus, serif' }}>
                   {service.title}
                </h3>
                
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                   {service.shortDescription || 'Experience the highest standard of care with our specialized treatment options.'}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                   <a 
                    href={service.buttonLink || '#'}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-[#C19A5B] transition-all group/btn"
                   >
                     <span>{service.buttonText || 'Book Appointment'}</span>
                     <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover/btn:bg-[#C19A5B] group-hover/btn:text-white transition-all">
                        <ChevronRight size={12} />
                     </div>
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-8 text-gray-300">
               <Filter size={32} />
            </div>
            <h3 className="text-2xl font-serif text-gray-800 mb-4" style={{ fontFamily: 'Marcellus, serif' }}>No Treatments Found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
               We couldn't find any services in this category. Please try selecting a different category or contact us for assistance.
            </p>
            <button 
              onClick={() => setActiveCategory('all')}
              className="mt-10 text-[10px] font-black uppercase tracking-widest text-[#C19A5B] border-b border-[#C19A5B] pb-1 hover:opacity-70 transition-all"
            >
               View All Services
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServiceListing;
