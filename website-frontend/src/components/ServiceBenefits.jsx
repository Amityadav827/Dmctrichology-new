import React from 'react';

const COST_DETAIL_SLUGS = ['hair-transplant-cost-in-delhi', 'hair-transplant-cost-in-india'];

const costInfoDefaults = {
  heading: 'HOW MUCH HAIR TRANSPLANT COST IN DELHI AT DMC TRICHOLOGY?',
  description: "The price of hair transplant surgery will vary significantly from case to case. It depends on a number of variables, including the hair transplant surgeon's experience, the reputation of the clinic, the approach used, the degree of hair loss, and the quantity of grafts required. During the visit, the trichologist will determine the number of grafts required to cover your bald area or based on the severity of hair loss.",
  secondaryHeading: 'HOW MUCH DOES A FUT HAIR TRANSPLANT COST?',
  secondaryDescription: 'Follicular Unit Transplantation or FUT or strip surgery, is a hair transplant technique in which healthy hair follicles or grafts are extracted from a strip that is extracted from the hair-bearing part of the skin. Then they are transplanted to areas affected with hair loss.',
  benefitStripHeading: 'BENEFITS OF HAIR TRANSPLANT AT DMC TRICHOLOGY',
  points: [
    { benefitText: 'Natural regrowth of hair', sortOrder: 1, isVisible: true },
    { benefitText: 'Minimum downtime', sortOrder: 2, isVisible: true },
    { benefitText: 'Pain-free with no visible scars', sortOrder: 3, isVisible: true },
    { benefitText: 'Long-term cost efficient', sortOrder: 4, isVisible: true }
  ]
};

function isGenericBenefitPointSet(points = []) {
  const text = points.map(point => String(point?.benefitText || '').toLowerCase()).join(' ');
  return points.length < 4 || text.includes('painless and non-invasive') || text.includes('maximizes hair density') || text.includes('minimal post-treatment');
}

function CostBenefitFallbackIcon({ index }) {
  const icons = [
    (
      <svg viewBox="0 0 56 56" fill="none">
        <path d="M10 34c7-7 12-7 18 0s11 7 18 0" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M13 26c5-6 10-6 15 0s10 6 15 0" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M19 37c0 4 3 7 7 7h5c4 0 7-3 7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M22 16l-3 7M28 13l-2 8M35 16l-3 7" stroke="#F5B63F" strokeWidth="2.3" strokeLinecap="round" />
      </svg>
    ),
    (
      <svg viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="2.3" />
        <path d="M28 16v12l8 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 8v4M28 44v4M8 28h4M44 28h4" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M37 39l5 5 5-9" stroke="#F5B63F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    (
      <svg viewBox="0 0 56 56" fill="none">
        <path d="M20 24c0-6 4-10 10-10s10 4 10 10c0 8-5 12-10 12s-10-4-10-12Z" stroke="currentColor" strokeWidth="2.3" />
        <path d="M18 44c2-6 6-9 12-9s10 3 12 9" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M24 24h.1M36 24h.1M26 30c2 2 6 2 8 0" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M13 16l4 4M43 16l-4 4" stroke="#F5B63F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    (
      <svg viewBox="0 0 56 56" fill="none">
        <path d="M18 39a18 18 0 1 1 23-23" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M17 39l-2 7 7-2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="39" cy="37" r="8" stroke="#F5B63F" strokeWidth="2.3" />
        <path d="M39 32v10M35 36h8" stroke="#F5B63F" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M24 17h10M21 24h15M20 31h10" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      </svg>
    )
  ];

  return icons[index % icons.length];
}

function getCostBenefitItems(data) {
  const sourcePoints = data?.points?.length && !isGenericBenefitPointSet(data.points) ? data.points : costInfoDefaults.points;

  return (sourcePoints || [])
    .filter(pt => pt.isVisible !== false && pt.benefitText?.trim() !== '')
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function CostBenefitsStrip({ data }) {
  const benefitStripHeading = data?.benefitStripHeading || costInfoDefaults.benefitStripHeading;
  const activePoints = getCostBenefitItems(data);

  if (activePoints.length === 0) return null;

  return (
    <section className="hair-cost-benefits-strip">
      <div className="hair-cost-benefits-strip-inner">
        <div className="hair-cost-benefits-strip-head">
          <span className="hair-cost-benefits-kicker">Treatment Advantages</span>
          <h2>{benefitStripHeading}</h2>
        </div>
        <div className="hair-cost-benefits-grid">
          {activePoints.map((point, index) => (
            <div className="hair-cost-benefit-item" key={point._id || index}>
              <span className="hair-cost-benefit-icon" aria-hidden={!point.icon}>
                {point.icon ? (
                  <img src={point.icon} alt="" loading="lazy" />
                ) : (
                  <CostBenefitFallbackIcon index={index} />
                )}
              </span>
              <span className="hair-cost-benefit-text">{point.benefitText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function ServiceBenefits({ data, pageSlug = '' }) {
  if (!data) return null;
  if (data.isVisible === false) return null;

  const isCostDetailPage = COST_DETAIL_SLUGS.includes(String(pageSlug).toLowerCase());
  if (isCostDetailPage) {
    return <CostBenefitsStrip data={data} />;
  }

  const { heading, image, altText, points } = data;

  // Filter visible points and sort them by sortOrder ascending
  const activePoints = (points || [])
    .filter(pt => pt.isVisible !== false && pt.benefitText?.trim() !== "")
    .sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      return orderA - orderB;
    });

  if (activePoints.length === 0) {
    return null;
  }

  return (
    <section className="service-benefits-section">
      <div className="sbn-header">
        <span className="dmc-kicker">Treatment Benefits</span>
        {heading && <h2 className="dmc-heading" style={{ marginBottom: 0 }}>{heading}</h2>}
      </div>
      <div className="service-benefits-container">
        {/* Left Side: Image Column */}
        {image && (
          <div className="service-benefits-image-col">
            <div className="service-benefits-image-wrapper">
              <img
                src={image}
                alt={altText || heading || "Treatment benefits"}
                className="service-benefits-img"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Right Side: Benefit Cards Grid */}
        <div className="service-benefits-content-col">
          <div className="sbn-grid">
            {activePoints.map((pt, idx) => (
              <div key={pt._id || idx} className="sbn-card">
                <span className="sbn-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="sbn-text">{pt.benefitText}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
