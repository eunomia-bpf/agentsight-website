# SEO status

## Current state

- AgentSight `v1.0.3` is visible on the canonical homepage together with the current Overview dashboard and immutable product snapshot.
- The existing `/blog/system-boundary-observability/` article was substantially upgraded through PR `#33` into a primary-source evergreen reference covering Claude Code, Gemini CLI, Codex, OpenTelemetry, MCP, and AgentSight observability boundaries.
- PR `#33` was squash-merged as `715730c6af07f50f9a2dca79340d98a51fb6a765`; exact main-branch Website CI and Publish static site succeeded and `site/.source-sha` identifies that exact rendered commit.
- The published branch contains the expanded article with its existing canonical, index/follow metadata, TechArticle structured data, comparison tables, and primary-source section. Independent public retrieval confirms the canonical homepage is serving the current site generation; the available crawler still has no fresh cache entry for the specific blog route, so direct canonical-article retrieval remains a follow-up check rather than a claimed success.
- Owner-authorized content operating policy: maintain at least one substantive search-facing publication or major evergreen refresh in every rolling 48-hour window. The daily external scheduler remains the execution trigger; repository instructions remain authoritative.
- A qualifying publication must add a distinct reader answer and durable technical information such as primary-source synthesis, exact implementation/version research, a reproducible AgentSight experiment, real first-party artifacts, measured behavior, or a concrete limitation/reference analysis.
- Metadata-only work, thin release notes, keyword swaps, cosmetic copy changes, generic summaries, and near-duplicate pages do not satisfy the 48-hour content SLO.
- Prefer major evergreen refreshes over new URLs whenever an existing canonical page already owns the reader decision.
- Current shared SEO skill pointer: `e7338af051ee9621b3033912d5c5751c7ebc241a`, now reflected consistently in `site.md`.
- Current product release: AgentSight `v1.0.3`.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Route inventory, canonical ownership, static export, documentation ownership, and analytics policy remain unchanged by the content-operations policy update.
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

- The 2026-08-07 system-boundary evergreen refresh is the initial publication under the new cadence. Use its exact successful static publication as the content-clock anchor.
- On each daily cycle, resolve the most recent qualifying publication dynamically. If waiting until the next scheduled daily run would breach 48 hours, the current cycle must deliver a qualifying publication after higher-priority production or factual repairs.
- If a new topic overlaps an existing canonical page, deepen that page instead of manufacturing another URL.
- Initial durable candidate themes are maintained in `plan.md`; short-lived selection and research findings belong in the daily record/status rather than a new backlog file.
- Immediate high-value candidates after the system-boundary reference include a real slow-run breakdown, an MCP-server audit comparing protocol result with process/file/network activity, an Agent Flamegraph token-profile study, and a current Claude/Codex/Gemini implementation deep dive when primary-source changes justify it.

## Visual alignment priority

After this control-plane update, visual work may align AgentSight with the current `eunomia.dev` family without changing URLs or navigation meaning. The target is a light product surface using `#091627` ink, slate borders, cyan/azure accents, restrained orange emphasis, clearer typography, dark technical/code surfaces, and richer first-party product/research information.

Do this as separate rendered phases: shared visual tokens/shell first, homepage information hierarchy second, content/article surfaces third. Preserve AgentSight product screenshots and identity and keep installation/reference documentation on `eunomia.dev`.

## Outstanding follow-up

- Retry direct canonical retrieval of `/blog/system-boundary-observability/`; do not modify rendered content merely to satisfy a crawler cache.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
