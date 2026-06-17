"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, StarHalf, Clock, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

// ─── DUMMY FALLBACK ───────────────────────────────────────────────────────────
const DUMMY_MEDIA = [
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png',
    title: 'Premium Hair Treatment',
    alt: 'Premium Hair Treatment at DMC Trichology',
    thumbnail: ''
  }
];

// ─── Normalize any legacy data structure → unified introMedia ─────────────────
function normalizeMedia(intro = {}) {
  // 1. New unified format — preferred
  if (Array.isArray(intro.introMedia) && intro.introMedia.length > 0) {
    return intro.introMedia.map(m => ({
      type: m.type || 'image',
      url: m.url || m.image || m.thumbnail || '',
      title: m.title || '',
      alt: m.alt || m.title || '',
      thumbnail: m.thumbnail || m.url || m.image || ''
    }));
  }
  // 2. Legacy intro.videos format
  if (Array.isArray(intro.videos) && intro.videos.length > 0) {
    return intro.videos.map(v => ({
      type: v.videoUrl ? 'video' : 'image',
      url: v.videoUrl || v.thumbnail || v.image || '',
      title: v.title || '',
      alt: v.title || '',
      thumbnail: v.thumbnail || v.image || v.videoUrl || ''
    }));
  }
  // 3. Legacy intro.introImages format
  if (Array.isArray(intro.introImages) && intro.introImages.length > 0) {
    return intro.introImages.map(img => ({
      type: 'image',
      url: img.image || img.url || '',
      title: img.title || '',
      alt: img.alt || img.title || '',
      thumbnail: img.image || img.url || ''
    }));
  }
  return DUMMY_MEDIA;
}

const renderStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    if (numericRating >= i) {
      stars.push(<Star key={i} className="si-star filled" />);
    } else if (numericRating >= i - 0.5) {
      stars.push(<StarHalf key={i} className="si-star filled" />);
    } else {
      stars.push(<Star key={i} className="si-star empty" />);
    }
  }

  return stars;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ServiceIntro = ({ data = {}, banner = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [bannerData, setBannerData] = useState(banner);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationData, setConsultationData] = useState({ name: '', phone: '', address: '' });
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationError, setConsultationError] = useState('');
  const [consultationSuccess, setConsultationSuccess] = useState(false);
  const videoRef = useRef(null);
  const thumbsRef = useRef(null);

  // ── Sync from props ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (data) setIntroData(data);
    if (banner) setBannerData(banner);
    setSelectedIndex(0);
  }, [data, banner]);

  // ── Real-time sync from Visual Builder ──────────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !siteConfig) return;
    let hasIntroUpdates = false;
    let hasBannerUpdates = false;
    const nextIntroData = { ...introData };
    const nextBannerData = { ...bannerData };

    Object.keys(siteConfig).forEach(key => {
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
      if (key.startsWith('details-banner.banner.')) {
        const fieldPath = key.replace('details-banner.banner.', '');
        nextBannerData[fieldPath] = siteConfig[key];
        hasBannerUpdates = true;
      }
    });

    if (hasIntroUpdates) setIntroData(nextIntroData);
    if (hasBannerUpdates) setBannerData(nextBannerData);
  }, [isEditMode, siteConfig]);

  // ── Derive data ──────────────────────────────────────────────────────────────
  const intro = introData.intro || introData;
  const mediaItems = normalizeMedia(intro);
  const benefits = intro.benefits || [];
  const genericClosingPattern = /^Restore your confidence with our seamless .+ procedure, performed by award-winning surgeons\.$/i;
  const closingText = String(intro.closingText || '').trim();
  const shouldShowClosingText = closingText && !genericClosingPattern.test(closingText);
  const currentItem = mediaItems[selectedIndex] || mediaItems[0];
  const isVideo = currentItem?.type === 'video';
  const serviceTitle = bannerData.title || intro.title || 'Service Detail';

  const resetConsultationMessages = () => {
    if (consultationError) setConsultationError('');
    if (consultationSuccess) setConsultationSuccess(false);
  };

  const handleConsultationChange = (event) => {
    setConsultationData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    resetConsultationMessages();
  };

  const openConsultationModal = () => {
    setIsConsultationOpen(true);
    resetConsultationMessages();
  };

  const closeConsultationModal = () => {
    if (consultationLoading) return;
    setIsConsultationOpen(false);
    setConsultationError('');
    setConsultationSuccess(false);
  };

  const handleConsultationSubmit = async (event) => {
    event.preventDefault();
    if (consultationLoading) return;

    setConsultationError('');
    setConsultationSuccess(false);

    if (!consultationData.name.trim()) return setConsultationError('Please enter your name.');
    if (!consultationData.phone.trim()) return setConsultationError('Please enter your phone number.');
    if (!consultationData.address.trim()) return setConsultationError('Please enter your address.');

    setConsultationLoading(true);
    try {
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? 'http://localhost:10000/api' : 'https://dmctrichology-1.onrender.com/api');
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const serviceSlug = currentPath.split('/details/')[1] || '';
      const phoneValue = consultationData.phone.trim();
      const phoneKey = phoneValue.replace(/\D/g, '') || 'no-phone';
      const payload = {
        name: consultationData.name.trim(),
        email: `${phoneKey}@no-email.dmc-trichology.local`,
        mobile: phoneValue,
        service: 'Book Consultation',
        enquiry_type: 'Book Consultation',
        service_slug: serviceSlug,
        source: 'Book Consultation Popup',
        message: `Book Consultation Popup\nService: ${serviceTitle}\nAddress: ${consultationData.address.trim()}\nPage: ${currentPath || 'N/A'}`
      };

      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit consultation request.');
      }

      setConsultationSuccess(true);
      setConsultationData({ name: '', phone: '', address: '' });
    } catch (error) {
      setConsultationError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setConsultationLoading(false);
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────────
  const navigate = useCallback((newIndex) => {
    if (newIndex === selectedIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex(newIndex);
      setIsTransitioning(false);
    }, 200);

    // Scroll thumbnail into view
    if (thumbsRef.current) {
      const thumb = thumbsRef.current.children[newIndex];
      if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedIndex, isTransitioning]);

  const goPrev = useCallback(() => navigate((selectedIndex - 1 + mediaItems.length) % mediaItems.length), [selectedIndex, mediaItems.length, navigate]);
  const goNext = useCallback(() => navigate((selectedIndex + 1) % mediaItems.length), [selectedIndex, mediaItems.length, navigate]);

  // ── Keyboard nav ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isConsultationOpen) closeConsultationModal();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, isConsultationOpen, consultationLoading]);

  // ─── VIDEO: autoplay when slide changes ──────────────────────────────────────
  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {/* autoplay blocked — silent */});
    }
  }, [selectedIndex, isVideo]);

  // ─── Render Main Media ────────────────────────────────────────────────────────
  const renderMainMedia = () => {
    if (!currentItem) return null;

    if (isVideo && currentItem.url) {
      return (
        <video
          ref={videoRef}
          key={`video-${selectedIndex}`}
          className={`si-main-media-el ${isTransitioning ? 'si-media-fade-out' : 'si-media-fade-in'}`}
          autoPlay
          muted
          loop
          playsInline
          src={currentItem.url}
        />
      );
    }

    return (
      <img
        key={`img-${selectedIndex}`}
        src={currentItem.url || currentItem.thumbnail}
        alt={currentItem.alt || currentItem.title}
        className={`si-main-media-el ${isTransitioning ? 'si-media-fade-out' : 'si-media-fade-in'}`}
      />
    );
  };

  return (
    <EditableSection sectionId="service-intro" label="Service Intro">
      <section className="details-intro-section">
        <div className="details-intro-container">

          {/* ─── LEFT: Premium Gallery Column ─── */}
          <div className="details-gallery-col">
            <div className="details-gallery-wrapper">

              {/* Main Media Viewer */}
              <div className="si-main-viewer">
                {renderMainMedia()}
              </div>

              {/* Floating Navigation Arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="si-arrow si-arrow-left"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={goNext}
                    className="si-arrow si-arrow-right"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {mediaItems.length > 1 && (
              <div className="si-thumb-strip" ref={thumbsRef}>
                {mediaItems.map((item, idx) => {
                  const thumbSrc = item.type === 'video'
                    ? (item.thumbnail || item.url)
                    : (item.url || item.thumbnail);
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(idx)}
                      className={`si-thumb ${selectedIndex === idx ? 'si-thumb-active' : ''}`}
                      aria-label={`View slide ${idx + 1}`}
                    >
                      {thumbSrc ? (
                        <img src={thumbSrc} alt={item.alt || item.title || `Slide ${idx + 1}`} />
                      ) : (
                        <div className="si-thumb-placeholder" />
                      )}
                      {item.type === 'video' && (
                        <div className="si-thumb-play">
                          <Play size={12} fill="white" color="white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Content Column ─── */}
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

            {/* Rating + Duration Row */}
            <div className="details-meta-row">
              <div className="details-rating">
                <span className="details-rating-num">
                  <EditableText sectionId="details-banner" fieldPath="banner.rating">
                    {String(bannerData.rating || '4.9')}
                  </EditableText>
                </span>
                <div className="si-stars">
                  {renderStars(bannerData.rating || 4.9)}
                </div>
                <span className="si-review-count">
                  (<EditableText sectionId="details-banner" fieldPath="banner.reviewCount">
                    {String(bannerData.reviewCount || '1250')}
                  </EditableText> Reviews)
                </span>
              </div>
              {(bannerData.duration || intro.duration) && (
                <div className="details-duration">
                  <Clock size={14} />
                  <span>
                    <EditableText sectionId="details-banner" fieldPath="banner.duration">
                      {bannerData.duration || intro.duration || '45 mins'}
                    </EditableText>
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              className="details-consultation-cta"
              onClick={openConsultationModal}
            >
              Book Consultation
            </button>

            {/* Intro Heading */}
            {intro.introHeading && (
              <h3 className="details-subtitle">
                <EditableText sectionId="service-intro" fieldPath="intro.introHeading">
                  {intro.introHeading}
                </EditableText>
              </h3>
            )}

            {/* Short Description */}
            {intro.shortDescription && (
              <div className="details-sub-subtitle">
                <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                  {intro.shortDescription}
                </EditableText>
              </div>
            )}

            {/* Long Description */}
            {intro.longDescription && (
              <p className="details-description" style={{ whiteSpace: "pre-line" }}>
                <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                  {intro.longDescription}
                </EditableText>
              </p>
            )}

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
            {shouldShowClosingText && (
              <p className="details-closing">
                <EditableText sectionId="service-intro" fieldPath="intro.closingText">
                  {closingText}
                </EditableText>
              </p>
            )}
          </div>

        </div>

        {isConsultationOpen && (
          <div className="details-consultation-modal" role="dialog" aria-modal="true" aria-labelledby="details-consultation-title">
            <button className="details-consultation-backdrop" type="button" aria-label="Close consultation form" onClick={closeConsultationModal} />
            <div className="details-consultation-dialog">
              <button className="details-consultation-close" type="button" aria-label="Close consultation form" onClick={closeConsultationModal} disabled={consultationLoading}>
                <X size={18} />
              </button>
              <h2 id="details-consultation-title">Book Consultation</h2>
              <form onSubmit={handleConsultationSubmit}>
                <input name="name" value={consultationData.name} onChange={handleConsultationChange} placeholder="Name *" disabled={consultationLoading} required />
                <input name="phone" type="tel" value={consultationData.phone} onChange={handleConsultationChange} placeholder="Phone Number *" disabled={consultationLoading} required />
                <input name="address" value={consultationData.address} onChange={handleConsultationChange} placeholder="Address *" disabled={consultationLoading} required />
                <button type="submit" disabled={consultationLoading}>
                  {consultationLoading ? 'Submitting...' : 'Submit'}
                </button>
                {consultationError && <p className="details-consultation-error">{consultationError}</p>}
                {consultationSuccess && <p className="details-consultation-success">Consultation request submitted successfully.</p>}
              </form>
            </div>
          </div>
        )}
      </section>
    </EditableSection>
  );
};

export default ServiceIntro;
