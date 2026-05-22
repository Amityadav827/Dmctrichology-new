"use client";
import React, { useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const defaultFaqItems = [
  {
    question: "1. Who is the best hair transplant surgeon in Delhi?",
    answer: "The creator of the DMC Golden Touch hair transplant technique, which guarantees quicker outcomes, is Dr. Nandini Dadu. The **best hair transplant surgeon in Delhi** is a co-founder of DMC Trichology."
  },
  {
    question: "2. Who is the No 1 hair transplant surgeon in India?",
    answer: "Dr. Nandini Dadu is widely regarded as one of India's top hair transplant surgeons. With over a decade of specialized experience and thousands of successful procedures, she has earned the trust of patients across India and abroad."
  },
  {
    question: "3. Which type of doctor is best for hair?",
    answer: "A dermatologist or a trichologist who specializes in hair and scalp disorders is the best doctor for hair concerns. Dr. Nandini Dadu is a board-certified trichologist with specialized expertise in both medical and surgical hair restoration."
  },
  {
    question: "4. What is a hair specialist called?",
    answer: "A doctor who specializes in hair and scalp conditions is called a trichologist. For surgical hair restoration, they may also be referred to as a hair transplant surgeon or dermatological surgeon."
  },
  {
    question: "5. How do I choose a hair surgeon?",
    answer: "When choosing a hair surgeon, consider their experience, patient testimonials, before-and-after results, the technology they use, and their approach to personalized treatment. Dr. Nandini Dadu checks all these boxes with her advanced techniques and individualized care."
  },
  {
    question: "6. Is hair surgery good?",
    answer: "Yes, hair transplant surgery, when performed by a qualified and experienced surgeon, is a safe and highly effective solution for permanent hair restoration. Modern techniques like FUE offer minimal scarring and natural-looking results."
  },
  {
    question: "7. What is the difference between a dermatologist and a hair specialist?",
    answer: "A dermatologist treats a broad range of skin and hair conditions, while a trichologist or hair specialist focuses exclusively on hair and scalp health. Dr. Nandini Dadu combines both specializations for comprehensive hair care."
  },
  {
    question: "8. Which treatment is permanent for hair loss?",
    answer: "Hair transplant surgery (FUE/FUT) is the most permanent solution for hair loss. The transplanted follicles are resistant to the hormones that cause hair loss, ensuring long-lasting results with proper post-care."
  },
  {
    question: "9. What is the safest treatment for hair loss?",
    answer: "For non-surgical options, treatments like PRP therapy, mesotherapy, and laser treatments are safe and effective. For surgical solutions, FUE hair transplant is considered the safest with minimal scarring and quick recovery time."
  }
];

// Render **bold** as accent highlights
function renderAnswer(text) {
  if (!text) return '';
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: '#3b5998', fontWeight: '700' }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}

// Chevron SVG icon
function ChevronIcon({ isOpen }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function AboutDrNandaniFAQ({ data = {} }) {
  const {
    heading = "FAQs About Best Hair Transplant Surgeon in Delhi",
    faqItems = defaultFaqItems,
    defaultOpenIndex = 0,
    backgroundColor = "#3b5998",
    accordionBg = "#ffffff",
    accordionActiveBg = "#f5f5f5",
    contentMaxWidth = "1200px",
    paddingTop = "100px",
    paddingBottom = "120px"
  } = data;

  const items = faqItems && faqItems.length > 0 ? faqItems : defaultFaqItems;
  const [openIndex, setOpenIndex] = useState(
    typeof defaultOpenIndex === 'number' ? defaultOpenIndex : 0
  );

  const toggle = (idx) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  return (
    <EditableSection sectionId="about-nandani-faq" label="FAQ Section">
      <section
        className="dmc-faq-wrapper"
        style={{
          backgroundColor: backgroundColor || "#3b5998",
          paddingTop: paddingTop || "100px",
          paddingBottom: paddingBottom || "120px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {/* Centered Wrapper */}
        <div
          style={{
            maxWidth: contentMaxWidth || "1200px",
            margin: "0 auto",
            width: "100%"
          }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              className="dmc-faq-heading"
              style={{
                fontSize: "38px",
                fontWeight: "400",
                color: "#ffffff",
                fontFamily: "'Marcellus', serif",
                letterSpacing: "0.03em",
                lineHeight: "1.25",
                margin: "0 0 20px 0"
              }}
            >
              <EditableText
                sectionId="about-nandani-faq"
                fieldPath="faqSection.heading"
              >
                {heading}
              </EditableText>
            </h2>
            {/* Subtle white accent line */}
            <div
              style={{
                width: "72px",
                height: "2px",
                backgroundColor: "rgba(255,255,255,0.45)",
                margin: "0 auto"
              }}
            />
          </div>

          {/* FAQ Accordion List */}
          <div className="dmc-faq-list">
            {items.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="dmc-faq-item"
                  style={{
                    backgroundColor: isOpen ? (accordionActiveBg || "#f5f5f5") : (accordionBg || "#ffffff"),
                    border: isOpen
                      ? "1px solid rgba(0,0,0,0.15)"
                      : "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "0px",
                    marginBottom: "18px",
                    overflow: "hidden",
                    transition: "background 0.3s ease, border-color 0.3s ease",
                    boxShadow: isOpen
                      ? "0 6px 24px rgba(0,0,0,0.10)"
                      : "0 1px 6px rgba(0,0,0,0.06)"
                  }}
                >
                  {/* Question Row */}
                  <button
                    className="dmc-faq-question"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%",
                      padding: "28px 32px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      outline: "none",
                      textAlign: "left",
                      gap: "24px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "17px",
                        fontWeight: "400",
                        color: "#000000",
                        fontFamily: "'Marcellus', serif",
                        letterSpacing: "0.02em",
                        lineHeight: "1.4",
                        flex: 1
                      }}
                    >
                      <EditableText
                        sectionId="about-nandani-faq"
                        fieldPath={`faqSection.faqItems.${idx}.question`}
                      >
                        {item.question}
                      </EditableText>
                    </span>
                    <ChevronIcon isOpen={isOpen} />
                  </button>

                  {/* Answer Panel — smooth height animation via CSS */}
                  <div
                    className={`dmc-faq-answer ${isOpen ? 'dmc-faq-answer--open' : ''}`}
                    style={{
                      maxHeight: isOpen ? "600px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  >
                    <div
                      style={{
                        padding: "0 32px 32px 32px",
                        borderTop: "1px solid rgba(0,0,0,0.08)"
                      }}
                    >
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: "1.9",
                          color: "rgba(0,0,0,0.78)",
                          fontFamily: "'Marcellus', serif",
                          margin: "22px 0 0 0"
                        }}
                      >
                        <EditableText
                          sectionId="about-nandani-faq"
                          fieldPath={`faqSection.faqItems.${idx}.answer`}
                        >
                          {renderAnswer(item.answer)}
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .dmc-faq-wrapper,
        .dmc-faq-wrapper * {
          font-family: 'Marcellus', serif !important;
        }

        .dmc-faq-question:focus-visible {
          outline: 2px solid #3b5998;
          outline-offset: -2px;
        }

        .dmc-faq-item:hover {
          border-color: rgba(0, 0, 0, 0.15) !important;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .dmc-faq-heading {
            font-size: 30px !important;
          }
          .dmc-faq-question span {
            font-size: 15px !important;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .dmc-faq-wrapper {
            padding-top: 64px !important;
            padding-bottom: 80px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .dmc-faq-heading {
            font-size: 24px !important;
          }
          .dmc-faq-question {
            padding: 20px 20px !important;
          }
          .dmc-faq-question span {
            font-size: 14px !important;
          }
          .dmc-faq-answer > div {
            padding: 0 20px 24px 20px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
}
