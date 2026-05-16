import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsHero.css';

// ── Fade-up animation variants ──────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeLeft = {
  initial: { opacity: 0, x: -28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeScale = {
  initial: { opacity: 0, scale: 1.06 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

// ── Play button SVG ─────────────────────────────────────────
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// ── Component ───────────────────────────────────────────────
const AboutUsHero = ({ data = {} }) => {
  const {
    badge = 'ESTABLISHED 2008',
    title = 'Crafting The Art Of Natural Hair Restoration',
    subtitle =
      'At DMC Trichology, we blend advanced medical science with meticulous artistic precision to restore more than just hair—we restore confidence.',
    backgroundImage =
      'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    videoUrl = '',
    stats = [],
  } = data;

  const defaultStats = [
    { value: '15', suffix: '+', label: 'Years Experience' },
    { value: '25', suffix: 'k+', label: 'Happy Patients' },
    { value: '12', suffix: '+', label: 'Expert Board' },
  ];

  const activeStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <EditableSection sectionId="about-hero" label="About Us Hero">
      <section className="about-hero-section">
        <div className="about-hero-container">
          <div className="about-hero-layout">

            {/* ── LEFT — Content ────────────────────────────── */}
            <div className="about-hero-content">

              {/* Eyebrow label */}
              <motion.div {...fadeLeft} className="about-hero-eyebrow">
                <span className="eyebrow-line" aria-hidden="true" />
                <EditableText
                  sectionId="about-hero"
                  fieldPath="hero.badge"
                  className="about-hero-badge"
                  tag="span"
                >
                  {badge}
                </EditableText>
              </motion.div>

              {/* Main heading */}
              <motion.h1 {...fadeUp(0.15)} className="about-hero-title">
                <EditableText
                  sectionId="about-hero"
                  fieldPath="hero.title"
                  tag="span"
                >
                  {title}
                </EditableText>
              </motion.h1>

              {/* Mission paragraph */}
              <motion.p {...fadeUp(0.3)} className="about-hero-subtitle">
                <EditableText
                  sectionId="about-hero"
                  fieldPath="hero.subtitle"
                  tag="span"
                >
                  {subtitle}
                </EditableText>
              </motion.p>

              {/* Micro divider */}
              <motion.span
                {...fadeUp(0.42)}
                className="about-hero-divider"
                aria-hidden="true"
              />

              {/* Stats */}
              <motion.div {...fadeUp(0.5)} className="about-hero-stats">
                {activeStats.map((stat, index) => (
                  <div key={index} className="about-hero-stat-box">
                    <span className="stat-num">
                      <EditableText
                        sectionId="about-hero"
                        fieldPath={`hero.stats.${index}.value`}
                        tag="span"
                      >
                        {stat.value}
                      </EditableText>
                      <EditableText
                        sectionId="about-hero"
                        fieldPath={`hero.stats.${index}.suffix`}
                        tag="span"
                      >
                        {stat.suffix}
                      </EditableText>
                    </span>
                    <span className="stat-txt">
                      <EditableText
                        sectionId="about-hero"
                        fieldPath={`hero.stats.${index}.label`}
                        tag="span"
                      >
                        {stat.label}
                      </EditableText>
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT — Cinematic Media Frame ─────────────── */}
            <div className="about-hero-cinematic">

              {/* Floating depth blob */}
              <div className="cinematic-depth-blob" aria-hidden="true" />

              <motion.div {...fadeScale} className="cinematic-img-frame">

                {/* Media: video iframe OR fallback image */}
                {videoUrl ? (
                  <iframe
                    src={videoUrl.replace('watch?v=', 'embed/')}
                    className="cinematic-video"
                    title="About Us Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={backgroundImage}
                    alt="DMC Trichology Luxury Clinic"
                    className="cinematic-img"
                  />
                )}

                {/* Dark gradient overlay */}
                <div className="cinematic-overlay" aria-hidden="true" />

                {/* Play button (image fallback only) */}
                {!videoUrl && (
                  <div className="cinematic-play-btn" aria-hidden="true">
                    <div className="cinematic-play-inner">
                      <PlayIcon />
                    </div>
                  </div>
                )}


                {/* Reveal animation (image state only) */}
                {!videoUrl && (
                  <motion.div
                    initial={{ height: '100%' }}
                    whileInView={{ height: '0%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    className="cinematic-reveal"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsHero;
