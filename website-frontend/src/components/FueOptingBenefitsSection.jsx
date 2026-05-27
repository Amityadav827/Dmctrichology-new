import React from 'react';

const FUE_SLUGS = ['fue-hair-transplant'];

const defaultFueOptingBenefitsSection = {
  heading: 'BENEFITS OF OPTING FOR A FUE HAIR TRANSPLANT',
  introText: 'It is critical to remember that each individual is unique, and so are their needs and intended objectives from cosmetic surgery like FUE hair transplant in Delhi, India. If you are considering FUE hair transplant as a solution to your hair loss or thinning, you should schedule a thorough consultation with one of the skilled hair transplant surgeons at DMC Trichology. During the consultation, you can know what FUE hair transplant has set for you and whether you are a good candidate for it.',
  leadText: 'The benefits of electing a FUE hair transplant include:',
  benefits: [
    { title: 'Minimally invasive', description: 'FUE hair transplantation involves the removal of donor hair follicles using a micro-punch tool and their placement into the micro-holes created at the recipient site. The surgery is the least invasive and associated with minimal scarring, discomfort, side effects, risks, complications, and downtime.', sortOrder: 1, isVisible: true },
    { title: 'Hair styling flexibility', description: 'Following the hair transplantation surgery recovery period, patients may be able to style their hair short or long, as per their choice without worrying about having noticeable, ugly scars.', sortOrder: 2, isVisible: true },
    { title: 'Natural-looking results', description: "The purpose of the FUE procedure is natural hair restoration in the areas of hair thinning or hair loss. The hair follicles are transplanted at an angle matching the natural growth pattern of the patient's existing hair. This means no one expects the patient and the surgeon to be able to tell that a hair transplant has been performed.", sortOrder: 3, isVisible: true },
    { title: 'Minimal discomfort', description: 'Individual experiences of undergoing a FUE hair transplant may vary. Many patients report little to no discomfort during the FUE hair transplantation because of the effect of local anaesthesia. Some report experiencing soreness or sensitivity following the surgery.', sortOrder: 4, isVisible: true },
    { title: 'No stitches or staples', description: 'FUE hair transplant does not involve the making of incisions and the use of sutures or staples. Rather, it involves the use of micro-punch devices to extract hair follicles.', sortOrder: 5, isVisible: true },
    { title: 'Minimal scarring', description: 'Unlike FUT hair transplants, where linear scarring occurs at the donor site, harvesting grafts by the FUE technique leaves behind micro-punch holes.', sortOrder: 6, isVisible: true },
    { title: 'Recovery', description: 'Recovery time is typically faster with the FUE treatment in Delhi than other hair transplanting procedures because it is the least invasive. It is generally expected to take around 72 hours, though individual recovery times may vary.', sortOrder: 7, isVisible: true }
  ],
  isVisible: true
};

export { defaultFueOptingBenefitsSection };

export default function FueOptingBenefitsSection({ data, pageSlug = '' }) {
  const isFuePage = FUE_SLUGS.includes(String(pageSlug || '').toLowerCase());
  if (!isFuePage) return null;

  const section = { ...defaultFueOptingBenefitsSection, ...(data || {}) };
  if (section.isVisible === false) return null;

  const benefits = (section.benefits?.length ? section.benefits : defaultFueOptingBenefitsSection.benefits)
    .filter(item => item.isVisible !== false && (item.title || item.description))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <section className="fue-opting-benefits-section">
      <div className="fue-opting-benefits-container">
        <div className="fue-opting-benefits-header">
          <span className="dmc-kicker">FUE Advantages</span>
          <h2 className="dmc-heading" style={{ marginBottom: "20px" }}>{section.heading || defaultFueOptingBenefitsSection.heading}</h2>
          {section.introText && <p>{section.introText}</p>}
          {section.leadText && <strong>{section.leadText}</strong>}
        </div>

        <div className="fue-opting-benefits-list">
          {benefits.map((benefit, index) => (
            <article className="fue-opting-benefit-item" key={benefit._id || index}>
              <span className="fue-opting-benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
