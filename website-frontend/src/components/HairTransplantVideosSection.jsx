"use client";

import React, { useState } from "react";
import { Play, X } from "lucide-react";

const videos = [
  {
    title: "P-R-P Vs Hair Transplant ? | Best Treatment for Hairloss | Dr. Nandini Dadu",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Female Hair Transplant | Good or Bad ? | Dadu Medical Centre",
    thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "First 14 Days After Hair Transplant | Dos and Don'ts | Dr. Nandini Dadu",
    thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export default function HairTransplantVideosSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="hair-transplant-videos-section">
      <div className="hair-transplant-videos-container">
        <h2 className="hair-transplant-videos-heading">VIDEOS</h2>

        <div className="hair-transplant-videos-grid">
          {videos.map((video) => (
            <button
              type="button"
              className="hair-transplant-video-card"
              key={video.title}
              onClick={() => setActiveVideo(video)}
            >
              <div className="hair-transplant-video-thumb">
                <img src={video.thumbnail} alt={video.title} loading="lazy" />
                <span className="hair-transplant-video-play">
                  <Play size={20} fill="currentColor" />
                </span>
              </div>
              <h3>{video.title}</h3>
            </button>
          ))}
        </div>

        <button className="hair-transplant-videos-view-more" type="button">
          <span>VIEW MORE</span>
          <span className="hair-transplant-videos-view-more-arrow" aria-hidden="true">
            <img
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
              alt=""
              className="hair-transplant-videos-view-more-arrow-icon"
            />
          </span>
        </button>
      </div>

      {activeVideo && (
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
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
