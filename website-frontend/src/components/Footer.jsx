"use client";
import React, { useState, useEffect } from 'react';
import { fetchFooter } from "../services/api";
import EditableSection from "./Editable/EditableSection";
import EditableText from "./Editable/EditableText";

export default function Footer() {
  const [data, setData] = useState(null);
  
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/details/')) {
            const slug = window.location.pathname.split('/').filter(Boolean).pop();
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

  const contact = data?.contact || {
    heading: "CONTACT US",
    address1: "Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India",
    address2: "Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India",
    phone1: "+91-8527830194",
    phone2: "+91-9810939319",
    email: "info@dadumedicalcentre.com"
  };

  const disclaimer = data?.disclaimer || "Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.";
  
  const branding = data?.branding || {
    logo: "https://res.cloudinary.com/dseixl6px/image/upload/v1777702974/dmc-trichology/ecj7tvcjxbkqhzixfdql.png",
    aboutText: "One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures."
  };

  const newsletter = data?.newsletter || {
    heading: "Stay Connected With Expert Care Support",
    description: "We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.",
    placeholder: "Your Email Adress",
    buttonText: "Submit",
    checkboxLabel: "Subscribe For Health Tips & Updates"
  };

  const socials = (data?.socials || []).length > 0 ? data.socials : [
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png", url: "#" }
  ];

  const bottomFooter = data?.bottomFooter || {
    copyright: "© 2024 . All Rights Reserved.",
    termsText: "Terms And Condition",
    termsLink: "#",
    privacyText: "Privacy Policy",
    privacyLink: "#"
  };

  return (
    <EditableSection sectionId="footer-section" label="Footer Section">
      <footer style={{ backgroundColor: '#FEF9F1', position: 'relative', overflow: 'hidden' }}>
        
        {/* Top Footer Section (Beige) */}
        <div style={{ padding: '80px 5% 180px 5%', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            
            {/* Dynamic Columns */}
            {columns.map((col, cIdx) => (
              <div key={cIdx}>
                <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>
                  <EditableText sectionId="footer-section" fieldPath={`columns.${cIdx}.title`} tag="span">
                    {col.title}
                  </EditableText>
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
            <div style={{ position: 'relative' }}>
              <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>
                <EditableText sectionId="footer-section" fieldPath="contact.heading" tag="span">
                  {contact.heading}
                </EditableText>
              </h4>
              <div style={{ color: '#444', fontSize: '14px', lineHeight: '1.8' }}>
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
        <div style={{ backgroundColor: '#000', padding: '0 5% 0 5%', position: 'relative' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '100px' }}>

            {/* Left Side: Logo & About */}
            <div style={{ flex: '1', minWidth: '400px', paddingTop: '80px', paddingBottom: '60px', display: 'flex', alignItems: 'center', gap: '30px' }}>
              <img
                src={branding.logo}
                alt="logo"
                style={{ width: '180px', flexShrink: 0 }}
              />
              <div>
                <h5 style={{ color: '#fff', fontSize: '14px', letterSpacing: '1.2px', marginBottom: '12px', fontWeight: '500', fontFamily: "'Marcellus', serif" }}>ABOUT DMC TRICHOLOGY</h5>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', maxWidth: '380px', lineHeight: '1.6', marginBottom: '20px' }}>
                  <EditableText sectionId="footer-section" fieldPath="branding.aboutText" tag="span">{branding.aboutText}</EditableText>
                </p>

                {/* Social Icons */}
                <div style={{ display: 'flex', gap: '15px' }}>
                  {socials.map((social, i) => (
                    <a key={i} href={social.url} className="social-icon-link" style={{ textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      <img src={social.icon} alt="social" style={{ width: '32px', transition: 'all 0.3s ease' }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Overlap Card */}
            <div style={{
              flex: '1',
              minWidth: '350px',
              maxWidth: '750px',
              marginTop: '-160px',
              zIndex: '10'
            }}>
              <div style={{
                backgroundColor: '#FEF9F1',
                borderRadius: '40px',
                padding: '60px 50px',
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
                  <div style={{
                    display: 'flex',
                    backgroundColor: '#000',
                    borderRadius: '50px',
                    padding: '0',
                    marginBottom: '20px',
                    alignItems: 'center'
                  }}>
                    <input
                      type="email"
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
                      type="submit"
                      disabled={loading}
                      style={{ 
                        backgroundColor: '#fff', 
                        color: '#000', 
                        border: 'revert', 
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
                      <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777622110/dmc-trichology/mzd4ynevgozuwiehhwah.png" alt="email" style={{ width: '24px' }} />
                    </button>
                  </div>

                  {/* Subscription Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <a href={`tel:${contact.phone1.replace(/[^+\d]/g, '')}`} className="premium-footer-pill" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}>
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png" alt="phone" style={{ width: '32px' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1C' }}>{contact.phone1}</span>
                  </a>
                  <a href={`mailto:${contact.email.toLowerCase()}`} className="premium-footer-pill" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}>
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777703175/dmc-trichology/vj4qbxtxftqzqslowwgd.png" alt="arrow" style={{ width: '32px' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1C1C1C' }}>{contact.email.toUpperCase()}</span>
                  </a>
                </div>

                {/* Disclaimer Area - Moved Inside Card Footer to prevent overlap */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', padding: '20px 0', margin: '20px 0' }}>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
                    <strong>Disclaimer:</strong> <EditableText sectionId="footer-section" fieldPath="disclaimer" tag="span">{disclaimer}</EditableText>
                  </p>
                </div>

                {/* Card Footer Links */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#777' }}>
                  <span><EditableText sectionId="footer-section" fieldPath="bottomFooter.copyright" tag="span">{bottomFooter.copyright}</EditableText></span>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <a href={bottomFooter.termsLink} style={{ color: '#1C1C1C', textDecoration: 'none' }}>
                      <EditableText sectionId="footer-section" fieldPath="bottomFooter.termsText" tag="span">{bottomFooter.termsText}</EditableText>
                    </a>
                    <span>|</span>
                    <a href={bottomFooter.privacyLink} style={{ color: '#1C1C1C', textDecoration: 'none' }}>
                      <EditableText sectionId="footer-section" fieldPath="bottomFooter.privacyText" tag="span">{bottomFooter.privacyText}</EditableText>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .social-icon-link:hover img {
            transform: translateY(-5px) scale(1.15);
            filter: brightness(1.2);
          }
          .premium-footer-link {
            transition: color 0.2s ease-in-out;
          }
          .premium-footer-link:hover {
            color: #C8A45D !important;
          }
          .premium-footer-pill:hover {
            transform: scale(1.04);
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 992px) {
            footer > div { padding: 40px 5% !important; }
            div[style*="marginTop: -120px"] { margin-top: 0 !important; }
            div[style*="justifyContent: space-between"] { justify-content: center !important; text-align: center; }
          }
        `}</style>
      </footer>
    </EditableSection>
  );
}
