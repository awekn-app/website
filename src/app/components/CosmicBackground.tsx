"use client";

import { Component, Suspense, type ReactNode } from "react";
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

/**
 * THE INSTRUMENT cosmic field. A real 3D animated gradient (ShaderGradient /
 * react-three-fiber), tuned to awekn's dark cosmic palette: near-black void ->
 * deep indigo bloom -> a warm champagne/bronze light source (the gold echo of
 * the app's Obsidian Gold theme). Grain on for the premium film texture. The
 * CSS .bg-fallback sits behind it so the gradient shows instantly + if WebGL is
 * unavailable. Inspired by (not copied from) the igasm hero.
 */
export default function CosmicBackground() {
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
