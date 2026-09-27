'use client';
import { useEffect, useState, useCallback } from 'react';

const LEFT_IMAGES = [
  '/images/cakes/1.jpg',
  '/images/cakes/3.jpg',
  '/images/cakes/4.jpg',
  '/images/cakes/5.jpg',
];

const RIGHT_IMAGES = [
  '/images/cakes/2.jpg',
  '/images/cakes/6.jpg',
  '/images/cakes/7.jpg',
  '/images/cakes/8.jpg',
];

const INTERVAL = 4200;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle');

  const advance = useCallback(() => {
    setPhase('exit');
    setTimeout(() => {
      setCurrent(i => (i + 1) % LEFT_IMAGES.length);
      setPhase('idle');
    }, 700);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(advance, INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  const getClass = (i: number, side: 'left' | 'right') => {
    const base = `hero-bg-slide hero-bg-slide-${side}`;
    if (i !== current) return base;
    if (phase === 'exit') return `${base} exiting`;
    return `${base} active`;
  };

  return (
    <div className="hero-bg-split" aria-hidden="true">
      {/* LEFT half — slides from top */}
      <div className="hero-bg-half hero-bg-half-left">
        {LEFT_IMAGES.map((src, i) => (
          <div key={src} className={getClass(i, 'left')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* RIGHT half — slides from bottom */}
      <div className="hero-bg-half hero-bg-half-right">
        {RIGHT_IMAGES.map((src, i) => (
          <div key={src} className={getClass(i, 'right')}>
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
