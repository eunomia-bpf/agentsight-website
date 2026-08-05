# SEO status

## Current state

- Last completed owner-directed site recovery and incremental improvement: `2026-08-05 15:06 PDT`
- Last verified weekly export window: `2026-07-27` through `2026-08-02`; seven matching GA4 and Search Console CSV files are present
- Recovery pull request: `#22`, squash-merged
- Recovery squash commit: `4bdeffe0af471980ef29310aaf80fe1d6e21f1f5`
- Incremental homepage pull request: `#23`, squash-merged
- Current site-change squash commit: `773982962557971b35922122661fd76f639d9966`
- Current publication marker: `site:.source-sha` = `773982962557971b35922122661fd76f639d9966`
- Runtime analytics: preserved; GA4 uses path-only reporting with Google signals and ad-personalization signals disabled
- Canonical documentation: `https://eunomia.dev/agentsight/`
- Skill submodule commit: `1140a11b9a366ddb611d19d691d81122184f7f9e`
- Scheduler owner: external session-level task; schedule state is intentionally outside Git
- Repository-hosted SEO agent workflow: none
- Model-provider credential requirement: none

## Delivery evidence

- PR `#22` head: `70a15afe9a7c775399bd89d6603c52eae9e904ff`
- PR `#22` exact-head Website CI: run `31051001581`, successful
- PR `#22` squash commit: `4bdeffe0af471980ef29310aaf80fe1d6e21f1f5`
- PR `#22` main Website CI: run `31051076758`, successful
- PR `#22` publication workflow: run `31051076781`, successful
- PR `#23` head: `3016234629d0d25ef3074bb1e0cfe540fb6d5f54`
- PR `#23` exact-head Website CI: run `31051335639`, successful
- PR `#23` squash commit: `773982962557971b35922122661fd76f639d9966`
- PR `#23` main Website CI: run `31051403988`, successful
- PR `#23` publication workflow: run `31051404031`, successful
- Published `site/index.html` contains the restored pre-PR `#17` product-site structure, the three-view product tour, the pinned first-party screenshot URLs, the eunomia.dev documentation target, and the GA4 loader

## Current product-site baseline

- PR `#17`'s bulk redesign, new run-library routes, methodology route, about route, replacement brand assets, and split global visual system have been removed from the generated site
- The pre-PR `#17` product website is restored
- The homepage keeps its original hero, layout, navigation, and design language
- The documentation-style command block was replaced with a narrow product tour showing the real timeline, process-tree, and resource-metrics views
- Screenshot provenance is pinned to AgentSight product commit `0d305c8186b8d6154c954af8985a1d6733a06339`
- Product documentation points to eunomia.dev; remaining internal guide routes are legacy content to be handled incrementally rather than through another bulk migration
- GA4 measurement remains present with query strings excluded from page-location reporting

## Current signals

- Google Drive SEO folder: configured as `agentsight.us SEO Weekly CSV`
- Google Analytics 4 export: organic landing-page CSV present; raw rows remain outside Git
- Google Search Console exports: queries, pages, countries, devices, search appearance, and dates CSVs present; raw rows remain outside Git
- Cloudflare analytics: not configured
- Product release baseline: AgentSight `v0.2.67`
- Public search visibility: current public search caches may still show older homepage copies while search engines recrawl; do not treat cached snippets as the production source of truth
- Repository CI and static publication pipeline: operational
- Confirmed actionable production defect: none open after recovery and publication

Unavailable or delayed provider evidence must never be interpreted as zero
traffic or zero search demand. Public search observations are directional and
do not replace Search Console clicks, impressions, CTR, average position, or
indexing reports.

## Active focus

Keep `agentsight.us` as the AgentSight product website. Make only small,
reversible improvements against the restored baseline. Prioritize real product
screenshots, concrete product behavior, use-case differentiation, and links to
the demo, source repository, and eunomia.dev documentation. Do not perform
another bulk redesign, mass rewrite, or route migration in one change.

This file is the current verified summary. Detailed autonomous-run history
belongs in `daily/`.
