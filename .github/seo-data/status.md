# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.25`, published 16 August 2026 at product commit `0080545f7c6b110ec2d4a4af5100b58f514c84d5`.
- The authoritative product `master` was rechecked on 20 August and still ends at the same v1.0.25 release commit. There is no product or release drift awaiting website synchronization.
- v1.0.25 hardens live provider session messaging: provider initialization/resume/transport failures are surfaced rather than reported as false acceptance, same-session submissions are serialized, ambiguous delivery is not automatically resent, and Direct/relay request paths have bounded message, concurrency, response, and deadline contracts.
- v1.0.23 introduced the current product-source boundary: `ext/` is the canonical cross-platform layout for independently composable functionality while platform capture remains native in `agentsight-capture`.
- Only `ext/session` currently exports and executes a `wasm32-wasip2` WebAssembly Component. Dynamic extension discovery, extension-defined CLI commands, and opaque Controller-to-Node `/ext/*` extension routing remain follow-up work and must not be described as shipped behavior.
- The signed-in organization landing view remains **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory; Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
- A selected session has three primary views: Conversation, Process Tree & AI Prompts, and Analysis. Analysis retains event-level inspection through its interactive timeline.
- Portable agent-native `top`, `bind`, `vis`, and `report` workflows remain available on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed debug/tracing remain Linux-only.
- Current GitHub Releases publish Linux x86_64 and aarch64 binaries; Windows builds are exercised by CI/source workflows rather than published as release assets.
- The Free/Pro/Team/Enterprise plan catalog remains distinct from current hosted-preview effective access. Registered preview users receive the implemented hosted feature set through an `unlimited` effective plan; the website must not imply that catalog billing is already enforced.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; the allowed upstream `main` was rechecked on 20 August and is unchanged at the same commit.
- Runtime analytics remains GA4 with path-only URL reporting; Google signals and ad-personalization signals remain disabled.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement for website SEO operation: none.

## Production and public verification

- Current substantive rendered publication: PR `#72`, **Refresh MCP server audit for the 2026 protocol**.
- PR `#72` exact final head `5861bcc8c4538c203a4113ef9e1c2f76cfc4b490` passed Website CI `32279595222`.
- Exact-head static artifact: `9375300053`, digest `sha256:e7b29a3aa06ad15ee92dd2388657fb6e8bed1736feaacd393d18f35b59650c35`.
- Exact artifact review found 37 normal generated pages and 37 unique sitemap URLs. Every normal generated page has exactly one canonical and one H1.
- The refreshed `/mcp-server-audit/` artifact has one H1/canonical, about 1,805 whitespace-separated words, 16 H2 sections, MCP `2026-07-28` scope, corrected `docs/experiment/mcp-test/...` runnable paths, exact v1.0.25 fixture/stdiocap sources, current official MCP sources, and horizontally bounded comparison tables.
- PR `#72` was squash-merged as `2c353664d149079b1e5b38a67d5204ac2e724e14`.
- The `site` branch was published at `2026-08-19T17:07:34Z` from that exact squash commit, and `site/.source-sha` still identifies `2c353664d149079b1e5b38a67d5204ac2e724e14` on 20 August.
- Publication-branch homepage HTML still contains the expected GA4 loader and current generated site assets. No publication-source drift was found.
- Independent public search remains directionally stale. A crawler snapshot of the homepage still exposes an older v1.0.3 generation, and fresh crawler retrieval of `/mcp-server-audit/` and `/guides/agent-flamegraph/` was not established on 20 August. The canonical domain, Eunomia documentation, and Eunomia GitHub repository remain discoverable.
- Exact product source, exact Website publication branch, generated HTML, and `site/.source-sha` are internally consistent, so the stale crawler state remains a crawler/CDN/index freshness qualification rather than evidence of static-publication rollback. Do not manufacture rendered changes solely to force crawler refresh.

## Current analytics and search data

- Configured finalization lag: three days. On 20 August 2026, the latest fully finalized calendar date is 17 August.
- The configured Drive folder still contains exactly three AgentSight GA4 source manifests: `2026-07-27_to_2026-08-02_ga4_source.json`, `2026-08-03_to_2026-08-09_ga4_source.json`, and `2026-08-10_to_2026-08-16_ga4_source.json`.
- The newest manifest covers 10–16 August, was generated on 17 August, and its public-safe SHA-256 remains `f8d31e5f2ecc4f317ec000d977a004f691c12473a8579cd144a9ac6403f44b44`.
- Direct-child inspection on 20 August still returns no CSV files. None of the manifests has the required paired `*_ga4_organic_landing_pages.csv`, and no matching Search Console `*_gsc_*.csv` export is present.
- Both the 3–9 August and 10–16 August weekly windows are fully finalized and remain manifest-only. The exporter-health failure therefore persists across two consecutive finalized weekly windows.
- GA4 and Search Console source-native metrics are unavailable, not zero; no valid period-over-period landing-page or query analysis can be computed from the current artifacts.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand results remain mixed with unrelated products using the AgentSight name. Search result composition is directional context rather than product truth or Search Console evidence.
- No new independently verified backlink to `agentsight.us` was established in the 20 August bounded scan.
- A fresh public registry-oriented search still did not establish that `@eunomia-bpf/agentsight@1.0.0` has been published. The website must continue to avoid claiming the scoped npm package as an available install path.

## Content clock and portfolio

- Latest qualifying substantive publication remains the MCP server audit evergreen refresh from PR `#72`.
- Exact static publication completed at `2026-08-19T17:07:34Z` (10:07 PDT). This remains the rolling 48-hour substantive-content clock origin.
- Waiting until the next normal daily cycle around 09:00 PDT on 21 August remains inside the 48-hour target, so the 20 August cycle does not require a publication solely for cadence.
- No higher-priority site-owned production, crawlability, analytics-instrumentation, or factual defect with a safe repository repair was found on 20 August. The correct operating outcome is a data/status-only cycle; it does not reset the content clock.
- The existing canonical portfolio should absorb future product or upstream changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next evidence-producing candidate should use actual public-safe first-party runtime/session data, preferably a reproducible slow/expensive-run breakdown showing model time, waits/retries, child processes, file/network effects, and local resource behavior in one bounded task.

## Outstanding follow-up

- Re-check `/mcp-server-audit/`, `/guides/agent-flamegraph/`, and other stale detail routes after normal crawler/CDN freshness catches up. Investigate production routing/cache only if fresh independent live retrieval remains inconsistent while the publication branch stays current.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required. The evidence remains strong because two consecutive fully finalized weekly windows are manifest-only.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
