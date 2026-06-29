import { ImageResponse } from "next/og";

export const alt = "awekn . Lifting, Gym Log & Diet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A premium dark OG card grounded in the app-matched brand: near-black void with
// an additive near-white pool of light, a cosmic-silver wordmark (silver IS the
// display text), one hairline silver rule, the oath. Black + silver + cosmic.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 110% at 38% 22%, rgba(246,248,255,0.10) 0%, rgba(255,255,255,0.03) 42%, transparent 72%), radial-gradient(140% 140% at 50% 40%, #101013 0%, #0C0C0C 60%, #070709 100%)",
          color: "#E9EAF0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 400,
            letterSpacing: "-4px",
            color: "#E9EAF0",
            textShadow: "0 0 60px rgba(233,234,240,0.30)",
          }}
        >
          awekn
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            background: "#E9EAF0",
            opacity: 0.8,
            marginTop: 14,
            marginBottom: 30,
          }}
        />
        <div
          style={{
            fontSize: 38,
            color: "#C7C9D6",
            fontStyle: "italic",
            letterSpacing: "0.5px",
          }}
        >
          Training is a kind of devotion.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 22,
            color: "#9A9BA6",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontStyle: "normal",
          }}
        >
          Lifting · Gym Log · Diet · Now on the App Store
        </div>
      </div>
    ),
    { ...size }
  );
}
