"use client";

import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();
const PREFERRED_LOCATION_OPTIONS = [
  'A2/6, Block A, Vasant Vihar, New Delhi, Delhi 110057, India',
  'J-12/25, 1st Floor, Block J, Rajouri Garden Extension, Rajouri Garden, New Delhi, Delhi, 110027, India'
];

const toDisplayServiceName = (slug = '') => {
  const text = String(slug || '').trim();
  if (!text) return 'Service Details Consultation';

  return text
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const FaqEnquiry = ({ data = {}, enquirySection, pageSlug = '', faqFallback = null }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [sectionData, setSectionData] = useState(data);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredLocation: ''
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

  const ownFaqs = (sectionData?.faqItems || []).filter(f => f && (f.question || f.answer));
  const faqs = ownFaqs.length > 0
    ? ownFaqs
    : (Array.isArray(faqFallback) ? faqFallback : []);

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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

    const digitsOnlyPhone = formData.phone.replace(/\D+/g, '');
    if (!digitsOnlyPhone) {
      setError('Please enter your phone number.');
      return;
    }
    if (digitsOnlyPhone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (!formData.preferredLocation) {
      setError('Please select your preferred location.');
      return;
    }

    setLoading(true);
    try {
      const serviceName = toDisplayServiceName(pageSlug);
      const locationLabel = formData.preferredLocation.includes('Vasant Vihar')
        ? 'Vasant Vihar'
        : formData.preferredLocation.includes('Rajouri Garden')
          ? 'Rajouri Garden'
          : 'Preferred Location';
      const payload = {
        name: formData.name.trim(),
        email: '',
        mobile: digitsOnlyPhone,
        preferredLocation: formData.preferredLocation,
        service: `${serviceName} - ${locationLabel}`,
        enquiry_type: `${serviceName} - ${locationLabel}`,
        service_slug: pageSlug || 'unknown',
        source: 'service-details-enquiry',
        message: `Service Details Consultation enquiry submitted from ${serviceName}\nPreferred Location: ${formData.preferredLocation}\nService Slug: ${pageSlug || 'unknown'}`
      };

      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? 'http://localhost:10000/api' : 'https://dmctrichology-1.onrender.com/api');

      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', preferredLocation: '' });
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
                      placeholder="Name*"
                      className="details-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="details-form-group">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number*"
                      className="details-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="details-form-group">
                    <div className="select-wrapper">
                      <select
                        name="preferredLocation"
                        value={formData.preferredLocation}
                        onChange={handleInputChange}
                        className="details-form-input details-form-select"
                        required
                        disabled={loading}
                      >
                        <option value="">Preferred Location *</option>
                        {PREFERRED_LOCATION_OPTIONS.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="details-submit-btn" disabled={loading}>
                    <span>{loading ? 'Submitting...' : 'Submit'}</span>
                    <span className="icon-circle btn-arrow-circle" aria-hidden="true">
                      <span className="details-btn-arrow">↗</span>
                    </span>
                  </button>
                  {error && (
                    <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                      {error}
                    </p>
                  )}
                  {success && (
                    <p style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                      Enquiry submitted successfully!
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
