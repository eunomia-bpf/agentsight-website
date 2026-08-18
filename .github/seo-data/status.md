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

- Current substantive rendered publication: PR `#69`, **Refresh Agent Flamegraph guide for reproducible profiling**.
- PR `#69` exact final head `2aba753c37bd83f53ebad02cddae80ebdb09e6b2` passed Website CI `32162857964`; the SEO scope guard, `npm ci`, `npm run verify`, static export, and artifact upload all completed successfully.
- Exact-head static artifact: `9334288217`, digest `sha256:7c3902555e98f1d71e7f3f2e8a94c4e819e8a8e393cda90bed6836a637094737`.
- Exact artifact review found 39 generated `index.html` files including two error/not-found outputs, 37 normal generated index pages, and 37 unique sitemap URLs. Every normal generated index page has exactly one canonical and one H1.
- The refreshed `/guides/agent-flamegraph/` artifact has one H1/canonical, roughly 1,650 whitespace-separated text tokens, 15 H2 sections, the current v1.0.25 source scope, five width units/caveats, explicit session-set reproducibility, stack/mapping/filter controls, tagging checks, token-estimate and privacy limits, exact first-party sources, and a commit-pinned first-party token flamegraph.
- PR `#69` was squash-merged as `b967206847915dc42535b127295647a239df2bc7`.
- The `site` branch was published by `github-actions[bot]` at `2026-08-18T16:58:09Z` as commit `349722f3971784392b34ed2a03ed2ef0eca81194` with message `Publish b967206847915dc42535b127295647a239df2bc7`.
- `site/.source-sha` exactly identifies `b967206847915dc42535b127295647a239df2bc7`; publication-branch HTML for `/guides/agent-flamegraph/` contains the expected canonical and refreshed output. The source-pinned publish workflow runs `npm ci` and `npm run verify` before writing the publication branch.
- Representative artifact output remains stable: homepage contains GA4 and v1.0.25, Architecture retains one H1/canonical, other guide routes build normally, and the sitemap remains 37 URLs.
- Independent canonical-homepage retrieval is now fresh for v1.0.25, resolving yesterday's homepage freshness qualification.
- Independent direct retrieval of the newly refreshed Agent Flamegraph route immediately after publication returned a crawler cache miss. Architecture retrieval still exposes an explicitly four-day-old v1.0.15 crawl. Exact CI, artifact, publication commit, publication branch, and source marker all agree on current output, so these detail-route results remain crawler/CDN/index freshness qualifications rather than evidence of a static-publication failure. Do not manufacture rendered changes solely to force crawler refresh.
- The previous v1.0.25 factual release synchronization from PR `#67` remains intact; PR #69 changes only the existing Agent Flamegraph canonical plus its operating record and does not alter release identity, URLs, navigation, analytics policy, or documentation ownership.

## Current analytics and search data

- Configured finalization lag: three days. On 18 August 2026, source-native data after 15 August is not yet fully finalized.
- The configured Drive folder contains three AgentSight GA4 source manifests: `2026-07-27_to_2026-08-02_ga4_source.json`, `2026-08-03_to_2026-08-09_ga4_source.json`, and `2026-08-10_to_2026-08-16_ga4_source.json`.
- The newest manifest was generated on 17 August for `agentsight.us`; its public-safe SHA-256 remains `f8d31e5f2ecc4f317ec000d977a004f691c12473a8579cd144a9ac6403f44b44`.
- None of the manifests has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The fully finalized 3–9 August window therefore still has no usable GA4/GSC export. The 10–16 August weekly range is not fully finalized under the configured lag.
- The manifest-only state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand results remain mixed with unrelated products using the AgentSight name, especially `agentsight.io`; the canonical `agentsight.us` homepage and Eunomia repository remain discoverable. Treat public result composition as directional context rather than product truth or Search Console evidence.
- The independent Alibaba Cloud Linux **How to use AgentSight** documentation remains discoverable and describes a different ANOLISA AgentSight command/deployment surface. It remains an independent brand mention rather than authoritative documentation for this repository.

## Content clock and portfolio

- Latest qualifying substantive publication is now the Agent Flamegraph evergreen refresh from PR `#69`.
- Exact static publication completed at `2026-08-18T16:58:09Z` (09:58 PDT). This resets the rolling 48-hour substantive-content clock.
- The refreshed guide is a current implementation/reference article rather than a keyword variant: it explains offline/rootless agent history profiling, reproducible input selection, semantic stack and width semantics, current tag-quality diagnostics, and privacy/failure boundaries from exact v1.0.25 first-party sources.
- The existing canonical portfolio should absorb future product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next evidence-producing candidates should be distinct from this guide, preferably a real MCP-server audit or a reproducible slow/expensive-run breakdown built from public-safe first-party sessions. Another implementation/reference refresh should require new source-supported reader value.

## Outstanding follow-up

- Re-check `/guides/agent-flamegraph/` and other stale detail routes after normal crawler/CDN freshness catches up. Investigate production routing/cache only if fresh independent live retrieval remains inconsistent while the publication branch stays current.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
