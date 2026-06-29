"use client";

import { useEffect, useState } from "react";

/* ── CosmicBackground - the living "pool of light" ────────────────────────────
   The app gets its atmosphere from DEPTH-FROM-LIGHT (CosmicBackground ambient:
   an additive near-white glow on near-black), never colored fog. We mirror that
   on the web with a few additive light blobs that drift slowly, screen-blended
   so they only ever ADD light. Pure CSS transform/opacity (no WebGL): flawless
   on phones, zero jank, instant first paint.

   Mounted only on wide, non-reduced-motion devices; everywhere else the static
   .bg-fallback field (same palette) stands in. This replaced the old WebGL
   ShaderGradient water-plane, which carried a dark/colored field that read
   foreign to the app. */
export default function CosmicBackground() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const wide = window.matchMedia("(min-width: 820px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () => setShow(wide.matches && !reduced.matches);

    compute();
    wide.addEventListener?.("change", compute);
    reduced.addEventListener?.("change", compute);
    return () => {
      wide.removeEventListener?.("change", compute);
      reduced.removeEventListener?.("change", compute);
    };
  }, []);

  // Phones / reduced-motion keep the painted .bg-fallback (z -3); no extra layer.
  if (!show) return null;

  return (
    <div className="cosmic-aurora" aria-hidden="true">
      <i className="a1" />
      <i className="a2" />
      <i className="a3" />
    </div>
  );
}
