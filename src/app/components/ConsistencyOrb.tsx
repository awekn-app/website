"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ConsistencyOrb.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE CONSISTENCY ORB - awekn's signature ring, made operable.

   A circular SVG ring fills to a month's consistency %, with a big silver
   count-up at its core (every numeral is --font-numeral) lifted by a soft
   white cosmic bloom. The arc is the ONE earned signal: --signal emerald at
   or above the honest-threshold (~40%), and a silver/white band below it.
   Everything else (track, day-grid, number, labels, glow) is silver/white.

   Two interactions live on the same instrument, the way the app feels:
     1. SCRUB - drag horizontally across the day-grid (or tap a day-cell, or
        arrow the keyboard) to walk through the month. The ring + the % +
        the day-readout all respond live. You are reading the record.
     2. LOG TODAY - hit the round check to mark today done. The ring springs
        up to fill the next earned day, the % count-up ticks, the cell flips
        to a bright silver dot, and a soft 0.97 -> 1 pulse runs. You are
        writing the record.

   Brand + motion law honoured (matches LiveSet / StrengthCurve):
     - silver (--champagne) IS the chrome; --signal emerald is the earned arc
       fill ONLY (one micro-moment), never decoration on anything else.
     - transform / opacity / clip-path only (60fps). scale(0.97) on :active.
     - the ring fills via stroke-dashoffset on a transform-friendly path; the
       count-up runs on requestAnimationFrame with a stiff damped approach
       (no overshoot, no elastic).
     - reduced-motion: snap the offset + the count-up, kill the pulse.
     - touch + mouse + keyboard operable, SSR-guarded throughout.
   ════════════════════════════════════════════════════════════════════════ */

// A believable month: 30 day-cells. `true` = trained, `null` = a future day
// (not yet reached, shown as a dim outline you can still "log"). This is an
// illustrative record - a strong-but-human ~63% month with a live tail.
const TOTAL_DAYS = 30;

// The seeded month up to "today" (day 18). A realistic grind: a couple of
// rest days, one short slip mid-month, an honest climb back.
const SEED: boolean[] = [
  true, true, false, true, true, true, false, true, true, false,
  true, true, true, false, true, true, true, false,
];
const TODAY_INDEX = SEED.length - 1; // the live edge, day 18 (0-based 17)

// Below this, the ring reads as the silver "not-yet-earned" band; at/above it
// the arc turns --signal emerald (the one earned moment). Mirrors the app's
// consistency honesty floor.
const EARNED_THRESHOLD = 0.4;

// Ring geometry in a fixed viewBox; CSS scales it responsively so all the
// math stays resolution-independent.
const VB = 240;
const CENTER = VB / 2;
const RADIUS = 96;
const CIRC = 2 * Math.PI * RADIUS;
// The ring is drawn as a near-full circle with a small gap at the bottom
// (a "gauge" feel, not a closed donut). 0.86 of the circle is the track.
const ARC_FRACTION = 0.86;
const TRACK_LEN = CIRC * ARC_FRACTION;
// rotate so the gap sits centered at the bottom
const RING_ROTATION = 90 + (1 - ARC_FRACTION) * 180;

function prefersReduced(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The round check glyph - outline when un-logged today, a filled sharp tick
// once today is logged (Ionicons checkmark -> checkmark-sharp, same as the
// LiveSet completion grammar).
function CheckGlyph({ done }: { done: boolean }) {
  return done ? (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M4.6 12.3L9.6 17.6L19.6 6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 12.5L10 17.5L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ConsistencyOrb() {
  const uid = useId().replace(/[:]/g, "");
  const ringGradId = `co-ring-${uid}`;
  const dimGradId = `co-dim-${uid}`;
  const glowId = `co-glow-${uid}`;

  // The month, as a fixed-length array of trained-states. Indices past the
  // seeded edge are `false` (a reachable-but-unlogged future day).
  const [days, setDays] = useState<boolean[]>(() => {
    const arr = new Array<boolean>(TOTAL_DAYS).fill(false);
    SEED.forEach((v, i) => (arr[i] = v));
    return arr;
  });

  // Has the visitor logged today in this session? (today = TODAY_INDEX)
  const todayLogged = days[TODAY_INDEX];

  // The active day under the playhead. Opens on "today" so the first read is
  // the live edge of the record.
  const [active, setActive] = useState(TODAY_INDEX);

  // The denominator: consistency is measured against days *elapsed* (through
  // the active day, inclusive), the way the app frames a mid-month rate.
  const elapsed = active + 1;
  const trainedThrough = useMemo(
    () => days.slice(0, elapsed).filter(Boolean).length,
    [days, elapsed],
  );
  const pct = elapsed > 0 ? trainedThrough / elapsed : 0;
  const earned = pct >= EARNED_THRESHOLD;

  // ── the animated percent readout (raf count-up) ────────────────────────
  const [pctDisplay, setPctDisplay] = useState(0);
  const pctTarget = useRef(0);
  const rafId = useRef<number | null>(null);

  const animatePct = useCallback(() => {
    if (prefersReduced()) {
      setPctDisplay(pctTarget.current);
      return;
    }
    if (rafId.current != null) cancelAnimationFrame(rafId.current);
    const tick = () => {
      setPctDisplay((cur) => {
        const target = pctTarget.current;
        const delta = target - cur;
        if (Math.abs(delta) < 0.0008) {
          rafId.current = null;
          return target;
        }
        // stiff damped approach - decelerating, no overshoot
        const next = cur + delta * 0.18;
        rafId.current = requestAnimationFrame(tick);
        return next;
      });
    };
    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    pctTarget.current = pct;
    animatePct();
  }, [pct, animatePct]);

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ── reduced-motion flag (drives the CSS instrument-vs-theatre split) ───
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // ── the ring fill: stroke-dashoffset, the only ring "animation" ────────
  // dashoffset goes from TRACK_LEN (empty) to TRACK_LEN*(1-pct) (filled).
  const dashOffset = TRACK_LEN * (1 - pctDisplay);

  // ── log today: write the record, spring the ring up ────────────────────
  const logToday = useCallback(() => {
    setDays((prev) => {
      const next = [...prev];
      next[TODAY_INDEX] = !next[TODAY_INDEX];
      return next;
    });
    // snap the playhead to today so the new fill is the thing you're reading
    setActive(TODAY_INDEX);
  }, []);

  // ── scrubbing across the day-grid ──────────────────────────────────────
  const gridRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const indexFromClientX = useCallback((clientX: number): number => {
    const el = gridRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return 0;
    const ratio = (clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (TOTAL_DAYS - 1));
    return Math.min(TOTAL_DAYS - 1, Math.max(0, idx));
  }, []);

  const onGridPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      draggingRef.current = true;
      pointerIdRef.current = e.pointerId;
      setScrubbing(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
      setActive(indexFromClientX(e.clientX));
    },
    [indexFromClientX],
  );

  const onGridPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      setActive(indexFromClientX(e.clientX));
    },
    [indexFromClientX],
  );

  const endGridDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setScrubbing(false);
    if (pointerIdRef.current != null) {
      try {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      } catch {
        /* no-op */
      }
      pointerIdRef.current = null;
    }
  }, []);

  // ── keyboard scrubbing on the grid ─────────────────────────────────────
  const onGridKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next: number | null = null;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = Math.min(TOTAL_DAYS - 1, active + 1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = Math.max(0, active - 1);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = TOTAL_DAYS - 1;
          break;
        case "Enter":
        case " ":
          // toggle the active day if it's reachable (<= today)
          if (active <= TODAY_INDEX) {
            e.preventDefault();
            setDays((prev) => {
              const arr = [...prev];
              arr[active] = !arr[active];
              return arr;
            });
          }
          return;
        default:
          return;
      }
      if (next != null) {
        e.preventDefault();
        setActive(next);
      }
    },
    [active],
  );

  // ── derived readouts ────────────────────────────────────────────────────
  const pctWhole = Math.round(pctDisplay * 100);
  const activeIsToday = active === TODAY_INDEX;
  const activeIsFuture = active > TODAY_INDEX;
  const activeTrained = days[active];

  // the day-readout label below the grid
  const dayLabel = activeIsFuture
    ? "future"
    : activeIsToday
      ? "today"
      : `day ${String(active + 1).padStart(2, "0")}`;

  // current streak ending at the active day (consecutive trained days)
  const streak = useMemo(() => {
    let s = 0;
    for (let i = active; i >= 0; i--) {
      if (days[i]) s++;
      else break;
    }
    return s;
  }, [days, active]);

  return (
    <div
      className={`${styles.shell} ${reduced ? styles.reduced : ""}`}
      aria-label="Monthly consistency, interactive"
    >
      <div className={styles.card}>
        {/* ── header: the month + the streak chip ── */}
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <p className={styles.label}>Consistency</p>
            <h3 className={styles.month}>this month</h3>
          </div>
          <div
            className={`${styles.streak} ${streak > 0 && earned ? styles.streakOn : ""}`}
            aria-label={`${streak} day streak`}
          >
            <span className={styles.streakNum}>{streak}</span>
            <span className={styles.streakUnit}>day streak</span>
          </div>
        </header>

        {/* ── the orb: ring + core count-up ── */}
        <div className={styles.orbWrap}>
          <svg
            className={`${styles.ring} ${earned ? styles.ringEarned : ""}`}
            viewBox={`0 0 ${VB} ${VB}`}
            role="img"
            aria-label={`${pctWhole} percent consistency through ${dayLabel}`}
          >
            <defs>
              {/* EARNED: the arc becomes a luminous COSMIC SILVER -> WHITE sweep
                  (brighter than the building band). Black + silver + cosmic, the
                  reward is light, not color. */}
              <linearGradient id={ringGradId} x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--silver-dim)"
                  stopOpacity="0.85"
                />
                <stop offset="55%" stopColor="var(--champagne)" stopOpacity="1" />
                <stop
                  offset="100%"
                  stopColor="var(--white)"
                  stopOpacity="1"
                />
              </linearGradient>
              {/* the not-yet-earned band: silver, brightening to white */}
              <linearGradient id={dimGradId} x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--gold-dim)"
                  stopOpacity="0.55"
                />
                <stop
                  offset="100%"
                  stopColor="var(--champagne)"
                  stopOpacity="0.9"
                />
              </linearGradient>
              <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* the unlit track */}
            <circle
              className={styles.track}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeDasharray={`${TRACK_LEN} ${CIRC}`}
              transform={`rotate(${RING_ROTATION} ${CENTER} ${CENTER})`}
            />

            {/* the filled arc - dashoffset is the ONLY thing that animates */}
            <circle
              className={styles.fill}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={`url(#${earned ? ringGradId : dimGradId})`}
              filter={`url(#${glowId})`}
              strokeLinecap="round"
              strokeDasharray={`${TRACK_LEN} ${CIRC}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(${RING_ROTATION} ${CENTER} ${CENTER})`}
            />
          </svg>

          {/* the core - big mono count-up + unit, absolutely centered */}
          <div className={styles.core} aria-live="polite" aria-atomic="true">
            <div
              className={`${styles.pct} ${earned ? styles.pctEarned : ""}`}
              data-pulse={todayLogged ? "on" : undefined}
            >
              <span className={styles.pctNum}>{pctWhole}</span>
              <span className={styles.pctSign}>%</span>
            </div>
            <p className={styles.coreNote}>
              <span className={styles.coreCount}>
                {trainedThrough}/{elapsed}
              </span>{" "}
              days · {dayLabel}
            </p>
          </div>
        </div>

        {/* ── the day-grid: scrub + tap to read / log ── */}
        <div
          ref={gridRef}
          className={`${styles.grid} ${scrubbing ? styles.gridScrub : ""}`}
          role="slider"
          tabIndex={0}
          aria-label="Scrub the month, or press enter on a day to log it"
          aria-valuemin={1}
          aria-valuemax={TOTAL_DAYS}
          aria-valuenow={active + 1}
          aria-valuetext={`${dayLabel}, ${activeTrained ? "trained" : "rest"}`}
          onPointerDown={onGridPointerDown}
          onPointerMove={onGridPointerMove}
          onPointerUp={endGridDrag}
          onPointerCancel={endGridDrag}
          onKeyDown={onGridKey}
        >
          {days.map((trained, i) => {
            const isFuture = i > TODAY_INDEX;
            const isActive = i === active;
            const cls = [
              styles.cell,
              trained ? styles.cellTrained : "",
              isFuture ? styles.cellFuture : "",
              isActive ? styles.cellActive : "",
              i === TODAY_INDEX ? styles.cellToday : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <span
                key={i}
                className={cls}
                aria-hidden="true"
                data-day={i + 1}
              />
            );
          })}
        </div>

        {/* ── controls: the scrub hint + the LOG TODAY check ── */}
        <div className={styles.controls}>
          <p className={styles.hint}>
            drag the month, or log today
            <span className={styles.hintArrows} aria-hidden="true">
              ←→
            </span>
          </p>
          <button
            type="button"
            className={`${styles.logBtn} ${todayLogged ? styles.logBtnDone : ""}`}
            aria-pressed={todayLogged}
            aria-label={
              todayLogged ? "Mark today not done" : "Log today as trained"
            }
            onClick={logToday}
          >
            <span className={styles.logGlyph}>
              <CheckGlyph done={todayLogged} />
            </span>
            <span className={styles.logText}>
              {todayLogged ? "logged" : "log today"}
            </span>
          </button>
        </div>

        {/* honest caption */}
        <p className={styles.caption}>
          illustrative record · drag to read any day, log today to fill the ring
        </p>
      </div>
    </div>
  );
}
