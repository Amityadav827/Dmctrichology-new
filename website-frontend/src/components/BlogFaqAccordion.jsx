"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function BlogFaqAccordion({ faqs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section-wrapper">
      <div className="faq-inner-container">
        {/* Luxury Header - Left Aligned */}
        <div className="faq-heading-group">
          <h2 className="faq-title-main">Frequently Asked Questions ({faqs.length})</h2>
        </div>

        {/* Premium FAQ List */}
        <div className="faq-items-list">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index}
                className={`faq-card-item ${isActive ? 'faq-active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="faq-card-trigger">
                  <span className="faq-question-label">
                    <span className="faq-q-number">Q{index + 1}.</span> {faq.question}
                  </span>
                  <div className="faq-chevron-wrapper">
                    <ChevronDown size={20} className={isActive ? 'rotate-180' : ''} />
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="faq-answer-overflow"
                    >
                      <div className="faq-answer-content">
                        <div className="faq-answer-divider"></div>
                        <p className="faq-answer-text">
                          <span className="faq-ans-label">Ans:-</span> {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .faq-section-wrapper {
          padding: 40px 0;
          background-color: transparent;
          border-top: 1px solid #0000000a;
          margin-top: 40px;
        }
        
        .faq-inner-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0;
        }

        .faq-heading-group {
          text-align: left;
          margin-bottom: 30px;
        }

        .faq-title-main {
          font-family: 'Marcellus', serif;
          font-size: clamp(28px, 4vw, 36px);
          color: #1a1a1a;
          line-height: 1.2;
          margin-bottom: 0;
        }

        /* FAQ Card Styling */
        .faq-items-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .faq-card-item {
          background: #ffffff;
          border: 1px solid #0000000d;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 12px #00000005;
        }

        .faq-card-item:hover {
          transform: translateY(-5px);
          border-color: #0000001a;
          box-shadow: 0 20px 40px #00000008;
        }

        .faq-active {
          border-color: #bfa37c40;
          box-shadow: 0 30px 60px #0000000a;
        }

        .faq-card-trigger {
          padding: 16px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .faq-question-label {
          font-family: 'Marcellus', serif;
          font-size: 20px;
          color: #1a1a1a;
          font-weight: 600;
          transition: color 0.3s;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .faq-q-number {
          color: #1a1a1a;
          font-weight: 700;
          flex-shrink: 0;
          transition: color 0.3s;
        }

        .faq-active .faq-q-number {
          color: #bfa37c;
        }

        .faq-ans-label {
          color: #1a1a1a;
          font-weight: 700;
          margin-right: 5px;
        }

        .faq-active .faq-question-label {
          color: #bfa37c;
        }

        .faq-chevron-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f8f8f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1a1a;
          transition: all 0.4s;
        }

        .faq-active .faq-chevron-wrapper {
          background-color: #1a1a1a;
          color: #ffffff;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .faq-answer-overflow {
          overflow: hidden;
        }

        .faq-answer-content {
          padding: 0 40px 40px;
        }

        .faq-answer-divider {
          width: 100%;
          height: 1px;
          background-color: #0000000a;
          margin-bottom: 25px;
        }

        .faq-answer-text {
          font-family: 'Marcellus', serif;
          font-size: 18px;
          color: #555;
          line-height: 1.8;
          max-width: 850px;
        }

        @media (max-width: 768px) {
          .faq-section-wrapper {
            padding: 60px 0;
          }
          .faq-card-trigger {
            padding: 24px;
          }
          .faq-answer-content {
            padding: 0 24px 24px;
          }
          .faq-question-label {
            font-size: 18px;
          }
          .faq-answer-text {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
