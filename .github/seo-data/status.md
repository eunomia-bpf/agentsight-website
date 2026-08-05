# SEO status

## Current state

- Last completed autonomous SEO run: `2026-08-05 09:00 PDT` metadata/data refresh with no rendered site change
- Last verified weekly export window: `2026-07-27` through `2026-08-02`; seven matching GA4 and Search Console CSV files are present
- Last site-change pull request: `#17`, squash-merged
- Last site-change squash commit: `6db78cadef959f2be9fce304a40d128ca795349b`
- Last autonomous metadata closeout: `#18`, squash commit `5948f21375d07de02fe79a36ae68fddd558aa35c`
- Last data-only pull request: `#19`, squash commit `8ef2cc29314243593f93d0697ee22e02c2cf5052`
- Current runtime-analytics repair: in progress; production does not yet expose the configured GA4 measurement
- Last successful production deployment: squash commit `6db78cadef959f2be9fce304a40d128ca795349b`
- Last public verification: `2026-08-05`, launch routes, crawl controls, canonical metadata, structured data, and assets verified
- Skill submodule commit: `0b9a76a27de6d1e46ef0193a8d683bca182b785a`
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
- Last metadata/data pull request: `#19`; exact-head Website CI succeeded before squash merge

## Current signals

- Google Drive SEO folder: configured as `agentsight.us SEO Weekly CSV`
- Google Drive folder state: seven exact weekly CSV artifacts for `2026-07-27` through `2026-08-02` verified on `2026-08-05`
- Google Analytics 4 export: organic landing-page CSV present; source-native metrics are not summarized here
- Google Search Console exports: queries, pages, countries, devices, search appearance, and dates CSVs present; raw rows remain outside Git
- Cloudflare analytics: not configured
- Product release baseline: AgentSight `v0.2.67`; no newer product commit observed
- Public search visibility: the canonical homepage is visible for site, domain, brand-qualified, and sampled eBPF profiling queries; broader new-route indexing is not yet evidenced
- Brand-result environment: unrelated AgentSight products on other domains compete for the unqualified name
- Priority-query snapshot: AgentSight-qualified Claude Code visibility was observed; sampled MCP server audit visibility was not
- Public technical baseline: live homepage available; production source marker exact; robots open; sitemap contains 32 canonical routes; homepage canonical, social metadata, and structured data verified
- Internal-link baseline: repository checks cover 46 internal links across 32 routes; no confirmed broken internal route
- Content baseline: 23 existing intent pages plus the evidence-oriented run library, methodology, and project-authorship layer
- Repository CI and static publication pipeline: operational
- Confirmed actionable technical defect: the production site does not load the configured runtime analytics tag; repair is in progress

Unavailable or delayed provider evidence must never be interpreted as zero
traffic or zero search demand. Public search observations are directional and
do not replace Search Console clicks, impressions, CTR, average position, or
indexing reports.

## Active focus

Restore runtime GA4 measurement without changing public content or URL behavior,
then preserve the verified launch baseline while search engines recrawl the new
route inventory. Continue weekly export ingestion and monitor brand ambiguity
and priority-query discovery.

This file is the current verified summary. Detailed autonomous-run history
belongs in `daily/`.
