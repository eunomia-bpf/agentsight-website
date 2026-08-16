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

- The last completed rendered publication is the v1.0.22 release synchronization from PR `#61`, squash/main commit `f1f990bd4ac2854ceb727ac5a49d690e020d093a`.
- Its exact-head Website CI `31896164711`, main Website CI `31896250720`, and Publish static site `31896250693` succeeded; `site/.source-sha` currently identifies the same rendered commit.
- The v1.0.22 exact static artifact contains 39 generated index pages and 37 unique sitemap URLs; every generated page has exactly one canonical and one H1.
- Direct canonical-homepage retrieval on 16 August is fresh for that v1.0.22 baseline and exposes v1.0.22 plus product source pin `4a789dc90942efaa09a21be4b83e0dec3629bce8`. The homepage freshness qualification recorded immediately after the 15 August publication is resolved.
- An independently cached `/architecture/` retrieval remains older and reports v1.0.15. Treat it as per-route crawler/index freshness while exact publication evidence remains consistent; do not manufacture a rendered change solely to force cache refresh.
- Current product drift to v1.0.24 is being repaired through the 16 August architecture/release synchronization cycle. Production acceptance is not complete until exact-head CI, squash merge, exact static publication, publication-branch verification, and public checks finish.

## Current analytics and search data

- Configured finalization lag: three days. The `2026-08-03` through `2026-08-09` weekly window is finalized and remains the newest completed exported weekly window present in the configured Drive folder.
- The configured Drive folder still contains only `2026-07-27_to_2026-08-02_ga4_source.json` and `2026-08-03_to_2026-08-09_ga4_source.json`.
- Neither manifest has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The manifest-only GA4 state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- The independent Alibaba Cloud Linux **How to use AgentSight** documentation remains discoverable. It describes a different ANOLISA AgentSight command/deployment surface and remains an independent brand mention rather than authoritative documentation for this repository.
- A third-party technical-blog search result now appears to mention `agentsight.us` as an online demo, but the external page could not be fetched for verification. It is a search-only discovery, not a verified backlink.
- Public brand results remain mixed with unrelated products using the AgentSight name, including `agentsight.io`; treat search-result composition as directional context rather than product truth.

## Content clock and portfolio

- Latest completed qualifying substantive publication: the v1.0.21 Product/Architecture major evergreen refresh from PR `#59`.
- Its exact static publication completed at `2026-08-14T17:12:35Z`.
- At the 16 August operating cycle, waiting until the next normal daily cycle would exceed the rolling 48-hour content SLO. A qualifying publication is therefore required today after higher-priority factual repair.
- The selected qualifying outcome is a major refresh of the existing `/architecture/` canonical, not a new URL. It explains the new native-capture versus extension boundary, the exact single-session Wasm Component, bounded Wasmtime authority and resource limits, explicit non-capabilities, and the v1.0.24 relay-version freshness behavior using exact released source.
- The Architecture refresh counts only after exact-head CI, squash merge, and exact static publication. Release-number synchronization or a thin changelog entry alone does not reset the content clock.
- The existing canonical portfolio should absorb current product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next research-content candidates remain evidence-producing work such as a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph study built from public-safe first-party sessions.

## Outstanding follow-up

- Complete and verify the v1.0.24 release synchronization plus Architecture evergreen refresh selected for the 16 August cycle.
- Re-check `/architecture/` after exact publication; if a normal independent fetch remains stale while publication evidence is current, keep a truthful crawler/index qualification and investigate only if the mismatch persists beyond normal cache delay.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. A fresh 16 August public package search still did not establish `@eunomia-bpf/agentsight` on npm, so the website must not claim that package is installable.
