# Human-only blockers

## Google SEO export finalization timing

The newest weekly family, `2026-09-21_to_2026-09-27`, is still the next-morning export generated on 28 September. Its Search Console date file stops at 25 September, so 26–27 September are absent even though the window is now beyond the configured three-day finalization lag.

The existing historical gap remains: 17–23 August is absent, and the 24–30 August, 31 August–6 September, 7–13 September, and 14–20 September families have not been regenerated after their finalization cutoffs.

An authorized exporter operator needs to backfill 17–23 August and regenerate the five available completed weekly families after their finalization lag. Resolution is a post-lag GA4/Search Console family covering each intended weekly window.

## Delivery gate

- Prepared branch: `seo/agentsight-2026-10-01-cursor-refresh`.
- No review object exists for the branch after two normal delivery attempts.
- Required repository checks, review, merge, and publication therefore have not started.
