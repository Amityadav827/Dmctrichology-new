"use client";
import React, { useState, useEffect, useRef } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';
import { submitLead } from '../services/api';

const ScienceConsultation = ({ data: initialData = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const serviceDropdownRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    service: 'Hair Restoration',
    message: ''
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Real-time sync from Visual Builder (postMessage UPDATE_CONFIG)
  useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedData = { ...data };
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('science-consultation.consultationSection.')) {
          hasChanges = true;
          const field = key.replace('science-consultation.consultationSection.', '');
          updatedData[field] = siteConfig[key];
        }
      });

      if (hasChanges) setData(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-consultation') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('consultationSection.')) {
          const key = fieldPath.split('.')[1];
          setData(prev => ({ ...prev, [key]: value }));
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Frontend validations
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const trimmedMobile = formData.phone.replace(/\s+/g, '');
    if (!trimmedMobile || !/^\d{10}$/.test(trimmedMobile)) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!formData.date) {
      setError('Please select a preferred appointment date.');
      return;
    }
    if (!formData.service) {
      setError('Please select a service option.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile,
        service: formData.service,
        appointmentDate: `${formData.date}T10:00:00`, // Standard morning default
        message: formData.message.trim(),
        source: 'science-page'
      };

      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : 'https://dmctrichology-1.onrender.com/api');

      const response = await fetch(`${API_URL}/science-consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', date: '', service: 'Hair Restoration', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('Failed to send request. Please check your connection or call us.');
    } finally {
      setLoading(false);
    }
  };

  const bgStyle = data?.backgroundImage 
    ? { backgroundImage: `linear-gradient(rgba(13, 13, 26, 0.8), rgba(13, 13, 26, 0.95)), url(${data?.backgroundImage})`, backgroundSize: 'cover' } 
    : { backgroundColor: data?.backgroundColor || '#0D0D1A' };

  return (
    <EditableSection sectionId="science-consultation" label="Science Consultation Form">
      <section className="sci-consult-section" style={bgStyle}>
        <div className="sci-consult-container">
          
          <div className="sci-consult-header">
            <h2 className="sci-consult-title">
              <EditableText sectionId="science-consultation" fieldPath="consultationSection.title" tag="span">
                {String(data?.title || 'Begin Your Journey')}
              </EditableText>
            </h2>
            <EditableText sectionId="science-consultation" fieldPath="consultationSection.timingText" tag="p" className="sci-consult-timing">
              {String(data?.timingText || 'Available Mon - Sat: 10:00 AM - 7:00 PM')}
            </EditableText>
          </div>

          {success && <div className="sci-alert sci-alert-success">✓ Consultation request sent successfully! We will contact you soon.</div>}
          {error && <div className="sci-alert sci-alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="sci-consult-form">
            <div className="sci-input-group">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" required />
            </div>
            <div className="sci-input-row">
              <div className="sci-input-group">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number *" required />
              </div>
              <div className="sci-input-group">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" required />
              </div>
            </div>
            <div className="sci-input-row">
              <div className="sci-input-group">
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="sci-input-group">
                <select name="service" value={formData.service} onChange={handleChange}>
                  <option value="Hair Restoration">Hair Restoration</option>
                  <option value="Laser Therapy">Laser Therapy</option>
                  <option value="Stem Cell Therapy">Stem Cell Therapy</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
                <div className="sci-responsive-service-dropdown" ref={serviceDropdownRef}>
                  <button
                    type="button"
                    className="sci-responsive-service-trigger"
                    onClick={() => !loading && setShowServiceDropdown((open) => !open)}
                    disabled={loading}
                    aria-expanded={showServiceDropdown}
                  >
                    <span>{formData.service}</span>
                  </button>
                  {showServiceDropdown && (
                    <div className="sci-responsive-service-menu">
                      {['Hair Restoration', 'Laser Therapy', 'Stem Cell Therapy', 'General Consultation'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className="sci-responsive-service-option"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, service: option }));
                            setShowServiceDropdown(false);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="sci-input-group">
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your hair concerns..." rows="3"></textarea>
            </div>
            
            <button type="submit" disabled={loading} className="sci-submit-btn">
              {loading ? 'Submitting...' : (
                <EditableText sectionId="science-consultation" fieldPath="consultationSection.ctaText" tag="span">
                  {String(data?.ctaText || 'Request Consultation')}
                </EditableText>
              )}
            </button>
          </form>

        </div>
      </section>

      <style>{`
        .sci-consult-section {
          padding: 100px 5%;
          position: relative;
          color: white;
        }

        .sci-consult-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 60px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }

        .sci-consult-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .sci-consult-title {
          font-family: 'Marcellus', serif !important;
          font-size: 36px !important;
          margin: 0 0 10px !important;
          color: white !important;
        }

        .sci-consult-timing {
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          color: #8bb4f6;
          letter-spacing: 1px;
        }

        .sci-consult-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sci-input-row {
          display: flex;
          gap: 20px;
        }

        .sci-input-group {
          flex: 1;
        }

        .sci-consult-form input,
        .sci-consult-form select,
        .sci-consult-form textarea {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          color: white;
          transition: all 0.3s ease;
          outline: none;
        }

        .sci-consult-form input::placeholder,
        .sci-consult-form textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .sci-consult-form input:focus,
        .sci-consult-form select:focus,
        .sci-consult-form textarea:focus {
          border-color: #3b5998;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 4px rgba(59, 89, 152, 0.2);
        }

        .sci-consult-form select option {
          background: #0d0d1a;
          color: white;
        }

        .sci-responsive-service-dropdown {
          display: none;
        }

        .sci-submit-btn {
          margin-top: 10px;
          padding: 18px;
          background: linear-gradient(135deg, #3b5998 0%, #2a3f6c 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .sci-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 89, 152, 0.4);
        }

        .sci-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .sci-alert {
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 700;
        }

        .sci-alert-success {
          background: rgba(46, 125, 50, 0.2);
          color: #81c784;
          border: 1px solid rgba(46, 125, 50, 0.5);
        }

        .sci-alert-error {
          background: rgba(198, 40, 40, 0.2);
          color: #e57373;
          border: 1px solid rgba(198, 40, 40, 0.5);
        }

        @media (max-width: 768px) {
          .sci-consult-container { padding: 40px 20px; }
          .sci-input-row { flex-direction: column; gap: 20px; }
          .sci-consult-title { font-size: 28px !important; }
          .sci-input-group {
            position: relative;
            min-width: 0;
          }
          .sci-consult-form select[name="service"] {
            display: none;
          }
          .sci-responsive-service-dropdown {
            display: block;
            position: relative;
            width: 100%;
            max-width: 100%;
            z-index: 40;
          }
          .sci-responsive-service-trigger {
            width: 100%;
            max-width: 100%;
            min-height: 51px;
            padding: 16px 42px 16px 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 15px;
            line-height: 1.25;
            text-align: left;
            cursor: pointer;
            overflow-wrap: anywhere;
          }
          .sci-responsive-service-trigger::after {
            content: '';
            position: absolute;
            right: 18px;
            top: 50%;
            width: 8px;
            height: 8px;
            border-right: 2px solid rgba(255,255,255,0.85);
            border-bottom: 2px solid rgba(255,255,255,0.85);
            transform: translateY(-65%) rotate(45deg);
            pointer-events: none;
          }
          .sci-responsive-service-menu {
            position: absolute;
            top: calc(100% + 6px);
            left: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            max-height: 240px;
            overflow-y: auto;
            overflow-x: hidden;
            background: #0d0d1a;
            border: 1px solid rgba(139, 180, 246, 0.55);
            border-radius: 12px;
            box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
            z-index: 90;
          }
          .sci-responsive-service-option {
            width: 100%;
            min-height: 44px;
            padding: 11px 20px;
            border: 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            background: #0d0d1a;
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 15px;
            line-height: 1.35;
            text-align: left;
            cursor: pointer;
            white-space: normal;
            overflow-wrap: anywhere;
          }
          .sci-responsive-service-option:first-child {
            background: #256bd7;
          }
          .sci-responsive-service-option:last-child {
            border-bottom: 0;
          }
        }
        @media (min-width: 769px) and (max-width: 1199px) {
          .sci-input-group {
            position: relative;
            min-width: 0;
          }
          .sci-consult-form select[name="service"] {
            display: none;
          }
          .sci-responsive-service-dropdown {
            display: block;
            position: relative;
            width: 100%;
            max-width: 100%;
            z-index: 40;
          }
          .sci-responsive-service-trigger {
            width: 100%;
            max-width: 100%;
            min-height: 51px;
            padding: 16px 42px 16px 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 15px;
            line-height: 1.25;
            text-align: left;
            cursor: pointer;
            overflow-wrap: anywhere;
          }
          .sci-responsive-service-trigger::after {
            content: '';
            position: absolute;
            right: 18px;
            top: 50%;
            width: 8px;
            height: 8px;
            border-right: 2px solid rgba(255,255,255,0.85);
            border-bottom: 2px solid rgba(255,255,255,0.85);
            transform: translateY(-65%) rotate(45deg);
            pointer-events: none;
          }
          .sci-responsive-service-menu {
            position: absolute;
            top: calc(100% + 6px);
            left: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            max-height: 240px;
            overflow-y: auto;
            overflow-x: hidden;
            background: #0d0d1a;
            border: 1px solid rgba(139, 180, 246, 0.55);
            border-radius: 12px;
            box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
            z-index: 90;
          }
          .sci-responsive-service-option {
            width: 100%;
            min-height: 44px;
            padding: 11px 20px;
            border: 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            background: #0d0d1a;
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 15px;
            line-height: 1.35;
            text-align: left;
            cursor: pointer;
            white-space: normal;
            overflow-wrap: anywhere;
          }
          .sci-responsive-service-option:first-child {
            background: #256bd7;
          }
          .sci-responsive-service-option:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceConsultation;
