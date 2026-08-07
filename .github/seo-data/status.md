# SEO status

## Current state

- Active operational priority: resolve the canonical-production verification mismatch after the AgentSight `v1.0.3` release sync.
- PR `#31` was squash-merged as `51c75654c77d07492174aee4bf4d401ca8b7c833` after successful exact-head Website CI and a clean complete-diff/artifact review.
- The publication branch `site/.source-sha` identifies that exact squash commit, and the published branch output contains AgentSight `v1.0.3`, the immutable product snapshot `07a83a32257b8c8dcba911bd9db23f77e71dc085`, and the new Overview dashboard.
- Repeated independent retrieval of the canonical public homepage after publication still exposed the previous `v0.2.68` content and old product snapshot. The rendered change is therefore not considered publicly verified or fully closed out.
- Do not start another rendered SEO/content experiment until the canonical page matches the published output or the hosting/cache mismatch is diagnosed and repaired.
- Current product release: AgentSight `v1.0.3`.
- Current product release and default-branch commit: `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Route inventory, canonical ownership, navigation hierarchy, static export, and documentation boundary remain unchanged.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Current shared SEO skill pointer: `e7338af051ee9621b3033912d5c5751c7ebc241a`; the allowed upstream branch has no newer commit.
- Scheduler owner: enabled external session-level task; current repository instructions remain authoritative.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-04`, after the three-day finalization lag.
- The exact Google Drive folder is present and uniquely resolved, but direct-child inspection on `2026-08-07` found no matching GA4 or Search Console exports.
- Source-native traffic and search metrics are unavailable for comparison, not zero.
- The previously recorded finalized export window was `2026-07-27` through `2026-08-02`; it cannot be revalidated from the folder's current contents.
- Public search sampling remains mixed: domain and brand discovery exist while exact site-qualified visibility is inconsistent. Without finalized Search Console evidence, this is directional rather than an indexing diagnosis.
- Cloudflare analytics: not configured.

## Production incident acceptance gate

The prior release-sync cycle remains incomplete until all of the following are true:

- the canonical public homepage exposes AgentSight `v1.0.3` rather than `v0.2.68`;
- the public homepage uses the immutable product snapshot `07a83a32257b8c8dcba911bd9db23f77e71dc085` and includes the Overview dashboard;
- `/changelog/` and representative unchanged routes remain valid;
- canonical metadata, robots, sitemap, manifest, documentation target, and GA4 path-only behavior remain intact;
- final live-verification facts are recorded through the required metadata-only closeout pull request.

A matching `site/.source-sha`, successful branch preview, or successful HTTP response by itself is not completion.

## Active focus after the incident

Once canonical production is verified, investigate site-qualified search visibility using restored finalized Search Console exports or another explicitly configured read-only Search Console source. Confirm indexing and page coverage before changing routes, titles, or content based on public-result sampling alone.

Then continue the page-by-page content-completeness audit. Prioritize existing important pages that lack a concrete reader decision, real product output or visual evidence, explicit limitations, or a useful next action. Do not introduce a daily publishing quota, bulk rewrite, route expansion, or keyword-swapped pages.

The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
