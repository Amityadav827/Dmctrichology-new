"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { fetchPressMedia } from "../services/api";
import EditableSection from "./Editable/EditableSection";
import EditableText from "./Editable/EditableText";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

export default function PressMediaSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchPressMedia();
      if (res?.success) {
        setData(res.data);
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === "press-media-section") {
        const { fieldPath, value } = e.detail;
        setData((prev) => {
          if (!prev) return prev;
          const newData = { ...prev };
          if (fieldPath.includes(".")) {
            const parts = fieldPath.split(".");
            let curr = newData;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = value;
          } else {
            newData[fieldPath] = value;
          }
          return newData;
        });
      }
    };

    window.addEventListener("cms-update", handleCmsUpdate);
    return () => window.removeEventListener("cms-update", handleCmsUpdate);
  }, []);

  if (data !== null && data?.enabled === false) return null;

  const heading = data?.heading || "What The Press And Media Are Saying About Our Clinic";
  const ratingText = data?.ratingText || "225+ Satisfied Patients";
  const patientCountText = data?.patientCountText || "5000+ Satisfied Patients";
  const button = data?.button || { text: "Get Free Consulting", link: "/media" };
  const generatedAvatars = [
    { image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081533_e6490b2d-e5d7-41c2-95d8-96f3067b0f1e.png" },
    { image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081539_746b3b54-ef32-4750-bbdd-f16e0347e0aa.png" },
    { image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081544_1ed8500d-e5f3-41f7-bb92-174bbdbbbbf0.png" },
    { image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DhqmopiNve9pSuyMJA0Ki49qEA/hf_20260525_081548_0203dc40-c362-4848-9f49-1bb4c51954a4.png" }
  ];
  const dbAvatars = data?.avatars || [];
  const allSame = dbAvatars.length > 0 && dbAvatars.every(a => a.image === dbAvatars[0].image);
  const avatars = (dbAvatars.length > 0 && !allSame) ? dbAvatars : generatedAvatars;

  const logos = (data?.mediaLogos || []).length > 0 ? data.mediaLogos.map(l => l.image) : [
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/rervxi6jq1fl20lu2fps.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/pvyogcawczl9mv7wb82v.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/tixdm9gnhknxtwvlj3xd.png"
  ];

  // Duplicate logos for a smoother infinite effect
  const sliderLogos = [...logos, ...logos, ...logos];

  return (
    <EditableSection sectionId="press-media-section" label="Press & Media Section">
      <section style={{ padding: '60px 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="press-media-card" style={{ 
            backgroundColor: '#3B5998', 
            borderRadius: '30px', 
            padding: '40px',
            position: 'relative'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              
              {/* Left Side: Heading + Rating */}
              <div style={{ flex: '1.2', minWidth: '350px' }}>
                <h2 className="section-title press-media-title" style={{ margin: '0 0 50px 0', maxWidth: '650px', color: '#fff' }}>
                  <EditableText sectionId="press-media-section" fieldPath="heading" tag="span">
                    {heading}
                  </EditableText>
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginTop: '10px' }}>
                  {/* Avatars */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {avatars.map((av, i) => (
                      <div key={i} style={{ 
                        width: '54px', 
                        height: '54px', 
                        borderRadius: '50%', 
                        border: '3px solid #3B5998',
                        marginLeft: i === 0 ? '0' : '-18px',
                        overflow: 'hidden',
                        backgroundColor: '#E5E5E5'
                      }}>
                        <img src={av.image} alt="patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>

                  {/* Rating Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#fff', fontFamily: "'Marcellus', serif" }}>
                      <EditableText sectionId="press-media-section" fieldPath="ratingText" tag="span">
                        {ratingText}
                      </EditableText>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <img 
                          key={s} 
                          src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png" 
                          alt="star" 
                          style={{ width: '20px', height: '20px' }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Button + Logo Slider */}
              <div style={{ 
                flex: '1', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end', 
                gap: '40px',
                minWidth: '350px'
              }}>
                <button className="free-consult-btn" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  backgroundColor: '#EDEEF8',
                  color: '#3B5998',
                  padding: '10px 10px 10px 30px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: "'Marcellus', serif",
                  marginTop: '0px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <EditableText sectionId="press-media-section" fieldPath="button.text" tag="span">
                    {button.text}
                  </EditableText>
                  <div className="arrow-container" style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#486A91',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                  }}>
                     <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" className="btn-arrow-icon" style={{ width: '18px', filter: 'brightness(0) invert(1)' }} />
                  </div>
                </button>

                {/* Logo Slider Wrapper */}
                <div style={{ 
                  width: '100%',
                  marginTop: '40px',
                  overflow: 'hidden'
                }}>
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    loop={true}
                    speed={2000}
                    autoplay={{
                      delay: 0,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    breakpoints={{
                      320: { slidesPerView: 1, spaceBetween: 20 },
                      480: { slidesPerView: 1.5, spaceBetween: 25 },
                      768: { slidesPerView: 2, spaceBetween: 30 },
                      1024: { slidesPerView: 2.5, spaceBetween: 30 }
                    }}
                    style={{ width: '100%' }}
                  >
                    {sliderLogos.map((url, i) => (
                      <SwiperSlide key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={url} alt="media logo" style={{ maxHeight: '55px', maxWidth: '100%', objectFit: 'contain' }} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

            </div>
          </div>
        </div>

        <style jsx>{`
          .press-media-card {
            box-shadow: 0 24px 60px rgba(59, 89, 152, 0.18);
          }
          .press-media-title :global(*) {
            color: #fff !important;
          }
          .free-consult-btn:hover {
            transform: none !important;
            background-color: #fff !important;
            color: #3B5998 !important;
            box-shadow: 0 14px 30px rgba(15, 35, 79, 0.24) !important;
          }
          .free-consult-btn:hover .arrow-container {
            background-color: #3B5998 !important;
          }
          .free-consult-btn:hover .arrow-container {
            transform: rotate(45deg) !important;
          }
          :global(.swiper-wrapper) {
            transition-timing-function: linear !important;
          }
          @media (max-width: 768px) {
            div[style*="flexDirection: column"] { alignItems: center !important; }
            .section-title { text-align: center !important; margin-bottom: 30px !important; font-size: 28px !important; }
            div[style*="alignItems: center"] { justify-content: center !important; }
            div[style*="marginTop: 40px"] { margin-top: 20px !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
