"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';
import 'swiper/css';
import 'swiper/css/navigation';

const ServiceIntro = ({ data = {}, banner = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [bannerData, setBannerData] = useState(banner);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(false);
  const thumbnailSwiperRef = useRef(null);

  const DUMMY_VIDEOS = [
    {
      title: "Premium Care Overview",
      videoUrl: "",
      thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
      isYoutubeStyleButtonEnabled: false
    }
  ];

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
        // Handle Intro Updates
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

        // Handle Banner Updates
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
  const videos = intro.videos?.length > 0 ? intro.videos : DUMMY_VIDEOS;
  const benefits = intro.benefits || [];
  const currentVideo = videos[selectedIndex] || videos[0] || DUMMY_VIDEOS[0];

  return (
    <EditableSection sectionId="service-intro" label="Service Intro">
      <section className="details-intro-section">
        <div className="details-intro-container">

            {/* ─── LEFT SIDE: Gallery Column ─── */}
            <div className="details-gallery-col">
              <div className="details-gallery-wrapper">

                {/* Main Media Display */}
                <div className="details-gallery-slides">
                  {activeVideo && currentVideo.videoUrl ? (
                    <div className="details-video-active">
                      <iframe
                        src={`${currentVideo.videoUrl.includes('?') ? currentVideo.videoUrl : currentVideo.videoUrl + '?'}autoplay=1&rel=0&modestbranding=1`}
                        title={currentVideo.title || "Service Video"}
                        className="service-video-iframe"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                      />
                      <button
                        onClick={() => setActiveVideo(false)}
                        className="details-video-close"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="details-gallery-slide active">
                      <img
                        src={currentVideo.thumbnail || currentVideo.image}
                        alt={currentVideo.title}
                      />
                      {currentVideo.isYoutubeStyleButtonEnabled && currentVideo.videoUrl && (
                        <button className="gallery-video-btn" onClick={() => setActiveVideo(true)}>
                          <Play fill="white" color="white" size={24} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {videos.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        const prev = (selectedIndex - 1 + videos.length) % videos.length;
                        setSelectedIndex(prev);
                        setActiveVideo(false);
                      }}
                      className="gallery-arrow gallery-arrow-left"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => {
                        const next = (selectedIndex + 1) % videos.length;
                        setSelectedIndex(next);
                        setActiveVideo(false);
                      }}
                      className="gallery-arrow gallery-arrow-right"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Optional: Thumbnails Slider if requested, but reverting to stable dots/arrows first */}
              {videos.length > 1 && (
                <div className="gallery-dots">
                  {videos.map((_, idx) => (
                    <button 
                      key={idx} 
                      className={`gallery-dot ${selectedIndex === idx ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedIndex(idx);
                        setActiveVideo(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ─── RIGHT SIDE: Content Column ─── */}
            <div className="details-content-col">
              {/* Badge */}
              <span className="details-badge">
                <EditableText sectionId="details-banner" fieldPath="banner.badgeText">
                  {bannerData.badgeText || 'PREMIUM TREATMENT'}
                </EditableText>
              </span>

              {/* Title */}
              <h1 className="details-title">
                <EditableText sectionId="details-banner" fieldPath="banner.title">
                  {bannerData.title || 'Service Title'}
                </EditableText>
              </h1>

              {/* Meta Row */}
              <div className="details-meta-row">
                <div className="details-rating">
                  <span className="details-rating-num">
                    <EditableText sectionId="details-banner" fieldPath="banner.rating">
                      {bannerData.rating || '4.9'}
                    </EditableText>
                  </span>
                  <div className="details-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                </div>
                <div className="details-duration">
                  <Clock size={14} />
                  <span>
                    <EditableText sectionId="details-banner" fieldPath="banner.duration">
                      {bannerData.duration || '45 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Intro Section Heading */}
              <h3 className="details-subtitle">
                <EditableText sectionId="service-intro" fieldPath="intro.introHeading">
                  {intro.introHeading || ""}
                </EditableText>
              </h3>

              {/* Short Description */}
              {intro.shortDescription && (
                <div className="details-sub-subtitle">
                  <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                    {intro.shortDescription}
                  </EditableText>
                </div>
              )}

              {/* Main Description */}
              <p className="details-description">
                <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                  {intro.longDescription || 'Treatment description goes here...'}
                </EditableText>
              </p>

              {/* Bullet Points */}
              {benefits.length > 0 && (
                <ul className="details-bullets">
                  {benefits.map((benefit, i) => (
                    <li key={i}>
                      <EditableText sectionId="service-intro" fieldPath={`benefits.${i}.text`}>
                        {benefit.text}
                      </EditableText>
                    </li>
                  ))}
                </ul>
              )}

              {/* Closing Text */}
              <p className="details-closing">
                <EditableText sectionId="service-intro" fieldPath="intro.closingText">
                  {intro.closingText || ""}
                </EditableText>
              </p>
            </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default ServiceIntro;
