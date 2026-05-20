import React from "react";
import {
  Award,
  Ban,
  Bed,
  CalendarCheck,
  Droplets,
  Pill,
  ShowerHead,
  Sun,
  Waves,
} from "lucide-react";

const followUpText = "Schedule check-up appointments after 3 months and 6 months after the surgery to see the progress of the results.";

const getAftercareIcon = (text = "") => {
  const lower = text.toLowerCase();

  if (lower.includes("saline") || lower.includes("spray")) return Droplets;
  if (lower.includes("washed") || lower.includes("shampoo") || lower.includes("wash")) return ShowerHead;
  if (lower.includes("rest") || lower.includes("recovery")) return Bed;
  if (lower.includes("swimming") || lower.includes("steam") || lower.includes("hot bath")) return Waves;
  if (lower.includes("painkiller") || lower.includes("medications") || lower.includes("antibiotics")) return Pill;
  if (lower.includes("hair products") || lower.includes("tight headwear") || lower.includes("comb")) return Ban;
  if (lower.includes("sunlight") || lower.includes("sun")) return Sun;
  if (lower.includes("check-up") || lower.includes("appointment") || lower.includes("progress")) return CalendarCheck;

  return Award;
};

export default function ServiceWhyChooseUs({ data, pageSlug = "" }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, features } = data;
  const activeFeatures = (features || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeFeatures.length === 0 && !sectionHeading) return null;

  const lowerSlug = (pageSlug || "").toLowerCase();
  const hasSurgery = lowerSlug.includes("transplant") || lowerSlug.includes("surgery") || lowerSlug.includes("fue");
  const dynamicFollowUp = hasSurgery 
    ? "Schedule check-up appointments after 3 months and 6 months after the surgery to see the progress of the results." 
    : "Schedule regular follow-up sessions as advised by our specialists to monitor your progress and maintain optimal results.";

  return (
    <section className="service-whychoose-section best-hair-transplant-scalp-care">
      <div className="service-whychoose-container">
        <div className="service-whychoose-header">
          <div>
            <span className="service-whychoose-label">The Gold Standard</span>
            <h2 className="service-whychoose-heading">
              {sectionHeading || "Why Choose DMC?"}
            </h2>
            <div className="service-whychoose-divider"></div>
          </div>
          {introText && (
            <p className="service-whychoose-intro">
              {introText}
            </p>
          )}
        </div>

        <div className="service-whychoose-grid">
          {activeFeatures.map((ft, i) => {
            const Icon = getAftercareIcon(ft.featureText);

            return (
              <div key={i} className="service-whychoose-card">
                <div className="service-whychoose-icon-wrap">
                  <Icon className="service-whychoose-icon" />
                </div>
                <p className="service-whychoose-card-text">
                  {ft.featureText}
                </p>
              </div>
            );
          })}
        </div>

        <p className="service-whychoose-followup-note">
          {dynamicFollowUp}
        </p>
      </div>
    </section>
  );
}
