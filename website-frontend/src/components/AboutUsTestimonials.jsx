import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutUsTestimonials.css';

const AboutUsTestimonials = ({ data = {} }) => {
  const { 
    sectionTitle = "CLIENT STORIES",
    heading = "Voice Of Our Patients",
    reviews = [] 
  } = data;

  const defaultReviews = [
    { 
      patientName: "Amit Sharma", 
      treatment: "FUE Hair Transplant", 
      reviewText: "The precision and care at DMC Trichology are unmatched. My results look completely natural, and the experience was premium from start to finish.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
      rating: 5
    },
    { 
      patientName: "Vikram Mehta", 
      treatment: "DHI Restoration", 
      reviewText: "Choosing DMC was the best decision for my hair restoration. Dr. Garg's artistic vision and the team's professionalism are truly world-class.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
      rating: 5
    }
  ];

  const activeReviews = (reviews && reviews.length > 0) ? reviews : defaultReviews;

  return (
    <EditableSection sectionId="about-testimonials" label="Patient Testimonials">
      <section className="about-testi-section">
        <div className="about-testi-container">
          <div className="about-testi-header">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="about-testi-tag"
            >
              <EditableText sectionId="about-testimonials" fieldPath="testimonials.sectionTitle" tag="span">{sectionTitle}</EditableText>
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="about-testi-main-title"
            >
              <EditableText sectionId="about-testimonials" fieldPath="testimonials.heading" tag="span">{heading}</EditableText>
            </motion.h2>
          </div>

          <div className="about-testi-grid">
            {activeReviews.map((review, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="about-testi-card"
              >
                <div className="about-testi-quote-icon">
                  <Quote size={48} color="#c19a5b" fill="#c19a5b" opacity={0.1} />
                </div>
                <div className="about-testi-stars">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="#c19a5b" color="#c19a5b" />
                  ))}
                </div>
                <p className="about-testi-text">
                  "<EditableText sectionId="about-testimonials" fieldPath={`testimonials.reviews.${index}.reviewText`} tag="span">{review.reviewText}</EditableText>"
                </p>
                <div className="about-testi-author">
                  <img src={review.image} alt={review.patientName} className="about-testi-author-img" />
                  <div className="about-testi-author-info">
                    <h5 className="about-testi-author-name">
                      <EditableText sectionId="about-testimonials" fieldPath={`testimonials.reviews.${index}.patientName`} tag="span">{review.patientName}</EditableText>
                    </h5>
                    <p className="about-testi-author-meta">
                      <EditableText sectionId="about-testimonials" fieldPath={`testimonials.reviews.${index}.treatment`} tag="span">{review.treatment}</EditableText>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsTestimonials;
