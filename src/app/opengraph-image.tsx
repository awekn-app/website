import { ImageResponse } from "next/og";
import { chromeMarkSvg, chromeWordSvg, dataUri } from "./site/brand/svgString";

export const alt = "Awekn: Lifting, Gym Log & Diet. Carved, not given.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card, the hero in one frame (docs/BRAND_REVAMP_PLAN_2026-09-28.md): the chrome A mark on
 * the right under one light from above, given back faintly by the floor; the chrome wordmark and the
 * line on the void at the left. Rendered once at build time.
 */
export default function OpengraphImage() {
  const mark = dataUri(chromeMarkSvg());
  const word = dataUri(chromeWordSvg());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #111113 0%, #050506 75%)",
          color: "#F5F5F7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -260,
            width: 820,
            height: 820,
            display: "flex",
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 36%, rgba(255,255,255,0) 60%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} alt="" width={470} height={368} style={{ position: "absolute", right: 90, top: 96 }} />
        {/* the floor gives it back */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} alt="" width={470} height={368} style={{ position: "absolute", right: 90, top: 474, opacity: 0.1, transform: "scaleY(-1)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, display: "flex", background: "linear-gradient(180deg, rgba(5,5,6,0) 0%, #050506 70%)" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "70px 72px", width: 700, height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={word} alt="" width={236} height={55} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#A1A2A8", marginBottom: 18 }}>For people who lift</div>
            <div style={{ fontSize: 100, fontWeight: 700, lineHeight: 1.02, letterSpacing: -4 }}>Carved,</div>
            <div style={{ fontSize: 100, fontWeight: 700, lineHeight: 1.02, letterSpacing: -4 }}>not given.</div>
            <div style={{ display: "flex", marginTop: 30, fontSize: 24, color: "#C7C8CD" }}>
              Lifting, gym log and diet, on the App Store.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
