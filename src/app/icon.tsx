import { ImageResponse } from "next/og";
import { chromeMarkSvg, dataUri } from "./site/brand/svgString";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The tab icon: the chrome A mark on a rounded black tile (reads on light and dark tab strips). */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#050506", borderRadius: 14 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri(chromeMarkSvg())} alt="" width={50} height={39} />
      </div>
    ),
    { ...size },
  );
}
