# SEO status

## Current state

- Active owner-directed site change: Grafana-inspired AgentSight product-site refresh in progress on `2026-08-05`.
- Current production source marker before this change: `773982962557971b35922122661fd76f639d9966`.
- Current product release: AgentSight `v0.2.68`, product commit `4e1504e7f6713dcae7fb7762415bb93288abb931`.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Route inventory and navigation hierarchy: preserved; this change does not create, remove, rename, or redirect public routes.
- Runtime analytics: preserved; GA4 uses path-only reporting and excludes query strings, Google signals, and ad-personalization signals.
- Skill submodule before this change: `1140a11b9a366ddb611d19d691d81122184f7f9e`.
- Latest compatible skill target: `3ff90dff96d4f53b37d4fea8da80e0ecb2e2b3f3`.
- Compatibility decision: `3ff90dff96d4f53b37d4fea8da80e0ecb2e2b3f3` includes the incremental and reversible site-change policy inherited from `f0c096385d4ad676ca8d7d9a56732e8c923f3c1a` and retains `scripts/validate_seo_data.py`, which the current website CI invokes. Newer shared commits remove that compatibility entrypoint and cannot be consumed until the website control plane is separately migrated with explicit authorization.
- Scheduler owner: external session-level task; schedule state remains outside Git.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Change scope

- Refresh the existing shared visual system, header, footer, homepage, social preview, and web manifest in a Grafana-inspired developer-product style without copying Grafana assets or layout code.
- Use direct product language from the AgentSight README and repository instead of abstract invented terminology.
- Use existing first-party AgentSight product material: live sessions, timeline, process tree, resource metrics, Agent Nebula repository replay, and Agent Flamegraph.
- Pin every externally loaded first-party product image to product commit `4e1504e7f6713dcae7fb7762415bb93288abb931`.
- Update release references from `v0.2.67` or `v0.2.66` to the current `v0.2.68` where this change touches the public page.
- Preserve the existing 23 content pages and canonical route structure.

## Acceptance gates

- Exact-head Website CI must complete successfully.
- The generated static export must preserve canonical URLs, robots, sitemap coverage, internal links, GA4 path-only configuration, and all existing routes.
- Desktop and mobile homepage renders must be visually reviewed from the exact CI artifact.
- Representative unchanged pages must be inspected after the shared CSS update: `/use-cases/`, `/compare/`, `/integrations/claude-code/`, `/security/`, `/changelog/`, and `/releases/`.
- Every pinned first-party image URL must resolve successfully.
- After a clean final diff review, squash-merge normally without bypassing checks.
- The exact squash commit's normal main Website CI and Publish static site workflows must succeed.
- `site/.source-sha` must identify the exact rendered squash commit.
- Production verification must cover the homepage, representative unchanged routes, metadata, sitemap, robots, manifest, Open Graph image, documentation target, product image loading, and GA4 configuration.
- Final PR, CI, squash, publication, and live verification facts must be recorded through a metadata-only closeout pull request.

## Current analytics and search data

- Last verified weekly export window: `2026-07-27` through `2026-08-02`.
- One GA4 organic landing-page CSV and six Search Console CSVs were previously verified; raw rows remain outside Git.
- Cloudflare analytics: not configured.
- No traffic, ranking, or conversion claim is introduced by this design change.

## Active focus

Complete the current product-site refresh as one bounded visual and messaging change. Do not change route ownership, documentation architecture, analytics policy, scheduler behavior, or unrelated content-page structure in this pull request.
