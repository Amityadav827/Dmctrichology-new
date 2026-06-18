import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Award, Briefcase, Heart, Star } from 'lucide-react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import './AboutDrNandani.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const AboutDrNandani = ({ data = {} }) => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqItems = [
    { question: "Who is the best hair transplant surgeon in Delhi?", answer: "The creator of the DMC Golden Touch hair transplant technique, Dr. Nandini Dadu is the best hair transplant surgeon in Delhi and co-founder of DMC Trichology." },
    { question: "Who is the No 1 hair transplant surgeon in India?", answer: "Dr. Nandini Dadu is recognized as one of India's leading hair transplant experts with extensive experience and advanced techniques." },
    { question: "Which type of doctor is best for hair?", answer: "A board-certified trichologist specializing in hair and scalp treatments is ideal for comprehensive hair care." },
    { question: "What is a hair specialist called?", answer: "A hair specialist is called a Trichologist, who specializes in the diagnosis and treatment of hair and scalp conditions." },
    { question: "How do I choose a hair surgeon?", answer: "Look for board certifications, experience, patient testimonials, advanced techniques, and a personalized approach to treatment." },
    { question: "Is hair surgery good?", answer: "Yes, when performed by certified specialists using advanced techniques like FUE and DMC Golden Touch, hair surgery can provide excellent results." },
    { question: "What is the difference between a dermatologist and a hair specialist?", answer: "While dermatologists treat skin conditions, trichologists specialize specifically in hair and scalp health with advanced treatment techniques." },
    { question: "Which treatment is permanent for hair loss?", answer: "Hair transplant procedures using techniques like FUE and DMC Golden Touch provide permanent results as they use your own hair follicles." },
    { question: "What is the safest treatment for hair loss?", answer: "Treatments like FUE hair transplants, Mesogrow, and Advanced HGP are safe when performed by certified specialists." },
    { question: "Which surgery is best for hair growth?", answer: "FUE hair transplant and DMC Golden Touch are among the best surgical options for natural-looking hair growth." },
  ];

  const testimonials = [
    {
      name: "Sonadhan Chakma",
      text: "Dr. Nandini Dadu is an excellent hair specialist in Delhi. I visited her clinic for hair loss treatment, and the results have been outstanding. She is very knowledgeable and patient, taking time to explain the root cause of the problem and the available treatments. The clinic is well-maintained, and the staff is polite and professional."
    },
    {
      name: "Akhilesh Singh",
      text: "Dr. Nandini Dadu is the best hair transplant surgeon in Delhi. I underwent a hair transplant procedure at her clinic, and the results have been amazing. She uses advanced techniques and ensures minimal discomfort during the process. Her attention to detail and dedication to patient care is impressive."
    },
    {
      name: "Naveen Yadav",
      text: "Dr. Nandini Dadu is undoubtedly the best hair specialist in Delhi. She helped me regain confidence with her effective treatment for hair thinning. Her approach is personalized, focusing on understanding individual needs. The clinic is equipped with modern facilities, and the entire team ensures a comfortable experience."
    }
  ];

  return (
    <div className="about-dr-nandani-page">
      {/* Hero Section */}
      <section className="dr-nandani-hero">
        <div className="dr-nandani-hero-container">
          <motion.div {...fadeUp(0)} className="dr-nandani-hero-content">
            <span className="dr-nandani-subtitle">Best Hair Transplant Surgeon In Delhi</span>
            <h1 className="dr-nandani-hero-title">Dr. Nandini Dadu</h1>
            <p className="dr-nandani-qualification">M.B.B.S</p>
            <p className="dr-nandani-hero-desc">
              Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi. She is also known as one of India's leading experts in the practice and for her research on hair loss prevention.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="dr-nandani-hero-form">
            <h3>Get Consultation</h3>
            <form className="dr-nandani-form">
              <input type="text" placeholder="Full Name" required />
              <input type="tel" placeholder="Phone No" required />
              <button type="submit" className="dr-nandani-cta-btn">Request Appointment</button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Specialist Section */}
      <section className="dr-nandani-specialist">
        <div className="dr-nandani-container">
          <motion.h2 {...fadeUp(0)} className="dr-nandani-section-title">
            Best Hair Specialist in Delhi
          </motion.h2>

          <motion.p {...fadeUp(0.1)} className="dr-nandani-specialist-desc">
            Dr. Nandini Dadu is a well-known former consultant at ARTEMIS HOSPITAL in Gurgaon. Over the years, she has provided insights to several dignitaries and celebrities in New Delhi. She is the best hair specialist in Delhi. She works in close collaboration with doctors at Hair Care & Transplant Surgeons and is always looking for new, cutting-edge products for hair and scalp care treatments.
          </motion.p>

          <motion.p {...fadeUp(0.2)} className="dr-nandani-specialist-desc">
            Being a specialist in the cosmetological and trichological sciences combined, Dr. Nandini is dedicated to thorough diagnosis, effective treatment processes, and the best DMC Golden Touch Techniques for generating amazing outcomes at the highest level of client satisfaction. So, to get the long-lasting effects opt to get treated by the best hair specialist in Delhi only at DMC Trichology.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="dr-nandani-treatments">
            <h4>She employs cutting-edge knowledge in Hair & Scalp Treatments with:</h4>
            <div className="dr-nandani-treatment-grid">
              <div className="dr-nandani-treatment-item">MESOGROW</div>
              <div className="dr-nandani-treatment-item">ADVANCED HGP</div>
              <div className="dr-nandani-treatment-item">ADVANCED HGP 2.0</div>
              <div className="dr-nandani-treatment-item">RRT (Root Restore Therapy)</div>
              <div className="dr-nandani-treatment-item">FUE TECHNIQUE (Follicular Hair Transplant)</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="dr-nandani-credentials">
        <div className="dr-nandani-container">
          <motion.h2 {...fadeUp(0)} className="dr-nandani-section-title">
            What Makes Dr. Nandini Dadu the Best Hair Transplant Surgeon in Delhi?
          </motion.h2>

          <div className="dr-nandani-credentials-grid">
            <motion.div {...fadeUp(0.1)} className="dr-nandani-credential-card">
              <div className="dr-nandani-credential-icon">
                <Award size={32} />
              </div>
              <h4>Education</h4>
              <ul>
                <li>MBBS: Himalayan Institute of Medical Sciences (H I M S), Dehradun 2005</li>
                <li>Diploma In Anaesthesia & Critical Care: Himalayan Institute of Medical Sciences (H I M S), Dehradun 2012</li>
              </ul>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="dr-nandani-credential-card">
              <div className="dr-nandani-credential-icon">
                <Briefcase size={32} />
              </div>
              <h4>Experience</h4>
              <ul>
                <li>Senior Resident Anaesthesia & Critical Care : Dr. Ram Manohar Lohia Hospital, New Delhi 2014 - 2017</li>
                <li>Fellowship In Pain Medicine : King Edward Memorial Hospital, Mumbai 2017 - 2018</li>
                <li>Attending Consultant Anaesthesia & Critical Care : Primus Hospital , New Delhi 2018</li>
                <li>Consultant Pain Medicine & Palliative Care : Artemis Hospital, Gurgaon 2018- 2020</li>
                <li>Senior Consultant Hair Transplant Surgeon: Dadu Medical Centre, New Delhi 2020- Present</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Trust Section */}
      <section className="dr-nandani-trust">
        <div className="dr-nandani-container">
          <motion.h2 {...fadeUp(0)} className="dr-nandani-section-title">
            Why Do Patients Trust Dr. Nandini Dadu As a Hair Transplant Doctor in Delhi?
          </motion.h2>

          <div className="dr-nandani-trust-grid">
            {[
              {
                icon: <Star size={28} />,
                title: "Unparalleled Expertise",
                desc: "Dr. Nandini Dadu performs the best hair loss, thinning, and baldness procedures. She has continuously contributed to improving many lives by providing excellent hair transplant results."
              },
              {
                icon: <Briefcase size={28} />,
                title: "Vast Hair Restoration Procedures",
                desc: "Her expertise lies in hair procedures, such as DMC Mesogrow, Advanced HGP, Keravive Hair, Hair Rituals, and DMC-Golden Touch for hair transplants."
              },
              {
                icon: <Award size={28} />,
                title: "Expert in Complex Procedures",
                desc: "She takes a keen interest in performing complex procedures, such as repair hair transplants, body hair transplants, and high-density transplants."
              },
              {
                icon: <Heart size={28} />,
                title: "Expert Precision for Natural Results",
                desc: "Dr. Dadu utilises her artistic abilities to provide a natural hairline. It gives patients confidence and leaves no proof that they underwent a hair transplant."
              }
            ].map((item, index) => (
              <motion.div {...fadeUp(0.1 + index * 0.1)} key={index} className="dr-nandani-trust-card">
                <div className="dr-nandani-trust-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="dr-nandani-testimonials">
        <div className="dr-nandani-container">
          <motion.h2 {...fadeUp(0)} className="dr-nandani-section-title">
            Patient Testimonials
          </motion.h2>

          <div className="dr-nandani-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div {...fadeUp(0.1 + index * 0.1)} key={index} className="dr-nandani-testimonial-card">
                <div className="dr-nandani-stars">★★★★★</div>
                <p className="dr-nandani-testimonial-text">"{testimonial.text}"</p>
                <p className="dr-nandani-testimonial-name">{testimonial.name}</p>
                <p className="dr-nandani-testimonial-note">Opinions/Results may vary from person to person.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="dr-nandani-faqs">
        <div className="dr-nandani-container">
          <motion.h2 {...fadeUp(0)} className="dr-nandani-section-title">
            FAQs About Best Hair Transplant Surgeon in Delhi
          </motion.h2>

          <div className="dr-nandani-faq-list">
            {faqItems.map((item, index) => (
              <motion.div {...fadeUp(0.05 + index * 0.05)} key={index} className="dr-nandani-faq-item">
                <button
                  className="dr-nandani-faq-question"
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                >
                  <span>{item.question}</span>
                  <ChevronDown size={20} className={activeFAQ === index ? 'active' : ''} />
                </button>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="dr-nandani-faq-answer"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="dr-nandani-consultation">
        <div className="dr-nandani-container">
          <motion.h2 {...fadeUp(0)} className="dr-nandani-section-title">
            Request A Consultation
          </motion.h2>

          <div className="dr-nandani-consultation-content">
            <motion.div {...fadeUp(0.1)} className="dr-nandani-clinic-info">
              <h4>Clinic Timings (By Appointments Only)</h4>
              <p><strong>Monday to Saturday:</strong> 9:00 AM to 8:00 PM</p>
              <p><strong>Sunday:</strong> 10:00 AM to 7:00 PM</p>
            </motion.div>

            <motion.form {...fadeUp(0.2)} className="dr-nandani-consultation-form">
              <div className="dr-nandani-form-row">
                <input type="text" placeholder="Full Name" required />
                <input type="tel" placeholder="Phone No" required />
              </div>
              <div className="dr-nandani-form-row">
                <input type="email" placeholder="Email Id" required />
                <input type="date" required />
              </div>
              <div className="dr-nandani-form-row">
                <select required>
                  <option>Select Location</option>
                  <option>Vasant Vihar, South Delhi</option>
                  <option>Rajouri Garden, West Delhi</option>
                </select>
              </div>
              <div className="dr-nandani-form-row">
                <select required>
                  <option>Select Services</option>
                  <option>Hair Transplant</option>
                  <option>Mesogrow Treatment</option>
                  <option>Advanced HGP</option>
                  <option>Hair Loss Consultation</option>
                </select>
              </div>
              <textarea placeholder="Message" rows="4"></textarea>
              <button type="submit" className="dr-nandani-cta-btn">Send Request</button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutDrNandani;

