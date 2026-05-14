import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsHero.css';

const AboutUsHero = ({ data = {} }) => {
  const { 
    badge = "ESTABLISHED 2008", 
    title = "Crafting The Art Of Natural Hair Restoration", 
    subtitle = "At DMC Trichology, we blend advanced medical science with meticulous artistic precision to restore more than just hair—we restore confidence.", 
    image = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", 
    stats = [] 
  } = data;

  return (
    <EditableSection sectionId="about-hero" label="About Us Hero">
      <section className="about-hero-section">
        <div className="about-hero-container">
          <div className="about-hero-layout">
            <div className="about-hero-content">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <EditableText sectionId="about-hero" fieldPath="hero.badge" className="about-hero-badge" tag="span">
                  {badge}
                </EditableText>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="about-hero-title"
              >
                <EditableText sectionId="about-hero" fieldPath="hero.title" tag="span">
                  {title}
                </EditableText>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="about-hero-subtitle"
              >
                <EditableText sectionId="about-hero" fieldPath="hero.subtitle" tag="span">
                  {subtitle}
                </EditableText>
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="about-hero-stats"
              >
                {(stats && stats.length > 0 ? stats : [
                  { value: "15", suffix: "+", label: "Years Experience" },
                  { value: "25", suffix: "k+", label: "Happy Patients" },
                  { value: "12", suffix: "+", label: "Expert Board" }
                ]).map((stat, index) => (
                  <div key={index} className="about-hero-stat-box">
                    <span className="stat-num">
                      <EditableText sectionId="about-hero" fieldPath={`hero.stats.${index}.value`} tag="span">{stat.value}</EditableText>
                      <EditableText sectionId="about-hero" fieldPath={`hero.stats.${index}.suffix`} tag="span">{stat.suffix}</EditableText>
                    </span>
                    <span className="stat-txt">
                      <EditableText sectionId="about-hero" fieldPath={`hero.stats.${index}.label`} tag="span">{stat.label}</EditableText>
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="about-hero-cinematic">
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="cinematic-img-frame"
              >
                <img 
                  src={image} 
                  alt="DMC Luxury Clinic" 
                  className="cinematic-img"
                />
                <div className="cinematic-overlay"></div>
                <motion.div 
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                  className="cinematic-reveal"
                ></motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsHero;
