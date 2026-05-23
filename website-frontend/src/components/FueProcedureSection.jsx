import React from 'react';

const FUE_SLUGS = ['fue-hair-transplant'];

const defaultFueProcedure = {
  heading: 'FUE HAIR TRANSPLANT PROCEDURE',
  image: '/images/service-details/fue-procedure.webp',
  altText: 'FUE hair transplant procedure at DMC Trichology',
  content: `The FUE technique involves extracting healthy follicular hair units from the donor scalp area, usually from the back or side of the scalp, and implanting them into the recipient area. It is performed with a sophisticated surgical tool to extract individual follicular units without damaging the neighbouring tissue.

The procedure is minimally invasive & discreet. The donor area is carefully shaved to remain undetectable and thus allows the patient to return to normal activities in no time.

Our leading **hair transplant surgeon** at DMC Trichology expertise in providing the **best FUE hair transplant in Delhi**. We are among the very few in the nation to have mastered the skill of complicated injectables associated with hair transplants. Being an expert in pain medicine and critical care, our surgeons provide the safest FUE hair transplantation with zero risk factors & optimal results.

To get the best FUE hair transplant or to learn about the FUE hair transplant cost in Delhi, visit DMC Trichology Centre. We have centres at Rajouri Garden (West Delhi) & Vasant Vihar (South Delhi).`,
  isVisible: true
};

function renderInlineFormatting(text) {
  const parts = String(text).split(/(\*\*[\s\S]+?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

export default function FueProcedureSection({ data, pageSlug = '' }) {
  const isFuePage = FUE_SLUGS.includes(String(pageSlug || '').toLowerCase());
  if (!isFuePage) return null;

  const section = { ...defaultFueProcedure, ...(data || {}) };
  if (section.isVisible === false) return null;

  const paragraphs = String(section.content || defaultFueProcedure.content)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="fue-procedure-section">
      <div className="fue-procedure-container">
        <h2 className="fue-procedure-heading">{section.heading || defaultFueProcedure.heading}</h2>
        <div className="fue-procedure-grid">
          <div className="fue-procedure-content">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{renderInlineFormatting(paragraph)}</p>
            ))}
          </div>

          <div className="fue-procedure-image-wrap">
            <img
              src={section.image || defaultFueProcedure.image}
              alt={section.altText || defaultFueProcedure.altText}
              className="fue-procedure-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
