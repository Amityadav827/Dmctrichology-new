import React from 'react';

const FUE_SLUGS = ['fue-hair-transplant'];

const defaultFueCostSection = {
  heading: 'FUE HAIR TRANSPLANT COST IN DELHI',
  introText: 'The key elements that affect the cost of FUE hair transplant in Delhi are:',
  points: [
    { pointText: 'Number of grafts required to cover the balding area', sortOrder: 1, isVisible: true },
    { pointText: 'Extend of hair loss', sortOrder: 2, isVisible: true },
    { pointText: "quality and thickness of the donor's hair", sortOrder: 3, isVisible: true },
    { pointText: 'Experience and skill of the hair transplant surgeon', sortOrder: 4, isVisible: true },
    { pointText: 'post-surgery care and follow-up appointments', sortOrder: 5, isVisible: true },
    { pointText: 'Clinics facility with technology offered', sortOrder: 6, isVisible: true },
    { pointText: 'Customization of the treatment to enhance the result.', sortOrder: 7, isVisible: true }
  ],
  noteText: "The cost per graft ranges from Rs 20 to Rs 120. It is decided based on the donor site's health.",
  image: '/images/service-details/fue-cost-info.webp',
  altText: 'FUE hair transplant cost in Delhi chart',
  tableHeaders: ['No. of Grafts', 'FUE Hair Transplant Cost in Delhi'],
  tableRows: [
    { grafts: '< 2000', cost: '50K', sortOrder: 1, isVisible: true },
    { grafts: '2500-3500', cost: '60K-84K', sortOrder: 2, isVisible: true },
    { grafts: '3500-4500', cost: '84K- 108K', sortOrder: 3, isVisible: true },
    { grafts: '4500-5500', cost: '108K-132K', sortOrder: 4, isVisible: true },
    { grafts: 'More than 6000', cost: '144K', sortOrder: 5, isVisible: true }
  ],
  isVisible: true
};

export { defaultFueCostSection };

export default function FueCostSection({ data, pageSlug = '' }) {
  const isFuePage = FUE_SLUGS.includes(String(pageSlug || '').toLowerCase());
  if (!isFuePage) return null;

  const section = { ...defaultFueCostSection, ...(data || {}) };
  if (section.isVisible === false) return null;

  const points = (section.points?.length ? section.points : defaultFueCostSection.points)
    .filter(point => point.isVisible !== false && point.pointText)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const rows = (section.tableRows?.length ? section.tableRows : defaultFueCostSection.tableRows)
    .filter(row => row.isVisible !== false && (row.grafts || row.cost))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const headers = section.tableHeaders?.length ? section.tableHeaders : defaultFueCostSection.tableHeaders;

  return (
    <section className="fue-cost-section">
      <div className="fue-cost-container">
        <div className="fue-cost-header">
          <div>
            <span className="fue-cost-kicker">Cost Guide</span>
            <h2>{section.heading || defaultFueCostSection.heading}</h2>
            <p>{section.introText || defaultFueCostSection.introText}</p>
          </div>
          <div className="fue-cost-image-wrap">
            <img
              src={section.image || defaultFueCostSection.image}
              alt={section.altText || defaultFueCostSection.altText}
              className="fue-cost-image"
              loading="lazy"
            />
          </div>
        </div>

        <div className="fue-cost-points">
          {points.map((point, index) => (
            <div className="fue-cost-point" key={point._id || index}>
              <span className="fue-cost-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{point.pointText}</span>
            </div>
          ))}
        </div>

        {section.noteText && <p className="fue-cost-note">{section.noteText}</p>}

        <div className="fue-cost-table-wrap">
          <table className="fue-cost-table">
            <thead>
              <tr>
                <th>{headers[0] || defaultFueCostSection.tableHeaders[0]}</th>
                <th>{headers[1] || defaultFueCostSection.tableHeaders[1]}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row._id || index}>
                  <td>{row.grafts}</td>
                  <td>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
