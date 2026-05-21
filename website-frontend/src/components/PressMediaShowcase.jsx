"use client";
import React from 'react';

const PressMediaShowcase = ({ cards = [] }) => {
  const visibleCards = cards
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (visibleCards.length === 0) {
    return (
      <section className="pm-showcase-section">
        <div className="pm-showcase-inner">
          <div className="pm-showcase-header">
            <div className="pm-showcase-badge">Coverage</div>
            <h2 className="pm-showcase-title">Featured In The Media</h2>
            <p className="pm-showcase-subtitle">
              Trusted by leading publications and media houses across India
            </p>
          </div>
          <div className="pm-showcase-empty">
            <p>No media cards available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pm-showcase-section">
        <div className="pm-showcase-inner">
          {/* Section Header */}
          <div className="pm-showcase-header">
            <div className="pm-showcase-badge">Coverage</div>
            <h2 className="pm-showcase-title">Featured In The Media</h2>
            <p className="pm-showcase-subtitle">
              Trusted by leading publications and media houses across India
            </p>
          </div>

          {/* Cards Grid */}
          <div className="pm-cards-grid">
            {visibleCards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="pm-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Main screenshot image */}
                <div className="pm-card-img-wrap">
                  {card.mediaImage ? (
                    <img
                      src={card.mediaImage}
                      alt={card.mediaTitle || 'Media coverage'}
                      className="pm-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="pm-card-img-placeholder">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                        <rect width="48" height="48" rx="8" fill="rgba(255,255,255,0.1)"/>
                        <path d="M16 20h16M16 24h10M16 28h12" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}

                  {/* Gradient overlay on image */}
                  <div className="pm-card-img-overlay" />

                  {/* Media logo badge */}
                  {card.mediaLogo && (
                    <div className="pm-card-logo-wrap">
                      <img
                        src={card.mediaLogo}
                        alt="Media outlet logo"
                        className="pm-card-logo"
                      />
                    </div>
                  )}

                  {/* External link icon */}
                  <div className="pm-card-link-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M12 4H7M12 4V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Card footer */}
                <div className="pm-card-footer">
                  <h3 className="pm-card-title">{card.mediaTitle || 'Media Feature'}</h3>

                  {card.mediaLink && card.mediaLink !== '#' ? (
                    <a
                      href={card.mediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pm-card-cta"
                      aria-label={`Read article: ${card.mediaTitle}`}
                    >
                      <span>Read Article</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M11 3L3 11M11 3H6.5M11 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <span className="pm-card-cta pm-card-cta--disabled">
                      <span>View Feature</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M11 3L3 11M11 3H6.5M11 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ─── Section Wrapper ─────────────────────────────────── */
        .pm-showcase-section {
          background: linear-gradient(180deg, #f8f9fb 0%, #ffffff 100%);
          padding: 90px 5% 100px;
          position: relative;
          overflow: hidden;
        }

        .pm-showcase-section::before {
          content: '';
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59,89,152,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .pm-showcase-section::after {
          content: '';
          position: absolute;
          bottom: -150px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59,89,152,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .pm-showcase-inner {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ─── Section Header ──────────────────────────────────── */
        .pm-showcase-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .pm-showcase-badge {
          display: inline-block;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #3b5998;
          border: 1px solid rgba(59,89,152,0.3);
          border-radius: 100px;
          padding: 6px 20px;
          margin-bottom: 20px;
          background: rgba(59,89,152,0.06);
        }

        .pm-showcase-title {
          font-family: 'Marcellus', serif !important;
          font-size: 44px !important;
          font-weight: 400 !important;
          color: #111111 !important;
          margin: 0 0 16px !important;
          line-height: 1.2 !important;
          text-transform: uppercase !important;
        }

        .pm-showcase-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          color: #777777;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ─── Cards Grid ──────────────────────────────────────── */
        .pm-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        /* ─── Individual Card ─────────────────────────────────── */
        .pm-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          transition: transform 0.4s cubic-bezier(0.25,1,0.5,1),
                      box-shadow 0.4s cubic-bezier(0.25,1,0.5,1);
          display: flex;
          flex-direction: column;
          animation: pmCardFadeIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes pmCardFadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pm-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 60px rgba(59,89,152,0.15),
                      0 6px 24px rgba(0,0,0,0.08);
          border-color: rgba(59,89,152,0.2);
        }

        /* ─── Card Image ──────────────────────────────────────── */
        .pm-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: #1a2740;
        }

        .pm-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25,1,0.5,1);
        }

        .pm-card:hover .pm-card-img {
          transform: scale(1.06);
        }

        .pm-card-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a2740 0%, #3b5998 100%);
        }

        .pm-card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.65) 0%,
            rgba(0,0,0,0) 50%
          );
          transition: opacity 0.4s ease;
        }

        .pm-card:hover .pm-card-img-overlay {
          opacity: 0.8;
        }

        /* Media Logo Badge — bottom-left of image */
        .pm-card-logo-wrap {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(255,255,255,0.95);
          border-radius: 10px;
          padding: 6px 12px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          max-width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .pm-card:hover .pm-card-logo-wrap {
          transform: translateY(-3px);
        }

        .pm-card-logo {
          max-height: 28px;
          max-width: 100%;
          object-fit: contain;
        }

        /* External link icon — top-right of image */
        .pm-card-link-icon {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.25);
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .pm-card:hover .pm-card-link-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* ─── Card Footer ─────────────────────────────────────── */
        .pm-card-footer {
          padding: 22px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pm-card-title {
          font-family: 'Marcellus', serif !important;
          font-size: 18px !important;
          font-weight: 400 !important;
          color: #111111 !important;
          line-height: 1.45 !important;
          margin: 0 !important;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* CTA link */
        .pm-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #3b5998;
          text-decoration: none;
          border-bottom: 1.5px solid rgba(59,89,152,0.3);
          padding-bottom: 2px;
          margin-top: auto;
          width: fit-content;
          transition: color 0.25s ease, border-color 0.25s ease, gap 0.25s ease;
        }

        .pm-card-cta:hover {
          color: #1a2d6b;
          border-color: #1a2d6b;
          gap: 10px;
        }

        .pm-card-cta--disabled {
          color: #aaaaaa;
          border-color: rgba(0,0,0,0.1);
          cursor: default;
        }

        /* ─── Empty state ─────────────────────────────────────── */
        .pm-showcase-empty {
          text-align: center;
          padding: 80px 40px;
          background: #f8f9fb;
          border-radius: 20px;
          border: 2px dashed rgba(59,89,152,0.15);
          color: #aaaaaa;
          font-family: 'Lato', sans-serif;
        }

        /* ─── Responsive ──────────────────────────────────────── */
        @media (max-width: 1024px) {
          .pm-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
          .pm-showcase-title {
            font-size: 36px !important;
          }
        }

        @media (max-width: 640px) {
          .pm-showcase-section {
            padding: 60px 5% 70px;
          }
          .pm-cards-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .pm-showcase-title {
            font-size: 28px !important;
          }
          .pm-showcase-header {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default PressMediaShowcase;
