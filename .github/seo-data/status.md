# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative product release: **AgentSight v1.0.30**, tag and release commit `934f441eff8ca210807333633f47b2efcb8cd020`, published 25 August 2026.
- v1.0.29 / product PR `#196` adds official Homebrew installation documentation for Linux x86-64. v1.0.30 / product PR `#206` adds repository-maintenance plumbing for shared agent skills without changing AgentSight runtime code or existing repository-specific skills.
- The website release/source identity is synchronized to v1.0.30 through rendered PR `#84`, squash commit `9e22a1aa8f6dd28091843f5041a795144cb2b492`.
- The newest substantive publication is `/blog/observe-ai-agent-sessions-in-docker/`, delivered through rendered PR `#85`, squash commit `1dc1f5ce9d7f05a4a130385736a53ea72f0467a1`.
- The current publication branch `site/.source-sha` exactly identifies `1dc1f5ce9d7f05a4a130385736a53ea72f0467a1` after the newest content publication.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` has not moved beyond it.
- Runtime analytics remains GA4 with path-only URL reporting; query strings, Google signals, and ad-personalization signals remain excluded/disabled by repository policy.
- Repository-hosted model/SEO scheduler: none. The recurring external operations schedule remains enabled.

## Product boundaries retained from v1.0.27 and v1.0.28

### Docker-backed native sessions

- v1.0.27 / product PR `#195` adds repeatable `agentsight bind --docker-container NAME` sources.
- The host Node invokes AgentSight’s existing native discovery and provider messaging inside named containers through a bounded JSONL bridge, then merges those sessions into the normal Node snapshot/detail/message APIs.
- Provider credentials and provider-native state stay inside the container; parsed session evidence is returned to the host Node for the normal session APIs.
- Native container discovery covers Claude Code, Codex, Gemini CLI, and Cursor. Resumable messaging covers Claude Code, Codex, and Gemini CLI; Cursor remains observation-only.
- Ambiguous local/container or cross-container session identifiers return conflict; unavailable peers make exact routing fail closed.
- Saved `--db` captures cannot be combined with Docker session sources because saved captures are read-only.
- Docker socket access is still daemon-wide authority in normal Docker deployments; a named-container option constrains AgentSight behavior, not Docker authorization.
- The dedicated `/blog/observe-ai-agent-sessions-in-docker/` article now documents the source-level protocol, bounds, routing behavior, container execution identity, Codex sandbox consequence, and Docker trust boundary against v1.0.30.

### Audit provenance

- v1.0.28 / product PR `#204` preserves `view_source` and optional `confidence` on audit and LLM rows across capture, persistence, reconstruction, and native-session parsing.
- `view_source` distinguishes direct `view`, reconstructed `sqlite`, `agent_native_session`, and legacy/unclassified `unknown` provenance.
- `confidence` is row- and source-specific correlation/reconstruction metadata. It is not a globally calibrated probability and must not be compared blindly across sources.
- Legacy SQLite schemas retain compatible fallback behavior.

## Production and public verification

- Product-sync PR `#84` exact final head `d49f5d738042b484d6920266b0cf28401c3deff8` passed Website CI `32873776714`, including the autonomous SEO scope guard, `npm ci`, `npm run verify`, static export, and artifact upload.
- PR `#84` was squash-merged as `9e22a1aa8f6dd28091843f5041a795144cb2b492`; exact `Publish static site` run `32873880632` completed successfully at `2026-08-25T16:46:31Z` and the publication source marker matched that squash commit.
- Docker-session article PR `#85` exact final head `bd0817962198166decb7c60c752e69974289009b` passed Website CI `32874460159` with the same required gates.
- PR `#85` was squash-merged as `1dc1f5ce9d7f05a4a130385736a53ea72f0467a1`; exact `Publish static site` run `32874567821` completed successfully at `2026-08-25T16:53:27Z` and `site/.source-sha` exactly matches the squash commit.
- Generated `site` content contains the new Docker-session article with its expected title, canonical URL, description, article metadata, and pinned v1.0.30 source links. Generated `sitemap.xml` contains its canonical route with an August 25 last-modified value.
- Immediate independent public crawler retrieval after the 25 August publications still exposed the previous v1.0.28 homepage generation; `/blog/` and `/llms.txt` produced crawler cache misses and the new article was not yet present in the crawler search cache. Exact build/publication evidence is internally consistent, matching the short-lived crawler/CDN freshness behavior observed after the prior cycle. Treat this as a freshness qualification rather than a production incident unless stale independent retrieval persists beyond normal freshness time.
- Public package/readme indexes can lag the authoritative repository version and are not used as product release truth.

## Analytics and search evidence

- Google Drive artifact folder: `agentsight.us SEO Weekly CSV`.
- Verified weekly GA4 landing-page and Search Console artifact families exist for 3–9 August and 10–16 August.
- Both verified weekly families were generated the morning after their windows ended, before the configured three-day finalization lag. They remain directional snapshots rather than finalized weekly KPIs until a post-lag refresh exists.
- No `2026-08-17_to_2026-08-23` export is visible on 25 August. Under the three-day lag that window is not final until 26 August, so the absence is not a technical defect.
- Cloudflare analytics is not configured.
- Public brand search has a naming collision with an unrelated Shopify app called “AgentSight: AI Agent SEO”, launched in July 2026. Treat this as directional brand-search ambiguity, not as a verified backlink, endorsement, ranking cause, or reason for reactive renaming.
- No new independently verified external link to an `agentsight.us` canonical was established in the 25 August patrol.

## Content clock

- Latest qualifying substantive publication: `/blog/observe-ai-agent-sessions-in-docker/`.
- Exact substantive publication time: `2026-08-25T16:53:27Z` (09:53:27 PDT), defined by the successful exact `Publish static site` run for the article squash commit.
- The prior 48-hour deadline was `2026-08-25T16:37:33Z`; this cycle missed it by 15 minutes 54 seconds while completing a higher-priority confirmed product-release drift repair. The miss is recorded rather than masked by filler content.
- Next normal rolling 48-hour deadline: `2026-08-27T16:53:27Z` (09:53:27 PDT).
- Prefer the next substantive outcome only when it adds a distinct reader answer, first-party experiment, or evidence-backed comparison; do not create thin cadence content.

## Human-only blockers

- **Google SEO export finalization timing:** the external Apps Script exporter needs a post-three-day-lag refresh for completed weekly GA4/GSC windows. The scheduled operator can inspect Drive but cannot execute or configure that Apps Script project.
- **npm scoped first publication:** `@eunomia-bpf/agentsight@1.0.0` still lacks independently verified public npm publication. Do not advertise it as an install path until an authorized npm administrator completes and verifies first publication.
