import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Heart, Eye } from 'lucide-react';
import './AboutUsVision.css';

const IconMap = {
  ShieldCheck,
  Target,
  Heart,
  Eye
};

const AboutUsVision = ({ data = {} }) => {
  const { visionText, missionText, values = [] } = data;

  const defaultValues = [
    { title: "Integrity", description: "Ethical medical practices above all else.", icon: "ShieldCheck" },
    { title: "Precision", description: "Artistic meticulousness in every graft.", icon: "Target" },
    { title: "Empathy", description: "Patient care that goes beyond the procedure.", icon: "Heart" }
  ];

  const activeValues = values.length > 0 ? values : defaultValues;

  return (
    <section className="about-vision-section">
      <div className="about-vision-container">
        <div className="about-vision-header">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="about-vision-tag"
          >
            PHILOSOPHY
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="about-vision-main-title"
          >
            Guided By Science, Inspired By Art
          </motion.h2>
        </div>

        <div className="about-vision-dual-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="about-vision-card"
          >
            <div className="card-icon"><Eye size={40} strokeWidth={1} /></div>
            <h3 className="about-vision-card-title">Our Vision</h3>
            <p className="about-vision-card-text">{visionText || "To redefine the global standard of natural hair restoration through innovation and uncompromising quality."}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="about-vision-card mission"
          >
            <div className="card-icon"><Target size={40} strokeWidth={1} /></div>
            <h3 className="about-vision-card-title">Our Mission</h3>
            <p className="about-vision-card-text">{missionText || "To empower our patients by restoring their natural appearance and confidence using the safest, most advanced medical protocols."}</p>
          </motion.div>
        </div>

        <div className="about-values-grid">
          {activeValues.map((value, index) => {
            const IconComponent = IconMap[value.icon] || ShieldCheck;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="about-value-item"
              >
                <div className="about-value-icon-box">
                  <IconComponent size={32} color="#c19a5b" strokeWidth={1.5} />
                </div>
                <h4 className="about-value-title">{value.title}</h4>
                <p className="about-value-desc">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutUsVision;
