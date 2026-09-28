# awekn.com, revamped to the final brand (plan, 2026-09-28)

The founder finalised the brand: the A mark (the logo) and the "Awekn" wordmark (branding, not the
logo), brushed chrome on black. "Redesign the whole website to match: keep the live interaction
cards, change the theme, colours and fonts to match the logo and the wordmark, use them heavily in
premium, modern ways. Think like an artist. Show me your creativity." Website first, then the app.

## The brand, as material
- Files: public/brand/awekn-mark.svg and awekn-wordmark.svg, clean vector traces of the founder's
  files (sources beside them). Colour-free paths, so each can be chrome, white, outline or ink.
- The mark's own geometry is the design language: rounded slabs, one 60 degree diagonal (the A's
  legs), a crossbar notch where two pieces lock together.
- Colour: the void (#050506), graphite, and CHROME: a brushed silver gradient with a moving light.
  The orange ember accent leaves the website; the one "lit" colour becomes white light on chrome.
  Completion green stays (a finished set is green everywhere).
- Type: Lexend (the closest open face to the wordmark's letters: wide, flat-cut w, horizontal e) for
  display; Hanken Grotesk (the app's face) for body text.

## Where the mark and the wordmark live (the creative brief)
1. THE FORGE (the hero): the A mark huge and centred, in chrome. Its two pieces arrive from the
   edges and LOCK together (the crossbar notch seats), then one bright light sweeps across the metal.
   The mark sits on a polished black floor with a soft reflection. The wordmark and "Carved, not
   given." follow. Pure CSS/SVG (fast, no WebGL needed); reduced motion shows it assembled.
2. The nav: the chrome wordmark, small; it shrinks to the mark alone once you scroll.
3. Chapters: each chapter opens with the mark as a small engraved glyph and the chapter's number; the
   A's 60 degree diagonal is the recurring divider (a thin chrome slab line).
4. The travelling light becomes a white specular light that follows the scroll over chrome.
5. The rooms (live interaction cards) stay exactly as they work, re-skinned: chrome rims, white-light
   data instead of ember, chrome primary buttons.
6. The footer: the wordmark enormous, edge to edge, cropped by the bottom of the page, brushed chrome
   that catches the light as you move.
7. Store badge / CTA: a chrome button (black label) with the mark.
8. Favicon, Apple touch icon, the social share image: the mark and the wordmark.

## Order
1. Brand components (Mark, Wordmark with chrome / white / outline, the light sweep), tokens, fonts.
2. The hero, nav, sticky bar, footer, icons, OG image.
3. Re-skin every section and room from the tokens (ember -> chrome / white light), the year and arc.
4. Verify at 375 / 320 / 1440, both motion settings, no console errors, Lighthouse sanity; the
   founder's standing permission: merge to main = live on awekn.com when done.
5. Then the app: the opening moment built on the mark, the wordmark across the app, the icon.

## Status (2026-09-28): website DONE and live
- Brand in code: src/app/site/brand/ (paths.ts: the traced mark as shell + key and the wordmark;
  Brand.tsx: Mark / Wordmark in chrome, white, ink or currentColor; svgString.ts for image routes).
- Tokens (globals.css): void #050506, chrome / chrome-type / chrome-rim, white as the one lit mark
  (--ember is an alias of --lit so nothing can fall back to orange), Lexend display via next/font.
- The forge hero (site/Forge.tsx): the shell rises, the key slides up the diagonal and seats, flashes,
  a light with a dark leading band crosses the metal every 9 s, pointer tilt on fine pointers, a floor
  reflection. Pure CSS on server SVG; reduced motion = assembled.
- Chrome wordmark in the nav; the mark in the sticky bar and on the chrome store button (never
  Apple's logo); hallmark A stamped before every chapter eyebrow and faintly into the cards; A bullets
  on the vows; the mark above "Start carving."; a monumental chrome wordmark closing the footer with a
  scroll-driven light pass.
- The arc's statue became the A mark, polished from dull to chrome across the season; the year's
  light and the travelling light are white; the record moment in the set room flares white.
- Icons: favicon.ico, icon (64), apple-icon (180) and the share card, all from the mark.
- Fixed on the way: the room chapter openers had no page gutter.
