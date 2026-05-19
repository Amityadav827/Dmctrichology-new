import React from "react";

const results = [
  {
    title: "Korean Facial Illumination",
    beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png",
    afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png",
    sessions: "After 6 sessions",
  },
  {
    title: "Acne Arrestor Facial With Salicylic Peel",
    beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png",
    afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png",
    sessions: "After 4 sessions",
  },
  {
    title: "Elastin Boost Facial",
    beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png",
    afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png",
    sessions: "After 5 sessions",
  },
  {
    title: "Derma Revive Facial",
    beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png",
    afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png",
    sessions: "After 4 sessions",
  },
];

export default function HairTransplantResultsSection() {
  return (
    <section className="hair-transplant-results-section">
      <div className="hair-transplant-results-container">
        <div className="hair-transplant-results-kicker">
          <span></span>
          BEFORE AND AFTER
        </div>
        <h2 className="hair-transplant-results-heading">
          RESULTS THAT SPEAK FOR THEMSELVES
        </h2>

        <div className="hair-transplant-results-grid">
          {results.map((item) => (
            <article className="hair-transplant-results-card" key={item.title}>
              <h3 className="hair-transplant-results-title">{item.title}</h3>
              <div className="hair-transplant-results-images">
                <div className="hair-transplant-results-image-box">
                  <img src={item.beforeImg} alt={`${item.title} before`} loading="lazy" />
                  <span>Before</span>
                </div>
                <div className="hair-transplant-results-image-box">
                  <img src={item.afterImg} alt={`${item.title} after`} loading="lazy" />
                  <span>After</span>
                </div>
              </div>
              <p className="hair-transplant-results-sessions">{item.sessions}</p>
            </article>
          ))}
        </div>

        <div className="hair-transplant-results-action">
          <button className="hair-transplant-results-btn" type="button">
            <span>VIEW ALL</span>
            <span className="hair-transplant-results-btn-arrow" aria-hidden="true">
              <img
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
                alt=""
                className="hair-transplant-results-btn-arrow-icon"
              />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
