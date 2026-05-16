import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Heart, Eye, Crosshair } from 'lucide-react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsVision.css';

const IconMap = {
  ShieldCheck,
  Target,
  Heart,
  Eye,
  Crosshair,
};

// ── Animation helpers ────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

// ── Component ────────────────────────────────────────────────
const AboutUsVision = ({ data = {} }) => {
  const {
    sectionTitle = 'VISION & VALUES',
    heading = 'Guided By Science, Inspired By Art',
    visionText = 'To redefine the global standard of natural hair restoration through innovation and uncompromising quality.',
    missionText = 'To empower our patients by restoring their natural appearance and confidence using the safest, most advanced medical protocols.',
    values = [],
  } = data;

  const defaultValues = [
    { title: 'Integrity', description: 'Ethical medical practices above all else.', icon: 'ShieldCheck' },
    { title: 'Precision', description: 'Artistic meticulousness in every graft.', icon: 'Crosshair' },
    { title: 'Empathy', description: 'Patient care that goes beyond the procedure.', icon: 'Heart' },
  ];

  const activeValues = values.length > 0 ? values : defaultValues;

  return (
    <EditableSection sectionId="about-vision" label="Vision & Values">
      <section className="about-vision-section">
        <div className="about-vision-container">

          {/* ── Editorial Header ─────────────────────────────── */}
          <div className="about-vision-header">
            <motion.span {...fadeUp(0)} className="about-vision-tag">
              <EditableText sectionId="about-vision" fieldPath="vision.sectionTitle" tag="span">
                {sectionTitle}
              </EditableText>
            </motion.span>

            <motion.h2 {...fadeUp(0.15)} className="about-vision-main-title">
              <EditableText sectionId="about-vision" fieldPath="vision.heading" tag="span">
                {heading}
              </EditableText>
            </motion.h2>
          </div>

          {/* ── Asymmetric Dual Card Grid ─────────────────────── */}
          <div className="about-vision-dual-grid">

            {/* Vision Card — Light */}
            <motion.div {...fadeLeft(0.1)} className="about-vision-card">
              <span className="card-index">01</span>
              <div className="card-icon">
                <Eye size={26} strokeWidth={1.5} />
              </div>
              <h3 className="about-vision-card-title">Our Vision</h3>
              <p className="about-vision-card-text">
                <EditableText sectionId="about-vision" fieldPath="vision.visionText" tag="span">
                  {visionText}
                </EditableText>
              </p>
            </motion.div>

            {/* Mission Card — Deep Black */}
            <motion.div {...fadeRight(0.2)} className="about-vision-card mission">
              <span className="card-index">02</span>
              <div className="card-icon">
                <Target size={26} strokeWidth={1.5} />
              </div>
              <h3 className="about-vision-card-title">Our Mission</h3>
              <p className="about-vision-card-text">
                <EditableText sectionId="about-vision" fieldPath="vision.missionText" tag="span">
                  {missionText}
                </EditableText>
              </p>
            </motion.div>

          </div>

          {/* ── Premium Values Strip ──────────────────────────── */}
          <div className="about-values-grid">
            {activeValues.map((value, index) => {
              const IconComponent = IconMap[value.icon] || ShieldCheck;
              return (
                <motion.div
                  key={index}
                  {...fadeUp(0.3 + index * 0.1)}
                  className="about-value-item"
                >
                  <span className="value-index">0{index + 1}</span>
                  <div className="about-value-icon-box">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="about-value-title">
                    <EditableText
                      sectionId="about-vision"
                      fieldPath={`vision.values.${index}.title`}
                      tag="span"
                    >
                      {value.title}
                    </EditableText>
                  </h4>
                  <p className="about-value-desc">
                    <EditableText
                      sectionId="about-vision"
                      fieldPath={`vision.values.${index}.description`}
                      tag="span"
                    >
                      {value.description}
                    </EditableText>
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsVision;
