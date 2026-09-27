"use client";

import { useEffect, useRef } from "react";
import s from "./Year.module.css";

/**
 * The year in three dimensions: the poster's 53 x 7 grid as a field of 365 small rounded blocks in
 * perspective (one InstancedMesh, one draw call). As the section scrolls in, each week's blocks rise
 * to their day's tonnage, the early weeks first, and one ember light travels along the weeks with the
 * scroll, pooling on the ground beneath it. A fine pointer drifts the camera a little.
 *
 * Loaded and gated exactly like the hero carve: three.js (and the year's data) are imported only
 * after the page is idle, only once the section is within a screen of the viewport, and only on a
 * device that can afford it (no reduced motion, no Save-Data, WebGL2, at least 4 cores and 4 GB
 * where the browser says). Anything else keeps the SVG poster. The output is premultiplied light on a
 * transparent canvas (no CSS blend modes). Frames are drawn on demand only: a scroll or pointer
 * change eases the state toward its target, a frame is drawn while it moves, and the loop stops
 * when it settles or the section leaves the screen. Disposed on unmount.
 */
export function YearField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage || !canAfford()) return;
    let stop = () => {};
    let cancelled = false;
    let cancelIdle = () => {};
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        cancelIdle = whenIdle(() => {
          boot(canvas, stage)
            .then((dispose) => {
              if (cancelled) dispose();
              else stop = dispose;
            })
            .catch(() => {});
        });
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(stage);
    return () => {
      cancelled = true;
      near.disconnect();
      cancelIdle();
      stop();
    };
  }, []);

  return <canvas ref={ref} className={s.canvas} aria-hidden="true" />;
}

function canAfford() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return false;
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

function whenIdle(fn: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  let t = 0;
  let id = 0;
  const go = () => {
    if (w.requestIdleCallback) id = w.requestIdleCallback(fn, { timeout: 1200 });
    else t = window.setTimeout(fn, 120);
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
  return () => {
    window.removeEventListener("load", go);
    clearTimeout(t);
    if (id && w.cancelIdleCallback) w.cancelIdleCallback(id);
  };
}

/** A resting block: a flat tile, the well of a day not trained (and every day before the rise). */
const BASE = 0.12;
/** The tallest block, the year's heaviest session. */
const TOP = 3.3;

const VERT_BLOCK = /* glsl */ `
  attribute vec4 aData;   // x: the day's height, y: its level (0 to 4), z: its week (0 to 1)
  uniform float uRise;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vLevel;
  varying float vUp;
  const float BASE = ${BASE.toFixed(2)};
  void main() {
    // The weeks rise in order: week 0 first, the last week a little later.
    float k = clamp((uRise - aData.z * 0.55) / 0.45, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    float h = mix(BASE, aData.x, k);
    // Stretch the block by moving only its top half, so the rounded corners keep their radius.
    vec3 p = position;
    p.y += BASE * 0.5 + step(0.0, position.y) * (h - BASE);
    vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    vNormal = normal;
    vLevel = aData.y;
    vUp = p.y / h;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const FRAG_BLOCK = /* glsl */ `
  uniform vec3 uLight;
  uniform float uLightOn;
  uniform vec3 uCam;
  uniform vec2 uFog;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vLevel;
  varying float vUp;
  const vec3 EMBER = vec3(1.0, 0.341, 0.071);
  const vec3 WELL = vec3(0.075, 0.075, 0.085);
  void main() {
    vec3 n = normalize(vNormal);
    // The poster's grammar: white at the journal's four steps of light, brightest on the top face.
    float a = vLevel < 0.5 ? 0.05 : vLevel < 1.5 ? 0.2 : vLevel < 2.5 ? 0.38 : vLevel < 3.5 ? 0.62 : 0.88;
    float top = smoothstep(0.55, 0.95, n.y);
    float side = mix(0.16, 0.46, clamp(vUp, 0.0, 1.0));
    vec3 col = mix(WELL, vec3(1.0), a * mix(side, 1.0, top));
    // The one ember light.
    vec3 L = uLight - vWorld;
    float d2 = dot(L, L);
    L *= inversesqrt(d2);
    float lam = max(dot(n, L), 0.0);
    col += EMBER * (lam * 0.85 + 0.12) * uLightOn * 1.8 / (1.0 + 0.11 * d2);
    // The far weeks fade into the void. Premultiplied: the canvas composites it over the page.
    float fog = 1.0 - smoothstep(uFog.x, uFog.y, distance(vWorld, uCam));
    col = min(col, vec3(1.0)) * fog;
    gl_FragColor = vec4(col, fog);
  }
`;

const VERT_GROUND = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const FRAG_GROUND = /* glsl */ `
  uniform vec3 uLight;
  uniform float uLightOn;
  varying vec3 vWorld;
  const vec3 EMBER = vec3(1.0, 0.341, 0.071);
  void main() {
    vec2 d = vWorld.xz - uLight.xz;
    float g = exp(-dot(d, d) * 0.07) * 0.3 * uLightOn;
    vec3 c = EMBER * g;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

type State = { rise: number; light: number; yaw: number; pitch: number };

async function boot(canvas: HTMLCanvasElement, stage: HTMLElement) {
  const [THREE, { RoundedBoxGeometry }, { YEAR, FOLD }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
    import("./YearData"),
  ]);

  const phone = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 1000);

  /* ── the field: 365 blocks, one draw call ── */
  const n = YEAR.days.length;
  const geo = new RoundedBoxGeometry(0.78, BASE, 0.78, 2, 0.05);
  const data = new Float32Array(n * 4);
  YEAR.days.forEach((d, i) => {
    const norm = d.vol / YEAR.maxVol;
    data[i * 4] = d.vol > 0 ? 0.3 + (TOP - 0.3) * Math.pow(norm, 1.6) : BASE;
    data[i * 4 + 1] = d.level;
  });
  const dataAttr = new THREE.InstancedBufferAttribute(data, 4);
  geo.setAttribute("aData", dataAttr);

  const uniforms = {
    uRise: { value: 0 },
    uLight: { value: new THREE.Vector3(-30, 2.4, 4.5) },
    uLightOn: { value: 0 },
    uCam: { value: new THREE.Vector3() },
    uFog: { value: new THREE.Vector2(40, 90) },
  };
  const blockMat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT_BLOCK, fragmentShader: FRAG_BLOCK, blending: THREE.NoBlending });
  const field = new THREE.InstancedMesh(geo, blockMat, n);
  // The shader raises the blocks past the geometry's bounds; the whole field is always in frame.
  field.frustumCulled = false;
  scene.add(field);

  /* ── the ground: the light's pool, drawn first, under the blocks ── */
  const groundGeo = new THREE.PlaneGeometry(YEAR.weeks + 12, 24);
  const groundMat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT_GROUND, fragmentShader: FRAG_GROUND, blending: THREE.NoBlending, depthWrite: false });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.renderOrder = -1;
  scene.add(ground);

  /*
   * The layout follows the poster. A wide stage: one strip of 53 weeks along x, weekdays along z
   * (Monday at the back, as the poster reads top to bottom). A phone's 3:2 stage: the year folds in
   * two, weeks 0 to 26 behind weeks 27 to 52, so the blocks are half again as large. The rise and
   * the light both travel along x, so on the fold both halves rise under the light together.
   */
  const m = new THREE.Matrix4();
  const target = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  let dist = 60;
  const corners: InstanceType<typeof THREE.Vector3>[] = [];
  let folded: boolean | null = null;
  let spanX = 0;
  let lightY = 2.6;
  let lightZ = 4.5;
  const layout = (fold: boolean) => {
    folded = fold;
    const cols = fold ? FOLD : YEAR.weeks;
    let minZ = Infinity;
    let maxZ = -Infinity;
    YEAR.days.forEach((d, i) => {
      const back = !fold || d.week < FOLD;
      const col = fold && !back ? d.week - FOLD : d.week;
      const x = col - (cols - 1) / 2;
      const z = fold ? (back ? d.dow - 7.5 : d.dow + 0.5) : d.dow - 3;
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
      m.makeTranslation(x, 0, z);
      field.setMatrixAt(i, m);
      data[i * 4 + 2] = col / (cols - 1);
    });
    field.instanceMatrix.needsUpdate = true;
    dataAttr.needsUpdate = true;
    spanX = (cols - 1) / 2 + 0.5;
    // In front of the strip; on the fold, high over the gap between the halves.
    lightY = fold ? 4.2 : 2.6;
    lightZ = fold ? (minZ + maxZ) / 2 : maxZ + 1.5;
    corners.length = 0;
    for (const x of [-spanX, spanX]) for (const y of [0, TOP]) for (const z of [minZ - 0.5, maxZ + 0.5]) corners.push(new THREE.Vector3(x, y, z));
    target.set(0, 0.9, (minZ + maxZ) / 2);
    ground.position.z = (minZ + maxZ) / 2;
  };

  /* ── the camera: fitted so the whole field sits in frame at any stage size ── */
  const place = (d: number, yaw: number, pitch: number) => {
    tmp.copy(dir).applyAxisAngle(up, yaw).multiplyScalar(d);
    tmp.y += pitch * d * 0.3;
    camera.position.copy(target).add(tmp);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  };
  const overflows = () => {
    for (const c of corners) {
      tmp.copy(c).applyMatrix4(camera.matrixWorldInverse);
      if (tmp.z > -camera.near) return true;
      tmp.copy(c).project(camera);
      if (Math.abs(tmp.x) > 0.95 || Math.abs(tmp.y) > 0.88) return true;
    }
    return false;
  };
  const fit = (aspect: number) => {
    const fold = aspect < 1.9;
    if (fold !== folded) layout(fold);
    camera.aspect = aspect;
    camera.fov = fold ? 30 : 24;
    camera.updateProjectionMatrix();
    if (fold) dir.set(-0.35, 0.65, 1);
    else dir.set(-0.3, 0.6, 1);
    dir.normalize();
    let lo = 4;
    let hi = 400;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      place(mid, 0, 0);
      if (overflows()) lo = mid;
      else hi = mid;
    }
    dist = hi;
    place(dist, 0, 0);
    let near = Infinity;
    let far = 0;
    for (const c of corners) {
      const d = c.distanceTo(camera.position);
      near = Math.min(near, d);
      far = Math.max(far, d);
    }
    uniforms.uFog.value.set(near + (far - near) * 0.5, far + (far - near) * 0.6);
  };

  /* ── state, eased toward its targets; frames only while it moves ── */
  const cur: State = { rise: 0, light: 0, yaw: 0, pitch: 0 };
  const goal: State = { rise: 0, light: 0, yaw: 0, pitch: 0 };
  let visible = false;
  let raf = 0;
  let last = 0;
  let dead = false;
  let shown = false;

  const readScroll = () => {
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    const t = (vh - r.top) / (vh + r.height);
    goal.rise = clamp01((t - 0.12) / 0.42);
    goal.light = clamp01((t - 0.08) / 0.84);
  };

  const draw = () => {
    const lp = cur.light;
    uniforms.uRise.value = cur.rise;
    uniforms.uLight.value.set(-spanX - 2 + lp * (2 * spanX + 4), lightY, lightZ);
    uniforms.uLightOn.value = smooth(0, 0.08, lp) * (1 - 0.5 * smooth(0.92, 1, lp));
    place(dist * (1.05 - 0.05 * cur.rise), cur.yaw, cur.pitch);
    uniforms.uCam.value.copy(camera.position);
    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      stage.setAttribute("data-live", "");
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (dead) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const kScroll = 1 - Math.exp(-dt / 0.14);
    const kPointer = 1 - Math.exp(-dt / 0.45);
    cur.rise += (goal.rise - cur.rise) * kScroll;
    cur.light += (goal.light - cur.light) * kScroll;
    cur.yaw += (goal.yaw - cur.yaw) * kPointer;
    cur.pitch += (goal.pitch - cur.pitch) * kPointer;
    const settled =
      Math.abs(goal.rise - cur.rise) < 1e-4 &&
      Math.abs(goal.light - cur.light) < 1e-4 &&
      Math.abs(goal.yaw - cur.yaw) < 1e-4 &&
      Math.abs(goal.pitch - cur.pitch) < 1e-4;
    if (settled) Object.assign(cur, goal);
    draw();
    if (!settled && visible) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const kick = () => {
    if (!raf && visible && !dead) raf = requestAnimationFrame(frame);
  };

  const size = () => {
    const w = Math.max(1, Math.round(stage.clientWidth));
    const h = Math.max(1, Math.round(stage.clientHeight));
    renderer.setSize(w, h, false);
    fit(w / h);
  };
  size();

  const onScroll = () => {
    if (!visible) return;
    readScroll();
    kick();
  };
  const fine = window.matchMedia("(pointer: fine)").matches;
  const onMove = (ev: PointerEvent) => {
    if (!visible) return;
    goal.yaw = ((ev.clientX / window.innerWidth) * 2 - 1) * 0.07;
    goal.pitch = ((ev.clientY / window.innerHeight) * 2 - 1) * 0.05;
    kick();
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) {
      readScroll();
      kick();
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }
  });
  io.observe(stage);

  const ro = new ResizeObserver(() => {
    size();
    if (shown && !dead) draw();
  });
  ro.observe(stage);

  const onLost = (ev: Event) => {
    ev.preventDefault();
    dead = true;
    cancelAnimationFrame(raf);
    raf = 0;
    stage.removeAttribute("data-live");
  };
  canvas.addEventListener("webglcontextlost", onLost);
  window.addEventListener("scroll", onScroll, { passive: true });
  if (fine) window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    dead = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("webglcontextlost", onLost);
    io.disconnect();
    ro.disconnect();
    stage.removeAttribute("data-live");
    geo.dispose();
    blockMat.dispose();
    groundGeo.dispose();
    groundMat.dispose();
    field.dispose();
    renderer.dispose();
  };
}

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function smooth(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
