# Human-only blockers

## Google SEO export pipeline

- Blocked action: restore valid weekly GA4 and Search Console CSV exports in the configured Drive folder.
- Latest evidence: the exporter has created three AgentSight GA4 source manifests: `2026-07-27_to_2026-08-02_ga4_source.json`, `2026-08-03_to_2026-08-09_ga4_source.json`, and `2026-08-10_to_2026-08-16_ga4_source.json`. On `2026-08-19`, direct-child inspection of the configured folder still finds no CSV files. None of the three manifests has its required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` files are present. Under the configured three-day lag, both the 3–9 August and 10–16 August weekly windows are now fully finalized. The exporter-health failure therefore persists across two consecutive finalized weekly windows rather than only a still-finalizing range.
- Impact: finalized GA4 and Search Console metrics cannot be compared; this is unavailable evidence, not zero traffic. Runtime GA4 instrumentation remains present on the site. The source manifests confirm that the external job is still running, but its artifact set remains incomplete.
- Operator limitation: the current scheduled operator can inspect the Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot audit or rerun the external exporter itself.
- Minimum external action: an authorized Google Apps Script operator should inspect the configured exporter and its health audit, determine why source manifests are written without the paired GA4 landing-page CSV or Search Console CSVs, quarantine orphaned manifests if required, rerun one fully finalized window, and confirm the complete expected artifact set is written to the configured folder.
- Resolution evidence: the paired GA4 CSV/source manifest agree on a completed finalized window and domain, matching Search Console CSV exports are present, and a subsequent scheduled cycle can read the finalized artifacts without exposing private routing identifiers.

## npm scoped package first publication

- Blocked action: publish `@eunomia-bpf/agentsight@1.0.0` to the npm registry.
- Evidence: AgentSight npm workflow run `31065880814` built, tested, and packed version `1.0.0`, then npm returned `E404 Not Found` / insufficient permission for the scoped package. A fresh public registry/search check on `2026-08-19` still did not establish that `@eunomia-bpf/agentsight` has been published; unrelated packages using the AgentSight name do not resolve this blocker.
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
