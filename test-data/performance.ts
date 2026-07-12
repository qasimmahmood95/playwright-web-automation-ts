/**
 * Thresholds for the @performance suite. Absolute values are generous sanity
 * ceilings, never tight SLOs — shared CI runners are too noisy for those.
 * Seeded behaviour is asserted through same-run relative deltas instead.
 */
export const PerformanceThresholds = {
  // Real DCL for the inventory page is a few hundred ms; the headroom absorbs
  // runner contention and video-recording overhead
  standardDclCeilingMs: 4000,
  // The app seeds a fixed 5000ms render busy-wait for performance_glitch_user,
  // leaving ~2s of margin on each side of this delta. Compared on wall-clock
  // time-to-rendered: whether the busy-wait lands before or after DCL is
  // engine-dependent, but first render always waits for it
  glitchMinReadyDeltaMs: 3000,
} as const;
