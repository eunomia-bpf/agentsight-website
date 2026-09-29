# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-09-29` confirms the newest family is still `2026-09-21_to_2026-09-27` generated at approximately `2026-09-28T16:06Z`; no newer family or post-lag regeneration is present. The new family is preliminary and its Search Console date export currently covers only 21–25 September, so it has not reached the configured three-day finalization boundary. The older finalized-window gap is unchanged: `2026-08-17_to_2026-08-23` is completely absent, while `2026-08-24_to_2026-08-30`, `2026-08-31_to_2026-09-06`, `2026-09-07_to_2026-09-13`, and `2026-09-14_to_2026-09-20` still lack post-lag regeneration; their Search Console date files omit 30 August, 6 September, 13 September, and 20 September respectively.
- Impact: the new 21–27 September family is useful directional evidence but is not yet finalized KPI evidence. The missing 17–23 August family and the four stale/incomplete completed families still prevent a new finalized weekly GA4/GSC comparison under the site's operating contract.
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

## Pull-request creation permission path

- Blocked action: open the required non-draft pull request for `seo/agentsight-2026-09-29-cursor-refresh`.
- Evidence: both a full pull-request creation request and a minimal title/head/base request were rejected by the connected GitHub tool before GitHub created a PR. Branch creation and low-level Git object/ref writes succeeded, so the prepared branch exists and is directly based on current `main`.
- Impact: pull-request-triggered exact-head checks, final review, squash merge, exact-commit publication, public verification, and metadata closeout cannot proceed. Repository policy forbids a direct automated push to `main` as a substitute.
- Minimum external action: open a non-draft pull request from `seo/agentsight-2026-09-29-cursor-refresh` to `main`; do not merge or bypass checks.
- Resolution evidence: the non-draft PR exists on GitHub and normal required checks can run.
