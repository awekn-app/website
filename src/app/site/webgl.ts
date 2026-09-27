/**
 * Whether this device should run a WebGL scene (the hero carve, the year field): no reduced motion,
 * no Save-Data, at least 4 cores and 4 GB where the browser says, and WebGL2. Client only.
 *
 * The WebGL2 probe runs once per page and its answer is cached. The probe's context is released
 * straight away through WEBGL_lose_context, so it never counts against the browser's small cap on
 * live contexts (the scenes' own renderers need theirs).
 */

let webgl2: boolean | null = null;

function probeWebGL2(): boolean {
  if (webgl2 !== null) return webgl2;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    webgl2 = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl2 = false;
  }
  return webgl2;
}

export function canAffordWebGL(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return false;
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;
  return probeWebGL2();
}
