# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative product release: **AgentSight v1.0.30**, tag and release commit `934f441eff8ca210807333633f47b2efcb8cd020`, published 25 August 2026.
- v1.0.29 / product PR `#196` adds official Homebrew installation documentation for Linux x86-64. v1.0.30 / product PR `#206` adds repository-maintenance plumbing for shared agent skills without changing AgentSight runtime code or existing repository-specific skills.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` has not moved beyond it.
- Runtime analytics remains GA4 with path-only URL reporting; query strings, Google signals, and ad-personalization signals remain excluded/disabled by repository policy.
- Repository-hosted model/SEO scheduler: none. The recurring external operations schedule remains enabled.

## Product boundaries retained from v1.0.27 and v1.0.28

### Docker-backed native sessions

- v1.0.27 / product PR `#195` adds repeatable `agentsight bind --docker-container NAME` sources.
- The host Node invokes AgentSight’s existing native discovery and provider messaging inside named containers through a bounded JSONL bridge, then merges those sessions into the normal Node snapshot/detail/message APIs.
- Provider credentials and provider-native state stay inside the container.
- Native container discovery covers Claude Code, Codex, Gemini CLI, and Cursor. Resumable messaging covers Claude Code, Codex, and Gemini CLI; Cursor remains observation-only.
- Ambiguous local/container or cross-container session identifiers return conflict; unavailable peers make exact routing fail closed.
- Saved `--db` captures cannot be combined with Docker session sources because saved captures are read-only.
- Docker socket access is still daemon-wide authority in normal Docker deployments; a named-container option constrains AgentSight behavior, not Docker authorization.

### Audit provenance

- v1.0.28 / product PR `#204` preserves `view_source` and optional `confidence` on audit and LLM rows across capture, persistence, reconstruction, and native-session parsing.
- `view_source` distinguishes direct `view`, reconstructed `sqlite`, `agent_native_session`, and legacy/unclassified `unknown` provenance.
- `confidence` is row- and source-specific correlation/reconstruction metadata. It is not a globally calibrated probability and must not be compared blindly across sources.
- Legacy SQLite schemas retain compatible fallback behavior.

## Production and public verification

- The last completed scheduled product-sync publication before this cycle was v1.0.28 via rendered PR `#81`, squash commit `23d241f100fbe107fe88828d78840101d454cccd`, with `site/.source-sha` matching that source commit.
- Independent canonical homepage retrieval on 25 August now exposes v1.0.28, including its release banner and source pin. The crawler/CDN freshness qualification recorded immediately after the 24 August publication is therefore resolved for the homepage.
- The website entered this cycle behind the authoritative v1.0.30 release. The current cycle is repairing that factual release/source drift before the substantive content-SLO outcome.
- Public package/readme indexes can lag the authoritative repository version and are not used as product release truth.

## Analytics and search evidence

- Google Drive artifact folder: `agentsight.us SEO Weekly CSV`.
- Verified weekly GA4 landing-page and Search Console artifact families exist for 3–9 August and 10–16 August.
- Both verified weekly families were generated the morning after their windows ended, before the configured three-day finalization lag. They remain directional snapshots rather than finalized weekly KPIs until a post-lag refresh exists.
- No `2026-08-17_to_2026-08-23` export is visible on 25 August. Under the three-day lag that window is not final until 26 August, so the absence is not a technical defect.
- Cloudflare analytics is not configured.
- Public brand search now has a naming collision with an unrelated Shopify app called “AgentSight: AI Agent SEO”, launched in July 2026. Treat this as directional brand-search ambiguity, not as a verified backlink, endorsement, ranking cause, or reason for reactive renaming.
- No new independently verified external link to an `agentsight.us` canonical was established in the 25 August patrol.

## Content clock

- Latest qualifying substantive publication at cycle start: `/blog/replay-coding-agent-repository-changes/`.
- Exact substantive publication time: `2026-08-23T16:37:33Z` (09:37 PDT).
- The rolling 48-hour deadline falls during the 25 August operating cycle. Release synchronization is a factual repair and does not reset this clock.
- The selected substantive outcome is a source-grounded engineering analysis of Docker-backed native sessions and their trust/routing boundaries, based on product PR `#195` and the current v1.0.30 source tree.

## Human-only blockers

- **Google SEO export finalization timing:** the external Apps Script exporter needs a post-three-day-lag refresh for completed weekly GA4/GSC windows. The scheduled operator can inspect Drive but cannot execute or configure that Apps Script project.
- **npm scoped first publication:** `@eunomia-bpf/agentsight@1.0.0` still lacks independently verified public npm publication. Do not advertise it as an install path until an authorized npm administrator completes and verifies first publication.
