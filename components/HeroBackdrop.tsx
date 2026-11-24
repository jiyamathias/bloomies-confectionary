'use client';
import { useEffect, useState, useCallback } from 'react';

const INTERVAL = 4200;

// Photos come from the CMS (Home → Hero → Background photos).
export default function HeroSlider({ slides }: { slides: { left: string; right: string }[] }) {
  const LEFT_IMAGES = slides.map(s => s.left);
  const RIGHT_IMAGES = slides.map(s => s.right);
  const count = Math.max(slides.length, 1);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle');

  const advance = useCallback(() => {
    setPhase('exit');
    setTimeout(() => {
      setCurrent(i => (i + 1) % count);
      setPhase('idle');
    }, 700);
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(advance, INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  const getClass = (i: number, side: 'left' | 'right') => {
    const base = `hero-bg-slide hero-bg-slide-${side}`;
    if (i !== current % count) return base;
    if (phase === 'exit') return `${base} exiting`;
    return `${base} active`;
  };

  return (
    <div className="hero-bg-split" aria-hidden="true">
      {/* LEFT half — slides from top */}
      <div className="hero-bg-half hero-bg-half-left">
        {LEFT_IMAGES.map((src, i) => (
          <div key={i} className={getClass(i, 'left')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* RIGHT half — slides from bottom */}
      <div className="hero-bg-half hero-bg-half-right">
        {RIGHT_IMAGES.map((src, i) => (
          <div key={i} className={getClass(i, 'right')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Overlay for text readability */}
      <div className="hero-bg-overlay" />
    </div>
  );
}
