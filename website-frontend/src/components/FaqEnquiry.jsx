"use client";
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const FaqEnquiry = ({ data = {}, enquirySection }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [sectionData, setSectionData] = useState(data);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First open by default

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const faqs = sectionData?.faqItems || [];
  
  // Defensive normalization of enquirySection prop
  const normalizedEnquiry = enquirySection || {};
  const showEnquiry = normalizedEnquiry.isVisible !== false;
  const serviceOptions = (normalizedEnquiry.serviceOptions && Array.isArray(normalizedEnquiry.serviceOptions) && normalizedEnquiry.serviceOptions.length > 0)
    ? normalizedEnquiry.serviceOptions 
    : (sectionData?.serviceOptions || []);

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
        service: formData.service,
        appointmentDate: `${formData.date}T10:00:00`,
        message: 'Details Page Treatment Enquiry',
        source: 'consultation-form'
      };

      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : 'https://dmctrichology-1.onrender.com/api');

      const response = await fetch(`${API_URL}/appointment`, {
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
        <div className="details-fe-container">
          
          {/* LEFT: FAQ */}
          <div className="details-fe-left" style={!showEnquiry ? { width: '100%', maxWidth: 'none', flex: '0 0 100%' } : undefined}>
            <h2 className="details-fe-title">
              <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.faqTitle">
                {sectionData?.faqTitle || 'Few Of The Common Concerns'}
              </EditableText>
            </h2>
            <p className="details-fe-subtitle">
              <EditableText sectionId="faq-enquiry-section" fieldPath="faqEnquiry.faqSubtitle">
                {sectionData?.faqSubtitle || 'Common questions about our treatments.'}
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
                    <span>{faq?.question || ''}</span>
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
                      {faq?.answer || ''}
                    </div>
                  </div>
                </div>
              ))}
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
                    {normalizedEnquiry.title || sectionData?.formTitle || 'Enquiry Here Below!'}
                  </EditableText>
                </h3>
                {normalizedEnquiry.description && (
                  <p className="text-slate-400 text-xs mt-1 mb-4 text-center">
                    {normalizedEnquiry.description}
                  </p>
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
                    />
                  </div>
                  <div className="details-form-group select-wrapper">
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="details-form-input details-form-select" 
                      required
                    >
                      <option value="" disabled>{sectionData?.servicePlaceholder || "Type Of Service Enquiry*"}</option>
                      {serviceOptions.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
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
