# SEO status

## Current state

- Active bounded rendered change: synchronize public release facts and product material to AgentSight `v1.0.3`.
- Current website `main` baseline before this cycle: `b25ee8cbc612b901ffce838d61ceeec8656209c9`.
- Last rendered-behavior production marker before this cycle: `f0b755444c8d3768433834603d7652801b2d5a45`.
- Current product release: AgentSight `v1.0.3`.
- Current product release and default-branch commit: `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- Product changes reviewed since the website's pinned `v0.2.68` snapshot include a new Overview dashboard, configurable operation-stack profiling in `agentpprof`, and the PID-tracker collision-removal correctness fix shipped after `v1.0.0`.
- The current change updates release labels, structured software metadata, immutable product-asset references, the homepage product walkthrough, the changelog, and the machine-readable site summary. It does not add, remove, rename, consolidate, or redirect public routes.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Current shared SEO skill pointer before this cycle: `0440402cf5713994969ccd2b9998985367a2797b`.
- Compatible upstream target reviewed for this cycle: `e7338af051ee9621b3033912d5c5751c7ebc241a`; its only change clarifies that optional diagnostic snapshots should remain outside public output.
- Scheduler owner: enabled external session-level task; current repository instructions remain authoritative.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-03`, after the three-day finalization lag.
- The exact Google Drive folder was present on `2026-08-06`, but direct-child inspection found no matching GA4 or Search Console exports. Source-native traffic and search metrics are therefore unavailable for today's comparison, not zero.
- The previously recorded finalized export window was `2026-07-27` through `2026-08-02`; it could not be revalidated from the folder's current contents.
- Public baseline searches on `2026-08-06` did not return a direct `agentsight.us` result for the site, domain, or brand checks. The product repository and eunomia.dev documentation were visible, while unrelated products using the AgentSight name also appeared. This is directional evidence that product-site index visibility is not yet established; it is not a Search Console indexing diagnosis.
- Direct retrieval of `https://agentsight.us/` succeeded and exposed the expected canonical product content. Technical crawlability and exact index state remain separate checks.
- Cloudflare analytics: not configured.

## Acceptance gates for the active change

- Exact-head Website CI must complete successfully.
- Generated output must preserve all existing routes, canonical URLs, robots, sitemap coverage, internal links, and GA4 path-only assertions.
- The homepage, footer, structured software metadata, and `llms.txt` must expose `v1.0.3`, link to the immutable `v1.0.3` release where applicable, and use product commit `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- The immutable Overview dashboard image must resolve and render without changing the existing route or navigation structure.
- Desktop and mobile homepage output and representative unchanged routes must be reviewed from the exact CI artifact.
- After a clean final review and squash merge, the exact squash commit's normal publication must succeed, `site/.source-sha` must identify that commit, and the live homepage, changelog, representative unchanged routes, metadata, product image, documentation target, and analytics configuration must be verified.
- Final delivery evidence must be recorded through a metadata-only closeout pull request.

## Active focus after this cycle

After the release correction is complete, investigate product-site search visibility using a restored finalized Search Console export or a connected read-only Search Console source. Confirm indexing and page coverage before changing routes, titles, or content based only on public-result sampling.

Continue the page-by-page content-completeness audit in parallel. Prioritize existing important pages that lack a concrete reader decision, real product output or visual evidence, explicit limitations, or a useful next action. Do not introduce a daily publishing quota, bulk rewrite, route expansion, or keyword-swapped pages.

The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
