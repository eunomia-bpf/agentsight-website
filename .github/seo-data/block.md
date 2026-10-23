# Human-only blockers

## Google SEO export finalization timing — updated 2026-10-23

- **Blocked action:** make the external Google Apps Script weekly exporter backfill missing exports and regenerate finalized GA4 and Search Console snapshots at least three days after each weekly window ends.
- **Current evidence:** the newest configured Drive-folder family, `2026-10-12_to_2026-10-18`, was generated on **2026-10-19**. Its GSC date file contains **October 12–17 only**, omitting October 18. The previous `2026-10-05_to_2026-10-11` family was generated on **October 12** and omits October 11. Neither family has an available post-finalization rerun as of October 23.
- **Historical missing/incomplete windows:** `2026-08-17_to_2026-08-23` absent; 24–30 August, 31 August–6 September, 7–13 September, and 14–20 September lacked a post-lag refresh in prior checks. The intervening September 21–27 and September 28–October 4 families also have only next-morning generation unless a distinct post-lag copy becomes available. Revalidate each expected week by its actual date coverage, not just its filename.
- **Impact:** Source-native partial figures can be used directionally with precise date labels, but completed-week trend analysis and content-ROI decisions are unverified. A missing boundary-date row is not zero traffic.
- **Operator limit:** the connected tools can read the configured Drive folder but cannot execute or edit the external Apps Script schedule. Repository file editing cannot repair a separate Google automation.
- **Minimum human action:** authorized Apps Script operator repairs the weekly export schedule to rerun each complete window after the configured three-day lag and backfills all incomplete or missing windows. Keep preliminary snapshots if desired, but publish a separate verifiably complete/finalized snapshot for every week.
- **Resolution evidence:** a paired GA4 manifest/CSV and full-window GSC date/pages CSV generated after the finalization boundary, with complete intended date coverage, source/site identity, and no exposed private property identifiers.

No SEO operator permission blocker is asserted merely from earlier intermittent GitHub connector file-write errors; the latest scheduled run successfully updated regular repository files. Do not add repository-hosted model-runner workflows or provider secrets. The existing authorized external daily operations schedule is expected and must remain enabled.
