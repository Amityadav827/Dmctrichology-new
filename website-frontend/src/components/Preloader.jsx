"use client";
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hide = () => setHidden(true);

    // Already loaded (fast cache / hydration after load)
    if (document.readyState === 'complete') {
      const t = setTimeout(hide, 500);
      return () => clearTimeout(t);
    }

    const onLoad = () => setTimeout(hide, 500);
    window.addEventListener('load', onLoad);

    // Safety: never let the preloader stick
    const fallback = setTimeout(hide, 4000);

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className={`site-preloader${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden} role="status">
      <img
        src="/preloader.webp"
        alt="Loading"
        className="site-preloader-logo"
        width={150}
        height={150}
      />
    </div>
  );
}
