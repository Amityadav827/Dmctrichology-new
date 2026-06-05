import Link from 'next/link';

const beforeImage = 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png';
const afterImage = 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png';

const defaultCards = [
  ['Korean Facial Illumination', 'After 6 sessions'],
  ['Acne Arrestor Facial With Salicylic Peel', 'After 4 sessions'],
  ['Elastin Boost Facial', 'After 5 sessions'],
  ['Derma Revive Facial', 'After 4 sessions'],
  ['Hair Growth Restoration', 'After 6 sessions'],
  ['Scalp Renewal Therapy', 'After 5 sessions'],
  ['PRP Hair Treatment', 'After 4 sessions'],
  ['Golden Touch Result', 'After 6 sessions']
].map(([treatmentName, sessionsText], index) => ({
  treatmentName,
  beforeImage,
  afterImage,
  sessionsText,
  sortOrder: (index + 1) * 10,
  isActive: true
}));

const hasText = (value) => String(value || '').trim().length > 0;

function RealResultsHero({ data = {} }) {
  if (data.isEnabled === false) return null;

  return (
    <section className="rr-hero" style={{ background: data.backgroundColor || '#EEF0FA' }}>
      <div className="rr-hero-inner">
        <h1>{data.pageTitle || 'Real Results'}</h1>
        <div className="rr-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{data.breadcrumbLabel || 'Real Results'}</span>
        </div>
      </div>
    </section>
  );
}

function normalizeCard(card = {}, index = 0) {
  return {
    treatmentName: card.treatmentName || card.title || '',
    beforeImage: card.beforeImage || '',
    afterImage: card.afterImage || '',
    sessionsText: card.sessionsText || card.sessions || card.description || '',
    sortOrder: Number.isFinite(Number(card.sortOrder)) ? Number(card.sortOrder) : (index + 1) * 10,
    isActive: card.isActive !== false
  };
}

function ResultImage({ src, label, title }) {
  return (
    <div className="rr-image-wrap">
      {hasText(src) ? (
        <img src={src} alt={`${title} ${label}`} loading="lazy" />
      ) : (
        <span className="rr-image-placeholder">{label}</span>
      )}
      <span className="rr-image-label">{label}</span>
    </div>
  );
}

function ResultCard({ card }) {
  return (
    <article className="rr-card">
      <h2>{card.treatmentName}</h2>
      <div className="rr-images">
        <ResultImage src={card.beforeImage} label="Before" title={card.treatmentName} />
        <ResultImage src={card.afterImage} label="After" title={card.treatmentName} />
      </div>
      {hasText(card.sessionsText) && <p>{card.sessionsText}</p>}
    </article>
  );
}

function ResultsGrid({ data = {} }) {
  if (data.isEnabled === false) return null;

  const sourceCards = Array.isArray(data.cards) && data.cards.length > 0 ? data.cards : defaultCards;
  const cards = sourceCards
    .map(normalizeCard)
    .filter(card => card.isActive !== false && hasText(card.treatmentName))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

  if (cards.length === 0) return null;

  return (
    <section className="rr-section">
      <div className="rr-grid">
        {cards.map((card, index) => (
          <ResultCard key={`${card.treatmentName}-${index}`} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function RealResultsPage({ data = {} }) {
  return (
    <main className="real-results-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .real-results-page {
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .rr-hero {
          width: 100%;
          margin-top: 0;
          padding: 80px 5% 60px;
          box-sizing: border-box;
        }

        .rr-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          margin-top: 110px;
        }

        .rr-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 18px;
        }

        .rr-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #111111;
        }

        .rr-breadcrumb a {
          color: #111111;
          text-decoration: none;
        }

        .rr-section {
          padding: 90px 5% 104px;
          background: #ffffff;
        }

        .rr-grid {
          width: min(100%, 1440px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 26px;
        }

        .rr-card {
          background: #EEF0FA;
          border-radius: 20px;
          padding: 14px 14px 16px;
          box-shadow: 0 16px 34px rgba(59, 89, 152, 0.08);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .rr-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 44px rgba(59, 89, 152, 0.14);
        }

        .rr-card h2 {
          font-family: 'Lato', sans-serif;
          font-size: 20px;
          line-height: 1.18;
          font-weight: 500;
          color: #111111;
          text-align: center;
          margin: 0 0 10px;
          min-height: 24px;
        }

        .rr-images {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .rr-image-wrap {
          position: relative;
          aspect-ratio: 0.76 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: #d9dbe8;
        }

        .rr-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .rr-image-wrap::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 42%;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.46));
          pointer-events: none;
        }

        .rr-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Lato', sans-serif;
          color: #666666;
        }

        .rr-image-label {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 9px;
          z-index: 2;
          text-align: center;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1;
          color: #ffffff;
        }

        .rr-card p {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.25;
          color: #555555;
          text-align: center;
          margin: 12px 0 0;
        }

        @media (max-width: 1199px) {
          .rr-grid {
            max-width: 760px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .rr-hero {
            padding: 56px 16px 42px;
          }

          .rr-hero-inner {
            margin-top: 100px;
          }

          .rr-hero h1 {
            font-size: 30px;
          }

          .rr-section {
            padding: 58px 16px 78px;
          }

          .rr-grid {
            max-width: 360px;
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .rr-card {
            padding: 14px;
          }

          .rr-card h2 {
            font-size: 18px;
          }
        }
      `}} />
      <RealResultsHero data={data.hero || {}} />
      <ResultsGrid data={data.resultsSection || {}} />
    </main>
  );
}
