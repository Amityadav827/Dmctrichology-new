"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight, Play, Youtube } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DUMMY_VIDEOS = [
  {
    title: "FUE Process Explained",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    isYoutubeStyleButtonEnabled: true
  },
  {
    title: "Patient Success Story",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    isYoutubeStyleButtonEnabled: true
  },
  {
    title: "Technology at DMC",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    isYoutubeStyleButtonEnabled: false
  },
  {
    title: "Clinic Walkthrough",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    isYoutubeStyleButtonEnabled: true
  }
];

const ServiceIntro = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [activeVideo, setActiveVideo] = useState(null);
  const swiperRef = useRef(null);

  // Sync from props
  useEffect(() => {
    if (data) setIntroData(data);
  }, [data]);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...introData };
      
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('service-intro.intro.')) {
          const fieldPath = key.replace('service-intro.intro.', '');
          
          // Handle nested updates (e.g., sliderSettings.autoplay)
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let current = nextData;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = siteConfig[key];
          } else {
            nextData[fieldPath] = siteConfig[key];
          }
          hasUpdates = true;
        }
      });

      if (hasUpdates) setIntroData(nextData);
    }
  }, [isEditMode, siteConfig]);

  const intro = introData.intro || introData; // Handle both cases where intro is nested or top-level
  const videos = intro.videos?.length > 0 ? intro.videos : DUMMY_VIDEOS;
  const benefits = intro.benefits || [];
  const sliderSettings = intro.sliderSettings || { autoplay: true, autoplaySpeed: 5000, showDots: true, loopVideos: true };
  const buttonSettings = intro.buttonSettings || { floatingButtonIcon: 'play', floatingButtonPosition: 'bottom-right' };

  return (
    <EditableSection sectionId="service-intro" label="Service Details Intro">
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* ─── LEFT SIDE: Video Slider ─────────────────── */}
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                {/* Main Slider Container */}
                <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-slate-100 aspect-[16/10] md:aspect-auto md:h-[500px]">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={sliderSettings.loopVideos}
                    autoplay={sliderSettings.autoplay ? { delay: sliderSettings.autoplaySpeed, disableOnInteraction: false } : false}
                    pagination={sliderSettings.showDots ? { clickable: true, el: '.custom-swiper-pagination' } : false}
                    className="h-full w-full"
                  >
                    {videos.map((video, index) => (
                      <SwiperSlide key={index} className="relative h-full w-full">
                        <div className="relative h-full w-full">
                          {activeVideo === index ? (
                            <div className="absolute inset-0 bg-black z-20">
                              <iframe
                                src={`${video.videoUrl.includes('?') ? video.videoUrl : video.videoUrl + '?'}autoplay=1&rel=0&modestbranding=1`}
                                title={video.title || "Service Video"}
                                className="w-full h-full border-none"
                                allow="autoplay; encrypted-media; fullscreen"
                                allowFullScreen
                              />
                              <button 
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-6 right-6 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-all"
                              >
                                <ChevronLeft className="rotate-180" size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className="relative h-full w-full cursor-pointer group/slide" onClick={() => setActiveVideo(index)}>
                              <img 
                                src={video.thumbnail || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                                alt={video.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/slide:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/slide:opacity-80 transition-opacity"></div>
                              
                              {/* Central Play Button */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover/slide:scale-100 transition-all duration-300">
                                <Play fill="#1e293b" className="text-slate-800 ml-1" size={32} />
                              </div>

                              {/* Floating Youtube Style Button */}
                              {video.isYoutubeStyleButtonEnabled && (
                                <div className={`absolute ${buttonSettings.floatingButtonPosition === 'bottom-right' ? 'bottom-8 right-8' : 'bottom-8 left-8'} z-10 animate-bounce-slow`}>
                                  <div className="bg-red-600 p-3 rounded-2xl shadow-[0_10px_20px_rgba(220,38,38,0.4)] flex items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                                    <Youtube className="text-white" size={20} />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest hidden md:block">Watch Now</span>
                                  </div>
                                </div>
                              )}

                              {/* Slide Title */}
                              {video.title && (
                                <div className="absolute bottom-8 left-8 right-8 text-white z-10 pointer-events-none">
                                  <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Slide {index + 1}</p>
                                  <h4 className="text-lg font-bold">{video.title}</h4>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Pagination Dots (Bottom Center) */}
                {sliderSettings.showDots && (
                  <div className="flex justify-center mt-8">
                    <div className="custom-swiper-pagination !static !flex !gap-2 !w-auto"></div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT SIDE: Content ───────────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              {/* Badge */}
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  <EditableText sectionId="service-intro" fieldPath="intro.badgeText">
                    {intro.badgeText || intro.badge || 'HAIR TREATMENT'}
                  </EditableText>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                <EditableText sectionId="service-intro" fieldPath="intro.title">
                  {intro.title || 'Follicular Unit Extraction (FUE)'}
                </EditableText>
              </h1>

              {/* Meta Stats */}
              <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="#fbbf24" className="text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    <EditableText sectionId="service-intro" fieldPath="intro.rating">
                      {intro.rating || '4.85'}
                    </EditableText>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={16} />
                  <span className="text-sm font-bold uppercase tracking-tight">
                    <EditableText sectionId="service-intro" fieldPath="intro.duration">
                      {intro.duration || '180 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6 mb-10">
                <div className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed italic">
                  <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                    {intro.shortDescription || intro.subTitle || 'Safe, smart & skin-friendly hair repair'}
                  </EditableText>
                </div>
                <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                  <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                    {intro.longDescription || intro.description || 'FUE is one of the most popular and limited modern procedure techniques for hair repair.'}
                  </EditableText>
                </p>
              </div>

              {/* Benefits Checklist */}
              {benefits.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #1e293b;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </EditableSection>
  );
};

export default ServiceIntro;
