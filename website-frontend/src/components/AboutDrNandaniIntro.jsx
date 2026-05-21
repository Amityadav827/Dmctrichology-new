"use client";
import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function AboutDrNandaniIntro({ data = {} }) {
  const {
    heading = "Delhi's Premier Hair Specialist & Clinical Director",
    description = "<p>Dr. Nandani Dadu is highly regarded as one of India's finest hair restoration specialists, merging state-of-the-art US-FDA approved technologies with refined artistic precision. As the Clinical Director, she has spent over a decade perfecting custom trichological protocols that deliver exceptional, natural-looking hair density.</p><p>Her signature therapies combine advanced cellular growth treatments, high-density FUE transplants, and custom scalp rejuvenation programs designed uniquely for each patient's physiological profile.</p>",
    bulletList = [
      "Clinical expertise with 15+ years of specialized hair treatment experience.",
      "Customized high-density hairline designs backed by medical science.",
      "State-of-the-art clinical theater with advanced sterile protocols.",
      "Comprehensive pre-and-post care guidance for long-term retention."
    ],
    ctaText = "Discover Signature Treatments"
  } = data;

  // Render different luxury icons for bullet list items
  const getIcon = (idx) => {
    switch (idx % 4) {
      case 0: return <Award size={18} className="intro-bullet-icon" />;
      case 1: return <Sparkles size={18} className="intro-bullet-icon" />;
      case 2: return <ShieldCheck size={18} className="intro-bullet-icon" />;
      default: return <Heart size={18} className="intro-bullet-icon" />;
    }
  };

  return (
    <EditableSection sectionId="about-nandani-intro" label="Hair Specialist Intro">
      <style dangerouslySetInnerHTML={{ __html: `
        .luxury-intro-container {
          background-color: #ffffff;
          color: #0D0D1A;
          font-family: 'Epilogue', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 100px 24px;
        }

        .luxury-intro-box {
          max-width: 1200px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 36px;
          padding: 64px;
          box-shadow: 0 20px 40px rgba(13,13,26,0.03), 0 1px 3px rgba(13,13,26,0.02);
          position: relative;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          .luxury-intro-box {
            padding: 32px 24px;
            border-radius: 24px;
          }
        }

        .luxury-intro-box:hover {
          box-shadow: 0 30px 60px rgba(139,92,246,0.08);
          border-color: rgba(139,92,246,0.25);
        }

        .luxury-intro-box::before {
          content: "";
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, rgba(0,229,255,0) 0%, rgba(139,92,246,0.3) 50%, rgba(0,229,255,0) 100%);
        }

        .luxury-intro-heading {
          font-family: 'Syne', sans-serif;
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin-bottom: 32px;
          color: #0D0D1A;
          background: linear-gradient(135deg, #0D0D1A 30%, #5B21B6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 640px) {
          .luxury-intro-heading {
            font-size: 2rem;
          }
        }

        .luxury-intro-content {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 48px;
          align-items: flex-start;
        }

        @media (max-width: 968px) {
          .luxury-intro-content {
            grid-template-cols: 1fr;
            gap: 36px;
          }
        }

        .intro-rich-description {
          font-size: 15px;
          line-height: 1.7;
          color: #334155;
        }

        .intro-rich-description p {
          margin-bottom: 20px;
        }

        .intro-rich-description p:last-child {
          margin-bottom: 0;
        }

        .intro-bullets-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .intro-bullet-item {
          background: #fafafc;
          border: 1px solid rgba(13,13,26,0.03);
          border-radius: 18px;
          padding: 20px 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .intro-bullet-item:hover {
          background: #ffffff;
          border-color: rgba(0,229,255,0.4);
          transform: translateX(4px);
          box-shadow: 0 10px 20px rgba(0,229,255,0.04);
        }

        .intro-bullet-icon {
          color: #8B5CF6;
          margin-top: 2px;
          transition: color 0.3s;
          flex-shrink: 0;
        }

        .intro-bullet-item:hover .intro-bullet-icon {
          color: #00E5FF;
        }

        .intro-bullet-text {
          font-size: 14px;
          line-height: 1.5;
          color: #1E293B;
          font-weight: 500;
        }

        .intro-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #0D0D1A;
          color: #ffffff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 16px 36px;
          border-radius: 50px;
          border: none;
          margin-top: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 20px rgba(13,13,26,0.12);
        }

        .intro-cta-button:hover {
          background: linear-gradient(135deg, #8B5CF6 0%, #00E5FF 100%);
          color: #0D0D1A;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(139,92,246,0.2);
        }
      `}} />

      <section className="luxury-intro-container">
        <motion.div {...fadeUp(0)} className="luxury-intro-box">
          <h2 className="luxury-intro-heading">
            <EditableText sectionId="about-nandani-intro" fieldPath="intro.heading" tag="span">
              {heading}
            </EditableText>
          </h2>

          <div className="luxury-intro-content">
            {/* LEFT Column: Rich Text Biography */}
            <motion.div {...fadeUp(0.1)} className="intro-rich-description">
              <EditableText
                sectionId="about-nandani-intro"
                fieldPath="intro.description"
                tag="div"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <button className="intro-cta-button">
                <EditableText sectionId="about-nandani-intro" fieldPath="intro.ctaText" tag="span">
                  {ctaText}
                </EditableText>
              </button>
            </motion.div>

            {/* RIGHT Column: Bullet highlights */}
            <motion.div {...fadeUp(0.2)} className="intro-bullets-list">
              {bulletList.map((item, idx) => (
                <div key={idx} className="intro-bullet-item">
                  {getIcon(idx)}
                  <EditableText
                    sectionId="about-nandani-intro"
                    fieldPath={`intro.bulletList.${idx}`}
                    className="intro-bullet-text"
                    tag="span"
                  >
                    {item}
                  </EditableText>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>
    </EditableSection>
  );
}
