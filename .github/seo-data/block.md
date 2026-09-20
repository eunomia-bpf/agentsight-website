# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-09-20` finds **no artifact modified after `2026-09-14T17:00:00Z`**. `2026-08-17_to_2026-08-23` remains completely absent. `2026-08-24_to_2026-08-30`, `2026-08-31_to_2026-09-06`, and `2026-09-07_to_2026-09-13` remain their next-morning snapshots captured before each family's finalization boundary, with no later post-lag regeneration. The corresponding Search Console date files still omit the boundary dates 30 August, 6 September, and 13 September respectively.
- Impact: the stored rows are real source-native directional evidence, but the missing 17–23 family and stale/incomplete later families cannot support a new finalized weekly GA4/GSC comparison under the site's operating contract.
- Operator limitation: the current scheduled operator can inspect Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot change the external exporter schedule or force a post-lag refresh itself.
- Minimum external action: an authorized Google Apps Script operator should backfill 17–23 August and run post-lag refreshes for 24–30 August, 31 August–6 September, and 7–13 September. If the script intentionally emits a next-morning preliminary snapshot, retain that artifact but refresh the same completed window after the three-day cutoff and include the full boundary date. Apply the same post-lag behavior to future completed windows.
- Resolution evidence: a paired GA4 CSV/source manifest and Search Console CSV family for a completed weekly window are generated after the configured finalization cutoff, cover the intended dates without the observed boundary-date omission, and a subsequent scheduled cycle can read them as finalized evidence without exposing private routing identifiers.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
