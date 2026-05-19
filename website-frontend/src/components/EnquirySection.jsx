"use client";
import React, { useState, useRef, useEffect } from 'react';
import { fetchConsultation, fetchServices } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const EnquirySection = ({ sectionId = "consultation-section", data: propData, label = "Request Consultation" }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = useState(propData || {});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    service: '',
    message: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Dynamic Services state
  const [dynamicServices, setDynamicServices] = useState([]);

  // Date & Time Picker states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(''); // Stores final backend payload format
  
  const calendarRef = useRef(null);

  // Generate 4-digit captcha
  const generateCaptcha = () => {
    setCaptcha(Math.floor(1000 + Math.random() * 9000).toString());
  };

  useEffect(() => {
    generateCaptcha();
    
    // Fetch CMS services for dynamic service enquiry options
    fetchServices().then(res => {
      if (res && res.success && Array.isArray(res.data)) {
        const activeServices = res.data
          .filter(s => s.status !== 'inactive')
          .map(s => s.title);
        if (activeServices.length > 0) {
          setDynamicServices(activeServices);
        }
      }
    }).catch(err => console.error("Error loading dynamic services:", err));
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

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === sectionId) {
      setData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig, sectionId]);

  useEffect(() => {
    if (!propData) {
      fetchConsultation().then(res => {
        if (res && res.success && res.data) {
          setData(res.data);
        }
      });
    } else {
      setData(propData);
    }
  }, [propData]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (data && data.enabled === false) return null;

  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";
  const badgeText = data ? (data.badgeText || '') : 'WHY CHOOSE US SERVICES';
  const heading = data ? (data.heading || '') : 'REQUEST A CONSULTATION';
  const subtitle = data ? (data.subtitle || '') : 'Clinic Timings ( By Appointments Only)';
  const phoneNumber = data ? (data.phoneNumber || '') : '+91-8527830194';
  const timingMonSat = data ? (data.serviceTimingMonSat || '') : '9:00 AM To 8:00 PM';
  const timingSun = data ? (data.serviceTimingSunday || '') : '10:00 AM To 7:00 PM';
  const namePlaceholder = data?.namePlaceholder || 'Name*';
  const emailPlaceholder = data?.emailPlaceholder || 'E-Mail Address*';
  const messagePlaceholder = data?.messagePlaceholder || 'Enter Your Message Here*';
  const serviceOptions = Array.isArray(data?.serviceOptions) ? data.serviceOptions : ['Hair Transplant', 'Laser Hair Removal', 'Skin Treatment', 'Others'];
  const buttonText = data ? (data.buttonText || '') : 'Schedule Your Visit';
  const fallbackBeforeImage = 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png';
  const beforeImage = data?.beforeImage?.trim() || fallbackBeforeImage;
  const bgColor = data ? (data.backgroundColor || '#ffffff') : '#ffffff';

  // Available dynamic option list falling back to schema default list
  const finalServiceOptions = dynamicServices.length > 0 ? dynamicServices : serviceOptions;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Reset time when date changes
    setSelectedDateTime('');
    if (error) setError('');
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      // Create valid backend date representation: e.g. "2026-05-19 14:30"
      const [tStr, ampm] = time.split(" ");
      let [hours, mins] = tStr.split(":").map(Number);
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      
      const payloadDate = `${selectedDate}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
      setSelectedDateTime(payloadDate);
      if (error) setError('');
    }
  };

  // Generate 30-minute slots based on day category timing
  const getTimeSlots = () => {
    if (!selectedDate) return [];
    
    const slots = [];
    const dateObj = new Date(selectedDate);
    const isSunday = dateObj.getDay() === 0;
    
    const startHour = isSunday ? 10 : 9; // Sun: 10AM, Mon-Sat: 9AM
    const endHour = isSunday ? 19 : 20;   // Sun: 7PM, Mon-Sat: 8PM

    const now = new Date();
    const todayString = now.toISOString().split("T")[0];
    const isToday = selectedDate === todayString;
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    for (let hour = startHour; hour < endHour; hour++) {
      for (const min of ["00", "30"]) {
        const displayHour = hour % 12 || 12;
        const ampm = hour >= 12 ? "PM" : "AM";
        const slotLabel = `${displayHour}:${min} ${ampm}`;

        // Disable slot if it's in the past today
        if (isToday) {
          if (hour < currentHour) continue;
          if (hour === currentHour && Number(min) <= currentMin) continue;
        }
        slots.push(slotLabel);
      }
    }
    // Append last closing hour slot (7:00 PM or 8:00 PM) if not passed today
    const finalHour = isSunday ? 19 : 20;
    const finalLabel = `${finalHour % 12 || 12}:00 PM`;
    if (!isToday || finalHour > currentHour) {
      slots.push(finalLabel);
    }

    return slots;
  };

  const todayString = new Date().toISOString().split("T")[0];
  const displayValue = selectedDate && selectedTime 
    ? `${new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at ${selectedTime}`
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submits
    
    setError('');
    setSuccess(false);

    // Form validation
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const trimmedMobile = formData.mobile.replace(/\s+/g, '');
    if (!trimmedMobile || !/^\d{10}$/.test(trimmedMobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.service) {
      setError('Please select a type of service enquiry.');
      return;
    }
    if (!selectedDateTime) {
      setError('Please select a valid appointment date and time.');
      return;
    }
    if (!captchaInput.trim() || captchaInput.trim() !== captcha) {
      setError('Invalid verification code.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: trimmedMobile,
        service: formData.service,
        appointmentDate: selectedDateTime,
        message: formData.message.trim()
      };
      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : 'https://dmctrichology-1.onrender.com/api');
      const response = await fetch(`${API_URL}/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', mobile: '', service: '', message: '' });
        setSelectedDate('');
        setSelectedTime('');
        setSelectedDateTime('');
        setCaptchaInput('');
        generateCaptcha();
      } else {
        setError(result.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to submit. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableSection sectionId={sectionId} label={label}>
      <section className="enquiry-section" style={{ padding: '100px 5%', backgroundColor: bgColor }}>
        
        {/* Toast Keyframes style block */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes toastFadeSlide {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .consultation-toast {
            animation: toastFadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Top Row: Info Left, Form Right */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginBottom: '0' }}>
            
            {/* Header and Contact Info */}
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <img src={iconUrl} alt="icon" style={{ width: '40px', height: 'auto' }} />
                <EditableText sectionId={sectionId} fieldPath="badgeText" tag="span" className="section-subtitle">
                  {badgeText}
                </EditableText>
              </div>
              <h2 className="section-title">
                <EditableText sectionId={sectionId} fieldPath="heading" tag="span">
                  {heading}
                </EditableText>
              </h2>
              <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Marcellus', serif", marginBottom: '30px' }}>
                <EditableText sectionId={sectionId} fieldPath="subtitle" tag="span">
                  {subtitle}
                </EditableText>
              </p>

              {/* Contact Info Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png" alt="icon" style={{ width: '30px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#777', fontFamily: "'Marcellus', serif" }}>Phone Number</p>
                    <a href={`tel:${phoneNumber}`} style={{ textDecoration: 'none', color: '#000' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#000', fontFamily: "'Marcellus', serif" }}>
                        <EditableText sectionId={sectionId} fieldPath="phoneNumber" tag="span">{phoneNumber}</EditableText>
                      </p>
                    </a>
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png" alt="icon" style={{ width: '30px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#777', fontFamily: "'Marcellus', serif" }}>Service Timing ( Mon To Sat )</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#000', fontFamily: "'Marcellus', serif" }}>
                      <EditableText sectionId={sectionId} fieldPath="serviceTimingMonSat" tag="span">{timingMonSat}</EditableText>
                    </p>
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png" alt="icon" style={{ width: '30px' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#777', fontFamily: "'Marcellus', serif" }}>Service Timing ( Sunday )</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#000', fontFamily: "'Marcellus', serif" }}>
                      <EditableText sectionId={sectionId} fieldPath="serviceTimingSunday" tag="span">{timingSun}</EditableText>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ flex: '1 1 400px', paddingTop: '55px', position: 'relative', zIndex: 2 }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                   {success && (
                     <div className="consultation-toast" style={{
                       padding: '12px 20px', 
                       backgroundColor: '#e6fffa', 
                       color: '#234e52', 
                       border: '1px solid #b2f5ea',
                       borderRadius: '16px', 
                       marginBottom: '10px', 
                       fontSize: '13px', 
                       fontFamily: 'Lato, sans-serif',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '8px',
                       boxShadow: '0 4px 12px rgba(35, 78, 82, 0.05)'
                     }}>
                       <span style={{ fontSize: '16px', fontWeight: 'bold' }}>✓</span>
                       <strong>Your consultation request has been submitted successfully.</strong>
                     </div>
                   )}
                   {error && (
                     <div className="consultation-toast" style={{ 
                       padding: '12px 20px', 
                       backgroundColor: '#fff5f5', 
                       color: '#9b2c2c', 
                       border: '1px solid #fed7d7',
                       borderRadius: '16px', 
                       marginBottom: '10px', 
                       fontSize: '13px', 
                       fontFamily: 'Lato, sans-serif',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '8px',
                       boxShadow: '0 4px 12px rgba(155, 44, 44, 0.05)'
                     }}>
                       <span style={{ fontSize: '16px' }}>⚠️</span>
                       <strong>{error}</strong>
                     </div>
                   )}
                </div>
                <div>
                   <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={namePlaceholder} className="premium-input" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease' }} disabled={loading} required />
                </div>
                <div>
                   <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={emailPlaceholder} className="premium-input" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease' }} disabled={loading} required />
                </div>
                <div>
                   <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number*" className="premium-input" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease' }} disabled={loading} required />
                </div>
                <div style={{ position: 'relative' }}>
                   <select name="service" value={formData.service} onChange={handleChange} className="premium-select" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", appearance: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} disabled={loading} required>
                     <option value="">Type Of Service Enquiry*</option>
                     {finalServiceOptions.map((opt, i) => (
                       <option key={i} value={opt}>{opt}</option>
                     ))}
                   </select>
                   <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/qcrzwotm1zyqsdbu6ttb.png" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '12px', pointerEvents: 'none' }} alt="icon" />
                </div>
                
                {/* Date & Time Picker */}
                <div style={{ position: 'relative' }} ref={calendarRef}>
                   <input 
                     type="text" 
                     placeholder="Select Date & Time*" 
                     readOnly
                     value={displayValue}
                     className="premium-input-readonly" 
                     style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease', cursor: loading ? 'not-allowed' : 'pointer' }} 
                     onClick={() => !loading && setShowCalendar(!showCalendar)}
                   />
                   <div 
                      onClick={() => !loading && setShowCalendar(!showCalendar)}
                      className="calendar-trigger-btn"
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', backgroundColor: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', zIndex: 5, justifyContent: 'center' }}
                   >
                      <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/bze1cv4xanahe5dvljhb.png" style={{ width: '22px', height: '22px', filter: 'invert(1)' }} alt="icon" />
                   </div>

                   {showCalendar && (
                     <div className="luxury-datepicker-overlay" style={{ position: 'absolute', top: '110%', right: '0', width: '330px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', padding: '24px', zIndex: 1000, border: '1px solid #f2f2f2', animation: 'fadeInUp 0.3s ease' }}>
                       <div style={{ marginBottom: '15px', borderBottom: '1px solid #f2f2f2', paddingBottom: '10px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                          <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', fontFamily: "'Marcellus', serif", color: '#1a1a1a' }}>Appointment Details</p>
                       </div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'Marcellus', serif", letterSpacing: '1px' }}>Pick Date</label>
                            <input 
                              type="date" 
                              min={todayString}
                              value={selectedDate}
                              onChange={handleDateChange}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontFamily: "'Marcellus', serif", backgroundColor: '#fafafa', cursor: 'pointer' }} 
                            />
                          </div>

                          {selectedDate && (
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'Marcellus', serif", letterSpacing: '1px' }}>Available 30-Min Slots</label>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px' }} className="time-slots-container">
                                {getTimeSlots().length === 0 ? (
                                  <span style={{ gridColumn: 'span 3', fontSize: '12px', color: '#e53e3e', textAlign: 'center', padding: '10px 0' }}>No slots available today.</span>
                                ) : (
                                  getTimeSlots().map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => handleTimeClick(time)}
                                        style={{
                                          padding: '8px 4px',
                                          fontSize: '10px',
                                          fontWeight: 'bold',
                                          borderRadius: '8px',
                                          border: isSelected ? '1px solid #d4af37' : '1px solid #e2e8f0',
                                          backgroundColor: isSelected ? '#d4af37' : '#fff',
                                          color: isSelected ? '#fff' : '#4a5568',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s',
                                          fontFamily: 'Lato, sans-serif',
                                          boxShadow: isSelected ? '0 4px 10px rgba(212,175,55,0.2)' : 'none'
                                        }}
                                      >
                                        {time}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          )}

                          <button 
                            type="button" 
                            onClick={() => setShowCalendar(false)} 
                            disabled={!selectedDate || !selectedTime}
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              backgroundColor: '#000', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: '30px', 
                              cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer', 
                              fontFamily: "'Marcellus', serif", 
                              fontSize: '13px', 
                              fontWeight: 'bold',
                              marginTop: '8px',
                              opacity: (!selectedDate || !selectedTime) ? 0.5 : 1,
                              transition: 'all 0.3s'
                            }}
                          >
                            Confirm Appointment
                          </button>
                       </div>
                     </div>
                   )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <div style={{ padding: '15px 20px', backgroundColor: '#E4B753', borderRadius: '30px', color: '#fff', fontWeight: 'bold', letterSpacing: '4px', userSelect: 'none' }}>{captcha}</div>
                   <input type="text" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} placeholder="Code*" className="premium-input" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif" }} disabled={loading} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                   <textarea name="message" value={formData.message} onChange={handleChange} placeholder={messagePlaceholder} className="premium-textarea" style={{ width: '100%', padding: '20px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", minHeight: '100px', resize: 'none', transition: 'all 0.3s ease' }} disabled={loading}></textarea>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" className="premium-submit-btn" style={{ width: '100%', padding: '15px', borderRadius: '30px', backgroundColor: '#000', color: '#fff', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Marcellus', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden' }} disabled={loading}>
                    <EditableText sectionId={sectionId} fieldPath="buttonText" tag="span">{loading ? 'Scheduling...' : buttonText}</EditableText>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="consultation-btn-arrow">
                      <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" style={{ width: '40px' }} alt="arrow" />
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom Row: Full Width Image */}
          <div style={{ width: '100%', marginTop: '-95px', position: 'relative', zIndex: 1 }}>
            <img 
              src={beforeImage} 
              alt="Consultation Result" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '40px' }} 
            />
          </div>
        </div>

        <style jsx>{`
          .premium-input:focus, .premium-select:focus, .premium-textarea:focus { background-color: #fff !important; box-shadow: 0 0 0 2px #E4B753; }
          .premium-input:hover, .premium-select:hover, .premium-textarea:hover { background-color: #ededed; }
          .calendar-trigger-btn:hover { transform: translateY(-50%) scale(1.1) !important; background-color: #333 !important; }
          .consultation-btn-arrow { transform: rotate(-45deg); transition: transform 0.4s ease; }
          .premium-submit-btn:hover { transform: none; box-shadow: 0 15px 30px rgba(0,0,0,0.2); background-color: #1a1a1a; }
          .premium-submit-btn:hover .consultation-btn-arrow { transform: rotate(0deg) translateX(5px); }
          .premium-submit-btn:active { transform: none; }
          
          .time-slots-container::-webkit-scrollbar {
            width: 4px;
          }
          .time-slots-container::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 4px;
          }
          .time-slots-container::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
          }
          
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 1024px) { .enquiry-section { padding: 60px 5% !important; } }
          @media (max-width: 640px) { form { grid-template-columns: 1fr !important; } form div { grid-column: span 1 !important; } }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default EnquirySection;
