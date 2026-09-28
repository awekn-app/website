import { APP_STORE, PLAY_STORE } from "../lib/links";
import { Mark } from "./brand/Brand";
import s from "./StoreButton.module.css";

/**
 * The download button, in chrome (the brand's metal marks the one primary action). A text button led by
 * the A mark (never Apple's logo outside Apple's own badge), not Apple's badge artwork: the official badge must be the unmodified file from
 * Apple's marketing tools (founder queue: download it, then swap it in here). Android reads "coming
 * soon" until Google Play is live (lib/links PLAY_STORE).
 */
export function StoreButton({ size = "md", showAndroid = false }: { size?: "md" | "lg"; showAndroid?: boolean }) {
  const lg = size === "lg" ? s.lg : "";
  return (
    <div className={s.row}>
      <a className={`${s.btn} ${lg}`} href={APP_STORE} target="_blank" rel="noopener noreferrer">
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
