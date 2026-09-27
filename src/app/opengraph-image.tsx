import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Awekn: Lifting, Gym Log & Diet. Carved, not given.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card, the hero in one frame: the statue on the right in its ember light, the words on
 * the obsidian void on the left. Rendered once at build time.
 */
export default async function OpengraphImage() {
  const statue = await readFile(join(process.cwd(), "public/statue-atlas-cut.png"));
  const src = `data:image/png;base64,${statue.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0B0B0D",
          color: "#F5F5F7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 820,
            height: 820,
            display: "flex",
            background: "radial-gradient(circle at 50% 50%, rgba(255,87,18,0.24) 0%, rgba(255,87,18,0.07) 34%, rgba(11,11,13,0) 50%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={372} height={610} style={{ position: "absolute", right: 90, top: 30, filter: "grayscale(1) contrast(1.08) brightness(0.92)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, display: "flex", background: "linear-gradient(180deg, rgba(11,11,13,0) 0%, #0B0B0D 90%)" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px", width: 720, height: "100%" }}>
          <div style={{ fontSize: 34, fontWeight: 300, letterSpacing: 6, color: "#E9EAF0" }}>awekn</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#A1A1A6", marginBottom: 18 }}>For people who lift</div>
            <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>Carved,</div>
            <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>not given.</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 34, fontSize: 26, color: "#C7C7CC" }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5712", marginRight: 14 }} />
              Lifting, gym log and diet. On the App Store.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
