# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.21`, published 14 August 2026 at product commit `412ee6dbad967fa48a226a8052ee0c689e4bd1c6`.
- Website main entered the current cycle at `83e34ea6e789510815de8b250b99f305debe8ad9`, the successfully published v1.0.17 Product/Architecture refresh from PR `#58`.
- PR `#58` main Website CI `31821362671` and Publish static site `31821362661` both succeeded; `site/.source-sha` matched `83e34ea6e789510815de8b250b99f305debe8ad9` after publication.
- Fresh product inspection found material post-v1.0.17 drift in v1.0.18 through v1.0.21, so the current repair branch is `seo/agentsight-2026-08-14-v1-0-21-fleet-analysis`.
- The product’s current signed-in organization landing view is **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory. Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
- Current machine/fleet views can show active and stopped sessions, observed Tokens, source-reported subscription windows, Agent Plans, CPU/RSS, and process/session state. Observed Tokens and provider-reported capacity remain separate signals.
- A selected session now has three primary views: Conversation, Process Tree & AI Prompts, and Analysis. Analysis replaced separate Timeline and Detailed Events tabs while retaining event-level inspection through its interactive timeline.
- Portable agent-native `top`, `bind`, `vis`, and `report` workflows remain available on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed debug/tracing remain Linux-only.
- Current GitHub Releases publish Linux x86_64 and aarch64 binaries; Windows builds are exercised by CI/source workflows rather than published as release assets.
- Hosted sign-in currently exposes supported GitHub and Google entries when sign-in is available; an unconfigured provider is disabled with an explanation and provider-status failures are surfaced. This is UI behavior, not a claim that every deployment has both providers configured.
- Controller remains the coordination plane for OAuth identity, organizations, memberships, roles, plan/entitlement metadata, Node discovery, relay presence, optional encrypted Direct configuration, and authorization. Detailed runtime data remains authoritative on Nodes.
- The Free/Pro/Team/Enterprise plan catalog remains distinct from current hosted-preview effective access. Registered preview users receive the implemented hosted feature set through an `unlimited` effective plan; the website must not imply that catalog billing is already enforced.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; current allowed upstream `main` is the same commit.
- Runtime analytics remains GA4 with path-only URL reporting; Google signals and ad-personalization signals remain disabled.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement for website SEO operation: none.

## Current analytics and search data

- Configured finalization lag: three days. The `2026-08-03` through `2026-08-09` weekly window is now finalized.
- The configured Drive folder still contains only `2026-07-27_to_2026-08-02_ga4_source.json` and `2026-08-03_to_2026-08-09_ga4_source.json`.
- Neither manifest has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The manifest-only GA4 state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand/homepage discovery is present, but sampled search results remain materially behind the current product release.
- Direct canonical retrieval during the current cycle still exposed the earlier `v1.0.15` homepage generation even though the exact publication branch already pointed at the successfully published v1.0.17 commit. Treat that as crawler/CDN freshness unless it remains reproducible after the current exact publication; do not manufacture rendered changes solely to force cache refresh.
- No new independent external link to `agentsight.us` was verified in the current public off-site scan. Search-result presence alone is not recorded as a backlink.

## Content clock and portfolio

- Latest completed qualifying substantive publication at the start of the current cycle: the `/product/` v1.0.17 major evergreen refresh from PR `#58`, exact static publication around `2026-08-14T16:53Z`.
- The current v1.0.21 repair materially extends Product and Architecture with fleet aggregation, subscription/usage semantics, and the Analysis workspace, but it does not qualify until exact CI, squash merge, static publication, and acceptance are complete.
- The existing canonical portfolio should absorb current product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next research-content candidates remain evidence-producing work such as a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph study built from public-safe first-party sessions.

## Outstanding follow-up

- Complete the current v1.0.21 product-drift repair through exact-head CI, from-scratch final review, squash merge, exact static publication, public acceptance, and metadata closeout.
- Re-check canonical homepage/Product/Architecture freshness after the current publication; distinguish publication-branch truth from independent crawler/CDN freshness.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
