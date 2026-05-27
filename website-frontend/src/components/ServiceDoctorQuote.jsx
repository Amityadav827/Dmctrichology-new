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

const DR_DADU_FALLBACK = {
  quote:
    'Hair restoration is more than science — it is the careful, personal work of giving someone back the way they used to see themselves.',
  doctorName: 'Dr. Nivedita Dadu',
  doctorTitle: 'Founder · DMC Trichology, Delhi',
  portrait:
    'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
};

export default function ServiceDoctorQuote({ data = {}, pageSlug = '' }) {
  const quote = data.quote || DR_DADU_FALLBACK.quote;
  const doctorName = data.doctorName || DR_DADU_FALLBACK.doctorName;
  const doctorTitle = data.doctorTitle || DR_DADU_FALLBACK.doctorTitle;
  const portrait = data.portrait || DR_DADU_FALLBACK.portrait;

  if (!quote) return null;

  return (
    <EditableSection sectionId={`service-doctor-quote-${pageSlug}`} label="Service · Doctor's Voice">
      <section className="dmc-service-warm-quote" data-section-id="service-doctor-quote">
        <div className="dmc-warm-quote-container">
          <motion.div {...fadeUp(0)} className="dmc-warm-quote-portrait">
            <img src={portrait} alt={doctorName} loading="lazy" />
            <span className="dmc-warm-portrait-frame" aria-hidden="true" />
          </motion.div>

          <div className="dmc-warm-quote-body">
            <motion.span {...fadeUp(0.1)} className="dmc-warm-quote-mark" aria-hidden="true">
              “
            </motion.span>
            <motion.blockquote {...fadeUp(0.18)} className="dmc-warm-quote-text">
              <EditableText sectionId={`service-doctor-quote-${pageSlug}`} fieldPath="doctorQuote.quote" tag="span">
                {quote}
              </EditableText>
            </motion.blockquote>
            <motion.div {...fadeUp(0.32)} className="dmc-warm-quote-signature">
              <span className="dmc-warm-signature-rule" aria-hidden="true" />
              <div className="dmc-warm-signature-text">
                <EditableText
                  sectionId={`service-doctor-quote-${pageSlug}`}
                  fieldPath="doctorQuote.doctorName"
                  className="dmc-warm-doctor-name"
                  tag="div"
                >
                  {doctorName}
                </EditableText>
                <EditableText
                  sectionId={`service-doctor-quote-${pageSlug}`}
                  fieldPath="doctorQuote.doctorTitle"
                  className="dmc-warm-doctor-title"
                  tag="div"
                >
                  {doctorTitle}
                </EditableText>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
