# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.30**, tag/release/product `master` commit `934f441eff8ca210807333633f47b2efcb8cd020`, published 25 August 2026. Rechecked 31 August; no newer product drift is present.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest substantive website publication: `/blog/how-agentsight-discovers-local-agent-sessions/`, rendered PR `#97`, squash commit `65202cca4331ea55d7a3cd376291abece5ec2fd0`.
- Exact `Publish static site` run `33417485123` succeeded at `2026-08-31T17:04:12Z`.
- Current `site` branch commit: `545978c4e4cadac44d62799bc24b0b97e9b6a762`; `site/.source-sha` exactly equals `65202cca4331ea55d7a3cd376291abece5ec2fd0`.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may still appear as a CI/deployment check and is not treated as analytics evidence.

## Current public content ownership boundaries

- `/blog/how-agentsight-discovers-local-agent-sessions/`: provider-native discovery roots/formats, provider-specific ID resolution, Codex `state_5.sqlite` indexing, bounded list/detail behavior, caching/lazy hydration, Cursor subagent freshness/deduplication, and missing-session troubleshooting against v1.0.30.
- `/blog/when-agentsight-works-without-ebpf/`: practical choice between native-session workflows and Linux eBPF/system-boundary capture.
- `/blog/read-agentsight-audit-provenance/`: audit/LLM `view_source`, source-specific `confidence`, reconstruction, legacy fallback, and evidence-lineage interpretation.
- `/blog/observe-ai-agent-sessions-in-docker/`: named-container native-session bridge, exact routing, bounds, provider state location, and Docker daemon trust boundary.
- `/blog/how-agentsight-direct-node-credentials-work/`: persistent bootstrap key, URL-fragment pairing, Direct/relay scoped capabilities, and optional encrypted cross-browser Direct configuration.
- `/blog/replay-coding-agent-repository-changes/`: native-session repository replay and its intent/system-evidence limits.

These owners are intentionally separate. Avoid publishing keyword variants that do not add a new reader decision, mechanism, artifact, benchmark, or reproducible method.

## Native-session implementation facts retained from v1.0.30

- Native discovery roots are Claude Code `~/.claude/projects`, Codex `$CODEX_HOME/sessions` when `CODEX_HOME` is absolute or `~/.codex/sessions` otherwise, Gemini CLI `~/.gemini/tmp`, and Cursor `~/.cursor/projects`.
- Claude/Codex use JSONL session files, Gemini uses JSON session files, and Cursor uses JSONL under `agent-transcripts` with provider-specific normalization.
- Current Codex can use a read-only `state_5.sqlite` thread index; when present, native analysis builds lightweight session rows from thread metadata before hydrating full rollout detail.
- Ordinary native list discovery is bounded to at most 25 sessions; exact detail lookup keeps an ID-to-path index and parses only the requested candidate when possible.
- Cursor discovery incorporates `subagents/*.jsonl` modification times and deduplicates same-stem candidates, preferring non-empty/newer windows.
- Hydrated native detail is bounded: up to 1,000 prompts, 2,000 LLM responses, and 2,000 tool events, with independent text/collection budgets.
- Native-session evidence and eBPF/system recordings remain different sensors. Native provider state is not promoted into independent proof of every process/file/network effect.

## Production verification

- PR `#97` final head `cdc719a8ba70e738b312c3f5a5620c7687b4cf7c` passed exact-head Website CI run `33417303675`, including SEO scope enforcement, `npm ci`, `npm run verify`, and static-site artifact upload. Artifact digest: `sha256:740a5edaf53499b30b3e242f4eeeaa043fe634c170e0c0f434e00174a2381803`.
- Exact-head GitGuardian and Cloudflare Pages checks also succeeded before merge.
- PR `#97` passed a complete post-CI from-scratch review and was squash-merged as `65202cca4331ea55d7a3cd376291abece5ec2fd0`.
- Exact production workflow `33417485123` succeeded from that exact `main` commit.
- Generated production HTML contains the new article title, description, canonical URL, TechArticle JSON-LD, date, and body. Generated `sitemap.xml` contains the new route with 31 August lastmod; the prior no-eBPF article remains generated with its canonical metadata.
- Immediate direct external retrieval of the new article/blog/sitemap was not independently established because the available public retrieval path returned cache misses. This is a **retrieval/indexing freshness qualification**, not a production incident: exact workflow state, `site/.source-sha`, generated article output, Blog source/index, and sitemap all agree. Recheck the canonical public route in a later cycle.
- Public search can lag the authoritative repository/site branch and is not product-release truth.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- A new `2026-08-24_to_2026-08-30` GA4/GSC family appeared on 31 August around 09:05 PDT. Because it was produced the morning immediately after the window ended, it is inside the configured three-day lag and remains **directional only**.
- Directional 24–30 GA4 landing export: 17 sessions across listed rows, including 11 homepage sessions and 2 `(not set)` sessions; no key events in the listed rows.
- Directional 24–30 GSC date export contains 24–29 August but no 30 August row: 9 clicks / 180 impressions / 5.00% CTR / weighted average position ~20.62.
- The now-final `2026-08-17_to_2026-08-23` family remains absent. The exporter therefore produced a newer next-morning family without backfilling/refreshing the finalized missing window; current finalized week-over-week analysis remains blocked.
- Older 10–16 August evidence also remains pre-lag; its GSC date export omitted 16 August.
- Generic public brand search remains ambiguous because unrelated products use the AgentSight name.
- Exact-title public searches do not yet establish indexing for the recent Direct/no-eBPF/local-discovery articles. Treat that as search freshness until source/deployment evidence disagrees.

## npm publication state

- The former scoped-npm first-publication blocker is resolved. v1.0.30 release commit `934f441eff8ca210807333633f47b2efcb8cd020` successfully published `@eunomia-bpf/agentsight@1.0.30` with provenance.
- This does not itself make npm a website-recommended install path; public install guidance continues to follow the authoritative product README/release documentation.

## Content clock

- Previous qualifying publication: `/blog/when-agentsight-works-without-ebpf/`, production completion `2026-08-29T17:01:17Z` (10:01:17 PDT).
- Previous 48-hour deadline: `2026-08-31T17:01:17Z` (10:01:17 PDT).
- New qualifying publication: `/blog/how-agentsight-discovers-local-agent-sessions/`, production completion `2026-08-31T17:04:12Z` (10:04:12 PDT).
- **31 August SLO result: missed by 2 minutes 55 seconds.** Publication time is recorded from the exact successful production workflow rather than PR creation or merge time.
- Next rolling 48-hour deadline: `2026-09-02T17:04:12Z` (10:04:12 PDT).

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to generate or refresh completed weekly GA4/GSC windows after the configured three-day finalization cutoff and specifically backfill 17–23 August. The current scheduled operator can inspect Drive but has no connected Apps Script execution/configuration surface.
