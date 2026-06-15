"use client";

import {
  Component,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

// Any WebGL/shader failure falls back silently to the CSS .bg-fallback layer
// instead of blanking the page.
class Safe extends Component<{ children: ReactNode }, { ok: boolean }> {
  state = { ok: true };
  static getDerivedStateFromError() {
    return { ok: false };
  }
  componentDidCatch() {}
  render() {
    return this.state.ok ? this.props.children : null;
  }
}

/* ── capability gate (mobile-first perf law) ──────────────────────────────
   The ShaderGradient is a FIXED, full-screen, always-running WebGL canvas —
   the single most expensive thing on the page and the worst battery/jank
   offender on a phone. We decide ONCE, client-side, whether this device gets
   the living shader or the painted CSS field (.bg-fallback, which is always
   behind it). Errs hard toward the static field: a flawless gradient that
   never janks beats a stuttering shader on a mid-range phone.

   Live shader only when ALL hold:
     - WebGL is actually available
     - not prefers-reduced-motion
     - viewport wider than 820px (phones + most tablets get the poster)
     - not a low-end device (few cores / little memory / coarse+narrow)
   It re-evaluates on the small/large crossover so a rotated/resized tablet
   that widens upgrades to the live field. */
function useCosmicLive(): { ready: boolean; live: boolean } {
  const [state, setState] = useState<{ ready: boolean; live: boolean }>({
    ready: false,
    live: false,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setState({ ready: true, live: false });
      return;
    }

    const mq = window.matchMedia;
    const reduced = mq("(prefers-reduced-motion: reduce)").matches;
    const coarse = mq("(pointer: coarse)").matches;
    const smallMq = mq("(max-width: 820px)");

    const nav = navigator as Navigator & { deviceMemory?: number };
    const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
    const lowMem = (nav.deviceMemory ?? 8) <= 4;

    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      hasWebGL = false;
    }

    const compute = (small: boolean) => {
      const lowEnd = fewCores || lowMem || (coarse && small);
      return hasWebGL && !reduced && !small && !lowEnd;
    };

    setState({ ready: true, live: compute(smallMq.matches) });

    const onChange = () =>
      setState({ ready: true, live: compute(smallMq.matches) });
    smallMq.addEventListener?.("change", onChange);
    return () => smallMq.removeEventListener?.("change", onChange);
  }, []);

  return state;
}

/**
 * THE INSTRUMENT cosmic field. A real 3D animated gradient (ShaderGradient /
 * react-three-fiber), tuned to awekn's dark cosmic palette: near-black void ->
 * deep indigo bloom -> a faint blood-red ember. The CSS .bg-fallback sits
 * behind it (and stands in entirely on phones / reduced-motion / low-end
 * devices), so the field shows instantly and never blocks first paint.
 */
export default function CosmicBackground() {
  const { ready, live } = useCosmicLive();

  // Until the capability check resolves, render nothing — the painted
  // .bg-fallback is already on screen at z -3. On phones / low-end / reduced
  // motion we keep it that way (no WebGL context is ever created).
  if (!ready || !live) return null;

  return (
    <Safe>
      <Suspense fallback={null}>
        <ShaderGradientCanvas
          className="bg-gl"
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: -2,
            pointerEvents: "none",
          }}
          pixelDensity={1}
          fov={40}
        >
          <ShaderGradient
            control="props"
            animate="on"
            type="waterPlane"
            uSpeed={0.13}
            uStrength={1.6}
            uDensity={1.4}
            uFrequency={5.5}
            uAmplitude={0}
            color1="#06060e"
            color2="#2a1030"
            color3="#7d1f33"
            grain="on"
            reflection={0.1}
            brightness={1.0}
            cAzimuthAngle={180}
            cPolarAngle={80}
            cDistance={3.4}
            cameraZoom={1}
            lightType="3d"
            envPreset="dawn"
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={50}
            rotationY={0}
            rotationZ={-60}
          />
        </ShaderGradientCanvas>
      </Suspense>
    </Safe>
  );
}
