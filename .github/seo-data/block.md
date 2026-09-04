# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-09-04` still finds **no** artifact family for the completed `2026-08-17_to_2026-08-23` window. The latest family remains `2026-08-24_to_2026-08-30`, generated on 31 August around 09:05 PDT, the morning after that window ended. No post-lag refresh/backfill appeared by 4 September; its Search Console date file still contains rows only through 29 August and omits 30 August. The relevant stored snapshots are unchanged: GA4 SHA-256 `2372c487f122aa3aabb72a1008408619d2036d06061542f92df898163afc1f3a`, GSC dates SHA-256 `70d69b7fd6a372d2ffec14cfb77dace8abfd63113e3027ddaeb499f6a6024f99`.
- Impact: the stored rows are real source-native directional evidence, but the missing 17–23 family and stale/incomplete 24–30 family cannot support a new finalized weekly GA4/GSC comparison under the site's operating contract.
- Operator limitation: the current scheduled operator can inspect Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot change the external exporter schedule or force a post-lag refresh itself.
- Minimum external action: an authorized Google Apps Script operator should backfill 17–23 August and run a post-lag refresh for 24–30 August. If the script intentionally emits a next-morning preliminary snapshot, retain that artifact but refresh the same completed window after the three-day cutoff and include the full boundary date.
- Resolution evidence: a paired GA4 CSV/source manifest and Search Console CSV family for a completed weekly window are generated after the configured finalization cutoff, cover the intended dates without the observed boundary-date omission, and a subsequent scheduled cycle can read them as finalized evidence without exposing private routing identifiers.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
