import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './AboutUsStory.css';

const AboutUsStory = ({ data = {} }) => {
  const { sectionTitle, heading, description, mainImage, secondaryImage, experienceYears, points = [] } = data;

  return (
    <section className="about-story-section">
      <div className="about-story-container">
        <div className="about-story-grid">
          {/* Images Side */}
          <div className="about-story-visual">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="about-story-main-img-wrapper"
            >
              <img 
                src={mainImage || "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png"} 
                alt="Our Heritage" 
                className="about-story-main-img"
              />
              <div className="about-story-exp-badge">
                <span className="about-story-exp-number">{experienceYears || 15}</span>
                <span className="about-story-exp-text">Years of<br/>Excellence</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="about-story-sub-img-wrapper"
            >
              <img 
                src={secondaryImage || "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png"} 
                alt="Clinic Interior" 
                className="about-story-sub-img"
              />
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="about-story-content">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="about-story-section-tag"
            >
              {sectionTitle || "THE LEGACY"}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="about-story-heading"
            >
              {heading || "A Journey Of Medical Excellence & Artistic Vision"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="about-story-desc"
            >
              {description || "Founded over a decade ago, DMC Trichology was born from a commitment to bring world-class hair restoration to India. Our approach combines US-FDA approved technologies with a deep understanding of facial aesthetics."}
            </motion.p>
            
            <div className="about-story-points">
              {points.length > 0 ? points.map((point, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="about-story-point-item"
                >
                  <div className="about-story-point-icon-box">
                    <Check size={14} color="white" />
                  </div>
                  <span className="about-story-point-text">{point.text}</span>
                </motion.div>
              )) : (
                <>
                  <div className="about-story-point-item"><div className="about-story-point-icon-box"><Check size={14} color="white" /></div><span className="about-story-point-text">US-FDA Approved Technology</span></div>
                  <div className="about-story-point-item"><div className="about-story-point-icon-box"><Check size={14} color="white" /></div><span className="about-story-point-text">25,000+ Successful Procedures</span></div>
                  <div className="about-story-point-item"><div className="about-story-point-icon-box"><Check size={14} color="white" /></div><span className="about-story-point-text">Expert Board-Certified Surgeons</span></div>
                </>
              )}
            </div>

            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="about-story-cta"
            >
              Discover Our Method
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsStory;
