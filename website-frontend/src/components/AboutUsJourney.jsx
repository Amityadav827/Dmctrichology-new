import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsJourney.css';

const AboutUsJourney = ({ data = {} }) => {
  const { 
    sectionTitle = "OUR TIMELINE",
    heading = "A Decade Of Restoring Confidence",
    milestones = [] 
  } = data;

  const defaultMilestones = [
    { year: "2008", title: "The Foundation", description: "DMC Trichology opens its first state-of-the-art clinic with a mission to redefine hair care." },
    { year: "2012", title: "US-FDA Integration", description: "Adopting global gold-standard technologies and establishing the Research & Development wing." },
    { year: "2018", title: "20k Milestone", description: "Celebrating 20,000 successful hair restoration procedures across our centers." },
    { year: "2024", title: "Global Recognition", description: "Awarded for excellence in clinical results and artistic hairline design at international forums." }
  ];

  const activeMilestones = (milestones && milestones.length > 0) ? milestones : defaultMilestones;

  return (
    <EditableSection sectionId="about-journey" label="Journey Milestones">
      <section className="about-journey-section">
        <div className="about-journey-container">
          <div className="about-journey-header">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="dmc-kicker"
            >
              <EditableText sectionId="about-journey" fieldPath="journey.sectionTitle" tag="span">{sectionTitle}</EditableText>
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="dmc-heading"
            >
              <EditableText sectionId="about-journey" fieldPath="journey.heading" tag="span">{heading}</EditableText>
            </motion.h2>
          </div>

          <div className="about-journey-timeline">
            {activeMilestones.map((item, index) => (
              <div key={index} className="about-journey-item">
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="about-journey-year-box"
                >
                  <span className="about-journey-year">
                    <EditableText sectionId="about-journey" fieldPath={`journey.milestones.${index}.year`} tag="span">{item.year}</EditableText>
                  </span>
                </motion.div>

                <div className="about-journey-dot-wrapper">
                  <div className="about-journey-dot"></div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="about-journey-content-box"
                >
                  <h4 className="about-journey-milestone-title">
                    <EditableText sectionId="about-journey" fieldPath={`journey.milestones.${index}.title`} tag="span">{item.title}</EditableText>
                  </h4>
                  <p className="about-journey-milestone-desc">
                    <EditableText sectionId="about-journey" fieldPath={`journey.milestones.${index}.description`} tag="span">{item.description}</EditableText>
                  </p>
                </motion.div>
              </div>
            ))}
            <div className="about-journey-line"></div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsJourney;
