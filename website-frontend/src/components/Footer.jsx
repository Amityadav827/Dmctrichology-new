"use client";
import React, { useState, useEffect } from 'react';
import { fetchFooter } from "../services/api";
import EditableSection from "./Editable/EditableSection";
import EditableText from "./Editable/EditableText";

export default function Footer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchFooter();
      if (res?.success) {
        setData(res.data);
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

  const columns = data?.columns || [
    {
      title: "HAIR TRANSPLANT",
      links: [
        { label: "FUE Hair Transplant", url: "#" },
        { label: "DHI Hair Transplant", url: "#" },
        { label: "Hair Restoration", url: "#" },
        { label: "Beard Transplant", url: "#" },
        { label: "Moustache Transplant", url: "#" },
        { label: "Eyebrow Transplant", url: "#" }
      ]
    },
    {
      title: "HAIR TREATMENTS",
      links: [
        { label: "PRP Therapy", url: "#" },
        { label: "GFC Therapy", url: "#" },
        { label: "QR 678®", url: "#" },
        { label: "Meso Therapy", url: "#" },
        { label: "Cyclical Therapy", url: "#" },
        { label: "Low-Level Laser Therapy", url: "#" }
      ]
    }
  ];

  const contact = data?.contact || {
    heading: "CONTACT US",
    address1: "C-2/13, Ashok Vihar Phase II,",
    address2: "Delhi, 110052",
    phone1: "+91 91191 19011",
    phone2: "+91 91191 19012",
    email: "info@dmctrichology.com"
  };

  const disclaimer = data?.disclaimer || "Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.";
  
  const branding = data?.branding || {
    logo: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/logo-main.png",
    aboutText: "One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures."
  };

  const newsletter = data?.newsletter || {
    heading: "Stay Connected With Expert Care Support",
    description: "We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.",
    placeholder: "Your Email Adress",
    buttonText: "Submit",
    checkboxLabel: "Subscribe For Health Tips & Updates"
  };

  const socials = data?.socials || [
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777611843/dmc-trichology/vk680d2gvewscitof9p0.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777611843/dmc-trichology/b05aycl6d1oflyv7m2y6.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777611843/dmc-trichology/l55v89cl22rxtk5qivp8.png", url: "#" },
    { icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777611843/dmc-trichology/n5u08cl22rxtk5qivp8.png", url: "#" }
  ];

  const bottomFooter = data?.bottomFooter || {
    copyright: "© DMC TRICHOLOGY. ALL RIGHTS RESERVED.",
    termsText: "Terms And Condition",
    privacyText: "Privacy Policy"
  };

  return (
    <EditableSection sectionId="footer-section" label="Footer Section">
      <footer style={{ backgroundColor: '#FEF9F1', position: 'relative', overflow: 'hidden' }}>
        
        {/* Top Footer Section (Beige) */}
        <div style={{ padding: '80px 5% 60px 5%', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            
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
                  <br />
                  <EditableText sectionId="footer-section" fieldPath="contact.address2" tag="span">{contact.address2}</EditableText>
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.phone1" tag="span">{contact.phone1}</EditableText>,
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.phone2" tag="span">{contact.phone2}</EditableText>
                </p>
                <p>
                  <EditableText sectionId="footer-section" fieldPath="contact.email" tag="span">{contact.email}</EditableText>
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer Area */}
          <div style={{ width: '50%', marginLeft: 'auto', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '25px 0', margin: '0 0 0 auto' }}>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', textAlign: 'right' }}>
              <strong>Disclaimer:</strong> <EditableText sectionId="footer-section" fieldPath="disclaimer" tag="span">{disclaimer}</EditableText>
            </p>
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
              marginTop: '-120px',
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
                    placeholder={newsletter.placeholder}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      padding: '12px 25px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button style={{ 
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
                    cursor: 'pointer'
                  }}>
                    <EditableText sectionId="footer-section" fieldPath="newsletter.buttonText" tag="span">{newsletter.buttonText}</EditableText>
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777622110/dmc-trichology/mzd4ynevgozuwiehhwah.png" alt="email" style={{ width: '24px' }} />
                  </button>
                </div>

                {/* Subscription Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '35px' }}>
                  <input type="checkbox" id="subscribe" style={{ cursor: 'pointer' }} />
                  <label htmlFor="subscribe" style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }}>
                    <EditableText sectionId="footer-section" fieldPath="newsletter.checkboxLabel" tag="span">{newsletter.checkboxLabel}</EditableText>
                  </label>
                </div>

                {/* Contact Info Pills */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png" alt="phone" style={{ width: '32px' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1C' }}>{contact.phone1}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777703175/dmc-trichology/vj4qbxtxftqzqslowwgd.png" alt="arrow" style={{ width: '32px' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1C1C1C' }}>{contact.email}</span>
                  </div>
                </div>

                {/* Card Footer Links */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#777' }}>
                  <span><EditableText sectionId="footer-section" fieldPath="bottomFooter.copyright" tag="span">{bottomFooter.copyright}</EditableText></span>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="#" style={{ color: '#1C1C1C', textDecoration: 'none' }}>
                      <EditableText sectionId="footer-section" fieldPath="bottomFooter.termsText" tag="span">{bottomFooter.termsText}</EditableText>
                    </a>
                    <span>|</span>
                    <a href="#" style={{ color: '#1C1C1C', textDecoration: 'none' }}>
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
