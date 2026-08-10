# SEO status

## Current state

- Authoritative AgentSight product release: `v1.0.4`, published `2026-08-10` from product commit `ac1e6cb7a8398c57c1ad0ba04ff032cd271d99c8`.
- The website now synchronizes that release and publishes a standalone `/integrations/cursor/` reference for Cursor IDE sessions through AgentSight's agent-native local-session path.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- No existing URL, redirect, or canonical owner was removed or renamed by the `v1.0.4` synchronization.
- Runtime analytics remains Google Analytics 4 with path-only reporting. Query strings, Google signals, and ad-personalization signals remain excluded by the current implementation.
- Repository-hosted model-running SEO automation remains prohibited by the website's current instructions. No workflow, scheduler, direct-main model lane, or provider credential was added.
- Current shared SEO skill pointer: `9f0bd4f0b33b28fc22592e5463d95f63cda4d165`; a fresh allowed-upstream check on `2026-08-10` finds no newer `main` commit.

## Cursor product boundary

- Supported source path: Cursor transcripts below `~/.cursor/projects/<workspace>/agent-transcripts/`, with delegated `subagents/*.jsonl` work folded into the parent session.
- Optional enrichment source: Cursor's local `state.vscdb` for timing, model, and working-directory metadata; transcript parsing remains useful when that database is unavailable or locked.
- User workflow: existing local sessions can be consumed through commands such as `agentsight top`, `agentsight report --local`, and `agentsight vis`; this path does not require a special Cursor launch or sudo/eBPF capture.
- Live Cursor TLS/API-body capture is not the supported mechanism. Desktop platform constraints, Electron helper/stripped TLS boundaries, and protobuf Connect payloads are separate obstacles.
- Recent Cursor sessions may not contain local per-turn token totals. Missing recent token totals must not be interpreted as a failed AgentSight capture.

## August 10 rendered delivery

Rendered change PR `#47`, `Sync AgentSight v1.0.4 and add Cursor session integration`, is complete:

- base commit: `fcb70a0f8416a366bb4fce8c8b2e8167907305bd`;
- final PR head: `2f90652f2c19b544b5320fa660f36db7bc161936`;
- exact-head Website CI: run `31412375565`, successful;
- exact static artifact: `9072077530`;
- artifact digest: `sha256:9921772b57f8c7adc1ba9e30d3b40b5cb5fac0771c86c2993ee5b704b733ee72`;
- squash commit: `ff0ca8e9a7cc2c5b7ce8a88099782dd90a206517`;
- main Website CI: run `31412735462`, successful;
- Publish static site: run `31412735631`, successful;
- exact publish job completed `2026-08-10T17:11:26Z`;
- `site/.source-sha` identifies `ff0ca8e9a7cc2c5b7ce8a88099782dd90a206517`.

Exact output review confirms:

- publication-branch homepage metadata and visible release surface say `v1.0.4` and point to the current product release/commit;
- `/integrations/cursor/` exists with one canonical and one H1;
- the Cursor page contains the transcript/state source model, delegated-subagent handling, local-session commands, eBPF/TLS boundary, token/timestamp limitations, data-handling guidance, and primary/current references;
- `/integrations/` links the Cursor page;
- `/changelog/` reflects the `v1.0.4` Cursor change;
- sitemap contains 34 unique canonical URLs and includes `/integrations/cursor/` exactly once with `2026-08-10` freshness while existing URLs retain their previous freshness;
- representative unchanged `/integrations/claude-code/` still has one canonical and one H1.

From-scratch review after exact-head CI found no route migration, analytics-policy drift, unrelated navigation change, private-data leakage, unsupported Cursor compatibility claim, or regression in representative unchanged routes.

Metadata closeout is being delivered through PR `#48`, `Close out AgentSight v1.0.4 Cursor publication`. Its scope is limited to the August 10 daily record and this status file; it changes no rendered site behavior.

## Current public verification qualification

- Independent public retrieval available to the operator remains stale/inconsistent immediately after the exact publication: the homepage crawler still exposes the previous `v1.0.3` generation, while several detail-route checks return crawler/cache errors.
- This does not match the exact successful publication branch, which already contains `v1.0.4` and the Cursor route. Treat the current discrepancy as public crawler/cache freshness until later direct retrieval proves otherwise.
- Do not create duplicate Cursor content, route churn, or rendered cache-forcing changes merely to make an external crawler refresh sooner.
- Re-check representative public routes in later cycles and record direct public freshness when available.

## Current analytics and search data

- Latest configured source check: `2026-08-10`; latest eligible finalized calendar date under the three-day lag is `2026-08-07`.
- The configured Google Drive folder resolves uniquely.
- Its direct-child export artifacts remain `2026-08-03_to_2026-08-09_ga4_source.json` and `2026-07-27_to_2026-08-02_ga4_source.json`.
- Neither manifest has the required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` export is present. The newer manifest also extends beyond the current finalized watermark.
- No source-native GA4 or Search Console comparison is valid. Missing CSV data is unavailable, not zero.
- The fresh August manifest is exporter-health evidence that the external job still runs but its artifact set remains incomplete. The Google Apps Script repair in `block.md` remains a genuine human-only blocker because this operator has no Apps Script execution/configuration surface.
- Runtime GA4 source and exact built output retain the configured path-only policy.
- Cloudflare analytics remains not configured.
- Public search sampling remains directional and lagged while Search Console exports are unavailable.
- The npm scoped-package first-publication blocker remains unresolved; the website must not claim `@eunomia-bpf/agentsight` is installable until the registry confirms it.

## Content clock and portfolio

- Latest qualifying substantive publication: `/integrations/cursor/` as part of the AgentSight `v1.0.4` release synchronization.
- Exact qualifying static publication completed `2026-08-10 10:11:26` PDT (`2026-08-10T17:11:26Z`). This resets the rolling 48-hour content clock.
- The page qualifies because it adds a distinct reader answer plus exact first-party implementation and limitation information; the release-number/changelog synchronization alone would not qualify.
- Do not immediately publish another Cursor/IDE variant unless a materially new source or reader decision appears.
- Preferred future content families remain public-safe first-party run studies, MCP audits, Agent Flamegraph analyses, measured performance/cost work, and implementation changes that materially move an observability boundary.

## Outstanding follow-up

- Complete metadata-only closeout PR `#48` after ordinary exact-head Website CI and a clean from-scratch review. No production deployment wait is required because it changes no generated site output.
- Re-check public homepage and Cursor-route freshness in a later normal cycle; do not mutate rendered content solely to force crawler refresh.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum human action and resolution evidence.
- Resolve the npm scoped-package first publication before adding npm installation claims.
