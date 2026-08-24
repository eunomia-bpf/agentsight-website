# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative product release: **AgentSight v1.0.28**, tag and release commit `c41457cb28be68a72c6f5af8f8bf3e59a2d87bc2`, dated 24 August 2026.
- The website baseline at the start of the 24 August cycle was v1.0.26 at `main` commit `db733576d05b54bad90d69c38878a408ea7a32fb`, with rendered source marker `936bc397c658ed3cabd953c161ae4eee34f09bfa`.
- A v1.0.28 synchronization is being delivered in the 24 August cycle. It updates the existing Product, Architecture, Changelog, release identity, and `llms.txt` canonicals rather than adding a release-specific landing page.
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

- At the start of the 24 August cycle, direct canonical-homepage retrieval was healthy and showed the expected published v1.0.26 generation. There was no production incident requiring rollback or cache repair.
- The 23 August repository-replay Blog remains delivered through rendered squash commit `936bc397c658ed3cabd953c161ae4eee34f09bfa`; the `site` branch source marker matched that commit at cycle start.
- Immediate public search still does not reliably surface the repository-replay article. This remains index/crawler freshness rather than evidence of a missing route because the exact publication branch contains the canonical.
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
