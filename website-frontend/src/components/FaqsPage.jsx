"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';

const defaultCategories = ['General', 'Pricing & Billing', 'Our Treatments'];
const defaultFaqs = [
  { isEnabled: true, category: 'General', question: 'What Is The DMC-Golden Touch Technique?', answer: 'The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.', sortOrder: 10 },
  { isEnabled: true, category: 'General', question: 'Who Performs The Hair Transplants At DMC Trichology?', answer: 'Our procedures are performed by experienced DMC Trichology specialists using personalized planning and advanced clinical care.', sortOrder: 20 },
  { isEnabled: true, category: 'General', question: 'Can Both Men And Women Undergo Hair Transplant Procedures At DMC Trichology?', answer: 'Yes. Treatment plans are customized for both men and women based on scalp condition, donor availability, and the desired result.', sortOrder: 30 },
  { isEnabled: true, category: 'Pricing & Billing', question: 'How Is Hair Transplant Pricing Decided?', answer: 'Pricing depends on graft requirement, donor area health, treatment complexity, and the final plan confirmed during consultation.', sortOrder: 10 },
  { isEnabled: true, category: 'Pricing & Billing', question: 'Is The Consultation Fee Adjusted In Treatment Cost?', answer: 'The billing and adjustment details are explained clearly by the clinic team during your consultation and treatment planning.', sortOrder: 20 },
  { isEnabled: true, category: 'Pricing & Billing', question: 'Are EMI Or Payment Options Available?', answer: 'Available payment options can be discussed with the DMC Trichology team before confirming your treatment schedule.', sortOrder: 30 },
  { isEnabled: true, category: 'Our Treatments', question: 'What Types Of Hair Treatments Are Available At DMC Trichology?', answer: 'DMC Trichology offers advanced hair transplant, scalp restoration, non-surgical hair therapies, and personalized trichology protocols.', sortOrder: 10 },
  { isEnabled: true, category: 'Our Treatments', question: 'What Should I Wear To My Appointment?', answer: 'Wear loose, comfortable clothes. Avoid tight or formal clothing if you are coming for a procedure or detailed consultation.', sortOrder: 20 },
  { isEnabled: true, category: 'Our Treatments', question: 'How Can I Book A Consultation At DMC Trichology?', answer: 'You can book a consultation through the website form, call the clinic, or contact the DMC Trichology team directly.', sortOrder: 30 }
];

const hasText = (value) => String(value || '').trim().length > 0;

function stripHtml(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function FaqsHero({ data = {} }) {
  if (data.isEnabled === false) return null;

  return (
    <section className="faqs-page-hero">
      <div className="faqs-page-hero-inner">
        <h1>Frequently Asked Question</h1>
        <div className="faqs-page-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Faq</span>
        </div>
      </div>
    </section>
  );
}

function normalizeCategory(category) {
  return defaultCategories.includes(category) ? category : 'General';
}

function FaqGrid({ data = {} }) {
  const [activeCategory, setActiveCategory] = useState('General');
  const [activeCard, setActiveCard] = useState(3);
  if (data.isEnabled === false) return null;

  const faqs = useMemo(() => {
    const source = Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : defaultFaqs;
    return [...source]
          .filter(item => item?.isEnabled !== false && hasText(item?.question))
          .map((item, index) => ({
            ...item,
            category: normalizeCategory(item.category),
            answerPreview: stripHtml(item.answer),
            sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : (index + 1) * 10
          }))
          .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }, [data.faqs]);

  const categories = useMemo(() => {
    const dynamicCategories = faqs
      .map(item => item.category)
      .filter((category, index, list) => hasText(category) && list.indexOf(category) === index);

    return [...defaultCategories, ...dynamicCategories.filter(category => !defaultCategories.includes(category))];
  }, [faqs]);

  const safeActiveCategory = categories.includes(activeCategory) ? activeCategory : categories[0];
  const filteredFaqs = faqs.filter(item => item.category === safeActiveCategory);

  if (faqs.length === 0) return null;

  return (
    <section className="faqs-page-grid-section">
      <div className="faqs-page-tabs" role="tablist" aria-label="FAQ categories">
        {categories.map(category => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={safeActiveCategory === category}
            className={safeActiveCategory === category ? 'is-active' : ''}
            onClick={() => {
              setActiveCategory(category);
              setActiveCard(0);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="faqs-page-grid">
        {filteredFaqs.map((faq, index) => {
          const isActive = activeCard === index;
          return (
            <article
              key={`${safeActiveCategory}-${faq.question}-${index}`}
              className={`faqs-page-card${isActive ? ' is-active' : ''}`}
              onClick={() => setActiveCard(index)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActiveCard(index);
                }
              }}
            >
              <div className="faqs-page-card-copy">
                <h2>{faq.question}</h2>
                <p>{faq.answerPreview}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function FaqsPage({ data = {} }) {
  return (
    <main className="faqs-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .faqs-page {
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .faqs-page-hero {
          width: 100%;
          margin-top: 0;
          padding: 80px 5% 60px;
          background: #EEF0FA;
          box-sizing: border-box;
        }

        .faqs-page-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          margin-top: 110px;
        }

        .faqs-page-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 20px;
        }

        .faqs-page-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: #111111;
        }

        .faqs-page-breadcrumb a {
          color: #111111;
          text-decoration: none;
        }

        .faqs-page-grid-section {
          width: 100%;
          background: #ffffff;
          padding: 70px 5% 110px;
          box-sizing: border-box;
        }

        .faqs-page-tabs {
          width: min(100%, 430px);
          margin: 0 auto 42px;
          min-height: 40px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border: 1px solid rgba(17, 17, 17, 0.72);
          border-radius: 999px;
          overflow: hidden;
          background: #ffffff;
        }

        .faqs-page-tabs button {
          border: 0;
          background: transparent;
          color: #111111;
          font-family: 'Marcellus', serif;
          font-size: 14px;
          line-height: 1.2;
          cursor: pointer;
          padding: 10px 12px;
          transition: background .25s ease, color .25s ease;
          white-space: nowrap;
        }

        .faqs-page-tabs button.is-active {
          background: #3B5998;
          color: #ffffff;
          border-radius: 999px;
        }

        .faqs-page-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px 26px;
        }

        .faqs-page-card {
          min-height: 104px;
          display: flex;
          align-items: center;
          border: 1px solid rgba(17, 17, 17, 0.78);
          border-radius: 22px;
          background: #E8EAF6;
          padding: 24px 34px;
          box-sizing: border-box;
          cursor: pointer;
          transition: transform .25s ease, background .25s ease, color .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .faqs-page-card:hover,
        .faqs-page-card:focus-visible {
          transform: translateY(-2px);
          background: #3B5998;
          border-color: #3B5998;
          color: #ffffff;
          box-shadow: 0 18px 36px rgba(59, 89, 152, 0.14);
          outline: none;
        }

        .faqs-page-card.is-active {
          background: #3B5998;
          border-color: #3B5998;
          color: #ffffff;
          box-shadow: 0 22px 44px rgba(59, 89, 152, 0.18);
        }

        .faqs-page-card-copy h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(20px, 1.8vw, 27px);
          line-height: 1.1;
          font-weight: 400;
          color: inherit;
          margin: 0 0 8px;
          text-transform: capitalize;
        }

        .faqs-page-card-copy p {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.45;
          color: #111111;
          margin: 0;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .faqs-page-card:hover .faqs-page-card-copy p,
        .faqs-page-card:focus-visible .faqs-page-card-copy p,
        .faqs-page-card.is-active .faqs-page-card-copy p {
          color: rgba(255, 255, 255, 0.92);
        }

        @media (max-width: 1024px) {
          .faqs-page-hero {
            margin-top: 104px;
            padding: 70px 5% 52px;
          }

          .faqs-page-grid {
            gap: 18px;
          }

          .faqs-page-card {
            padding: 22px 24px;
          }
        }

        @media (max-width: 767px) {
          .faqs-page-hero {
            margin-top: 0;
            padding: 30px 16px 42px;
          }

          .faqs-page-hero h1 {
            font-size: clamp(30px, 8vw, 38px);
          }

          .faqs-page-grid-section {
            padding: 52px 16px 72px;
          }

          .faqs-page-tabs {
            width: 100%;
            margin-bottom: 34px;
          }

          .faqs-page-tabs button {
            font-size: 13px;
            padding: 10px 8px;
            white-space: normal;
          }

          .faqs-page-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .faqs-page-card {
            min-height: 112px;
            border-radius: 22px;
            padding: 22px 20px;
          }

          .faqs-page-card-copy h2 {
            font-size: 22px;
          }
        }

        @media (max-width: 390px) {
          .faqs-page-card {
            text-align: left;
          }
        }
      `}} />
      <FaqsHero data={data.hero || {}} />
      <FaqGrid data={data.faqSection || {}} />
    </main>
  );
}
