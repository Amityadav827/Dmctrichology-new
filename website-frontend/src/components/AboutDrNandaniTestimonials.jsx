"use client";
import React, { useMemo, useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import RichTextContent from './RichTextContent';

const backgroundImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780628617563-236798553.png";
const defaultPatientImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/testimonial-google-icon.png";

const defaultTestimonials = [
  {
    text: "Dr. Nandani Dadu Is An Excellent Hair Specialist In Delhi. I Visited Her Clinic For Hair Loss Treatment, And The Results Have Been Outstanding. She Is Very Knowledgeable And Patient, Taking Time To Explain Everything Clearly.",
    patientName: "Sanadhan Chaima",
    image: defaultPatientImage,
    disclaimer: "*Opinions/Results May Vary From Person To Person.",
    stars: 5
  },
  {
    text: "Dr. Nandani Dadu Is An Excellent Hair Specialist In Delhi. I Visited Her Clinic For Hair Loss Treatment, And The Results Have Been Outstanding. She Is Very Knowledgeable And Patient, Taking Time To Explain Everything Clearly.",
    patientName: "Sanadhan Chaima",
    image: defaultPatientImage,
    disclaimer: "*Opinions/Results May Vary From Person To Person.",
    stars: 5
  },
  {
    text: "Dr. Nandani Dadu Is An Excellent Hair Specialist In Delhi. I Visited Her Clinic For Hair Loss Treatment, And The Results Have Been Outstanding. She Is Very Knowledgeable And Patient, Taking Time To Explain Everything Clearly.",
    patientName: "Sanadhan Chaima",
    image: defaultPatientImage,
    disclaimer: "*Opinions/Results May Vary From Person To Person.",
    stars: 5
  },
  {
    text: "Dr. Nandani Dadu Is An Excellent Hair Specialist In Delhi. I Visited Her Clinic For Hair Loss Treatment, And The Results Have Been Outstanding. She Is Very Knowledgeable And Patient, Taking Time To Explain Everything Clearly.",
    patientName: "Sanadhan Chaima",
    image: defaultPatientImage,
    disclaimer: "*Opinions/Results May Vary From Person To Person.",
    stars: 5
  }
];

function StarRating({ count = 5 }) {
  const total = Math.min(Math.max(Number(count) || 5, 1), 5);

  return (
    <div className="dmc-testimonial-stars" aria-label={`${total} star rating`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < total ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function AboutDrNandaniTestimonials({ data = {}, useDefaultTestimonials = true }) {
  const {
    heading = "Patient Testimonials",
    patientImage = defaultPatientImage,
    testimonials
  } = data;

  const slides = useMemo(() => {
    const cmsTestimonials = Array.isArray(testimonials) ? testimonials.filter(Boolean) : [];
    const source = cmsTestimonials.length > 0
      ? cmsTestimonials
      : (useDefaultTestimonials ? defaultTestimonials : []);

    if (source.length === 0) return [];

    const repeated = [...source];

    while (repeated.length < 4) {
      repeated.push(source[repeated.length % source.length]);
    }

    return repeated.slice(0, Math.max(repeated.length, 4));
  }, [testimonials, useDefaultTestimonials]);

  const [activeIndex, setActiveIndex] = useState(0);
  const fallbackSlide = useDefaultTestimonials ? defaultTestimonials[0] : {};
  const activeSlide = slides[activeIndex] || fallbackSlide;
  const activePatientImage = activeSlide.image || patientImage || defaultPatientImage;

  const goPrev = () => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <EditableSection sectionId="about-nandani-testimonials" label="Patient Testimonials Section">
      <section className="dmc-testimonials-wrapper">
        <div className="dmc-testimonials-bg-card">
          <div className="dmc-testimonial-nav" aria-label="Testimonial navigation">
            <button type="button" onClick={goPrev} aria-label="Previous testimonial">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" onClick={goNext} aria-label="Next testimonial">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="dmc-testimonial-content" key={activeIndex}>
            <span className="dmc-testimonial-eyebrow">
              <span />
              TRUSTED CARE SERVICES
            </span>

            <h2>
              <EditableText sectionId="about-nandani-testimonials" fieldPath="testimonialsSection.heading">
                {heading}
              </EditableText>
            </h2>

            <img className="dmc-testimonial-patient" src={activePatientImage} alt={activeSlide.patientName || "Patient testimonial"} />

            <RichTextContent
              value={activeSlide.text || fallbackSlide.text || ""}
              className="dmc-testimonial-text"
            />

            <StarRating count={activeSlide.stars || 5} />

            <p className="dmc-testimonial-name">
              <EditableText sectionId="about-nandani-testimonials" fieldPath={`testimonialsSection.testimonials.${activeIndex}.patientName`}>
                {activeSlide.patientName || fallbackSlide.patientName || ""}
              </EditableText>
            </p>

            <p className="dmc-testimonial-disclaimer">
              <EditableText sectionId="about-nandani-testimonials" fieldPath={`testimonialsSection.testimonials.${activeIndex}.disclaimer`}>
                {activeSlide.disclaimer || fallbackSlide.disclaimer || ""}
              </EditableText>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dmc-testimonials-wrapper {
          width: 100%;
          padding: 100px 24px;
          background: #ffffff;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
        }
        .dmc-testimonials-bg-card {
          width: 100%;
          max-width: 1260px;
          min-height: 486px;
          position: relative;
          background-image: url("${backgroundImage}");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
          padding: 58px 90px 68px;
          box-sizing: border-box;
          overflow: visible;
        }
        .dmc-testimonial-nav {
          position: absolute;
          top: 12px;
          right: 13px;
          display: flex;
          align-items: center;
          gap: 18px;
          z-index: 3;
        }
        .dmc-testimonial-nav button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform .25s ease, background .25s ease, color .25s ease;
        }
        .dmc-testimonial-nav button:first-child {
          background: #EEF0FA;
          color: #3B5998;
        }
        .dmc-testimonial-nav button:last-child {
          background: #3B5998;
          color: #ffffff;
        }
        .dmc-testimonial-nav button:hover {
          transform: translateY(-2px);
        }
        .dmc-testimonial-content {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
          color: #ffffff;
          animation: dmcTestimonialFade .38s ease;
        }
        .dmc-testimonial-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: 'Lato', sans-serif;
          font-size: 9px;
          line-height: 1;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 20px;
        }
        .dmc-testimonial-eyebrow span {
          width: 60px;
          height: 1px;
          background: rgba(255, 255, 255, 0.82);
          display: inline-block;
          position: relative;
        }
        .dmc-testimonial-eyebrow span::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          position: absolute;
          right: -4px;
          top: -3.5px;
        }
        .dmc-testimonial-content h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3vw, 44px);
          line-height: 1.08;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 46px;
        }
        .dmc-testimonial-patient {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: contain;
          display: block;
          margin: 0 auto 30px;
        }
        .dmc-testimonial-text,
        .dmc-testimonial-text :global(p) {
          font-family: 'Marcellus', serif;
          font-size: clamp(19px, 1.9vw, 26px);
          line-height: 1.48;
          font-weight: 400;
          color: #ffffff;
          margin: 0 auto 20px;
          max-width: 820px;
        }
        .dmc-testimonial-text :global(p:last-child) {
          margin-bottom: 0;
        }
        .dmc-testimonial-stars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          margin-bottom: 14px;
          color: #FFD22E;
          font-size: 24px;
          line-height: 1;
          letter-spacing: 1px;
        }
        .dmc-testimonial-name {
          font-family: 'Marcellus', serif;
          font-size: 15px;
          line-height: 1.2;
          color: #ffffff;
          margin: 0 0 4px;
        }
        .dmc-testimonial-disclaimer {
          font-family: 'Lato', sans-serif;
          font-size: 9px;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.78);
          margin: 0;
        }
        @keyframes dmcTestimonialFade {
          from {
            opacity: .42;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 1024px) {
          .dmc-testimonials-wrapper {
            padding: 82px 18px;
          }
          .dmc-testimonials-bg-card {
            min-height: 460px;
            padding: 58px 58px 64px;
          }
          .dmc-testimonial-text {
            font-size: 21px;
          }
        }
        @media (max-width: 767px) {
          .dmc-testimonials-wrapper {
            padding: 58px 14px;
          }
          .dmc-testimonials-bg-card {
            min-height: 560px;
            padding: 64px 24px 52px;
            background-size: 100% 100%;
          }
          .dmc-testimonial-nav {
            top: 12px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
            gap: 10px;
          }
          .dmc-testimonial-nav button {
            width: 34px;
            height: 34px;
          }
          .dmc-testimonial-content h2 {
            font-size: clamp(30px, 9vw, 38px);
            margin-bottom: 36px;
          }
          .dmc-testimonial-patient {
            width: 42px;
            height: 42px;
            margin-bottom: 26px;
          }
          .dmc-testimonial-text {
            font-size: 18px;
            line-height: 1.55;
          }
          .dmc-testimonial-stars {
            font-size: 21px;
          }
        }
        @media (max-width: 420px) {
          .dmc-testimonials-bg-card {
            padding-left: 18px;
            padding-right: 18px;
          }
          .dmc-testimonial-eyebrow span {
            width: 42px;
          }
          .dmc-testimonial-text {
            font-size: 16px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
