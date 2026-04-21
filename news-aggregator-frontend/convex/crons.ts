import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Every 15 minutes, look for trending news items whose scores exceed the
// configured autoPostRules thresholds and kick off an automation pipeline.
crons.interval(
  "auto-trigger trending news",
  { minutes: 15 },
  internal.automationActions.scheduledTrigger,
  {}
);

export default crons;
