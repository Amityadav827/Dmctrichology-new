"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';

const shapeImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780648744156-578802102.png';

const hasText = (value) => String(value || '').trim().length > 0;

function ClientFeedbackHero({ data = {} }) {
  if (data.isEnabled === false) return null;

  return (
    <section className="cf-hero" style={{ background: data.backgroundColor || '#EEF0FA' }}>
      <div className="cf-hero-inner">
        <h1>{data.pageTitle || 'Client Feedback'}</h1>
        <div className="cf-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{data.breadcrumbLabel || 'Client Feedback'}</span>
        </div>
      </div>
    </section>
  );
}

function normalizeCard(card = {}, index = 0) {
  return {
    image: card.image || card.clientImage || '',
    clientName: card.clientName || card.name || '',
    feedbackText: card.feedbackText || card.feedback || card.description || '',
    rating: Number.isFinite(Number(card.rating)) ? Number(card.rating) : 5,
    location: card.location || '',
    sortOrder: Number.isFinite(Number(card.sortOrder)) ? Number(card.sortOrder) : (index + 1) * 10,
    isActive: card.isActive !== false
  };
}

function FeedbackCard({ card }) {
  const rating = Number(card.rating || 5);

  return (
    <article className="cf-card">
      <div className="cf-quote" aria-hidden="true">"</div>
      <p className="cf-text">{card.feedbackText}</p>

      <div className="cf-shape" aria-hidden="true" />

      <div className="cf-client-image">
        {hasText(card.image) ? (
          <img src={card.image} alt={card.clientName || 'DMC client'} loading="lazy" />
        ) : (
          <span>{String(card.clientName || 'C').slice(0, 1)}</span>
        )}
      </div>

      <div className="cf-bottom">
        <div>
          <h2>{card.clientName}</h2>
          {hasText(card.location) && <p>{card.location}</p>}
        </div>
        <div className="cf-rating" aria-label={`${rating} star rating`}>
          <span>{'\u2605'}</span>
          <em>({rating.toFixed(1).replace('.0', '')})</em>
        </div>
      </div>
    </article>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="cf-pagination" aria-label="Client feedback pagination">
      <button type="button" onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        Prev
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={page === item ? 'active' : ''}
          aria-current={page === item ? 'page' : undefined}
        >
          {item}
        </button>
      ))}
      <button type="button" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        Next
      </button>
      <i aria-hidden="true" />
    </nav>
  );
}

function FeedbackGrid({ data = {} }) {
  const [page, setPage] = useState(1);
  if (data.isEnabled === false) return null;

  const cards = useMemo(() => {
    return (Array.isArray(data.cards) ? data.cards : [])
      .map(normalizeCard)
      .filter(card => card.isActive !== false && hasText(card.feedbackText))
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }, [data.cards]);

  if (cards.length === 0) return null;

  const shouldPaginate = cards.length > 15;
  const perPage = shouldPaginate ? Math.max(1, Number(data.itemsPerPage || 15)) : cards.length;
  const totalPages = Math.max(1, Math.ceil(cards.length / perPage));
  const safePage = Math.min(page, totalPages);
  const visibleCards = shouldPaginate ? cards.slice((safePage - 1) * perPage, safePage * perPage) : cards;

  return (
    <section className="cf-section">
      <div className="cf-grid">
        {visibleCards.map((card, index) => (
          <FeedbackCard key={`${card.clientName}-${index}`} card={card} />
        ))}
      </div>
      {shouldPaginate && <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />}
    </section>
  );
}

export default function ClientFeedbackPage({ data = {} }) {
  return (
    <main className="client-feedback-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .client-feedback-page {
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .cf-hero {
          width: 100%;
          margin-top: 0;
          padding: 80px 5% 60px;
          box-sizing: border-box;
        }

        .cf-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          margin-top: 110px;
        }

        .cf-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 18px;
        }

        .cf-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #111111;
        }

        .cf-breadcrumb a {
          color: #111111;
          text-decoration: none;
        }

        .cf-section {
          padding: 88px 5% 96px;
          background: #ffffff;
        }

        .cf-grid {
          max-width: 1168px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 40px;
        }

        .cf-card {
          position: relative;
          min-height: 420px;
          border-radius: 30px;
          overflow: hidden;
          background: #e8eaf6;
          box-shadow: 0 18px 38px rgba(59, 89, 152, 0.08);
          isolation: isolate;
        }

        .cf-quote {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #3B5998;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Georgia, serif;
          font-size: 46px;
          line-height: 1;
          margin: 32px auto 20px;
          padding-bottom: 10px;
          box-sizing: border-box;
        }

        .cf-text {
          position: relative;
          z-index: 3;
          max-width: 286px;
          min-height: 213px;
          margin: 0 auto;
          font-family: 'Marcellus', serif;
          font-size: 14px;
          line-height: 1.48;
          color: #111111;
          text-align: center;
          text-transform: capitalize;
        }

        .cf-shape {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 400px;
          background-image: url(${shapeImage});
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center bottom;
          z-index: 1;
        }

        .cf-client-image {
          position: absolute;
          right: 60px;
          bottom: 90px;
          z-index: 4;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          background: #EEF0FA;
          border: 6px solid #3B5998;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Marcellus', serif;
          font-size: 24px;
          color: #3B5998;
          box-sizing: border-box;
        }

        .cf-client-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cf-bottom {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 26px;
          z-index: 3;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          color: #ffffff;
        }

        .cf-bottom h2 {
          font-family: 'Marcellus', serif;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 8px;
        }

        .cf-bottom p {
          font-family: 'Lato', sans-serif;
          font-size: 10px;
          line-height: 1.25;
          color: rgba(255,255,255,0.9);
          margin: 0 0 2px;
        }

        .cf-rating {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          font-family: 'Lato', sans-serif;
          color: #ffffff;
        }

        .cf-rating span {
          color: #FFD000;
          font-size: 24px;
          line-height: 1;
        }

        .cf-rating em {
          font-size: 13px;
          font-style: normal;
        }

        .cf-pagination {
          max-width: 1168px;
          margin: 58px auto 0;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .cf-pagination button {
          width: 46px;
          height: 46px;
          border: 1px solid #111111;
          border-radius: 50%;
          background: #ffffff;
          color: #111111;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background .25s ease, color .25s ease, border-color .25s ease;
        }

        .cf-pagination button:first-child,
        .cf-pagination button:last-child {
          width: auto;
          min-width: 54px;
          padding: 0 14px;
          border-radius: 999px;
          display: none;
        }

        .cf-pagination button.active {
          background: #3B5998;
          border-color: #3B5998;
          color: #ffffff;
        }

        .cf-pagination button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .cf-pagination i {
          height: 1px;
          flex: 1;
          background: #d9d9d9;
        }

        @media (max-width: 1199px) {
          .cf-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            max-width: 780px;
          }
        }

        @media (max-width: 767px) {
          .cf-hero {
            padding: 56px 16px 42px;
          }

          .cf-hero-inner {
            margin-top: 100px;
          }

          .cf-hero h1 {
            font-size: 30px;
          }

          .cf-section {
            padding: 58px 16px 76px;
          }

          .cf-grid {
            grid-template-columns: 1fr;
            max-width: 380px;
            gap: 28px;
          }
        }

        @media (max-width: 390px) {
          .cf-card {
            border-radius: 26px;
          }

          .cf-text {
            font-size: 18px;
            max-width: 260px;
          }

          .cf-client-image {
            right: 48px;
          }
        }
      `}} />
      <ClientFeedbackHero data={data.hero || {}} />
      <FeedbackGrid data={data.feedbackSection || {}} />
    </main>
  );
}
