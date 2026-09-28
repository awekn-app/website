"use client";

import type { PointerEvent } from "react";
import { APP_STORE, PLAY_STORE } from "../lib/links";
import { Mark } from "./brand/Brand";
import s from "./StoreButton.module.css";

/**
 * The download key in polished chrome (the founder: "make the material look very real"): clean
 * reflection like real polished metal (sky, soft falloff, one horizon band, floor bounce), a crisp
 * specular over the top half, a thin dark rim, the A mark and the words as crisp dark ink, and a
 * narrow glint that crosses it now and then (on a mouse, the glint follows the pointer). It presses
 * in like a key. Never Apple's logo outside Apple's own badge.
 */
function follow(e: PointerEvent<HTMLAnchorElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  el.style.setProperty("--gx", `${(x * 260 - 130).toFixed(1)}%`);
  el.dataset.track = "";
}
function leave(e: PointerEvent<HTMLAnchorElement>) {
  delete e.currentTarget.dataset.track;
}

export function StoreButton({ size = "md", showAndroid = false }: { size?: "md" | "lg"; showAndroid?: boolean }) {
  const lg = size === "lg" ? s.lg : "";
  return (
    <div className={s.row}>
      <a
        className={`${s.btn} ${lg}`}
        href={APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={follow}
        onPointerLeave={leave}
      >
        <span className={s.glint} aria-hidden="true" />
        <Mark tone="current" className={s.glyph} />
        <span className={s.words}>
          <span className={s.small}>Download on the</span>
          <span className={s.big}>App Store</span>
        </span>
      </a>
      {showAndroid ? (
        PLAY_STORE ? (
          <a className={`${s.btn} ${s.alt} ${lg}`} href={PLAY_STORE} target="_blank" rel="noopener noreferrer">
            <span className={s.words}>
              <span className={s.small}>Get it on</span>
              <span className={s.big}>Google Play</span>
            </span>
          </a>
        ) : (
          <span className={s.soon}>Android coming soon</span>
        )
      ) : null}
    </div>
  );
}
