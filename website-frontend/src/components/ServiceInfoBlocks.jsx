import React from "react";

export default function ServiceInfoBlocks({ data, pageSlug = "" }) {
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
        const isBestHairTransplantProcedure =
          pageSlug === "best-hair-transplant" &&
          String(block.heading || "").toLowerCase().includes("hair transplant procedure");
        const descriptionParts = String(block.description || "")
          .split(/\n+/)
          .map(part => part.trim())
          .filter(Boolean);

        if (isBestHairTransplantProcedure) {
          return (
            <section
              key={i}
              className="service-infoblocks-item bg-white best-hair-transplant-procedure"
            >
              <div className="service-infoblocks-container best-hair-transplant-procedure-card">
                <div className="best-hair-transplant-procedure-grid">
                  <div className="best-hair-transplant-procedure-heading-wrap">
                    <h2 className="service-infoblocks-heading">
                      {block.heading}
                    </h2>
                    <div className="service-infoblocks-divider"></div>
                  </div>

                  <div className="best-hair-transplant-procedure-copy">
                    {descriptionParts.map((part, partIndex) => (
                      <p className="service-infoblocks-desc" key={partIndex}>
                        {part}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }

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
