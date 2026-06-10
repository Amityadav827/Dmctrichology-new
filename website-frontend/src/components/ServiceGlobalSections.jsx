"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Minus, Play, Plus } from "lucide-react";

function renderRichText(value = "") {
  return String(value)
    .split(/\n{2,}/)
    .map(part => part.trim())
    .filter(Boolean)
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

function normalizeMedia(items = []) {
  return (Array.isArray(items) ? items : [])
    .filter(item => item && item.isVisible !== false && (item.url || item.thumbnail))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(item => ({
      type: item.type || (String(item.url || "").match(/\.(mp4|webm|ogg)(\?|$)/i) ? "video" : "image"),
      url: item.url || "",
      thumbnail: item.thumbnail || item.url || "",
      alt: item.alt || item.title || "",
      title: item.title || ""
    }));
}

function ServiceSectionOne({ data }) {
  const media = normalizeMedia(data.media);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [data]);

  useEffect(() => {
    if (videoRef.current && media[activeIndex]?.type === "video") {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex, media]);

  if (!data || data.isVisible === false) return null;

  const current = media[activeIndex] || null;
  const canSlide = media.length > 1;
  const previous = () => setActiveIndex(index => (index - 1 + media.length) % media.length);
  const next = () => setActiveIndex(index => (index + 1) % media.length);

  return (
    <section className="service-global-section service-section-one">
      <div className="service-global-container service-section-one-grid">
        <div className="service-section-one-media">
          <div className="service-section-one-frame">
            {current ? (
              current.type === "video" ? (
                <video
                  ref={videoRef}
                  className="service-section-one-media-el"
                  src={current.url}
                  poster={current.thumbnail}
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <img className="service-section-one-media-el" src={current.url || current.thumbnail} alt={current.alt || data.title || ""} loading="lazy" />
              )
            ) : (
              <div className="service-section-one-empty" />
            )}

            {canSlide && (
              <>
                <button className="service-section-one-arrow left" onClick={previous} aria-label="Previous media">
                  <ChevronLeft size={20} />
                </button>
                <button className="service-section-one-arrow right" onClick={next} aria-label="Next media">
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {current?.type === "video" && (
              <span className="service-section-one-play" aria-hidden="true">
                <Play size={15} fill="currentColor" />
              </span>
            )}
          </div>

          {media.length > 1 && (
            <div className="service-section-one-dots" aria-label="Media slides">
              {media.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  className={index === activeIndex ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="service-section-one-content">
          {data.label && <span className="dmc-kicker">{data.label}</span>}
          {data.title && <h2 className="dmc-heading">{data.title}</h2>}
          {data.description && <div className="service-section-one-description">{renderRichText(data.description)}</div>}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionTwo({ data }) {
  if (!data || data.isVisible === false) return null;

  const points = (data.points || [])
    .filter(point => point && point.isVisible !== false && String(point.text || point.pointText || "").trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (!data.title && points.length === 0 && !data.image) return null;

  return (
    <section className="service-global-section service-section-two">
      <div className="service-global-container service-section-two-grid">
        <div className="service-section-two-content">
          {data.badge && <span className="service-section-two-badge">{data.badge}</span>}
          {data.title && <h2>{data.title}</h2>}
          {points.length > 0 && (
            <ul>
              {points.map((point, index) => (
                <li key={point.id || index}>{point.text || point.pointText}</li>
              ))}
            </ul>
          )}
        </div>
        {data.image && (
          <div className="service-section-two-image-wrap">
            <img src={data.image} alt={data.title || "Service detail"} loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceSectionThree({ data }) {
  if (!data || data.isVisible === false) return null;

  const candidates = (data.candidates || [])
    .filter(item => item && item.isVisible !== false && String(item.text || item.candidateText || "").trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (!data.title && candidates.length === 0 && !data.image && !data.ctaTitle) return null;

  return (
    <section className="service-global-section service-section-three">
      <div className="service-global-container service-section-three-panel">
        <div className="service-section-three-card">
          {data.title && <h2>{data.title}</h2>}
          {data.subtitle && <p className="service-section-three-subtitle">{data.subtitle}</p>}
          {candidates.length > 0 && (
            <div className="service-section-three-list-box">
              <h3>Ideal Candidates</h3>
              <ul>
                {candidates.map((candidate, index) => (
                  <li key={candidate.id || index}>{candidate.text || candidate.candidateText}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="service-section-three-cta">
          {data.ctaTitle && <h3>{data.ctaTitle}</h3>}
          {data.image && <img src={data.image} alt={data.ctaTitle || data.title || "Consultation"} loading="lazy" />}
          {data.ctaDescription && <p>{data.ctaDescription}</p>}
          {data.ctaButtonText && (
            <a href={data.ctaButtonLink || '/contact-us'} className="service-section-three-button">
              {data.ctaButtonText}
              <span className="service-section-three-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionFour({ data }) {
  const steps = (data.processSteps || [])
    .filter(step => step && step.isVisible !== false && (step.title || step.description || step.image))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const trackRef = useRef(null);

  if (!data || data.isVisible === false || steps.length === 0) return null;

  const scrollCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector(".service-section-four-card");
    const cardWidth = firstCard?.getBoundingClientRect().width || track.clientWidth / 4;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

    track.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth"
    });
  };

  return (
    <section className="service-global-section service-section-four">
      <div className="service-global-container service-section-four-inner">
        {data.title && <h2>{data.title}</h2>}
        <div className="service-section-four-slider">
          {steps.length > 4 && (
            <button className="service-global-carousel-arrow left" onClick={() => scrollCards(-1)} aria-label="Previous process steps">
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="service-section-four-track" ref={trackRef}>
            {steps.map((step, index) => (
              <article className="service-section-four-card" key={step.id || `${step.title}-${index}`}>
                {step.image && <img src={step.image} alt={step.title || "Process step"} loading="lazy" />}
                {step.title && <h3>{step.title}</h3>}
                {step.description && <p>{step.description}</p>}
              </article>
            ))}
          </div>
          {steps.length > 4 && (
            <button className="service-global-carousel-arrow right" onClick={() => scrollCards(1)} aria-label="Next process steps">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionFive({ data }) {
  if (!data || data.isVisible === false) return null;
  if (!data.title && !data.description && !data.image) return null;

  return (
    <section className="service-global-section service-section-five">
      <div className="service-global-container service-section-five-grid">
        {data.image && (
          <div className="service-section-five-image-wrap">
            <img src={data.image} alt={data.title || "Service detail"} loading="lazy" />
          </div>
        )}
        <div className="service-section-five-content">
          {data.badge && <span className="dmc-kicker">{data.badge}</span>}
          {data.title && <h2>{data.title}</h2>}
          {data.description && <div className="service-section-five-description">{renderRichText(data.description)}</div>}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionSix({ data, resultsFallback, suppressBeforeAfter }) {
  // Always show the homepage Results Slider data (single source for every service page).
  const homepageResults = (Array.isArray(resultsFallback?.cards) && resultsFallback.cards.length > 0)
    ? [...resultsFallback.cards, ...resultsFallback.cards].map((c, i) => ({
        id: `home-${i}`,
        title: c.title,
        beforeImage: c.beforeImg,
        afterImage: c.afterImg,
        description: c.sessions,
        isVisible: true,
        sortOrder: i
      }))
    : null;

  const sourceResults = homepageResults || data.results || [];
  const results = sourceResults
    .filter(result => result && result.isVisible !== false && (result.title || result.beforeImage || result.afterImage || result.description))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const trackRef = useRef(null);

  // When the dedicated results section (HairTransplantResultsSection) is active, it already
  // shows the homepage before/after data — skip this one to avoid a duplicate section.
  if (suppressBeforeAfter || !data || data.isVisible === false || results.length === 0) return null;

  const scrollCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector(".service-section-six-card");
    const cardWidth = firstCard?.getBoundingClientRect().width || track.clientWidth / 4;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

    track.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth"
    });
  };

  return (
    <section className="service-global-section service-section-six">
      <div className="service-global-container service-section-six-inner">
        {data.title && <h2>{data.title}</h2>}
        <div className="service-section-six-slider">
          {results.length > 4 && (
            <button className="service-global-carousel-arrow left solid" onClick={() => scrollCards(-1)} aria-label="Previous results">
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="service-section-six-track" ref={trackRef}>
            {results.map((result, index) => (
              <a
                href="/results"
                className="service-section-six-card"
                key={result.id || `${result.title}-${index}`}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                {result.title && <h3>{result.title}</h3>}
                <div className="service-section-six-images">
                  <div>
                    {result.beforeImage && <img src={result.beforeImage} alt={`${result.title || "Result"} before`} loading="lazy" />}
                    <span>Before</span>
                  </div>
                  <div>
                    {result.afterImage && <img src={result.afterImage} alt={`${result.title || "Result"} after`} loading="lazy" />}
                    <span>After</span>
                  </div>
                </div>
                {result.description && <p>{result.description}</p>}
              </a>
            ))}
          </div>
          {results.length > 4 && (
            <button className="service-global-carousel-arrow right solid" onClick={() => scrollCards(1)} aria-label="Next results">
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionSeven({ data }) {
  if (!data || data.isVisible === false) return null;

  const beforePoints = (data.beforePoints || [])
    .filter(point => point && point.isVisible !== false && String(point.text || point.pointText || "").trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const afterPoints = (data.afterPoints || [])
    .filter(point => point && point.isVisible !== false && String(point.text || point.pointText || "").trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (!data.beforeTitle && !data.afterTitle && beforePoints.length === 0 && afterPoints.length === 0) return null;

  const renderCard = (title, points) => (
    <article className="service-section-seven-card">
      {title && <h2>{title}</h2>}
      {points.length > 0 && (
        <ul>
          {points.map((point, index) => (
            <li key={point.id || index}>{point.text || point.pointText}</li>
          ))}
        </ul>
      )}
    </article>
  );

  return (
    <section className="service-global-section service-section-seven">
      <div className="service-global-container service-section-seven-panel">
        {renderCard(data.beforeTitle || "Before Treatment", beforePoints)}
        {renderCard(data.afterTitle || "After Treatment", afterPoints)}
      </div>
    </section>
  );
}

function ServiceSectionEight({ data, service, pageSlug }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", service: "", date: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    setOpenFaqIndex(0);
  }, [data]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!data || data.isVisible === false) return null;

  const faqs = (data.faqs || [])
    .filter(faq => faq && faq.isVisible !== false && (faq.question || faq.answer))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const serviceOptions = (
    service?.enquirySection?.serviceOptions?.length
      ? service.enquirySection.serviceOptions
      : service?.faqEnquiry?.serviceOptions?.length
        ? service.faqEnquiry.serviceOptions
        : ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"]
  );

  if (!data.title && faqs.length === 0 && !data.formTitle) return null;

  const resetMessages = () => {
    if (success) setSuccess(false);
    if (error) setError("");
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSuccess(false);

    if (!formData.name.trim()) return setError("Please enter your name.");
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return setError("Please enter a valid email address.");
    if (!formData.service) return setError("Please select a type of service.");
    if (!formData.date) return setError("Please select a date.");

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: "0000000000",
        enquiry_type: formData.service,
        preferred_date: formData.date,
        service_slug: pageSlug || "unknown",
        source: "service-details-enquiry",
        message: `Treatment Enquiry for: ${formData.service}\nPreferred Date: ${formData.date}\nService Slug: ${pageSlug || "unknown"}`
      };
      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal ? "http://localhost:10000/api" : "https://dmctrichology-1.onrender.com/api");
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", service: "", date: "" });
      } else {
        setError(result.message || "Failed to submit enquiry.");
      }
    } catch (err) {
      console.error("Error submitting section 8 enquiry form:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="service-global-section service-section-eight">
      <div className="service-global-container service-section-eight-grid">
        <div className="service-section-eight-left">
          {data.title && <h2>{data.title}</h2>}
          {data.introText && <p className="service-section-eight-intro">{data.introText}</p>}
          <div className="service-section-eight-faqs">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div className={`service-section-eight-faq ${isOpen ? "open" : ""}`} key={faq.id || index}>
                  <button type="button" onClick={() => setOpenFaqIndex(isOpen ? null : index)}>
                    <span>{index + 1}. {faq.question}</span>
                    <span className="service-section-eight-faq-icon">{isOpen ? <Minus size={14} /> : <Plus size={14} />}</span>
                  </button>
                  <div className="service-section-eight-answer" style={{ maxHeight: isOpen ? "220px" : "0", opacity: isOpen ? 1 : 0 }}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="service-section-eight-form-card">
          {data.formTitle && <h3>{data.formTitle}</h3>}
          <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name*" disabled={loading} required />
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="E-Mail Address*" disabled={loading} required />
            <div className="service-section-eight-select" ref={selectRef}>
              <button type="button" onClick={() => !loading && setDropdownOpen(open => !open)} disabled={loading}>
                <span>{formData.service || "Type Of Service Enquiry*"}</span>
                <ChevronDown size={15} />
              </button>
              {dropdownOpen && (
                <div className="service-section-eight-select-menu">
                  {serviceOptions.map((option, index) => (
                    <button
                      type="button"
                      key={`${option}-${index}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, service: option }));
                        setDropdownOpen(false);
                        resetMessages();
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input name="date" type="datetime-local" value={formData.date} onChange={handleInputChange} disabled={loading} required />
            <button className="service-section-eight-submit" type="submit" disabled={loading}>
              <span>{loading ? "Submitting..." : (data.buttonText || "Schedule Your Visit")}</span>
              <span><ExternalLink size={13} /></span>
            </button>
            {error && <p className="service-section-eight-error">{error}</p>}
            {success && <p className="service-section-eight-success">Enquiry submitted successfully!</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function ServiceSectionNine({ data }) {
  if (!data || data.isVisible === false) return null;

  const rows = (data.rows || [])
    .filter(row => row && (row.graftRange || row.cost))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (!data.badge && !data.title && rows.length === 0 && !data.note) return null;

  return (
    <section className="service-global-section service-section-nine">
      <div className="service-global-container service-section-nine-inner">
        <div className="service-section-nine-header">
          {data.badge && <span className="dmc-kicker">{data.badge}</span>}
          {data.title && <h2>{data.title}</h2>}
        </div>

        {rows.length > 0 && (
          <div className="service-section-nine-table-card">
            <table>
              <thead>
                <tr>
                  <th>Grafts Required</th>
                  <th>Approximate Cost (Delhi)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id || `${row.graftRange}-${index}`}>
                    <td>{row.graftRange}</td>
                    <td>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.note && <div className="service-section-nine-note">{data.note}</div>}
      </div>
    </section>
  );
}

const sectionComponents = {
  section1: ServiceSectionOne,
  section2: ServiceSectionTwo,
  section3: ServiceSectionThree,
  section4: ServiceSectionFour,
  section5: ServiceSectionFive,
  section6: ServiceSectionSix,
  section7: ServiceSectionSeven,
  section8: ServiceSectionEight,
  section9: ServiceSectionNine
};

export default function ServiceGlobalSections({ service, layout = {}, pageSlug = "", resultsFallback = null, suppressBeforeAfter = false }) {
  const sections = useMemo(() => {
    return ["section1", "section2", "section3", "section4", "section5", "section9", "section6", "section7", "section8"]
      .map(id => ({ id, data: service?.[id] }))
      .filter(section => section.data && layout[section.id] !== false && section.data.isVisible !== false);
  }, [service, layout]);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map(({ id, data }) => {
        const Component = sectionComponents[id];
        return <Component key={id} data={data} service={service} pageSlug={pageSlug} resultsFallback={resultsFallback} suppressBeforeAfter={suppressBeforeAfter} />;
      })}
    </>
  );
}
