"use client";

import { useState } from 'react';
import Link from 'next/link';

const hasText = (value) => String(value || '').trim().length > 0;

function FaqsHero({ data = {} }) {
  if (data.isEnabled === false) return null;
  const pageTitle = data.pageTitle || 'Frequently Asked Questions';
  const breadcrumbLabel = data.breadcrumbLabel || 'Frequently Asked Questions';
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.64;
  const style = data.backgroundImage ? { backgroundImage: `url(${data.backgroundImage})` } : {};

  return (
    <section className="faqs-page-hero" style={style}>
      <div className="faqs-page-hero-overlay" style={{ opacity: overlayOpacity }} />
      <div className="faqs-page-hero-inner">
        <h1>{pageTitle}</h1>
        <div className="faqs-page-breadcrumb">
          <Link href="/">Home</Link>
          <span>→</span>
          <span>{breadcrumbLabel}</span>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ faq, index, isOpen, onToggle }) {
  return (
    <article className={`faqs-page-item${isOpen ? ' is-open' : ''}`}>
      <button type="button" onClick={() => onToggle(index)} aria-expanded={isOpen}>
        <span>{faq.question}</span>
        <svg className="faqs-page-arrow" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="faqs-page-answer">
        <div>
          <p>{faq.answer}</p>
        </div>
      </div>
    </article>
  );
}

function FaqListing({ data = {} }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (data.isEnabled === false) return null;

  const faqs = Array.isArray(data.faqs)
    ? [...data.faqs]
      .filter(item => item?.isEnabled !== false && hasText(item?.question))
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    : [];

  if (faqs.length === 0) return null;

  return (
    <section className="faqs-page-listing">
      <div className="faqs-page-grid">
        {faqs.map((faq, index) => (
          <FaqItem
            key={`${faq.question}-${index}`}
            faq={faq}
            index={index}
            isOpen={openIndex === index}
            onToggle={(idx) => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
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
          position: relative;
          min-height: 430px;
          padding: 170px 5% 92px;
          background-color: #2c3032;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .faqs-page-hero-overlay {
          position: absolute;
          inset: 0;
          background: #000000;
          z-index: 1;
          pointer-events: none;
        }

        .faqs-page-hero-inner {
          position: relative;
          z-index: 2;
          width: min(100%, 1220px);
          margin: 0 auto;
          color: #ffffff;
        }

        .faqs-page-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: 48px;
          line-height: 1.15;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 18px;
        }

        .faqs-page-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
        }

        .faqs-page-breadcrumb a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
        }

        .faqs-page-breadcrumb span:last-child {
          color: #ffffff;
        }

        .faqs-page-listing {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          padding: 82px 5% 100px;
        }

        .faqs-page-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 24px;
          align-items: start;
        }

        .faqs-page-item {
          background: #ffffff;
          border: 1px solid rgba(59,89,152,.14);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 14px 32px rgba(59,89,152,.08);
          transition: box-shadow .25s ease, border-color .25s ease, transform .25s ease;
        }

        .faqs-page-item:hover,
        .faqs-page-item.is-open {
          border-color: rgba(59,89,152,.3);
          box-shadow: 0 22px 46px rgba(59,89,152,.13);
          transform: translateY(-2px);
        }

        .faqs-page-item button {
          width: 100%;
          min-height: 68px;
          border: 0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 20px 24px;
          cursor: pointer;
          text-align: left;
          color: #111111;
        }

        .faqs-page-item button span {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.35;
          font-weight: 800;
        }

        .faqs-page-arrow {
          flex: 0 0 auto;
          color: #3B5998;
          transition: transform .25s ease;
        }

        .faqs-page-item.is-open .faqs-page-arrow {
          transform: rotate(180deg);
        }

        .faqs-page-answer {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .3s ease;
          border-top: 1px solid transparent;
        }

        .faqs-page-item.is-open .faqs-page-answer {
          grid-template-rows: 1fr;
          border-top-color: rgba(59,89,152,.12);
        }

        .faqs-page-answer > div {
          overflow: hidden;
        }

        .faqs-page-answer p {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.75;
          color: #333333;
          margin: 0;
          padding: 0 24px 22px;
        }

        @media (max-width: 1024px) {
          .faqs-page-hero {
            min-height: 390px;
            padding: 145px 5% 78px;
          }

          .faqs-page-hero h1 {
            font-size: 42px;
          }
        }

        @media (max-width: 767px) {
          .faqs-page-hero {
            min-height: 330px;
            padding: 120px 5% 58px;
          }

          .faqs-page-hero h1 {
            font-size: 34px;
          }

          .faqs-page-listing {
            padding: 58px 5% 72px;
          }

          .faqs-page-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .faqs-page-item button {
            min-height: 62px;
            padding: 18px 18px;
          }

          .faqs-page-item button span {
            font-size: 15px;
          }

          .faqs-page-answer p {
            padding: 0 18px 20px;
            font-size: 14px;
          }
        }

        @media (max-width: 390px) {
          .faqs-page-hero h1 {
            font-size: 30px;
          }

          .faqs-page-breadcrumb {
            font-size: 13px;
            flex-wrap: wrap;
          }
        }
      `}} />
      <FaqsHero data={data.hero || {}} />
      <FaqListing data={data.faqSection || {}} />
    </main>
  );
}
