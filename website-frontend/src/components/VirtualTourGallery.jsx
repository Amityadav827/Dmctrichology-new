"use client";
import React, { useEffect, useMemo, useState } from 'react';
import EditableSection from './Editable/EditableSection';

const SIZE_CLASSES = [
  'vt-tile-small',
  'vt-tile-tall',
  'vt-tile-wide',
  'vt-tile-small',
  'vt-tile-small',
  'vt-tile-small',
  'vt-tile-small',
  'vt-tile-wide',
  'vt-tile-wide',
  'vt-tile-small',
  'vt-tile-small',
];

const VIDEO_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const VIDEO_HOST_RE = /(youtube\.com|youtu\.be|vimeo\.com|wistia\.com|cloudinary\.com\/video)/i;

const isVideoUrl = (url = '') => VIDEO_RE.test(url) || VIDEO_HOST_RE.test(url);

const VirtualTourGallery = ({ cards: initialCards = [] }) => {
  const [cards, setCards] = useState(initialCards);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'virtual-tour-cards') {
        const { fieldPath, value } = e.detail;
        if (fieldPath === 'tourCards') setCards(value);
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const visibleCards = useMemo(() => (
    (Array.isArray(cards) ? cards : [])
      .filter((card) => card?.isVisible !== false)
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
  ), [cards]);

  return (
    <>
      <EditableSection sectionId="virtual-tour-cards" label="Virtual Tour Gallery Cards">
        <section className="vt-gallery-section" id="tour-gallery">
          <div className="vt-gallery-inner">
            {visibleCards.length === 0 ? (
              <div className="vt-gallery-empty">
                <p>No tour media available yet.</p>
              </div>
            ) : (
              <div className="vt-masonry-grid">
                {visibleCards.map((card, idx) => (
                  <TourCard
                    key={card.id || `${card.image}-${idx}`}
                    card={card}
                    idx={idx}
                    onVideoOpen={setActiveVideo}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </EditableSection>

      {activeVideo && (
        <div className="vt-video-modal" role="dialog" aria-modal="true" onClick={() => setActiveVideo(null)}>
          <button className="vt-video-close" type="button" aria-label="Close video" onClick={() => setActiveVideo(null)}>
            &times;
          </button>
          <div className="vt-video-frame" onClick={(e) => e.stopPropagation()}>
            {VIDEO_RE.test(activeVideo) ? (
              <video src={activeVideo} controls autoPlay playsInline />
            ) : (
              <iframe
                src={toEmbedUrl(activeVideo)}
                title="Virtual tour video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      <GalleryStyles />
    </>
  );
};

const toEmbedUrl = (url = '') => {
  if (url.includes('youtube.com/embed/')) return url;
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
  if (youtubeMatch?.[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return url;
};

const TourCard = ({ card, idx, onVideoOpen }) => {
  const imageUrl = card.image || card.thumbnail || '';
  const videoUrl = card.video || card.videoUrl || (isVideoUrl(card.buttonLink) ? card.buttonLink : '') || (isVideoUrl(imageUrl) ? imageUrl : '');
  const hasVideo = Boolean(videoUrl);
  const tileClass = SIZE_CLASSES[idx % SIZE_CLASSES.length];
  const href = hasVideo ? null : card.buttonLink;

  const content = (
    <>
      {imageUrl && !isVideoUrl(imageUrl) ? (
        <img src={imageUrl} alt={card.title || 'Virtual tour media'} loading="lazy" />
      ) : hasVideo && VIDEO_RE.test(videoUrl) ? (
        <video src={videoUrl} muted playsInline preload="metadata" />
      ) : (
        <div className="vt-card-placeholder" aria-hidden="true" />
      )}

      <div className="vt-card-shade" />

      {hasVideo && (
        <button
          className="vt-play-button"
          type="button"
          aria-label={`Play ${card.title || 'virtual tour video'}`}
          onClick={(e) => {
            e.preventDefault();
            onVideoOpen(videoUrl);
          }}
        >
          <span />
        </button>
      )}
    </>
  );

  if (href && href !== '#') {
    return (
      <a
        className={`vt-tour-card ${tileClass}`}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={`vt-tour-card ${tileClass}`}>
      {content}
    </div>
  );
};

const GalleryStyles = () => (
  <style>{`
    .vt-gallery-section {
      background: #ffffff;
      padding: 78px 5% 96px;
      position: relative;
      overflow: hidden;
    }

    .vt-gallery-inner {
      max-width: 1280px;
      margin: 0 auto;
    }

    .vt-masonry-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-auto-rows: 180px;
      gap: 18px;
      grid-auto-flow: dense;
    }

    .vt-tour-card {
      position: relative;
      display: block;
      border-radius: 18px;
      overflow: hidden;
      background: #d9d9d9;
      box-shadow: 0 16px 34px rgba(17, 17, 17, 0.08);
      isolation: isolate;
      transition: transform 0.35s ease, box-shadow 0.35s ease;
      min-height: 0;
    }

    .vt-tour-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 46px rgba(17, 17, 17, 0.13);
    }

    .vt-tour-card img,
    .vt-tour-card video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: transform 0.45s ease;
    }

    .vt-tour-card:hover img,
    .vt-tour-card:hover video {
      transform: scale(1.045);
    }

    .vt-tile-small {
      grid-column: span 1;
      grid-row: span 1;
    }

    .vt-tile-tall {
      grid-column: span 1;
      grid-row: span 2;
    }

    .vt-tile-wide {
      grid-column: span 2;
      grid-row: span 1;
    }

    .vt-card-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #d8d8d8 0%, #eeeeee 48%, #d3d3d3 100%);
    }

    .vt-card-shade {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(17,17,17,0) 42%, rgba(17,17,17,0.28) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .vt-tour-card:hover .vt-card-shade {
      opacity: 1;
    }

    .vt-play-button {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 2;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 50%;
      background: #3B5998;
      color: #ffffff;
      transform: translate(-50%, -50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 30px rgba(59,89,152,0.34);
      cursor: pointer;
      transition: transform 0.25s ease, background 0.25s ease;
    }

    .vt-play-button span {
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 10px solid #ffffff;
      margin-left: 3px;
    }

    .vt-play-button:hover {
      transform: translate(-50%, -50%) scale(1.08);
      background: #2f477c;
    }

    .vt-gallery-empty {
      text-align: center;
      padding: 80px 40px;
      background: #ffffff;
      border-radius: 20px;
      border: 2px dashed rgba(59,89,152,0.15);
      color: #777777;
      font-family: 'Lato', sans-serif;
    }

    .vt-video-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(17, 17, 17, 0.78);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .vt-video-frame {
      width: min(960px, 100%);
      aspect-ratio: 16 / 9;
      background: #000000;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 28px 80px rgba(0,0,0,0.35);
    }

    .vt-video-frame iframe,
    .vt-video-frame video {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    .vt-video-close {
      position: fixed;
      top: 22px;
      right: 24px;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 50%;
      background: #ffffff;
      color: #111111;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 14px 34px rgba(0,0,0,0.22);
    }

    @media (max-width: 1024px) {
      .vt-gallery-section {
        padding: 64px 5% 82px;
      }

      .vt-masonry-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-auto-rows: 190px;
      }

      .vt-tile-wide {
        grid-column: span 2;
      }
    }

    @media (max-width: 640px) {
      .vt-gallery-section {
        padding: 46px 16px 64px;
      }

      .vt-masonry-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        gap: 16px;
      }

      .vt-tour-card,
      .vt-tile-small,
      .vt-tile-tall,
      .vt-tile-wide {
        grid-column: auto;
        grid-row: auto;
        aspect-ratio: 1 / 0.78;
        border-radius: 18px;
      }

      .vt-play-button {
        width: 46px;
        height: 46px;
      }
    }
  `}</style>
);

export default VirtualTourGallery;
