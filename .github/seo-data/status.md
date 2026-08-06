# SEO status

## Current state

- No active owner-directed site change and no open website pull request.
- Current website `main`: `f0b755444c8d3768433834603d7652801b2d5a45`.
- Current production source marker: `f0b755444c8d3768433834603d7652801b2d5a45`; source and published marker match.
- Current product release: AgentSight `v1.0.0`.
- Product release snapshot commit: `a9fa55893fb2d7237cb2ee43238088c219edc9d7`.
- Current product default-branch commit after release-workflow fixes: `713d3bbe891b280e445bc695cb5b4d917508b901`.
- The rendered website still contains release facts and pinned product material from `v0.2.68` / `4e1504e7f6713dcae7fb7762415bb93288abb931`; this is verified product-source drift and is the next bounded content correction.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Route inventory, canonical ownership, navigation hierarchy, static export, and documentation boundary remain unchanged.
- Runtime analytics: GA4 uses path-only reporting and excludes query strings, Google signals, and ad-personalization signals.
- Current skill submodule: `0440402cf5713994969ccd2b9998985367a2797b`.
- Scheduler owner: enabled external session-level task, daily at approximately `09:00` in `America/Los_Angeles`.
- Scheduler prompt policy: thin repository pointer only; current repository instructions are authoritative and override copied task text or prior conversation context.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Completed production baseline

- PR `#25` delivered the mature developer-product visual and messaging refresh while preserving the route inventory and documentation boundary.
- PRs `#26`, `#27`, and `#28` completed the shared static-site checker migration, publication submodule initialization, and removal of the accidental diagnostic JSON from public output.
- Current `site/.source-sha` matches current website `main`.
- Existing product views include first-party live sessions, timeline, process tree, resource metrics, Agent Nebula replay preview, and Agent Flamegraph material.
- The site remains compatible with Next.js static export and ordinary GitHub Actions publication.

## Current analytics and search data

- Last verified finalized export window: `2026-07-27` through `2026-08-02`.
- One GA4 organic landing-page CSV and six Search Console CSVs were previously verified; raw rows remain outside Git.
- Daily operation checks source presence, freshness, checksums, product drift, production health, and public index visibility.
- Full comparative metric analysis runs when a finalized export window or checksum changes, and during the weekly review. Identical exports are recorded as unchanged rather than repeatedly recomputed.
- Cloudflare analytics: not configured.

## Active focus

The next coherent rendered change should synchronize public release facts from
`v0.2.68` to `v1.0.0` using the immutable release snapshot and current product
repository as evidence. It should update only affected release labels,
structured software metadata, release or changelog surfaces, and any facts or
assets proven stale. It must not claim that the npm package is available until
the npm permission blocker in `block.md` is resolved.

After release drift is corrected, continue a page-by-page content-completeness
audit. Prioritize important existing pages that lack a concrete reader decision,
real product output or visual evidence, limitations, or a useful next action.
Do not introduce a daily publishing quota, bulk rewrite, route expansion, or
keyword-swapped pages.
