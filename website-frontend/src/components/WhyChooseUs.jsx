"use client";
import React, { useState, useEffect } from 'react';
import { fetchWhyChooseUs } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const defaultFeatures = [
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png', title: 'Natural Results', desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.', side: 'left', enabled: true },
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png', title: 'Customized Care', desc: 'Every Hair Loss Condition Is Different And Also Unique.', side: 'left', enabled: true },
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png', title: 'Reduce Surgical', desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.', side: 'right', enabled: true },
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png', title: 'Complete Aftercare', desc: 'Our Team Supports You From Consultation To Full Hair Growth.', side: 'right', enabled: true }
];

const WhyChooseUs = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchWhyChooseUs().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  // Section level enable/disable
  if (data && data.enabled === false) return null;

  // Fallbacks only when data === null (not yet loaded from DB)
  const title = data ? (data.title || '') : 'Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi';
  const subtitle = data ? (data.subtitle || '') : 'Best Hair Graft Clinic';
  const centralImage = data
    ? (data.centralImage || '')
    : 'https://res.cloudinary.com/dseixl6px/image/upload/v1777550637/dmc-trichology/mprq5pm7g2utm2olrnj1.png';

  // Always safe — never crash on .map
  const safeFeatures = Array.isArray(data?.features) ? data.features : null;
  const activeFeatures = (safeFeatures && safeFeatures.length > 0)
    ? safeFeatures.filter(f => f.enabled !== false)
    : defaultFeatures;

  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  // Find original index in data.features for persistence mapping
  const getOriginalIndex = (feat) => {
    if (!data?.features) return defaultFeatures.indexOf(feat);
    // Find by identity or title/desc match to be safe
    const idx = data.features.findIndex(f => f === feat || (f.title === feat.title && f.desc === feat.desc));
    return idx !== -1 ? idx : data.features.indexOf(feat);
  };

  // Render a single feature card — design identical to original
  const renderCard = (feat, sideIndex) => {
    const realIndex = getOriginalIndex(feat);
    return (
      <div className="card-item" style={{
        backgroundColor: '#000',
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        width: '400px',
        color: '#fff',
        textAlign: 'left',
        zIndex: 2,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          backgroundColor: '#FEF0D7',
          borderRadius: '16px',
          padding: '12px',
          minWidth: '85px',
          height: '85px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={feat.icon} alt={feat.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
        </div>
        <div>
          <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', marginBottom: '8px', fontWeight: 400, color: '#FEF0D7' }}>
            <EditableText sectionId="why-choose-us" fieldPath={`features.${realIndex}.title`} tag="span">
              {feat.title}
            </EditableText>
          </h4>
          <p style={{ fontFamily: "'Marcellus', serif", fontSize: '13px', lineHeight: '20px', color: '#FFFFFF' }}>
            <EditableText sectionId="why-choose-us" fieldPath={`features.${realIndex}.desc`} tag="span">
              {feat.desc}
            </EditableText>
          </p>
        </div>
      </div>
    );
  };

  // Split features by side (left/right) — max 2 each for the positioned layout
  const leftCards = activeFeatures.filter(f => f.side !== 'right').slice(0, 2);
  const rightCards = activeFeatures.filter(f => f.side === 'right').slice(0, 2);

  // Positions: left column top/bottom, right column top/bottom
  const leftPositions = [{ top: '150px' }, { top: '450px' }];
  const rightPositions = [{ top: '40px' }, { top: '340px' }];

  const sectionPadding = {
    paddingTop: data?.paddingTop || '0px',
    paddingBottom: data?.paddingBottom || '0px',
    backgroundColor: data?.backgroundColor || '#fff'
  };

  return (
    <EditableSection sectionId="why-choose-us" label="Why Choose Us">
      <section className="why-choose-us" style={{ ...sectionPadding, textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <img src={iconUrl} alt="icon" style={{ width: '50px', height: 'auto' }} />
          <EditableText sectionId="why-choose-us" fieldPath="subtitle" tag="span" className="section-subtitle">
            {subtitle}
          </EditableText>
        </div>

        <h2 className="section-title" style={{ maxWidth: '1000px', margin: '0 auto 100px', textAlign: 'center' }}>
          <EditableText sectionId="why-choose-us" fieldPath="title" tag="span">
            {title}
          </EditableText>
        </h2>

        <div style={{
          position: 'relative',
          maxWidth: '1300px',
          height: '650px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Central Image */}
          <div style={{
            width: '500px',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            position: 'relative'
          }}>
            <img src={centralImage} alt="Head Visualization" style={{ width: '100%', height: 'auto' }} />
          </div>

          {/* Left Cards */}
          {leftCards.map((feat, i) => (
            <div
              key={`left-${i}`}
              className={`pos-card-${i + 1}`}
              style={{ position: 'absolute', left: 0, ...(leftPositions[i] || { top: `${150 + i * 300}px` }) }}
            >
              {renderCard(feat, i)}
            </div>
          ))}

          {/* Right Cards */}
          {rightCards.map((feat, i) => (
            <div
              key={`right-${i}`}
              className={`pos-card-${i + 3}`}
              style={{ position: 'absolute', right: 0, ...(rightPositions[i] || { top: `${40 + i * 300}px` }) }}
            >
              {renderCard(feat, i)}
            </div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1200px) {
          .why-choose-us div[style*="height: 650px"] { height: auto !important; flex-direction: column !important; padding-bottom: 40px; }
          .pos-card-1, .pos-card-2, .pos-card-3, .pos-card-4 { position: relative !important; top: auto !important; left: auto !important; right: auto !important; margin-bottom: 20px; }
          .card-item { width: 90% !important; max-width: 400px; margin: 0 auto; }
        }
      `}} />
    </EditableSection>
  );
};

export default WhyChooseUs;
