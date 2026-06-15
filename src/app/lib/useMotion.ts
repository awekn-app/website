"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * The awekn motion system — "the instrument, powering on".
 *
 * Adapted from the igasm reference and deepened (2026-06-16) into a heavier,
 * scroll-LINKED system the founder asked for. Behaviors:
 *
 *   1. `.reveal` batch reveals (opacity 0 -> 1, y 24 -> 0) on scroll-in.
 *   2. A hero power-on timeline (eyebrow / wordmark / sub / CTA stagger).
 *   3. A `.cursor-glow` element that follows a fine pointer (desktop only).
 *   4. Lenis smooth-scroll on fine pointers, wired to gsap.ticker.
 *   5. SCROLL-PROGRESS bar (`.ix-progress-bar`) scaled 0 -> 1 across the page.
 *   6. PARALLAX scrub: any `[data-parallax]` element translates as it scrolls
 *      (depth on the wordmark + section art). Strength via data-parallax="0.2".
 *   7. COUNT-UPS: any `[data-countup]` numeral animates from 0 -> its value
 *      when it enters (mono readouts in "the record" + pricing).
 *   8. MAGNETIC hover on `[data-magnetic]` CTAs (fine pointer only).
 *   9. NAV SCROLL-SPY: `.ix-nav-index a[href="#id"]` gets `.is-active` for the
 *      section currently in view.
 *  10. Tasteful section-enter choreography on `.ix-section-head`.
 *
 * Everything is opacity / transform only (60fps), SSR-guarded, reverted on
 * unmount, and fully disabled under `prefers-reduced-motion: reduce` (where the
 * count-ups snap to their final value and everything rests in its CSS state).
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

    /* Under reduced motion we register no animation, but we DO still:
       - snap every count-up to its final value (so the numbers aren't 0)
       - light the first nav item (a sensible resting scroll-spy state)
       and then bail. Reveals stay in their visible CSS resting state. */
    if (reduce) {
      root.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
        const target = el.getAttribute("data-countup") ?? el.textContent ?? "";
        el.textContent = target;
      });
      const firstSpy = root.querySelector<HTMLAnchorElement>(
        '.ix-nav-index a[href^="#"]',
      );
      firstSpy?.classList.add("is-active");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Teardown handles collected as we go so cleanup is exact and order-safe.
    let lenis: Lenis | null = null;
    let glowApply: (() => void) | null = null;
    let lenisRaf: ((time: number) => void) | null = null;
    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    const magneticCleanups: Array<() => void> = [];
    const anchorCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* ---- (1) scroll reveals ---- */
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
      if (reveals.length) {
        gsap.set(reveals, { opacity: 0, y: 24 });
        ScrollTrigger.batch(reveals, {
          start: "top 88%",
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

        // Smooth in-page anchor clicks through Lenis (native scrollIntoView is
        // disabled by html.lenis{scroll-behavior:auto}). Offset clears the nav.
        const anchors = gsap.utils.toArray<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        anchors.forEach((a) => {
          const onClick = (e: MouseEvent) => {
            const href = a.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            lenis?.scrollTo(target as HTMLElement, {
              offset: -96,
              duration: 1.1,
            });
          };
          a.addEventListener("click", onClick);
          anchorCleanups.push(() => a.removeEventListener("click", onClick));
        });
      }

      /* ---- (5) scroll-progress bar ---- */
      const progress = root.querySelector<HTMLElement>(".ix-progress-bar");
      if (progress) {
        gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 0.3,
          },
        });
      }

      /* ---- (6) parallax scrub (depth on art + wordmark) ---- */
      const parallaxEls =
        gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallaxEls.forEach((el) => {
        const strength = parseFloat(el.getAttribute("data-parallax") || "0.2");
        // negative shift on enter -> resting at 0 mid-view -> positive on exit
        gsap.fromTo(
          el,
          { yPercent: -strength * 100 },
          {
            yPercent: strength * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      /* ---- (7) count-ups on enter ---- */
      const counters = gsap.utils.toArray<HTMLElement>("[data-countup]");
      counters.forEach((el) => {
        const raw = el.getAttribute("data-countup") || el.textContent || "0";
        const target = parseFloat(raw.replace(/,/g, ""));
        if (!Number.isFinite(target)) return;
        const decimals = (raw.split(".")[1] || "").length;
        const proxy = { v: 0 };
        el.textContent = (0).toFixed(decimals);
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(proxy, {
              v: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = proxy.v.toFixed(decimals);
              },
            }),
        });
      });

      /* ---- (8) magnetic CTAs (fine pointer only) ---- */
      if (fine) {
        const magnets =
          gsap.utils.toArray<HTMLElement>("[data-magnetic]");
        magnets.forEach((el) => {
          const qx = gsap.quickTo(el, "x", {
            duration: 0.4,
            ease: "power3.out",
          });
          const qy = gsap.quickTo(el, "y", {
            duration: 0.4,
            ease: "power3.out",
          });
          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const mx = e.clientX - (r.left + r.width / 2);
            const my = e.clientY - (r.top + r.height / 2);
            qx(mx * 0.28);
            qy(my * 0.34);
          };
          const onLeave = () => {
            qx(0);
            qy(0);
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          magneticCleanups.push(() => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            gsap.set(el, { x: 0, y: 0 });
          });
        });
      }

      /* ---- (9) nav scroll-spy ---- */
      const spyLinks = gsap.utils.toArray<HTMLAnchorElement>(
        '.ix-nav-index a[href^="#"]',
      );
      spyLinks.forEach((link) => {
        const id = link.getAttribute("href")?.slice(1);
        if (!id) return;
        const section = document.getElementById(id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) {
              spyLinks.forEach((l) => l.classList.remove("is-active"));
              link.classList.add("is-active");
            }
          },
        });
      });

      /* ---- (10) section-head enter choreography ---- */
      const heads = gsap.utils.toArray<HTMLElement>(
        ".ix-section-head:not(.reveal)",
      );
      heads.forEach((head) => {
        const kids = head.children;
        gsap.from(kids, {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: head, start: "top 85%", once: true },
        });
      });

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
      magneticCleanups.forEach((fn) => fn());
      anchorCleanups.forEach((fn) => fn());
      if (lenis) {
        lenis.destroy();
        document.documentElement.classList.remove("lenis");
      }
      gsap.ticker.lagSmoothing(500, 33);
      ctx.revert(); // kills triggers, tweens, and reverts gsap.set/from state
    };
  }, [rootRef]);
}
