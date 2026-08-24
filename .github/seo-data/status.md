# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative product release: **AgentSight v1.0.28**, tag and release commit `c41457cb28be68a72c6f5af8f8bf3e59a2d87bc2`, dated 24 August 2026.
- The website is synchronized to v1.0.28 through rendered PR `#81`, squash commit `23d241f100fbe107fe88828d78840101d454cccd`.
- The publication branch was regenerated as `site` commit `92ece8c939a90e8faaa64b685df2504090075e6b` at `2026-08-24T16:37:27Z`, and `site/.source-sha` exactly identifies the rendered squash commit.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` has not moved beyond it.
- Runtime analytics remains GA4 with path-only URL reporting; query strings, Google signals, and ad-personalization signals remain excluded/disabled by repository policy.
- Repository-hosted model/SEO scheduler: none. The recurring external operations schedule remains enabled.

## New product boundaries after v1.0.26

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

- PR `#81` exact final head `f306b4e99f86cbf10e4a98442339aa16fe4dce6a` passed Website CI `32751666946`, including the autonomous SEO scope guard, `npm ci`, `npm run verify`, static export, and artifact upload.
- Exact static artifact `9529260355` has digest `sha256:15c93f93158bb20de73d2268e37ad6327e0de1d6aa90a47a22c0d4027d47cf05`.
- Static review found 39 normal generated pages and 39 sitemap URLs, unchanged from the prior baseline. Every normal page has exactly one canonical and one H1.
- Generated homepage, Product, Architecture, Changelog, and `llms.txt` expose v1.0.28 and the new container/provenance boundaries. The repository-replay Blog remains pinned to the v1.0.26 source version it actually reviewed.
- PR `#81` was squash-merged as `23d241f100fbe107fe88828d78840101d454cccd`; `site/.source-sha` exactly matches it after publication.
- Immediate independent canonical retrieval after publication still returned the older v1.0.26 homepage generation. The Architecture crawler exposed a last-week v1.0.15 generation, and Product returned a cache miss. Exact build/publication evidence is internally consistent, so this is currently a crawler/CDN freshness qualification rather than a rendered publication incident.
- Do not make a cache-forcing content change solely from this mismatch. Recheck the canonical pages in a later operating cycle and investigate production routing only if stale direct retrieval persists independently after normal freshness time.
- Public package/readme indexes can lag the authoritative repository version and are not used as product release truth.

## Analytics and search evidence

- Google Drive artifact folder: `agentsight.us SEO Weekly CSV`.
- Previously verified weekly GA4 landing-page and Search Console CSV families exist for 3–9 August and 10–16 August. The old “manifest-only” diagnosis is closed.
- Both verified weekly families were generated the morning after their windows ended, before the configured three-day finalization lag, and no post-cutoff refresh has been established. They remain directional snapshots rather than finalized weekly KPIs.
- The 10–16 August early snapshot showed 20 listed organic landing-page sessions versus 5 in the 3–9 August early snapshot; homepage Search Console clicks moved from 2 to 5 while impressions were roughly flat. Volumes are small and the snapshots are pre-finalization, so no causal SEO claim is made from this movement.
- No new `2026-08-17_to_2026-08-23` export was visible on the morning of 24 August. That window is not yet final under the three-day lag, so this is not a defect.
- Cloudflare analytics is not configured.
- No new independently verified external link to an `agentsight.us` canonical was established in the 24 August patrol.

## Content clock

- Latest qualifying substantive publication: `/blog/replay-coding-agent-repository-changes/`.
- Exact substantive publication time: `2026-08-23T16:37:33Z` (09:37 PDT).
- The next normal daily cycle occurs before the rolling 48-hour deadline, so 24 August does not require another research publication. The v1.0.28 release synchronization is a factual repair and does not reset this clock.
- Prefer the next substantive outcome only when it adds a distinct reader answer or first-party experiment; do not create a thin release page for cadence.

## Human-only blockers

- **Google SEO export finalization timing:** the external Apps Script exporter needs a post-three-day-lag refresh for completed weekly GA4/GSC windows. The scheduled operator can inspect Drive but cannot execute or configure that Apps Script project.
- **npm scoped first publication:** `@eunomia-bpf/agentsight@1.0.0` still lacks independently verified public npm publication. Do not advertise it as an install path until an authorized npm administrator completes and verifies first publication.
