"use client";
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const ProcessSlider = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [processData, setProcessData] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  const VISIBLE = 4; // cards visible at once on desktop

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setProcessData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...processData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('process-slider.process.')) {
          const field = key.replace('process-slider.process.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProcessData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  if (processData?.isVisible === false) return null;

  const steps = processData.processSteps || [];
  const maxIndex = Math.max(0, steps.length - VISIBLE);

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  // Touch swipe support
  const touchStartX = useRef(null);
  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    touchStartX.current = null;
  };

  return (
    <EditableSection sectionId="process-slider" label="Process Slider">
      <section className="process-slider-section" data-section-id="process-slider">
        <div className="process-slider-inner">

          {/* Section Title */}
          <span className="dmc-kicker on-blue" style={{ justifyContent: 'center', display: 'flex' }}>Step By Step</span>
          <h2 className="process-slider-title">
            <EditableText sectionId="process-slider" fieldPath="process.sectionTitle">
              {processData.sectionTitle || 'How Full Body Laser Hair Reduction works?'}
            </EditableText>
          </h2>

          {/* Slider Viewport */}
          <div
            className="process-slider-viewport"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Arrow */}
            <button
              className="process-arrow process-arrow-left"
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Previous step"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Cards Track */}
            <div className="process-slider-track-wrap">
              <div
                className="process-slider-track"
                ref={trackRef}
                style={{ transform: `translateX(-${currentIndex * (100 / VISIBLE)}%)` }}
              >
                {steps.map((step, i) => (
                  <div className="process-card" key={i}>
                    {/* Step Image */}
                    <div className="process-card-image">
                      {step.image ? (
                        <img src={step.image} alt={step.title || `Step ${i + 1}`} />
                      ) : (
                        <div className="process-card-image-placeholder">
                          <span>{i + 1}</span>
                        </div>
                      )}
                    </div>
                    {/* Step Number */}
                    <div className="process-step-number">{step.stepNumber || `STEP ${i + 1}`}</div>
                    {/* Step Title */}
                    {step.title && <div className="process-step-title">{step.title}</div>}
                    {/* Step Description */}
                    <p className="process-step-desc">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              className="process-arrow process-arrow-right"
              onClick={next}
              disabled={currentIndex >= maxIndex}
              aria-label="Next step"
            >
              <ChevronRight size={22} />
            </button>
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default ProcessSlider;
