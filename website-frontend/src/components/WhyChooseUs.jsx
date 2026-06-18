"use client";
import React, { useState, useEffect } from 'react';
import { fetchWhyChooseUs } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const featureIconByTitle = {
  'natural results': '/icons/why-choose-us/natural-results.svg',
  'customized care': '/icons/why-choose-us/customized-care.svg',
  'reduce surgical': '/icons/why-choose-us/reduce-surgical.svg',
  'complete aftercare': '/icons/why-choose-us/complete-aftercare.svg'
};

const defaultFeatures = [
  { icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962123778-tcy9wy64djnagoimcfnx.png', title: 'Natural Results', desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.', side: 'left', enabled: true },
  { icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962122900-ecjlnpbmt8rk3ebxazva.png', title: 'Customized Care', desc: 'Every Hair Loss Condition Is Different And Also Unique.', side: 'left', enabled: true },
  { icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962125631-kganja8haq69bvurxro8.png', title: 'Reduce Surgical', desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.', side: 'right', enabled: true },
  { icon: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962125124-j8gecypsa2honobtknua.png', title: 'Complete Aftercare', desc: 'Our Team Supports You From Consultation To Full Hair Growth.', side: 'right', enabled: true }
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
  const fallbackCentralImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/mprq5pm7g2utm2olrnj1.png';
  const mobileCentralImage = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/graft-clinic-mobile.png';
  const centralImage = data?.centralImage?.trim() || fallbackCentralImage;

  // Always safe — never crash on .map
  const safeFeatures = Array.isArray(data?.features) ? data.features : null;
  const activeFeatures = (safeFeatures && safeFeatures.length > 0)
    ? safeFeatures.filter(f => f.enabled !== false)
    : defaultFeatures;

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
    const displayIcon = featureIconByTitle[String(feat.title || '').toLowerCase()] || feat.icon;
    return (
      <div className="card-item" style={{
        backgroundColor: '#3B5998',
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        width: '400px',
        color: '#fff',
        textAlign: 'left',
        zIndex: 2,
        boxShadow: '0 20px 40px rgba(59, 89, 152, 0.22)',
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}>
        <div style={{
          backgroundColor: '#E8EAF6',
          borderRadius: '16px',
          padding: '12px',
          minWidth: '85px',
          height: '85px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={displayIcon} alt={feat.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
        </div>
        <div>
          <h4 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', marginBottom: '8px', fontWeight: 400, color: '#FFFFFF' }}>
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
        <h2 className="section-title" style={{ maxWidth: '1000px', margin: '0 auto 100px !important', textAlign: 'center' }}>
          <EditableText sectionId="why-choose-us" fieldPath="title" tag="span">
            {title}
          </EditableText>
        </h2>

        <div className="why-choose-stage" style={{
          position: 'relative',
          maxWidth: '1300px',
          height: '650px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Central Image */}
          <div className="why-choose-center" tabIndex={0} aria-label="Show hair transplant benefits" style={{
            width: '500px',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            position: 'relative'
          }}>
            <picture>
              <source media="(max-width: 767px)" srcSet={mobileCentralImage} />
              <img src={centralImage} alt="Head Visualization" style={{ width: '100%', height: 'auto' }} />
            </picture>
          </div>

          {/* Left Cards */}
          {leftCards.map((feat, i) => (
            <div
              key={`left-${i}`}
              className={`feature-callout feature-callout-left pos-card-${i + 1}`}
              style={{ position: 'absolute', left: 0, ...(leftPositions[i] || { top: `${150 + i * 300}px` }) }}
            >
              {renderCard(feat, i)}
            </div>
          ))}

          {/* Right Cards */}
          {rightCards.map((feat, i) => (
            <div
              key={`right-${i}`}
              className={`feature-callout feature-callout-right pos-card-${i + 3}`}
              style={{ position: 'absolute', right: 0, ...(rightPositions[i] || { top: `${40 + i * 300}px` }) }}
            >
              {renderCard(feat, i)}
            </div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .why-choose-center {
          cursor: pointer;
          border-radius: 50%;
          outline: none;
        }

        .feature-callout {
          opacity: 1;
          pointer-events: auto;
        }

        .feature-callout-left {
          transform: translateX(0);
        }

        .feature-callout-right {
          transform: translateX(0);
        }

        .feature-callout:hover .card-item {
          transform: scale(1.05) translateY(-5px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.3) !important;
        }

        @media (max-width: 1200px) {
          .why-choose-us div[style*="height: 650px"] { height: auto !important; flex-direction: column !important; padding-bottom: 40px; }
          .pos-card-1, .pos-card-2, .pos-card-3, .pos-card-4 { position: relative !important; top: auto !important; left: auto !important; right: auto !important; margin-bottom: 20px; }
          .feature-callout { opacity: 1 !important; pointer-events: auto !important; }
          .card-item { width: 90% !important; max-width: 400px; margin: 0 auto; }
        }
        @media (max-width: 1199px) {
          .why-choose-us {
            padding-left: 4% !important;
            padding-right: 4% !important;
          }
          .why-choose-us .section-title {
            margin-bottom: 48px !important;
          }
          .why-choose-stage {
            gap: 20px;
          }
          .why-choose-center {
            width: min(420px, 72vw) !important;
            height: auto !important;
            order: -1;
          }
          .feature-callout {
            width: 100%;
          }
        }
        @media (max-width: 767px) {
          .why-choose-us {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          .why-choose-us .section-title {
            font-size: 26px !important;
            line-height: 1.12 !important;
            margin-bottom: 32px !important;
          }
          .why-choose-stage {
            padding-bottom: 0 !important;
          }
          .why-choose-center {
            width: min(300px, 86vw) !important;
          }
          .card-item {
            width: 100% !important;
            max-width: none !important;
            padding: 18px !important;
            gap: 14px !important;
            border-radius: 20px !important;
          }
          .card-item h4 {
            font-size: 21px !important;
          }
          .card-item p {
            font-size: 13px !important;
            line-height: 1.45 !important;
          }
        }
      `}} />
    </EditableSection>
  );
};

export default WhyChooseUs;
