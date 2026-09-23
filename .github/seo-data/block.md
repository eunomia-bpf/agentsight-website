# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-09-23` found no file newer than the `2026-09-14_to_2026-09-20` family generated at approximately `2026-09-21T16:04Z`. That family has now reached the configured three-day finalization boundary without a post-lag regeneration; its Search Console date export still covers only 14–19 September and omits 20 September. The older gap also remains unchanged: `2026-08-17_to_2026-08-23` is completely absent, while `2026-08-24_to_2026-08-30`, `2026-08-31_to_2026-09-06`, and `2026-09-07_to_2026-09-13` still have only next-morning snapshots captured before each family's finalization boundary, with no later post-lag regeneration. Their Search Console date files still omit the boundary dates 30 August, 6 September, and 13 September respectively.
- Impact: 14–20 September remains useful directional evidence but is not finalized KPI evidence. The missing 17–23 August family and the four stale/incomplete completed families now prevent a new finalized weekly GA4/GSC comparison under the site's operating contract.
- Operator limitation: the current scheduled operator can inspect Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot change the external exporter schedule or force a post-lag refresh itself.
- Minimum external action: an authorized Google Apps Script operator should backfill 17–23 August and run post-lag refreshes for 24–30 August, 31 August–6 September, 7–13 September, and 14–20 September. If the script intentionally emits a next-morning preliminary snapshot, retain that artifact but refresh the same completed window after the three-day cutoff and include the full boundary date. Apply the same post-lag behavior to future completed windows.
- Resolution evidence: a paired GA4 CSV/source manifest and Search Console CSV family for a completed weekly window are generated after the configured finalization cutoff, cover the intended dates without the observed boundary-date omission, and a subsequent scheduled cycle can read them as finalized evidence without exposing private routing identifiers.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
