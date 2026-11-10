// The privacy page says what the app collects (awekn Android readiness review 2026-11-10, findings 3 and 5; awekn
// docs/zeno/review/COMPLIANCE_PACK.md 3.4 and docs/ANDROID_PLAY_LISTING.md section 2). Run before publishing:
//   node scripts/privacy-truth-check.mjs [path/to/privacy/page.tsx]
// Exit 0 when every line holds; 1 with the failing lines.
import fs from "node:fs";

const file = process.argv[2] ?? new URL("../src/app/privacy/page.tsx", import.meta.url);
const page = fs.readFileSync(file, "utf8");
const fails = [];
const must = (what, ok) => { if (!ok) fails.push(what); };

// finding 3: location and GPS routes are disclosed (the record screen's GPS-ready preview and the route planner read
// the position too: app/cardio/record/index.tsx, app/cardio/record/plan.tsx, lib/cardio/gps/routing.ts)
must("a Location paragraph", page.includes("<strong>Location (optional).</strong>"));
must("location is read while recording, on the record screen and when planning", page.includes("reads it while you record (and on the record screen beforehand, to show that GPS is ready) and when you plan a route"));
must("no claim that location is read only while recording", !page.includes("reads it only while that recording runs") && !page.includes("does not read your location at any other time"));
must("never in the background outside a recording", page.includes("awekn never reads your location in the background except during a recording you started."));
must("a planned route starts at the current position", page.includes("If you plan a route, your current position as its start and the destination or distance you pick,"));
must("precise or approximate", page.includes("You can allow precise or approximate location."));
must("the route syncs", page.includes("The route is saved with the activity and syncs to our servers"));
must("the route planner is named", page.includes("openrouteservice"));
must("openrouteservice is a subprocessor row", page.includes("<strong>openrouteservice</strong> (HeiGIT gGmbH, route planning)"));
must("cardio sessions carry their route", page.includes("cardio sessions (with the GPS route of any session you record"));
// finding 1: the device identifier sent for push and sync
must("a Device identifier paragraph", page.includes("<strong>Device identifier.</strong>"));
must("sent whether or not notifications are allowed", page.includes("whether or not you allow notifications"));
// finding 5: Health Connect is steps and distance; the totals sync, not on-device only
must("Health Connect reads steps and distance only", page.includes("awekn reads your steps and distance from Google Health Connect"));
must("no current read of active calories", !page.includes("reads your steps, distance, and active calories burned"));
must("no on-device-only claim", !/processed on-device only|is processed on your device|The data is processed on your device/.test(page));
must("HealthKit totals sync", page.includes("HealthKit reads happen on your device; the daily step and distance totals the app logs from them sync to our servers like your other logs"));
must("Health Connect totals sync", page.includes("Health Connect reads happen on your device; the daily step and distance totals the app logs from them sync to our servers like your other logs"));
// house rule: no em or en dash characters in the new words
must("no em or en dash character", !/[–—]/.test(page));

if (fails.length) {
  console.error(`privacy-truth-check: ${fails.length} failed\n- ` + fails.join("\n- "));
  process.exit(1);
}
console.log("privacy-truth-check: all lines hold");
