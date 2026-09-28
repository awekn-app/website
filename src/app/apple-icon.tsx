import { ImageResponse } from "next/og";
import { chromeMarkSvg, dataUri } from "./site/brand/svgString";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The home-screen icon: the chrome A mark on the void, under one light from above. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 0%, #26262A 0%, #0B0B0D 55%, #050506 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri(chromeMarkSvg())} alt="" width={124} height={97} style={{ marginTop: 4 }} />
      </div>
    ),
    { ...size },
  );
}
