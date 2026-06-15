import { ImageResponse } from "next/og";

export const alt = "awekn . Lifting, Gym Log & Diet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A premium dark OG card grounded in the corrected brand: cosmic void with a
// faint blood-red ember, a cosmic-silver wordmark (silver IS the text), one
// hairline blood-red rule, the oath. NOT gold.
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
            "radial-gradient(130% 120% at 24% 88%, rgba(150,30,52,0.30) 0%, transparent 50%), radial-gradient(120% 120% at 82% 12%, rgba(40,26,78,0.40) 0%, transparent 56%), radial-gradient(140% 140% at 50% 40%, #0a0712 0%, #04040a 72%, #000000 100%)",
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
            background: "#B5384C",
            opacity: 0.85,
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
