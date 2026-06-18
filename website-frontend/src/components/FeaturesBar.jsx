"use client";

import React, { useState, useEffect } from 'react';
import { fetchMarqueeFeatures } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const defaultItems = [
  { title: 'At-Home Sessions', icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/dujziywmelzwixisgvyb.png', link: '', enabled: true },
  { title: 'Dermatologist Monitored', icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/rhqehubr894icsuzfcew.png', link: '', enabled: true },
  { title: 'Shark Tank Approved', icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/gqnszoyafmildmq6l9mm.png', link: '', enabled: true },
  { title: 'US FDA Approved', icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/eqmyy5zthf9zi92xyvxm.png', link: '', enabled: true },
  { title: 'Quick & Lasting Results', icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/oihmmdhj7lbltqp9qgrj.png', link: '', enabled: true },
  { title: '100% Safe', icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/pdc64p00mfiv0080ippb.png', link: '', enabled: true }
];

export default function FeaturesBar() {
  const [data, setData] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchMarqueeFeatures().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  // Only fallback to defaults when data === null (not loaded yet)
  const safeItems = Array.isArray(data?.items) ? data.items : null;
  const activeItems = (safeItems && safeItems.length > 0)
    ? safeItems.filter(item => item.enabled !== false)
    : defaultItems;

  const speed = data?.marqueeSpeed || 30;
  const pauseOnHover = data?.pauseOnHover !== false;
  const bgColor = data ? (data.backgroundColor || 'transparent') : 'transparent';
  const paddingTop = data ? (data.paddingTop || '60px') : '60px';
  const paddingBottom = data ? (data.paddingBottom || '60px') : '60px';

  // Duplicate for seamless infinite loop — need at least 2 sets
  const displayItems = activeItems.length > 0
    ? [...activeItems, ...activeItems]
    : [];

  const marqueeStyle = {
    display: 'inline-flex',
    gap: '30px',
    animation: `marquee ${speed}s linear infinite`,
    animationPlayState: paused ? 'paused' : 'running',
  };

  return (
    <EditableSection sectionId="marquee-features" label="Marquee Features">
      <section
        className="features-bar"
        style={{
          padding: `${paddingTop} 0 ${paddingBottom} 0`,
          backgroundColor: bgColor,
          overflow: 'hidden'
        }}
      >
        <div
          className="marquee-container"
          style={{ width: '100%', overflow: 'hidden', padding: '16px 0' }}
          onMouseEnter={() => pauseOnHover && setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="marquee-content" style={marqueeStyle}>
            {displayItems.map((item, index) => (
              <div
                key={index}
                className="marquee-card"
                style={{
                  flex: '0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#FFFFFF',
                  boxShadow: '0px 4px 12px 0px #00000014',
                  borderRadius: '14px',
                  padding: '16px 26px',
                  marginRight: '24px'
                }}
              >
                <img
                  src={item.icon}
                  alt={item.title || `Feature ${(index % activeItems.length) + 1}`}
                  className="marquee-card-icon"
                  style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }}
                />
                {item.title && (
                  <span
                    className="marquee-card-text"
                    style={{
                      fontFamily: "'Marcellus', serif",
                      fontSize: '15px',
                      color: '#111111',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3
                    }}
                  >
                    {item.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 1199px) {
            .features-bar {
              padding-top: 44px !important;
              padding-bottom: 44px !important;
            }
            .marquee-content {
              gap: 20px !important;
            }
            .marquee-card {
              margin-right: 18px !important;
              padding: 14px 22px !important;
            }
          }
          @media (max-width: 767px) {
            .features-bar {
              padding-top: 34px !important;
              padding-bottom: 34px !important;
            }
            .marquee-card {
              margin-right: 12px !important;
              padding: 12px 18px !important;
              gap: 10px !important;
            }
            .marquee-card-icon {
              width: 34px !important;
              height: 34px !important;
            }
            .marquee-card-text {
              font-size: 14px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
