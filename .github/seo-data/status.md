# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.26`, released 22 August 2026 at product commit `92d634ec02d116a52acae62eb3b9b00c771e0b9d`.
- v1.0.26 fixes the recorded demo so it loads a recorded `LiveOverview` beside the saved session snapshot. The release uses coherent Codex and Claude fixtures across Overview, Conversation, Process Tree & AI Prompts, and Analysis, including process/resource state, tools, network targets, failures, plans, and source-reported subscriptions. Product PR `#200` adds Playwright coverage for this complete demo path.
- v1.0.25 messaging hardening remains current behavior: provider initialization/resume/transport failures are surfaced rather than reported as false acceptance, same-session submissions are serialized, ambiguous delivery is not automatically resent, and Direct/relay request paths have bounded message, concurrency, response, and deadline contracts.
- v1.0.23 introduced the current product-source boundary: `ext/` is the canonical cross-platform layout for independently composable functionality while platform capture remains native in `agentsight-capture`.
- Only `ext/session` currently exports and executes a `wasm32-wasip2` WebAssembly Component. Dynamic extension discovery, extension-defined CLI commands, and opaque Controller-to-Node `/ext/*` extension routing remain follow-up work and must not be described as shipped behavior.
- The signed-in organization landing view remains **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory; Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
- A selected session has three primary views: Conversation, Process Tree & AI Prompts, and Analysis. Analysis retains event-level inspection through its interactive timeline.
- Portable agent-native `top`, `bind`, `vis`, and `report` workflows remain available on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed debug/tracing remain Linux-only.
- Current GitHub Releases publish Linux x86_64 and aarch64 binaries; Windows builds are exercised by CI/source workflows rather than published as release assets.
- The Free/Pro/Team/Enterprise plan catalog remains distinct from current hosted-preview effective access. Registered preview users receive the implemented hosted feature set through an `unlimited` effective plan; the website must not imply that catalog billing is already enforced.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; the allowed upstream `main` was rechecked on 22 August and is unchanged at the same commit.
- Runtime analytics remains GA4 with path-only URL reporting; Google signals and ad-personalization signals remain disabled.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement for website SEO operation: none.

## Production and public verification

- The v1.0.26 website synchronization is delivered through rendered PR `#77`, **Synchronize AgentSight website to v1.0.26**.
- PR `#77` exact final head `d3a9fac9d03a97170e499df4cb50f0500b44d991` passed Website CI `32585928154`, including the autonomous SEO scope guard, `npm ci`, `npm run verify`, and static artifact upload.
- Exact static artifact `9479038054` has digest `sha256:dfa97b7dba29554e33190b197971db8c6d8bc27396fe599a47bf659d8a63893c`.
- Exact artifact review found 38 normal generated index pages and 38 sitemap URLs. Every normal page has exactly one canonical and one H1. Homepage output contains v1.0.26 and product pin `92d634ec02d116a52acae62eb3b9b00c771e0b9d`; Changelog and `llms.txt` describe the recorded-demo fix while preserving v1.0.25 messaging history; GA4 remains present; version-pinned research pages were not mechanically rewritten.
- PR `#77` was squash-merged as `a1b21100ff12fe418a4777912583c3f6b8750da3` at `2026-08-22T16:52:41Z`.
- Exact static publication created `site` commit `20ffbe85967fc883540191abb29c4c961a19ae90` at `2026-08-22T16:53:20Z` with message `Publish a1b21100ff12fe418a4777912583c3f6b8750da3`.
- `site/.source-sha` exactly identifies `a1b21100ff12fe418a4777912583c3f6b8750da3`, proving the publication branch is generated from the rendered squash commit.
- Independent canonical-homepage crawler retrieval immediately after exact publication still returned the previous v1.0.25 generation. Because exact-head CI, generated artifact, `site` publication, and source marker all agree on v1.0.26, this is currently a crawler/CDN freshness qualification rather than evidence of a rendered-site regression. Do not make a cache-forcing content change solely for this mismatch.
- The latest qualifying substantive rendered publication remains PR `#75`, **Explain what the AgentSight overhead benchmark actually measures**, published at `2026-08-21T16:39:40Z`. The v1.0.26 factual synchronization does not reset the substantive-content clock.

## Current analytics and search data

- Configured finalization lag: three days. On 22 August 2026, the latest fully finalized calendar date is 19 August.
- The configured Drive folder still contains exactly three AgentSight GA4 source manifests: `2026-07-27_to_2026-08-02_ga4_source.json`, `2026-08-03_to_2026-08-09_ga4_source.json`, and `2026-08-10_to_2026-08-16_ga4_source.json`.
- The newest manifest covers 10–16 August and was generated on 17 August.
- Direct-child inspection on 22 August still returns no CSV files. None of the manifests has the required paired `*_ga4_organic_landing_pages.csv`, and no matching Search Console `*_gsc_*.csv` export is present.
- Both the 3–9 August and 10–16 August weekly windows are fully finalized and remain manifest-only. GA4 and Search Console source-native metrics are unavailable, not zero; no valid period-over-period landing-page or query analysis can be computed from the current artifacts.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand discovery remains mixed with unrelated products using the AgentSight name. The AgentSight project and paper remain independently discoverable through GitHub and academic/indexing surfaces; search-only discoveries are not recorded as backlinks without inspecting the external page and confirming an actual link to `agentsight.us`.
- No new independently verified backlink to `agentsight.us` was established in the 22 August bounded scan.
- A fresh public registry-oriented check still did not establish that `@eunomia-bpf/agentsight@1.0.0` has been published. The website must continue to avoid claiming the scoped npm package as an available install path.

## Content clock and portfolio

- Latest qualifying publication: `/blog/how-much-overhead-does-agentsight-add/`.
- Exact static publication completed at `2026-08-21T16:39:40Z` (09:39 PDT), resetting the substantive-content clock.
- Waiting until the next normal daily cycle remains inside the rolling 48-hour content SLO, so the 22 August cycle did not manufacture an additional article after the higher-priority v1.0.26 factual repair.
- The v1.0.26 release synchronization is a factual/product-source repair and does not itself reset the substantive-content clock.
- The overhead article owns a distinct reader decision: interpret the paper's AgentSight instrumentation-overhead result and design a current workload benchmark. `/use-cases/profile-slow-expensive-agent-runs/` continues to own diagnosis of an agent workload's own latency, while `/guides/agent-flamegraph/` owns offline aggregate profiling.
- Future content should continue to prefer public-safe first-party measurements or artifacts over generic summaries. A current-version workload replay with larger sample sizes would be a stronger follow-up than another broad overhead summary.

## Outstanding follow-up

- Re-check the canonical homepage and `/changelog/` after normal crawler/CDN freshness catches up. Investigate production routing/cache only if independent live retrieval remains stale while the publication branch continues to identify v1.0.26.
- Re-check `/blog/how-much-overhead-does-agentsight-add/`, `/blog/`, and other recently refreshed detail routes after normal crawler/index freshness catches up.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required. Two consecutive fully finalized weekly windows remain manifest-only.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
