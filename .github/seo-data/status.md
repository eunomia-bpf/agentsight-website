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
- v1.0.24 makes an authenticated Controller relay reconnect refresh the persisted running Node version. Older Nodes that omit the version header retain their existing value.
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

- Starting production source for the 17 August cycle is website `main` `223b4c39cdd4bee4641140d35eaa335d819722a7`, owner PR `#65`, which derives product sitemap freshness from `site.releaseDate` after the v1.0.24 publication.
- `site/.source-sha` exactly identifies `223b4c39cdd4bee4641140d35eaa335d819722a7`; the publication-branch homepage and Architecture page render v1.0.24 and the expected canonicals.
- The generated homepage contains the configured GA4 loader `G-VVRNSCMWBX`, consistent with `src/app/layout.tsx` and the path-only URL policy.
- Independent canonical-homepage retrieval on 17 August is fresh for the v1.0.24 baseline, resolving the homepage cache qualification recorded immediately after the prior publication.
- Independent Architecture retrieval is still an explicitly older cached crawl, while the publication branch contains the current v1.0.24 Architecture. Treat that result as crawler/index freshness, not evidence of a production-routing incident; investigate routing only if an independent live fetch remains stale beyond normal cache delay.
- The website is therefore factually one release behind the authoritative v1.0.25 product until the current synchronization PR completes. No route or canonical migration is required.

## Current analytics and search data

- Configured finalization lag: three days. On 17 August 2026, source-native data after 14 August is not yet fully finalized.
- The configured Drive folder now contains three AgentSight GA4 source manifests: `2026-07-27_to_2026-08-02_ga4_source.json`, `2026-08-03_to_2026-08-09_ga4_source.json`, and newly generated `2026-08-10_to_2026-08-16_ga4_source.json`.
- The newest manifest was generated on 17 August for `agentsight.us`; its public-safe SHA-256 is `f8d31e5f2ecc4f317ec000d977a004f691c12473a8579cd144a9ac6403f44b44`.
- None of the manifests has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The fully finalized 3–9 August window therefore still has no usable GA4/GSC export. The 10–16 August manifest is additionally too recent to treat the entire weekly window as finalized today.
- The manifest-only state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand results remain mixed with unrelated products using the AgentSight name, including `agentsight.io`; treat search-result composition as directional context rather than product truth.
- The independent Alibaba Cloud Linux **How to use AgentSight** documentation remains discoverable and describes a different ANOLISA AgentSight command/deployment surface. It remains an independent brand mention rather than authoritative documentation for this repository.

## Content clock and portfolio

- Latest qualifying substantive publication: the v1.0.24 Architecture evergreen refresh from PR `#63`.
- Exact static publication completed at `2026-08-16T16:46:13Z` (09:46 PDT). Waiting until the next normal daily cycle remains inside the rolling 48-hour publication window.
- The v1.0.25 release synchronization is a factual product repair and does not qualify merely because the version changed.
- The existing canonical portfolio should absorb current product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next research-content candidates remain evidence-producing work such as a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph study built from public-safe first-party sessions.

## Outstanding follow-up

- Complete the v1.0.25 website synchronization through exact-head CI, from-scratch review, squash merge, exact static publication, public acceptance, and metadata closeout.
- Re-check the canonical Architecture route with a fresh independent public fetch after normal crawler/CDN freshness catches up; do not alter rendered content merely to force a search cache refresh.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
