"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import './AboutUsBanner.css';

const AboutUsBanner = ({ data = {} }) => {
  const {
    title = "About Us",
    breadcrumbText = "About Us",
    backgroundImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
  } = data;

  const bannerStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
  };

  return (
    <EditableSection sectionId="about-banner" label="About Us Banner">
      <section className="about-banner-premium" style={bannerStyle}>
        <div className="about-banner-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
