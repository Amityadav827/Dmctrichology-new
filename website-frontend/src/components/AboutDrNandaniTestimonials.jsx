"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const defaultTestimonials = [
  {
    text: "Dr. Nandani Dadu is an excellent hair specialist in Delhi. I visited her clinic for hair loss treatment, and the results have been outstanding. She is very knowledgeable and patient, taking time to explain everything clearly.",
    patientName: "Sanadhan Chaima",
    disclaimer: "* Opinions/Results may vary from person to person.",
    stars: 5
  },
  {
    text: "Dr. Nandani Dadu is the best hair transplant surgeon in Delhi. I underwent a hair transplant procedure at her clinic, and the results have been amazing. She uses advanced techniques and ensures a comfortable procedure.",
    patientName: "Akhilesh Singh",
    disclaimer: "* Opinions/Results may vary from person to person.",
    stars: 5
  },
  {
    text: "Dr. Nandani Dadu is undoubtedly the best hair specialist in Delhi. She helped me regain confidence with her effective treatment for hair thinning. Her approach is personalized, focusing on understanding the root cause of hair problems.",
    patientName: "Naveen Yadav",
    disclaimer: "* Opinions/Results may vary from person to person.",
    stars: 5
  }
];

function StarRating({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '18px' }}>
      {Array.from({ length: Math.min(Math.max(count, 1), 5) }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function AboutDrNandaniTestimonials({ data = {} }) {
  const {
    heading = "Patient Testimonials",
    testimonials = defaultTestimonials,
    viewMoreText = "VIEW MORE",
    viewMoreUrl = "https://dmctrichology-mkm4.vercel.app/clients-feedback",
    backgroundColor = "#3b5998",
    cardBackgroundColor = "#000000",
    contentMaxWidth = "1400px",
    paddingTop = "100px",
    paddingBottom = "100px",
    gridGap = "35px"
  } = data;

  const cards = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <EditableSection sectionId="about-nandani-testimonials" label="Patient Testimonials Section">
      <section
        className="dmc-testimonials-wrapper"
        style={{
          backgroundColor: backgroundColor || "#3b5998",
          paddingTop: paddingTop || "100px",
          paddingBottom: paddingBottom || "100px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {/* Centered Content Wrapper */}
        <div
          style={{
            maxWidth: contentMaxWidth || "1400px",
            margin: "0 auto",
            width: "100%"
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              className="dmc-testimonials-heading"
              style={{
                fontSize: "42px",
                fontWeight: "400",
                color: "#ffffff",
                fontFamily: "'Marcellus', serif",
                letterSpacing: "0.04em",
                lineHeight: "1.2",
                margin: "0 0 16px 0"
              }}
            >
              <EditableText
                sectionId="about-nandani-testimonials"
                fieldPath="testimonialsSection.heading"
              >
                {heading}
              </EditableText>
            </h2>
            {/* Elegant gold underline accent */}
            <div
              style={{
                width: "80px",
                height: "2px",
                backgroundColor: "#D4AF37",
                margin: "0 auto"
              }}
            />
          </div>

          {/* Testimonials Grid */}
          <div className="dmc-testimonials-grid" style={{ gap: gridGap || "35px" }}>
            {cards.map((item, idx) => (
              <div
                key={idx}
                className="dmc-testimonial-card"
                style={{
                  backgroundColor: cardBackgroundColor || "#000000",
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: "0px",
                  padding: "35px",
                  boxSizing: "border-box",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.75)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 16px 55px rgba(0,0,0,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.35)";
                }}
              >
                {/* Star Rating */}
                <StarRating count={item.stars || 5} />

                {/* Testimonial Text */}
                <div
                  className="dmc-testimonial-scroll"
                  style={{
                    flex: 1,
                    marginBottom: "24px",
                    overflowY: "auto",
                    maxHeight: "160px"
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.75",
                      color: "rgba(255,255,255,0.88)",
                      fontFamily: "'Marcellus', serif",
                      fontStyle: "italic",
                      margin: "0"
                    }}
                  >
                    <EditableText
                      sectionId="about-nandani-testimonials"
                      fieldPath={`testimonialsSection.testimonials.${idx}.text`}
                    >
                      {item.text}
                    </EditableText>
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    backgroundColor: "#D4AF37",
                    marginBottom: "18px",
                    opacity: 0.7
                  }}
                />

                {/* Patient Name */}
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#ffffff",
                    fontFamily: "'Marcellus', serif",
                    margin: "0 0 10px 0",
                    letterSpacing: "0.04em"
                  }}
                >
                  <EditableText
                    sectionId="about-nandani-testimonials"
                    fieldPath={`testimonialsSection.testimonials.${idx}.patientName`}
                  >
                    {item.patientName}
                  </EditableText>
                </p>

                {/* Disclaimer */}
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "'Marcellus', serif",
                    margin: "0",
                    lineHeight: "1.5"
                  }}
                >
                  <EditableText
                    sectionId="about-nandani-testimonials"
                    fieldPath={`testimonialsSection.testimonials.${idx}.disclaimer`}
                  >
                    {item.disclaimer}
                  </EditableText>
                </p>
              </div>
            ))}
          </div>

          {/* VIEW MORE Button */}
          <div style={{ textAlign: "center", marginTop: "56px" }}>
            <a
              href={viewMoreUrl || "https://dmctrichology-mkm4.vercel.app/clients-feedback"}
              target="_blank"
              rel="noopener noreferrer"
              className="dmc-testimonials-btn"
            >
              <EditableText
                sectionId="about-nandani-testimonials"
                fieldPath="testimonialsSection.viewMoreText"
              >
                {viewMoreText}
              </EditableText>
            </a>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .dmc-testimonials-wrapper,
        .dmc-testimonials-wrapper * {
          font-family: 'Marcellus', serif !important;
        }

        .dmc-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
          width: 100%;
        }

        .dmc-testimonial-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .dmc-testimonial-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .dmc-testimonial-scroll::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 2px;
        }

        .dmc-testimonials-btn {
          display: inline-block;
          background: #3b5998;
          border: 1px solid #D4AF37;
          color: #ffffff !important;
          padding: 16px 42px;
          font-family: 'Marcellus', serif !important;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
        }
        .dmc-testimonials-btn:hover {
          background: #D4AF37 !important;
          color: #000000 !important;
          transform: translateY(-2px);
        }

        /* Tablet: 2 columns */
        @media (max-width: 1024px) {
          .dmc-testimonials-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px !important;
          }
          .dmc-testimonials-heading {
            font-size: 34px !important;
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 640px) {
          .dmc-testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
          .dmc-testimonials-wrapper {
            padding-top: 64px !important;
            padding-bottom: 64px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .dmc-testimonial-card {
            padding: 28px 22px !important;
          }
          .dmc-testimonials-heading {
            font-size: 28px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
}
