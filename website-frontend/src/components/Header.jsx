"use client";
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchHeader } from '../services/api';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function Header({ initialHeader, siteSettings }) {
  const [headerData, setHeaderData] = useState(initialHeader || null);
  const [headerState, setHeaderState] = useState('default');

  useEffect(() => {
    fetchHeader().then(data => {
      if (data && data.data) setHeaderData(data.data);
    });
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 120) {
        setHeaderState('default');
      } else if (currentScrollY < lastScrollY) {
        setHeaderState('sticky');
      } else {
        setHeaderState('hidden');
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoUrl = headerData?.logoUrl || siteSettings?.logo || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png';
  const buttonText = headerData?.appointmentButtonText || siteSettings?.appointmentButtonText || 'Book Appointment';
  const buttonLink = headerData?.appointmentButtonLink || '#book';
  const websiteName = siteSettings?.websiteName || 'DMC Trichology';

  return (
    <EditableSection sectionId="header" label="Header">
      <header className={`header header-${headerState}`}>
        <div className="header-container">
          <div className="logo">
            <Link href="/" aria-label="Go to homepage">
              <img src={logoUrl} alt={`${websiteName} Logo`} />
            </Link>
          </div>

          <Navbar cmsMenu={headerData?.menuItems} logoUrl={logoUrl} />

          <div className="header-right" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a
              href={buttonLink}
              className="btn-primary header-appointment-btn"
              style={{ color: '#ffffff', borderRadius: '50px', padding: '10px 10px 10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
            >
              <EditableText sectionId="header" fieldPath="appointmentButtonText" tag="span" style={{ fontFamily: "'Marcellus', serif" }}>
                {buttonText}
              </EditableText>
              <div className="icon-circle btn-arrow-circle" style={{ width: '32px', height: '32px', backgroundColor: '#ffffff' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" className="btn-arrow-icon" style={{ width: '12px', height: '12px', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)' }} />
              </div>
            </a>
          </div>
        </div>
      </header>
    </EditableSection>
  );
}
