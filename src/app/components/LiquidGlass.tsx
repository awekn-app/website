"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./LiquidGlass.module.css";

/* ════════════════════════════════════════════════════════════════════════
   LIQUID GLASS - a reusable, REAL liquid-glass surface.

   The genuine Apple / liquid-glass-js technique, faithfully implemented:

     1. An inline SVG <filter> with feTurbulence -> feGaussianBlur ->
        feDisplacementMap. Driven onto the backdrop via
        `backdrop-filter: url(#id) blur() saturate()`, it REFRACTS the cosmic
        field behind the card (the content sitting under the glass bends), the
        way real glass distorts what is behind it - not a texture painted ON
        the element.
     2. A standalone backdrop blur + saturate for the frost.
     3. A hairline silver border (cosmic, never gold).
     4. An inner TOP specular highlight (the lit upper bevel of poured glass).
     5. A soft double-bezel drop shadow for depth (the pane floats).

   GRACEFUL FALLBACK. SVG-backdrop-filter refraction only works in Chromium +
   modern Safari. Firefox and older Safari either ignore url() in
   backdrop-filter or drop backdrop-filter entirely. We feature-detect at mount
   and, when the refraction is unsupported, fall back to a frosted
   blur+saturate surface that still reads premium (same border, highlight,
   shadow, tint) - never a flat box.

   MOBILE PERFORMANCE. The displacement map is the only expensive part. We keep
   the turbulence subtle (low baseFrequency, scale ~ intensity) and, below a
   breakpoint (default 720px) OR when the caller passes `disableFilter`, we drop
   the SVG refraction and render the cheap frosted surface only. So the heavy
   filter never runs on a phone unless explicitly opted-in. prefers-reduced-
   motion is irrelevant here (the surface is static), but honoured by callers'
   content. typeof-window guarded for SSR.
   ════════════════════════════════════════════════════════════════════════ */

export type LiquidGlassProps = {
  children?: ReactNode;
  className?: string;
  /** 0..1 refraction strength. Higher = more displacement + blur. Default 0.5. */
  intensity?: number;
  /**
   * Force the cheap frosted fallback (no SVG refraction). Useful for very small
   * or many-instance surfaces. Defaults to false; the component still auto-drops
   * the heavy filter below `mobileBreakpoint`.
   */
  disableFilter?: boolean;
  /**
   * Below this viewport width (px) the heavy SVG refraction is dropped for the
   * frosted fallback, regardless of support. Set 0 to never drop on width.
   * Default 720.
   */
  mobileBreakpoint?: number;
  /** Border radius in px. Default 24. */
  radius?: number;
  /** Render as this element. Default "div". */
  as?: "div" | "section" | "article" | "aside" | "li" | "nav" | "header";
  /** Forwarded to the root element. */
  style?: CSSProperties;
};

/* Detect whether the browser can refract the backdrop through an SVG filter.
   Two gates: backdrop-filter support at all, and url() being honoured inside
   it. CSS.supports reports url() truthy in Chromium/Safari and false/throws in
   Firefox. We also probe the -webkit- prefix for older Safari. */
function detectRefraction(): boolean {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  try {
    const hasBackdrop =
      CSS.supports("backdrop-filter", "blur(2px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(2px)");
    if (!hasBackdrop) return false;
    // url() inside backdrop-filter: the actual refraction capability.
    const hasUrl =
      CSS.supports("backdrop-filter", "url(#x)") ||
      CSS.supports("-webkit-backdrop-filter", "url(#x)");
    return hasUrl;
  } catch {
    return false;
  }
}

export default function LiquidGlass({
  children,
  className,
  intensity = 0.5,
  disableFilter = false,
  mobileBreakpoint = 720,
  radius = 24,
  as = "div",
  style,
}: LiquidGlassProps) {
  const rawId = useId();
  // useId returns ":r0:" style tokens; SVG/url() ids must be CSS-safe.
  const filterId = useMemo(
    () => `lg-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawId],
  );

  const i = Math.min(1, Math.max(0, intensity));

  // Subtle, mobile-cheap displacement. baseFrequency low so the refraction is a
  // gentle bend (organic glass), not a watery wobble. scale scales with i but
  // stays small - large scale = visible pixelation + GPU cost.
  const baseFrequency = (0.006 + i * 0.006).toFixed(4); // 0.006..0.012
  const dispScale = Math.round(8 + i * 26); // 8..34 px max displacement
  const preBlur = (0.4 + i * 0.8).toFixed(2); // soften the noise map a touch
  const backdropBlur = (10 + i * 14).toFixed(1); // 10..24px frost
  const saturate = (135 + i * 55).toFixed(0); // 135..190%

  // Feature detection + responsive heavy-filter gate, resolved client-side.
  // Start false (SSR + first paint) so the markup is identical on server and
  // client; we flip on after mount. This avoids hydration mismatch.
  const [refract, setRefract] = useState(false);
  const mql = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    if (disableFilter) {
      setRefract(false);
      return;
    }
    const supports = detectRefraction();
    if (!supports) {
      setRefract(false);
      return;
    }
    if (mobileBreakpoint <= 0) {
      setRefract(true);
      return;
    }
    const m = window.matchMedia(`(min-width: ${mobileBreakpoint}px)`);
    mql.current = m;
    const apply = () => setRefract(m.matches);
    apply();
    // Re-evaluate on resize across the breakpoint (rotation, desktop resize).
    if (m.addEventListener) {
      m.addEventListener("change", apply);
      return () => m.removeEventListener("change", apply);
    }
    // Safari < 14 fallback.
    m.addListener(apply);
    return () => m.removeListener(apply);
  }, [disableFilter, mobileBreakpoint]);

  const Tag = as;

  const rootStyle: CSSProperties = {
    "--lg-radius": `${radius}px`,
    "--lg-backdrop-blur": `${backdropBlur}px`,
    "--lg-saturate": `${saturate}%`,
    ...style,
  } as CSSProperties;

  return (
    <Tag
      className={[styles.glass, refract ? styles.refract : "", className]
        .filter(Boolean)
        .join(" ")}
      style={rootStyle}
      data-refract={refract ? "on" : "off"}
    >
      {/* The SVG filter only exists when we will actually use it. It is
          width/height 0, absolutely positioned, aria-hidden - pure plumbing. */}
      {refract && (
        <svg
          className={styles.filterSvg}
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
        >
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              {/* organic, low-frequency noise field */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency={baseFrequency}
                numOctaves={2}
                seed={7}
                stitchTiles="stitch"
                result="noise"
              />
              {/* soften the map so the bend is smooth, not grainy */}
              <feGaussianBlur in="noise" stdDeviation={preBlur} result="soft" />
              {/* bend the backdrop along the softened noise gradient */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="soft"
                scale={dispScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* The refraction layer. Sits behind content, clipped to the radius,
          carrying ONLY the backdrop-filter (url + blur + saturate). Kept as a
          dedicated layer so the SVG filter never touches the card's own
          children (which must stay crisp). */}
      <span
        className={styles.refractLayer}
        aria-hidden="true"
        style={
          refract
            ? ({
                backdropFilter: `url(#${filterId}) blur(var(--lg-backdrop-blur)) saturate(var(--lg-saturate))`,
                WebkitBackdropFilter: `url(#${filterId}) blur(var(--lg-backdrop-blur)) saturate(var(--lg-saturate))`,
              } as CSSProperties)
            : undefined
        }
      />

      {/* The specular top-bevel highlight + hairline + tint live in CSS on
          ::before / ::after of .glass; the content rides on top. */}
      <span className={styles.content}>{children}</span>
    </Tag>
  );
}
