"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';

const shapeImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780648744156-578802102.png';

const PressMediaShowcase = ({ cards: initialCards = [] }) => {
  const [cards, setCards] = useState(initialCards);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'press-media-cards') {
        const { fieldPath, value } = e.detail;
        if (fieldPath === 'mediaCards') setCards(value);
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const visibleCards = (Array.isArray(cards) ? cards : [])
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <>
      <EditableSection sectionId="press-media-cards" label="Press Media Featured Cards">
        <section className="pm-showcase-section">
          <div className="pm-showcase-inner">
            {visibleCards.length === 0 ? (
              <div className="pm-showcase-empty">
                <p>No media cards available yet.</p>
              </div>
            ) : (
              <div className="pm-cards-grid">
                {visibleCards.map((card, idx) => (
                  <MediaCard key={card.id || `${card.mediaTitle}-${idx}`} card={card} idx={idx} />
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

const MediaCard = ({ card, idx }) => {
  const isLinkActive = card.mediaLink && card.mediaLink !== '#';
  const logo = card.mediaLogo || 'https://www.dmctrichology.com/assets/images/media_logo1.webp';

  const cardContent = (
    <article className="pm-card" style={{ animationDelay: `${idx * 0.06}s` }}>
      <div className="pm-card-screenshot">
        {card.mediaImage ? (
          <img
            src={card.mediaImage}
            alt={card.mediaTitle || 'Media coverage'}
            className="pm-card-image"
            loading="lazy"
          />
        ) : (
          <div className="pm-card-image-placeholder" aria-label="Media screenshot placeholder" />
        )}
      </div>

      <div className="pm-card-shape" aria-hidden="true" />

      <div className="pm-card-logo-badge">
        <img
          src={logo}
          alt={card.mediaTitle || 'Media outlet logo'}
          className="pm-card-logo"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://www.dmctrichology.com/assets/images/media_logo1.webp';
          }}
        />
      </div>
    </article>
  );

  if (!isLinkActive) return cardContent;

  return (
    <a
      href={card.mediaLink}
      target="_blank"
      rel="noopener noreferrer"
      className="pm-card-anchor"
      aria-label={`Open media coverage: ${card.mediaTitle || 'Press media'}`}
    >
      {cardContent}
    </a>
  );
};

const ShowcaseStyles = () => (
  <style>{`
    .pm-showcase-section {
      width: 100%;
      background: #ffffff;
      padding: 86px 5% 116px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .pm-showcase-inner {
      max-width: 1220px;
      margin: 0 auto;
    }

    .pm-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 34px;
      align-items: stretch;
    }

    .pm-card-anchor {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .pm-card {
      position: relative;
      min-height: 318px;
      border-radius: 32px;
      background: #f1f1f1;
      overflow: hidden;
      box-shadow: 0 18px 42px rgba(59, 89, 152, 0.08);
      transition: transform .32s ease, box-shadow .32s ease;
      animation: pmCardIn .5s ease both;
    }

    @keyframes pmCardIn {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .pm-card-anchor:hover .pm-card,
    .pm-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 62px rgba(59, 89, 152, 0.16);
    }

    .pm-card-screenshot {
      position: absolute;
      inset: 0;
      background: #eeeeee;
    }

    .pm-card-image,
    .pm-card-image-placeholder {
      width: 100%;
      height: 100%;
      display: block;
    }

    .pm-card-image {
      object-fit: cover;
      transition: transform .45s ease;
    }

    .pm-card-anchor:hover .pm-card-image,
    .pm-card:hover .pm-card-image {
      transform: scale(1.035);
    }

    .pm-card-image-placeholder {
      background: #eeeeee;
    }

    .pm-card-shape {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 350px;
      background-image: url("${shapeImage}");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center bottom;
      z-index: 2;
      pointer-events: none;
    }

    .pm-card-logo-badge {
      position: absolute;
      left: 50%;
      bottom: 26px;
      transform: translateX(-50%);
      z-index: 3;
      width: min(68%, 178px);
      min-height: 42px;
      background: #ffffff;
      border-radius: 2px;
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7px 18px;
      transition: transform .3s ease, box-shadow .3s ease;
      box-sizing: border-box;
    }

    .pm-card-anchor:hover .pm-card-logo-badge,
    .pm-card:hover .pm-card-logo-badge {
      transform: translateX(-50%) translateY(-4px);
      box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
    }

    .pm-card-logo {
      max-width: 100%;
      max-height: 28px;
      object-fit: contain;
      display: block;
    }

    .pm-showcase-empty {
      text-align: center;
      padding: 70px 24px;
      border-radius: 28px;
      background: #EEF0FA;
      font-family: 'Lato', sans-serif;
      color: #3B5998;
      font-weight: 700;
    }

    @media (max-width: 1024px) {
      .pm-showcase-section {
        padding: 72px 5% 92px;
      }

      .pm-cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
      }
    }

    @media (max-width: 640px) {
      .pm-showcase-section {
        padding: 58px 16px 76px;
      }

      .pm-showcase-inner {
        max-width: 380px;
      }

      .pm-cards-grid {
        grid-template-columns: 1fr;
        gap: 26px;
      }

      .pm-card {
        min-height: 300px;
        border-radius: 28px;
      }
    }
  `}</style>
);

export default PressMediaShowcase;
