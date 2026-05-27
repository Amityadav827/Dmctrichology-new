"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';

const PressMediaShowcase = ({ cards: initialCards = [] }) => {
  const [cards, setCards] = useState(initialCards);

  // Sync when server props change (e.g. hard refresh)
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // Real-time sync from CMS updates (cms-update custom event fired by EditableText/BuilderContext)
  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'press-media-cards') {
        // If the whole cards array is updated
        const { fieldPath, value } = e.detail;
        if (fieldPath === 'mediaCards') {
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

  const emptyState = (
    <section className="pm-showcase-section">
      <div className="pm-showcase-inner">
        <SectionHeader />
        <div className="pm-showcase-empty">
          <p>No media cards available yet.</p>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <EditableSection sectionId="press-media-cards" label="Press Media Featured Cards">
        <section className="pm-showcase-section">
          <div className="pm-showcase-inner">
            <SectionHeader />

            {visibleCards.length === 0 ? (
              <div className="pm-showcase-empty">
                <p>No media cards available yet.</p>
              </div>
            ) : (
              <div className="pm-cards-grid">
                {visibleCards.map((card, idx) => (
                  <MediaCard key={card.id || idx} card={card} idx={idx} />
                ))}
              </div>
            )}
          </div>
        </section>
      </EditableSection>

      <ShowcaseStyles />
    </>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader = () => (
  <div className="pm-showcase-header">
    <h2 className="pm-showcase-title">Press & Media</h2>
  </div>
);

const MediaCard = ({ card, idx }) => {
  const isLinkActive = card.mediaLink && card.mediaLink !== '#';
  
  const CardContent = (
    <div
      className="pm-card"
      style={{ animationDelay: `${idx * 0.08}s` }}
    >
      <div className="pm-card-img-wrap">
        {card.mediaImage ? (
          <img
            src={card.mediaImage}
            alt={card.mediaTitle || 'Media coverage'}
            className="pm-card-img"
            loading="lazy"
          />
        ) : (
          <div className="pm-card-img-placeholder">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect width="48" height="48" rx="8" fill="rgba(255,255,255,0.06)"/>
              <path d="M16 20h16M16 24h10M16 28h12" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Gradient overlay on image */}
        <div className="pm-card-img-overlay" />
      </div>

      {/* Media logo badge overlay - moved outside pm-card-img-wrap to allow overflow & perfect center-line alignment */}
      <div className="pm-card-logo-wrap">
        <img
          src={card.mediaLogo || 'https://www.dmctrichology.com/assets/images/media_logo1.webp'}
          alt={card.mediaTitle || 'Media outlet logo'}
          className="pm-card-logo"
          onError={(e) => {
            e.target.src = 'https://www.dmctrichology.com/assets/images/media_logo1.webp';
          }}
        />
      </div>
    </div>
  );

  if (isLinkActive) {
    return (
      <a
        href={card.mediaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pm-card-anchor"
        aria-label={`Read article: ${card.mediaTitle || 'Media Feature'}`}
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const ShowcaseStyles = () => (
  <style>{`
    /* ─── Section Wrapper ─────────────────────────────────── */
    .pm-showcase-section {
      background: #ffffff;
      padding: 100px 5% 120px;
      position: relative;
      overflow: hidden;
    }

    .pm-showcase-section::before {
      content: '';
      position: absolute;
      top: -200px;
      left: -200px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(184, 164, 134, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .pm-showcase-section::after {
      content: '';
      position: absolute;
      bottom: -150px;
      right: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(184, 164, 134, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .pm-showcase-inner {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* ─── Section Header ──────────────────────────────────── */
    .pm-showcase-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .pm-showcase-title {
      font-family: 'Marcellus', serif !important;
      font-size: 48px !important;
      font-weight: 400 !important;
      color: #333333 !important;
      margin: 0 !important;
      line-height: 1.2 !important;
      letter-spacing: 1px !important;
      text-transform: uppercase !important;
      text-align: center;
    }

    /* ─── Cards Grid ──────────────────────────────────────── */
    .pm-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      justify-content: center;
    }

    /* ─── Individual Card Anchor ──────────────────────────── */
    .pm-card-anchor {
      text-decoration: none;
      display: block;
    }

    /* ─── Individual Card ─────────────────────────────────── */
    .pm-card {
      background: #ffffff;
      border-radius: 32px;
      overflow: visible;
      border: 1px solid rgba(184, 164, 134, 0.15);
      box-shadow: 0 16px 48px rgba(184, 164, 134, 0.15), 0 4px 12px rgba(0, 0, 0, 0.03);
      transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                  box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                  border-color 0.5s ease;
      display: flex;
      flex-direction: column;
      position: relative;
      animation: pmCardFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes pmCardFadeIn {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .pm-card-anchor:hover .pm-card,
    .pm-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 32px 72px rgba(184, 164, 134, 0.3), 0 8px 24px rgba(0, 0, 0, 0.05);
      border-color: rgba(184, 164, 134, 0.4);
    }

    /* ─── Card Image ──────────────────────────────────────── */
    .pm-card-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: #faf7f2;
      border-radius: 32px;
    }

    .pm-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .pm-card-anchor:hover .pm-card-img,
    .pm-card:hover .pm-card-img {
      transform: scale(1.05);
    }

    .pm-card-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fbfaf8 0%, #faf6ee 100%);
    }

    .pm-card-img-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%);
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    .pm-card-anchor:hover .pm-card-img-overlay,
    .pm-card:hover .pm-card-img-overlay {
      opacity: 0.4;
    }

    /* Media Logo Badge Overlay — Bottom Center exactly like reference */
    .pm-card-logo-wrap {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      background: #ffffff;
      border-radius: 14px;
      padding: 10px 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 180px;
      width: auto;
      height: 48px;
      z-index: 10;
      transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
      border: 1px solid rgba(184, 164, 134, 0.15);
    }

    .pm-card-anchor:hover .pm-card-logo-wrap,
    .pm-card:hover .pm-card-logo-wrap {
      transform: translate(-50%, calc(50% - 6px)) scale(1.02);
      box-shadow: 0 16px 40px rgba(184, 164, 134, 0.25);
    }

    .pm-card-logo {
      max-height: 28px;
      max-width: 100%;
      object-fit: contain;
    }

    /* ─── Empty state ─────────────────────────────────────── */
    .pm-showcase-empty {
      text-align: center;
      padding: 80px 40px;
      background: #fbfaf7;
      border-radius: 24px;
      border: 2px dashed rgba(184, 164, 134, 0.3);
      color: #bca891;
      font-family: 'Lato', sans-serif;
    }

    /* ─── Responsive ──────────────────────────────────────── */
    @media (max-width: 1024px) {
      .pm-cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
      }
      .pm-showcase-title {
        font-size: 38px !important;
      }
      .pm-showcase-section {
        padding: 80px 5% 90px;
      }
    }

    @media (max-width: 640px) {
      .pm-showcase-section {
        padding: 60px 5% 70px;
      }
      .pm-cards-grid {
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .pm-showcase-title {
        font-size: 32px !important;
      }
      .pm-showcase-header {
        margin-bottom: 40px;
      }
      .pm-card-logo-wrap {
        height: 44px;
        padding: 8px 18px;
      }
    }
  `}</style>
);

export default PressMediaShowcase;
