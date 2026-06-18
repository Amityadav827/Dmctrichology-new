"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchFooter } from "../services/api";
import EditableSection from "./Editable/EditableSection";
import EditableText from "./Editable/EditableText";
import { extractServiceSlugFromPath } from "../utils/serviceRoutes";

const hasValue = (value) => typeof value === 'string' && value.trim() && value.trim() !== '#';

const socialIconByName = {
  facebook: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962108233-jkidxsr5nbpwq7y7x0x0.png",
  instagram: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962107675-pzzrzqodtujxvlktyk2s.png",
  youtube: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962109429-dgkcwru8nqurjw7f1lz6.png",
};

const defaultSocialLinks = {
  facebook: "https://www.facebook.com/dmctrichology/",
  instagram: "https://www.instagram.com/dmctrichology/",
  youtube: "https://www.youtube.com/dmctrichology",
};

const getSettingsSocials = (links = {}) => (
  ['facebook', 'instagram', 'youtube']
    .map((name) => ({ name, icon: socialIconByName[name], url: hasValue(links[name]) ? links[name] : defaultSocialLinks[name] }))
);

export default function Footer({ siteSettings }) {
  const [data, setData] = useState(null);
  
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Footer link columns: accordion on mobile (first column open by default)
  const [openCols, setOpenCols] = useState({ 0: true });
  const toggleCol = (key) => setOpenCols((p) => ({ ...p, [key]: !p[key] }));

  // Success/Error toast auto-hide timer after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmitNewsletter = async (e) => {
    e.preventDefault();
    if (loading) return;

    setToast(null);

    // Validation
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setToast({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    if (!subscribeToUpdates) {
      setToast({ message: "Please accept health tips & updates subscription.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : 'https://dmctrichology-1.onrender.com/api');

      const response = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          subscribedToUpdates: subscribeToUpdates
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setToast({ message: "Thank you for subscribing!", type: "success" });
        setEmail('');
        setSubscribeToUpdates(false);
      } else {
        setToast({ message: resData.message || "Something went wrong. Please try again.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchFooter();
      if (res?.success) {
        let finalData = { ...res.data };
        
        // Override with Service Details CTA if on a details page
        try {
          if (typeof window !== 'undefined') {
            const slug = extractServiceSlugFromPath(window.location.pathname);
            if (slug) {
              const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
              const API_BASE = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : 'https://dmctrichology-1.onrender.com/api');
              const overrideRes = await fetch(`${API_BASE}/service-details/${slug}`);
              if (overrideRes.ok) {
                const sJson = await overrideRes.json();
                if (sJson.success && sJson.data?.footerCta) {
                  const { heading, description, emailPlaceholder, buttonText } = sJson.data.footerCta;
                  if (heading || description || emailPlaceholder || buttonText) {
                    finalData.newsletter = {
                      ...(finalData.newsletter || {}),
                      ...(heading ? { heading } : {}),
                      ...(description ? { description } : {}),
                      ...(emailPlaceholder ? { placeholder: emailPlaceholder } : {}),
                      ...(buttonText ? { buttonText } : {})
                    };
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error("Failed to load footer overrides:", err);
        }

        setData(finalData);
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === "footer-section") {
        const { fieldPath, value } = e.detail;
        setData((prev) => {
          if (!prev) return prev;
          const newData = { ...prev };
          if (fieldPath.includes(".")) {
            const parts = fieldPath.split(".");
            let curr = newData;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = value;
          } else {
            newData[fieldPath] = value;
          }
          return newData;
        });
      }
    };

    window.addEventListener("cms-update", handleCmsUpdate);
    return () => window.removeEventListener("cms-update", handleCmsUpdate);
  }, []);

  if (!data?.enabled && data !== null) return null;

  // FALLBACKS TO EXACT ORIGINAL DATA AS REQUESTED
  const columns = (data?.columns || []).length > 0 ? data.columns : [
    {
      title: "HAIR TRANSPLANT",
      links: [
        { id: "ht1", label: "Hair Transplant In Delhi", url: "#" },
        { id: "ht2", label: "Hair Transplant Cost In Delhi", url: "#" },
        { id: "ht3", label: "FUE Hair Transplant", url: "#" },
        { id: "ht4", label: "Body Hair Transplant", url: "#" },
        { id: "ht5", label: "Beard Hair Transplant", url: "#" },
        { id: "ht6", label: "Women Hair Transplant", url: "#" },
        { id: "ht7", label: "Repair Hair Transplant", url: "#" },
        { id: "ht8", label: "DMC – Golden Touch", url: "#" },
        { id: "ht9", label: "Hair Transplant In India", url: "#" },
        { id: "ht10", label: "Hair Transplant Cost In India", url: "#" }
      ]
    },
    {
      title: "HAIR TREATMENTS",
      links: [
        { id: "tr1", label: "DMC-Mesogrow", url: "#" },
        { id: "tr2", label: "DMC- Root Restore therapy®", url: "#" },
        { id: "tr3", label: "DMC- Advance HGP®", url: "#" },
        { id: "tr4", label: "DMC-Advanced HGP 2.0 ®", url: "#" },
        { id: "tr5", label: "DMC- Keravive Hair", url: "#" },
        { id: "tr6", label: "DMC- Hair Rituals", url: "#" },
        { id: "tr7", label: "GFC Hair Restoration", url: "#" }
      ]
    }
  ];

  const footerContact = data?.contact || {};
  const contact = {
    heading: "CONTACT US",
    address1: "Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India",
    address2: "Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India",
    phone1: "+91-8527830194",
    phone2: "+91-9810939319",
    email: "info@dadumedicalcentre.com",
    ...footerContact,
    phone1: hasValue(footerContact.phone1) ? footerContact.phone1 : (siteSettings?.phone1 || "+91-8527830194"),
    phone2: hasValue(footerContact.phone2) ? footerContact.phone2 : (siteSettings?.phone2 || "+91-9810939319"),
    email: hasValue(footerContact.email) ? footerContact.email : (siteSettings?.email || "info@dadumedicalcentre.com"),
    address1: hasValue(footerContact.address1) ? footerContact.address1 : (siteSettings?.address || "Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India"),
  };

  const disclaimer = data?.disclaimer || "Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.";
  
  const branding = data?.branding || {
    logo: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/ecj7tvcjxbkqhzixfdql.png",
    aboutText: "One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures."
  };

  const newsletter = data?.newsletter || {
    heading: "Stay Connected With Expert Care Support",
    description: "We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.",
    placeholder: "Your Email Address",
    buttonText: "Submit",
    checkboxLabel: "Subscribe For Health Tips & Updates"
  };

  const socials = [
    { name: "facebook", icon: socialIconByName.facebook, url: defaultSocialLinks.facebook },
    { name: "instagram", icon: socialIconByName.instagram, url: defaultSocialLinks.instagram },
    { name: "youtube", icon: socialIconByName.youtube, url: defaultSocialLinks.youtube }
  ];

  const bottomFooter = data?.bottomFooter || {
    copyright: "© 2024 . All Rights Reserved.",
    termsText: "Terms And Condition",
    termsLink: "/terms-conditions",
    privacyText: "Privacy Policy",
    privacyLink: "/privacy-policy"
  };

  const settingSocials = getSettingsSocials(siteSettings?.socialLinks);
  const resolvedBranding = {
    ...branding,
    logo: hasValue(branding.logo) ? branding.logo : (siteSettings?.logo || branding.logo),
  };
  const resolvedSocials = settingSocials.length > 0 ? settingSocials : socials;
  const resolvedBottomFooter = {
    ...bottomFooter,
    copyright: hasValue(bottomFooter.copyright) ? bottomFooter.copyright : (siteSettings?.footerCopyright || bottomFooter.copyright),
  };

  return (
    <EditableSection sectionId="footer-section" label="Footer Section">
      <footer style={{ backgroundColor: '#EDEEF8', position: 'relative', overflow: 'hidden' }}>
        
        {/* Top Footer Section (Beige) */}
        <div className="footer-top" style={{ padding: '80px 5% 180px 5%', maxWidth: '1400px', margin: '0 auto' }}>
          <div className="footer-top-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            
            {/* Dynamic Columns */}
            {columns.map((col, cIdx) => (
              <div key={cIdx} className={`footer-col${openCols[cIdx] ? ' open' : ''}`}>
                <h4 className="footer-col-title" onClick={() => toggleCol(cIdx)} style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>
                  <EditableText sectionId="footer-section" fieldPath={`columns.${cIdx}.title`} tag="span">
                    {col.title}
                  </EditableText>
                  <span className="footer-col-chevron" aria-hidden="true">
                    {openCols[cIdx]
                      ? <ChevronUp size={20} strokeWidth={2.5} />
                      : <ChevronDown size={20} strokeWidth={2.5} />}
                  </span>
                </h4>
                <ul className="footer-link-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(col.links || []).map((link, lIdx) => (
                    <li key={lIdx} style={{ marginBottom: '12px' }}>
                      <a href={link.url} style={{ color: '#444', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }}>
                        <EditableText sectionId="footer-section" fieldPath={`columns.${cIdx}.links.${lIdx}.label`} tag="span">
                          {link.label}
                        </EditableText>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div className={`footer-col${openCols['contact'] ? ' open' : ''}`} style={{ position: 'relative' }}>
              <h4 className="footer-col-title" onClick={() => toggleCol('contact')} style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>
                <EditableText sectionId="footer-section" fieldPath="contact.heading" tag="span">
                  {contact.heading}
                </EditableText>
                <span className="footer-col-chevron" aria-hidden="true">
                  {openCols['contact']
                    ? <ChevronUp size={20} strokeWidth={2.5} />
                    : <ChevronDown size={20} strokeWidth={2.5} />}
                </span>
              </h4>
              <div className="footer-col-content" style={{ color: '#444', fontSize: '14px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '15px' }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.address1" tag="span">{contact.address1}</EditableText>
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.address2" tag="span">{contact.address2}</EditableText>
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <a href={`tel:${contact.phone1.replace(/[^+\d]/g, '')}`} className="premium-footer-link" style={{ color: '#444', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}>
                    <EditableText sectionId="footer-section" fieldPath="contact.phone1" tag="span">{contact.phone1}</EditableText>
                  </a>,
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <a href={`tel:${contact.phone2.replace(/[^+\d]/g, '')}`} className="premium-footer-link" style={{ color: '#444', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}>
                    <EditableText sectionId="footer-section" fieldPath="contact.phone2" tag="span">{contact.phone2}</EditableText>
                  </a>
                </p>
                <p>
                  <a href={`mailto:${contact.email.toLowerCase()}`} className="premium-footer-link" style={{ color: '#444', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}>
                    <EditableText sectionId="footer-section" fieldPath="contact.email" tag="span">{contact.email}</EditableText>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section (Black) */}
        <div className="footer-bottom" style={{ backgroundColor: '#3B5998', padding: '0 5% 0 5%', position: 'relative' }}>
          <div className="footer-bottom-inner" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '100px' }}>

            {/* Left Side: Logo & About */}
            <div className="footer-brand-block" style={{ flex: '1', minWidth: '400px', paddingTop: '80px', paddingBottom: '60px', display: 'flex', alignItems: 'center', gap: '30px' }}>
              <img
                src={resolvedBranding.logo}
                alt="logo"
                style={{ width: '180px', flexShrink: 0 }}
              />
              <div>
                <h5 style={{ color: '#fff', fontSize: '14px', letterSpacing: '1.2px', marginBottom: '12px', fontWeight: '500', fontFamily: "'Marcellus', serif", textTransform: 'uppercase' }}>{siteSettings?.websiteName || 'ABOUT DMC TRICHOLOGY'}</h5>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', maxWidth: '380px', lineHeight: '1.6', marginBottom: '20px' }}>
                  <EditableText sectionId="footer-section" fieldPath="branding.aboutText" tag="span">{resolvedBranding.aboutText}</EditableText>
                </p>

                {/* Social Icons */}
                <div className="footer-socials" style={{ display: 'flex', gap: '15px' }}>
                  {resolvedSocials.map((social, i) => (
                    <a key={i} href={social.url} className="social-icon-link" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      <img src={social.icon} alt={social.name || "social"} style={{ width: '30px', transition: 'all 0.3s ease' }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Overlap Card */}
            <div className="footer-newsletter-wrap" style={{
              flex: '1',
              minWidth: '350px',
              maxWidth: '820px',
              marginTop: '-160px',
              zIndex: '10'
            }}>
              <div className="footer-newsletter-card" style={{
                backgroundColor: '#D3E1F3',
                borderRadius: '40px',
                padding: '60px 50px',
                border: '1px solid #ABBBCA',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: '32px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '20px', fontWeight: '400' }}>
                  <EditableText sectionId="footer-section" fieldPath="newsletter.heading" tag="span">{newsletter.heading}</EditableText>
                </h2>
                <p style={{ fontSize: '15px', color: '#555', marginBottom: '35px', lineHeight: '1.6' }}>
                  <EditableText sectionId="footer-section" fieldPath="newsletter.description" tag="span">{newsletter.description}</EditableText>
                </p>

                {/* Newsletter Input */}
                <form onSubmit={handleSubmitNewsletter}>
                  <div className="footer-newsletter-input-row" style={{
                    display: 'flex',
                    backgroundColor: '#3b5998',
                    borderRadius: '50px',
                    padding: '0',
                    marginBottom: '20px',
                    alignItems: 'center'
                  }}>
                    <input
                      type="email"
                      className="footer-newsletter-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={newsletter.placeholder}
                      disabled={loading}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        padding: '12px 25px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                    <button 
                      className="footer-submit-btn"
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '12px 12px 12px 24px', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <EditableText sectionId="footer-section" fieldPath="newsletter.buttonText" tag="span">{loading ? "Submitting..." : newsletter.buttonText}</EditableText>
                      <span className="footer-submit-arrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </button>
                  </div>

                  {/* Subscription Checkbox */}
                  <div className="footer-checkbox-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                    <input 
                      type="checkbox" 
                      id="subscribe" 
                      checked={subscribeToUpdates}
                      onChange={(e) => setSubscribeToUpdates(e.target.checked)}
                      style={{ cursor: 'pointer' }} 
                      disabled={loading}
                    />
                    <label htmlFor="subscribe" style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }}>
                      <EditableText sectionId="footer-section" fieldPath="newsletter.checkboxLabel" tag="span">{newsletter.checkboxLabel}</EditableText>
                    </label>
                  </div>
                </form>

                {/* Status message */}
                {toast && (
                  <div style={{
                    marginTop: '0px',
                    marginBottom: '20px',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '13px',
                    color: toast.type === 'success' ? '#1c5235' : '#742a2a',
                    backgroundColor: toast.type === 'success' ? '#eefdf5' : '#fff5f5',
                    border: toast.type === 'success' ? '1px solid #c6f6d5' : '1px solid #fed7d7',
                    fontFamily: 'Lato, sans-serif',
                    display: 'inline-block',
                    animation: 'fadeInUp 0.3s ease'
                  }}>
                    {toast.message}
                  </div>
                )}

                {/* Contact Info Pills */}
                <div className="footer-contact-pills" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <a href="tel:+919810939319" className="premium-footer-pill" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1C' }}>+91-9810939319</span>
                  </a>
                  <span className="footer-contact-separator" style={{ color: '#1C1C1C', fontSize: '16px', fontWeight: '600' }}>|</span>
                  <a href="mailto:info@dadumedicalcentre.com" className="premium-footer-pill" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1C1C1C' }}>info@dadumedicalcentre.com</span>
                  </a>
                </div>

                {/* Disclaimer Area - Moved Inside Card Footer to prevent overlap */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', padding: '20px 0', margin: '20px 0' }}>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    <strong>Disclaimer:</strong> <EditableText sectionId="footer-section" fieldPath="disclaimer" tag="span">{disclaimer}</EditableText>
                  </p>
                </div>

                {/* Card Footer Links */}
                <div className="footer-legal-row" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', fontSize: '13px', color: '#777' }}>
                  <div className="footer-legal-links" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                    <a href={resolvedBottomFooter.termsLink} style={{ color: '#1C1C1C', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      <EditableText sectionId="footer-section" fieldPath="bottomFooter.termsText" tag="span">{resolvedBottomFooter.termsText}</EditableText>
                    </a>
                    <span aria-hidden="true" style={{ color: '#cbd5e1' }}>|</span>
                    <a href={resolvedBottomFooter.privacyLink} style={{ color: '#1C1C1C', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      <EditableText sectionId="footer-section" fieldPath="bottomFooter.privacyText" tag="span">{resolvedBottomFooter.privacyText}</EditableText>
                    </a>
                  </div>
                  <span style={{ whiteSpace: 'nowrap' }}><EditableText sectionId="footer-section" fieldPath="bottomFooter.copyright" tag="span">{resolvedBottomFooter.copyright}</EditableText></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .footer-newsletter-input::placeholder {
            color: #ffffff !important;
            opacity: 0.78;
          }
          .social-icon-link:hover img {
            transform: translateY(-5px) scale(1.15);
            filter: brightness(1.2);
          }
          .premium-footer-link {
            transition: color 0.2s ease-in-out;
          }
          .footer-link-list li {
            margin-left: 0 !important;
          }
          .premium-footer-link:hover {
            color: #C8A45D !important;
          }
          .premium-footer-pill:hover {
            transform: scale(1.04);
          }
          .footer-submit-btn {
            transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          }
          .footer-submit-arrow {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #3b5998;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transform: rotate(0deg);
            transition: transform 0.3s ease;
          }
          .footer-submit-btn:hover {
            box-shadow: 0 10px 22px rgba(59, 89, 152, 0.18);
          }
          .footer-submit-btn:hover .footer-submit-arrow {
            transform: rotate(45deg);
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Footer accordion chevron — hidden on desktop (links always visible) */
          .footer-col-chevron { display: none; }

          @media (max-width: 992px) {
            .footer-top {
              padding: 56px 5% 72px !important;
            }
            .footer-top-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 34px !important;
            }
            .footer-bottom {
              padding: 0 5% 48px !important;
            }
            .footer-bottom-inner {
              gap: 36px !important;
              justify-content: center !important;
              align-items: stretch !important;
            }
            .footer-brand-block {
              min-width: 0 !important;
              width: 100%;
              padding-top: 52px !important;
              padding-bottom: 0 !important;
              justify-content: center;
            }
            .footer-newsletter-wrap {
              min-width: 0 !important;
              width: 100%;
              margin-top: 0 !important;
              max-width: 760px !important;
            }
            .footer-newsletter-card {
              padding: 42px 34px !important;
              border-radius: 32px !important;
            }
            .footer-legal-row {
              gap: 18px;
            }
          }
          @media (max-width: 767px) {
            .footer-top {
              padding: 44px 16px 48px !important;
              text-align: center;
            }
            .footer-top-grid {
              grid-template-columns: 1fr !important;
              gap: 0 !important;
            }
            .footer-top a,
            .footer-top p {
              overflow-wrap: anywhere;
            }
            /* ---- Footer accordion (mobile) ---- */
            .footer-col {
              border-bottom: 1px solid rgba(0, 0, 0, 0.08);
              text-align: left;
            }
            .footer-col .footer-col-title {
              cursor: pointer;
              display: flex !important;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
              margin-bottom: 0 !important;
              padding: 15px 2px !important;
              text-align: left;
            }
            .footer-col-chevron {
              display: inline-block;
              color: #3B5998;
              flex-shrink: 0;
            }
            .footer-col .footer-link-list,
            .footer-col .footer-col-content {
              max-height: 0 !important;
              overflow: hidden !important;
              transition: max-height 0.32s ease;
            }
            .footer-col.open .footer-link-list,
            .footer-col.open .footer-col-content {
              max-height: 1200px !important;
              padding-bottom: 14px !important;
            }
            .footer-col .footer-link-list li {
              text-align: left;
            }
            .footer-bottom {
              padding: 0 16px 36px !important;
            }
            .footer-bottom-inner {
              display: flex !important;
              flex-direction: column !important;
              gap: 28px !important;
            }
            .footer-brand-block {
              flex-direction: column !important;
              text-align: center;
              gap: 20px !important;
              padding-top: 42px !important;
            }
            .footer-brand-block > img {
              width: 140px !important;
            }
            .footer-socials img {
              width: 30px !important;
            }
            .footer-socials {
              justify-content: center;
              flex-wrap: wrap;
            }
            .footer-newsletter-card {
              padding: 30px 20px !important;
              border-radius: 26px !important;
            }
            .footer-newsletter-card h2 {
              font-size: 26px !important;
              line-height: 1.25 !important;
              margin-bottom: 14px !important;
            }
            .footer-newsletter-card h2 + p {
              font-size: 16px !important;
            }
            .footer-newsletter-input-row {
              flex-direction: column;
              border-radius: 24px !important;
              padding: 14px !important;
              gap: 10px;
            }
            .footer-newsletter-input-row input {
              width: 100%;
              text-align: center;
            }
            .footer-submit-btn {
              width: 100%;
              justify-content: center;
            }
            .footer-checkbox-row {
              align-items: flex-start !important;
              text-align: left;
            }
            .footer-contact-pills {
              flex-direction: row !important;
              align-items: center;
              gap: 8px !important;
            }
            .footer-contact-pills a {
              max-width: 100%;
              justify-content: center;
              overflow-wrap: anywhere;
            }
            .footer-contact-pills span {
              font-size: 13px !important;
              overflow-wrap: anywhere;
            }
            .footer-legal-row {
              flex-direction: column;
              align-items: center;
              justify-content: center !important;
              text-align: center;
            }
            .footer-legal-row > div {
              justify-content: center;
              flex-wrap: wrap;
            }
            .footer-legal-links {
              align-items: center !important;
            }
          }
          @media (max-width: 360px) {
            .footer-newsletter-card {
              padding: 26px 16px !important;
            }
            .footer-brand-block > img {
              width: 124px !important;
            }
          }
        `}</style>
      </footer>
    </EditableSection>
  );
}
