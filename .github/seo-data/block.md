# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-08-31` still finds **no** artifact family for the now-final `2026-08-17_to_2026-08-23` window. A newer `2026-08-24_to_2026-08-30` GA4/GSC family was generated on 31 August around 09:05 PDT, only the morning after that window ended and therefore still inside the three-day lag. Its Search Console date file has rows through 29 August but no 30 August row. Earlier 3–9 and 10–16 August families were likewise generated the next morning; the inspected 10–16 GSC date file omitted 16 August.
- Impact: the exported rows are real source-native directional snapshots, but they cannot be treated as finalized weekly GA4/GSC evidence under the site's operating contract. The exporter has now skipped a finalized window while continuing to emit newer pre-lag snapshots, so current finalized week-over-week analysis remains blocked.
- Operator limitation: the current scheduled operator can inspect Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot change the external exporter schedule or force a post-lag refresh itself.
- Minimum external action: an authorized Google Apps Script operator should add or restore a deterministic post-lag refresh and run/backfill the 17–23 August window. If the script intentionally emits a next-morning snapshot, retain that as preliminary but refresh the same completed window after the three-day cutoff.
- Resolution evidence: a paired GA4 CSV/source manifest and Search Console CSV family for a completed weekly window are generated after the configured finalization cutoff, cover the intended dates without the observed boundary-date omission, and a subsequent scheduled cycle can read them as finalized evidence without exposing private routing identifiers.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
