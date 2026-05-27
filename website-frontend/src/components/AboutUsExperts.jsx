import React from 'react';
import { motion } from 'framer-motion';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsExperts.css';

// ── Animation helpers ────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

// ── Component ────────────────────────────────────────────────
const AboutUsExperts = ({ data = {} }) => {
  const {
    sectionTitle = 'MEET OUR EXPERTS',
    heading = 'The Hands Behind Your Transformation',
    team = [],
  } = data;

  const defaultTeam = [
    {
      name: 'Dr. Gaurav Garg',
      designation: 'Chief Hair Transplant Surgeon',
      specialization: 'M.D. (Dermatology), Medical Board of DMC',
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
      bio: 'A pioneer in advanced DHI & FUE techniques with over 15 years of surgical experience.',
    },
    {
      name: 'Dr. Monica Garg',
      designation: 'Aesthetic Physician',
      specialization: 'Specialist in Scalp Micropigmentation',
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
      bio: 'Combining medical science with an artistic eye to deliver natural hairline designs.',
    },
  ];

  const activeTeam = team && team.length > 0 ? team : defaultTeam;

  return (
    <EditableSection sectionId="about-experts" label="Team Experts">
      <section className="about-experts-section">
        <div className="about-experts-container">

          {/* ── Editorial Header ─────────────────────────── */}
          <div className="about-experts-header">
            <motion.span {...fadeUp(0)} className="dmc-kicker">
              <EditableText sectionId="about-experts" fieldPath="experts.sectionTitle" tag="span">
                {sectionTitle}
              </EditableText>
            </motion.span>
            <motion.h2 {...fadeUp(0.15)} className="dmc-heading">
              <EditableText sectionId="about-experts" fieldPath="experts.heading" tag="span">
                {heading}
              </EditableText>
            </motion.h2>
          </div>

          {/* ── Expert Cards Grid ────────────────────────── */}
          <div className="about-experts-grid">
            {activeTeam.map((member, index) => (
              <motion.div
                key={index}
                {...fadeUp(0.15 + index * 0.15)}
                className="about-expert-card"
              >
                {/* Monochrome index label */}
                <span className="about-expert-index">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Image side */}
                <div className="about-expert-img-wrapper">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="about-expert-img"
                  />
                  {/* Static gradient overlay */}
                  <div className="about-expert-overlay" aria-hidden="true" />
                  {/* Bio hover reveal */}
                  <div className="about-expert-bio-box">
                    <p className="about-expert-bio">
                      <EditableText
                        sectionId="about-experts"
                        fieldPath={`experts.team.${index}.bio`}
                        tag="span"
                      >
                        {member.bio}
                      </EditableText>
                    </p>
                  </div>
                </div>

                {/* Content side */}
                <div className="about-expert-info">
                  <h4 className="about-expert-name">
                    <EditableText
                      sectionId="about-experts"
                      fieldPath={`experts.team.${index}.name`}
                      tag="span"
                    >
                      {member.name}
                    </EditableText>
                  </h4>
                  <p className="about-expert-designation">
                    <EditableText
                      sectionId="about-experts"
                      fieldPath={`experts.team.${index}.designation`}
                      tag="span"
                    >
                      {member.designation}
                    </EditableText>
                  </p>
                  <div className="about-expert-divider" aria-hidden="true" />
                  <span className="about-expert-spec">
                    <EditableText
                      sectionId="about-experts"
                      fieldPath={`experts.team.${index}.specialization`}
                      tag="span"
                    >
                      {member.specialization}
                    </EditableText>
                  </span>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsExperts;
