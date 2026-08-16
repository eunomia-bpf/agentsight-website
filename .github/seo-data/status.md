# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.24`, published 16 August 2026 at product commit `4f77a4a32ed2177c7f1c29cf79f6a79d2f3c00fe`.
- v1.0.23 introduced a material product-source boundary: `ext/` is now the canonical cross-platform layout for independently composable functionality while platform capture remains native in `agentsight-capture`.
- Only `ext/session` currently exports and executes a `wasm32-wasip2` WebAssembly Component. Native discovery retains filesystem access and Cursor subagent aggregation; analysis, pprof, vis, and web are native or build-time extension boundaries.
- The current Component host is bounded and capability-oriented: default WASI P2 execution inherits no arguments, environment, stdio, directories, or network access; TCP/UDP are disabled; memory, fuel, Component/content size, and metadata size are bounded. It is a host for trusted Components shipped with AgentSight, not an arbitrary user-uploaded Wasm boundary.
- Dynamic extension discovery, extension-defined CLI commands, and opaque Controller-to-Node `/ext/*` extension routing remain follow-up work and must not be described as shipped behavior.
- v1.0.24 makes an authenticated Controller relay reconnect refresh the persisted running Node version. Older Nodes that omit the version header retain their existing value. This fixes stale fleet version labels after upgrades without Direct re-pairing or a new polling path.
- The product’s signed-in organization landing view remains **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory. Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
- Current machine/fleet views can show active and stopped sessions, observed Tokens, source-reported subscription windows, Agent Plans, CPU/RSS, and process/session state. Observed Tokens and provider-reported capacity remain separate signals.
- A selected session has three primary views: Conversation, Process Tree & AI Prompts, and Analysis. Analysis replaced separate Timeline and Detailed Events tabs while retaining event-level inspection through its interactive timeline.
- Portable agent-native `top`, `bind`, `vis`, and `report` workflows remain available on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed debug/tracing remain Linux-only.
- Current GitHub Releases publish Linux x86_64 and aarch64 binaries; Windows builds are exercised by CI/source workflows rather than published as release assets.
- Hosted sign-in exposes supported GitHub and Google entries when sign-in is available; an unconfigured provider is disabled with an explanation and provider-status failures are surfaced. This is UI behavior, not a claim that every deployment has both providers configured.
- Controller remains the coordination plane for OAuth identity, organizations, memberships, roles, plan/entitlement metadata, Node discovery, relay presence, optional encrypted Direct configuration, and authorization. Detailed runtime data remains authoritative on Nodes.
- The Free/Pro/Team/Enterprise plan catalog remains distinct from current hosted-preview effective access. Registered preview users receive the implemented hosted feature set through an `unlimited` effective plan; the website must not imply that catalog billing is already enforced.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; current allowed upstream `main` is the same commit.
- Runtime analytics remains GA4 with path-only URL reporting; Google signals and ad-personalization signals remain disabled.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement for website SEO operation: none.

## Production and public verification

- Current rendered publication: PR `#63`, **Sync v1.0.24 and document the Component architecture**, squash/main commit `a774f6e867e9106d4bb59d1243991edb0e6fe637`.
- PR `#63` exact final head `a782862206bcad6228207fab646f0894428f1b06` passed Website CI `31959478620`.
- Exact-head static artifact: `9266851351`, digest `sha256:7c9c63e3618700f5a48de1efcf23677d5cc122e891f2c03511f94785ecc1b0f7`.
- Main Website CI `31959559236` and Publish static site `31959559232` both succeeded for exact squash commit `a774f6e867e9106d4bb59d1243991edb0e6fe637`.
- Publish job completed at `2026-08-16T16:46:13Z`; `site/.source-sha` exactly identifies `a774f6e867e9106d4bb59d1243991edb0e6fe637`.
- Exact static artifact contains 39 generated index pages and 37 unique sitemap URLs; every generated index page has exactly one canonical and one H1.
- Homepage, Architecture, Product, and Changelog artifacts render v1.0.24; homepage/Architecture/Product pin product source `4f77a4a32ed2177c7f1c29cf79f6a79d2f3c00fe`; GA loader remains present; the blocked scoped npm package name does not appear in representative rendered HTML.
- The Architecture artifact includes the native-capture versus extension boundary, the single shipped session Wasm Component, bounded Wasmtime authority/resource limits, explicit dynamic-plugin non-capabilities, and the v1.0.24 relay-version refresh behavior.
- The publication-branch `/architecture/` metadata reports v1.0.24 and the expected canonical.
- Independent public retrieval immediately after publication is still cache/index stale: the homepage crawler shows the pre-publication v1.0.22 generation and the Architecture crawler shows v1.0.15. Exact main, CI, artifact, Publish, publication branch, and source marker agree on v1.0.24, so this remains a public crawler/index freshness qualification rather than a static-publication failure. Do not manufacture a rendered change solely to force refresh; investigate routing only if the mismatch persists beyond normal cache delay.

## Current analytics and search data

- Configured finalization lag: three days. The `2026-08-03` through `2026-08-09` weekly window is finalized and remains the newest completed exported weekly window present in the configured Drive folder.
- The configured Drive folder still contains only `2026-07-27_to_2026-08-02_ga4_source.json` and `2026-08-03_to_2026-08-09_ga4_source.json`.
- Neither manifest has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The manifest-only GA4 state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- The independent Alibaba Cloud Linux **How to use AgentSight** documentation remains discoverable. It describes a different ANOLISA AgentSight command/deployment surface and remains an independent brand mention rather than authoritative documentation for this repository.
- A third-party technical-blog search result appears to mention `agentsight.us` as an online demo, but the external page could not be fetched for verification. It is a search-only discovery, not a verified backlink.
- Public brand results remain mixed with unrelated products using the AgentSight name, including `agentsight.io`; treat search-result composition as directional context rather than product truth.

## Content clock and portfolio

- Latest qualifying substantive publication: the v1.0.24 Architecture evergreen refresh from PR `#63`.
- Exact static publication completed at `2026-08-16T16:46:13Z` (09:46 PDT). This resets the rolling 48-hour substantive-content clock.
- The qualifying information gain is the source-pinned Component architecture and limitation analysis: what stays native, what is composable, what actually executes as Wasm, what authority/resource limits apply, and what general plugin/runtime capabilities are not shipped. The release-number bump alone does not qualify.
- The existing canonical portfolio should absorb current product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next research-content candidates remain evidence-producing work such as a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph study built from public-safe first-party sessions.

## Outstanding follow-up

- Re-check the canonical homepage and `/architecture/` after crawler/CDN freshness catches up. If normal independent retrieval remains stale beyond routine cache delay while the publication branch stays current, investigate production routing/cache as a real incident.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. A fresh 16 August public package search still did not establish `@eunomia-bpf/agentsight` on npm, so the website must not claim that package is installable.
