"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsBanner.css';

const AboutUsBanner = ({ data = {} }) => {
  const {
    badgeText = "ABOUT DMC TRICHOLOGY",
    title = "About Us",
    breadcrumbText = "Home / About Us",
    backgroundImage = "",
    overlayOpacity = 0.5,
    overlayColor = "#000000",
    textAlignment = "center",
    spacingTop = "170px",
    spacingBottom = "100px"
  } = data;

  const bannerStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    paddingTop: spacingTop,
    paddingBottom: spacingBottom,
    textAlign: textAlignment,
  };

  const overlayStyle = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  };

  return (
    <EditableSection sectionId="about-banner" label="About Us Banner">
      <section className="about-banner-premium" style={bannerStyle}>
        <div className="about-banner-overlay" style={overlayStyle}></div>
        
        <div className="about-banner-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="about-banner-badge">
              <EditableText sectionId="about-banner" fieldPath="banner.badgeText">
                {badgeText}
              </EditableText>
            </div>
            
            <h1 className="about-banner-title">
              <EditableText sectionId="about-banner" fieldPath="banner.title">
                {title}
              </EditableText>
            </h1>
            
            <div className="about-banner-breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <span className="current">
                <EditableText sectionId="about-banner" fieldPath="banner.breadcrumbText">
                  {breadcrumbText}
                </EditableText>
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsBanner;
