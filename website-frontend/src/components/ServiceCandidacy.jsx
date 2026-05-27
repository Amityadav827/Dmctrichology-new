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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function normalizeBullets(bullets) {
  if (!Array.isArray(bullets)) return [];
  return bullets
    .filter((b) => b && b.isVisible !== false)
    .map((b) => (typeof b === 'string' ? b : b.bulletText || b.text || ''))
    .map((s) => String(s).trim())
    .filter(Boolean);
}

export default function ServiceCandidacy({ idealData = {}, notData = {}, pageSlug = '' }) {
  const idealHeading = idealData.sectionHeading || 'This is for you if…';
  const notHeading = notData.sectionHeading || 'This may not be right for you yet if…';
  const idealIntro = idealData.introText || '';

  const idealBullets = normalizeBullets(idealData.bullets);
  const notBullets = normalizeBullets(notData.bullets);

  if (idealBullets.length === 0 && notBullets.length === 0) return null;

  return (
    <EditableSection sectionId={`service-candidacy-${pageSlug}`} label="Service · Is This You?">
      <section className="dmc-service-warm-candidacy" data-section-id="service-candidacy">
        <div className="dmc-warm-candidacy-container">
          <motion.div {...fadeUp(0)} className="dmc-warm-candidacy-intro">
            <span className="dmc-warm-eyebrow-line" aria-hidden="true" />
            <span className="dmc-warm-candidacy-eyebrow">IS THIS FOR YOU?</span>
          </motion.div>

          <div className="dmc-warm-candidacy-grid">
            {idealBullets.length > 0 && (
              <motion.div {...fadeUp(0.1)} className="dmc-warm-candidacy-col is-yes">
                <h3 className="dmc-warm-candidacy-heading">{idealHeading}</h3>
                {idealIntro && <p className="dmc-warm-candidacy-intro-text">{idealIntro}</p>}
                <ul className="dmc-warm-candidacy-list">
                  {idealBullets.map((bullet, i) => (
                    <li key={i}>
                      <span className="dmc-warm-candidacy-icon is-yes" aria-hidden="true">
                        <CheckIcon />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {notBullets.length > 0 && (
              <motion.div {...fadeUp(0.22)} className="dmc-warm-candidacy-col is-no">
                <h3 className="dmc-warm-candidacy-heading">{notHeading}</h3>
                <ul className="dmc-warm-candidacy-list">
                  {notBullets.map((bullet, i) => (
                    <li key={i}>
                      <span className="dmc-warm-candidacy-icon is-no" aria-hidden="true">
                        <MinusIcon />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="dmc-warm-candidacy-footnote">
                  Not sure? A short consultation will help us guide you to the right next step.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
