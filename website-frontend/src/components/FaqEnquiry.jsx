"use client";
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const FaqEnquiry = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [sectionData, setSectionData] = useState(data);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First open by default

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setSectionData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...sectionData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('faq-enquiry-section.faqEnquiry.')) {
          const field = key.replace('faq-enquiry-section.faqEnquiry.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSectionData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  const faqs = sectionData.faqItems || [];
  const serviceOptions = sectionData.serviceOptions || [];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <EditableSection sectionId="faq-enquiry-section" label="FAQ & Enquiry">
      <section className="details-faq-enquiry-section" data-section-id="faq-enquiry-section">
        <div className="details-fe-container">
          
          {/* LEFT: FAQ */}
          <div className="details-fe-left">
            <h2 className="details-fe-title">
              <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.faqTitle">
                {sectionData.faqTitle || 'Few Of The Common Concerns'}
              </EditableText>
            </h2>
            <p className="details-fe-subtitle">
              <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.faqSubtitle">
                {sectionData.faqSubtitle || 'Common questions about our treatments.'}
              </EditableText>
            </p>

            <div className="details-faq-accordion">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`details-faq-item ${openFaqIndex === index ? 'open' : ''}`}
                >
                  <button 
                    className="details-faq-question" 
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <div className="details-faq-icon">
                      {openFaqIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>
                  <div 
                    className="details-faq-answer"
                    style={{ 
                      maxHeight: openFaqIndex === index ? '500px' : '0',
                      opacity: openFaqIndex === index ? 1 : 0 
                    }}
                  >
                    <div className="details-faq-answer-inner">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Enquiry Form */}
          <div className="details-fe-right">
            <div className="details-enquiry-card">
              <h3 className="details-enquiry-title">
                <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.formTitle">
                  {sectionData.formTitle || 'Enquiry Here Below!'}
                </EditableText>
              </h3>
              
              <form className="details-enquiry-form" onSubmit={e => e.preventDefault()}>
                <div className="details-form-group">
                  <input type="text" placeholder={sectionData.namePlaceholder || "Name*"} className="details-form-input" required />
                </div>
                <div className="details-form-group">
                  <input type="email" placeholder={sectionData.emailPlaceholder || "E-Mail Address*"} className="details-form-input" required />
                </div>
                <div className="details-form-group select-wrapper">
                  <select className="details-form-input details-form-select" required defaultValue="">
                    <option value="" disabled>{sectionData.servicePlaceholder || "Type Of Service Enquiry*"}</option>
                    {serviceOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="details-form-group date-wrapper">
                  <input type="date" placeholder={sectionData.datePlaceholder || "Select Date & Time*"} className="details-form-input details-form-date" required />
                </div>
                <button type="submit" className="details-submit-btn">
                  <span>
                    <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.buttonText">
                      {sectionData.buttonText || 'Schedule Your Visit'}
                    </EditableText>
                  </span>
                  <span className="details-btn-icon">↗</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default FaqEnquiry;
