"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import EditableSection from './Editable/EditableSection';

const VIDEO_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

const getYoutubeId = (url = '') => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([^&?/]+)/i);
  return match?.[1] || '';
};

const getMedia = (card = {}) => {
  const videoUrl = card.videoUrl || card.video || card.reelUrl || '';
  const imageUrl = card.image || card.imageUrl || card.thumbnail || card.poster || card.coverImage || '';
  const youtubeId = getYoutubeId(videoUrl);

  return {
    videoUrl,
    imageUrl: imageUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    isNativeVideo: VIDEO_RE.test(videoUrl),
    isVideo: Boolean(videoUrl),
  };
};

const InfluencerShowcase = ({ cards: initialCards = [] }) => {
  const [cards, setCards] = useState(initialCards);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'influencer-cards') {
        const { fieldPath, value } = e.detail;
        if (fieldPath === 'influencerCards') setCards(value);
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
      <EditableSection sectionId="influencer-cards" label="Influencer Showcase Cards">
        <section className="influencers-grid-section" id="influencer-showcase">
          <div className="influencers-grid-inner">
            {visibleCards.length === 0 ? (
              <div className="influencers-empty">
                <p>No influencer cards available yet.</p>
              </div>
            ) : (
              <div className="influencers-card-grid">
                {visibleCards.map((card, idx) => (
                  <InfluencerCard
                    key={card.id || `${card.name || card.videoUrl || idx}`}
                    card={card}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </EditableSection>

      <InfluencerStyles />
    </>
  );
};

const toEmbedUrl = (url = '') => {
  if (url.includes('youtube.com/embed/')) return url;
  const youtubeId = getYoutubeId(url);
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  if (url.includes('instagram.com/reel')) return `${url.split('?')[0]}embed`;
  return url;
};

const socialFields = [
  ['instagram', 'Ig'],
  ['youtube', 'Yt'],
  ['facebook', 'Fb'],
  ['linkedin', 'In'],
];

const InfluencerCard = ({ card }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const media = getMedia(card);
  const name = card.name || card.title || '';
  const designation = card.designation || card.subtitle || card.category || card.role || '';
  const hasSocials = socialFields.some(([field]) => card[field]);

  useEffect(() => {
    if (!media.isNativeVideo || !videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, media.isNativeVideo, media.videoUrl]);

  const togglePlayback = () => {
    if (!media.isVideo) return;
    setIsPlaying((current) => !current);
  };

  return (
    <article
      className={`influencer-card ${media.isVideo ? 'has-video' : ''} ${isPlaying ? 'is-playing' : ''}`}
      onClick={togglePlayback}
    >
      <div className="influencer-media">
        {media.isNativeVideo ? (
          <video
            ref={videoRef}
            src={media.videoUrl}
            poster={media.imageUrl || undefined}
            muted={card.muted ?? true}
            loop={card.loop ?? true}
            playsInline
            preload="metadata"
            onEnded={() => setIsPlaying(false)}
          />
        ) : isPlaying && media.isVideo ? (
          <iframe
            src={toEmbedUrl(media.videoUrl)}
            title={name || 'Influencer video'}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : media.imageUrl ? (
          <img src={media.imageUrl} alt={name || designation || 'Influencer'} loading="lazy" />
        ) : (
          <div className="influencer-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="influencer-overlay" />

      {media.isVideo && (
        <button
          className="influencer-play"
          type="button"
          aria-label={isPlaying ? 'Pause influencer video' : 'Play influencer video'}
          onClick={(e) => {
            e.stopPropagation();
            togglePlayback();
          }}
        >
          {isPlaying ? <i /> : <span />}
        </button>
      )}

      {hasSocials && (
        <div className="influencer-socials" aria-label="Social links">
          {socialFields.map(([field, label]) => (
            card[field] ? (
              <a
                key={field}
                href={card[field]}
                target="_blank"
                rel="noreferrer"
                aria-label={`${name || 'Influencer'} ${field}`}
                onClick={(e) => e.stopPropagation()}
              >
                {label}
              </a>
            ) : null
          ))}
        </div>
      )}

      <div className="influencer-content">
        {designation && <p>{designation}</p>}
        {name && <h2>{name}</h2>}
      </div>
    </article>
  );
};

const InfluencerStyles = () => (
  <style>{`
    .influencers-grid-section {
      background: #ffffff;
      padding: 88px 5% 104px;
      overflow: hidden;
    }

    .influencers-grid-inner {
      max-width: 1320px;
      margin: 0 auto;
    }

    .influencers-card-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 42px 26px;
    }

    .influencer-card {
      position: relative;
      min-height: 350px;
      border-radius: 30px;
      overflow: hidden;
      background: #d9d9d9;
      box-shadow: 0 20px 44px rgba(17, 17, 17, 0.09);
      isolation: isolate;
      transition: transform 0.35s ease, box-shadow 0.35s ease;
    }

    .influencer-card.has-video {
      cursor: pointer;
    }

    .influencer-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 62px rgba(17, 17, 17, 0.16);
    }

    .influencer-media,
    .influencer-media img,
    .influencer-media video,
    .influencer-media iframe,
    .influencer-placeholder {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .influencer-media img,
    .influencer-media video,
    .influencer-media iframe {
      object-fit: cover;
      display: block;
      transition: transform 0.45s ease;
      border: 0;
    }

    .influencer-card:hover .influencer-media img,
    .influencer-card:hover .influencer-media video,
    .influencer-card:hover .influencer-media iframe {
      transform: scale(1.055);
    }

    .influencer-media iframe {
      pointer-events: none;
    }

    .influencer-placeholder {
      background: linear-gradient(180deg, #cfcfcf 0%, #efefef 48%, #1d1d1d 100%);
    }

    .influencer-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        180deg,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0.15) 48%,
        rgba(0,0,0,0.78) 100%
      );
      pointer-events: none;
    }

    .influencer-content {
      position: absolute;
      left: 22px;
      right: 22px;
      bottom: 24px;
      z-index: 2;
      color: #ffffff;
    }

    .influencer-content p {
      font-family: 'Lato', sans-serif;
      font-size: 9px;
      line-height: 1.45;
      letter-spacing: 0.9px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.82);
      margin: 0 0 8px;
    }

    .influencer-content h2 {
      font-family: 'Marcellus', serif;
      font-size: 20px;
      line-height: 1.2;
      font-weight: 400;
      color: #ffffff;
      margin: 0;
    }

    .influencer-socials {
      position: absolute;
      right: 18px;
      top: 18px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .influencer-socials a {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255,255,255,0.88);
      color: #3B5998;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: 'Lato', sans-serif;
      font-size: 9px;
      font-weight: 800;
      text-decoration: none;
      transition: transform 0.25s ease, background 0.25s ease;
    }

    .influencer-socials a:hover {
      transform: scale(1.12);
      background: #ffffff;
    }

    .influencer-play {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 3;
      width: 48px;
      height: 48px;
      border: 0;
      border-radius: 50%;
      background: #3B5998;
      box-shadow: 0 14px 34px rgba(59,89,152,0.35);
      transform: translate(-50%, -50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .influencer-card:hover .influencer-play {
      opacity: 1;
    }

    .influencer-card.is-playing .influencer-play {
      opacity: 1;
      background: rgba(255,255,255,0.92);
    }

    .influencer-play:hover {
      transform: translate(-50%, -50%) scale(1.08);
    }

    .influencer-play span {
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 12px solid #ffffff;
      margin-left: 3px;
    }

    .influencer-play i {
      width: 14px;
      height: 17px;
      display: inline-block;
      position: relative;
    }

    .influencer-play i::before,
    .influencer-play i::after {
      content: '';
      position: absolute;
      top: 0;
      width: 5px;
      height: 17px;
      border-radius: 3px;
      background: #3B5998;
    }

    .influencer-play i::before {
      left: 1px;
    }

    .influencer-play i::after {
      right: 1px;
    }

    .influencers-empty {
      text-align: center;
      padding: 80px 40px;
      border: 2px dashed rgba(59,89,152,0.16);
      border-radius: 24px;
      color: #777777;
      font-family: 'Lato', sans-serif;
    }

    @media (max-width: 1199px) {
      .influencers-card-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        max-width: 760px;
        margin: 0 auto;
      }
    }

    @media (max-width: 640px) {
      .influencers-grid-section {
        padding: 58px 16px 76px;
      }

      .influencers-card-grid {
        grid-template-columns: 1fr;
        gap: 24px;
        max-width: 380px;
      }

      .influencer-card {
        min-height: 390px;
        border-radius: 28px;
      }

      .influencer-play {
        opacity: 1;
      }
    }
  `}</style>
);

export default InfluencerShowcase;
