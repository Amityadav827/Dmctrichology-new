"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function ServiceEditorialFaq({ data }) {
  if (!data || data.isVisible === false) return null;

  const { faqs } = data;
  const activeFaqs = (faqs || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeFaqs.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (idx) => {
    setActiveIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="service-edfaq-section">
      <div className="service-edfaq-container">
        <div className="service-edfaq-header">
          <span className="service-edfaq-label">Expert Answers</span>
          <h2 className="service-edfaq-heading">
            Editorial FAQ
          </h2>
          <div className="service-edfaq-divider"></div>
        </div>

        <div className="service-edfaq-list">
          {activeFaqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <div key={i} className="service-edfaq-item">
                <button
                  onClick={() => toggleFaq(i)}
                  className="service-edfaq-btn"
                >
                  <span className="service-edfaq-title">
                    {faq.question}
                  </span>
                  <div className="service-edfaq-icon-wrap">
                    {isOpen ? (
                      <Minus className="service-edfaq-icon" />
                    ) : (
                      <Plus className="service-edfaq-icon" />
                    )}
                  </div>
                </button>
                
                <div className={`service-edfaq-content ${isOpen ? "open" : ""}`}>
                  <div className="service-edfaq-content-inner">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
