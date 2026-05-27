"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EditableText from './Editable/EditableText';
import Link from 'next/link';
import { useBuilder } from '../context/BuilderContext';
import EditableSection from './Editable/EditableSection';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.95, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const zoomOut = {
  initial: { scale: 1.12 },
  animate: { scale: 1 },
  transition: { duration: 2.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

const DetailsBanner = ({ data = {}, variant = 'classic' }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [bannerData, setBannerData] = useState(data);

  useEffect(() => {
    if (data) setBannerData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...bannerData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('details-banner.banner.')) {
          const field = key.replace('details-banner.banner.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        setBannerData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  const pageTitle = bannerData.pageTitle || bannerData.title || 'Service Details';
  const breadcrumbText = bannerData.breadcrumbText || bannerData.title || 'Details';
  const bannerImage = bannerData.bannerImage || '';

  // ── Cinematic 100vh hero used by warm-v2 template ──────────────
  if (variant === 'cinematic') {
    const eyebrow = bannerData.eyebrow || 'DMC TRICHOLOGY · DELHI';
    const subtitle = bannerData.subtitle || '';
    const ctaPrimaryText = bannerData.ctaPrimaryText || 'Request a consultation';
    const ctaPrimaryLink = bannerData.ctaPrimaryLink || '#enquiry';
    const ctaSecondaryText = bannerData.ctaSecondaryText || 'See real results';
    const ctaSecondaryLink = bannerData.ctaSecondaryLink || '#results';
    const rating = bannerData.rating || '4.9';
    const reviewCount = bannerData.reviewCount || '2,000+';

    return (
      <EditableSection sectionId="details-banner" label="Details Banner (Cinematic)">
        <section
          data-section-id="details-banner"
          className="dmc-service-warm-hero"
        >
          <motion.div
            {...zoomOut}
            className="dmc-warm-hero-bg"
            style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
          />
          <div className="dmc-warm-hero-overlay" aria-hidden="true" />

          <div className="dmc-warm-hero-content">
            <motion.div {...fadeUp(0.05)} className="dmc-warm-hero-eyebrow">
              <span className="dmc-warm-eyebrow-line" aria-hidden="true" />
              <EditableText sectionId="details-banner" fieldPath="banner.eyebrow" tag="span">
                {eyebrow}
              </EditableText>
            </motion.div>

            <motion.h1 {...fadeUp(0.18)} className="dmc-warm-hero-title">
              <EditableText sectionId="details-banner" fieldPath="banner.pageTitle" tag="span">
                {pageTitle}
              </EditableText>
            </motion.h1>

            {subtitle && (
              <motion.p {...fadeUp(0.32)} className="dmc-warm-hero-subtitle">
                <EditableText sectionId="details-banner" fieldPath="banner.subtitle" tag="span">
                  {subtitle}
                </EditableText>
              </motion.p>
            )}

            <motion.div {...fadeUp(0.45)} className="dmc-warm-hero-actions">
              <Link href={ctaPrimaryLink} className="dmc-warm-cta-primary">
                {ctaPrimaryText}
              </Link>
              <Link href={ctaSecondaryLink} className="dmc-warm-cta-secondary">
                {ctaSecondaryText} <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.6)} className="dmc-warm-hero-trust">
              <div className="dmc-warm-hero-stars" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.5l2.97 6.02 6.65.97-4.81 4.69 1.13 6.61L12 17.77l-5.94 3.02 1.13-6.61L2.38 9.49l6.65-.97L12 2.5z" />
                  </svg>
                ))}
              </div>
              <span className="dmc-warm-hero-trust-text">
                <strong>{rating}</strong> · {reviewCount} patients trust us with their care
              </span>
            </motion.div>

            <div className="dmc-warm-hero-breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href="/service">Services</Link>
              <span className="sep">/</span>
              <span className="current">{breadcrumbText}</span>
            </div>
          </div>
        </section>
      </EditableSection>
    );
  }

  // ── Classic short hero (unchanged) ─────────────────────────────
  return (
    <EditableSection sectionId="details-banner" label="Details Banner">
      <section
        data-section-id="details-banner"
        className="service-hero-premium"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
      >
        <div className="max-w-[1400px] mx-auto w-full">
          <h1 className="service-hero-title">
            <EditableText sectionId="details-banner" fieldPath="banner.pageTitle">
              {pageTitle}
            </EditableText>
          </h1>
          <div className="service-hero-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/service">Services</Link>
            <span className="sep">/</span>
            <span className="current">
              <EditableText sectionId="details-banner" fieldPath="banner.breadcrumbText">
                {breadcrumbText}
              </EditableText>
            </span>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default DetailsBanner;
