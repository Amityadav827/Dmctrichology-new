"use client";
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function AboutDrNiveditaHero({ data = {} }) {
  const {
    backgroundImage = "",
    doctorImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    mainHeading = "EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI",
    doctorName = "Dr. Nivedita Dadu",
    degreeText = "MBBS, MD (Dermatology)",
    descriptionParagraph = "Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.",
    namePlaceholder = "Name*",
    phonePlaceholder = "Mobile Number*",
    emailPlaceholder = "E-Mail Address*",
    datePlaceholder = "Select Preferred Date*",
    messagePlaceholder = "Enter Your Message Here",
    captchaPlaceholder = "Code*",
    submitButtonText = "Schedule Your Visit",
    backgroundColor = "#3b5998",
    overlayOpacity = 0.45
  } = data;

  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', appointmentDate: '', message: '', captchaInput: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setCaptcha(createCaptcha()); }, []);

  const generateCaptcha = () => setCaptcha(createCaptcha());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(''); setSuccess(false);

    if (!formData.name.trim()) { setError('Please enter your name.'); return; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) { setError('Please enter a valid email address.'); return; }
    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!trimmedMobile || !/^\d{10}$/.test(trimmedMobile)) { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (!formData.appointmentDate) { setError('Please select a preferred date.'); return; }
    if (!formData.captchaInput.trim() || formData.captchaInput.trim() !== captcha) { setError('Invalid verification code.'); return; }

    setLoading(true);
    try {
      await api.post('/about-dr-nivedita/lead', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile,
        appointmentDate: formData.appointmentDate,
        message: formData.message.trim(),
        service: "Dr. Nivedita Consultation Form"
      });
      setSuccess(true);
      setFormData({ name: '', email: '', mobile: '', appointmentDate: '', message: '', captchaInput: '' });
      generateCaptcha();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const bgStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

  return (
    <EditableSection sectionId="about-nivedita-hero" label="Dr Nivedita Hero Section">
      <style dangerouslySetInnerHTML={{ __html: `
        .dr-nivedita-hero-wrapper {
          position: relative;
          padding: 140px 5% 90px 5%;
          background-color: ${backgroundColor};
          background-size: cover;
          background-position: center;
          color: #ffffff;
          overflow: hidden;
          width: 100%;
        }

        .dr-nivedita-hero-overlay-curtain {
          position: absolute;
          inset: 0;
          background-color: #000000;
          opacity: ${overlayOpacity};
          z-index: 1;
          pointer-events: none;
        }

        .dr-nivedita-hero-inner-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 48px;
          align-items: center;
          max-width: 1350px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1024px) {
          .dr-nivedita-hero-wrapper {
            padding: 150px 5% 60px 5% !important;
          }
          .dr-nivedita-hero-inner-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .dr-nivedita-portrait-bordered-holder {
            max-width: 380px !important;
          }
        }

        .dr-nivedita-portrait-frame-box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .dr-nivedita-portrait-bordered-holder {
          border: 6px solid #ffffff;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
          background-color: #ffffff;
          width: 100%;
          max-width: 460px;
          aspect-ratio: 4/4.5;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dr-nivedita-portrait-bordered-holder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .dr-nivedita-editorial-content-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .dr-nivedita-editorial-content-box {
            align-items: center;
            text-align: center;
          }
        }

        .dr-nivedita-editorial-eyebrow {
          font-family: 'Marcellus', serif !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          letter-spacing: 2px !important;
          text-transform: uppercase !important;
          color: #ffffff !important;
          margin-bottom: 12px;
        }

        .dr-nivedita-editorial-name {
          font-family: 'Marcellus', serif !important;
          font-size: 40px !important;
          font-weight: 400 !important;
          color: #ffffff !important;
          margin-bottom: 12px;
          line-height: 1.2 !important;
          text-transform: uppercase;
        }

        .dr-nivedita-editorial-degree {
          display: inline-block;
          padding: 6px 14px;
          background-color: #ffffff;
          color: #000000;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Lato', sans-serif !important;
          margin-bottom: 24px;
        }

        .dr-nivedita-editorial-desc {
          font-family: 'Marcellus', serif !important;
          font-size: 14.5px !important;
          line-height: 1.6 !important;
          color: #f3f4f6 !important;
          margin-bottom: 32px;
          text-align: justify;
        }

        @media (max-width: 1024px) {
          .dr-nivedita-editorial-desc {
            text-align: center;
          }
        }

        .dr-nivedita-paper-form-wrapper {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
          color: #333333;
          width: 100%;
          text-align: left;
        }

        .dr-nivedita-paper-form-wrapper h3 {
          font-family: 'Marcellus', serif !important;
          font-size: 20px !important;
          color: #3B5998 !important;
          margin-bottom: 20px !important;
          text-transform: uppercase;
          text-align: center;
          font-weight: 500;
        }

        .dr-nivedita-form-grid-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 640px) {
          .dr-nivedita-form-grid-two-col {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        .dr-nivedita-input-classic-field {
          width: 100%;
          padding: 12px 20px;
          border: 1px solid #B8B8B8;
          border-radius: 30px;
          font-size: 13.5px;
          font-family: 'Marcellus', serif !important;
          outline: none;
          background-color: #ffffff;
          transition: all 0.25s ease;
          height: 46px;
          color: #333333;
        }

        .dr-nivedita-input-classic-field:focus {
          border-color: #3B5998;
          box-shadow: 0 0 0 2px rgba(59, 89, 152, 0.15);
        }

        .dr-nivedita-textarea-classic-field {
          width: 100%;
          padding: 14px 20px;
          border: 1px solid #B8B8B8;
          border-radius: 20px;
          font-size: 13.5px;
          font-family: 'Marcellus', serif !important;
          outline: none;
          background-color: #ffffff;
          transition: all 0.25s ease;
          min-height: 80px;
          resize: none;
          color: #333333;
          grid-column: span 2;
        }

        @media (max-width: 640px) {
          .dr-nivedita-textarea-classic-field {
            grid-column: span 1;
          }
        }

        .dr-nivedita-textarea-classic-field:focus {
          border-color: #3B5998;
          box-shadow: 0 0 0 2px rgba(59, 89, 152, 0.15);
        }

        .dr-nivedita-captcha-grid-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 12px;
          align-items: center;
          margin-bottom: 16px;
        }

        .dr-nivedita-captcha-display-badge {
          background-color: #3B5998;
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 4px;
          border-radius: 30px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          font-family: 'Marcellus', serif !important;
          cursor: pointer;
        }

        .dr-nivedita-form-alert-curtain {
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 12.5px;
          font-family: 'Lato', sans-serif !important;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.4;
        }

        .dr-nivedita-alert-success {
          background-color: #e6fffa;
          border: 1px solid #b2f5ea;
          color: #234e52;
        }

        .dr-nivedita-alert-error {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          color: #9b2c2c;
        }

        .dr-nivedita-form-submit-btn {
          width: 100%;
          padding: 12px;
          border-radius: 30px;
          background-color: #3B5998;
          color: #ffffff;
          border: none;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Marcellus', serif !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.25s ease;
          height: 48px;
        }

        .dr-nivedita-form-submit-btn:hover {
          background-color: #2f477a;
          box-shadow: 0 6px 20px rgba(59, 89, 152, 0.28);
        }

        .dr-nivedita-form-submit-btn:disabled {
          background-color: #cbd5e0;
          color: #718096;
          cursor: not-allowed;
        }

        .dr-nivedita-submit-circle-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-45deg);
          transition: transform 0.3s ease;
        }

        .dr-nivedita-form-submit-btn:hover .dr-nivedita-submit-circle-arrow {
          transform: rotate(0deg) translateX(2px);
        }
      `}} />

      <section className="dr-nivedita-hero-wrapper" style={bgStyle}>
        <div className="dr-nivedita-hero-overlay-curtain" />

        <div className="dr-nivedita-hero-inner-grid">
          {/* LEFT COLUMN: Portrait */}
          <div className="dr-nivedita-portrait-frame-box">
            <div className="dr-nivedita-portrait-bordered-holder">
              <img src={doctorImage} alt="Dr. Nivedita Dadu Portrait" />
            </div>
          </div>

          {/* RIGHT COLUMN: Content & Form */}
          <div className="dr-nivedita-editorial-content-box">
            <span className="dr-nivedita-editorial-eyebrow">
              <EditableText sectionId="about-nivedita-hero" fieldPath="mainHeading" tag="span">
                {mainHeading}
              </EditableText>
            </span>

            <h1 className="dr-nivedita-editorial-name">
              <EditableText sectionId="about-nivedita-hero" fieldPath="doctorName" tag="span">
                {doctorName}
              </EditableText>
            </h1>

            <span className="dr-nivedita-editorial-degree">
              <EditableText sectionId="about-nivedita-hero" fieldPath="degreeText" tag="span">
                {degreeText}
              </EditableText>
            </span>

            <p className="dr-nivedita-editorial-desc">
              <EditableText sectionId="about-nivedita-hero" fieldPath="descriptionParagraph" tag="span">
                {descriptionParagraph}
              </EditableText>
            </p>

            {/* Consultation Form */}
            <div className="dr-nivedita-paper-form-wrapper">
              <h3>Request Consultation</h3>

              {success && (
                <div className="dr-nivedita-form-alert-curtain dr-nivedita-alert-success">
                  <strong>✓ Successfully Submitted! Our team will contact you shortly.</strong>
                </div>
              )}
              {error && (
                <div className="dr-nivedita-form-alert-curtain dr-nivedita-alert-error">
                  <strong>⚠️ {error}</strong>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="dr-nivedita-form-grid-two-col">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={namePlaceholder} className="dr-nivedita-input-classic-field" disabled={loading} required />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={emailPlaceholder} className="dr-nivedita-input-classic-field" disabled={loading} required />
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder={phonePlaceholder} className="dr-nivedita-input-classic-field" disabled={loading} required />
                  <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} placeholder={datePlaceholder} className="dr-nivedita-input-classic-field" disabled={loading} required />

                  <div className="dr-nivedita-captcha-grid-row">
                    <div className="dr-nivedita-captcha-display-badge" onClick={generateCaptcha} title="Click to regenerate captcha">
                      {captcha}
                    </div>
                    <input type="text" name="captchaInput" value={formData.captchaInput} onChange={handleChange} placeholder={captchaPlaceholder} className="dr-nivedita-input-classic-field" disabled={loading} required />
                  </div>

                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder={messagePlaceholder} className="dr-nivedita-textarea-classic-field" disabled={loading} />
                </div>

                <button type="submit" disabled={loading} className="dr-nivedita-form-submit-btn">
                  <EditableText sectionId="about-nivedita-hero" fieldPath="submitButtonText" tag="span">
                    {loading ? "Scheduling..." : submitButtonText}
                  </EditableText>
                  <div className="dr-nivedita-submit-circle-arrow">
                    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
                      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#3B5998" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
