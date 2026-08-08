# SEO status

## Current state

- AgentSight `v1.0.3` is the current product release used by the website, with immutable first-party product material pinned to `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- The canonical product website remains `https://agentsight.us/`; canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation remains `https://eunomia.dev/agentsight/`.
- No owner-directed route, canonical, redirect, or navigation migration is active.
- The existing `/blog/system-boundary-observability/` article was substantially upgraded through PR `#33` into a primary-source evergreen reference covering Claude Code, Gemini CLI, Codex, OpenTelemetry, MCP, and AgentSight observability boundaries.
- PR `#33` was squash-merged as `715730c6af07f50f9a2dca79340d98a51fb6a765`; its exact CI and static publication succeeded at `2026-08-07 23:57` PDT. The available public crawler still cannot directly retrieve the specific article route, so article-route public retrieval remains a qualified follow-up rather than a claimed success or a claimed 404.
- The previously recorded Phase 2 homepage crawler/CDN freshness mismatch is resolved. Fresh canonical homepage retrieval on `2026-08-08` exposes AgentSight `v1.0.3`, the current Overview dashboard/homepage generation, post-run product surfaces, research entry point, and the pinned product commit.
- Owner-authorized content operating policy is active: maintain at least one substantive search-facing publication or major evergreen refresh in every rolling 48-hour window. The daily external scheduler remains a thin trigger and current repository instructions are authoritative.
- A qualifying publication must add a distinct reader answer and durable technical information such as primary-source synthesis, exact implementation/version research, a reproducible AgentSight experiment, real first-party artifacts, measured behavior, or a concrete limitation/reference analysis.
- Metadata-only work, thin release notes, keyword swaps, cosmetic copy changes, generic summaries, and near-duplicate pages do not satisfy the 48-hour content SLO. Prefer major evergreen refreshes over new URLs whenever an existing canonical page already owns the reader decision.
- Visual Phase 1 is complete: PR `#36` aligned the shared AgentSight shell with the current Eunomia ink/slate/cyan/azure/orange family while preserving the AgentSight eye mark, routes, navigation destinations, content, analytics, screenshots, and documentation ownership. Squash commit `5868479172fa36a4a71c73d6be40eea996bee01d`; exact main Website CI `31245888390` and Publish static site `31245888388` succeeded.
- Visual Phase 2 is delivered: PR `#38` converted the existing homepage to the light Eunomia technical style and enriched it with current project facts, a nuanced observability-boundary explanation, existing post-run product surfaces, the evergreen research entry point, the AgentSight paper, and direct local-data sensitivity language. Squash commit `dae3f1112f7ca8e3bde3565370ac3dcfbd1737a8`; main Website CI `31246248471` and Publish static site `31246248492` succeeded, and `site/.source-sha` identified the same source commit.
- The shared SEO skill upstream has a newer compatible commit, `d1194eeb23a6dd5cf04956f5efcfe8e3f0105003`, which binds GA4 exports to explicit source manifests and adds exporter-health validation. The `2026-08-08` daily PR advances only the gitlink; protected operating files remain unchanged.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals. The source and current publication branch both contain the expected GA loader.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-05`, after the three-day finalization lag.
- The exact Google Drive folder is present and uniquely resolved.
- On `2026-08-08`, the folder contained a GA4 source manifest for the completed `2026-07-27` through `2026-08-02` window without its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV exports were present.
- The manifest-only GA4 state is an exporter error under the newest compatible shared skill, not valid analytics evidence. Source-native traffic and search metrics remain unavailable for comparison, not zero.
- Restoring the external Google Apps Script exporter is recorded in `block.md` because the scheduled operator has Drive access but no connected Apps Script execution/configuration surface.
- Public brand/homepage discovery remains present in sampled search results. The newly refreshed system-boundary article did not surface in the sampled site query less than one day after publication; treat this as directional index evidence only until finalized Search Console data exists.
- Cloudflare analytics: not configured.

## Content clock and next publications

- The `/blog/system-boundary-observability/` evergreen refresh is the current qualifying publication and the content-clock anchor.
- Its exact static publication completed at `2026-08-07 23:57` PDT. Waiting until the next normal daily cycle remains below the rolling 48-hour limit, so the `2026-08-08` cycle does not require another substantive publication.
- Visual Phase 1 and Phase 2 do not reset the content clock.
- On each daily cycle, resolve the latest qualifying publication dynamically. If waiting until the next scheduled daily run would breach 48 hours, the current cycle must deliver qualifying content after higher-priority production or factual repairs.
- If a topic overlaps an existing canonical page, deepen that page rather than manufacturing another URL.
- Immediate high-value candidates remain a real slow-run breakdown, an MCP-server audit comparing protocol results with process/file/network activity, an Agent Flamegraph token-profile study, and a current Claude/Codex/Gemini implementation deep dive when primary-source changes justify it.

## Visual and information state

The requested Eunomia-family alignment is materially present at both the shared shell and homepage levels. The product site uses the current Eunomia dark ink, slate borders/text, cyan/azure information accents, restrained orange emphasis, light technical grid/mist surfaces, dark product/code panels, and restrained serif display treatment while retaining AgentSight-specific product imagery and identity.

The homepage exposes current release/license/research facts, live and recorded product views, saved-session audit/token/serve/replay surfaces, the primary-source observability-boundary article, the published AgentSight paper, and the sensitivity of local session artifacts. A later small Phase 3 may refine generic hub/detail/article table/code/source presentation when a concrete defect or usability gap is found; it is not required to consider the requested brand/homepage alignment delivered.

## Outstanding follow-up

- Retry direct public retrieval of `/blog/system-boundary-observability/` without modifying rendered content merely to force crawler freshness.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum external action and resolution evidence.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
