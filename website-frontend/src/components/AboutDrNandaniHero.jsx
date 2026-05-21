"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { Calendar, User, Phone, Mail, MessageSquare, ShieldCheck, Check, AlertCircle } from 'lucide-react';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function AboutDrNandaniHero({ data = {} }) {
  const {
    badge = "PIONEERING TRICHOLOGY & DERMATOLOGY",
    title = "Dr. Nandani Dadu",
    subtitle = "MD (Dermatology), Founder & Director. A pioneering hair transplant surgeon and dermatologist bringing elite clinical precision to customized hair restoration.",
    credentials = [
      "MD - Dermatology, Venereology & Leprosy",
      "Gold Medalist in Aesthetic Dermatology",
      "15+ Years of Clinical Expertise",
      "5,000+ Successful Hair Transformations"
    ],
    image = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    ctaText = "Book Luxury Consultation"
  } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    appointmentDate: '',
    message: '',
    code: ''
  });

  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Set initial captcha on mount
  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const generateCaptcha = () => {
    setCaptcha(createCaptcha());
  };

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

    // Form validation
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!trimmedMobile) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!/^\d{10}$/.test(trimmedMobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.appointmentDate) {
      setError('Please select a preferred date.');
      return;
    }
    if (!formData.code.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    if (formData.code.trim() !== captcha) {
      setError('Invalid captcha code. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Post to isolated leads endpoint
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
        code: ''
      });
      generateCaptcha();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableSection sectionId="about-nandani-hero" label="Doctor Hero Section">
      {/* Custom fonts & luxury style definitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Epilogue:wght@300;400;500;600&family=DM+Mono&display=swap');
        
        .luxury-hero-container {
          background-color: #0D0D1A;
          color: #ffffff;
          font-family: 'Epilogue', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 120px 24px;
        }

        .luxury-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(139,92,246,0) 70%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 1;
        }

        .particle-1 { width: 500px; height: 500px; top: -100px; right: -50px; }
        .particle-2 { width: 400px; height: 400px; bottom: -50px; left: -100px; }

        .luxury-hero-grid {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-cols: 1.2fr 0.8fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1024px) {
          .luxury-hero-grid {
            grid-template-cols: 1fr;
            gap: 48px;
            padding-top: 40px;
          }
        }

        .luxury-hero-eyebrow {
          font-family: 'DM Mono', monospace;
          color: #00E5FF;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .luxury-hero-eyebrow::before {
          content: "";
          display: inline-block;
          width: 24px;
          height: 1px;
          background-color: #00E5FF;
        }

        .luxury-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #ffffff 30%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 640px) {
          .luxury-hero-title {
            font-size: 2.8rem;
          }
        }

        .luxury-hero-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #CBD5E1;
          margin-bottom: 36px;
          max-width: 600px;
        }

        .luxury-credentials-box {
          border-left: 2px solid #8B5CF6;
          padding-left: 24px;
          margin-bottom: 48px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .luxury-cred-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #94A3B8;
        }

        .luxury-cred-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #00E5FF;
          box-shadow: 0 0 8px #00E5FF;
        }

        .luxury-hero-image-area {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .luxury-hero-image-frame {
          position: relative;
          border-radius: 40px;
          overflow: hidden;
          aspect-ratio: 4/5;
          width: 100%;
          max-width: 440px;
          background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }

        .luxury-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-hero-image-frame:hover .luxury-hero-image {
          transform: scale(1.04);
        }

        .luxury-gold-ring {
          position: absolute;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 50%;
          pointer-events: none;
        }

        .ring-1 { width: 500px; height: 500px; top: -40px; left: -40px; border-style: dashed; }

        /* Consultation Glassmorphic Form */
        .glass-form-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          padding: 36px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 10;
        }

        .glass-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #ffffff 0%, #00E5FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-form-subtitle {
          font-size: 13px;
          color: #94A3B8;
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .glass-input-wrapper {
          position: relative;
          margin-bottom: 18px;
        }

        .glass-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
          transition: color 0.3s;
          pointer-events: none;
        }

        .glass-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 14px 16px 14px 48px;
          font-size: 13px;
          color: #ffffff;
          outline: none;
          font-family: 'Epilogue', sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.04);
          border-color: #8B5CF6;
          box-shadow: 0 0 12px rgba(139,92,246,0.15);
        }

        .glass-input:focus + .glass-input-icon {
          color: #8B5CF6;
        }

        .glass-input-textarea {
          min-height: 80px;
          resize: none;
        }

        .glass-captcha-row {
          display: grid;
          grid-template-cols: 100px 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .glass-captcha-display {
          background: linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(0,229,255,0.08) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 5px;
          color: #00E5FF;
          user-select: none;
          text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
          cursor: pointer;
        }

        .glass-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #8B5CF6 0%, #00E5FF 100%);
          color: #0D0D1A;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 16px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 20px rgba(0, 229, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .glass-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 229, 255, 0.3);
          filter: brightness(1.1);
        }

        .glass-submit-btn:active {
          transform: translateY(0);
        }

        .glass-alert {
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .glass-alert-success {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34D399;
        }

        .glass-alert-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #F87171;
        }
      `}} />

      <section className="luxury-hero-container">
        {/* Background Particles */}
        <div className="luxury-particle particle-1" aria-hidden="true" />
        <div className="luxury-particle particle-2" aria-hidden="true" />

        <div className="luxury-hero-grid">
          {/* LEFT: Intro content */}
          <div className="luxury-hero-left">
            <motion.div {...fadeLeft(0)} className="luxury-hero-eyebrow">
              <EditableText sectionId="about-nandani-hero" fieldPath="hero.badge" tag="span">
                {badge}
              </EditableText>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="luxury-hero-title">
              <EditableText sectionId="about-nandani-hero" fieldPath="hero.title" tag="span">
                {title}
              </EditableText>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="luxury-hero-subtitle">
              <EditableText sectionId="about-nandani-hero" fieldPath="hero.subtitle" tag="span">
                {subtitle}
              </EditableText>
            </motion.p>

            {/* Credentials Column */}
            <motion.div {...fadeUp(0.3)} className="luxury-credentials-box">
              {credentials.map((cred, idx) => (
                <div key={idx} className="luxury-cred-item">
                  <span className="luxury-cred-bullet" aria-hidden="true" />
                  <EditableText sectionId="about-nandani-hero" fieldPath={`hero.credentials.${idx}`} tag="span">
                    {cred}
                  </EditableText>
                </div>
              ))}
            </motion.div>

            {/* Doctor Image Block */}
            <motion.div {...fadeUp(0.4)} className="luxury-hero-image-area">
              <div className="luxury-gold-ring ring-1" aria-hidden="true" />
              <div className="luxury-hero-image-frame">
                <img src={image} alt="Dr. Nandani Dadu Portrait" className="luxury-hero-image" />
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Consultation Form */}
          <motion.div {...fadeUp(0.25)} className="luxury-hero-right">
            <div className="glass-form-card">
              <h3 className="glass-form-title">
                <EditableText sectionId="about-nandani-hero" fieldPath="formSettings.title" tag="span">
                  {data.formSettings?.title || "Request Private Consultation"}
                </EditableText>
              </h3>
              <p className="glass-form-subtitle">
                <EditableText sectionId="about-nandani-hero" fieldPath="formSettings.subtitle" tag="span">
                  {data.formSettings?.subtitle || "Reserve your bespoke scalp assessment and consultation session."}
                </EditableText>
              </p>

              {success && (
                <div className="glass-alert glass-alert-success">
                  <Check size={16} className="shrink-0 mt-0.5" />
                  <span>
                    {data.formSettings?.successMessage || "Your consultation request has been successfully submitted to Dr. Nandani Dadu's private desk. Our concierge team will reach out shortly."}
                  </span>
                </div>
              )}

              {error && (
                <div className="glass-alert glass-alert-error">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="glass-input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="YOUR FULL NAME"
                    className="glass-input"
                    disabled={loading}
                    required
                  />
                  <User size={16} className="glass-input-icon" />
                </div>

                <div className="glass-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EMAIL ADDRESS"
                    className="glass-input"
                    disabled={loading}
                    required
                  />
                  <Mail size={16} className="glass-input-icon" />
                </div>

                <div className="glass-input-wrapper">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-DIGIT MOBILE"
                    className="glass-input"
                    disabled={loading}
                    required
                  />
                  <Phone size={16} className="glass-input-icon" />
                </div>

                <div className="glass-input-wrapper">
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    className="glass-input"
                    disabled={loading}
                    required
                  />
                  <Calendar size={16} className="glass-input-icon" />
                </div>

                <div className="glass-input-wrapper">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="MESSAGE / scalp concern details (optional)"
                    className="glass-input glass-input-textarea"
                    disabled={loading}
                  />
                  <MessageSquare size={16} className="glass-input-icon" style={{ top: '24px' }} />
                </div>

                <div className="glass-captcha-row">
                  <div 
                    onClick={generateCaptcha}
                    className="glass-captcha-display"
                    title="Click to regenerate verification code"
                  >
                    {captcha}
                  </div>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Verification Code"
                    className="glass-input"
                    style={{ paddingLeft: '16px' }}
                    disabled={loading}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="glass-submit-btn"
                >
                  {loading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>
                        <EditableText sectionId="about-nandani-hero" fieldPath="hero.ctaText" tag="span">
                          {ctaText}
                        </EditableText>
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
