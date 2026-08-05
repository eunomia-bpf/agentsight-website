# SEO status

## Current state

- Last completed autonomous SEO run: `2026-08-05 09:00 PDT` metadata/data refresh with no rendered site change
- Last configured finalized window: `2026-07-06` through `2026-08-02`; no matching finalized GA4 or Search Console export found
- Last site-change pull request: `#17`, squash-merged
- Last site-change squash commit: `6db78cadef959f2be9fce304a40d128ca795349b`
- Last autonomous metadata closeout: `#18`, squash commit `5948f21375d07de02fe79a36ae68fddd558aa35c`
- Current data-only pull request: pending
- Last successful production deployment: squash commit `6db78cadef959f2be9fce304a40d128ca795349b`
- Last public verification: `2026-08-05`, launch routes, crawl controls, canonical metadata, structured data, and assets verified
- Skill submodule commit: `6dde51078f87d5f6cf1c22045df13a3f786a5f02`
- Scheduler owner: external session-level task; schedule state is intentionally outside Git
- Repository-hosted SEO agent workflow: none
- Model-provider credential requirement: none

## Delivery evidence

- Change pull request: `https://github.com/eunomia-bpf/agentsight-website/pull/17`
- Exact pull-request head: `5e00f9875ff923072cd8a9798b66cb469b0d9800`
- Exact-head Website CI: run `#43`, run ID `31002760823`, successful
- Exact site-change squash commit: `6db78cadef959f2be9fce304a40d128ca795349b`
- Launch closeout pull request: `https://github.com/eunomia-bpf/agentsight-website/pull/18`
- Launch closeout squash commit: `5948f21375d07de02fe79a36ae68fddd558aa35c`
- Publication source marker: `site:.source-sha` = `6db78cadef959f2be9fce304a40d128ca795349b`
- Live verification set: `/`, `/runs/`, `/runs/recorded-demo/`, `/runs/review-artifact/`, `/methodology/`, `/about/`, `/changelog/`, `/manifest.webmanifest`, `/icon.svg`, and `/opengraph-image`
- Current metadata/data pull request: pending; exact-head CI and final self-review are merge gates

## Current signals

- Google Drive SEO folder: configured as `agentsight.us SEO Weekly CSV`
- Google Drive folder state: visible and empty on direct-child inspection during the `2026-08-05 09:00 PDT` refresh; unchanged from the `03:03 PDT` check
- Google Analytics 4: no matching export found; metrics unavailable, not zero
- Google Search Console: no matching export found; metrics unavailable, not zero
- Cloudflare analytics: not configured
- Product release baseline: AgentSight `v0.2.67`; no newer product commit observed
- Public search visibility: the canonical homepage is visible for site, domain, brand-qualified, and sampled eBPF profiling queries; broader new-route indexing is not yet evidenced
- Brand-result environment: unrelated AgentSight products on other domains compete for the unqualified name
- Priority-query snapshot: AgentSight-qualified Claude Code visibility was observed; sampled MCP server audit visibility was not
- Public technical baseline: live homepage available; production source marker exact; robots open; sitemap contains 32 canonical routes; homepage canonical, social metadata, and structured data verified
- Internal-link baseline: repository checks cover 46 internal links across 32 routes; no confirmed broken internal route
- Content baseline: 23 existing intent pages plus the evidence-oriented run library, methodology, and project-authorship layer
- Repository CI and static publication pipeline: operational
- Confirmed actionable technical defect: none

Missing exports are unavailable evidence, not zero traffic or zero search demand.
Public search observations are directional and do not replace Search Console
clicks, impressions, CTR, average position, or indexing reports.

## Active focus

Preserve the verified launch baseline while search engines recrawl the new route
inventory. Ingest finalized analytics exports when available, monitor brand
ambiguity and priority-query discovery, and make future rendered changes only
when source-native evidence or a confirmed technical defect supports them.

This file is the current verified summary. Detailed autonomous-run history
belongs in `daily/`.
