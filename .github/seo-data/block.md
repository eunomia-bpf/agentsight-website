# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-08-23` found complete GA4 landing-page CSV and Search Console CSV families for both `2026-08-03_to_2026-08-09` and `2026-08-10_to_2026-08-16`. This resolves the previous diagnosis that the folder contained manifests only. However, the 3–9 August files were generated on 10 August and the 10–16 August files on 17 August, only the morning after each window ended and before the configured three-day lag. The 10–16 August GSC date file contains rows through 15 August but no 16 August row; the 3–9 August GSC date file contains 4–8 August but no 3 or 9 August rows. No later refresh has replaced these snapshots after the finalization cutoff.
- Impact: the exported rows are real source-native snapshots and can be inspected directionally, but they cannot be treated as finalized weekly GA4/GSC evidence under the site's own operating contract. Runtime GA4 instrumentation remains present and the prior missing-artifact blocker is no longer accurate.
- Operator limitation: the current scheduled operator can inspect the Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot change the external exporter schedule or force a post-lag refresh itself.
- Minimum external action: an authorized Google Apps Script operator should adjust the weekly exporter so a completed window is generated or refreshed after the three-day finalization cutoff, then rerun one recent window. If the script intentionally writes an early snapshot, add a deterministic post-lag refresh rather than treating the next-morning export as final.
- Resolution evidence: the paired GA4 CSV/source manifest and GSC CSV family for one completed weekly window are regenerated after the configured finalization cutoff, cover the intended dates without the observed boundary-date omission, and a subsequent scheduled cycle can read them as finalized evidence without exposing private routing identifiers.

## npm scoped package first publication

- Blocked action: publish `@eunomia-bpf/agentsight@1.0.0` to the npm registry.
- Evidence: AgentSight npm workflow run `31065880814` built, tested, and packed version `1.0.0`, then npm returned `E404 Not Found` / insufficient permission for the scoped package. A fresh public registry/search check on `2026-08-23` still did not establish that `@eunomia-bpf/agentsight` has been published; unrelated packages using the AgentSight name do not resolve this blocker.
- Impact: the website and documentation must not claim that the npm package is currently installable. GitHub Releases, Rust crates, and the repository release remain valid distribution paths.
- Minimum human action: an npm administrator must ensure the `@eunomia-bpf` scope and package can be published by the authorized account, perform or authorize the first package publication, and configure the repository's `npm-publish.yml` trusted publisher if required.
- Resolution evidence: a successful registry lookup for `@eunomia-bpf/agentsight@1.0.0` and a successful matching publish workflow or verified first publication.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
