# Human-only blockers

## Google SEO export finalization timing

- Blocked action: make the external weekly Google exporter produce or refresh GA4 and Search Console snapshots after the site's configured three-day finalization lag.
- Latest evidence: direct enumeration of the exact configured Drive folder on `2026-08-29` still finds artifact families only through earlier windows, with no file matching the now-final `2026-08-17_to_2026-08-23` window. Previously verified 3–9 August files were generated on 10 August and 10–16 August files on 17 August, only the morning after each window ended and before the configured three-day lag. The previously inspected 10–16 August GSC date file also omits 16 August.
- Impact: older exported rows remain real source-native directional snapshots, but they cannot be treated as finalized weekly GA4/GSC evidence under the site's operating contract. The newest finalized weekly window is unavailable, so current comparative analytics are blocked until the external exporter produces a post-lag snapshot.
- Operator limitation: the current scheduled operator can inspect the Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot change the external exporter schedule or force a post-lag refresh itself.
- Minimum external action: an authorized Google Apps Script operator should adjust the weekly exporter so a completed window is generated or refreshed after the three-day finalization cutoff, then run the 17–23 August window. If the script intentionally writes an early snapshot, add a deterministic post-lag refresh rather than treating the next-morning export as final.
- Resolution evidence: a paired GA4 CSV/source manifest and Search Console CSV family for a completed weekly window are generated after the configured finalization cutoff, cover the intended dates without the observed boundary-date omission, and a subsequent scheduled cycle can read them as finalized evidence without exposing private routing identifiers.

## npm scoped package first publication

- Blocked action: publish `@eunomia-bpf/agentsight@1.0.0` to the npm registry.
- Evidence: AgentSight npm workflow run `31065880814` built, tested, and packed version `1.0.0`, then npm returned `E404 Not Found` / insufficient permission for the scoped package. A public registry/search check on `2026-08-23` did not establish that `@eunomia-bpf/agentsight` has been published; unrelated packages using the AgentSight name do not resolve this blocker.
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
