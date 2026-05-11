"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const ServiceIntro = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (data) setIntroData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...introData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('service-intro.intro.')) {
          const field = key.replace('service-intro.intro.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) setIntroData(nextData);
    }
  }, [isEditMode, siteConfig]);

  const images = (introData.galleryImages || []).filter(img => img && img.trim() !== "");
  const bullets = introData.bulletPoints || [];
  const totalSlides = images.length || 1;

  const prevSlide = () => setActiveSlide(i => (i - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setActiveSlide(i => (i + 1) % totalSlides);

  return (
    <EditableSection sectionId="service-intro" label="Service Details Intro">
      <section className="details-intro-section" data-section-id="service-intro">
        <div className="details-intro-container">

          {/* ─── LEFT: Image Gallery/Slider ─────────── */}
          <div className="details-gallery-col">
            <div className="details-gallery-wrapper" ref={sliderRef}>

              {/* Slides */}
              <div className="details-gallery-slides">
                {images.length > 0 ? images.map((img, i) => (
                  <div
                    key={i}
                    className={`details-gallery-slide ${i === activeSlide ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} />
                  </div>
                )) : (
                  <div className="details-gallery-slide active details-gallery-placeholder" style={{ backgroundColor: '#f0f4f8' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Image Not Available</span>
                  </div>
                )}
              </div>

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-arrow gallery-arrow-left"
                    onClick={prevSlide}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    className="gallery-arrow gallery-arrow-right"
                    onClick={nextSlide}
                    aria-label="Next"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Video Button */}
              {introData.videoUrl && !showVideo && (
                <button
                  className="gallery-video-btn"
                  onClick={() => setShowVideo(true)}
                  aria-label="Play video"
                >
                  <Play size={20} fill="white" />
                </button>
              )}

              {/* YouTube Logo Indicator */}
              {introData.videoUrl && !showVideo && (
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" 
                  alt="YouTube Video Available" 
                  style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    right: '20px', 
                    width: '45px', 
                    height: 'auto', 
                    zIndex: 10, 
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))', 
                    pointerEvents: 'none' 
                  }}
                />
              )}

              {/* Dot Indicators */}
              {images.length > 1 && (
                <div className="gallery-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`gallery-dot ${i === activeSlide ? 'active' : ''}`}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Inline Video */}
            {showVideo && introData.videoUrl && (
              <div className="details-video-wrap">
                <iframe
                  src={introData.videoUrl}
                  title="Service Video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                <button
                  onClick={() => setShowVideo(false)}
                  className="details-video-close"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* ─── RIGHT: Content ─────────────────────── */}
          <div className="details-content-col">

            {/* Category Badge */}
            <div className="details-badge">
              <EditableText sectionId="service-intro" fieldPath="intro.badge">
                {introData.badge || 'HAIR TREATMENT'}
              </EditableText>
            </div>

            {/* Title */}
            <h2 className="details-title">
              <EditableText sectionId="service-intro" fieldPath="intro.title">
                {introData.title || 'Follicular Unit Extraction (FUE)'}
              </EditableText>
            </h2>

            {/* Meta: Rating + Duration */}
            <div className="details-meta-row">
              <div className="details-rating">
                <span className="details-rating-num">
                  <EditableText sectionId="service-intro" fieldPath="intro.rating">
                    {introData.rating || '4.85'}
                  </EditableText>
                </span>
                <div className="details-stars">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
              </div>
              <div className="details-duration">
                <Clock size={13} />
                <span>
                  <EditableText sectionId="service-intro" fieldPath="intro.duration">
                    {introData.duration || '180 mins'}
                  </EditableText>
                </span>
              </div>
            </div>

            {/* Sub-title */}
            {introData.subTitle && (
              <div className="details-subtitle">
                <EditableText sectionId="service-intro" fieldPath="intro.subTitle">
                  {introData.subTitle}
                </EditableText>
              </div>
            )}

            {/* Description */}
            <p className="details-description">
              <EditableText sectionId="service-intro" fieldPath="intro.description">
                {introData.description || ''}
              </EditableText>
            </p>

            {/* Bullet Points */}
            {bullets.length > 0 && (
              <ul className="details-bullets">
                {bullets.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}

            {/* Closing Text */}
            {introData.closingText && (
              <p className="details-closing">
                <EditableText sectionId="service-intro" fieldPath="intro.closingText">
                  {introData.closingText}
                </EditableText>
              </p>
            )}
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default ServiceIntro;
