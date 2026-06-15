"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────────────
   THE STEEL — a machined Olympic-steel ring, knurled like a barbell sleeve.

   A real r3f scene: a torus of gunmetal steel (MeshStandardMaterial,
   metalness ~1, low roughness) lit by a procedurally-baked PMREM
   environment so its reflections read as a cold cosmic studio with a
   single faint blood-red rim light. It turns slowly on its own and leans
   a touch toward the pointer; scroll nudges it. The iron, idling.

   MOBILE LAW (most users are on a phone):
   - own lazy canvas (dynamic ssr:false) so it never blocks first paint
   - intersection-gated: the GL context only exists while in view; it
     unmounts when scrolled away (frees Safari's hard WebGL-context limit
     and stops the GPU burning battery off-screen)
   - frameloop="demand": no idle render loop; we invalidate() per rAF only
     while visible, and stop the moment it leaves the viewport
   - DPR clamped (1.5 desktop / 1 mobile)
   - on a small screen (<=820px) OR prefers-reduced-motion OR a low-end
     device, NO WebGL at all — a static CSS/SVG metallic poster stands in
     (never a second live WebGL context)

   Motion law: only transform/opacity animate in the DOM layer; SSR-guarded
   throughout; the 3D turn is paused under reduced-motion.
   ────────────────────────────────────────────────────────────────────── */

const SILVER = "#E9EAF0";
const GUNMETAL = "#3a3d47";
const BLOOD = "#b5384c";
const VOID = "#05060f";

/* ── capability gate ────────────────────────────────────────────────────
   Decide ONCE, client-side, whether this device should get live steel or
   the poster. Errs toward the poster — a flawless static frame beats a
   janky canvas on a mid-range phone. */
function useSteelCapability(): { ready: boolean; live: boolean } {
  const [state, setState] = useState<{ ready: boolean; live: boolean }>({
    ready: false,
    live: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia;
    const reduced = mq?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const small = mq?.("(max-width: 820px)").matches ?? false;
    const coarse = mq?.("(pointer: coarse)").matches ?? false;

    // low-end heuristic: few cores, or limited memory, or a coarse pointer
    // on a narrow viewport (a phone). deviceMemory is Chromium-only; absent
    // elsewhere we lean on cores + the small/coarse signals.
    const nav = navigator as Navigator & { deviceMemory?: number };
    const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
    const lowMem = (nav.deviceMemory ?? 8) <= 4;
    const lowEnd = fewCores || lowMem || (coarse && small);

    // a quick WebGL availability probe (some locked-down browsers block it)
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(
        c.getContext("webgl2") || c.getContext("webgl")
      );
    } catch {
      hasWebGL = false;
    }

    const live = hasWebGL && !reduced && !small && !lowEnd;
    setState({ ready: true, live });

    // if the viewport crosses the small/large boundary (rotate, resize),
    // re-evaluate so a tablet that widens upgrades to live steel.
    const smallMq = mq?.("(max-width: 820px)");
    const onChange = () => {
      const nowSmall = smallMq?.matches ?? false;
      setState({ ready: true, live: hasWebGL && !reduced && !nowSmall && !lowEnd });
    };
    smallMq?.addEventListener?.("change", onChange);
    return () => smallMq?.removeEventListener?.("change", onChange);
  }, []);

  return state;
}

/* ── intersection gate ──────────────────────────────────────────────────
   Mount the GL canvas only while the host element is on screen. */
function useInView<T extends HTMLElement>(margin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { rootMargin: margin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, inView };
}

/* ── pointer / scroll signal ────────────────────────────────────────────
   A single ref carrying a smoothed pointer offset (-1..1) plus the page
   scroll progress, read inside useFrame. Listeners are passive + global so
   the ring leans even when the pointer is outside the canvas. */
type Drive = { px: number; py: number; scroll: number };

function usePointerDrive() {
  const drive = useRef<Drive>({ px: 0, py: 0, scroll: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      drive.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      drive.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      drive.current.scroll = window.scrollY / max;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return drive;
}

/* ── procedural environment ─────────────────────────────────────────────
   We bake a tiny gradient scene into a PMREM cube so the steel has real,
   physically-plausible reflections WITHOUT pulling an example HDRI or any
   drei dependency. Top-down cold silver light, a near-black cosmic floor,
   and one blood-red panel that becomes the rim highlight on the ring.
   Built once, disposed on unmount. */
function useSteelEnv(): THREE.Texture | null {
  const { gl } = useThree();
  const [env, setEnv] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    // a 2:1 equirect gradient painted on a canvas, cheap and deterministic
    const W = 256;
    const H = 128;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    let texture: THREE.Texture | null = null;

    if (ctx) {
      // vertical cosmic gradient: cold silver sky -> indigo -> void floor
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#c7c9d6"); // bright sky (the key reflection)
      g.addColorStop(0.42, "#5b5f73");
      g.addColorStop(0.62, "#171448"); // indigo bloom
      g.addColorStop(1, VOID);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // one soft blood-red rim panel low on the side -> the red edge light
      const rim = ctx.createRadialGradient(
        W * 0.82,
        H * 0.66,
        2,
        W * 0.82,
        H * 0.66,
        W * 0.4,
      );
      rim.addColorStop(0, "rgba(181,56,76,0.85)");
      rim.addColorStop(1, "rgba(181,56,76,0)");
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, W, H);

      // a crisp specular bar near the top -> the bright streak that slides
      // across the metal as it turns (a real machined-steel tell)
      const bar = ctx.createLinearGradient(0, H * 0.06, 0, H * 0.2);
      bar.addColorStop(0, "rgba(255,255,255,0)");
      bar.addColorStop(0.5, "rgba(255,255,255,0.9)");
      bar.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = bar;
      ctx.fillRect(W * 0.1, H * 0.06, W * 0.5, H * 0.14);

      texture = new THREE.CanvasTexture(c);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;

      const rt = pmrem.fromEquirectangular(texture);
      setEnv(rt.texture);

      return () => {
        rt.dispose();
        texture?.dispose();
        pmrem.dispose();
      };
    }

    pmrem.dispose();
    return () => {};
  }, [gl]);

  return env;
}

/* ── knurled normal texture ─────────────────────────────────────────────
   A procedural cross-hatch normal map gives the ring a barbell-sleeve
   knurl without geometry cost. Generated once on a canvas. */
function makeKnurlNormal(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  // base = flat normal (128,128,255)
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, S, S);

  // two opposing diagonal hatch families -> diamond knurl
  ctx.lineWidth = 2;
  for (const dir of [1, -1]) {
    ctx.strokeStyle =
      dir === 1 ? "rgba(180,128,255,0.9)" : "rgba(76,128,255,0.9)";
    for (let i = -S; i < S * 2; i += 9) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + dir * S, S);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 3);
  return tex;
}

/* ── the steel ring ─────────────────────────────────────────────────────
   A torus of machined steel. Slow idle spin, a gentle pointer lean, and a
   scroll-driven tilt. All driven inside useFrame; the parent invalidates
   on demand so this only runs while visible. */
function SteelRing({
  drive,
  reduced,
}: {
  drive: React.RefObject<Drive>;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const env = useSteelEnv();
  const knurl = useMemo(() => makeKnurlNormal(), []);
  const { invalidate } = useThree();

  // dispose the knurl texture on unmount
  useEffect(() => () => knurl?.dispose(), [knurl]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = drive.current ?? { px: 0, py: 0, scroll: 0 };
    const dt = Math.min(delta, 0.05); // clamp big frame gaps

    // slow autorotate (paused under reduced-motion)
    if (!reduced) g.rotation.z += dt * 0.18;

    // ease toward the pointer lean + scroll tilt (transform-only feel)
    const targetX = -0.5 + d.py * 0.25 + d.scroll * 0.6;
    const targetY = d.px * 0.35;
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, dt * 3);
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, dt * 3);

    // keep the demand loop alive while mounted/visible
    invalidate();
  });

  return (
    <group ref={group} rotation={[-0.5, 0, 0]}>
      {/* the machined ring */}
      <mesh castShadow={false} receiveShadow={false}>
        <torusGeometry args={[1.15, 0.32, 64, 220]} />
        <meshStandardMaterial
          color={GUNMETAL}
          metalness={1}
          roughness={0.22}
          envMap={env ?? undefined}
          envMapIntensity={1.15}
          normalMap={knurl ?? undefined}
          normalScale={knurl ? new THREE.Vector2(0.35, 0.35) : undefined}
        />
      </mesh>

      {/* a polished inner collar -> reads as the sleeve shoulder, brighter */}
      <mesh>
        <torusGeometry args={[1.15, 0.18, 48, 160]} />
        <meshStandardMaterial
          color={SILVER}
          metalness={1}
          roughness={0.12}
          envMap={env ?? undefined}
          envMapIntensity={1.3}
        />
      </mesh>
    </group>
  );
}

/* ── lights ──────────────────────────────────────────────────────────────
   The PMREM env does most of the work; these just shape the form and add
   the single blood-red rim accent the brand calls for. */
function Rig() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color={SILVER} />
      {/* the rare blood-red rim, from below-behind */}
      <pointLight position={[-3, -2, -2]} intensity={2.2} color={BLOOD} />
    </>
  );
}

/* ── GL error boundary ──────────────────────────────────────────────────
   Any WebGL/shader failure drops silently to the poster instead of a blank
   hole. */
class GLBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { ok: boolean }
> {
  state = { ok: true };
  static getDerivedStateFromError() {
    return { ok: false };
  }
  componentDidCatch() {}
  render() {
    return this.state.ok ? this.props.children : this.props.fallback;
  }
}

/* ── the live canvas (only ever mounted client-side, in view, on capable
   devices) ─────────────────────────────────────────────────────────────── */
function SteelCanvas() {
  const drive = usePointerDrive();
  const reduced =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

  const dpr = useMemo<[number, number]>(() => {
    if (typeof window === "undefined") return [1, 1.5];
    const coarse =
      window.matchMedia?.("(pointer: coarse)").matches ?? false;
    return coarse ? [1, 1] : [1, 1.5];
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      style={{ width: "100%", height: "100%", display: "block" }}
      onCreated={({ gl, invalidate }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        invalidate();
      }}
    >
      <color attach="background" args={[VOID]} />
      <Rig />
      <Suspense fallback={null}>
        <SteelRing drive={drive} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}

/* lazy: never on the server, never in the first paint critical path */
const LazySteelCanvas = dynamic(() => Promise.resolve(SteelCanvas), {
  ssr: false,
});

/* ── the static metallic poster ─────────────────────────────────────────
   Pure CSS/SVG. A conic gunmetal sweep with a silver specular streak and a
   faint blood-red rim — the same ring, frozen. NO WebGL: this is what
   phones, reduced-motion, and low-end devices get, so we never open a
   second GL context or drain a battery. */
export function SteelPoster() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 400 400"
        width="78%"
        height="78%"
        role="img"
        aria-label="A machined steel ring"
        style={{ maxWidth: 360, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.55))" }}
      >
        <defs>
          <radialGradient id="steel-poster-face" cx="38%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#d7d9e4" />
            <stop offset="34%" stopColor="#7d8093" />
            <stop offset="62%" stopColor="#3a3d47" />
            <stop offset="100%" stopColor="#16171f" />
          </radialGradient>
          <linearGradient id="steel-poster-streak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(233,234,240,0)" />
            <stop offset="48%" stopColor="rgba(233,234,240,0.92)" />
            <stop offset="56%" stopColor="rgba(233,234,240,0.92)" />
            <stop offset="100%" stopColor="rgba(233,234,240,0)" />
          </linearGradient>
          <radialGradient id="steel-poster-rim" cx="74%" cy="76%" r="55%">
            <stop offset="0%" stopColor="rgba(181,56,76,0.9)" />
            <stop offset="100%" stopColor="rgba(181,56,76,0)" />
          </radialGradient>
          <mask id="steel-poster-ring">
            <rect width="400" height="400" fill="black" />
            <circle cx="200" cy="200" r="150" fill="white" />
            <circle cx="200" cy="200" r="70" fill="black" />
          </mask>
        </defs>

        {/* the steel body */}
        <g mask="url(#steel-poster-ring)">
          <circle cx="200" cy="200" r="150" fill="url(#steel-poster-face)" />
          {/* specular streak */}
          <rect
            x="40"
            y="60"
            width="320"
            height="64"
            fill="url(#steel-poster-streak)"
            transform="rotate(-24 200 200)"
            opacity="0.85"
          />
          {/* blood-red rim accent */}
          <circle cx="200" cy="200" r="150" fill="url(#steel-poster-rim)" />
        </g>

        {/* crisp inner + outer edge highlights for the machined-edge tell */}
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(233,234,240,0.5)"
          strokeWidth="1.5"
        />
        <circle
          cx="200"
          cy="200"
          r="70"
          fill="none"
          stroke="rgba(233,234,240,0.4)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   DEFAULT EXPORT — the placement-ready instrument.

   Renders an absolutely-filled layer inside whatever positioned host you
   drop it in. Decides live-vs-poster once, gates the live canvas on the
   intersection observer, and always paints the poster underneath as the
   instant + permanent fallback.

   Placement (in page.tsx):

     import SteelScene from './components/SteelScene';
     ...
     <div className="ix-steel-stage" style={{ position:'relative' }}>
       <SteelScene />
     </div>

   The host MUST be position:relative (or absolute/fixed) and have a height
   — SteelScene fills it (position:absolute inset:0). Good as a hero side
   element, a section divider, or a backdrop behind a headline.
   ────────────────────────────────────────────────────────────────────── */
export default function SteelScene({
  className,
}: {
  className?: string;
}) {
  const { ready, live } = useSteelCapability();
  const { ref, inView } = useInView<HTMLDivElement>("220px");

  // before the capability check resolves, show only the poster (no flash,
  // no premature GL context)
  const showCanvas = ready && live && inView;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        // a soft contact vignette so the steel sits in the cosmic field
        background:
          "radial-gradient(120% 120% at 50% 40%, rgba(23,20,72,0.18), transparent 70%)",
      }}
    >
      {/* the poster always exists underneath: instant paint + the permanent
          fallback if WebGL ever fails */}
      <SteelPoster />

      {showCanvas ? (
        <div style={{ position: "absolute", inset: 0 }}>
          <GLBoundary fallback={null}>
            <LazySteelCanvas />
          </GLBoundary>
        </div>
      ) : null}
    </div>
  );
}
