import React from 'react';

const BODY_HAIR_SLUGS = ['body-hair-transplant-bht'];

const defaultBodyHairIntroSection = {
  heading: 'WHAT IS BODY HAIR TRANSPLANT?',
  content: `Men and women suffering from extensive hair loss or baldness often wonder whether they have sufficient healthy hair follicles for performing hair transplants. Here comes a sigh of relief! In case of not enough donor hair grafts, a body hair transplant can be an ideal solution to combat scalp hair loss.

The best body hair transplant or BHT is available at an affordable price at DMC Trichology. You can contact us to know your candidacy.

BHT is a cosmetic surgical procedure, a permanent hair restoration method, wherein healthy hair follicles are taken from any hair-bearing body site and implanted in the bald areas of the scalp to provide full hair coverage. It is solely done using a FUE (Follicular Unit Extraction) technique. The body areas that can serve as donor sites include the beard, chest, stomach, leg, armpits, and pubic area.`,
  isVisible: true
};

export { defaultBodyHairIntroSection };

export default function BodyHairIntroSection({ data, pageSlug = '' }) {
  const isBodyHairPage = BODY_HAIR_SLUGS.includes(String(pageSlug || '').toLowerCase());
  if (!isBodyHairPage) return null;

  const section = { ...defaultBodyHairIntroSection, ...(data || {}) };
  if (section.isVisible === false) return null;

  const paragraphs = String(section.content || defaultBodyHairIntroSection.content)
    .split(/\n\s*\n/)
    .map(item => item.trim())
    .filter(Boolean);

  return (
    <section className="body-hair-intro-section">
      <div className="body-hair-intro-container">
        <span className="body-hair-intro-kicker">Treatment Overview</span>
        <h2>{section.heading || defaultBodyHairIntroSection.heading}</h2>
        <div className="body-hair-intro-content">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
