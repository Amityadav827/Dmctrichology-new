"use client";
import { useEffect } from 'react';
import { fetchTopBar } from '../services/api';
import { useBuilder } from '../context/BuilderContext';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const SocialGlyph = ({ name }) => {
  const socialName = String(name || '').toLowerCase();
  const commonProps = {
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    className: 'social-icon-glyph',
  };

  if (socialName === 'telegram') {
    return (
      <svg {...commonProps}>
        <path d="M21.5 4.5 3.1 11.6c-1 .4-1 1.8.1 2.1l4.5 1.4 1.7 5c.3.9 1.5 1.1 2.1.4l2.5-2.9 4.7 3.4c.8.6 1.9.1 2.1-.9l3-14.1c.2-1.1-.8-1.9-1.8-1.5Zm-4.4 4.1-7.2 6.5-.4 3.1-1.1-3.5 8.7-6.1Z" fill="currentColor" />
      </svg>
    );
  }

  if (socialName === 'instagram') {
    return (
      <svg {...commonProps}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" ry="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (socialName === 'facebook') {
    return (
      <svg {...commonProps}>
        <path d="M14.2 8.1h2V4.7c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.2v2.9H5v3.8h3.2v7.1h3.9v-7.1h3l.6-3.8h-3.6V10c0-1.1.3-1.9 2.1-1.9Z" fill="currentColor" />
      </svg>
    );
  }

  if (socialName === 'youtube') {
    return (
      <svg {...commonProps}>
        <path d="M21.3 7.7c-.2-.9-.9-1.6-1.8-1.8C17.9 5.5 12 5.5 12 5.5s-5.9 0-7.5.4c-.9.2-1.6.9-1.8 1.8-.4 1.6-.4 4.8-.4 4.8s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15.4V9.6l5.2 2.9L10 15.4Z" fill="currentColor" />
      </svg>
    );
  }

  if (socialName === 'linkedin') {
    return (
      <svg {...commonProps}>
        <path d="M6.8 8.8H3.5v10.7h3.3V8.8ZM5.2 7.3c1.1 0 1.9-.8 1.9-1.8 0-1.1-.8-1.8-1.9-1.8s-1.9.8-1.9 1.8.8 1.8 1.9 1.8Zm14.3 12.2v-5.9c0-3.2-1.7-4.7-4-4.7-1.8 0-2.7 1-3.1 1.7V8.8H9.1v10.7h3.3v-5.3c0-1.4.3-2.8 2-2.8s1.8 1.6 1.8 2.9v5.2h3.3Z" fill="currentColor" />
      </svg>
    );
  }

  return null;
};

const supportedSocialGlyphs = new Set(['telegram', 'instagram', 'facebook', 'youtube', 'linkedin']);

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
    const socialName = String(social.name || '').toLowerCase();
    if (supportedSocialGlyphs.has(socialName)) return <SocialGlyph name={socialName} />;

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
              <EditableText sectionId="topbar" fieldPath="announcementText" tag="span" className="topbar-contact-item" style={{ color: '#ffffff', fontWeight: '500' }}>
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
