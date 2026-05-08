"use client";

import React, { useState, useEffect } from 'react';
import { fetchServices } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const defaultServices = [
  { title: "Follicular Unit Extraction (FUE)", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png", link: "#" },
  { title: "Follicular Unit Transplantation (FUT)", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/scwz5ugmiwn9npmzpk5d.png", link: "#" },
  { title: "Hair Replacement In Delhi – Non-Surgical Solutions", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/l141dtwrmlhc3xm8tlir.png", link: "#" },
  { title: "Scalp Treatments For Healthy Hair", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/kuhwci9p4pp7r7mzmxof.png", link: "#" }
];

export default function ServiceSlider() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchServices().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  // Only use fallbacks when data === null (not yet loaded)
  // Once DB data loads, always render DB values — no hardcoded override
  const title = data ? (data.title || '') : 'Our Hair Transplant Services';
  const subtitle = data ? (data.subtitle || '') : 'SERVICES';
  const viewAllText = data ? (data.viewAllText || 'View All') : 'View All';
  const viewAllLink = data ? (data.viewAllLink || '#') : '#';
  // Always ensure services is an array — defend against undefined/null from API
  const safeServices = Array.isArray(data?.services) ? data.services : null;
  const services = (safeServices && safeServices.length > 0)
    ? safeServices
    : defaultServices;

  // Duplicate for infinite loop effect — only when enough items exist
  const duplicatedServices = services.length >= 2 ? [...services, ...services] : [...services];

  return (
    <EditableSection sectionId="services" label="Services Slider">
      <section className="service-slider-section" style={{ backgroundColor: '#FFFAF1', padding: '80px 5%' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Top Area - Centered */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <img 
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                alt="icon" 
                style={{ width: '40px', height: 'auto' }} 
              />
              <EditableText sectionId="services" fieldPath="subtitle" tag="span" className="section-subtitle">
                {subtitle}
              </EditableText>
            </div>
            <h2 className="section-title">
              <EditableText sectionId="services" fieldPath="title" tag="span">
                {title}
              </EditableText>
            </h2>
            <a href={viewAllLink} style={{ position: 'absolute', right: 0, bottom: '10px', color: '#888', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditableText sectionId="services" fieldPath="viewAllText" tag="span">
                {viewAllText}
              </EditableText>
              <img 
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/qcrzwotm1zyqsdbu6ttb.png" 
                alt="arrow" 
                style={{ width: '10px', height: 'auto', transform: 'rotate(-90deg)' }} 
              />
            </a>
          </div>

          {/* Slider Container */}
          <div className="slider-wrapper" style={{ position: 'relative', padding: '0 10px' }}>
            <Swiper
              modules={[Navigation]}
              spaceBetween={25}
              slidesPerView={1}
              loop={true}
              navigation={{
                prevEl: '.service-prev-btn',
                nextEl: '.service-next-btn',
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }}
              style={{ padding: '10px 0 40px 0' }}
            >
              {duplicatedServices.map((service, index) => (
                <SwiperSlide key={index}>
                  <div 
                    className="service-card-item"
                    style={{ 
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '300px', 
                      borderRadius: '24px', 
                      overflow: 'hidden', 
                      marginBottom: '20px'
                    }}>
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      color: '#1C1C1C', 
                      textAlign: 'center', 
                      lineHeight: '1.4',
                      fontWeight: '500',
                      padding: '0 10px'
                    }}>
                      <EditableText sectionId="services" fieldPath={`services.${index % services.length}.title`} tag="span">
                        {service.title}
                      </EditableText>
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="service-prev-btn" style={navBtnStyle('left')}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777610955/dmc-trichology/acctki1o9lkpujrsmtqu.png" alt="prev" style={navImgStyle} />
            </button>
            <button className="service-next-btn" style={navBtnStyle('right')}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777610955/dmc-trichology/aevxkziamfrlmc14tpv1.png" alt="next" style={navImgStyle} />
            </button>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}

const navBtnStyle = (dir) => ({
  position: 'absolute',
  [dir]: '-20px',
  top: '40%',
  transform: 'translateY(-50%)',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: 'unset',
  border: 'none',
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0'
});

const navImgStyle = { width: '100%', height: '100%', borderRadius: '50%' };
