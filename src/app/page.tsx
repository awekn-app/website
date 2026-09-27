import { Hero } from "./site/Hero";
import { Problem } from "./site/Problem";
import { Arc } from "./site/Arc";
import { Rooms } from "./site/Rooms";
import { Everything, Disciplines, Vows, Pricing, Download, SiteFooter } from "./site/Sections";
import { StickyBar } from "./site/StickyBar";

/**
 * awekn.com, rebuilt from scratch (2026-09-27, docs/REBUILD_2026_PLAN.md). One idea per screen:
 * the carver, the problem, the arc from day 1 to week 12, the rooms you can try, everything else,
 * the two disciplines, the vows, pricing, and the download.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Problem />
        <Arc />
        <Rooms />
        <Everything />
        <Disciplines />
        <Vows />
        <Pricing />
        <Download />
      </main>
      <SiteFooter />
      <StickyBar />
    </>
  );
}
