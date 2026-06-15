"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * The awekn motion system.
 *
 * Adapted from the igasm reference (src/App.jsx) and pared to four behaviors:
 *   1. ScrollTrigger `.reveal` batch reveals (opacity 0 -> 1, y 24 -> 0).
 *   2. A hero power-on timeline staggering the eyebrow, wordmark, sub, CTA.
 *   3. A `.cursor-glow` element that follows a fine pointer via gsap.quickTo.
 *   4. Lenis smooth-scroll on fine pointers, wired to gsap.ticker + ScrollTrigger.
 *
 * Everything is opacity / transform only (60fps), SSR-guarded, and disabled
 * under `prefers-reduced-motion: reduce`. All work is reverted on unmount.
 *
 * Expected CSS classes (the markup contract):
 *   .reveal        - any element that should reveal on scroll-in.
 *   .cursor-glow   - a fixed, pointer-events:none element (translated to cursor).
 *   .hero-eyebrow  - hero kicker line.
 *   .wordmark-wrap - the wordmark container (part of the hero power-on).
 *   .hero-sub      - hero subheading.
 *   .hero-cta      - hero call-to-action.
 */
export function useMotion(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (typeof window === "undefined" || !root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    // Under reduced motion we register nothing: reveals stay visible (their
    // resting CSS state) and no smooth-scroll / glow / hero animation runs.
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    // Teardown handles collected as we go so cleanup is exact and order-safe.
    let lenis: Lenis | null = null;
    let glowApply: (() => void) | null = null;
    let lenisRaf: ((time: number) => void) | null = null;
    let onPointerMove: ((e: PointerEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      /* ---- (1) scroll reveals ---- */
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
      if (reveals.length) {
        gsap.set(reveals, { opacity: 0, y: 24 });
        ScrollTrigger.batch(reveals, {
          start: "top 86%",
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      }

      /* ---- (2) hero power-on ---- */
      const heroTargets = gsap.utils.toArray<HTMLElement>(
        ".hero-eyebrow, .wordmark-wrap, .hero-sub, .hero-cta",
      );
      if (heroTargets.length) {
        gsap.from(heroTargets, {
          opacity: 0,
          y: 26,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.1,
        });
      }

      /* ---- (3) cursor glow (fine pointer only) ---- */
      const glow = root.querySelector<HTMLElement>(".cursor-glow");
      if (glow && fine) {
        const G = {
          x: window.innerWidth * 0.5,
          y: window.innerHeight * 0.42,
        };
        glowApply = () => {
          glow.style.transform = `translate3d(${G.x.toFixed(1)}px, ${G.y.toFixed(
            1,
          )}px, 0)`;
        };
        const gx = gsap.quickTo(G, "x", { duration: 0.6, ease: "sine.out" });
        const gy = gsap.quickTo(G, "y", { duration: 0.6, ease: "sine.out" });
        gsap.ticker.add(glowApply);
        gsap.to(glow, { opacity: 1, duration: 1.2 });
        onPointerMove = (e: PointerEvent) => {
          gx(e.clientX);
          gy(e.clientY);
        };
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
      }

      /* ---- (4) Lenis smooth scroll (fine pointer) ---- */
      if (fine) {
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
        document.documentElement.classList.add("lenis");
        lenis.on("scroll", ScrollTrigger.update);
        lenisRaf = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(lenisRaf);
        gsap.ticker.lagSmoothing(0);
      }

      // Re-measure once fonts settle so reveal start positions are accurate.
      ScrollTrigger.refresh();
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, root);

    return () => {
      if (lenisRaf) gsap.ticker.remove(lenisRaf);
      if (glowApply) gsap.ticker.remove(glowApply);
      if (onPointerMove) {
        window.removeEventListener("pointermove", onPointerMove);
      }
      if (lenis) {
        lenis.destroy();
        document.documentElement.classList.remove("lenis");
      }
      gsap.ticker.lagSmoothing(500, 33);
      ctx.revert(); // kills triggers, tweens, and reverts gsap.set/from state
    };
  }, [rootRef]);
}
