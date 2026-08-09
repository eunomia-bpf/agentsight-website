# SEO status

## Current state

- AgentSight `v1.0.3` is the current product release used by the website, with immutable first-party product material pinned to `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Blog is now a first-class shared navigation destination. PR `#41` added the existing `/blog/` hub to both desktop and mobile navigation without changing or removing any existing route. Exact-head CI `31284996998` succeeded; squash commit `d1775292582e2d2172823da65234ce42c1ba48a8`.
- The Blog now contains three substantive entries. The newest is `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`, published through PR `#42` as a distinct source-level engineering deep dive rather than a keyword variant of the recording guides.
- PR `#42` exact head `7acb44f465ef203c1ba419f2a656b07be061d060` passed Website CI `31285201858`; its static artifact `9029577411` has digest `sha256:c004cfd6a2b7072c6ca2ee9d7d999180637e74ac9082bc26ee26101d45bbdbce`.
- PR `#42` was squash-merged as `3c1991644bb2d8057b55c5ea60c510b3a3757612`. Main Website CI `31285282865` and Publish static site `31285282851` both succeeded. `site/.source-sha` identifies the exact same squash commit.
- Exact static review found 35 generated canonical index pages and 33 sitemap URLs. `/blog/` lists three posts; the new article has one H1, canonical/index metadata, TechArticle metadata, source links, a command block, related internal links, and approximately 1,746 rendered words.
- Independent public search/crawler sampling immediately after publication still exposes an older cached homepage generation and has not indexed the new Blog route. Treat this as crawler/index freshness until direct retrieval or Search Console proves otherwise; do not create a rendered repair solely to force cache/index refresh.
- The earlier `/blog/system-boundary-observability/` evergreen article remains useful and distinct: it explains native-agent telemetry versus independent system observation, while the new TLS article explains how to locate the actual plaintext hook point across OpenSSL, BoringSSL, rustls, wrappers, threads, and containers.
- Owner-authorized content operating policy remains active: maintain at least one substantive search-facing publication or major evergreen refresh within every rolling 48-hour window. The daily external scheduler remains a thin trigger and current repository instructions are authoritative.
- A qualifying publication must add a distinct reader answer and durable technical information such as primary-source synthesis, exact implementation/version research, a reproducible AgentSight experiment, real first-party artifacts, measured behavior, or a concrete limitation/reference analysis.
- Metadata-only work, thin release notes, keyword swaps, cosmetic copy changes, generic summaries, navigation-only changes, and near-duplicate pages do not satisfy the content SLO.
- Visual Phase 1 and Phase 2 remain delivered: the shared shell and homepage align with the Eunomia visual family while preserving AgentSight identity, URLs, canonical ownership, documentation ownership, and product imagery.
- Current shared SEO skill pointer: `d1194eeb23a6dd5cf04956f5efcfe8e3f0105003`.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current analytics and search data

- Latest eligible finalized date for the configured 28-day lookback is `2026-08-05`, after the three-day finalization lag.
- The exact Google Drive folder is present and uniquely resolved.
- On `2026-08-08`, the folder contained a GA4 source manifest for the completed `2026-07-27` through `2026-08-02` window without its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV exports were present.
- The manifest-only GA4 state is an exporter error under the current shared skill, not valid analytics evidence. Source-native traffic and search metrics remain unavailable for comparison, not zero.
- Restoring the external Google Apps Script exporter remains recorded in `block.md` because the scheduled operator has Drive access but no connected Apps Script execution/configuration surface.
- Public brand/homepage discovery remains present in sampled search results, but the crawler/search cache is behind the exact publication branch and currently cannot be used to judge the new article's indexing or ranking.
- Cloudflare analytics: not configured.

## Content clock and portfolio

- Latest qualifying publication: `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`.
- Exact qualifying squash commit: `3c1991644bb2d8057b55c5ea60c510b3a3757612`.
- Exact successful static publication completed at `2026-08-08 17:02` PDT (`2026-08-09T00:02:24Z`). This resets the rolling 48-hour substantive-content clock.
- The article's reader decision is durable: diagnose why normal `libssl.so` uprobes miss AI agent CLI plaintext and determine the correct executable/library-specific hook boundary.
- Its primary implementation findings are pinned to AgentSight `v1.0.3`, including embedded Node OpenSSL handling, stripped Bun/BoringSSL byte-pattern discovery, rustls stripped-binary paths, internal-thread filtering behavior, wrapper/interpreter resolution, and container descendant executable discovery. Version-sensitive byte/offset fingerprints are described as compatibility mechanisms, not stable ABIs.
- On every daily cycle, resolve the latest qualifying publication dynamically. If waiting until the next scheduled run would breach the 48-hour target, deliver another qualifying article or major evergreen refresh after higher-priority production/factual repairs.
- Prefer a major refresh when an existing canonical already owns the reader decision. Create a new Blog URL only for a genuinely distinct technical question.
- Next strong content candidates: a reproducible slow/expensive-run breakdown using real session outputs; an MCP-server audit comparing protocol/tool results with process/file/network activity; an Agent Flamegraph token-profile study using real local sessions; or a new implementation deep dive only when upstream/product changes create a distinct question.

## Outstanding follow-up

- Retry independent public retrieval/index visibility for `/blog/`, `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`, and `/blog/system-boundary-observability/`; do not modify rendered content merely to force crawler freshness.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum external action and resolution evidence.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
