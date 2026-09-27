import { Chapter } from "./Chapter";
import { RoomSet } from "./rooms/RoomSet";
import { RoomPlates } from "./rooms/RoomPlates";
import { RoomRest } from "./rooms/RoomRest";
import { RoomMuscles } from "./rooms/RoomMuscles";
import { RoomFuel } from "./rooms/RoomFuel";
import { RoomScale } from "./rooms/RoomScale";
import { RoomSteps } from "./rooms/RoomSteps";
import { RoomRoute } from "./rooms/RoomRoute";
import { RoomJournal } from "./rooms/RoomJournal";
import { RoomClimb } from "./rooms/RoomClimb";
import { RoomMeet } from "./rooms/RoomMeet";
import s from "./Rooms.module.css";

/**
 * The rooms: one live demo per pillar, each a rebuilt onboarding card on the app's own maths,
 * pre-seeded so the first tap already means something (docs/REBUILD_2026_PLAN.md, story beat 3).
 * v2 (docs/WEBSITE_V2_CINEMATIC_PLAN.md): eleven rooms told in three chapters, the training, the
 * body, the progress, each opened by a chapter title that reveals as it enters.
 */
export function Rooms() {
  return (
    <div id="try">
      <header className={s.intro}>
        <p className={s.eyebrow}>The rooms</p>
        <h2 className={s.title}>Try it here.</h2>
        <p className={s.sub}>Eleven small rooms, each running the app&apos;s own maths. Tap, drag, hold.</p>
      </header>

      <Chapter id="chapter-train" eyebrow="Chapter one" title={["The work", "in the room."]} sub="Every set, every plate, every rest, counted the way a coach would." />
      <RoomSet />
      <RoomPlates />
      <RoomRest index="03" />
      <RoomMuscles index="04" flip />

      <Chapter id="chapter-body" eyebrow="Chapter two" title={["What you eat,", "what you weigh."]} sub="Fuel, the scale, the steps and the miles, read as trends, not guesses." />
      <RoomFuel />
      <RoomScale />
      <RoomSteps />
      <RoomRoute index="08" flip />

      <Chapter id="chapter-progress" eyebrow="Chapter three" title={["Proof,", "day after day."]} sub="The days you showed up, the season in one line, and the platform on meet day." />
      <RoomJournal />
      <RoomClimb />
      <RoomMeet index="11" />
    </div>
  );
}
