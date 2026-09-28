import { Hero } from "./site/Hero";
import { Problem } from "./site/Problem";
import { Arc } from "./site/Arc";
import { Rooms } from "./site/Rooms";
import { Everything, Disciplines, Vows, Download, SiteFooter } from "./site/Sections";
import { StickyBar } from "./site/StickyBar";
import { Year } from "./site/Year";
import { Progress } from "./site/Progress";
import { Light } from "./site/Light";
import { AppTour } from "./site/AppTour";
import { Band } from "./site/ShowcaseArt";

/**
 * awekn.com, rebuilt from scratch (2026-09-27, docs/REBUILD_2026_PLAN.md). One idea per screen:
 * the carver, the problem, the arc from day 1 to week 12, the rooms you can try, everything else,
 * the two disciplines, the vows and the download (no prices on the site: the founder, 2026-09-28).
 * v2 (docs/WEBSITE_V2_CINEMATIC_PLAN.md): the arc as an instrument, eleven rooms in three chapters,
 * the year in three.js, a scroll progress hairline and one travelling light.
 * Brand revamp (docs/BRAND_REVAMP_PLAN_2026-09-28.md): chrome on black, the A mark forged in the hero.
 * Showcase (docs/SHOWCASE_POLISH_PLAN_2026-09-28.md): real app screens in CSS iPhones (the hero, the
 * tour, the closing wall), the band, and the app's orange as the heat.
 */
export default function Home() {
  return (
    <>
      <Light />
      <Progress />
      <Hero />
      <main>
        <Band />
        <Problem />
        <AppTour />
        <Arc />
        <Rooms />
        <Year />
        <Everything />
        <Disciplines />
        <Vows />
        <Download />
      </main>
      <SiteFooter />
      <StickyBar />
    </>
  );
}
