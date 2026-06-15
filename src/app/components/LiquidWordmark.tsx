'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LiquidWordmark.module.css';

/**
 * LiquidWordmark
 *
 * The lowercase wordmark rendered as liquid metal that catches a moving light.
 * A radial light mask (the `.lit` layer) follows the cursor on fine pointers
 * and otherwise idle-sweeps across the letters via GSAP, with a soft champagne
 * bloom trailing the same point. Under prefers-reduced-motion the light is
 * seated statically off-center (pure CSS, no JS runs).
 *
 * Adapts igasm's wm-base / wm-lit / wm-glow technique to awekn's cosmic +
 * champagne instrument-panel brand.
 */
export default function LiquidWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SSR / capability guards
    if (typeof window === 'undefined') return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduce) return; // CSS seats the static lit position; no JS needed

    const fine = window.matchMedia('(pointer: fine)').matches;

    // light position in percent, animated by GSAP and written to CSS vars
    const L = { x: 50, y: 42 };
    const apply = () => {
      wrap.style.setProperty('--x', L.x.toFixed(2) + '%');
      wrap.style.setProperty('--y', L.y.toFixed(2) + '%');
    };

    const ctx = gsap.context(() => {
      const qx = gsap.quickTo(L, 'x', { duration: 0.5, ease: 'sine.out' });
      const qy = gsap.quickTo(L, 'y', { duration: 0.5, ease: 'sine.out' });

      gsap.ticker.add(apply);

      // the idle sweep: a slow stiff-damped drift of the light across the mark
      const sweep = gsap
        .timeline({ repeat: -1, yoyo: true })
        .to(L, { x: 70, y: 46, duration: 4, ease: 'sine.inOut' })
        .to(L, { x: 30, y: 38, duration: 4, ease: 'sine.inOut' });

      let idle: ReturnType<typeof setTimeout> | undefined;
      const onMove = (e: PointerEvent) => {
        sweep.pause();
        const b = wrap.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return;
        qx(gsap.utils.clamp(-10, 110, ((e.clientX - b.left) / b.width) * 100));
        qy(gsap.utils.clamp(-20, 120, ((e.clientY - b.top) / b.height) * 100));
        if (idle) clearTimeout(idle);
        idle = setTimeout(() => sweep.resume(), 2600);
      };

      if (fine) {
        window.addEventListener('pointermove', onMove, { passive: true });
      }

      // cleanup registered inside the context so revert() tears it all down
      return () => {
        gsap.ticker.remove(apply);
        if (fine) window.removeEventListener('pointermove', onMove);
        if (idle) clearTimeout(idle);
      };
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
    >
      <h1 className={styles.mark} aria-label={text}>
        <span className={styles.base} aria-hidden="true">
          {text}
        </span>
        <span className={styles.lit} aria-hidden="true">
          {text}
        </span>
      </h1>
      <span className={styles.glow} aria-hidden="true" />
    </div>
  );
}
