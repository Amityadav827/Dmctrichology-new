"use client";
import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeScale = {
  initial: { opacity: 0, scale: 1.04 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
};

export default function ServiceStoryOpener({ data = {}, pageSlug = '' }) {
  const eyebrow = data.eyebrow || 'A NOTE FROM OUR CLINIC';
  const headline = data.headline || '';
  const body = data.body || '';
  const image = data.image || '';
  const attribution = data.attribution || '';

  if (!headline && !body) return null;

  return (
    <EditableSection sectionId={`service-story-opener-${pageSlug}`} label="Service · Story Opener">
      <section className="dmc-service-warm-story" data-section-id="service-story-opener">
        <div className="dmc-warm-story-inner">
          <motion.div {...fadeScale} className="dmc-warm-story-image-frame">
            {image ? (
              <img src={image} alt={headline || 'Patient story'} loading="lazy" />
            ) : (
              <div className="dmc-warm-story-image-fallback" aria-hidden="true" />
            )}
          </motion.div>

          <div className="dmc-warm-story-content">
            <motion.div {...fadeUp(0)} className="dmc-warm-story-eyebrow">
              <span className="dmc-warm-eyebrow-line" aria-hidden="true" />
              <EditableText sectionId={`service-story-opener-${pageSlug}`} fieldPath="storyOpener.eyebrow" tag="span">
                {eyebrow}
              </EditableText>
            </motion.div>

            {headline && (
              <motion.h2 {...fadeUp(0.15)} className="dmc-warm-story-headline">
                <EditableText sectionId={`service-story-opener-${pageSlug}`} fieldPath="storyOpener.headline" tag="span">
                  {headline}
                </EditableText>
              </motion.h2>
            )}

            {body && (
              <motion.p {...fadeUp(0.3)} className="dmc-warm-story-body">
                <EditableText sectionId={`service-story-opener-${pageSlug}`} fieldPath="storyOpener.body" tag="span">
                  {body}
                </EditableText>
              </motion.p>
            )}

            {attribution && (
              <motion.div {...fadeUp(0.42)} className="dmc-warm-story-attribution">
                <span className="dmc-warm-attribution-mark" aria-hidden="true">—</span>
                <EditableText sectionId={`service-story-opener-${pageSlug}`} fieldPath="storyOpener.attribution" tag="span">
                  {attribution}
                </EditableText>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
