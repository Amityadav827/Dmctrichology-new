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
    title: "Premium Care",
    alt: "Premium Care"
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
      <section className="service-intro-premium-v3">
        <div className="intro-max-width">
          <div className="intro-grid-layout">
            
            {/* ─── LEFT: Gallery Restoration ─── */}
            <div className="intro-gallery-column">
              <div className="gallery-main-viewport">
                <div className="main-image-frame">
                  <img 
                    src={activeImage.image || DUMMY_IMAGES[0].image} 
                    alt={activeImage.alt || activeImage.title || "Treatment Image"} 
                    className="main-asset-img"
                  />
                  <div className="asset-vignette"></div>
                  
                  {activeImage.title && (
                    <div className="asset-title-overlay">
                      <span className="asset-index">0{activeIndex + 1}</span>
                      <h4 className="asset-caption">{activeImage.title}</h4>
                    </div>
                  )}
                </div>

                {/* ORIGINAL FLOATING ARROWS */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => {
                        const prevIdx = (activeIndex - 1 + images.length) % images.length;
                        setActiveIndex(prevIdx);
                        swiperRef.current?.slideTo(prevIdx);
                      }}
                      className="floating-gallery-nav prev"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        const nextIdx = (activeIndex + 1) % images.length;
                        setActiveIndex(nextIdx);
                        swiperRef.current?.slideTo(nextIdx);
                      }}
                      className="floating-gallery-nav next"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="thumbnails-restored-row">
                  <Swiper
                    modules={[Navigation, FreeMode]}
                    onSwiper={(s) => (swiperRef.current = s)}
                    spaceBetween={12}
                    slidesPerView="auto"
                    freeMode={true}
                    className="thumbs-swiper"
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i} style={{ width: '90px' }}>
                        <button 
                          onClick={() => setActiveIndex(i)}
                          className={`thumb-item-btn ${activeIndex === i ? 'active' : ''}`}
                        >
                          <img src={img.image || DUMMY_IMAGES[0].image} alt="" className="thumb-img" />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>

            {/* ─── RIGHT: Content Restoration ─── */}
            <div className="intro-details-column">
              <div className="badge-wrapper-premium">
                <span className="intro-badge">
                  <EditableText sectionId="details-banner" fieldPath="banner.badgeText">
                    {bannerData.badgeText || 'ABOUT THE TREATMENT'}
                  </EditableText>
                </span>
              </div>

              <h1 className="intro-title-restored">
                <EditableText sectionId="details-banner" fieldPath="banner.title">
                  {bannerData.title || 'Service Title'}
                </EditableText>
              </h1>

              <div className="meta-stats-row">
                <div className="stat-group">
                  <span className="stat-score">
                    <EditableText sectionId="details-banner" fieldPath="banner.rating">
                      {bannerData.rating || '4.9'}
                    </EditableText>
                  </span>
                  <div className="stars-flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} fill="#C5A059" color="#C5A059" />
                    ))}
                  </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-group">
                  <Clock size={16} className="stat-icon" />
                  <span className="stat-label">
                    <EditableText sectionId="details-banner" fieldPath="banner.duration">
                      {bannerData.duration || '45 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              <div className="description-restored-stack">
                {intro.shortDescription && (
                  <h3 className="catchy-short-headline">
                    <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                      {intro.shortDescription}
                    </EditableText>
                  </h3>
                )}
                <div className="main-narrative-text">
                  <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                    {intro.longDescription || 'Treatment description goes here...'}
                  </EditableText>
                </div>
              </div>

              {benefits.length > 0 && (
                <div className="benefits-grid-restored">
                  {benefits.map((b, i) => (
                    <div className="benefit-pill" key={i}>
                      <div className="pill-dot"></div>
                      <span className="pill-text">
                        <EditableText sectionId="service-intro" fieldPath={`benefits.${i}.text`}>
                          {b.text}
                        </EditableText>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        <style jsx>{`
          .service-intro-premium-v3 {
            padding: 100px 5%;
            background: #ffffff;
            position: relative;
          }
          .intro-max-width {
            max-width: 1320px;
            margin: 0 auto;
          }
          .intro-grid-layout {
            display: grid;
            grid-template-cols: 1.15fr 0.85fr;
            gap: 100px;
            align-items: start;
          }

          /* Left: Gallery */
          .intro-gallery-column {
            position: relative;
            min-width: 0;
          }
          .gallery-main-viewport {
            position: relative;
            margin-bottom: 25px;
          }
          .main-image-frame {
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 40px;
            overflow: hidden;
            background: #f8f8f8;
            position: relative;
            box-shadow: 0 40px 100px -30px rgba(0,0,0,0.12);
          }
          .main-asset-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          .asset-vignette {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%);
            pointer-events: none;
          }
          .asset-title-overlay {
            position: absolute;
            bottom: 40px;
            left: 40px;
            right: 40px;
            z-index: 5;
          }
          .asset-index {
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 900;
            color: rgba(255,255,255,0.7);
            letter-spacing: 0.2em;
            display: block;
            margin-bottom: 8px;
          }
          .asset-caption {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            margin: 0;
            line-height: 1.2;
          }

          /* Floating Arrows Restoration */
          .floating-gallery-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: #ffffff;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1a1a1a;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .floating-gallery-nav:hover {
            transform: translateY(-50%) scale(1.08);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          }
          .floating-gallery-nav.prev { left: -27px; }
          .floating-gallery-nav.next { right: -27px; }

          /* Thumbnails */
          .thumbnails-restored-row {
            padding: 0 5px;
          }
          .thumb-item-btn {
            width: 90px;
            height: 75px;
            border-radius: 18px;
            overflow: hidden;
            border: 3px solid transparent;
            padding: 0;
            cursor: pointer;
            background: #eee;
            transition: all 0.3s ease;
          }
          .thumb-item-btn.active {
            border-color: #1a1a1a;
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          }
          .thumb-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* Right: Content */
          .intro-details-column {
            padding-top: 15px;
          }
          .badge-wrapper-premium {
            margin-bottom: 28px;
          }
          .intro-badge {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.15em;
            color: #C5A059;
            background: rgba(197, 160, 89, 0.1);
            padding: 10px 22px;
            border-radius: 100px;
            text-transform: uppercase;
          }
          .intro-title-restored {
            font-family: 'Outfit', sans-serif;
            font-size: 58px;
            font-weight: 800;
            color: #1a1a1a;
            line-height: 1.1;
            margin: 0 0 35px 0;
            letter-spacing: -0.025em;
          }
          .meta-stats-row {
            display: flex;
            align-items: center;
            gap: 25px;
            margin-bottom: 50px;
          }
          .stat-group {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .stat-score {
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            font-weight: 800;
            color: #1a1a1a;
          }
          .stars-flex {
            display: flex;
            gap: 4px;
          }
          .stat-divider {
            width: 1px;
            height: 32px;
            background: #ececec;
          }
          .stat-icon { color: #aaa; }
          .stat-label {
            font-family: 'Inter', sans-serif;
            font-size: 14.5px;
            font-weight: 600;
            color: #666;
          }

          .description-restored-stack {
            margin-bottom: 50px;
          }
          .catchy-short-headline {
            font-family: 'Outfit', sans-serif;
            font-size: 23px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 20px 0;
            line-height: 1.4;
          }
          .main-narrative-text {
            font-family: 'Inter', sans-serif;
            font-size: 16.5px;
            line-height: 1.85;
            color: #555;
            font-weight: 400;
          }

          .benefits-grid-restored {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 22px;
          }
          .benefit-pill {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .pill-dot {
            width: 8px;
            height: 8px;
            background: #C5A059;
            border-radius: 50%;
            box-shadow: 0 0 0 5px rgba(197,160,89,0.1);
          }
          .pill-text {
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #1a1a1a;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          @media (max-width: 1200px) {
            .intro-title-restored { font-size: 46px; }
            .intro-grid-layout { gap: 60px; }
          }
          @media (max-width: 992px) {
            .service-intro-premium-v3 { padding: 70px 5%; }
            .intro-grid-layout { grid-template-cols: 1fr; gap: 50px; }
            .main-image-frame { aspect-ratio: 1.1 / 1; }
            .floating-gallery-nav.prev { left: 10px; }
            .floating-gallery-nav.next { right: 10px; }
            .benefits-grid-restored { grid-template-cols: 1fr; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default ServiceIntro;
