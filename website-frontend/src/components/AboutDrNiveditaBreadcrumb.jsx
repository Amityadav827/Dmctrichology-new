"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaBreadcrumb({ data = {} }) {
  const {
    parentLabel = "Home",
    parentUrl = "/",
    currentPageText = "About Dr Nivedita Dadu",
    backgroundColor = "#f8f9fa"
  } = data;

  return (
    <EditableSection sectionId="about-nivedita-breadcrumb" label="Dr Nivedita Breadcrumb">
      <div
        className="dr-nivedita-breadcrumb-bar"
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
            <EditableText sectionId="about-nivedita-breadcrumb" fieldPath="parentLabel">
              {parentLabel}
            </EditableText>
          </a>
          <span style={{ color: '#cbd5e1', fontSize: '11px', userSelect: 'none' }}>&gt;</span>
          <span style={{ color: '#475569', fontWeight: '500' }}>
            <EditableText sectionId="about-nivedita-breadcrumb" fieldPath="currentPageText">
              {currentPageText}
            </EditableText>
          </span>
        </div>
      </div>
    </EditableSection>
  );
}
