"use client";
import { useState, useEffect } from 'react';
import { submitLead, fetchSiteSettings } from '../services/api';

const createCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    code: ''
  });
  // Start empty so server and client first render match; generate on mount (client only).
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);

  // Function to generate random 4-digit number
  const generateCaptcha = () => {
    setCaptcha(createCaptcha());
  };

  // Generate captcha only on the client after mount (avoids SSR/client hydration mismatch).
  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  useEffect(() => {
    // Fetch CMS settings for dynamic stats
    const loadSettings = async () => {
      try {
        const res = await fetchSiteSettings();
        if (res && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Error loading site settings in LeadForm:", err);
      }
    };
    loadSettings();
  }, []);

  // Success auto-hide timer after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset success/error states on typing
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submits
    
    setError('');
    setSuccess(false);

    // 1. Validation
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!trimmedMobile) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!/^\d{10}$/.test(trimmedMobile)) {
      setError('Please enter a valid 10-digit mobile number (numbers only).');
      return;
    }

    if (!formData.code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.code.trim() !== captcha) {
      setError('Invalid captcha. Please enter the correct code.');
      return;
    }

    setLoading(true);
    try {
      await submitLead({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile
      });
      setSuccess(true);
      setFormData({ name: '', mobile: '', email: '', code: '' });
      generateCaptcha(); // Regenerate captcha after successful submit
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ backgroundColor: '#E8EAF6', borderRadius: '24px', padding: '24px', position: 'relative' }}>
      {/* Dynamic keyframe style block for smooth fade + slide transitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastFadeSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .luxury-toast {
          animation: toastFadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="hero-form-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', height: '30px' }}>
        <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '30px', height: '30px', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)' }} />
        <span className="section-subtitle" style={{ fontSize: '11px' }}>Book a Session</span>
      </div>
      
      <div className="hero-form-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '15px', height: '50px' }}>
        <h2 className="section-title leadform-cap-heading" style={{ fontSize: '2.2rem', whiteSpace: 'nowrap' }}>Request A Call</h2>
        <div className="hero-form-patients" style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', height: '30px' }}>
            {[
              "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081533_e6490b2d-e5d7-41c2-95d8-96f3067b0f1e.png",
              "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081539_746b3b54-ef32-4750-bbdd-f16e0347e0aa.png",
              "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081544_1ed8500d-e5f3-41f7-bb92-174bbdbbbbf0.png",
              "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081548_0203dc40-c362-4848-9f49-1bb4c51954a4.png"
            ].map((src, i) => (
              <div key={i} style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '2px solid #fff',
                overflow: 'hidden',
                marginLeft: i > 0 ? '-10px' : '0',
                backgroundColor: '#ddd'
              }}>
                <img src={src} alt="Patient" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'left', minWidth: '110px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#333333', whiteSpace: 'nowrap', fontFamily: "'Marcellus', serif" }}>
              {settings?.patientCount || '225+ Patients'}
            </div>
            <div style={{ display: 'flex', gap: '2px', marginTop: '2px', height: '10px' }}>
              {settings?.ratingText ? (
                <span style={{ fontSize: '10px', color: '#FFA500', lineHeight: 1, letterSpacing: '1px' }}>{settings.ratingText}</span>
              ) : (
                Array.from({ length: Number(settings?.ratingStars || 5) }).map((_, idx) => (
                  <img key={idx} src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png" alt="star" style={{ width: '10px', height: '10px' }} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="luxury-toast" style={{
          background: 'rgba(46, 125, 50, 0.08)',
          border: '1px solid rgba(46, 125, 50, 0.25)',
          borderRadius: '12px',
          color: '#2e7d32',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '13px',
          fontFamily: 'Lato, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.05)'
        }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>✓</span>
          <strong>Thank you! Our team will contact you shortly.</strong>
        </div>
      )}
      {error && (
        <div className="luxury-toast" style={{
          background: 'rgba(198, 40, 40, 0.08)',
          border: '1px solid rgba(198, 40, 40, 0.25)',
          borderRadius: '12px',
          color: '#c62828',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '13px',
          fontFamily: 'Lato, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(198, 40, 40, 0.05)'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <strong>{error}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              placeholder="YOUR NAME" 
              className="form-input" 
              value={formData.name} 
              onChange={handleChange} 
              style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px' }}
              disabled={loading}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              name="mobile" 
              placeholder="MOBILE NUMBER *" 
              className="form-input" 
              value={formData.mobile} 
              onChange={handleChange} 
              style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px' }}
              disabled={loading}
              required 
            />
          </div>
        </div>

        <div className="form-row hero-email-code-row" style={{ alignItems: 'stretch' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="email"
              name="email"
              placeholder="E-MAIL ADDRESS"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              style={{ backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px' }}
              disabled={loading}
            />
          </div>
          <div className="hero-captcha-row" style={{ display: 'flex', flex: '0 0 310px', width: '100%', maxWidth: '310px', alignItems: 'stretch', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
            <div className="hero-captcha-code" style={{ flex: '0 0 92px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', borderRight: '1px solid #ddd', userSelect: 'none' }}>
              <span style={{ color: '#888', letterSpacing: '4px', fontWeight: 'bold' }}>{captcha}</span>
            </div>
            <div className="hero-captcha-input" style={{ flex: 1 }}>
              <input 
                type="text" 
                name="code" 
                placeholder="ENTER CODE" 
                className="form-input" 
                value={formData.code} 
                onChange={handleChange} 
                style={{ backgroundColor: 'transparent', border: 'none', height: '50px', borderRadius: 0, width: '100%' }}
                disabled={loading}
                required 
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn-primary hero-submit-btn" style={{ width: '100%', position: 'relative', height: '60px', borderRadius: '50px', padding: '0 24px', cursor: loading ? 'not-allowed' : 'pointer', background: '#3B5998', backgroundColor: '#3B5998' }} disabled={loading}>
            <span style={{ fontFamily: "'Marcellus', serif", fontSize: '1.2rem', color: '#ffffff', margin: '0 auto' }}>{loading ? 'Submitting...' : 'Submit'}</span>
            <div className="icon-circle" style={{ position: 'absolute', right: '10px', backgroundColor: '#ffffff', width: '40px', height: '40px' }}>
              <img className="hero-submit-arrow" src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" style={{ width: '16px', height: '16px', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)' }} />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
