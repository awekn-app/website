import { RoomSet } from "./rooms/RoomSet";
import { RoomPlates } from "./rooms/RoomPlates";
import { RoomFuel } from "./rooms/RoomFuel";
import { RoomScale } from "./rooms/RoomScale";
import { RoomSteps } from "./rooms/RoomSteps";
import { RoomJournal } from "./rooms/RoomJournal";
import { RoomClimb } from "./rooms/RoomClimb";
import s from "./Rooms.module.css";

/**
 * The rooms: one live demo per pillar, each a rebuilt onboarding card, pre-seeded so the first tap
 * already means something (docs/REBUILD_2026_PLAN.md, story beat 3).
 */
export function Rooms() {
  return (
    <div id="try">
      <header className={s.intro}>
        <p className={s.eyebrow}>The rooms</p>
        <h2 className={s.title}>Try it here.</h2>
        <p className={s.sub}>Seven small rooms, each running the app&apos;s own maths. Tap, drag, hold.</p>
      </header>
      <RoomSet />
      <RoomPlates />
      <RoomFuel />
      <RoomScale />
      <RoomSteps />
      <RoomJournal />
      <RoomClimb />
    </div>
  );
}
