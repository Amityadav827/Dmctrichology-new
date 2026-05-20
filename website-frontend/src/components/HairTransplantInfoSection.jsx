import React from "react";

const defaultHairTransplantInfo = {
  isVisible: true,
  cards: [
    {
      title: "HOW LONG DOES THE HAIR TRANSPLANT PROCEDURE TAKE?",
      content: "Hair transplant surgery lasts for a few hours. The procedure duration is decided based on the surgical technique chosen and the size of the area to be covered with donor hair. Mostly, the hair transplantation procedure is over in a single day, but two sessions may be required in case of extensive hair loss.",
      isVisible: true,
      sortOrder: 1
    },
    {
      title: "IS HAIR TRANSPLANT SURGERY PAINFUL?",
      content: "The procedure is performed under anaesthetic, and the method does not cause any pain. The scalp will feel a little numb and tender once the anaesthesia wears off. There will be a little redness and swelling for a few days after surgery. One can take mild painkillers (as advised by the doctor) to alleviate any pain and discomfort following surgery.\n\nYou will be surprised to have a comfortable experience during a hair transplant surgery in Delhi, India, at DMC Trichology. As local anaesthesia will be injected into the donor and recipient areas, the only pain or discomfort felt by you during the operation would be the injections. After the hair transplant, there will be slight irritation, redness, or swelling, but such discomfort quickly subsides.",
      isVisible: true,
      sortOrder: 2
    }
  ]
};

export default function HairTransplantInfoSection({ data, pageSlug = "" }) {
  const lowerSlug = (pageSlug || "").toLowerCase();
  const isHairTransplant = lowerSlug.includes("hair-transplant") || lowerSlug.includes("transplant") || lowerSlug.includes("fue");
  
  const resolvedData = data || (isHairTransplant ? defaultHairTransplantInfo : null);

  if (!resolvedData || resolvedData.isVisible === false) return null;

  const { sectionHeading, cards } = resolvedData;
  const activeCards = (cards || [])
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeCards.length === 0) return null;

  return (
    <section className="hair-transplant-section">
      {sectionHeading && (
        <h2 className="hair-transplant-main-heading" style={{ textAlign: "center", marginBottom: "30px", fontFamily: "Marcellus", fontSize: "28px" }}>
          {sectionHeading}
        </h2>
      )}
      {activeCards.map((card, idx) => {
        const paragraphs = String(card.content || card.paragraph || "")
          .split(/\n+/)
          .map(p => p.trim())
          .filter(Boolean);

        return (
          <div key={idx} className="hair-transplant-card">
            <h2 className="hair-transplant-heading">
              {card.title || card.heading}
            </h2>
            {paragraphs.map((para, pIdx) => (
              <p className="hair-transplant-paragraph" key={pIdx}>
                {para}
              </p>
            ))}
          </div>
        );
      })}
    </section>
  );
}
