"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

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
                
                {/* Main Large Image */}
                <div className="service-main-media">
                  <div className="service-main-image-wrapper">
                    <img 
                      src={activeImage.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                      alt={activeImage.alt || activeImage.title || "Service Media"} 
                      className="service-main-image"
                    />
                    <div className="service-image-gradient"></div>
                    
                    {/* Image Title Overlay */}
                    {activeImage.title && (
                      <div className="slide-info-overlay">
                        <p className="slide-count">Image {activeIndex + 1}</p>
                        <h4 className="slide-main-title">{activeImage.title}</h4>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Slider Below */}
                {images.length > 1 && (
                  <div className="service-gallery-thumbnails-wrapper">
                    <Swiper
                      modules={[Navigation, FreeMode]}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      spaceBetween={12}
                      slidesPerView="auto"
                      freeMode={true}
                      watchSlidesProgress={true}
                      className="service-gallery-thumbnails"
                    >
                      {images.map((img, index) => (
                        <SwiperSlide key={index} className="service-thumbnail-slide">
                          <button 
                            onClick={() => setActiveIndex(index)}
                            className={`service-thumbnail ${activeIndex === index ? 'active' : ''}`}
                          >
                            <img 
                              src={img.image || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                              alt={img.alt || `Thumbnail ${index + 1}`} 
                              className="thumbnail-img"
                            />
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Thumbnail Nav Arrows */}
                    <button 
                      onClick={() => swiperRef.current?.slidePrev()}
                      className="thumbnail-nav-btn thumbnail-prev"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => swiperRef.current?.slideNext()}
                      className="thumbnail-nav-btn thumbnail-next"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT SIDE: Content ─── */}
            <div className="intro-content-column">
              {/* Badge */}
              <div className="content-badge-box">
                <span className="content-badge-premium">
                  <EditableText sectionId="details-banner" fieldPath="banner.badgeText">
                    {bannerData.badgeText || 'FOR UNWANTED HAIR'}
                  </EditableText>
                </span>
              </div>

              {/* Title */}
              <h1 className="intro-main-heading">
                <EditableText sectionId="details-banner" fieldPath="banner.title">
                  {bannerData.title || 'Follicular Unit Extraction (FUE)'}
                </EditableText>
              </h1>

              {/* Meta Row */}
              <div className="intro-meta-stats">
                <div className="meta-stat-item">
                  <span className="rating-value">
                    <EditableText sectionId="details-banner" fieldPath="banner.rating">
                      {bannerData.rating || '4.85'}
                    </EditableText>
                  </span>
                  <div className="star-rating-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                </div>
                <div className="meta-stat-item divider-left">
                  <Clock size={16} className="clock-icon" />
                  <span className="duration-text">
                    <EditableText sectionId="details-banner" fieldPath="banner.duration">
                      {bannerData.duration || '180 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="intro-description-box">
                {intro.shortDescription && (
                  <h3 className="intro-short-desc">
                    <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                      {intro.shortDescription}
                    </EditableText>
                  </h3>
                )}
                <p className="intro-long-desc">
                  <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                    {intro.longDescription || 'FUE is one of the most popular and limited modern procedure techniques for hair repair.'}
                  </EditableText>
                </p>
              </div>

              {/* Benefits Checklist */}
              {benefits.length > 0 && (
                <div className="benefits-checklist-grid">
                  {benefits.map((benefit, i) => (
                    <div className="benefit-check-item" key={i}>
                      <div className="check-dot-wrapper">
                        <div className="check-dot-inner"></div>
                      </div>
                      <span className="benefit-label">
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
          padding: 80px 5%;
          background: #ffffff;
        }
        .intro-container-premium {
          max-width: 1400px;
          margin: 0 auto;
        }
        .intro-flex-row {
          display: flex;
          gap: 80px;
          align-items: center;
        }
        .intro-media-column {
          flex: 1;
          min-width: 0;
          max-width: 50%;
        }
        .intro-content-column {
          flex: 1;
        }
        @media (max-width: 992px) {
          .intro-flex-row {
            flex-direction: column;
            gap: 40px;
          }
          .intro-media-column {
            max-width: 100%;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default ServiceIntro;
