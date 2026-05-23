import React from "react";

const BODY_HAIR_SLUGS = ["body-hair-transplant-bht"];

const defaultBodyHairSuitableSection = {
  heading: "SUITABLE CANDIDATES",
  procedureHeading: "PROCEDURE",
  procedureContent: `Like in any other Hair Restoration procedures, follicular unit extraction (FUE) technique is best suited in Body Hair Transplantation as well. It is one of the best techniques used at our centre to provide the best body hair transplant in Delhi, Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi). Instead of strip harvesting of hair with skin, individual extraction of follicular units from various parts of the body including beard, chest, arms, legs in hirsute candidates are often used as the source of secondary donor supply. This procedure can be successfully done either alone or with donor scalp hairs for greater coverage.

Follicular unit extraction for body hair transplant utilises a unique & sophisticated sharp tip punches to create minimal tissue damaged and the individual graft is harvested one at a time. With this procedure, there is no linear scarring and no post surgical discomfort. Due to quicker healing of wounds and less traumatic for patients, FUE is the best option for Body Hair Transplant.`,
  candidates: [
    "Advanced grades of Androgenetic Alopecia with limited donor scalp hair to give sufficient coverage.",
    "Extensive Scarring Alopecia in which no adequate donor hair is available due to scarring patches.",
    "To correct & repair previous poor results from traditional hair transplant methods.",
    "To enhance the volume & hair density for those with retrograde thinning of scalp donor."
  ],
  benefitsHeading: "BENEFITS",
  benefitsIntro: "Following are a few of the body hair transplant in Delhi performed at our centre:",
  benefits: [
    "Through BHT, people with severe hair loss issues can be a potential candidate for a hair transplant with a pool of donor hairs.",
    "There is no limitation to harvesting hair grafts if future transplantation is needed.",
    "Any definitive hair designed is made practicable with BHT for as many as hair grafts can be extracted."
  ],
  concernsHeading: "CONCERNS",
  concernsContent: `Body Hair Transplantation is comparatively a demanding procedure that requires higher skills & precision to achieve optimal results. Since the characteristics of body hair grafts as compared to scalp hair vary distinctively in texture, density, colour, etc it needs exceptional skills in creating a seeming resemblance to natural appearance throughout the implantation.

DMC-TRICHOLOGY is known to yield highly effective results with our most notable hair transplant surgeons. This makes the centre well renowned for providing the best body hair transplant in Delhi. Our experts are the most esteemed hair specialists committed to providing the best outcome in any surgical procedure being conducted at the centre.`,
  isVisible: true
};

export { defaultBodyHairSuitableSection };

const splitParagraphs = (value) =>
  String(value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

function CheckMark() {
  return (
    <span className="body-hair-suitable-check" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function BodyHairSuitableSection({ data, pageSlug = "" }) {
  const normalizedSlug = String(pageSlug || "").toLowerCase();
  if (!BODY_HAIR_SLUGS.includes(normalizedSlug)) return null;

  const section = { ...defaultBodyHairSuitableSection, ...(data || {}) };
  if (section.isVisible === false) return null;

  const candidates = (section.candidates?.length ? section.candidates : defaultBodyHairSuitableSection.candidates).filter(Boolean);
  const benefits = (section.benefits?.length ? section.benefits : defaultBodyHairSuitableSection.benefits).filter(Boolean);

  return (
    <section className="body-hair-suitable-section">
      <div className="body-hair-suitable-container">
        <div className="body-hair-suitable-header">
          <span className="body-hair-suitable-kicker">BHT Candidate Guide</span>
          <h2>{section.heading || defaultBodyHairSuitableSection.heading}</h2>
        </div>

        <div className="body-hair-suitable-card body-hair-suitable-procedure">
          <h3>{section.procedureHeading || defaultBodyHairSuitableSection.procedureHeading}</h3>
          {splitParagraphs(section.procedureContent || defaultBodyHairSuitableSection.procedureContent).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="body-hair-suitable-grid">
          {candidates.map((item, index) => (
            <div className="body-hair-suitable-point" key={`candidate-${index}`}>
              <CheckMark />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="body-hair-suitable-two-col">
          <div className="body-hair-suitable-card">
            <h3>{section.benefitsHeading || defaultBodyHairSuitableSection.benefitsHeading}</h3>
            <p>{section.benefitsIntro || defaultBodyHairSuitableSection.benefitsIntro}</p>
            <div className="body-hair-suitable-stack">
              {benefits.map((item, index) => (
                <div className="body-hair-suitable-point compact" key={`benefit-${index}`}>
                  <CheckMark />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body-hair-suitable-card">
            <h3>{section.concernsHeading || defaultBodyHairSuitableSection.concernsHeading}</h3>
            {splitParagraphs(section.concernsContent || defaultBodyHairSuitableSection.concernsContent).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
