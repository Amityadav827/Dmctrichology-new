"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitLead } from '../services/api';

const hasText = (value) => String(value || '').trim().length > 0;

const richHtml = (value) => {
  const text = String(value || '').trim();
  if (!text) return '';
  return /<\/?[a-z][\s\S]*>/i.test(text)
    ? text
    : `<p>${text.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br />')}</p>`;
};

function AboutDmcHero({ data = {} }) {
  const heroData = {
    ...data,
    badgeText: data.badgeText || 'ABOUT DMC TRICHOLOGY®',
    mainHeading: data.mainHeading || 'ABOUT DMC TRICHOLOGY®',
    subtitle: data.subtitle || "INDIA'S PREMIUM HAIR & SCALP SPECIALIST SOLUTION",
    submitButtonText: data.submitButtonText || 'Submit'
  };
  const createCaptcha = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  const [formData, setFormData] = useState({ name: '', mobile: '', captchaInput: '' });
  // Start empty so server and client first render match; generate on mount (client only).
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Generate captcha only on the client after mount (avoids SSR/client hydration mismatch).
  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const hasContent = [
    heroData.backgroundImage,
    heroData.leftImage,
    heroData.badgeText,
    heroData.mainHeading,
    heroData.subtitle,
    heroData.description,
    heroData.formTitle,
    heroData.submitButtonText,
    heroData.heroImage
  ].some(hasText);

  if (!hasContent) return null;

  const leftImage = heroData.leftImage || heroData.heroImage;
  const backgroundStyle = heroData.backgroundImage ? { backgroundImage: `url(${heroData.backgroundImage})` } : {};

  const handleChange = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(trimmedMobile)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (formData.captchaInput.trim().toUpperCase() !== captcha) {
      setError('Please enter the correct captcha.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await submitLead({ name: formData.name.trim(), mobile: trimmedMobile });
      setSuccess('Thank you. Our team will contact you shortly.');
      setFormData({ name: '', mobile: '', captchaInput: '' });
      setCaptcha(createCaptcha());
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="about-dmc-hero" style={backgroundStyle}>
        <div className="about-dmc-hero-overlay" />
        <div className="about-dmc-hero-grid">
          {hasText(leftImage) && (
            <div className="about-dmc-hero-image">
              <img src={leftImage} alt={heroData.mainHeading || 'About DMC Trichology'} />
            </div>
          )}

          <div className="about-dmc-hero-content">
            {hasText(heroData.badgeText) && <span className="about-dmc-hero-badge">{heroData.badgeText}</span>}
            {hasText(heroData.mainHeading) && <h1>{heroData.mainHeading}</h1>}
            {hasText(heroData.subtitle) && <h2>{heroData.subtitle}</h2>}
            {hasText(heroData.description) && <p>{heroData.description}</p>}

            <form className="about-dmc-hero-form" onSubmit={handleSubmit}>
              {hasText(heroData.formTitle) && <h3>{heroData.formTitle}</h3>}
              <div className="about-dmc-form-grid">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  disabled={loading}
                  required
                />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Phone No"
                  disabled={loading}
                  required
                />
                <div className="about-dmc-captcha-wrap" onClick={() => setCaptcha(createCaptcha())} title="Click to refresh captcha">
                  {captcha}
                </div>
                <input
                  type="text"
                  name="captchaInput"
                  value={formData.captchaInput}
                  onChange={handleChange}
                  placeholder="Captcha"
                  disabled={loading}
                  required
                />
              </div>
              {(error || success) && (
                <div className={`about-dmc-form-message ${error ? 'is-error' : 'is-success'}`}>
                  {error || success}
                </div>
              )}
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : heroData.submitButtonText}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="about-dmc-breadcrumb">
        <div className="about-dmc-breadcrumb-inner">
          <Link href="/">Home</Link>
          <span>→</span>
          <span>About DMC Trichology®</span>
        </div>
      </div>
    </>
  );
}

function AboutDmcIntro({ data = {} }) {
  const highlights = Array.isArray(data.highlights) ? data.highlights.filter(hasText) : [];
  const hasContent = [
    data.sectionBadge,
    data.sectionHeading,
    data.sectionDescription,
    data.image,
    ...highlights
  ].some(hasText);

  if (!hasContent) return null;

  return (
    <section className="about-dmc-intro">
      <div className="about-dmc-intro-grid">
        {hasText(data.image) && (
          <div className="about-dmc-intro-image">
            <img src={data.image} alt={data.sectionHeading || 'DMC Trichology'} />
          </div>
        )}

        <div className="about-dmc-intro-copy">
          {hasText(data.sectionBadge) && <span className="about-dmc-eyebrow">{data.sectionBadge}</span>}
          {hasText(data.sectionHeading) && <h2>{data.sectionHeading}</h2>}
          {hasText(data.sectionDescription) && (
            <div
              className="about-dmc-richtext"
              dangerouslySetInnerHTML={{ __html: richHtml(data.sectionDescription) }}
            />
          )}

          {highlights.length > 0 && (
            <ul className="about-dmc-highlights">
              {highlights.map((point, index) => (
                <li key={`${point}-${index}`}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function HairTreatmentCentreSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const hasContent = [data.sectionBadge, data.heading, data.description].some(hasText);
  if (!hasContent) return null;

  return (
    <section className={`about-dmc-treatment about-dmc-treatment-${data.backgroundStyle || 'white'}`}>
      <div className="about-dmc-treatment-inner">
        {hasText(data.sectionBadge) && <span className="about-dmc-eyebrow">{data.sectionBadge}</span>}
        {hasText(data.heading) && <h2>{data.heading}</h2>}
        {hasText(data.description) && (
          <div className="about-dmc-treatment-card">
            <div
              className="about-dmc-richtext"
              dangerouslySetInnerHTML={{ __html: richHtml(data.description) }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function HolisticApproachSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const hasContent = [data.heading, data.description, data.image].some(hasText);
  if (!hasContent) return null;

  return (
    <section className="about-dmc-holistic">
      <div className="about-dmc-holistic-card">
        <div className="about-dmc-holistic-copy">
          {hasText(data.heading) && <h2>{data.heading}</h2>}
          {hasText(data.description) && (
            <div
              className="about-dmc-richtext"
              dangerouslySetInnerHTML={{ __html: richHtml(data.description) }}
            />
          )}
        </div>
        {hasText(data.image) && (
          <div className="about-dmc-holistic-image">
            <img src={data.image} alt={data.imageAlt || data.heading || 'DMC Trichology'} />
          </div>
        )}
      </div>
    </section>
  );
}

function PatientFirstApproachSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const hasContent = [data.heading, data.description].some(hasText);
  if (!hasContent) return null;

  return (
    <section className="about-dmc-patient-first">
      <div className="about-dmc-patient-shell">
        <div className="about-dmc-patient-card">
          {hasText(data.heading) && <h2>{data.heading}</h2>}
          {hasText(data.description) && (
            <div
              className="about-dmc-richtext"
              dangerouslySetInnerHTML={{ __html: richHtml(data.description) }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function OurExpertiseSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const hasContent = [data.badge, data.heading, data.description, data.backgroundImage, data.ctaText].some(hasText);
  if (!hasContent) return null;

  const bgStyle = data.backgroundImage ? { backgroundImage: `url(${data.backgroundImage})` } : {};

  return (
    <section className="about-dmc-expertise-hero" style={bgStyle}>
      {data.overlayEnabled !== false && <div className="about-dmc-expertise-overlay" />}
      <div className="about-dmc-expertise-card">
        {hasText(data.badge) && <span className="about-dmc-eyebrow">{data.badge}</span>}
        {hasText(data.heading) && <h2>{data.heading}</h2>}
        {hasText(data.description) && (
          <div
            className="about-dmc-richtext"
            dangerouslySetInnerHTML={{ __html: richHtml(data.description) }}
          />
        )}
        {hasText(data.ctaText) && (
          <Link className="about-dmc-section-btn" href={data.ctaLink || '/contact-us'}>
            {data.ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}

function ExpertiseDetailsSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const bulletPoints = Array.isArray(data.bulletPoints) ? data.bulletPoints.filter(hasText) : [];
  const hasContent = [data.heading, data.description, ...bulletPoints].some(hasText);
  if (!hasContent) return null;

  return (
    <section className="about-dmc-expertise-details">
      <div className="about-dmc-expertise-details-inner">
        {hasText(data.heading) && <h2>{data.heading}</h2>}
        {hasText(data.description) && (
          <div
            className="about-dmc-richtext"
            dangerouslySetInnerHTML={{ __html: richHtml(data.description) }}
          />
        )}
        {bulletPoints.length > 0 && (
          <ul className="about-dmc-expertise-list">
            {bulletPoints.map((point, index) => (
              <li key={`${point}-${index}`}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function InfrastructureSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const gallery = Array.isArray(data.gallery) ? data.gallery.filter(item => hasText(item?.image)) : [];
  const hasContent = [data.heading, data.buttonText, ...gallery.map(item => item.image)].some(hasText);
  if (!hasContent) return null;

  return (
    <section className="about-dmc-infrastructure">
      <div className="about-dmc-infrastructure-inner">
        {hasText(data.heading) && <h2>{data.heading}</h2>}
        {gallery.length > 0 && (
          <div className="about-dmc-infra-gallery">
            {gallery.map((item, index) => (
              <figure className="about-dmc-infra-card" key={`${item.image}-${index}`}>
                <img src={item.image} alt={item.imageAlt || item.caption || data.heading || 'DMC infrastructure'} />
                {hasText(item.caption) && <figcaption>{item.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        {hasText(data.buttonText) && (
          <Link className="about-dmc-section-btn" href={data.buttonLink || '/virtual-tour'}>
            {data.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}

export default function AboutDmcTrichologyPage({ data = {} }) {
  return (
    <main className="about-dmc-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .about-dmc-page {
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .about-dmc-breadcrumb {
          width: 100%;
          background: #edeef8;
          padding: 12px 5%;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
        }

        .about-dmc-breadcrumb-inner {
          max-width: 1220px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #111111;
        }

        .about-dmc-breadcrumb a {
          color: #3b5998;
          text-decoration: none;
        }

        .about-dmc-breadcrumb span:last-child {
          color: #000000;
        }

        .about-dmc-hero {
          background-color: #23231f;
          background-size: cover;
          background-position: center;
          padding: 128px 5% 78px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          min-height: 600px;
          display: flex;
          align-items: center;
        }

        .about-dmc-hero-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(0,0,0,.64), rgba(0,0,0,.52));
          z-index: 1;
          pointer-events: none;
        }

        .about-dmc-hero-grid {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.25fr);
          gap: 46px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .about-dmc-hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .about-dmc-hero-badge {
          font-family: 'Marcellus', serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 8px;
          display: none;
        }

        .about-dmc-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: 36px;
          line-height: 1.18;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
          text-transform: uppercase;
        }

        .about-dmc-hero h2 {
          font-family: 'Lato', sans-serif;
          font-size: 18px;
          line-height: 1.45;
          font-weight: 500;
          color: #ffffff;
          text-transform: uppercase;
          margin: 0 0 24px;
        }

        .about-dmc-hero p {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: #ffffff;
          max-width: 760px;
          margin: 0 0 20px;
        }

        .about-dmc-hero-form {
          width: 100%;
        }

        .about-dmc-hero-form h3 {
          font-family: 'Marcellus', serif;
          font-size: 18px;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 12px;
        }

        .about-dmc-form-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 14px 28px;
          align-items: center;
        }

        .about-dmc-form-grid input {
          width: 100%;
          height: 42px;
          border: 1px solid rgba(255,255,255,.68);
          background: #ffffff;
          color: #111111;
          border-radius: 2px;
          padding: 0 14px;
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          outline: none;
          box-sizing: border-box;
        }

        .about-dmc-captcha-wrap {
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f6f0ec, #d7e7ea, #f3eeee);
          color: #111111;
          border: 1px solid rgba(255,255,255,.4);
          font-family: 'Marcellus', serif;
          font-size: 28px;
          letter-spacing: 8px;
          line-height: 1;
          user-select: none;
          cursor: pointer;
        }

        .about-dmc-hero-form button {
          display: block;
          min-width: 86px;
          min-height: 46px;
          margin: 26px auto 0;
          background: #3b5998;
          color: #ffffff;
          border: 1px solid #000000;
          border-radius: 4px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          padding: 10px 18px;
          transition: all .25s ease;
        }

        .about-dmc-hero-image {
          width: 100%;
          border: 6px solid #ffffff;
          background: #ffffff;
          box-shadow: 0 22px 48px rgba(0, 0, 0, .28);
          aspect-ratio: 1 / 1.08;
          overflow: hidden;
        }

        .about-dmc-hero-image img,
        .about-dmc-intro-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .about-dmc-intro {
          background: #ffffff;
          padding: 100px 5%;
        }

        .about-dmc-intro-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(320px, .9fr) minmax(0, 1.1fr);
          gap: 64px;
          align-items: center;
        }

        .about-dmc-intro-image {
          width: 100%;
          aspect-ratio: 4 / 3.4;
          border-radius: 28px;
          overflow: hidden;
          background: #E8EAF6;
          box-shadow: 0 18px 42px rgba(59, 89, 152, .12);
        }

        .about-dmc-intro-copy h2 {
          font-family: 'Marcellus', serif;
          font-size: 42px;
          line-height: 1.2;
          font-weight: 400;
          color: #111111;
          margin: 0 0 24px;
        }

        .about-dmc-eyebrow {
          font-family: 'Marcellus', serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #3b5998;
          margin-bottom: 14px;
          display: inline-flex;
        }

        .about-dmc-form-message {
          width: 100%;
          margin-top: 14px;
          padding: 10px 14px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          border-radius: 4px;
        }

        .about-dmc-form-message.is-error {
          color: #7f1d1d;
          background: #fee2e2;
        }

        .about-dmc-form-message.is-success {
          color: #14532d;
          background: #dcfce7;
        }

        .about-dmc-richtext {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.75;
          color: #333333;
        }

        .about-dmc-richtext p {
          margin: 0 0 18px;
        }

        .about-dmc-richtext p:last-child {
          margin-bottom: 0;
        }

        .about-dmc-highlights {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          list-style: none;
          padding: 0;
          margin: 28px 0 0;
        }

        .about-dmc-highlights li {
          position: relative;
          background: #f7f9fd;
          border: 1px solid rgba(59,89,152,.1);
          border-radius: 16px;
          padding: 16px 18px 16px 44px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          color: #1f2937;
        }

        .about-dmc-highlights li::before {
          content: "";
          position: absolute;
          left: 18px;
          top: 22px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3B5998;
          box-shadow: 0 0 0 4px rgba(59,89,152,.12);
        }

        .about-dmc-treatment {
          padding: 86px 5%;
          background: #ffffff;
        }

        .about-dmc-treatment-soft {
          background: #edeef8;
        }

        .about-dmc-treatment-blue {
          background: #3B5998;
        }

        .about-dmc-treatment-inner {
          max-width: 1180px;
          margin: 0 auto;
          text-align: center;
        }

        .about-dmc-treatment h2,
        .about-dmc-holistic h2,
        .about-dmc-patient-card h2 {
          font-family: 'Marcellus', serif;
          font-size: 38px;
          line-height: 1.2;
          font-weight: 400;
          color: #111111;
          margin: 0 0 26px;
        }

        .about-dmc-treatment-blue h2,
        .about-dmc-treatment-blue .about-dmc-richtext,
        .about-dmc-treatment-blue .about-dmc-richtext p {
          color: #ffffff;
        }

        .about-dmc-treatment-card {
          background: rgba(255,255,255,.96);
          border: 1px solid rgba(59,89,152,.12);
          border-radius: 8px;
          padding: 44px 48px;
          box-shadow: 0 18px 40px rgba(0,0,0,.08);
          text-align: left;
        }

        .about-dmc-treatment-blue .about-dmc-treatment-card {
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.22);
          box-shadow: 0 18px 44px rgba(0,0,0,.16);
        }

        .about-dmc-holistic {
          background: linear-gradient(135deg, #f8f9fa 0%, #edeef8 100%);
          padding: 86px 5%;
        }

        .about-dmc-holistic-card {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, .82fr);
          gap: 54px;
          align-items: center;
          background: #ffffff;
          border: 1px solid rgba(59,89,152,.14);
          border-radius: 10px;
          padding: 48px;
          box-shadow: 0 18px 44px rgba(59,89,152,.1);
        }

        .about-dmc-holistic-copy h2 {
          text-transform: uppercase;
        }

        .about-dmc-holistic-image {
          width: 100%;
          aspect-ratio: 4 / 3.05;
          border: 6px solid #ffffff;
          outline: 1px solid rgba(59,89,152,.2);
          border-radius: 6px;
          overflow: hidden;
          background: #edeef8;
          box-shadow: 0 16px 34px rgba(0,0,0,.12);
        }

        .about-dmc-holistic-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .about-dmc-patient-first {
          background: #ffffff;
          padding: 86px 5% 100px;
        }

        .about-dmc-patient-shell {
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }

        .about-dmc-patient-card {
          background: #ffffff;
          border: 1px solid rgba(59,89,152,.12);
          border-left: 5px solid #3B5998;
          border-radius: 10px;
          padding: 48px 58px;
          box-shadow: 0 18px 44px rgba(0,0,0,.08);
        }

        .about-dmc-patient-card h2 {
          text-align: center;
          text-transform: uppercase;
        }

        .about-dmc-expertise-hero {
          position: relative;
          min-height: 520px;
          padding: 100px 5%;
          background-color: #3B5998;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .about-dmc-expertise-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(17,17,17,.58), rgba(59,89,152,.42));
          z-index: 1;
        }

        .about-dmc-expertise-card {
          width: min(100%, 940px);
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(255,255,255,.42);
          border-radius: 10px;
          box-shadow: 0 28px 70px rgba(0,0,0,.2);
          padding: 50px 58px;
          text-align: center;
          backdrop-filter: blur(12px);
        }

        .about-dmc-expertise-card h2,
        .about-dmc-expertise-details h2,
        .about-dmc-infrastructure h2 {
          font-family: 'Marcellus', serif;
          font-size: 38px;
          line-height: 1.2;
          font-weight: 400;
          color: #111111;
          margin: 0 0 24px;
          text-align: center;
          text-transform: uppercase;
        }

        .about-dmc-section-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 28px;
          min-height: 46px;
          padding: 12px 28px;
          border-radius: 4px;
          background: #3B5998;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .04em;
          text-decoration: none;
          text-transform: uppercase;
          box-shadow: 0 12px 24px rgba(59,89,152,.18);
          transition: all .25s ease;
        }

        .about-dmc-section-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 34px rgba(59,89,152,.24);
        }

        .about-dmc-expertise-details {
          background: #ffffff;
          padding: 88px 5%;
        }

        .about-dmc-expertise-details-inner {
          max-width: 980px;
          margin: 0 auto;
        }

        .about-dmc-expertise-list {
          list-style: none;
          margin: 28px 0 0;
          padding: 0;
          display: grid;
          gap: 12px;
        }

        .about-dmc-expertise-list li {
          position: relative;
          padding: 14px 18px 14px 46px;
          background: #f8f9fa;
          border: 1px solid rgba(59,89,152,.1);
          border-radius: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.5;
          color: #111111;
        }

        .about-dmc-expertise-list li::before {
          content: "✓";
          position: absolute;
          left: 18px;
          top: 13px;
          color: #3B5998;
          font-weight: 800;
        }

        .about-dmc-infrastructure {
          background: #f8f9fa;
          padding: 88px 5% 96px;
        }

        .about-dmc-infrastructure-inner {
          max-width: 1180px;
          margin: 0 auto;
          text-align: center;
        }

        .about-dmc-infra-gallery {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 34px;
        }

        .about-dmc-infra-card {
          margin: 0;
          background: #ffffff;
          border: 1px solid rgba(59,89,152,.14);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 16px 34px rgba(0,0,0,.08);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .about-dmc-infra-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 46px rgba(59,89,152,.16);
        }

        .about-dmc-infra-card img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }

        .about-dmc-infra-card figcaption {
          padding: 12px 14px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: #333333;
        }

        @media (max-width: 1024px) {
          .about-dmc-hero {
            padding: 70px 5%;
            min-height: auto;
          }

          .about-dmc-hero-grid,
          .about-dmc-intro-grid,
          .about-dmc-holistic-card {
            grid-template-columns: 1fr;
            gap: 38px;
          }

          .about-dmc-hero-content,
          .about-dmc-intro-copy {
            text-align: center;
            align-items: center;
          }

          .about-dmc-hero h1 {
            font-size: 32px;
          }

          .about-dmc-hero h2 {
            font-size: 16px;
          }

          .about-dmc-intro-copy h2 {
            font-size: 36px;
          }

          .about-dmc-hero-image,
          .about-dmc-intro-image,
          .about-dmc-holistic-image {
            max-width: 620px;
            margin: 0 auto;
          }

          .about-dmc-treatment,
          .about-dmc-holistic,
          .about-dmc-patient-first {
            padding: 70px 5%;
          }

          .about-dmc-treatment h2,
          .about-dmc-holistic h2,
          .about-dmc-patient-card h2,
          .about-dmc-expertise-card h2,
          .about-dmc-expertise-details h2,
          .about-dmc-infrastructure h2 {
            font-size: 34px;
          }

          .about-dmc-infra-gallery {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .about-dmc-hero {
            padding: 149px 5%;
          }

          .about-dmc-hero h1 {
            font-size: 28px;
          }

          .about-dmc-hero p {
            font-size: 14px;
            line-height: 1.65;
          }

          .about-dmc-form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .about-dmc-captcha-wrap {
            font-size: 22px;
            letter-spacing: 5px;
          }

          .about-dmc-intro {
            padding: 66px 5%;
          }

          .about-dmc-intro-copy h2 {
            font-size: 30px;
          }

          .about-dmc-intro-image {
            border-radius: 20px;
          }

          .about-dmc-treatment,
          .about-dmc-holistic,
          .about-dmc-patient-first {
            padding: 54px 5%;
          }

          .about-dmc-treatment-card,
          .about-dmc-holistic-card,
          .about-dmc-patient-card,
          .about-dmc-expertise-card {
            padding: 28px 22px;
            border-radius: 8px;
          }

          .about-dmc-treatment h2,
          .about-dmc-holistic h2,
          .about-dmc-patient-card h2,
          .about-dmc-expertise-card h2,
          .about-dmc-expertise-details h2,
          .about-dmc-infrastructure h2 {
            font-size: 28px;
          }

          .about-dmc-expertise-hero,
          .about-dmc-expertise-details,
          .about-dmc-infrastructure {
            padding: 54px 5%;
          }

          .about-dmc-expertise-hero {
            min-height: auto;
          }

          .about-dmc-infra-gallery {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 16px;
            padding-bottom: 8px;
          }

          .about-dmc-infra-card {
            flex: 0 0 86%;
            scroll-snap-align: start;
          }
        }
      `}} />

      <AboutDmcHero data={data.hero || {}} />
      <AboutDmcIntro data={data.intro || {}} />
      <HairTreatmentCentreSection data={data.hairTreatmentCentre || {}} />
      <HolisticApproachSection data={data.holisticApproach || {}} />
      <PatientFirstApproachSection data={data.patientFirstApproach || {}} />
      <OurExpertiseSection data={data.ourExpertise || {}} />
      <ExpertiseDetailsSection data={data.expertiseDetails || {}} />
      <InfrastructureSection data={data.infrastructure || {}} />
    </main>
  );
}
