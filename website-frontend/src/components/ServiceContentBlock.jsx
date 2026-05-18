import React from 'react';

export default function ServiceContentBlock({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Filter visible blocks and sort them by sortOrder ascending
  const activeBlocks = data
    .filter(block => block.isVisible !== false)
    .sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      return orderA - orderB;
    });

  if (activeBlocks.length === 0) {
    return null;
  }

  return (
    <section className="service-content-block-section">
      <div className="service-content-block-container">
        {activeBlocks.map((block, idx) => (
          <div key={block._id || idx} className="service-content-block-item">
            {block.heading && (
              <h2 className="service-content-block-heading">
                {block.heading}
              </h2>
            )}
            {block.description && (
              <p className="service-content-block-description">
                {block.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
