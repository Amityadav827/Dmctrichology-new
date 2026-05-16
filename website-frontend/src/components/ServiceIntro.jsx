"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, EffectFade } from 'swiper/modules';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';

const DUMMY_IMAGES = [
  {
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    title: "Expert Care",
    alt: "Expert Care Team"
  },
  {
    image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    title: "Advanced Technology",
    alt: "Advanced Technology"
  }
];

const ServiceIntro = ({ data = {}, banner = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [bannerData, setBannerData] = useState(banner);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  // Sync from props
  useEffect(() => {
    if (data) setIntroData(data);
    if (banner) setBannerData(banner);
  }, [data, banner]);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasIntroUpdates = false;
      let hasBannerUpdates = false;
      const nextIntroData = { ...introData };
      const nextBannerData = { ...bannerData };
      
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('service-intro.intro.')) {
          const fieldPath = key.replace('service-intro.intro.', '');
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let current = nextIntroData;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = siteConfig[key];
          } else {
            nextIntroData[fieldPath] = siteConfig[key];
          }
          hasIntroUpdates = true;
        }

        if (key.startsWith('details-banner.banner.')) {
          const fieldPath = key.replace('details-banner.banner.', '');
          nextBannerData[fieldPath] = siteConfig[key];
          hasBannerUpdates = true;
        }
      });

      if (hasIntroUpdates) setIntroData(nextIntroData);
      if (hasBannerUpdates) setBannerData(nextBannerData);
    }
  }, [isEditMode, siteConfig]);

  const intro = introData.intro || introData;
  const images = (intro.introImages?.length > 0 ? intro.introImages : DUMMY_IMAGES);
  const benefits = intro.benefits || [];
  const activeImage = images[activeIndex] || images[0] || DUMMY_IMAGES[0];

  return (
    <EditableSection sectionId="service-intro" label="Service Intro">
      <section className="service-intro-premium">
        <div className="intro-container-premium">
          <div className="intro-flex-row">
            
            {/* ─── LEFT SIDE: Premium Image Gallery ─────────── */}
            <div className="intro-media-column">
              <div className="media-card-wrapper">
                
                {/* Main Large Image Container */}
                <div className="service-main-media-container">
                  <div className="service-main-image-viewport">
                    <img 
                      src={activeImage.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                      alt={activeImage.alt || activeImage.title || "Service Media"} 
                      className="service-main-image"
                    />
                    <div className="service-image-vignette"></div>
                    
                    {/* Image Title Overlay */}
                    {activeImage.title && (
                      <div className="slide-info-overlay">
                        <span className="slide-tag">ASSET {activeIndex + 1}</span>
                        <h4 className="slide-main-title">{activeImage.title}</h4>
                      </div>
                    )}
                  </div>

                  {/* PREMIUM FLOATING ARROWS (HALF OUTSIDE) */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={() => {
                          const newIndex = (activeIndex - 1 + images.length) % images.length;
                          setActiveIndex(newIndex);
                          swiperRef.current?.slideTo(newIndex);
                        }}
                        className="premium-gallery-arrow prev-arrow"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => {
                          const newIndex = (activeIndex + 1) % images.length;
                          setActiveIndex(newIndex);
                          swiperRef.current?.slideTo(newIndex);
                        }}
                        className="premium-gallery-arrow next-arrow"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Slider Below */}
                {images.length > 1 && (
                  <div className="service-gallery-thumbnails-wrapper">
                    <Swiper
                      modules={[Navigation, FreeMode]}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      spaceBetween={15}
                      slidesPerView="auto"
                      freeMode={true}
                      watchSlidesProgress={true}
                      className="service-gallery-thumbnails-swiper"
                    >
                      {images.map((img, index) => (
                        <SwiperSlide key={index} style={{ width: '100px' }}>
                          <button 
                            onClick={() => setActiveIndex(index)}
                            className={`service-thumbnail-btn ${activeIndex === index ? 'is-active' : ''}`}
                          >
                            <img 
                              src={img.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                              alt={img.alt || `Thumbnail ${index + 1}`} 
                              className="thumbnail-img-asset"
                            />
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT SIDE: Content ─────────── */}
            <div className="intro-content-column">
              {/* Badge */}
              <div className="content-badge-row">
                <span className="premium-accent-badge">
                  <EditableText sectionId="details-banner" fieldPath="banner.badgeText">
                    {bannerData.badgeText || 'ABOUT THE TREATMENT'}
                  </EditableText>
                </span>
              </div>

              {/* Title */}
              <h1 className="service-intro-title">
                <EditableText sectionId="details-banner" fieldPath="banner.title">
                  {bannerData.title || 'Follicular Unit Extraction (FUE)'}
                </EditableText>
              </h1>

              {/* Meta Row */}
              <div className="service-meta-header">
                <div className="meta-block rating-block">
                  <span className="rating-score">
                    <EditableText sectionId="details-banner" fieldPath="banner.rating">
                      {bannerData.rating || '4.9'}
                    </EditableText>
                  </span>
                  <div className="rating-stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="#C5A059" color="#C5A059" />
                    ))}
                  </div>
                </div>
                <div className="meta-divider"></div>
                <div className="meta-block duration-block">
                  <Clock size={18} className="meta-icon" />
                  <span className="meta-text">
                    <EditableText sectionId="details-banner" fieldPath="banner.duration">
                      {bannerData.duration || '45 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="service-description-wrapper">
                {intro.shortDescription && (
                  <h3 className="service-catchy-phrase">
                    <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                      {intro.shortDescription}
                    </EditableText>
                  </h3>
                )}
                <div className="service-main-text">
                  <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                    {intro.longDescription || 'Professional treatment protocols designed for maximum results and patient comfort.'}
                  </EditableText>
                </div>
              </div>

              {/* Benefits Checklist */}
              {benefits.length > 0 && (
                <div className="service-benefits-grid">
                  {benefits.map((benefit, i) => (
                    <div className="premium-benefit-item" key={i}>
                      <div className="benefit-dot-ring">
                        <div className="benefit-dot-solid"></div>
                      </div>
                      <span className="benefit-text-label">
                        <EditableText sectionId="service-intro" fieldPath={`benefits.${i}.text`}>
                          {benefit.text}
                        </EditableText>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        .service-intro-premium {
          padding: 100px 5%;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }
        .intro-container-premium {
          max-width: 1320px;
          margin: 0 auto;
        }
        .intro-flex-row {
          display: flex;
          gap: 100px;
          align-items: flex-start;
        }
        
        /* Left Column: Gallery */
        .intro-media-column {
          flex: 1.1;
          min-width: 0;
          position: relative;
        }
        .media-card-wrapper {
          position: relative;
        }
        .service-main-media-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          border-radius: 40px;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .service-main-image-viewport {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 40px;
          position: relative;
        }
        .service-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-image-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.6) 100%);
          pointer-events: none;
        }
        .slide-info-overlay {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          z-index: 10;
        }
        .slide-tag {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }
        .slide-main-title {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
        }

        /* PREMIUM FLOATING ARROWS */
        .premium-gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1a1a;
          cursor: pointer;
          z-index: 20;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-gallery-arrow:hover {
          background: #1a1a1a;
          color: #ffffff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }
        .prev-arrow {
          left: -28px; /* Half outside */
        }
        .next-arrow {
          right: -28px; /* Half outside */
        }

        /* Thumbnails */
        .service-gallery-thumbnails-wrapper {
          padding: 0 10px;
        }
        .service-thumbnail-btn {
          width: 100px;
          height: 80px;
          border-radius: 16px;
          overflow: hidden;
          padding: 0;
          border: 3px solid transparent;
          cursor: pointer;
          background: #f8f9fa;
          transition: all 0.3s ease;
          display: block;
        }
        .service-thumbnail-btn.is-active {
          border-color: #1a1a1a;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .thumbnail-img-asset {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Right Column: Content */
        .intro-content-column {
          flex: 0.9;
          padding-top: 20px;
        }
        .content-badge-row {
          margin-bottom: 24px;
        }
        .premium-accent-badge {
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          color: #C5A059;
          background: rgba(197, 160, 89, 0.08);
          padding: 10px 20px;
          border-radius: 100px;
          text-transform: uppercase;
        }
        .service-intro-title {
          font-family: 'Outfit', sans-serif;
          font-size: 56px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.1;
          margin: 0 0 32px 0;
          letter-spacing: -0.02em;
        }
        .service-meta-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 48px;
        }
        .meta-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rating-score {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #1a1a1a;
        }
        .rating-stars-row {
          display: flex;
          gap: 4px;
        }
        .meta-divider {
          width: 1px;
          height: 30px;
          background: #eee;
        }
        .meta-icon {
          color: #999;
        }
        .meta-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .service-description-wrapper {
          margin-bottom: 48px;
        }
        .service-catchy-phrase {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          line-height: 1.4;
        }
        .service-main-text {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          font-weight: 400;
        }

        .service-benefits-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 20px;
        }
        .premium-benefit-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .benefit-dot-ring {
          width: 20px;
          height: 20px;
          border: 1px solid #C5A059;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .benefit-dot-solid {
          width: 8px;
          height: 8px;
          background: #C5A059;
          border-radius: 50%;
        }
        .benefit-text-label {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1200px) {
          .service-intro-title {
            font-size: 44px;
          }
          .intro-flex-row {
            gap: 60px;
          }
        }

        @media (max-width: 992px) {
          .service-intro-premium {
            padding: 60px 5%;
          }
          .intro-flex-row {
            flex-direction: column;
            gap: 50px;
          }
          .intro-media-column, .intro-content-column {
            flex: none;
            width: 100%;
            max-width: 100%;
          }
          .service-main-media-container {
            aspect-ratio: 1/1;
          }
          .service-benefits-grid {
            grid-template-cols: 1fr;
          }
          .prev-arrow { left: 10px; }
          .next-arrow { right: 10px; }
        }
      `}</style>
    </EditableSection>
  );
};

export default ServiceIntro;
