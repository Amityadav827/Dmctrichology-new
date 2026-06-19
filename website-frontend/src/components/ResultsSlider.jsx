"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchResultsSlider } from '../services/api';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const defaultResults = [
  { id: 1, title: 'Korean Facial Illumination', beforeImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962132671-dvy3knew0pzq1gg8fr8q.png', afterImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962133782-uttbdof06l4xbpvexlv9.png', sessions: 'After 6 sessions' },
  { id: 2, title: 'Acne Arrestor Facial With Salicylic Peel', beforeImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962128093-g7fs5kfpckmmcjwg5sk0.png', afterImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962131881-zxyvkmr0uf8pf5qxgfvf.png', sessions: 'After 4 sessions' },
  { id: 3, title: 'Elastin Boost Facial', beforeImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962131147-meeed3zg8w5j3xhkcfxc.png', afterImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962129505-w6qder12vvhxrbhzskgw.png', sessions: 'After 5 sessions' },
  { id: 4, title: 'Derma Revive Facial', beforeImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962128773-dh6webh6x4l7qfrlzxtl.png', afterImg: 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962134454-bif89jyygbycclg8qa92.png', sessions: 'After 4 sessions' }
];

export default function ResultsSlider() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchResultsSlider().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  if (data && data.enabled === false) return null;

  const heading = data ? (data.heading || '') : 'Results that speak for themselves';
  const bgColor = '#E8EAF6';

  const safeResults = Array.isArray(data?.results) ? data.results : null;
  const activeResults = (safeResults && safeResults.length > 0)
    ? safeResults.filter(r => r.enabled !== false)
    : defaultResults;

  // Duplicate slides so Swiper loop has enough for both nav directions (needs slidesPerView*2 minimum)
  const baseItems = activeResults.length > 0 ? activeResults : defaultResults;
  const displayItems = baseItems.length < 8 ? [...baseItems, ...baseItems] : baseItems;

  return (
    <EditableSection sectionId="results-slider" label="Before & After Results">
      <section className="results-section" style={{ backgroundColor: bgColor, padding: '60px 5% 40px', position: 'relative', overflow: 'hidden' }}>
        <div className="results-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '50px' }}>
            <h2 className="section-title">
              <EditableText sectionId="results-slider" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
          </div>

          <div className="slider-wrapper" style={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = '.results-prev-btn';
                swiper.params.navigation.nextEl = '.results-next-btn';
              }}
              navigation={{
                nextEl: '.results-next-btn',
                prevEl: '.results-prev-btn',
              }}
              loop={displayItems.length >= 4}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1300: { slidesPerView: 4 },
              }}
              className="results-swiper"
              style={{ padding: '20px 0 60px' }}
            >
              {displayItems.map((result, index) => {
                const realIndex = index % baseItems.length;
                return (
                  <SwiperSlide key={index}>
                    <Link href="/results" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                    <div className="result-card" style={{
                      backgroundColor: '#A8B7CA', 
                      borderRadius: '16px', 
                      padding: '24px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      boxShadow: '0px 2.61px 7.84px 0px #4A46460D',
                      transition: 'transform 0.3s ease'
                    }}>
                      <h3 style={{ 
                        fontSize: '14px', 
                        marginBottom: '24px', 
                        fontFamily: "'Marcellus', serif",
                        fontWeight: '600',
                        color: '#333333',
                        minHeight: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: '1.4'
                      }}>
                        <EditableText sectionId="results-slider" fieldPath={`results.${realIndex}.title`} tag="span">
                          {result.title}
                        </EditableText>
                      </h3>

                      <div className="images-container" style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        width: '100%',
                        marginBottom: '20px'
                      }}>
                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                          <img 
                            src={result.beforeImg} 
                            alt={`${result.title} Before`} 
                            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} 
                          />
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '0', 
                            left: '0', 
                            right: '0', 
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            color: '#fff', 
                            fontSize: '12px',
                            padding: '10px 0',
                            fontWeight: '500'
                          }}>Before</div>
                        </div>
                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                          <img 
                            src={result.afterImg} 
                            alt={`${result.title} After`} 
                            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} 
                          />
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '0', 
                            left: '0', 
                            right: '0', 
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            color: '#fff', 
                            fontSize: '12px',
                            padding: '10px 0',
                            fontWeight: '500'
                          }}>After</div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        fontSize: '15px', 
                        color: '#666', 
                        fontFamily: "'Marcellus', serif",
                        fontWeight: '500'
                      }}>
                        <EditableText sectionId="results-slider" fieldPath={`results.${realIndex}.sessions`} tag="span">
                          {result.sessions}
                        </EditableText>
                      </p>
                    </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="results-prev-btn" style={{
              position: 'absolute',
              left: '-25px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              color: '#333333',
              transition: 'all 0.3s ease'
            }}>
              <ChevronLeft size={24} />
            </button>
            <button className="results-next-btn" style={{
              position: 'absolute',
              right: '-25px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              color: '#333333',
              transition: 'all 0.3s ease'
            }}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <style jsx>{`
          .results-prev-btn:hover, .results-next-btn:hover {
            background-color: #000 !important;
            color: #fff !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          .result-card:hover {
            transform: translateY(-10px);
          }
          @media (max-width: 1024px) {
            .results-prev-btn, .results-next-btn {
              display: block !important;
            }
            .results-section {
              padding: 60px 5% !important;
            }
            .result-card {
              padding: 20px !important;
            }
            .images-container img {
              height: clamp(170px, 24vw, 220px) !important;
            }
          }
          @media (max-width: 767px) {
            .results-section {
              padding: 48px 16px 36px !important;
            }
            .results-prev-btn,
            .results-next-btn {
              width: 42px !important;
              height: 42px !important;
              top: 44% !important;
            }
            .results-prev-btn { left: 6px !important; }
            .results-next-btn { right: 6px !important; }
            .results-section .section-header {
              margin-bottom: 28px !important;
            }
            .results-section .section-title {
              font-size: 26px !important;
              line-height: 1.12 !important;
            }
            .result-card {
              border-radius: 14px !important;
              padding: 16px !important;
            }
            .result-card h3 {
              min-height: auto !important;
              margin-bottom: 16px !important;
            }
            .images-container {
              gap: 8px !important;
              margin-bottom: 14px !important;
            }
            .images-container img {
              height: 190px !important;
            }
          }
          @media (max-width: 390px) {
            .images-container img {
              height: 160px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
