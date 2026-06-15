import { ImageResponse } from "next/og";

export const alt = "awekn . Lifting, Gym Log & Diet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A premium dark OG card grounded in the app's real palette: pitch-black void,
// champagne-gold wordmark (gold IS the text), one hairline gold rule, the oath.
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
            "radial-gradient(120% 120% at 50% 30%, #0D0B06 0%, #05060f 45%, #000000 100%)",
          color: "#E4C77A",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 400,
            letterSpacing: "-4px",
            color: "#E4C77A",
            textShadow: "0 0 60px rgba(212,175,55,0.35)",
          }}
        >
          awekn
        </div>
        <div
          style={{
            width: 120,
            height: 1,
            background: "#D4AF37",
            opacity: 0.7,
            marginTop: 14,
            marginBottom: 30,
          }}
        />
        <div
          style={{
            fontSize: 38,
            color: "#B89C5A",
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
            color: "#6b6456",
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
