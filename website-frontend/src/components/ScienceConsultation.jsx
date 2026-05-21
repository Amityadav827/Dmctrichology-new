"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';
import { submitLead } from '../services/api';

const ScienceConsultation = ({ data: initialData = {} }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    try {
      await submitLead(formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', date: '', service: 'Hair Restoration', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send request. Please try again or call us.');
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
            <h2 className="sci-consult-title">{data?.title || 'Begin Your Journey'}</h2>
            <p className="sci-consult-timing">{data?.timingText || 'Available Mon - Sat: 10:00 AM - 7:00 PM'}</p>
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
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
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
              </div>
            </div>
            <div className="sci-input-group">
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your hair concerns..." rows="3"></textarea>
            </div>
            
            <button type="submit" disabled={loading} className="sci-submit-btn">
              {loading ? 'Submitting...' : 'Request Consultation'}
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
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceConsultation;
