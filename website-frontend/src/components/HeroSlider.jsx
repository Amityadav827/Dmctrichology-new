"use client";
import { useState, useEffect } from 'react';
import { fetchHeroSlides } from '../services/api';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';

export default function HeroSlider() {
  const [slides, setSlides] = useState([
    {
      backgroundImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png',
      tag: 'TRUSTED CARE',
      title: 'Recover Stronger, Move Freely, Live Pain-Free',
      description: 'Experience Compassionate Care And Advanced Trichology Solutions For Healthier, Stronger Hair.'
    }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    fetchHeroSlides().then(data => {
      if (data && data.data && data.data.slides) {
        setSlides(data.data.slides);
      }
    });
    // Trigger entrance animation shortly after mount
    const t = setTimeout(() => setContentReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <EditableSection sectionId="hero" label="Hero Slider">
      <div className="hero-slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            {/* Background with zoom animation */}
            <div
              className={`slide-bg ${index === currentSlide ? 'slide-bg-zoom' : ''}`}
              style={{ backgroundImage: `url(${slide.backgroundImage || slide.image})` }}
            />
            <div className="slide-overlay" style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'rgba(171, 187, 202, 0.55)', 
              zIndex: 1 
            }}></div>

            <div className={`slide-content ${index === currentSlide && contentReady ? 'slide-content-animate' : ''}`}>
              <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)' }} />
                {slide.tag}
              </span>
              <h1 className="section-title hero-cap-heading" style={{ fontSize: '54px', marginBottom: '16px' }}>
                <EditableText sectionId="hero" fieldPath={`slides.${index}.title`} tag="span">
                  {slide.title}
                </EditableText>
              </h1>
              <p className="slide-desc" style={{ fontFamily: "'Marcellus', serif", fontSize: '18px', color: '#333' }}>
                <EditableText sectionId="hero" fieldPath={`slides.${index}.description`} tag="span">
                  {slide.description}
                </EditableText>
              </p>
              {slide.primaryBtnText && (
                <div style={{ marginTop: '24px' }}>
                  <a href={slide.primaryBtnLink || '#'} className="btn-primary" style={{ padding: '12px 32px' }}>
                    {slide.primaryBtnText}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
