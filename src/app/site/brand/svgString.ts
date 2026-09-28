import { MARK_VIEW, MARK_W, MARK_H, MARK_SHELL, MARK_KEY, WORD_VIEW, WORD_W, WORD_H, WORD_A, WORD_REST } from "./paths";

/**
 * The brand as standalone SVG documents (for data URIs: the share card, the app icons), in the same
 * chrome as site/brand/Brand.tsx.
 */
function chromeDefs(w: number, h: number, x2: number) {
  return `<defs><linearGradient id="f" gradientUnits="userSpaceOnUse" x1="${w * 0.08}" y1="0" x2="${x2}" y2="${h}">` +
    `<stop offset="0" stop-color="#FFFFFF"/><stop offset="0.2" stop-color="#E6E8EC"/><stop offset="0.36" stop-color="#F8F9FA"/>` +
    `<stop offset="0.56" stop-color="#B3B6BE"/><stop offset="0.72" stop-color="#DCDEE3"/><stop offset="0.88" stop-color="#9C9FA8"/>` +
    `<stop offset="1" stop-color="#CFD1D6"/></linearGradient></defs>`;
}

export function chromeMarkSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEW}" width="${MARK_W}" height="${MARK_H}">${chromeDefs(MARK_W, MARK_H, MARK_W * 0.86)}` +
    `<path fill="url(#f)" d="${MARK_SHELL}"/><path fill="url(#f)" d="${MARK_KEY}"/></svg>`;
}

export function chromeWordSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORD_VIEW}" width="${WORD_W}" height="${WORD_H}">${chromeDefs(WORD_W, WORD_H, WORD_W * 0.18)}` +
    `<path fill="url(#f)" d="${WORD_A}"/><path fill="url(#f)" fill-rule="evenodd" d="${WORD_REST}"/></svg>`;
}

export const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
