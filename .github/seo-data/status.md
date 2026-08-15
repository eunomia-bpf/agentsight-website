# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.22`, published 15 August 2026 at product commit `4a789dc90942efaa09a21be4b83e0dec3629bce8`.
- v1.0.22 is a repository-hygiene release rather than a product-behavior change. Product PR `#186` removes a committed local environment file, adds/maintains environment-file hygiene and an example file, and explicitly states that runtime/product behavior is unchanged. The user-facing product model described below remains the v1.0.21 model.
- The website release identity is synchronized to v1.0.22 through PR `#61`, squash/main commit `f1f990bd4ac2854ceb727ac5a49d690e020d093a`.
- PR `#61` exact-head Website CI `31896164711`, main Website CI `31896250720`, and Publish static site `31896250693` succeeded. The exact pre-merge static artifact is `9249851468` with digest `sha256:ac06c93c2467ce46a2e3f139fa502e2c188f99b82e3dac67645af6ab24ba8111`.
- `site/.source-sha` exactly matches the rendered v1.0.22 squash commit `f1f990bd4ac2854ceb727ac5a49d690e020d093a` after publication.
- The product’s current signed-in organization landing view is **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory. Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
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

- The v1.0.22 exact static artifact contains 39 generated index pages and 37 unique sitemap URLs; every generated page has exactly one canonical and one H1.
- The publication-branch homepage contains v1.0.22, product source pin `4a789dc90942efaa09a21be4b83e0dec3629bce8`, the existing canonical, and the expected GA loader.
- The Changelog explicitly describes v1.0.22 as repository hygiene with no runtime/product behavior change; `llms.txt` reports v1.0.22 while retaining the v1.0.21 user-facing product model.
- No public route, redirect, canonical owner, primary navigation item/destination, pricing-catalog semantics, GA4 behavior, documentation ownership, dependency, workflow, or deployment configuration changed in the v1.0.22 repair.
- Independent canonical-homepage retrieval immediately after exact publication still exposed the pre-publication v1.0.21 generation. Exact main commit, CI, generated artifact, Publish static site, and `site/.source-sha` all agree on the v1.0.22 publication, so the current mismatch is recorded as crawler/CDN freshness rather than a static-publication failure. Do not manufacture a rendered change solely to force refresh; recheck later and escalate only if independently persistent.
- Public search indexes are also materially behind direct/publication-branch truth and still expose older positioning in sampled results. Treat that as directional index freshness, not current product truth.

## Current analytics and search data

- Configured finalization lag: three days. The `2026-08-03` through `2026-08-09` weekly window is finalized.
- The configured Drive folder still contains only `2026-07-27_to_2026-08-02_ga4_source.json` and `2026-08-03_to_2026-08-09_ga4_source.json`.
- Neither manifest has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The manifest-only GA4 state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- A 15 August off-site scan verified an independent Alibaba Cloud Linux documentation page titled **How to use AgentSight**, last updated 20 June 2026. It is recorded as an independent brand mention, not a backlink: inspection found Alibaba documentation navigation/Quick Start links but no verified link to `agentsight.us` or the current upstream repository. Its documented command/deployment surface also differs from current upstream AgentSight and is not authoritative product documentation for this site.
- No new independent external link to `agentsight.us` was verified in the current off-site scan.

## Content clock and portfolio

- Latest qualifying substantive publication: the v1.0.21 Product/Architecture major evergreen refresh from PR `#59`.
- Exact static publication completed at `2026-08-14T17:12:35Z`; this remains the rolling 48-hour substantive-content clock source.
- The v1.0.22 release synchronization does not qualify because the release contains repository hygiene rather than new user-facing behavior. Waiting until the next normal daily cycle remains inside the 48-hour SLO, so no thin release page or filler article is justified today.
- The existing canonical portfolio should absorb current product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next research-content candidates remain evidence-producing work such as a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph study built from public-safe first-party sessions.

## Outstanding follow-up

- Re-check the canonical homepage after crawler/CDN freshness catches up; if a normal independent fetch still serves v1.0.21 after the later operating cycle, investigate production routing/cache as a real incident rather than changing content blindly.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. A fresh 15 August public package search still did not establish `@eunomia-bpf/agentsight` on npm, so the website must not claim that package is installable.
