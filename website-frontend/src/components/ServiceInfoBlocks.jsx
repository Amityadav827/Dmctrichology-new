import React from "react";

export default function ServiceInfoBlocks({ data }) {
  if (!data || data.isVisible === false) return null;

  const { blocks } = data;
  const activeBlocks = (blocks || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBlocks.length === 0) return null;

  return (
    <div className="service-infoblocks-wrapper">
      {activeBlocks.map((block, i) => {
        const isCream = block.backgroundVariant === "cream";
        return (
          <section 
            key={i} 
            className={`service-infoblocks-item ${isCream ? "bg-cream" : "bg-white"}`}
          >
            <div className="service-infoblocks-container">
              <h2 className="service-infoblocks-heading">
                {block.heading}
              </h2>
              <div className="service-infoblocks-divider"></div>
              <p className="service-infoblocks-desc">
                {block.description}
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
