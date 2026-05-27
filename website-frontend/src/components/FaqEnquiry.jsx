"use client";

import { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const FaqEnquiry = ({ data = {}, enquirySection, pageSlug = '' }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [sectionData, setSectionData] = useState(data);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First open by default

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectRef = useRef(null);

  useEffect(() => {
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
        setSectionData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  // Click outside to close custom select dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const faqs = sectionData?.faqItems || [];
  
  // Defensive normalization of enquirySection prop
  const isHairCostDelhiPage = ['hair-transplant-cost-in-delhi', 'hair-transplant-cost-in-india'].includes(String(pageSlug || '').toLowerCase());
  const consultationHeading = 'REQUEST A CONSULTATION';
  const consultationDescription = 'Clinic Timings ( By Appointments Only )\nMonday to Saturday : 9:00 AM to 8:00 PM\nSunday : 10:00 AM to 7:00 PM';
  const normalizedEnquiry = enquirySection || {};
  const leftTitle = isHairCostDelhiPage && (!sectionData?.faqTitle || sectionData.faqTitle === 'Common Concerns Addressed')
    ? consultationHeading
    : (sectionData?.faqTitle || 'Few Of The Common Concerns');
  const leftDescription = isHairCostDelhiPage && (!sectionData?.faqSubtitle || sectionData.faqSubtitle === 'Common questions about our treatments.')
    ? consultationDescription
    : (sectionData?.faqSubtitle || 'Common questions about our treatments.');
  const formTitle = isHairCostDelhiPage && (!normalizedEnquiry.title || normalizedEnquiry.title === 'Enquire About This Treatment')
    ? consultationHeading
    : (normalizedEnquiry.title || sectionData?.formTitle || 'Enquiry Here Below!');
  const formDescription = isHairCostDelhiPage && (!normalizedEnquiry.description || normalizedEnquiry.description === 'Schedule your visit for this specialized treatment.')
    ? consultationDescription
    : (normalizedEnquiry.description || '');
  const showEnquiry = normalizedEnquiry.isVisible !== false;
  const serviceOptions = (normalizedEnquiry.serviceOptions && Array.isArray(normalizedEnquiry.serviceOptions) && normalizedEnquiry.serviceOptions.length > 0)
    ? normalizedEnquiry.serviceOptions 
    : (sectionData?.serviceOptions || []);
  const leftDescriptionLines = String(leftDescription)
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);
  const formDescriptionLines = String(formDescription)
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.service) {
      setError('Please select a type of service.');
      return;
    }
    if (!formData.date) {
      setError('Please select a date.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: '0000000000', // Default mobile fallback for details enquiry form
        enquiry_type: formData.service,
        preferred_date: formData.date,
        service_slug: pageSlug || 'unknown',
        source: 'service-details-enquiry',
        message: `Treatment Enquiry for: ${formData.service}\nPreferred Date: ${formData.date}\nService Slug: ${pageSlug || 'unknown'}`
      };

      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : 'https://dmctrichology-1.onrender.com/api');

      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', service: '', date: '' });
      } else {
        setError(result.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error('Error submitting details enquiry form:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableSection sectionId="faq-enquiry-section" label="FAQ & Enquiry">
      <section className="details-faq-enquiry-section" data-section-id="faq-enquiry-section">
        
        {/* Custom Premium Dropdown Styles & Scrollbar */}
        <style dangerouslySetInnerHTML={{ __html: `
          .luxury-select-item:hover {
            background-color: rgba(61, 90, 153, 0.08) !important;
            color: #3B5998 !important;
          }
          .luxury-select-item.selected:hover {
            background-color: #3B5998 !important;
            color: #ffffff !important;
          }
          .luxury-select-menu::-webkit-scrollbar {
            width: 4px;
          }
          .luxury-select-menu::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 4px;
          }
          .luxury-select-menu::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          @keyframes fadeInMenu {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />

        <div className="details-fe-container">
          
          {/* LEFT: FAQ */}
          <div className="details-fe-left" style={!showEnquiry ? { width: '100%', maxWidth: 'none', flex: '0 0 100%' } : undefined}>
            <h2 className="dmc-heading details-fe-title" style={{ marginBottom: '16px' }}>
              <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.faqTitle">
                {leftTitle}
              </EditableText>
            </h2>
            <div className="details-fe-subtitle">
              {leftDescriptionLines.map((line, index) => (
                <p key={index}>
                  <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.faqSubtitle">
                    {line}
                  </EditableText>
                </p>
              ))}
            </div>

            <div className="details-faq-accordion">
              {faqs.map((faq, index) => {
                if (!faq) return null;
                return (
                  <div
                    key={index}
                    className={`details-faq-item dmc-accordion-item${openFaqIndex === index ? ' open' : ''}`}
                  >
                    <button
                      className="details-faq-question"
                      onClick={() => toggleFaq(index)}
                      type="button"
                    >
                      <span>{faq?.question || ''}</span>
                      <div className={`details-faq-icon dmc-accordion-icon${openFaqIndex === index ? ' active' : ''}`}>
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
                        {faq?.answer || ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Enquiry Form */}
          {showEnquiry && (
            <div className="details-fe-right">
              <div 
                className="details-enquiry-card" 
                style={normalizedEnquiry.backgroundColor ? { backgroundColor: normalizedEnquiry.backgroundColor } : undefined}
              >
                <h3 className="details-enquiry-title">
                  <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.formTitle">
                    {formTitle}
                  </EditableText>
                </h3>
                {formDescriptionLines.length > 0 && (
                  <div className="details-enquiry-description">
                    {formDescriptionLines.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
                
                <form className="details-enquiry-form" onSubmit={handleSubmit}>
                  <div className="details-form-group">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={sectionData?.namePlaceholder || "Name*"} 
                      className="details-form-input" 
                      required 
                      disabled={loading}
                    />
                  </div>
                  <div className="details-form-group">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={sectionData?.emailPlaceholder || "E-Mail Address*"} 
                      className="details-form-input" 
                      required 
                      disabled={loading}
                    />
                  </div>

                  {/* Luxury Custom Select Dropdown */}
                  <div className="details-form-group luxury-select-wrapper" ref={selectRef} style={{ position: 'relative', zIndex: 99 }}>
                    <div 
                      onClick={() => !loading && setDropdownOpen(!dropdownOpen)}
                      className="details-form-input details-form-select-trigger" 
                      style={{ 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        userSelect: 'none',
                        color: formData.service ? '#333333' : '#999999',
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        borderRadius: '100px',
                        fontFamily: "'Lato', sans-serif",
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <span>{formData.service || sectionData?.servicePlaceholder || "Type Of Service Enquiry*"}</span>
                      <span style={{ 
                        fontSize: '10px',
                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        color: '#999999',
                        display: 'inline-block'
                      }}>▼</span>
                    </div>

                    {dropdownOpen && (
                      <div 
                        className="luxury-select-menu"
                        style={{
                          position: 'absolute',
                          top: '115%',
                          left: '0',
                          width: '100%',
                          backgroundColor: '#ffffff',
                          borderRadius: '20px',
                          border: '1px solid rgba(0, 0, 0, 0.04)',
                          boxShadow: '0 15px 35px rgba(61, 90, 153, 0.15)',
                          padding: '6px',
                          zIndex: 9999,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          animation: 'fadeInMenu 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }}
                      >
                        {serviceOptions.map((opt, i) => {
                          const isSelected = formData.service === opt;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, service: opt }));
                                setDropdownOpen(false);
                                if (success) setSuccess(false);
                                if (error) setError('');
                              }}
                              className={`luxury-select-item ${isSelected ? 'selected' : ''}`}
                              style={{
                                width: '100%',
                                padding: '11px 18px',
                                border: 'none',
                                borderRadius: '12px',
                                textAlign: 'left',
                                backgroundColor: isSelected ? '#3B5998' : 'transparent',
                                color: isSelected ? '#ffffff' : '#333333',
                                fontSize: '13px',
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: isSelected ? '700' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="details-form-group date-wrapper">
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      placeholder={sectionData?.datePlaceholder || "Select Date & Time*"} 
                      className="details-form-input details-form-date" 
                      required 
                      disabled={loading}
                    />
                  </div>
                  <button type="submit" className="details-submit-btn" disabled={loading}>
                    <span>
                      <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.buttonText">
                        {loading ? 'Submitting...' : (normalizedEnquiry.submitButtonText || sectionData?.buttonText || 'Schedule Your Visit')}
                      </EditableText>
                    </span>
                    <span className="details-btn-icon">↗</span>
                  </button>
                  {error && (
                    <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                      {error}
                    </p>
                  )}
                  {success && (
                    <p style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                      ✓ Enquiry submitted successfully!
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>
      </section>
    </EditableSection>
  );
};

export default FaqEnquiry;
