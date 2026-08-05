# SEO status

## Current state

- Last completed autonomous SEO run: `2026-08-05` AgentSight website modernization
- Last data window: unavailable; no finalized GA4 or Search Console export found
- Last site-change pull request: `#17`, squash-merged
- Last autonomous squash merge: `6db78cadef959f2be9fce304a40d128ca795349b`
- Last autonomous closeout pull request: pending creation by the metadata-only closeout
- Last successful production deployment: squash commit `6db78cadef959f2be9fce304a40d128ca795349b`
- Last public verification: `2026-08-05`, launch routes and assets verified
- Skill submodule commit: `53ef5e7027c40bb1f57d05673d5b4eecae70d605`
- Scheduler owner: external session-level task; schedule state is intentionally outside Git
- Repository-hosted SEO agent workflow: none
- Model-provider credential requirement: none

## Delivery evidence

- Change pull request: `https://github.com/eunomia-bpf/agentsight-website/pull/17`
- Exact pull-request head: `5e00f9875ff923072cd8a9798b66cb469b0d9800`
- Exact-head Website CI: run `#43`, run ID `31002760823`, successful
- Exact squash commit: `6db78cadef959f2be9fce304a40d128ca795349b`
- Publication source marker: `site:.source-sha` = `6db78cadef959f2be9fce304a40d128ca795349b`
- Live verification set: `/`, `/runs/`, `/runs/recorded-demo/`, `/runs/review-artifact/`, `/methodology/`, `/about/`, `/changelog/`, `/manifest.webmanifest`, `/icon.svg`, and `/opengraph-image`
- Live origin metadata: `https://agentsight.us/llms.txt` returned HTTP 200 with AgentSight `v0.2.67` and the new route inventory

## Current signals

- Google Drive SEO folder: configured as `agentsight.us SEO Weekly CSV`
- Google Drive folder state: folder was visible but no direct child files were returned during the `2026-08-05 03:03 PDT` check
- Google Analytics 4: no matching export found
- Google Search Console: no matching export found
- Cloudflare analytics: not configured
- Product release baseline: AgentSight `v0.2.67`
- Public search visibility: homepage brand indexing was previously observed; current Search Console metrics remain unavailable
- Public technical baseline: evidence-oriented site, route library, brand assets, metadata, sitemap, manifest, and static publication verified
- Content baseline: 23 existing intent pages plus the evidence-oriented run library, methodology, and project-authorship layer
- Repository CI and static publication pipeline: operational

Missing exports are unavailable evidence, not zero traffic or zero search demand.
The daily task checks the configured Drive folder and public search baseline every
day and records source freshness even when no new export is available.

## Active focus

Operate from the verified launch baseline. Ingest finalized analytics exports when
available, preserve claim provenance, and make future site changes only when the
evidence supports them.

This file is the current verified summary. Detailed autonomous-run history
belongs in `daily/`.
