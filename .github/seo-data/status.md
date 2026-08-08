# SEO status

## Current state

- AgentSight `v1.0.3` is visible on the canonical homepage together with the current Overview dashboard and immutable product snapshot.
- The existing `/blog/system-boundary-observability/` article was substantially upgraded through PR `#33` into a primary-source evergreen reference covering Claude Code, Gemini CLI, Codex, OpenTelemetry, MCP, and AgentSight observability boundaries.
- PR `#33` was squash-merged as `715730c6af07f50f9a2dca79340d98a51fb6a765`; exact main-branch Website CI and Publish static site succeeded and the published branch contains the expanded article. The available crawler still has no fresh cache entry for the specific blog route, so direct canonical-article retrieval remains a follow-up check rather than a claimed success.
- Owner-authorized content operating policy: maintain at least one substantive search-facing publication or major evergreen refresh in every rolling 48-hour window. The daily external scheduler remains the execution trigger; repository instructions remain authoritative.
- A qualifying publication must add a distinct reader answer and durable technical information such as primary-source synthesis, exact implementation/version research, a reproducible AgentSight experiment, real first-party artifacts, measured behavior, or a concrete limitation/reference analysis.
- Metadata-only work, thin release notes, keyword swaps, cosmetic copy changes, generic summaries, and near-duplicate pages do not satisfy the 48-hour content SLO.
- Prefer major evergreen refreshes over new URLs whenever an existing canonical page already owns the reader decision.
- Visual Phase 1 is delivered: PR `#36` aligned the shared shell with the current Eunomia color/type/card/code family without changing routes, navigation destinations, copy, metadata, analytics, screenshots, or documentation ownership.
- Visual Phase 1 squash commit: `5868479172fa36a4a71c73d6be40eea996bee01d`.
- Exact main-branch Website CI `31245888390` and Publish static site `31245888388` succeeded for that exact commit; `site/.source-sha` identifies the same commit.
- Phase 1 exact-head static artifact `9018428428` passed the repository checks. Structural artifact review confirmed 34 generated index pages retained canonical metadata, and representative homepage/detail/blog/changelog routes retained one H1 and expected canonicals. Headless Chromium screenshot generation was not stable in the operator container, so no screenshot review is claimed.
- Canonical homepage retrieval after publication continues to expose the current `v1.0.3` product generation and unchanged public information/route structure.
- Current shared SEO skill pointer: `e7338af051ee9621b3033912d5c5751c7ebc241a`, reflected consistently in `site.md`.
- Current product release: AgentSight `v1.0.3`.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-04`, after the three-day finalization lag.
- The exact Google Drive folder is present and uniquely resolved, but direct-child inspection on `2026-08-07` found no matching GA4 or Search Console exports.
- Source-native traffic and search metrics are unavailable for comparison, not zero.
- Daily operation checks data freshness and production/index state; full comparative GA4/GSC analysis runs only on a new/changed finalized export or the weekly review.
- Public search sampling remains directional until finalized Search Console evidence is restored.
- Cloudflare analytics: not configured.

## Content clock and next publications

- The 2026-08-07 system-boundary evergreen refresh is the initial publication under the new cadence. Use its exact successful static publication as the content-clock anchor; visual-only work does not reset the content clock.
- On each daily cycle, resolve the most recent qualifying publication dynamically. If waiting until the next scheduled daily run would breach 48 hours, the current cycle must deliver a qualifying publication after higher-priority production or factual repairs.
- If a new topic overlaps an existing canonical page, deepen that page instead of manufacturing another URL.
- Immediate high-value candidates include a real slow-run breakdown, an MCP-server audit comparing protocol result with process/file/network activity, an Agent Flamegraph token-profile study, and a current Claude/Codex/Gemini implementation deep dive when primary-source changes justify it.

## Visual alignment priority

Visual Phase 1 is complete. Next, use a separate route-preserving Phase 2 to align the homepage itself with the light Eunomia technical style and make the product information richer using current first-party facts and existing destinations. Good candidates for the homepage are:

- a compact research/open-source credibility section using the AgentSight paper, ACM publication, MIT license, current release, and source repository;
- a clearer observability-boundary explanation linked to the new evergreen article;
- concrete post-run product surfaces such as audit, token profiling, saved-session web UI, repository replay, and OpenTelemetry export;
- direct data-handling language explaining local SQLite/session data sensitivity and linking to Security/documentation;
- existing real screenshots and immutable product artifacts, not decorative illustrations.

Do not add URLs, change navigation meaning, duplicate installation documentation, invent customers or statistics, or turn design work into a keyword page. A later Phase 3 may align hub/detail/article surface details after the homepage phase is independently delivered.

## Outstanding follow-up

- Retry direct canonical retrieval of `/blog/system-boundary-observability/`; do not modify rendered content merely to satisfy a crawler cache.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
