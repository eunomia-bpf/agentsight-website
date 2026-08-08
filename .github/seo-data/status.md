# SEO status

## Current state

- The earlier canonical-production mismatch after the AgentSight `v1.0.3` release sync is now independently resolved: on `2026-08-07` the canonical homepage exposes `v1.0.3`, the current product positioning, the Overview dashboard, and the immutable product snapshot used by the published site.
- PR `#31` was squash-merged as `51c75654c77d07492174aee4bf4d401ca8b7c833`; its published output is now visible on the canonical site.
- Active owner-directed rendered change: substantially expand the existing `/blog/system-boundary-observability/` article with a primary-source comparison of Claude Code, Gemini CLI, Codex, OpenTelemetry, MCP, and AgentSight observability boundaries.
- The article reuses an existing canonical URL. It does not add, remove, rename, redirect, or consolidate any route.
- The article's central finding is that current native agent telemetry is already rich for model, tool, policy, session, and selected file/resource questions; the durable system-level gap is independent observation of descendant processes and low-level file, network, and resource activity outside the agent's own instrumentation.
- Research snapshot date: `2026-08-07`.
- Reproducibility anchors: Gemini CLI `cf22ac7e86f3dcf528e3ae591fec1c03090a49f8`, Codex `3aae5d885bac39c1262491aa3fd100dfd8b3919f`, AgentSight `v1.0.3` / `07a83a32257b8c8dcba911bd9db23f77e71dc085`.
- Current product release: AgentSight `v1.0.3`.
- Canonical product website: `https://agentsight.us/`.
- Canonical documentation: `https://eunomia.dev/agentsight/`.
- Route inventory, canonical ownership, navigation hierarchy, static export, and documentation boundary remain unchanged.
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

## Current content publication

The existing system-boundary article is being upgraded from a short engineering note into a durable reference rather than creating a new keyword page. The article must:

- describe native Claude Code and Gemini CLI telemetry accurately instead of using an obsolete "application tracing stops at tool calls" strawman;
- inspect current Codex OpenTelemetry source at an exact commit;
- distinguish OpenTelemetry semantic conventions from the observation mechanism that produced a field;
- explain why MCP tool results and parent-agent events are not equivalent to a complete process-family record;
- state where system-level profiling helps and where native telemetry is the better first source;
- include exact primary-source links and implementation/version anchors;
- describe privacy and AgentSight limitations directly;
- preserve the existing URL and internal-link graph.

Completion requires exact-head Website CI, complete final diff and static-output review, squash merge, exact publication, and independent verification of the canonical article plus representative unchanged routes.

## Next durable work

After this article is closed out, encode the owner's content-production target in the existing operating control files without adding new control files: at least one substantive search-facing publication or major evergreen article refresh within every rolling 48-hour window, subject to the repository's source, distinctness, accuracy, and deployment gates. Thin release notes, metadata-only edits, keyword swaps, and cosmetic copy changes do not satisfy that target.

A separate route-preserving visual phase may align AgentSight more closely with the Eunomia visual system (light canvas, `#091627` ink, slate borders, cyan/azure accents, restrained orange highlight, serif display treatment where appropriate) while keeping AgentSight product screenshots and product identity prominent. Do not combine that site-wide style phase with routine article publication.

The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
