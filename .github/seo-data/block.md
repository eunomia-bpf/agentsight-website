# Human-only blockers

## Google SEO export pipeline

- Blocked action: restore valid weekly GA4 and Search Console CSV exports in the configured Drive folder.
- Evidence: on `2026-08-08` the folder contained a GA4 source manifest for the completed `2026-07-27` through `2026-08-02` window without its required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` files. The newest compatible shared SEO skill explicitly treats a manifest without its CSV as an exporter error rather than valid analytics evidence.
- Impact: finalized GA4 and Search Console metrics cannot be compared; this is unavailable evidence, not zero traffic. Runtime GA4 instrumentation remains present on the site.
- Operator limitation: the current scheduled operator can inspect the Drive artifacts but has no connected Google Apps Script execution/configuration surface, so it cannot audit or rerun the external exporter itself.
- Minimum external action: an authorized Google Apps Script operator should inspect the configured exporter, require its health audit to pass, quarantine any orphaned source manifest if needed, rerun the completed window, and confirm the expected GA4 CSV plus source manifest and Search Console CSV set are created in the configured folder.
- Resolution evidence: the paired GA4 CSV/source manifest agree on the completed window and domain, matching Search Console CSV exports are present, and a subsequent scheduled cycle can read the finalized artifacts without exposing private routing identifiers.

## npm scoped package first publication

- Blocked action: publish `@eunomia-bpf/agentsight@1.0.0` to the npm registry.
- Evidence: AgentSight npm workflow run `31065880814` built, tested, and packed version `1.0.0`, then npm returned `E404 Not Found` / insufficient permission for the scoped package.
- Impact: the website and documentation must not claim that the npm package is currently installable. The `v1.0.0` GitHub Release, Rust crates, Docker publication, and repository release remain valid.
- Minimum human action: an npm administrator must ensure the `@eunomia-bpf` scope and package can be published by the authorized account, perform or authorize the first package publication, and configure the repository's `npm-publish.yml` trusted publisher if required.
- Resolution evidence: a successful registry lookup for `@eunomia-bpf/agentsight@1.0.0` and a successful matching publish workflow or verified first publication.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
