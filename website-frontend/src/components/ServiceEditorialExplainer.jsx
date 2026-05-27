"use client";
import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

function splitParagraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function ServiceEditorialExplainer({ data = {}, pageSlug = '' }) {
  const heading = data.heading || data.introHeading || '';
  const longDescription = data.longDescription || '';
  const pullQuote = data.pullQuote || '';
  const bannerImage = data.bannerImage || '';

  const paragraphs = splitParagraphs(longDescription);
  if (!heading && paragraphs.length === 0) return null;

  const midIndex = Math.floor(paragraphs.length / 2);

  return (
    <EditableSection sectionId={`service-editorial-explainer-${pageSlug}`} label="Service · Editorial Explainer">
      <section className="dmc-service-warm-explainer" data-section-id="service-editorial-explainer">
        {bannerImage && (
          <div
            className="dmc-warm-explainer-banner"
            style={{ backgroundImage: `url('${bannerImage}')` }}
            aria-hidden="true"
          >
            <div className="dmc-warm-explainer-banner-overlay" />
          </div>
        )}

        <div className="dmc-warm-explainer-container">
          <motion.div
            {...fadeUp(0)}
            className={`dmc-warm-explainer-card ${bannerImage ? 'is-floating' : ''}`}
          >
            {heading && (
              <h2 className="dmc-warm-explainer-heading">
                <EditableText
                  sectionId={`service-editorial-explainer-${pageSlug}`}
                  fieldPath="editorialExplainer.heading"
                  tag="span"
                >
                  {heading}
                </EditableText>
              </h2>
            )}

            <div className="dmc-warm-explainer-body">
              {paragraphs.map((para, i) => (
                <React.Fragment key={i}>
                  {pullQuote && i === midIndex && (
                    <motion.blockquote {...fadeUp(0.1)} className="dmc-warm-explainer-pullquote">
                      <span className="dmc-warm-pullquote-mark" aria-hidden="true">“</span>
                      <span>{pullQuote}</span>
                    </motion.blockquote>
                  )}
                  <motion.p {...fadeUp(0.05 * i)}>{para}</motion.p>
                  {i < paragraphs.length - 1 && <span className="dmc-warm-explainer-rule" aria-hidden="true" />}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
