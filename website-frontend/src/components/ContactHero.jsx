"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const ContactHero = ({ data }) => {
  const {
    title = "Contact Us",
    breadcrumbText = "Home / Contact Us",
    backgroundColor = "#F7F7F7",
    paddingTop = "80px",
    paddingBottom = "80px"
  } = data || {};

  return (
    <EditableSection sectionId="contact-hero" label="Contact Hero Banner">
      <section 
        className="contact-hero" 
        style={{ 
          backgroundColor, 
          paddingTop, 
          paddingBottom,
          textAlign: 'center' 
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 
            style={{ 
              fontFamily: "'Marcellus', serif", 
              fontSize: '48px', 
              color: '#111', 
              marginBottom: '15px',
              fontWeight: 400
            }}
          >
            <EditableText sectionId="contact-hero" fieldPath="title" tag="span">
              {title}
            </EditableText>
          </h1>
          <p 
            style={{ 
              fontFamily: "'Lato', sans-serif", 
              fontSize: '14px', 
              color: '#777', 
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            <EditableText sectionId="contact-hero" fieldPath="breadcrumbText" tag="span">
              {breadcrumbText}
            </EditableText>
          </p>
        </div>
      </section>
    </EditableSection>
  );
};

export default ContactHero;
