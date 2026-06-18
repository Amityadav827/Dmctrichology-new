"use client";
import { useState, useEffect, useRef } from 'react';
import { submitLead, fetchSiteSettings } from '../services/api';

const LOCATION_OPTIONS = [
  {
    value: "A2/6, Block A, Vasant Vihar, New Delhi, Delhi 110057, India",
    label: "Vasant Vihar",
    description: "A2/6, Block A, Vasant Vihar, New Delhi, Delhi 110057, India"
  },
  {
    value: "J-12/25, 1st Floor, Block J, Rajouri Garden Extension, Rajouri Garden, New Delhi, Delhi, 110027, India",
    label: "Rajouri Garden",
    description: "J-12/25, 1st Floor, Block J, Rajouri Garden Extension, Rajouri Garden, New Delhi, Delhi, 110027, India"
  }
];

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    preferredLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target)) {
        setLocationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const selectedLocation = LOCATION_OPTIONS.find(
    (option) => option.value === formData.preferredLocation
  );

  const handleLocationSelect = (locationValue) => {
    setFormData((prev) => ({ ...prev, preferredLocation: locationValue }));
    setLocationMenuOpen(false);
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

    if (!formData.preferredLocation.trim()) {
      setError('Please select your preferred location.');
      return;
    }

    setLoading(true);
    try {
      await submitLead({
        name: formData.name.trim(),
        mobile: trimmedMobile,
        preferredLocation: formData.preferredLocation
      });
      setSuccess(true);
      setFormData({ name: '', mobile: '', preferredLocation: '' });
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
                  <img key={idx} src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/ujqfjbjqbnxpcngqssi3.png" alt="star" style={{ width: '10px', height: '10px' }} />
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

        <div className="form-row" style={{ display: 'block' }}>
          <div className="form-group" style={{ width: '100%', marginBottom: 0, position: 'relative' }} ref={locationMenuRef}>
            <button
              type="button"
              className="form-input"
              onClick={() => !loading && setLocationMenuOpen((prev) => !prev)}
              disabled={loading}
              aria-haspopup="listbox"
              aria-expanded={locationMenuOpen}
              style={{
                backgroundColor: 'transparent',
                border: locationMenuOpen ? '1px solid #3B5998' : '1px solid #ddd',
                borderRadius: locationMenuOpen ? '12px 12px 0 0' : '12px',
                width: '100%',
                minHeight: '62px',
                height: 'auto',
                padding: '14px 52px 14px 20px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                color: selectedLocation ? '#333333' : '#888',
                fontFamily: "'Marcellus', serif",
                fontSize: '14px',
                lineHeight: 1.5,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <span style={{ display: 'block', paddingRight: '12px' }}>
                {selectedLocation ? selectedLocation.description : 'PREFERRED LOCATION *'}
              </span>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: locationMenuOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)',
                  transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px'
                }}
              >
                <img
                  src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781783268360-703155124.png"
                  alt=""
                  style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                />
              </span>
            </button>

            <div
              role="listbox"
              aria-label="Preferred location"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #3B5998',
                borderTop: 'none',
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 18px 34px rgba(59, 89, 152, 0.16)',
                overflow: 'hidden',
                zIndex: 20,
                opacity: locationMenuOpen ? 1 : 0,
                transform: locationMenuOpen ? 'translateY(0) scaleY(1)' : 'translateY(-8px) scaleY(0.96)',
                transformOrigin: 'top center',
                maxHeight: locationMenuOpen ? '260px' : '0px',
                pointerEvents: locationMenuOpen ? 'auto' : 'none',
                transition: 'opacity 0.24s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), max-height 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {LOCATION_OPTIONS.map((location, index) => {
                const isSelected = formData.preferredLocation === location.value;
                return (
                  <button
                    key={location.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleLocationSelect(location.value)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px 18px',
                      background: isSelected ? 'rgba(59, 89, 152, 0.08)' : '#ffffff',
                      border: 'none',
                      borderTop: index === 0 ? '1px solid rgba(59, 89, 152, 0.08)' : '1px solid rgba(226, 232, 240, 0.9)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <span style={{ display: 'block', color: '#3B5998', fontFamily: "'Marcellus', serif", fontSize: '15px', marginBottom: '4px' }}>
                      {location.label}
                    </span>
                    <span style={{ display: 'block', color: '#666', fontFamily: 'Lato, sans-serif', fontSize: '12px', lineHeight: 1.5 }}>
                      {location.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn-primary hero-submit-btn" style={{ width: '100%', position: 'relative', height: '60px', borderRadius: '50px', padding: '0 24px', cursor: loading ? 'not-allowed' : 'pointer', background: '#3B5998', backgroundColor: '#3B5998' }} disabled={loading}>
            <span style={{ fontFamily: "'Marcellus', serif", fontSize: '1.2rem', color: '#ffffff', margin: '0 auto' }}>{loading ? 'Submitting...' : 'Submit'}</span>
            <div className="icon-circle" style={{ position: 'absolute', right: '10px', backgroundColor: '#ffffff', width: '40px', height: '40px' }}>
              <img className="hero-submit-arrow" src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781767815987-926134594.png" alt="arrow" style={{ width: '16px', height: '16px', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)' }} />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
