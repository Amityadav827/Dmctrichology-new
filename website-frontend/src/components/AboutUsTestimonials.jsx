import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

import 'swiper/css';
import 'swiper/css/navigation';
import './AboutUsTestimonials.css';

// ── Animation helpers ────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

// ── Component ────────────────────────────────────────────────
const AboutUsTestimonials = ({ data = {} }) => {
  const {
    sectionTitle = 'PATIENT STORIES',
    heading = 'Voice Of Our Patients',
    reviews = [],
  } = data;

  const defaultReviews = [
    {
      patientName: 'Amit Sharma',
      treatment: 'FUE Hair Transplant',
      reviewText: 'The precision and care at DMC Trichology are unmatched. My results look completely natural, and the experience was premium from start to finish.',
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
      rating: 5,
    },
    {
      patientName: 'Vikram Mehta',
      treatment: 'DHI Restoration',
      reviewText: "Choosing DMC was the best decision for my hair restoration. Dr. Garg's artistic vision and the team's professionalism are truly world-class.",
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
      rating: 5,
    },
  ];

  const activeReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;
  const swiperRef = useRef(null);

  return (
    <EditableSection sectionId="about-testimonials" label="Patient Testimonials">
      <section className="about-testi-section">
        <div className="about-testi-container">
          
          {/* ── Header ────────────────────────────────────────── */}
          <div className="about-testi-header">
            <motion.span {...fadeUp(0)} className="dmc-kicker">
              <EditableText sectionId="about-testimonials" fieldPath="testimonials.sectionTitle" tag="span">
                {sectionTitle}
              </EditableText>
            </motion.span>
            <motion.h2 {...fadeUp(0.15)} className="about-testi-main-title">
              <EditableText sectionId="about-testimonials" fieldPath="testimonials.heading" tag="span">
                {heading}
              </EditableText>
            </motion.h2>
          </div>

          {/* ── Swiper Slider ─────────────────────────────────── */}
          <motion.div {...fadeUp(0.3)} className="about-testi-slider-wrapper">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1.5 },
                1024: { slidesPerView: 2.1 },
                1280: { slidesPerView: 2.2 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="about-testi-swiper"
            >
              {activeReviews.map((review, index) => (
                <SwiperSlide key={index} style={{ height: 'auto' }}>
                  <div className="about-testi-card">
                    {/* Background Quote Mark */}
                    <div className="about-testi-quote-bg">
                      <Quote size={180} fill="currentColor" strokeWidth={0} />
                    </div>

                    {/* Monochrome Stars */}
                    <div className="about-testi-stars">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="#ffffff" color="#ffffff" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="about-testi-text">
                      <EditableText
                        sectionId="about-testimonials"
                        fieldPath={`testimonials.reviews.${index}.reviewText`}
                        tag="span"
                      >
                        {review.reviewText}
                      </EditableText>
                    </p>

                    {/* Author Info */}
                    <div className="about-testi-author">
                      <img
                        src={review.image || 'https://via.placeholder.com/150'}
                        alt={review.patientName}
                        className="about-testi-author-img"
                      />
                      <div className="about-testi-author-info">
                        <h5 className="about-testi-author-name">
                          <EditableText
                            sectionId="about-testimonials"
                            fieldPath={`testimonials.reviews.${index}.patientName`}
                            tag="span"
                          >
                            {review.patientName}
                          </EditableText>
                        </h5>
                        <p className="about-testi-author-meta">
                          <EditableText
                            sectionId="about-testimonials"
                            fieldPath={`testimonials.reviews.${index}.treatment`}
                            tag="span"
                          >
                            {review.treatment}
                          </EditableText>
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* ── Custom Navigation ── */}
            <div className="about-testi-nav">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="testi-nav-btn"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="testi-nav-btn"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
          </motion.div>

        </div>
      </section>
    </EditableSection>
  );
};

export default AboutUsTestimonials;
