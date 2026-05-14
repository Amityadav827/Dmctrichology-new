import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsStory.css';

const AboutUsStory = ({ data = {} }) => {
  const { 
    sectionTitle = "THE LEGACY", 
    heading = "A Journey Of Medical Excellence & Artistic Vision", 
    description = "Founded over a decade ago, DMC Trichology was born from a commitment to bring world-class hair restoration to India. Our approach combines US-FDA approved technologies with a deep understanding of facial aesthetics.", 
    mainImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png", 
    secondaryImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png", 
    experienceYears = 15, 
    points = [] 
  } = data;

  return (
    <EditableSection sectionId="about-story" label="About Us Story">
      <section className="about-story-section">
        <div className="about-story-container">
          <div className="about-story-grid">
            <div className="about-story-visual">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="about-story-main-img-wrapper"
              >
                <img 
                  src={mainImage} 
                  alt="Our Heritage" 
                  className="about-story-main-img"
                />
                <div className="about-story-exp-badge">
                  <span className="about-story-exp-number">
                    <EditableText sectionId="about-story" fieldPath="story.experienceYears" tag="span">{experienceYears}</EditableText>
                  </span>
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
                  src={secondaryImage} 
                  alt="Clinic Interior" 
                  className="about-story-sub-img"
                />
              </motion.div>
            </div>

            <div className="about-story-content">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="about-story-section-tag"
              >
                <EditableText sectionId="about-story" fieldPath="story.sectionTitle" tag="span">{sectionTitle}</EditableText>
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="about-story-heading"
              >
                <EditableText sectionId="about-story" fieldPath="story.heading" tag="span">{heading}</EditableText>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="about-story-desc"
              >
                <EditableText sectionId="about-story" fieldPath="story.description" tag="span">{description}</EditableText>
              </motion.p>
              
              <div className="about-story-points">
                {(points && points.length > 0 ? points : [
                  { text: "US-FDA Approved Technology" },
                  { text: "25,000+ Successful Procedures" },
                  { text: "Expert Board-Certified Surgeons" }
                ]).map((point, index) => (
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
                    <span className="about-story-point-text">
                      <EditableText sectionId="about-story" fieldPath={`story.points.${index}.text`} tag="span">{point.text}</EditableText>
                    </span>
                  </motion.div>
                ))}
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
    </EditableSection>
  );
};

export default AboutUsStory;
