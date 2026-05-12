"use client";
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchHeader } from '../services/api';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

import { useBuilder } from '../context/BuilderContext';

export default function Header() {
  const { isEditMode, siteConfig } = useBuilder();
  const [headerData, setHeaderData] = useState(null);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'header') {
      setHeaderData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    fetchHeader().then(data => {
      if(data && data.data) setHeaderData(data.data);
    });
  }, []);

  const logoUrl = headerData?.logoUrl || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png';
  const buttonText = headerData?.appointmentButtonText || 'Book Appointment';
  const buttonLink = headerData?.appointmentButtonLink || '#book';

  return (
    <EditableSection sectionId="header" label="Header">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link href="/" aria-label="Go to homepage">
              <img src={logoUrl} alt="DMC Trichology Logo" />
            </Link>
          </div>
          
          <Navbar cmsMenu={headerData?.menuItems} />

          <div className="header-right" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <a
              href={buttonLink}
              className="btn-primary header-appointment-btn"
              style={{ color: '#ffffff', borderRadius: '50px', padding: '10px 10px 10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
            >
              <EditableText sectionId="header" fieldPath="appointmentButtonText" tag="span" style={{ fontFamily: "'Marcellus', serif" }}>
                {buttonText}
              </EditableText>
              <div className="icon-circle btn-arrow-circle" style={{ width: '32px', height: '32px', backgroundColor: '#ffffff' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" className="btn-arrow-icon" style={{ width: '12px', height: '12px', objectFit: 'contain', filter: 'brightness(0)' }} />
              </div>
            </a>
          </div>
        </div>
      </header>
    </EditableSection>
  );
}
