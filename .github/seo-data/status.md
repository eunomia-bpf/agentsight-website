# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative product release: **AgentSight v1.0.30**, tag and release commit `934f441eff8ca210807333633f47b2efcb8cd020`, published 25 August 2026. Product `master` still equals that release commit on 27 August; no newer product drift is present.
- v1.0.29 / product PR `#196` adds official Homebrew installation documentation for Linux x86-64. v1.0.30 / product PR `#206` adds repository-maintenance plumbing for shared agent skills without changing AgentSight runtime code or existing repository-specific skills.
- The website release/source identity is synchronized to v1.0.30 through rendered PR `#84`, squash commit `9e22a1aa8f6dd28091843f5041a795144cb2b492`.
- The newest substantive publication is `/blog/read-agentsight-audit-provenance/`, delivered through rendered PR `#89`, squash commit `fe1424acd19dd1260af511036931e8ca2bdadadc`.
- The current publication branch `site/.source-sha` exactly identifies `fe1424acd19dd1260af511036931e8ca2bdadadc`.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` remains the same commit.
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
- `/blog/observe-ai-agent-sessions-in-docker/` documents the source-level protocol, bounds, routing behavior, container execution identity, Codex sandbox consequence, and Docker trust boundary against v1.0.30.

### Audit provenance

- v1.0.28 / product PR `#204` preserves `view_source` and optional `confidence` on audit and LLM rows across capture, persistence, reconstruction, and native-session parsing.
- `view_source` distinguishes direct `view`, reconstructed `sqlite`, `agent_native_session`, and legacy/unclassified `unknown` provenance.
- `confidence` is row- and source-specific correlation/reconstruction metadata. It is not a globally calibrated probability and must not be compared blindly across sources.
- The live LLM correlator currently uses 0.95 for exact request-ID pairing, 0.75 for one pending request, 0.70 for a unique heuristic candidate, and 0.35 for an orphan response. SQLite prompt reconstruction can use 0.50; equal numbers from different sources do not imply equal semantics.
- Legacy SQLite schemas retain compatible fallbacks: missing lineage is read as `unknown` and missing confidence as `null` rather than fabricated.
- `/blog/read-agentsight-audit-provenance/` now owns the reader decision about interpreting, comparing, deduplicating, and exporting these heterogeneous evidence rows.

## Production and public verification

- Product-sync PR `#84` passed exact-head Website CI and was squash-merged as `9e22a1aa8f6dd28091843f5041a795144cb2b492`; its exact `Publish static site` run completed successfully.
- Docker-session article PR `#85` passed exact-head Website CI and was squash-merged as `1dc1f5ce9d7f05a4a130385736a53ea72f0467a1`; exact `Publish static site` run `32874567821` completed successfully on 25 August.
- The 26 August metadata-only operating PR `#88` eventually received successful exact-head Website CI run `32990458502` and was squash-merged on 27 August as `3479e3e50e2a1ad20f1ec5dae568d18f49b95fff` before today’s rendered work began.
- Audit-provenance article PR `#89` passed exact-head Website CI run `33092575514` at head `8735a0319fac2dd9dafe6a78e3ff5a891244d161`; the CI artifact was inspected for the article route, canonical, JSON-LD, primary-source links, Blog index entry, and sitemap.
- PR `#89` was squash-merged as `fe1424acd19dd1260af511036931e8ca2bdadadc`. Exact `Publish static site` run `33092749886` completed successfully at `2026-08-27T16:21:39Z`, and `site/.source-sha` exactly matches the squash commit.
- Generated production content contains the new article and `sitemap.xml` contains its canonical route with an August 27 last-modified value.
- Direct public homepage retrieval on 27 August serves **v1.0.30**. Public search cache still exposes older v1.0.25 copy.
- Direct retrieval of the newly published article could not be independently completed in this cycle: the web retrieval path returned a cache miss for the new route and the execution sandbox could not resolve public DNS. This is an acceptance qualification, not a claimed public-route success; exact publication workflow and generated `site` source agree and the route should be retried next cycle.
- Public package/readme/search indexes can lag the authoritative repository version and are not used as product release truth.

## Analytics and search evidence

- Google Drive artifact folder: `agentsight.us SEO Weekly CSV`.
- Verified weekly GA4 landing-page and Search Console artifact families exist for 3–9 August and 10–16 August only.
- Both verified weekly families were generated the morning after their windows ended, before the configured three-day finalization lag. They remain directional snapshots rather than finalized weekly KPIs.
- On **27 August**, the 17–23 August window is past the configured three-day finalization cutoff, but no matching GA4/GSC artifact family or post-lag refresh is visible. The external exporter-timing blocker remains active for the newest finalized weekly window.
- The unchanged 10–16 August GSC date snapshot contains rows through 15 August but no 16 August row; its directional aggregate is 5 clicks / 189 impressions, 2.65% CTR, weighted average position about 14.18.
- The unchanged 10–16 August GA4 landing-page snapshot contains 19 homepage sessions and 1 `/guides/` session. It remains pre-finalization evidence.
- Cloudflare analytics is not configured.
- Generic public brand search remains ambiguous. In addition to the unrelated Shopify app previously recorded, `agentsight.io` is a separate conversation-analytics/client-dashboard product occupying generic AgentSight results. This is a naming collision, not a verified backlink, endorsement, ranking cause, or reason for reactive renaming.
- No new independently verified external link to an `agentsight.us` canonical was established in the 27 August patrol.

## Content clock

- Latest qualifying substantive publication: `/blog/read-agentsight-audit-provenance/`.
- Exact substantive publication time: `2026-08-27T16:21:39Z` (09:21:39 PDT).
- The prior deadline was `2026-08-27T16:53:27Z`; publication completed **31 minutes 48 seconds before it**, so the rolling 48-hour SLO was satisfied.
- Next rolling 48-hour deadline: `2026-08-29T16:21:39Z` (09:21:39 PDT).
- The next normal daily cycle on 28 August is comfortably before that deadline; it may be metadata-only if no higher-priority defect, product drift, or evidence-backed rendered improvement appears.

## Human-only blockers

- **Google SEO export finalization timing:** the external Apps Script exporter needs a post-three-day-lag refresh for completed weekly GA4/GSC windows. As of 27 August the final 17–23 August window still has no matching export at all, while older windows remain pre-lag snapshots. The scheduled operator can inspect Drive but cannot execute or configure that Apps Script project.
- **npm scoped first publication:** `@eunomia-bpf/agentsight@1.0.0` still lacks independently verified public npm publication. Do not advertise it as an install path until an authorized npm administrator completes and verifies first publication.
