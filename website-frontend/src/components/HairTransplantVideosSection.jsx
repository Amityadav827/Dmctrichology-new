"use client";

import React, { useState } from "react";
import { Play, X } from "lucide-react";

export default function HairTransplantVideosSection({ data }) {
  const [activeVideo, setActiveVideo] = useState(null);

  if (!data || data?.isVisible === false) return null;

  const videos = data?.videos || [];
  if (!Array.isArray(videos) || videos.length === 0) return null;

  return (
    <section className="hair-transplant-videos-section">
      <div className="hair-transplant-videos-container">
        <h2 className="hair-transplant-videos-heading">
          {data?.title || "VIDEOS"}
        </h2>

        <div className="hair-transplant-videos-grid">
          {videos.map((video, idx) => {
            if (!video) return null;
            return (
              <button
                type="button"
                className="hair-transplant-video-card"
                key={idx}
                onClick={() => setActiveVideo(video)}
              >
                <div className="hair-transplant-video-thumb">
                  {video?.thumbnail ? (
                    <img src={video.thumbnail} alt={video?.title || 'video'} loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">No Image</div>
                  )}
                  <span className="hair-transplant-video-play">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>
                <h3>{video?.title || ""}</h3>
              </button>
            );
          })}
        </div>

        {(data?.buttonText || data?.buttonLink) && (
          <button 
            onClick={() => {
              if (data?.buttonLink) {
                window.location.href = data.buttonLink;
              }
            }} 
            className="hair-transplant-videos-view-more" 
            type="button"
          >
            <span>{data?.buttonText || "VIEW MORE"}</span>
            <span className="hair-transplant-videos-view-more-arrow" aria-hidden="true">
              <img
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
                alt=""
                className="hair-transplant-videos-view-more-arrow-icon"
              />
            </span>
          </button>
        )}
      </div>

      {activeVideo && activeVideo?.videoUrl && (
        <div className="hair-transplant-video-modal" onClick={() => setActiveVideo(null)}>
          <div className="hair-transplant-video-modal-inner" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="hair-transplant-video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              <X size={22} />
            </button>
            <iframe
              src={`${activeVideo.videoUrl}?autoplay=1`}
              title={activeVideo?.title || "Video Player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
