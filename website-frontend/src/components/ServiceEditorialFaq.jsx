"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const hairCostFaqDescription = `Choosing the right hair transplant clinic matters when seeking a successful hair transplant surgery. If you are searching for the best clinic for hair transplant, look no further than DMC Trichology. Many patients go for hair transplant surgery at DMC Trichology, as it stands out among other clinics, because of the following reasons:

DMC Trichology is a pioneer in hair transplant services, conveniently located in Delhi at Rajouri Garden (West Delhi) & Vasant Vihar (South Delhi).

DMC trichology has a legacy of excellence in its hair transplant services.`;

export default function ServiceEditorialFaq({ data, pageSlug = "", googleReviewCta }) {
  const [activeIndex, useStateActiveIndex] = useState(0);
  const isHairCostDelhiPage = ['hair-transplant-cost-in-delhi', 'hair-transplant-cost-in-india'].includes(String(pageSlug || '').toLowerCase());

  const faqs = data?.faqs || [];
  const activeFaqs = (faqs || [])
    .filter(pt => pt && pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const showFaqs = data?.isVisible !== false && activeFaqs.length > 0;
  
  // Defensive normalization of googleReviewCta prop
  const normalizedReview = googleReviewCta || {};
  const showReview = normalizedReview && normalizedReview.isVisible !== false;

  if (!showFaqs && !showReview) return null;

  const toggleFaq = (idx) => {
    useStateActiveIndex(prev => (prev === idx ? null : idx));
  };

  const description = data?.sectionDescription || (isHairCostDelhiPage ? hairCostFaqDescription : "");
  const descriptionParagraphs = String(description || "")
    .split(/\n+/)
    .map(item => item.trim())
    .filter(Boolean);

  return (
    <section className="service-edfaq-section">
      <div className="service-edfaq-container">
        {showFaqs && (
          <>
            <div className="service-edfaq-header">
              <span className="service-edfaq-label">{data?.sectionSubtitle || "EXPERT ANSWERS"}</span>
              <h2 className="service-edfaq-heading">
                {data?.sectionTitle || "EDITORIAL FAQ"}
              </h2>
              <div className="service-edfaq-divider"></div>
              {descriptionParagraphs.length > 0 && (
                <div className="service-edfaq-description">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="service-edfaq-list">
              {activeFaqs.map((faq, i) => {
                if (!faq) return null;
                const isOpen = activeIndex === i;
                return (
                  <div key={i} className="service-edfaq-item">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="service-edfaq-btn"
                    >
                      <span className="service-edfaq-title">
                        {faq.question || ""}
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
                        {faq.answer || ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showReview && (
          <div className="service-edfaq-google-review" style={normalizedReview.backgroundColor ? { backgroundColor: normalizedReview.backgroundColor } : undefined}>
            <h3 className="service-edfaq-google-review-heading">
              {normalizedReview.title || "Google Review"}
            </h3>
            <button 
              onClick={() => {
                if (normalizedReview.buttonLink) {
                  window.location.href = normalizedReview.buttonLink;
                }
              }} 
              className="service-edfaq-google-review-btn" 
              type="button"
            >
              <span>{normalizedReview.buttonText || "VIEW MORE"}</span>
              <span className="service-edfaq-google-review-arrow" aria-hidden="true">
                <img
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
                  alt=""
                  className="service-edfaq-google-review-arrow-icon"
                />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
