"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function HairTransplantResultsSection({ data }) {
  if (!data || data?.isVisible === false) return null;

  const baseCards = data?.cards || [];
  if (!Array.isArray(baseCards) || baseCards.length === 0) return null;
  // Duplicate slides so Swiper loop works with both nav buttons (needs slidesPerView*2 minimum)
  const cards = baseCards.length < 8 ? [...baseCards, ...baseCards] : baseCards;

  return (
    <section className="hair-transplant-results-section">
      <div className="hair-transplant-results-container">
        <span className="dmc-kicker" style={{ justifyContent: "center", display: "flex" }}>
          {data?.subtitle || "BEFORE AND AFTER"}
        </span>
        <h2 className="dmc-heading" style={{ textAlign: "center", marginBottom: "40px" }}>
          {data?.title || "RESULTS THAT SPEAK FOR THEMSELVES"}
        </h2>

        <div style={{ position: "relative", padding: "0 10px" }}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = ".htr-prev";
              swiper.params.navigation.nextEl = ".htr-next";
            }}
            navigation={{
              prevEl: ".htr-prev",
              nextEl: ".htr-next",
            }}
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            style={{ padding: "10px 4px 20px" }}
          >
            {cards.map((item, idx) => {
              if (!item) return null;
              return (
                <SwiperSlide key={idx}>
                  <article className="hair-transplant-results-card">
                    <h3 className="hair-transplant-results-title">{item?.title || ""}</h3>
                    <div className="hair-transplant-results-images">
                      <div className="hair-transplant-results-image-box">
                        {item?.beforeImg ? (
                          <img src={item.beforeImg} alt={item?.title || "before"} loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">No Image</div>
                        )}
                        <span>Before</span>
                      </div>
                      <div className="hair-transplant-results-image-box">
                        {item?.afterImg ? (
                          <img src={item.afterImg} alt={item?.title || "after"} loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">No Image</div>
                        )}
                        <span>After</span>
                      </div>
                    </div>
                    {item?.sessions && <p className="hair-transplant-results-sessions">{item.sessions}</p>}
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Nav buttons — CSS class based, same pattern as working sliders */}
          <button className="htr-nav-btn htr-prev" aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="htr-nav-btn htr-next" aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {(data?.buttonText || data?.buttonLink) && (
          <div className="hair-transplant-results-action">
            <button
              onClick={() => { if (data?.buttonLink) window.location.href = data.buttonLink; }}
              className="hair-transplant-results-btn"
              type="button"
            >
              <span>{data?.buttonText || "VIEW ALL"}</span>
              <span className="hair-transplant-results-btn-arrow" aria-hidden="true">
                <img
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
                  alt=""
                  className="hair-transplant-results-btn-arrow-icon"
                />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
