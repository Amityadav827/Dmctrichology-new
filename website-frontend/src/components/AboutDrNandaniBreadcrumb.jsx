"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNandaniBreadcrumb({ data = {} }) {
  const {
    parentLabel = "Home",
    parentUrl = "/",
    currentPageText = "Hair Specialist in Delhi",
    backgroundColor = "#f8f9fa"
  } = data;

  return (
    <EditableSection sectionId="about-nandani-breadcrumb" label="Dr Nandini Breadcrumb">
      <div 
        className="dr-nandani-breadcrumb-bar"
        style={{
          backgroundColor: backgroundColor || '#f8f9fa',
          padding: '12px 5%',
          borderBottom: '1px solid #eaeaea',
          fontSize: '12.5px',
          fontFamily: "'Lato', 'Inter', sans-serif",
          letterSpacing: '0.03em',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1350px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a 
            href={parentUrl}
            style={{
              color: '#3b5998',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e4b753'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#3b5998'}
          >
            <EditableText sectionId="about-nandani-breadcrumb" fieldPath="parentLabel">
              {parentLabel}
            </EditableText>
          </a>
          <span style={{ color: '#cbd5e1', fontSize: '11px', userSelect: 'none' }}>&gt;</span>
          <span style={{ color: '#475569', fontWeight: '500' }}>
            <EditableText sectionId="about-nandani-breadcrumb" fieldPath="currentPageText">
              {currentPageText}
            </EditableText>
          </span>
        </div>
      </div>
    </EditableSection>
  );
}

