"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const YoutubeIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DUMMY_VIDEOS = [
  {
    title: "FUE Process Explained",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    isYoutubeStyleButtonEnabled: true
  },
  {
    title: "Patient Success Story",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    isYoutubeStyleButtonEnabled: true
  },
  {
    title: "Technology at DMC",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    isYoutubeStyleButtonEnabled: false
  },
  {
    title: "Clinic Walkthrough",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    isYoutubeStyleButtonEnabled: true
  }
];

const ServiceIntro = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [activeVideo, setActiveVideo] = useState(null);
  const swiperRef = useRef(null);

  // Sync from props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setIntroData(data);
  }, [data]);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...introData };
      
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('service-intro.intro.')) {
          const fieldPath = key.replace('service-intro.intro.', '');
          
          // Handle nested updates (e.g., sliderSettings.autoplay)
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let current = nextData;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = siteConfig[key];
          } else {
            nextData[fieldPath] = siteConfig[key];
          }
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIntroData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  const intro = introData.intro || introData; // Handle both cases where intro is nested or top-level
  const videos = intro.videos?.length > 0 ? intro.videos : DUMMY_VIDEOS;
  const benefits = intro.benefits || [];
  const sliderSettings = intro.sliderSettings || { autoplay: true, autoplaySpeed: 5000, showDots: true, loopVideos: true };
  const buttonSettings = intro.buttonSettings || { floatingButtonIcon: 'play', floatingButtonPosition: 'bottom-right' };

  return (
    <EditableSection sectionId="service-intro" label="Service Details Intro">
      <section className="service-intro-premium">
        <div className="intro-container-premium">
          <div className="intro-flex-row">
            
            {/* ─── LEFT SIDE: Video Slider ─────────────────── */}
            <div className="intro-media-column">
              <div className="media-card-wrapper">
                {/* Main Slider Container */}
                <div className="video-slider-main">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={sliderSettings.loopVideos}
                    autoplay={sliderSettings.autoplay ? { delay: sliderSettings.autoplaySpeed, disableOnInteraction: false } : false}
                    pagination={sliderSettings.showDots ? { clickable: true, el: '.custom-swiper-pagination' } : false}
                    className="full-height-swiper"
                  >
                    {videos.map((video, index) => (
                      <SwiperSlide key={index}>
                        <div className="slide-video-container">
                          {activeVideo === index ? (
                            <div className="video-overlay-active">
                              <iframe
                                src={`${video.videoUrl.includes('?') ? video.videoUrl : video.videoUrl + '?'}autoplay=1&rel=0&modestbranding=1`}
                                title={video.title || "Service Video"}
                                className="video-iframe"
                                allow="autoplay; encrypted-media; fullscreen"
                                allowFullScreen
                              />
                              <button 
                                onClick={() => setActiveVideo(null)}
                                className="video-close-btn"
                              >
                                <ChevronLeft className="rotate-180" size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className="video-poster-wrapper" onClick={() => setActiveVideo(index)}>
                              <img 
                                src={video.thumbnail || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                                alt={video.title} 
                                className="video-poster-img"
                              />
                              <div className="video-poster-gradient"></div>
                              
                              {/* Central Play Button */}
                              <div className="play-button-center">
                                <Play fill="#1e293b" className="play-icon-svg" size={32} />
                              </div>

                              {/* Floating Youtube Style Button */}
                              {video.isYoutubeStyleButtonEnabled && (
                                <div className={`floating-youtube-btn ${buttonSettings.floatingButtonPosition}`}>
                                  <div className="youtube-btn-inner">
                                    <YoutubeIcon size={20} />
                                    <span className="youtube-btn-text">Watch Now</span>
                                  </div>
                                </div>
                              )}

                              {/* Slide Title */}
                              {video.title && (
                                <div className="slide-info-overlay">
                                  <p className="slide-count">Slide {index + 1}</p>
                                  <h4 className="slide-main-title">{video.title}</h4>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="swiper-nav-btn swiper-prev"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    className="swiper-nav-btn swiper-next"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Pagination Dots (Bottom Center) */}
                {sliderSettings.showDots && (
                  <div className="pagination-dots-container">
                    <div className="custom-swiper-pagination"></div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT SIDE: Content ───────────────────── */}
            <div className="intro-content-column">
              {/* Badge */}
              <div className="content-badge-box">
                <span className="content-badge-premium">
                  <EditableText sectionId="service-intro" fieldPath="intro.badgeText">
                    {intro.badgeText || intro.badge || 'HAIR TREATMENT'}
                  </EditableText>
                </span>
              </div>

              {/* Title */}
              <h1 className="intro-main-heading">
                <EditableText sectionId="service-intro" fieldPath="intro.title">
                  {intro.title || 'Follicular Unit Extraction (FUE)'}
                </EditableText>
              </h1>

              {/* Meta Stats */}
              <div className="intro-meta-stats">
                <div className="meta-stat-item">
                  <div className="star-rating-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="#fbbf24" className="star-icon" />
                    ))}
                  </div>
                  <span className="rating-value">
                    <EditableText sectionId="service-intro" fieldPath="intro.rating">
                      {intro.rating || '4.85'}
                    </EditableText>
                  </span>
                </div>
                <div className="meta-stat-item divider-left">
                  <Clock size={16} className="clock-icon" />
                  <span className="duration-text">
                    <EditableText sectionId="service-intro" fieldPath="intro.duration">
                      {intro.duration || '180 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="intro-description-box">
                <div className="intro-short-desc">
                  <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                    {intro.shortDescription || intro.subTitle || 'Safe, smart & skin-friendly hair repair'}
                  </EditableText>
                </div>
                <p className="intro-long-desc">
                  <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                    {intro.longDescription || intro.description || 'FUE is one of the most popular and limited modern procedure techniques for hair repair.'}
                  </EditableText>
                </p>
              </div>

              {/* Benefits Checklist */}
              {benefits.length > 0 && (
                <div className="benefits-checklist-grid">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="benefit-check-item">
                      <div className="check-dot-wrapper">
                        <div className="check-dot-inner"></div>
                      </div>
                      <span className="benefit-label">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #1e293b;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </EditableSection>
  );
};

export default ServiceIntro;
