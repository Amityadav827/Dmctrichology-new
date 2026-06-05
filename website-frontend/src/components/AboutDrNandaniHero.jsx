"use client";
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function AboutDrNandaniHero({
  data = {},
  breadcrumbData = {},
  formSettings = {},
  leadEndpoint = '/about-dr-nandani/lead',
  leadService = 'Dr. Nandani Consultation Form',
  sectionIds = {}
}) {
  const heroSectionId = sectionIds.hero || 'about-nandani-hero';
  const breadcrumbSectionId = sectionIds.breadcrumb || 'about-nandani-breadcrumb';
  const {
    mainHeading = "BEST HAIR TRANSPLANT SURGEON IN DELHI",
    doctorName = "Dr. Nandani Dadu",
    degreeText = "MD (Dermatology)",
    descriptionParagraph = "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi.",
    namePlaceholder = "Name*",
    phonePlaceholder = "Mobile Number*",
    emailPlaceholder = "E-Mail Address*",
    datePlaceholder = "Select Preferred Date*",
    messagePlaceholder = "Enter Your Message Here",
    captchaPlaceholder = "Code*",
    submitButtonText = "Schedule Your Visit"
  } = data;

  const {
    title = "About Dr. Nandani Dadu",
    parentLabel = "Home",
    parentUrl = "/",
    currentPageText = "About Dr. Nandani Dadu"
  } = breadcrumbData;
  const resolvedTitle = title && title !== "Hair Specialist in Delhi" ? title : "About Dr. Nandani Dadu";
  const resolvedCurrentPageText = currentPageText && currentPageText !== "Hair Specialist in Delhi" ? currentPageText : resolvedTitle;

  const formTitle = formSettings?.title || "Request Private Consultation";
  const formSubtitle = formSettings?.subtitle || "Reserve your bespoke scalp assessment and consultation session.";
  const successMessage = formSettings?.successMessage || "Your consultation request has been successfully submitted. Our concierge team will reach out to you shortly.";
  const galleryImage = data.galleryImage || data.doctorImage || "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";

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
      await api.post(leadEndpoint, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile,
        appointmentDate: formData.appointmentDate,
        message: formData.message.trim(),
        service: leadService
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

  return (
    <>
      <EditableSection sectionId={heroSectionId} label="Doctor Page Hero">
        <section className="dr-nandani-page-hero">
          <div className="dr-nandani-page-hero-inner">
            <div className="dr-nandani-hero-title-block">
              <h1>
                <EditableText sectionId={breadcrumbSectionId} fieldPath="title" tag="span">
                  {resolvedTitle}
                </EditableText>
              </h1>
              <div className="dr-nandani-hero-breadcrumb">
                <a href={parentUrl}>
                  <EditableText sectionId={breadcrumbSectionId} fieldPath="parentLabel" tag="span">
                    {parentLabel}
                  </EditableText>
                </a>
                <span>/</span>
                <span>
                  <EditableText sectionId={breadcrumbSectionId} fieldPath="currentPageText" tag="span">
                    {resolvedCurrentPageText}
                  </EditableText>
                </span>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      <EditableSection sectionId={heroSectionId} label="Doctor Intro And Lead Form">
        <section className="dr-nandani-intro-form-section">
          <div className="dr-nandani-intro-grid">
            <div className="dr-nandani-image-column">
              <div className="dr-nandani-gallery-grid">
                <div className="dr-nandani-gallery-main">
                  <img src={galleryImage} alt={`${doctorName} clinic introduction`} />
                </div>
                <div className="dr-nandani-gallery-side">
                  <div className="dr-nandani-gallery-small">
                    <img src={galleryImage} alt={`${doctorName} treatment space`} />
                  </div>
                  <div className="dr-nandani-gallery-small">
                    <img src={galleryImage} alt={`${doctorName} consultation space`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="dr-nandani-info-form-column">
              <div className="dr-nandani-doctor-copy">
                <span className="dr-nandani-eyebrow">
                  <EditableText sectionId={heroSectionId} fieldPath="mainHeading" tag="span">
                    {mainHeading}
                  </EditableText>
                </span>
                <h2>
                  <EditableText sectionId={heroSectionId} fieldPath="doctorName" tag="span">
                    {doctorName}
                  </EditableText>
                </h2>
                <p className="dr-nandani-degree">
                  <EditableText sectionId={heroSectionId} fieldPath="degreeText" tag="span">
                    {degreeText}
                  </EditableText>
                </p>
                <p className="dr-nandani-description">
                  <EditableText sectionId={heroSectionId} fieldPath="descriptionParagraph" tag="span">
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
                  <EditableText sectionId={heroSectionId} fieldPath="submitButtonText" tag="span">
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
          margin-top: 112px;
          padding: 80px 5% 60px;
          background: #EEF0FA;
        }
        .dr-nandani-page-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
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
        .dr-nandani-hero-title-block {
          text-align: center;
        }
        .dr-nandani-hero-title-block h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 4vw, 48px);
          line-height: 1.2;
          font-weight: 400;
          color: #111111;
          margin: 0 0 22px;
        }
        .dr-nandani-hero-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
        }
        .dr-nandani-hero-breadcrumb a {
          color: #111111;
          text-decoration: none;
          font-weight: 500;
        }
        .dr-nandani-hero-breadcrumb span {
          color: #111111;
        }
        .dr-nandani-intro-form-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 22% 44%, rgba(59, 89, 152, 0.08), transparent 34%),
            radial-gradient(circle at 78% 56%, rgba(59, 89, 152, 0.055), transparent 34%),
            #ffffff;
          padding: 100px 5%;
        }
        .dr-nandani-intro-grid {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(420px, 0.88fr);
          gap: 40px;
          align-items: center;
        }
        .dr-nandani-image-column {
          position: relative;
        }
        .dr-nandani-gallery-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
          gap: 20px;
          width: 100%;
        }
        .dr-nandani-gallery-main,
        .dr-nandani-gallery-small {
          background: #d8d8d8;
          border-radius: 24px;
          overflow: hidden;
          border: 0;
        }
        .dr-nandani-gallery-main {
          min-height: 440px;
        }
        .dr-nandani-gallery-side {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
        }
        .dr-nandani-gallery-main img,
        .dr-nandani-gallery-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dr-nandani-info-form-column {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .dr-nandani-eyebrow::before {
          content: "";
          width: 58px;
          height: 1px;
          background: #3B5998;
          display: inline-block;
          position: relative;
        }
        .dr-nandani-eyebrow::after {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #3B5998;
          position: absolute;
          left: 52px;
          top: 50%;
          transform: translateY(-50%);
        }
        .dr-nandani-eyebrow {
          position: relative;
        }
        .dr-nandani-doctor-copy h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.2vw, 46px);
          line-height: 1.05;
          font-weight: 400;
          color: #111111;
          margin: 20px 0 6px;
        }
        .dr-nandani-degree {
          display: block;
          margin: 0 0 28px;
          padding: 0;
          border-radius: 0;
          background: transparent;
          color: #111111;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
        }
        .dr-nandani-description {
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          line-height: 1.85;
          color: #333333;
          margin: 0;
          font-weight: 700;
          max-width: 640px;
        }
        .dr-nandani-lead-card {
          padding: 24px 0 0;
          border-radius: 0;
          background: transparent;
          border: 0;
          border-top: 1px solid rgba(17, 17, 17, 0.16);
          box-shadow: none;
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
          min-height: 42px;
          border: 1px solid #111111;
          border-radius: 4px;
          background: #ffffff;
          padding: 10px 16px;
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
          min-height: 72px;
          resize: none;
        }
        .dr-nandani-captcha-row {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid #111111;
          border-radius: 4px;
          overflow: hidden;
        }
        .dr-nandani-captcha-row button {
          min-height: 42px;
          border: 0;
          border-radius: 0;
          background: #ffffff;
          color: #111111;
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 5px;
          cursor: pointer;
        }
        .dr-nandani-submit-btn {
          width: 100%;
          min-height: 42px;
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
            margin-top: 104px;
            padding: 70px 5% 52px;
          }
          .dr-nandani-intro-grid {
            grid-template-columns: 1fr;
          }
          .dr-nandani-hero-title-block,
          .dr-nandani-doctor-copy {
            text-align: center;
            justify-content: center;
          }
          .dr-nandani-intro-grid {
            gap: 44px;
          }
          .dr-nandani-gallery-main {
            min-height: 420px;
          }
          .dr-nandani-info-form-column {
            max-width: 760px;
            margin: 0 auto;
          }
        }
        @media (max-width: 767px) {
          .dr-nandani-page-hero {
            margin-top: 0;
            padding: 56px 16px 42px;
          }
          .dr-nandani-page-hero-inner {
            margin-top: 100px;
          }
          .dr-nandani-hero-title-block h1 {
            font-size: clamp(30px, 9vw, 40px);
          }
          .dr-nandani-intro-form-section {
            padding: 64px 16px;
          }
          .dr-nandani-gallery-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .dr-nandani-gallery-side {
            display: none;
          }
          .dr-nandani-gallery-main,
          .dr-nandani-gallery-small {
            min-height: auto;
            border-radius: 24px;
          }
          .dr-nandani-gallery-main img,
          .dr-nandani-gallery-small img {
            height: auto;
            object-fit: contain;
          }
          .dr-nandani-info-form-column {
            gap: 24px;
          }
          .dr-nandani-form-grid {
            grid-template-columns: 1fr;
          }
          .dr-nandani-captcha-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
}
