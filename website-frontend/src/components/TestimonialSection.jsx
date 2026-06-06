"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { fetchReviews } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const blueIconFilter = 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)';

const ReviewCard = ({ name, text, sectionId, index }) => (
  <div style={{
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    marginBottom: '24px',
    textAlign: 'left',
    border: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }} className="premium-review-card">
    <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: '#ffffff', fontSize: '18px' }}>★</span>
      ))}
    </div>
    <p style={{
      fontSize: '14px',
      color: '#444',
      lineHeight: '1.6',
      marginBottom: '20px',
      fontFamily: "'Marcellus', serif"
    }}>
      <EditableText sectionId={sectionId} fieldPath={`reviews.${index}.text`} tag="span">
        {text}
      </EditableText>
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
        - <EditableText sectionId={sectionId} fieldPath={`reviews.${index}.name`} tag="span">{name}</EditableText>.
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777721827/dmc-trichology/ju75pcuuqsccgndqvnno.png" alt="Google Review" style={{ width: '60px', height: 'auto' }} />
      </div>
    </div>
  </div>
);

const isDirectVideoUrl = (url = '') => /\.(mp4|webm|mov|ogg)(\?|#|$)/i.test(url);

const getEmbedUrl = (url = '') => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&/]+)/i);
  if (youtubeMatch?.[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  return url;
};

const VideoCard = ({ name, image, videoUrl, height = "400px", sectionId, index }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const directVideo = isDirectVideoUrl(videoUrl);

  const togglePlayback = async () => {
    if (!videoUrl) return;

    if (directVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          setIsPlaying(false);
        }
      }
      return;
    }

    setIsPlaying(current => !current);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      borderRadius: '30px',
      overflow: 'hidden',
      marginBottom: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }} onClick={togglePlayback} className="premium-video-card">
      {directVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={image || undefined}
          playsInline
          controls={isPlaying}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : isPlaying ? (
        <iframe
          src={getEmbedUrl(videoUrl)}
          title={name || 'Real Results Story'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      ) : image ? (
        <img
          src={image}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #d8d8d8, #a5a5a5)' }} />
      )}

      {!isPlaying && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <h4 style={{ color: '#fff', fontSize: '20px', fontFamily: "'Marcellus', serif", fontWeight: '400', textAlign: 'center' }}>
            <EditableText sectionId={sectionId} fieldPath={`videos.${index}.name`} tag="span">
              {name}
            </EditableText>
          </h4>
        </div>
      )}

      <button
        type="button"
        aria-label={`${isPlaying ? 'Pause' : 'Play'} ${name}`}
        onClick={(e) => {
          e.stopPropagation();
          togglePlayback();
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.85)',
          background: '#ffffff',
          boxShadow: '0 14px 36px rgba(0,0,0,0.22)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3
        }}
      >
        {isPlaying ? (
          <span aria-hidden="true" style={{ display: 'inline-flex', gap: '5px' }}>
            <i style={{ width: '6px', height: '22px', borderRadius: '4px', background: '#3B5998', display: 'block' }} />
            <i style={{ width: '6px', height: '22px', borderRadius: '4px', background: '#3B5998', display: 'block' }} />
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: '16px solid #3B5998',
              marginLeft: '4px'
            }}
          />
        )}
      </button>
    </div>
  );
};

const TestimonialSection = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReviews().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  if (data && data.enabled === false) return null;

  const title = data ? (data.heading || '') : 'See the Results. Hear the Stories.';
  const subtitle = data ? (data.badgeText || '') : 'REVIEWS';
  const reviewsCount = data ? (data.googleReviewText || '') : '7000+ Reviews on';
  const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
  const videos = Array.isArray(data?.videos) ? data.videos : [];

  return (
    <EditableSection sectionId="reviews-section" label="Reviews & Stories">
      <section className="testimonials-grid-section" style={{ padding: '0 5% 100px 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1450px', margin: '0 auto' }}>

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '32px', height: 'auto', objectFit: 'contain', filter: blueIconFilter }} />
              <EditableText sectionId="reviews-section" fieldPath="badgeText" tag="span" className="section-subtitle">
                {subtitle}
              </EditableText>
            </div>
            <h2 className="section-title">
              <EditableText sectionId="reviews-section" fieldPath="heading" tag="span">
                {title}
              </EditableText>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', color: '#666' }}>
                <EditableText sectionId="reviews-section" fieldPath="googleReviewText" tag="span">{reviewsCount}</EditableText>
              </span>
              <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" width={80} height={26} style={{ width: '80px', height: 'auto', marginTop: '4px' }} />
            </div>
          </div>

          {/* Staggered Grid */}
          <div className="testimonial-staggered-grid" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className={`testimonial-col-${col}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: col % 2 !== 0 ? '60px' : '0' }}>
                {reviews[col * 2] && <ReviewCard sectionId="reviews-section" index={col * 2} name={reviews[col * 2]?.name} text={reviews[col * 2]?.text} />}
                {videos[col] && (
                  <VideoCard 
                    sectionId="reviews-section" 
                    index={col} 
                    name={videos[col]?.name} 
                    image={videos[col]?.image || videos[col]?.thumbnail || videos[col]?.thumbnailUrl || videos[col]?.poster} 
                    videoUrl={videos[col]?.url}
                    height={col % 2 !== 0 ? "480px" : "450px"} 
                  />
                )}
                {reviews[col * 2 + 1] && <ReviewCard sectionId="reviews-section" index={col * 2 + 1} name={reviews[col * 2 + 1]?.name} text={reviews[col * 2 + 1]?.text} />}
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <a href="/clients-feedback" className="view-all-testimonials-btn" style={{ padding: '7px 7px 7px 24px', borderRadius: '999px', border: '1px solid #1C1C1C', backgroundColor: '#fff', color: '#1C1C1C', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '18px', fontFamily: "'Marcellus', serif", textDecoration: 'none' }}>
              <span>View All</span>
              <span className="view-all-testimonials-arrow" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        <style jsx>{`
          .premium-review-card:hover, .premium-video-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; border-color: #ffffff !important; }
          .view-all-testimonials-btn:hover { background-color: #3B5998 !important; border-color: #3B5998 !important; color: #fff !important; transform: translateY(-2px); }
          .view-all-testimonials-arrow {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #3B5998;
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-45deg);
            transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
          }
          .view-all-testimonials-btn:hover .view-all-testimonials-arrow {
            background-color: #ffffff;
            color: #3B5998;
            transform: rotate(0deg);
          }
          @media (max-width: 1200px) { .testimonial-col-3, .testimonial-col-4 { display: none !important; } }
          @media (max-width: 1199px) {
            .testimonials-grid-section {
              padding: 0 4% 72px 4% !important;
              overflow: hidden;
            }
            .testimonials-grid-section .section-title {
              font-size: clamp(34px, 5vw, 48px) !important;
              line-height: 1.1 !important;
            }
            .premium-review-card,
            .premium-video-card {
              max-width: 100%;
            }
          }
          @media (max-width: 992px) { .testimonial-col-2 { display: none !important; } }
          @media (max-width: 768px) {
            .testimonials-grid-section {
              padding: 0 16px 56px 16px !important;
            }
            .testimonials-grid-section > div > div:first-child {
              margin-bottom: 36px !important;
            }
            .testimonials-grid-section .section-title {
              font-size: clamp(30px, 8.5vw, 40px) !important;
            }
            .testimonials-grid-section div[style*="justify-content: center"] {
              flex-wrap: wrap;
            }
            .testimonial-staggered-grid { flex-direction: column; gap: 20px; }
            .testimonial-staggered-grid > div { margin-top: 0 !important; width: 100%; display: flex !important; }
            .premium-review-card {
              padding: 20px !important;
              border-radius: 20px !important;
            }
            .premium-video-card {
              height: 360px !important;
              border-radius: 22px !important;
            }
            .view-all-testimonials-btn {
              width: 100%;
              justify-content: center;
            }
          }
          @media (max-width: 390px) {
            .premium-video-card {
              height: 300px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default TestimonialSection;
