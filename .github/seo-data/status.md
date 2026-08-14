# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.21`, published 14 August 2026 at product commit `412ee6dbad967fa48a226a8052ee0c689e4bd1c6`.
- The website is synchronized to v1.0.21 through PR `#59`, squash/main commit `8fc32b7cc528ccf86c2d496e8be4197f1ccd6fbf`.
- PR `#59` exact-head Website CI `31822688705`, main Website CI `31822868305`, and Publish static site `31822868231` all succeeded. The exact artifact is `9227577329` with digest `sha256:1fda7dfb74093090c7f4e10fadf1526a4972fce495d7556f504b0f1158fe2d55`.
- `site/.source-sha` exactly matches the rendered v1.0.21 squash commit `8fc32b7cc528ccf86c2d496e8be4197f1ccd6fbf` after publication.
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

- The exact v1.0.21 static artifact contains 39 generated index pages and 37 unique sitemap URLs; every generated page has exactly one canonical and one H1.
- Product, Architecture, Changelog, homepage release metadata, and `llms.txt` are synchronized to the current release and source-grounded fleet/session model.
- No public route, redirect, canonical owner, primary navigation item/destination, pricing-catalog semantics, GA4 behavior, documentation ownership, dependency, workflow, or deployment configuration changed in the v1.0.21 repair.
- Independent public retrieval immediately after publication still exposed the earlier v1.0.15 homepage and Architecture generation, while `/product/` returned a crawler cache miss.
- Exact main commit, exact-head and main CI, Publish static site, generated artifact, and `site/.source-sha` all agree on the v1.0.21 publication. Treat the independent mismatch as crawler/CDN freshness rather than a failed static publication; do not manufacture a rendered change solely to force refresh.

## Current analytics and search data

- Configured finalization lag: three days. The `2026-08-03` through `2026-08-09` weekly window is finalized.
- The configured Drive folder still contains only `2026-07-27_to_2026-08-02_ga4_source.json` and `2026-08-03_to_2026-08-09_ga4_source.json`.
- Neither manifest has its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV is present.
- The manifest-only GA4 state remains an exporter-health failure rather than valid analytics evidence. GA4 and Search Console source-native metrics are unavailable, not zero.
- Restoring the external Google Apps Script exporter remains a genuine human-only blocker because this runtime can inspect Drive but cannot execute or configure that Apps Script project.
- Cloudflare analytics is not configured for this site.
- Public brand/homepage discovery is present, but sampled search results remain materially behind the current product release.
- No new independent external link to `agentsight.us` was verified in the current off-site scan. Search-result presence alone is not recorded as a backlink.

## Content clock and portfolio

- Latest qualifying substantive publication: the v1.0.21 Product/Architecture major evergreen refresh from PR `#59`.
- Exact static publication completed at `2026-08-14T17:12:35Z`; this resets the rolling 48-hour substantive-content clock.
- The refresh qualifies because it adds source-grounded multi-machine browser aggregation, observed-usage versus provider-capacity semantics, and the current Analysis workspace to existing canonical pages rather than only changing a version label.
- The existing canonical portfolio should absorb current product changes when it already owns the reader decision; do not create thin release-summary or keyword-variant URLs.
- Next research-content candidates remain evidence-producing work such as a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph study built from public-safe first-party sessions.

## Outstanding follow-up

- Re-check canonical homepage/Product/Architecture freshness in a later cycle; distinguish publication-branch truth from independent crawler/CDN freshness.
- Restore valid weekly GA4 and Search Console exports through the external Apps Script exporter; see `block.md` for the human action required.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
