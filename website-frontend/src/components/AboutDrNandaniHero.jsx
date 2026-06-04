"use client";
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

const defaultStats = [
  { label: "10+ Years Experience" },
  { label: "Thousands of Successful Cases" },
  { label: "Board Certified Specialist" }
];

export default function AboutDrNandaniHero({ data = {}, breadcrumbData = {}, formSettings = {} }) {
  const {
    backgroundImage = "",
    doctorImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    pageEyebrow = "About DMC Trichology",
    mainHeading = "BEST HAIR TRANSPLANT SURGEON IN DELHI",
    doctorName = "Dr. Nandani Dadu",
    degreeText = "MD (Dermatology)",
    descriptionParagraph = "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi.",
    statsCards = defaultStats,
    namePlaceholder = "Name*",
    phonePlaceholder = "Mobile Number*",
    emailPlaceholder = "E-Mail Address*",
    datePlaceholder = "Select Preferred Date*",
    messagePlaceholder = "Enter Your Message Here",
    captchaPlaceholder = "Code*",
    submitButtonText = "Schedule Your Visit"
  } = data;

  const {
    parentLabel = "Home",
    parentUrl = "/",
    currentPageText = "About Dr. Nandani Dadu"
  } = breadcrumbData;

  const formTitle = formSettings?.title || "Request Private Consultation";
  const formSubtitle = formSettings?.subtitle || "Reserve your bespoke scalp assessment and consultation session.";
  const successMessage = formSettings?.successMessage || "Your consultation request has been successfully submitted. Our concierge team will reach out to you shortly.";
  const resolvedStats = Array.isArray(statsCards) && statsCards.length > 0 ? statsCards : defaultStats;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    appointmentDate: '',
    message: '',
    captchaInput: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const generateCaptcha = () => setCaptcha(createCaptcha());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccess(false);

    if (!formData.name.trim()) return setError('Please enter your name.');
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return setError('Please enter a valid email address.');
    }

    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!trimmedMobile || !/^\d{10}$/.test(trimmedMobile)) {
      return setError('Please enter a valid 10-digit mobile number.');
    }
    if (!formData.appointmentDate) return setError('Please select a preferred date.');
    if (!formData.captchaInput.trim() || formData.captchaInput.trim() !== captcha) {
      return setError('Invalid verification code.');
    }

    setLoading(true);
    try {
      await api.post('/about-dr-nandani/lead', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile,
        appointmentDate: formData.appointmentDate,
        message: formData.message.trim(),
        service: "Dr. Nandani Consultation Form"
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        appointmentDate: '',
        message: '',
        captchaInput: ''
      });
      generateCaptcha();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const heroStyle = backgroundImage
    ? { '--nandani-hero-bg': `url(${backgroundImage})` }
    : {};

  return (
    <>
      <EditableSection sectionId="about-nandani-hero" label="Dr Nandani Page Hero">
        <section className="dr-nandani-page-hero" style={heroStyle}>
          <div className="dr-nandani-hero-shape shape-one" />
          <div className="dr-nandani-hero-shape shape-two" />
          <div className="dr-nandani-page-hero-inner">
            <div className="dr-nandani-hero-left-label">
              <span className="dr-nandani-line-dot" />
              <EditableText sectionId="about-nandani-hero" fieldPath="pageEyebrow" tag="span">
                {pageEyebrow}
              </EditableText>
            </div>

            <div className="dr-nandani-hero-title-block">
              <h1>
                <EditableText sectionId="about-nandani-hero" fieldPath="doctorName" tag="span">
                  {doctorName}
                </EditableText>
              </h1>
              <p>
                <EditableText sectionId="about-nandani-hero" fieldPath="descriptionParagraph" tag="span">
                  {descriptionParagraph}
                </EditableText>
              </p>
              <div className="dr-nandani-hero-breadcrumb">
                <a href={parentUrl}>
                  <EditableText sectionId="about-nandani-breadcrumb" fieldPath="parentLabel" tag="span">
                    {parentLabel}
                  </EditableText>
                </a>
                <span>/</span>
                <span>
                  <EditableText sectionId="about-nandani-breadcrumb" fieldPath="currentPageText" tag="span">
                    {currentPageText}
                  </EditableText>
                </span>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      <EditableSection sectionId="about-nandani-hero" label="Dr Nandani Intro And Lead Form">
        <section className="dr-nandani-intro-form-section">
          <div className="dr-nandani-intro-grid">
            <div className="dr-nandani-image-column">
              <div className="dr-nandani-doctor-image-card">
                <img src={doctorImage} alt={`${doctorName} portrait`} />
              </div>
              <div className="dr-nandani-stats-grid">
                {resolvedStats.map((stat, index) => (
                  <div className="dr-nandani-stat-card" key={`${stat.label}-${index}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>
                      <EditableText sectionId="about-nandani-hero" fieldPath={`statsCards.${index}.label`} tag="span">
                        {stat.label}
                      </EditableText>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="dr-nandani-info-form-column">
              <div className="dr-nandani-doctor-copy">
                <span className="dr-nandani-eyebrow">
                  <EditableText sectionId="about-nandani-hero" fieldPath="mainHeading" tag="span">
                    {mainHeading}
                  </EditableText>
                </span>
                <h2>
                  <EditableText sectionId="about-nandani-hero" fieldPath="doctorName" tag="span">
                    {doctorName}
                  </EditableText>
                </h2>
                <p className="dr-nandani-degree">
                  <EditableText sectionId="about-nandani-hero" fieldPath="degreeText" tag="span">
                    {degreeText}
                  </EditableText>
                </p>
                <p className="dr-nandani-description">
                  <EditableText sectionId="about-nandani-hero" fieldPath="descriptionParagraph" tag="span">
                    {descriptionParagraph}
                  </EditableText>
                </p>
              </div>

              <form className="dr-nandani-lead-card" onSubmit={handleSubmit}>
                <div className="dr-nandani-form-heading">
                  <h3>{formTitle}</h3>
                  <p>{formSubtitle}</p>
                </div>

                {success && <div className="dr-nandani-alert success">{successMessage}</div>}
                {error && <div className="dr-nandani-alert error">{error}</div>}

                <div className="dr-nandani-form-grid">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={namePlaceholder} disabled={loading} required />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={emailPlaceholder} disabled={loading} required />
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder={phonePlaceholder} disabled={loading} required />
                  <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} aria-label={datePlaceholder} disabled={loading} required />
                  <div className="dr-nandani-captcha-row">
                    <button type="button" onClick={generateCaptcha} title="Click to regenerate captcha">{captcha}</button>
                    <input type="text" name="captchaInput" value={formData.captchaInput} onChange={handleChange} placeholder={captchaPlaceholder} disabled={loading} required />
                  </div>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder={messagePlaceholder} disabled={loading} />
                </div>

                <button className="dr-nandani-submit-btn" type="submit" disabled={loading}>
                  <EditableText sectionId="about-nandani-hero" fieldPath="submitButtonText" tag="span">
                    {loading ? "Scheduling..." : submitButtonText}
                  </EditableText>
                  <span aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#3B5998" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </EditableSection>

      <style jsx>{`
        .dr-nandani-page-hero {
          position: relative;
          overflow: hidden;
          padding: 156px 5% 92px;
          background:
            linear-gradient(135deg, rgba(237, 238, 248, 0.92), rgba(255, 255, 255, 0.96)),
            var(--nandani-hero-bg, none);
          background-size: cover;
          background-position: center;
        }
        .dr-nandani-page-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(59, 89, 152, 0.14), transparent 28%),
            radial-gradient(circle at 86% 20%, rgba(59, 89, 152, 0.10), transparent 28%);
          pointer-events: none;
        }
        .dr-nandani-hero-shape {
          position: absolute;
          border-radius: 999px;
          background: rgba(59, 89, 152, 0.08);
          filter: blur(2px);
        }
        .shape-one {
          width: 280px;
          height: 280px;
          left: -80px;
          bottom: -120px;
        }
        .shape-two {
          width: 360px;
          height: 360px;
          right: -130px;
          top: -120px;
        }
        .dr-nandani-page-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(220px, 0.34fr) minmax(0, 0.66fr);
          gap: 42px;
          align-items: center;
        }
        .dr-nandani-hero-left-label,
        .dr-nandani-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: #3B5998;
        }
        .dr-nandani-line-dot {
          width: 52px;
          height: 1px;
          background: #3B5998;
          position: relative;
          display: inline-block;
        }
        .dr-nandani-line-dot::after {
          content: "";
          position: absolute;
          right: -4px;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3B5998;
        }
        .dr-nandani-hero-title-block {
          text-align: center;
        }
        .dr-nandani-hero-title-block h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(42px, 5.2vw, 76px);
          line-height: 1;
          font-weight: 400;
          color: #111111;
          margin: 0 0 20px;
        }
        .dr-nandani-hero-title-block p {
          max-width: 760px;
          margin: 0 auto 22px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #4b5563;
        }
        .dr-nandani-hero-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border: 1px solid rgba(59, 89, 152, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.74);
          box-shadow: 0 12px 32px rgba(59, 89, 152, 0.08);
          font-family: 'Lato', sans-serif;
          font-size: 12px;
        }
        .dr-nandani-hero-breadcrumb a {
          color: #3B5998;
          text-decoration: none;
          font-weight: 800;
        }
        .dr-nandani-hero-breadcrumb span {
          color: #111111;
        }
        .dr-nandani-intro-form-section {
          background: #ffffff;
          padding: 90px 5%;
        }
        .dr-nandani-intro-grid {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(390px, 0.8fr);
          gap: 56px;
          align-items: start;
        }
        .dr-nandani-image-column {
          position: relative;
        }
        .dr-nandani-doctor-image-card {
          background: #eef2fb;
          border-radius: 34px;
          overflow: hidden;
          border: 1px solid rgba(59, 89, 152, 0.12);
          box-shadow: 0 28px 70px rgba(15, 35, 79, 0.13);
          aspect-ratio: 1.05 / 0.9;
        }
        .dr-nandani-doctor-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dr-nandani-stats-grid {
          width: calc(100% - 56px);
          margin: -38px auto 0;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .dr-nandani-stat-card {
          min-height: 102px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(59, 89, 152, 0.12);
          box-shadow: 0 20px 44px rgba(15, 35, 79, 0.11);
          backdrop-filter: blur(14px);
        }
        .dr-nandani-stat-card span {
          display: block;
          color: #3B5998;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.2px;
          margin-bottom: 8px;
        }
        .dr-nandani-stat-card p {
          margin: 0;
          font-family: 'Marcellus', serif;
          font-size: 18px;
          line-height: 1.22;
          color: #111111;
        }
        .dr-nandani-info-form-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .dr-nandani-doctor-copy h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 52px);
          line-height: 1.05;
          font-weight: 400;
          color: #111111;
          margin: 18px 0 10px;
        }
        .dr-nandani-degree {
          display: inline-flex;
          margin: 0 0 18px;
          padding: 7px 14px;
          border-radius: 999px;
          background: #eef2fb;
          color: #111111;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .dr-nandani-description {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #333333;
          margin: 0;
        }
        .dr-nandani-lead-card {
          padding: 30px;
          border-radius: 30px;
          background: linear-gradient(145deg, rgba(237, 238, 248, 0.92), rgba(255, 255, 255, 0.92));
          border: 1px solid rgba(59, 89, 152, 0.13);
          box-shadow: 0 26px 70px rgba(15, 35, 79, 0.13);
        }
        .dr-nandani-form-heading h3 {
          font-family: 'Marcellus', serif;
          font-size: 26px;
          font-weight: 400;
          color: #111111;
          margin: 0 0 8px;
        }
        .dr-nandani-form-heading p {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #586174;
          margin: 0 0 20px;
        }
        .dr-nandani-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .dr-nandani-form-grid input,
        .dr-nandani-form-grid textarea {
          width: 100%;
          min-height: 50px;
          border: 1px solid rgba(59, 89, 152, 0.14);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.86);
          padding: 13px 16px;
          outline: none;
          color: #111111;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          transition: all .25s ease;
        }
        .dr-nandani-form-grid input:focus,
        .dr-nandani-form-grid textarea:focus {
          border-color: #3B5998;
          box-shadow: 0 0 0 4px rgba(59, 89, 152, 0.08);
          background: #ffffff;
        }
        .dr-nandani-form-grid textarea {
          grid-column: 1 / -1;
          min-height: 92px;
          resize: none;
        }
        .dr-nandani-captcha-row {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .dr-nandani-captcha-row button {
          min-height: 50px;
          border: 0;
          border-radius: 16px;
          background: #3B5998;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 5px;
          cursor: pointer;
        }
        .dr-nandani-submit-btn {
          width: 100%;
          min-height: 56px;
          margin-top: 18px;
          border: 0;
          border-radius: 999px;
          background: #3B5998;
          color: #ffffff;
          font-family: 'Marcellus', serif;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          cursor: pointer;
          transition: all .25s ease;
        }
        .dr-nandani-submit-btn span:last-child {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-45deg);
          transition: transform .25s ease;
        }
        .dr-nandani-submit-btn:hover {
          background: #314b82;
          box-shadow: 0 18px 32px rgba(59, 89, 152, 0.24);
        }
        .dr-nandani-submit-btn:hover span:last-child {
          transform: rotate(0deg);
        }
        .dr-nandani-submit-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
        .dr-nandani-alert {
          border-radius: 16px;
          padding: 12px 14px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.45;
          margin-bottom: 14px;
        }
        .dr-nandani-alert.success {
          background: #ecfdf5;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .dr-nandani-alert.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        @media (max-width: 1024px) {
          .dr-nandani-page-hero {
            padding: 136px 5% 72px;
          }
          .dr-nandani-page-hero-inner,
          .dr-nandani-intro-grid {
            grid-template-columns: 1fr;
          }
          .dr-nandani-hero-left-label,
          .dr-nandani-hero-title-block,
          .dr-nandani-doctor-copy {
            text-align: center;
            justify-content: center;
          }
          .dr-nandani-intro-grid {
            gap: 38px;
          }
        }
        @media (max-width: 767px) {
          .dr-nandani-page-hero {
            padding: 124px 16px 56px;
          }
          .dr-nandani-hero-title-block h1 {
            font-size: clamp(38px, 12vw, 52px);
          }
          .dr-nandani-hero-title-block p {
            font-size: 14px;
          }
          .dr-nandani-intro-form-section {
            padding: 54px 16px;
          }
          .dr-nandani-doctor-image-card {
            border-radius: 26px;
            aspect-ratio: 1 / 1.08;
          }
          .dr-nandani-stats-grid {
            width: 100%;
            margin-top: 16px;
            grid-template-columns: 1fr;
          }
          .dr-nandani-stat-card {
            min-height: auto;
          }
          .dr-nandani-info-form-column {
            gap: 24px;
          }
          .dr-nandani-lead-card {
            padding: 22px;
            border-radius: 24px;
          }
          .dr-nandani-form-grid,
          .dr-nandani-captcha-row {
            grid-template-columns: 1fr;
          }
          .dr-nandani-captcha-row {
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}
