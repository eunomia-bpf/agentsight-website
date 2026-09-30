# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: the configured Drive folder still has `2026-09-21_to_2026-09-27` only as the 28 September next-morning snapshot. On 30 September that window has reached the finalization boundary, but Search Console dates still stop at 25 September, omitting 26–27 September. `2026-08-17_to_2026-08-23` is absent; the 24–30 August, 31 August–6 September, 7–13 September, and 14–20 September families also lack post-lag regeneration and omit their boundary dates.
- Impact: current weekly movement remains directional rather than finalized evidence, so the operating cycle cannot publish a truthful finalized week-over-week GA4/GSC comparison.
- Operator limitation: the current scheduled operator can inspect Drive artifacts but has no connected Google Apps Script execution/configuration surface.
- Minimum external action: an authorized Google Apps Script operator should backfill 17–23 August and run post-lag refreshes for 24–30 August, 31 August–6 September, 7–13 September, 14–20 September, and 21–27 September. Completed GSC exports should include the full intended date range.
- Resolution evidence: a paired GA4/source manifest and Search Console CSV family for a completed weekly window is generated after the configured finalization cutoff and covers the intended dates.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. Its absence from GitHub is expected and is not a blocker.
