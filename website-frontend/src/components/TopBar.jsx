"use client";
import { useEffect } from 'react';
import { fetchTopBar } from '../services/api';
import { useBuilder } from '../context/BuilderContext';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function TopBar({ initialTopBar }) {
  const { topBarCMS, setTopBarCMS } = useBuilder();

  useEffect(() => {
    // Background sync to ensure data is fresh
    fetchTopBar().then(data => {
      if(data && data.data) {
        setTopBarCMS(data.data);
      }
    });
  }, [setTopBarCMS]);

  const topBarData = topBarCMS || initialTopBar;

  const fallbackSettings = {
    phones: ['+91-8527830194', '+91-9810939319'],
    email: 'info@dadumedicalcentre.com',
    socials: [
      { name: 'telegram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png' },
      { name: 'instagram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png' },
      { name: 'facebook', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png' },
      { name: 'youtube', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png' },
      { name: 'linkedin', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png' }
    ]
  };

  const isVisible = topBarData ? topBarData.isVisible : true;
  const phones = topBarData ? [topBarData.phone1, topBarData.phone2].filter(Boolean) : fallbackSettings.phones;
  const email = topBarData ? topBarData.email : fallbackSettings.email;
  const announcementText = topBarData ? topBarData.announcementText : "";
  
  const socials = topBarData ? topBarData.socialLinks : fallbackSettings.socials;

  const renderIcon = (social) => {
    return <img src={social.iconUrl} alt={social.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />;
  };

  // Do not return null anymore. Use fallback data if API data isn't ready.
  // This prevents layout shift (CLS).
  if (!isVisible && topBarData !== null) return null;

  return (
    <EditableSection sectionId="topbar" label="Top Bar">
      <div className="topbar">
        <div className="topbar-left">
          {announcementText && (
            <>
              <EditableText sectionId="topbar" fieldPath="announcementText" tag="span" className="topbar-contact-item" style={{ color: '#E4B753', fontWeight: '500' }}>
                {announcementText}
              </EditableText>
              <span className="topbar-sep">|</span>
            </>
          )}
          {phones.map((phone, i) => (
            <span key={i} className="topbar-contact-item">
              <EditableText sectionId="topbar" fieldPath={`phone${i+1}`} tag="span">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="topbar-link">{phone}</a>
              </EditableText>
              {i < phones.length - 1 && <span className="topbar-sep">|</span>}
            </span>
          ))}
          <span className="topbar-sep">|</span>
          <EditableText sectionId="topbar" fieldPath="email" tag="span">
            <a href={`mailto:${email}`} className="topbar-link">{email}</a>
          </EditableText>
        </div>
        <div className="topbar-right">
          {socials.map((social, i) => (
            <a key={i} href={social.link} target="_blank" rel="noreferrer" className="social-icon">
              {renderIcon(social)}
            </a>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
