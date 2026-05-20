import React from "react";
import { Check } from "lucide-react";

export default function ServiceAftercare({ data, pageSlug = "" }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, conclusionText, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const resultHeading =
    activeBullets[0]?.bulletText || "EXPECTED RECOVERY & RESULTS TIMELINE";

  return (
    <section className="service-aftercare-section best-hair-transplant-aftercare">
      <div className="best-hair-transplant-aftercare-container">
        <article className="best-hair-transplant-aftercare-card best-hair-transplant-aftercare-primary">
          <div className="best-hair-transplant-aftercare-mark">
            <Check className="service-aftercare-bullet-icon" />
          </div>
          <div>
            <h2 className="service-aftercare-heading">
              {sectionHeading || "WHAT TO EXPECT AFTER THE TREATMENT?"}
            </h2>
            <div className="service-aftercare-divider"></div>
            {introText && (
              <p className="service-aftercare-intro-text">
                {introText}
              </p>
            )}
          </div>
        </article>

        <article className="best-hair-transplant-aftercare-card best-hair-transplant-aftercare-secondary">
          <div className="best-hair-transplant-aftercare-mark">
            <Check className="service-aftercare-bullet-icon" />
          </div>
          <div>
            <h3 className="best-hair-transplant-aftercare-subheading">
              {resultHeading}
            </h3>
            {conclusionText && (
              <p className="service-aftercare-intro-text">
                {conclusionText}
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

