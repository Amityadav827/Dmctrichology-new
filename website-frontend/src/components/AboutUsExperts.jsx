import React from 'react';
import { motion } from 'framer-motion';
import './AboutUsExperts.css';

const AboutUsExperts = ({ data = {} }) => {
  const { team = [] } = data;

  const defaultTeam = [
    { 
      name: "Dr. Gaurav Garg", 
      designation: "Chief Hair Transplant Surgeon", 
      specialization: "M.D. (Dermatology), Medical Board of DMC",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
      bio: "A pioneer in advanced DHI & FUE techniques with over 15 years of surgical experience."
    },
    { 
      name: "Dr. Monica Garg", 
      designation: "Aesthetic Physician", 
      specialization: "Specialist in Scalp Micropigmentation",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
      bio: "Combining medical science with an artistic eye to deliver natural hairline designs."
    }
  ];

  const activeTeam = team.length > 0 ? team : defaultTeam;

  return (
    <section className="about-experts-section">
      <div className="about-experts-container">
        <div className="about-experts-header">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="about-experts-tag"
          >
            MEDICAL BOARD
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="about-experts-main-title"
          >
            Led By World-Class Surgeons
          </motion.h2>
        </div>

        <div className="about-experts-grid">
          {activeTeam.map((member, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="about-expert-card"
            >
              <div className="about-expert-img-wrapper">
                <img src={member.image} alt={member.name} className="about-expert-img" />
                <div className="about-expert-overlay">
                  <div className="about-expert-bio-box">
                    <p className="about-expert-bio">{member.bio}</p>
                  </div>
                </div>
              </div>
              <div className="about-expert-info">
                <h4 className="about-expert-name">{member.name}</h4>
                <p className="about-expert-designation">{member.designation}</p>
                <div className="about-expert-divider"></div>
                <span className="about-expert-spec">{member.specialization}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsExperts;
