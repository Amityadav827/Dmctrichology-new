"use client";
import React, { useState, useEffect, useRef } from 'react';

const CountUpStat = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  const originalValue = value == null ? '' : String(value);
  const match = originalValue.match(/^([^0-9.-]*)([-+]?\d*\.?\d+)(.*)$/);
  const prefix = match?.[1] || '';
  const numericToken = match?.[2] || '';
  const suffix = match?.[3] || '';
  const hasNumericValue = Boolean(match);
  const usesThousandSuffix = /^k/i.test(suffix.trim());
  const decimalPlaces = numericToken.includes('.') ? numericToken.split('.')[1].length : 0;
  const numericValue = hasNumericValue
    ? parseFloat(numericToken) * (usesThousandSuffix ? 1000 : 1)
    : 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeOut * numericValue;
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, numericValue, duration]);

  const formatValue = (val) => {
    if (!hasNumericValue) {
      return originalValue;
    }

    const displayNumber = usesThousandSuffix ? val / 1000 : val;
    const rounded = decimalPlaces > 0
      ? displayNumber.toFixed(decimalPlaces)
      : Math.floor(displayNumber).toString();

    return `${prefix}${rounded}${suffix}`;
  };

  const displayValue = isVisible || hasAnimated.current ? formatValue(count) : originalValue;

  useEffect(() => {
    if (!hasNumericValue) {
      hasAnimated.current = true;
    }
  }, [hasNumericValue]);

  return (
    <span ref={countRef}>
      {displayValue}
    </span>
  );
};

export default CountUpStat;
