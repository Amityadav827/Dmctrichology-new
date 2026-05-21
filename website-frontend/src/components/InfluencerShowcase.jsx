"use client";
import React, { useState, useEffect, useRef } from 'react';
import EditableSection from './Editable/EditableSection';

// Helper to detect video source type
const parseVideoUrl = (url) => {
  if (!url) return { type: 'unknown', src: '' };
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('/shorts/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    return { type: 'youtube', src: `https://www.youtube.com/embed/${videoId}` };
  }
  
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0];
    return { type: 'vimeo', src: `https://player.vimeo.com/video/${videoId}` };
  }

  if (url.includes('instagram.com/reel')) {
    // Basic embed URL for IG, though IG embeds usually require their own script.
    return { type: 'instagram', src: `${url.split('?')[0]}embed` };
  }

  return { type: 'native', src: url };
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
  const [isPlaying, setIsPlaying] = useState(card.autoplay || false);
  const [isMuted, setIsMuted] = useState(card.muted ?? true);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const videoData = parseVideoUrl(card.videoUrl);

  useEffect(() => {
    if (videoData.type === 'native' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => {
            console.log('Autoplay prevented:', e);
            setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoData.type]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoData.type === 'native' && videoRef.current) {
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
            videoRef.current.webkitRequestFullscreen();
        }
    } else if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
            containerRef.current.webkitRequestFullscreen();
        }
    }
  };

  return (
    <div
      ref={containerRef}
      className="inf-card"
      style={{ animationDelay: `${idx * 0.15}s` }}
    >
      <div className="inf-card-media-wrap">
        
        {/* Render Embedded IFRAME (Youtube, Vimeo, IG) */}
        {['youtube', 'vimeo', 'instagram'].includes(videoData.type) ? (
            <iframe 
                src={`${videoData.src}${videoData.type === 'youtube' ? '?autoplay=1&mute=1&controls=1&rel=0' : ''}`}
                className="inf-card-iframe"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        ) : videoData.type === 'native' && videoData.src ? (
            /* Render HTML5 Native Video */
            <>
                <video
                    ref={videoRef}
                    src={videoData.src}
                    muted={isMuted}
                    loop={card.loop ?? true}
                    playsInline
                    className="inf-card-video"
                    onClick={togglePlay}
                />
                <div className="inf-custom-controls">
                    <button onClick={togglePlay} className="inf-ctrl-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                    <button onClick={toggleMute} className="inf-ctrl-btn" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                        )}
                    </button>
                    <button onClick={toggleFullscreen} className="inf-ctrl-btn" aria-label="Fullscreen">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                    </button>
                </div>
            </>
        ) : (
            <div className="inf-card-img-placeholder">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect width="48" height="48" rx="8" fill="rgba(59,89,152,0.1)"/>
                    <path d="M24 16v16m-8-8h16" stroke="rgba(59,89,152,0.4)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
        )}
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
      min-height: auto;
    }

    .inf-gallery-inner {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .inf-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(320px, 360px));
      gap: 40px;
      justify-content: center;
    }

    .inf-card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      animation: infCardFadeIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
      background: #ffffff;
      width: 100%;
      max-width: 360px;
      transition: transform 0.4s ease, box-shadow 0.4s ease;
      display: flex;
      flex-direction: column;
    }

    .inf-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 30px 60px rgba(0,0,0,0.15);
    }

    @keyframes infCardFadeIn {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .inf-card-media-wrap {
      position: relative;
      width: 100%;
      height: 100%; /* Take full height of card */
      overflow: hidden;
      background: #000;
    }

    .inf-card-video, .inf-card-iframe {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .inf-card-iframe {
        pointer-events: auto;
    }

    /* Controls overlay */
    .inf-custom-controls {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 10;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
    }

    .inf-card:hover .inf-custom-controls {
        opacity: 1;
        transform: translateX(0);
    }

    .inf-ctrl-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .inf-ctrl-btn:hover {
        background: rgba(59,89,152,0.8);
        transform: scale(1.1);
    }

    @media (max-width: 1024px) {
      .inf-cards-grid { grid-template-columns: repeat(2, minmax(320px, 360px)); }
    }

    @media (max-width: 640px) {
      .inf-gallery-section { padding: 60px 0 70px; }
      /* Mobile 1-column slider feel - horizontally scrollable */
      .inf-cards-grid { 
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding: 0 20px 20px;
        gap: 20px;
        -webkit-overflow-scrolling: touch;
        justify-content: flex-start;
      }
      .inf-card {
        flex: 0 0 85%;
        max-width: 100%;
        scroll-snap-align: center;
      }
      .inf-card-media-wrap {
        height: 420px;
      }
    }
  `}</style>
);

export default InfluencerShowcase;
