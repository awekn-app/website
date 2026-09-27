import { APP_STORE, PLAY_STORE } from "../lib/links";
import s from "./StoreButton.module.css";

/**
 * The download button. A text button, not Apple's badge artwork: the official badge must be the
 * unmodified file from Apple's marketing tools (founder queue: download it, then swap it in here).
 * Android reads "coming soon" until Google Play is live (lib/links PLAY_STORE).
 */
export function StoreButton({ size = "md", showAndroid = false }: { size?: "md" | "lg"; showAndroid?: boolean }) {
  return (
    <div className={s.row}>
      <a className={`${s.btn} ${size === "lg" ? s.lg : ""}`} href={APP_STORE} target="_blank" rel="noopener noreferrer">
        <span className={s.small}>Download on the</span>
        <span className={s.big}>App Store</span>
      </a>
      {showAndroid ? (
        PLAY_STORE ? (
          <a className={`${s.btn} ${size === "lg" ? s.lg : ""}`} href={PLAY_STORE} target="_blank" rel="noopener noreferrer">
            <span className={s.small}>Get it on</span>
            <span className={s.big}>Google Play</span>
          </a>
        ) : (
          <span className={s.soon}>Android coming soon</span>
        )
      ) : null}
    </div>
  );
}
