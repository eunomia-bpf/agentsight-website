# SEO status

## Current state

- AgentSight `v1.0.3` is the current product release used by the website, with immutable first-party product material pinned to `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- The canonical product website remains `https://agentsight.us/`; canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation remains `https://eunomia.dev/agentsight/`.
- No owner-directed route, canonical, redirect, or navigation migration is active.
- The existing `/blog/system-boundary-observability/` article was substantially upgraded through PR `#33` into a primary-source evergreen reference covering Claude Code, Gemini CLI, Codex, OpenTelemetry, MCP, and AgentSight observability boundaries.
- PR `#33` was squash-merged as `715730c6af07f50f9a2dca79340d98a51fb6a765`; its exact CI and static publication succeeded. The available public crawler still has no fresh cache entry for the specific blog route, so direct canonical-article retrieval remains a follow-up check rather than a claimed success.
- Owner-authorized content operating policy is active: maintain at least one substantive search-facing publication or major evergreen refresh in every rolling 48-hour window. The daily external scheduler remains a thin trigger and current repository instructions are authoritative.
- A qualifying publication must add a distinct reader answer and durable technical information such as primary-source synthesis, exact implementation/version research, a reproducible AgentSight experiment, real first-party artifacts, measured behavior, or a concrete limitation/reference analysis.
- Metadata-only work, thin release notes, keyword swaps, cosmetic copy changes, generic summaries, and near-duplicate pages do not satisfy the 48-hour content SLO. Prefer major evergreen refreshes over new URLs whenever an existing canonical page already owns the reader decision.
- Visual Phase 1 is complete: PR `#36` aligned the shared AgentSight shell with the current Eunomia ink/slate/cyan/azure/orange family while preserving the AgentSight eye mark, routes, navigation destinations, content, analytics, screenshots, and documentation ownership. Squash commit `5868479172fa36a4a71c73d6be40eea996bee01d`; exact main Website CI `31245888390` and Publish static site `31245888388` succeeded.
- Visual Phase 2 is delivered: PR `#38` converted the existing homepage to the light Eunomia technical style and enriched it with current project facts, a nuanced observability-boundary explanation, existing post-run product surfaces, the evergreen research entry point, the AgentSight paper, and direct local-data sensitivity language. It changed only the existing homepage component and its CSS module; no public route, canonical, redirect, navigation destination, sitemap ownership, analytics policy, or documentation boundary changed.
- Visual Phase 2 exact pull-request head: `5942e97a6ea469b0039de25438116c3f4fc40df0`; exact-head Website CI `31246190988` succeeded; static artifact `9018564863`, digest `sha256:dd3b12ab2e5ff68f62562f71af5189dfd0bc1fbcf48d0d5daf1c883dcc0860fa`.
- Exact Phase 2 artifact review found 34 generated index pages with canonical metadata, 32 sitemap URLs, one homepage H1 and the existing homepage canonical, all 19 homepage internal static links resolving, all new credibility/post-run/research/data-handling sections present, and representative unchanged routes retaining their expected single H1 and canonical.
- Visual Phase 2 squash commit: `dae3f1112f7ca8e3bde3565370ac3dcfbd1737a8`; main Website CI `31246248471` and Publish static site `31246248492` both succeeded; `site/.source-sha` identifies the exact same commit.
- The publication branch contains the new homepage generation, but the independent public Web crawler still returns the previous homepage body, including the older “Application traces stop where their instrumentation stops” sentence. Treat this as a CDN/crawler freshness mismatch; do not claim the Phase 2 homepage text is independently public-verified until a fresh retrieval exposes the new sections.
- Current shared SEO skill pointer: `e7338af051ee9621b3033912d5c5751c7ebc241a`, reflected consistently in `site.md`.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-04`, after the three-day finalization lag.
- The exact Google Drive folder is present and uniquely resolved, but direct-child inspection on `2026-08-07` found no matching GA4 or Search Console exports.
- Source-native traffic and search metrics are unavailable for comparison, not zero.
- Daily operation checks data freshness, production/index state, product drift, and the content clock. Full comparative GA4/GSC analysis runs only on a new/changed finalized export or the weekly review.
- Public search sampling remains directional until finalized Search Console evidence is restored.
- Cloudflare analytics: not configured.

## Content clock and next publications

- The 2026-08-07 system-boundary evergreen refresh is the initial qualifying publication under the rolling 48-hour policy. Use its exact successful static publication as the content-clock anchor; the visual-only Phase 1 and Phase 2 work does not reset the content clock.
- On each daily cycle, resolve the latest qualifying publication dynamically. If waiting until the next scheduled daily run would breach 48 hours, the current cycle must deliver qualifying content after higher-priority production or factual repairs.
- If a topic overlaps an existing canonical page, deepen that page rather than manufacturing another URL.
- Immediate high-value candidates remain a real slow-run breakdown, an MCP-server audit comparing protocol results with process/file/network activity, an Agent Flamegraph token-profile study, and a current Claude/Codex/Gemini implementation deep dive when primary-source changes justify it.

## Visual and information state

The requested Eunomia-family alignment is now materially present at both the shared shell and homepage levels. The product site uses the current Eunomia dark ink, slate borders/text, cyan/azure information accents, restrained orange emphasis, light technical grid/mist surfaces, dark product/code panels, and restrained serif display treatment while retaining AgentSight-specific product imagery and identity.

The homepage now exposes more useful product truth without duplicating documentation: current release/license/research facts, live and recorded product views, saved-session audit/token/serve/replay surfaces, the primary-source observability-boundary article, the published AgentSight paper, and the sensitivity of local session artifacts. A later small Phase 3 may refine generic hub/detail/article table/code/source presentation when a concrete defect or usability gap is found; it is no longer required to consider the requested brand/homepage alignment delivered.

## Outstanding follow-up

- Retry fresh public retrieval of the Phase 2 homepage and `/blog/system-boundary-observability/`; do not modify rendered content merely to satisfy a crawler cache.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
