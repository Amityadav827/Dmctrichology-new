"use client";
import React, { useState, useEffect, useRef } from 'react';
import EditableSection from './Editable/EditableSection';

const InfluencerShowcase = ({ cards: initialCards = [] }) => {
  const [cards, setCards] = useState(initialCards);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'influencer-cards') {
        const { fieldPath, value } = e.detail;
        if (fieldPath === 'influencerCards') {
          setCards(value);
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const visibleCards = cards
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <EditableSection sectionId="influencer-cards" label="Influencer Showcase Cards">
        <section className="inf-gallery-section" id="influencer-showcase">
          <div className="inf-gallery-inner">
            {visibleCards.length === 0 ? (
              <div className="inf-gallery-empty">
                <p>No influencer cards available yet.</p>
              </div>
            ) : (
              <div className="inf-cards-grid">
                {visibleCards.map((card, idx) => (
                  <InfluencerCard key={card.id || idx} card={card} idx={idx} />
                ))}
              </div>
            )}
          </div>
        </section>
      </EditableSection>
      <GalleryStyles />
    </>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const InfluencerCard = ({ card, idx }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="inf-card"
      style={{ animationDelay: `${idx * 0.15}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inf-card-media-wrap">
        {card.videoUrl ? (
          <video
            ref={videoRef}
            src={card.videoUrl}
            poster={card.thumbnail || undefined}
            muted
            loop
            playsInline
            className="inf-card-video"
          />
        ) : card.thumbnail ? (
          <img
            src={card.thumbnail}
            alt={card.influencerName || 'Influencer'}
            className="inf-card-img"
            loading="lazy"
          />
        ) : (
          <div className="inf-card-img-placeholder">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect width="48" height="48" rx="8" fill="rgba(59,89,152,0.1)"/>
              <path d="M24 16v16m-8-8h16" stroke="rgba(59,89,152,0.4)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Glass overlay */}
        <div className="inf-card-glass-overlay">
          <div className="inf-card-glass-content">
            <h3 className="inf-card-title">{card.influencerName}</h3>
            <p className="inf-card-desc">{card.caption}</p>
            {card.instagramLink && card.instagramLink !== '#' && (
              <a href={card.instagramLink} target="_blank" rel="noopener noreferrer" className="inf-card-btn">
                Watch on Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const GalleryStyles = () => (
  <style>{`
    .inf-gallery-section {
      background: linear-gradient(180deg, #f5f7fb 0%, #ffffff 100%);
      padding: 90px 5% 100px;
      position: relative;
      overflow: hidden;
    }

    .inf-gallery-inner {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .inf-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    .inf-card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      animation: infCardFadeIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
      background: #ffffff;
    }

    @keyframes infCardFadeIn {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .inf-card-media-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 9/16; /* Instagram reel ratio */
      overflow: hidden;
      background: #000;
      cursor: pointer;
    }

    .inf-card-video, .inf-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.8s cubic-bezier(0.25,1,0.5,1), filter 0.4s ease;
    }

    .inf-card:hover .inf-card-video, .inf-card:hover .inf-card-img {
      transform: scale(1.05);
      filter: brightness(0.9);
    }

    .inf-card-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f2f5;
    }

    .inf-card-glass-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 30px;
      opacity: 0.9;
      transition: opacity 0.4s ease, background 0.4s ease;
    }

    .inf-card:hover .inf-card-glass-overlay {
      opacity: 1;
      background: linear-gradient(to top, rgba(59,89,152,0.95) 0%, rgba(59,89,152,0.6) 50%, transparent 100%);
    }

    .inf-card-glass-content {
      transform: translateY(10px);
      transition: transform 0.4s cubic-bezier(0.25,1,0.5,1);
    }

    .inf-card:hover .inf-card-glass-content {
      transform: translateY(0);
    }

    .inf-card-title {
      font-family: 'Marcellus', serif !important;
      font-size: 24px !important;
      color: #ffffff !important;
      margin: 0 0 8px !important;
      line-height: 1.3 !important;
    }

    .inf-card-desc {
      font-family: 'Lato', sans-serif;
      font-size: 15px;
      color: rgba(255,255,255,0.85);
      margin: 0 0 20px;
      line-height: 1.5;
      opacity: 0.8;
      transition: opacity 0.4s ease;
    }

    .inf-card:hover .inf-card-desc {
      opacity: 1;
    }

    .inf-card-btn {
      display: inline-block;
      padding: 10px 24px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.4);
      color: #ffffff;
      font-family: 'Lato', sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 100px;
      text-decoration: none;
      transition: background 0.3s ease, color 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    }

    .inf-card:hover .inf-card-btn {
      opacity: 1;
      transform: translateY(0);
    }

    .inf-card-btn:hover {
      background: #ffffff;
      color: #3b5998;
    }

    .inf-gallery-empty {
      text-align: center;
      padding: 80px 40px;
      background: #ffffff;
      border-radius: 20px;
      border: 2px dashed rgba(59,89,152,0.15);
      color: #aaaaaa;
      font-family: 'Lato', sans-serif;
    }

    @media (max-width: 1024px) {
      .inf-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
    }

    @media (max-width: 640px) {
      .inf-gallery-section { padding: 60px 5% 70px; }
      /* Mobile 1-column slider feel - horizontally scrollable */
      .inf-cards-grid { 
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 20px;
        -webkit-overflow-scrolling: touch;
      }
      .inf-card {
        flex: 0 0 85%;
        scroll-snap-align: center;
      }
      .inf-card-glass-content { transform: translateY(0); }
      .inf-card-btn { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

export default InfluencerShowcase;
