# SEO status

## Current state

- AgentSight `v1.0.3` is visible on the canonical homepage together with the current Overview dashboard and immutable product snapshot.
- The existing `/blog/system-boundary-observability/` article was substantially upgraded through PR `#33` into a primary-source evergreen reference covering Claude Code, Gemini CLI, Codex, OpenTelemetry, MCP, and AgentSight observability boundaries.
- The article reuses its existing canonical URL; no route, canonical, redirect, navigation item, sitemap ownership, analytics policy, static-export architecture, or documentation boundary changed.
- PR `#33` was squash-merged as `715730c6af07f50f9a2dca79340d98a51fb6a765` after successful exact-head Website CI and complete static-output/diff review.
- Main-branch Website CI `31245065052` and Publish static site `31245065046` both succeeded for that exact squash commit.
- `site/.source-sha` identifies `715730c6af07f50f9a2dca79340d98a51fb6a765`, and the published branch contains the expanded article with its canonical, index/follow metadata, TechArticle structured data, two comparison tables, and primary-source section.
- Independent public retrieval confirms the canonical homepage is serving the current `v1.0.3` site generation. The available public crawler still returns a cache miss when traversing `/blog/`, and search engines have not yet surfaced the refreshed article, so direct fresh retrieval of the specific article URL remains an acceptance item rather than a claimed success.
- Research snapshot date: `2026-08-07`.
- Reproducibility anchors: Gemini CLI `cf22ac7e86f3dcf528e3ae591fec1c03090a49f8`, Codex `3aae5d885bac39c1262491aa3fd100dfd8b3919f`, AgentSight `v1.0.3` / `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- Current product release: AgentSight `v1.0.3`.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Current shared SEO skill pointer: `e7338af051ee9621b3033912d5c5751c7ebc241a`.
- Scheduler owner: enabled external session-level task; current repository instructions remain authoritative.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-04`, after the three-day finalization lag.
- The exact Google Drive folder is present and uniquely resolved, but direct-child inspection on `2026-08-07` found no matching GA4 or Search Console exports.
- Source-native traffic and search metrics are unavailable for comparison, not zero.
- Public search sampling remains directional until finalized Search Console evidence is restored.
- Cloudflare analytics: not configured.

## Research publication result

The system-boundary article now makes a narrower and more durable claim than the earlier short note. Current native agent telemetry is already rich for model, tool, policy, session, MCP, and selected file/resource questions. Independent system observation adds its strongest value when execution crosses into descendant processes and low-level file, network, TLS, and resource behavior outside the agent's own instrumentation. The article also states the inverse boundary: system events alone are weaker for intent, skill, policy, and tool-selection semantics.

The article should be refreshed when one of its pinned implementation sources materially changes the relevant telemetry boundary. Do not generate near-duplicate comparison pages for the same reader decision.

## Next durable work

1. Retry direct canonical retrieval of `/blog/system-boundary-observability/` during the next operating cycle; do not modify rendered content merely to satisfy a crawler cache.
2. Encode the owner's content-production target in the existing operating control files without creating new control files: at least one substantive search-facing publication or major evergreen article refresh within every rolling 48-hour window, subject to source, distinctness, accuracy, and deployment gates. Thin release notes, metadata-only edits, keyword swaps, and cosmetic copy changes do not satisfy that target.
3. After the control-plane update, begin a separate route-preserving visual alignment with the current Eunomia visual system: light canvas, `#091627` ink, slate borders, cyan/azure accents, restrained orange highlight, and richer information hierarchy while keeping AgentSight product screenshots and identity prominent. Split this into independently reviewable visual phases; do not combine it with routine content publication.

The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
