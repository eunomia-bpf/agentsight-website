# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.25`, published 16 August 2026 at product commit `0080545f7c6b110ec2d4a4af5100b58f514c84d5`.
- v1.0.25 hardens live provider session messaging. Codex resume prefers the session-recorded standalone CLI version when usable, provider initialization/resume/transport/timeout failures are surfaced rather than reported as false acceptance, same-session submissions are serialized, ambiguous delivery is not automatically resent, and Direct/relay request paths have bounded message, concurrency, response, and deadline contracts.
- v1.0.23 introduced the current product-source boundary: `ext/` is the canonical cross-platform layout for independently composable functionality while platform capture remains native in `agentsight-capture`.
- Only `ext/session` currently exports and executes a `wasm32-wasip2` WebAssembly Component. Native discovery retains filesystem access and Cursor subagent aggregation; analysis, pprof, vis, and web are native or build-time extension boundaries.
- The Component host is bounded and capability-oriented: default WASI P2 execution inherits no arguments, environment, stdio, directories, or network access; TCP/UDP are disabled; memory, fuel, Component/content size, and metadata size are bounded. It is a host for trusted Components shipped with AgentSight, not an arbitrary user-uploaded Wasm boundary.
- Dynamic extension discovery, extension-defined CLI commands, and opaque Controller-to-Node `/ext/*` extension routing remain follow-up work and must not be described as shipped behavior.
- The signed-in organization landing view remains **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory. Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
- A selected session has three primary views: Conversation, Process Tree & AI Prompts, and Analysis. Analysis retains event-level inspection through its interactive timeline.
- Portable agent-native `top`, `bind`, `vis`, and `report` workflows remain available on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed debug/tracing remain Linux-only.
- Current GitHub Releases publish Linux x86_64 and aarch64 binaries; Windows builds are exercised by CI/source workflows rather than published as release assets.
- Controller remains the coordination plane for OAuth identity, organizations, memberships, roles, plan/entitlement metadata, Node discovery, relay presence, optional encrypted Direct configuration, and authorization. Detailed runtime data remains authoritative on Nodes.
- The Free/Pro/Team/Enterprise plan catalog remains distinct from current hosted-preview effective access. Registered preview users receive the implemented hosted feature set through an `unlimited` effective plan; the website must not imply that catalog billing is already enforced.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; current allowed upstream `main` is the same commit.
- Runtime analytics remains GA4 with path-only URL reporting; Google signals and ad-personalization signals remain disabled.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement for website SEO operation: none.

## Production and public verification

- Current substantive rendered publication: PR `#72`, **Refresh MCP server audit for the 2026 protocol**.
- PR `#72` exact final head `5861bcc8c4538c203a4113ef9e1c2f76cfc4b490` passed Website CI `32279595222`; the SEO scope guard, `npm ci`, `npm run verify`, static export, and artifact upload all completed successfully.
- Exact-head static artifact: `9375300053`, digest `sha256:e7b29a3aa06ad15ee92dd2388657fb6e8bed1736feaacd393d18f35b59650c35`.
- Exact artifact review found 39 generated `index.html` files including two error/not-found outputs, 37 normal generated index pages, and 37 unique sitemap URLs. Every normal generated index page has exactly one canonical and one H1.
- The refreshed `/mcp-server-audit/` artifact has one H1/canonical, about 1,805 whitespace-separated words, 16 H2 sections, MCP `2026-07-28` scope, corrected `docs/experiment/mcp-test/...` runnable paths, exact v1.0.25 fixture/stdiocap sources, current official MCP sources, and horizontally bounded comparison tables.
- The page now distinguishes current MCP protocol behavior from the shipped AgentSight fixture's legacy `2025-03-26` handshake, treats the fixture as a known-positive capture baseline rather than current-protocol conformance, and documents stdio syscall-chunk/truncation limits from the exact BPF implementation.
- PR `#72` was squash-merged as `2c353664d149079b1e5b38a67d5204ac2e724e14`.
- The `site` branch was published by `github-actions[bot]` at `2026-08-19T17:07:34Z` as commit `c87f1905e50d1ab7d4d7eedc8dbb842c68edba5b` with message `Publish 2c353664d149079b1e5b38a67d5204ac2e724e14`.
- `site/.source-sha` exactly identifies `2c353664d149079b1e5b38a67d5204ac2e724e14`; publication-branch HTML for `/mcp-server-audit/` contains the expected canonical and refreshed output. The source-pinned publication workflow runs `npm ci` and `npm run verify` before writing the publication branch.
- Representative artifact behavior remains stable: route and sitemap counts are unchanged, all normal generated pages retain one H1/canonical, and no route, redirect, navigation, analytics, dependency, workflow, or deployment configuration changed.
- Independent public retrieval immediately after publication remains stale/incomplete. The crawler-visible homepage still exposes an older v1.0.3 generation, and a fresh independent MCP-route retrieval was not established. Exact CI, reviewed artifact, publication commit, publication-branch HTML, and source marker agree, so the current result remains a crawler/CDN/index freshness qualification rather than evidence of static-publication failure. Do not manufacture rendered changes solely to force crawler refresh.
- The previous Agent Flamegraph evergreen refresh from PR `#69` remains intact; PR #72 changes only the existing MCP audit canonical and does not alter release identity, URLs, navigation, analytics policy, or documentation ownership.

## Current analytics and search data

- Configured finalization lag: three days. On 19 August 2026, the latest fully finalized date is 16 August.
- The configured Drive folder contains three AgentSight GA4 source manifests: `2026-07-27_to_2026-08-02_ga4_source.json`, `2026-08-03_to_2026-08-09_ga4_source.json`, and `2026-08-10_to_2026-08-16_ga4_source.json`.
- The newest manifest was generated on 17 August for `agentsight.us`; its public-safe SHA-256 remains `f8d31e5f2ecc4f317ec000d977a004f691c12473a8579cd144a9ac6403f44b44`.
- Direct-child search of the configured folder on 19 August returned no CSV files. None of the manifests has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- Both the 3–9 August and 10–16 August weekly windows are now fully finalized under the configured lag and remain manifest-only. The exporter-health failure therefore persists across two consecutive finalized weekly windows.
- GA4 and Search Console source-native metrics are unavailable, not zero; no valid period-over-period landing-page or query analysis can be computed from the current artifacts.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand results remain mixed with unrelated products using the AgentSight name. The canonical `agentsight.us` website and Eunomia repository remain discoverable; treat public result composition as directional context rather than product truth or Search Console evidence.
- No new independently verified backlink to `agentsight.us` was established in this cycle.
- The independent Alibaba Cloud Linux **How to use AgentSight** documentation remains a separate AgentSight-branded surface with a different command/deployment model and is not authoritative documentation for this repository.

## Content clock and portfolio

- Latest qualifying substantive publication is the MCP server audit evergreen refresh from PR `#72`.
- Exact static publication completed at `2026-08-19T17:07:34Z` (10:07 PDT). This resets the rolling 48-hour substantive-content clock.
- The refreshed page is a current protocol/system-audit reference rather than a keyword variant: it compares MCP protocol facts with observed process/file/network/stdio effects, pins exact AgentSight fixture behavior and buffer limits, exposes protocol-version drift, and states uncertainty/reproduction boundaries.
- The existing canonical portfolio should absorb future product or upstream changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next evidence-producing candidate should use actual public-safe first-party runtime/session data, preferably a reproducible slow/expensive-run breakdown showing model time, waits/retries, child processes, file/network effects, and local resource behavior in one bounded task.

## Outstanding follow-up

- Re-check `/mcp-server-audit/`, `/guides/agent-flamegraph/`, and other stale detail routes after normal crawler/CDN freshness catches up. Investigate production routing/cache only if fresh independent live retrieval remains inconsistent while the publication branch stays current.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required. The evidence is now stronger because two consecutive fully finalized weekly windows remain manifest-only.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
