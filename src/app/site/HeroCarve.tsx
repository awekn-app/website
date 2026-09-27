"use client";

import { useEffect, useRef } from "react";
import s from "./Hero.module.css";
import { canAffordWebGL } from "./webgl";

/**
 * The carve: a chisel of ember light that sweeps down the statue once, stone dust falling from the
 * edges it touches, then a rim light that follows a fine pointer. It is layered over the poster
 * image (premultiplied light on a transparent canvas, so it only ever adds) and never replaces it: the
 * statue is painted by next/image first and stays the LCP.
 *
 * three.js is imported only after the page is idle, and only on a device that can afford it: no
 * reduced motion, no Save-Data, WebGL2, at least 4 cores and 4 GB where the browser says. Anything
 * else keeps the poster alone. Rendering stops when the sweep ends and the hero is off screen.
 */
const SRC = "/statue-atlas-cut.png";
const SWEEP_MS = 2600;
const DUST = 220;

export function HeroCarve() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !canAffordWebGL()) return;
    let stop = () => {};
    let cancelled = false;
    const idle = whenIdle(() => {
      boot(canvas).then((dispose) => {
        if (cancelled) dispose();
        else stop = dispose;
      }).catch(() => {});
    });
    return () => {
      cancelled = true;
      idle();
      stop();
    };
  }, []);

  return <canvas ref={ref} className={s.carve} aria-hidden="true" />;
}

function whenIdle(fn: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  let t = 0;
  let id = 0;
  const go = () => {
    // Let the CSS rise of the statue settle before the light arrives.
    t = window.setTimeout(() => {
      if (w.requestIdleCallback) id = w.requestIdleCallback(fn, { timeout: 1500 });
      else fn();
    }, 900);
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
  return () => {
    window.removeEventListener("load", go);
    clearTimeout(t);
    if (id && w.cancelIdleCallback) w.cancelIdleCallback(id);
  };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

/** Points on the statue's silhouette, read from the cutout's alpha, where the dust falls from. */
function edgePoints(img: HTMLImageElement, n: number) {
  const W = 145;
  const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return [];
  g.drawImage(img, 0, 0, W, H);
  const a = g.getImageData(0, 0, W, H).data;
  const al = (x: number, y: number) => a[(y * W + x) * 4 + 3];
  const edges: [number, number][] = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (al(x, y) > 128 && (al(x - 1, y) < 128 || al(x + 1, y) < 128 || al(x, y - 1) < 128 || al(x, y + 1) < 128)) {
        edges.push([x / W, 1 - y / H]);
      }
    }
  }
  const out: [number, number][] = [];
  if (!edges.length) return out;
  // A fixed stride, not Math.random, so the dust is the same on every visit.
  const step = edges.length / n;
  for (let i = 0; i < n; i++) out.push(edges[Math.floor(i * step)]);
  return out;
}

const VERT_PLANE = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG_PLANE = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform vec2 uTexel;
  uniform float uBand;     // the chisel's height in uv, 1.15 (above) to -0.15 (below)
  uniform float uAfter;    // the afterglow left on the carved edges, fades to a rest level
  uniform vec2 uLight;     // the pointer, in uv
  uniform float uLightOn;
  uniform float uTime;
  varying vec2 vUv;
  const vec3 EMBER = vec3(1.0, 0.341, 0.071);

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec4 t = texture2D(uMap, vUv);
    float a = t.a;
    float lum = dot(t.rgb, vec3(0.299, 0.587, 0.114));
    vec2 o = uTexel * 2.5;
    float gx = texture2D(uMap, vUv + vec2(o.x, 0.0)).a - texture2D(uMap, vUv - vec2(o.x, 0.0)).a;
    float gy = texture2D(uMap, vUv + vec2(0.0, o.y)).a - texture2D(uMap, vUv - vec2(0.0, o.y)).a;
    float edge = clamp(length(vec2(gx, gy)) * 1.6, 0.0, 1.0);

    float d = vUv.y - uBand;
    float band = exp(-d * d * 520.0);
    float carved = smoothstep(uBand - 0.02, uBand + 0.25, vUv.y);

    float light = band * (0.55 * a * lum + 1.4 * edge);
    // sparks inside the band, on stone only
    float grain = step(0.992, hash(floor(vUv / uTexel / 2.0) + floor(uTime * 24.0)));
    light += band * grain * a * 1.2;
    // what the chisel leaves behind: a soft ember rim on the carved edges
    light += carved * edge * uAfter;
    // the pointer's rim light
    vec2 dl = (vUv - uLight) * vec2(1.0, 1.6);
    light += uLightOn * edge * exp(-dot(dl, dl) * 18.0) * 0.9;

    // Premultiplied light on a transparent canvas: it only ever adds, with no blend mode needed.
    vec3 c = min(EMBER * light, vec3(1.0));
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

const VERT_DUST = /* glsl */ `
  attribute vec2 aHome;
  attribute vec3 aSeed;
  uniform float uBand;
  uniform float uTime;
  uniform float uSize;
  varying float vLife;
  void main() {
    // A grain is struck when the chisel passes its height, then falls and drifts out.
    float struck = aHome.y - uBand;
    float age = clamp(struck * 2.6 - aSeed.z * 0.15, 0.0, 1.4);
    vec2 p = aHome;
    p.x += (aSeed.x - 0.5) * 0.10 * age;
    p.y -= age * age * (0.22 + aSeed.y * 0.20);
    vLife = age > 0.0 ? (1.0 - age / 1.4) : 0.0;
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = uSize * (0.6 + aSeed.y);
  }
`;

const FRAG_DUST = /* glsl */ `
  precision highp float;
  varying float vLife;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = 1.0 - smoothstep(0.2, 0.5, length(c));
    vec3 col = vec3(1.0, 0.55, 0.3) * r * vLife * 0.9;
    gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
`;

async function boot(canvas: HTMLCanvasElement) {
  const [THREE, img] = await Promise.all([import("three"), loadImage(SRC)]);
  const host = canvas.parentElement;
  if (!host) return () => {};

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();

  const tex = new THREE.Texture(img);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;

  const uniforms = {
    uMap: { value: tex },
    uTexel: { value: new THREE.Vector2(1 / img.naturalWidth, 1 / img.naturalHeight) },
    uBand: { value: 1.15 },
    uAfter: { value: 0 },
    uLight: { value: new THREE.Vector2(0.5, 0.7) },
    uLightOn: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 2.2 * dpr },
  };

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ uniforms, vertexShader: VERT_PLANE, fragmentShader: FRAG_PLANE, depthTest: false, blending: THREE.NoBlending }),
  );
  scene.add(plane);

  const pts = edgePoints(img, DUST);
  const home = new Float32Array(pts.length * 2);
  const seed = new Float32Array(pts.length * 3);
  pts.forEach(([x, y], i) => {
    home[i * 2] = x;
    home[i * 2 + 1] = y;
    seed[i * 3] = fract(Math.sin(i * 12.9898) * 43758.5453);
    seed[i * 3 + 1] = fract(Math.sin(i * 78.233) * 12543.1234);
    seed[i * 3 + 2] = fract(Math.sin(i * 39.425) * 24634.6345);
  });
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts.length * 3), 3));
  dustGeo.setAttribute("aHome", new THREE.BufferAttribute(home, 2));
  dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT_DUST,
      fragmentShader: FRAG_DUST,
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      depthTest: false,
    }),
  );
  dust.frustumCulled = false;
  scene.add(dust);

  const size = () => {
    const r = host.getBoundingClientRect();
    // The figure's box follows the image's aspect, so the plane maps 1:1 onto the poster.
    renderer.setSize(Math.max(1, Math.round(host.clientWidth)), Math.max(1, Math.round(host.clientHeight || r.height)), false);
  };
  size();
  const ro = new ResizeObserver(() => {
    size();
    draw();
  });
  ro.observe(host);

  let raf = 0;
  let start = 0;
  let visible = true;
  let sweeping = true;
  const draw = () => renderer.render(scene, camera);

  const frame = (now: number) => {
    raf = 0;
    if (!start) start = now;
    const p = Math.min(1, (now - start) / SWEEP_MS);
    const e = 1 - Math.pow(1 - p, 2.2);
    uniforms.uBand.value = 1.15 - e * 1.3;
    uniforms.uAfter.value = 0.55 * Math.min(1, p * 3) * (1 - p) + 0.12 * p;
    uniforms.uTime.value = now / 1000;
    canvas.style.opacity = "1";
    draw();
    if (p < 1) {
      if (visible) raf = requestAnimationFrame(frame);
    } else {
      sweeping = false;
    }
  };

  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && sweeping && !raf) raf = requestAnimationFrame(frame);
  });
  io.observe(host);

  // After the sweep, a fine pointer carries a small rim light across the stone (drawn on demand).
  const fine = window.matchMedia("(pointer: fine)").matches;
  let pending = 0;
  const onMove = (ev: PointerEvent) => {
    if (sweeping || !visible) return;
    const r = host.getBoundingClientRect();
    uniforms.uLight.value.set((ev.clientX - r.left) / r.width, 1 - (ev.clientY - r.top) / r.height);
    uniforms.uLightOn.value = 1;
    if (!pending) pending = requestAnimationFrame(() => {
      pending = 0;
      draw();
    });
  };
  if (fine) window.addEventListener("pointermove", onMove, { passive: true });

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(pending);
    window.removeEventListener("pointermove", onMove);
    io.disconnect();
    ro.disconnect();
    dustGeo.dispose();
    (dust.material as InstanceType<typeof THREE.ShaderMaterial>).dispose();
    plane.geometry.dispose();
    (plane.material as InstanceType<typeof THREE.ShaderMaterial>).dispose();
    tex.dispose();
    renderer.dispose();
  };
}

function fract(x: number) {
  return x - Math.floor(x);
}
