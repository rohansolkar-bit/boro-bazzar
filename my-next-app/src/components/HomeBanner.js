'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    badge: 'Weekend Discount',
    badgeColor: '#22c55e',
    headline: 'Get the best quality products at the lowest prices',
    sub: 'We have prepared special discounts for you on organic breakfast products.',
    ctaLabel: 'Shop Now',
    ctaHref: '/features',
    price: '$21.67',
    originalPrice: '$59.99',
    priceNote: "Don't miss this limited time offer.",
    image: '/banner-slide1.png',
    bg: '#f5f0e8',
    accentBg: '#eef7ee',
  },
  {
    id: 2,
    badge: 'Fresh Arrivals',
    badgeColor: '#f59e0b',
    headline: 'Farm fresh fruits & vegetables delivered to your door',
    sub: 'Sourced daily from local organic farms — crisp, nutritious, and full of flavour.',
    ctaLabel: 'Shop Now',
    ctaHref: '/features',
    price: '$14.99',
    originalPrice: '$29.99',
    priceNote: 'Limited stock — order before it runs out!',
    image: '/banner-slide2.png',
    bg: '#f0f7ee',
    accentBg: '#fef9ee',
  },
  {
    id: 3,
    badge: 'Premium Quality',
    badgeColor: '#ef4444',
    headline: 'Premium meats & seafood for the perfect meal',
    sub: 'Ethically sourced, perfectly fresh, and delivered to your doorstep within 24 hours.',
    ctaLabel: 'Shop Now',
    ctaHref: '/features',
    price: '$34.99',
    originalPrice: '$64.99',
    priceNote: 'Free delivery on orders above $50.',
    image: '/banner-slide3.png',
    bg: '#f7f0f0',
    accentBg: '#fff5f0',
  },
];

export default function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(true);
  const [direction, setDirection] = useState('next');
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection('next');
      setEntering(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setEntering(true);
      }, 350);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = useCallback(
    (index, dir) => {
      if (index === current) return;
      setDirection(dir);
      setEntering(false);
      setTimeout(() => {
        setCurrent(index);
        setEntering(true);
      }, 350);
      startTimer();
    },
    [current, startTimer]
  );

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'prev');
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 'next');
  }, [current, goTo]);

  const slide = slides[current];

  const slideClass = entering
    ? direction === 'next'
      ? 'banner-enter-right'
      : 'banner-enter-left'
    : direction === 'next'
      ? 'banner-exit-left'
      : 'banner-exit-right';

  return (
    <>
      <style>{`
        .banner-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 16px;
        }

        .banner-track {
          transition: background-color 0.6s ease;
        }

        .banner-content {
          display: flex;
          align-items: center;
          min-height: 400px;
          padding: 40px 28px;
          gap: 32px;
        }

        .banner-left {
          flex: 0 0 45%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 420px;
        }

        .banner-enter-right {
          animation: bannerInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .banner-enter-left {
          animation: bannerInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .banner-exit-left {
          animation: bannerOutLeft 0.35s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }
        .banner-exit-right {
          animation: bannerOutRight 0.35s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        @keyframes bannerInRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bannerInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bannerOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes bannerOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(40px); }
        }

        .banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          width: fit-content;
          color: white;
        }

        .banner-headline {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 800;
          line-height: 1.2;
          color: #1a1a1a;
          font-family: 'Outfit', sans-serif;
        }

        .banner-sub {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          max-width: 360px;
        }

        .banner-cta-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .banner-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          color: white;
          background: #22c55e;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }
        .banner-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(34,197,94,0.4);
        }

        .banner-price-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .banner-price-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .banner-price {
          font-size: 22px;
          font-weight: 800;
          color: #22c55e;
          font-family: 'Outfit', sans-serif;
        }
        .banner-original {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
        .banner-price-note {
          font-size: 11px;
          color: #aaa;
        }

        .banner-image-wrap {
          position: relative;
          width: 100%;
          height: 320px;
        }

        /* Nav arrows */
        .banner-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #333;
        }
        .banner-arrow:hover {
          background: #f9fafb;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transform: translateY(-50%) scale(1.05);
        }
        .banner-arrow-left  { left: 12px; }
        .banner-arrow-right { right: 12px; }

        /* Dots */
        .banner-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 14px 0 18px;
          background: transparent;
        }
        .banner-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .banner-dot.active {
          width: 24px;
          background: #22c55e;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .banner-content { padding: 32px 20px; gap: 24px; min-height: 340px; }
          .banner-left { flex: 0 0 48%; }
          .banner-image-wrap { height: 280px; }
        }

        @media (max-width: 768px) {
          .banner-content {
            flex-direction: column-reverse;
            padding: 24px 16px 28px;
            min-height: auto;
            gap: 16px;
          }
          .banner-left { flex: unset; width: 100%; }
          .banner-right { min-height: 200px; width: 100%; }
          .banner-image-wrap { height: 200px; }
          .banner-headline { font-size: clamp(20px, 5vw, 28px); }
          .banner-arrow { display: none; }
          .banner-cta-row { flex-wrap: wrap; gap: 14px; }
        }

        @media (max-width: 480px) {
          .banner-content { padding: 20px 12px 24px; }
          .banner-image-wrap { height: 170px; }
          .banner-headline { font-size: 20px; }
          .banner-btn { padding: 10px 20px; font-size: 14px; }
          .banner-price { font-size: 18px; }
          .banner-original { font-size: 14px; }
        }
      `}</style>

      <div className="banner-wrapper" style={{ margin: '0 auto', maxWidth: '100%', maxHeight: '40%' }}>
        {/* Main slider */}
        <div
          className="banner-track"
          style={{ backgroundColor: slide.bg, transition: 'background-color 0.6s ease' }}
        >
          <div className={`banner-content ${slideClass}`} key={`slide-${current}`}>
            {/* Left: text */}
            <div className="banner-left">
              <span className="banner-badge" style={{ backgroundColor: slide.badgeColor }}>
                {slide.badge}
              </span>

              <h2 className="banner-headline">{slide.headline}</h2>

              <p className="banner-sub">{slide.sub}</p>

              <div className="banner-cta-row">
                <Link href={slide.ctaHref} id={`banner-cta-${slide.id}`} className="banner-btn">
                  {slide.ctaLabel}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                <div className="banner-price-block">
                  <div className="banner-price-row">
                    <span className="banner-price">{slide.price}</span>
                    <span className="banner-original">{slide.originalPrice}</span>
                  </div>
                  <span className="banner-price-note">{slide.priceNote}</span>
                </div>
              </div>
            </div>

            {/* Right: image */}
            <div className="banner-right">
              <div className="banner-image-wrap">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  style={{ objectFit: 'cover', backgroundColor: 'transparent' }}
                  priority={current === 0}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className='rounded-xl'
                />
              </div>
            </div>
          </div>

          {/* Arrow: prev */}
          <button
            id="banner-prev"
            onClick={prev}
            aria-label="Previous slide"
            className="banner-arrow banner-arrow-left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Arrow: next */}
          <button
            id="banner-next"
            onClick={next}
            aria-label="Next slide"
            className="banner-arrow banner-arrow-right"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        {/* <div className="banner-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              id={`banner-dot-${i}`}
              className={`banner-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div> */}


      </div>
    </>
  );
}
