# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.30**, tag/release/product `master` commit `934f441eff8ca210807333633f47b2efcb8cd020`, published 25 August 2026. Rechecked 3 September; no newer product release drift is present.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication is the major evergreen refresh of `/blog/system-boundary-observability/`, rendered PR `#105`, squash commit `65bdccef66f50490a7f929b74ccc90afa34ad1ad`.
- Exact `Publish static site` run `33782122899` succeeded at `2026-09-03T17:02:26Z` (10:02:26 PDT).
- Current production `site/.source-sha` exactly equals `65bdccef66f50490a7f929b74ccc90afa34ad1ad`.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may still appear as a CI/deployment check and is not treated as analytics evidence.

## Current public content ownership boundaries

- `/blog/system-boundary-observability/`: broad architecture and reader decision across native agent telemetry, tool-protocol evidence, independent system execution, provider traffic, and cross-boundary correlation. The 3 September refresh also owns the exact AgentSight v1.0.30 OpenTelemetry export/provenance boundary.
- `/blog/how-agentsight-shares-versioned-agent-skills/`: v1.0.30 shared-skills repository bridge — pinned `agent-skills` gitlink, generated `.agents/skills` links, Bash/PowerShell sync behavior, overwrite guards, Windows junction fallback, and the boundary between reusable and repository-specific skills.
- `/blog/how-agentsight-discovers-local-agent-sessions/`: provider-native discovery roots/formats, provider-specific ID resolution, Codex `state_5.sqlite` indexing, bounded list/detail behavior, caching/lazy hydration, Cursor subagent freshness/deduplication, and missing-session troubleshooting.
- `/blog/when-agentsight-works-without-ebpf/`: practical choice between native-session workflows and Linux eBPF/system-boundary capture.
- `/blog/read-agentsight-audit-provenance/`: audit/LLM `view_source`, source-specific `confidence`, reconstruction, legacy fallback, and evidence-lineage interpretation.
- `/blog/observe-ai-agent-sessions-in-docker/`: named-container native-session bridge, exact routing, bounds, provider state location, and Docker daemon trust boundary.
- `/blog/how-agentsight-direct-node-credentials-work/`: persistent bootstrap key, URL-fragment pairing, Direct/relay scoped capabilities, and optional encrypted cross-browser Direct configuration.
- `/blog/replay-coding-agent-repository-changes/`: native-session repository replay and its intent/system-evidence limits.

These owners are intentionally separate. Avoid publishing keyword variants that do not add a new reader decision, mechanism, artifact, benchmark, or reproducible method.

## System-boundary / OpenTelemetry facts retained from v1.0.30

- AgentSight v1.0.30 can export captured LLM request/response pairs as OpenTelemetry GenAI spans over OTLP/HTTP.
- Each paired model call becomes a `chat {model}` CLIENT span; request/response timestamps define wire latency.
- Provider, model, real conversation ID when available, usage, finish reason, HTTP status, and server address are mapped when the captured traffic contains them.
- Prompt/completion content is excluded by default and requires `--otel-capture-content`.
- Trace grouping uses real conversation ID first, then session ID, then the current recording as fallback. Root/child relationships are not inferred yet.
- Standard tool/workflow spans (`execute_tool`, `invoke_agent`, `invoke_workflow`, `plan`) are not emitted today. AgentSight-specific system provenance remains in AgentSight rows/views, so the OTel export is not described as a lossless projection of the complete process/file/network/resource evidence graph.
- The refreshed system-boundary article keeps upstream-agent facts pinned to exact upstream research commits where applicable rather than treating a generic comparison checklist as current forever.

## Shared-agent-skills implementation facts retained from v1.0.30

- AgentSight pins `eunomia-bpf/agent-skills` as `.agents/sources/agent-skills`; the v1.0.30 product tree records pinned commit `80b46492986ec55b39d6c514d35e574afaa3c0ef`.
- `scripts/sync-agent-skills.sh` initializes exactly that submodule and invokes the pinned pack's linker into `.agents/skills`; generated `/.agents/skills/` is ignored by Git.
- The Bash linker considers only child directories containing `SKILL.md`, refuses to replace a real file/directory, and may replace an existing symbolic link.
- The PowerShell linker similarly refuses ordinary existing paths, reuses a matching reparse point, and on Windows `Auto` mode may fall back from a symbolic link to a directory junction.
- The pinned pack contains seven reusable workflows: six general open-source maintainer workflows plus `eunomia-community-patrol`.
- The shared pack explicitly excludes skills tied to one consumer repository's content tree, publishing ledger, site paths, SEO operation, or repository-specific research workflow.
- AgentSight's committed repo-local `skills/` prototypes are a separate mechanism. The v1.0.30 shared bridge is repository infrastructure, not evidence that AgentSight runtime executes every skill or that all coding agents consume `.agents/skills` identically.

## Production verification

- PR `#105` final head `567a252c31259f3827d6f906b89ea7911e4ea956` passed exact-head Website CI run `33781612879`; the scope guard, `npm ci`, `npm run verify`, and static-site artifact upload all succeeded.
- The successful static-site artifact was `9903796847`, digest `sha256:94a8e8bfd6b4242a136a5bb2757392a5930fe4e791c5edc64bcb9602902d0235`.
- Exact-head GitGuardian and Cloudflare Pages checks succeeded. No blocking review thread was present at the final review gate.
- After CI was green, the complete base-to-head diff and downloaded generated static-site artifact were reviewed from scratch.
- PR `#105` was squash-merged as `65bdccef66f50490a7f929b74ccc90afa34ad1ad`.
- Exact production workflow `33782122899` succeeded from that exact `main` commit at `2026-09-03T17:02:26Z`.
- Production `site/.source-sha` exactly matches `65bdccef66f50490a7f929b74ccc90afa34ad1ad`.
- Generated production HTML for `/blog/system-boundary-observability/` contains the refreshed v1.0.30 description, canonical URL, article Open Graph/Twitter metadata, and updated substantive body. Generated `sitemap.xml` contains that route with `2026-09-03` lastmod.
- Fresh direct retrieval of the canonical homepage succeeds and shows current v1.0.30 content.
- Immediately after publication, the available direct retrieval path for the refreshed system-boundary article still returned an older cached v1.0.3 copy. This is a **retrieval/CDN/indexing freshness qualification**, not a production incident, because exact workflow state, `site/.source-sha`, generated production HTML, and sitemap all agree. Recheck the public route in a later cycle; do not manufacture a cache-forcing change without evidence of an origin defect.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- The `2026-08-17_to_2026-08-23` family remains completely absent as of 3 September.
- The latest family remains `2026-08-24_to_2026-08-30`, generated 31 August around 09:05 PDT. No post-lag refresh is present; the stored files remain the next-morning snapshot even though the completed window is now beyond the configured three-day finalization lag.
- The 24–30 GA4 landing export still lists 17 sessions: 11 homepage, 2 `(not set)`, and one each for `/architecture/`, `/blog/`, `/guides/agent-flamegraph/`, and `/guides/getting-started/`; listed key events are zero.
- The 24–30 GSC date export still contains 24–29 August but no 30 August row: 9 clicks / 180 impressions / 5.00% CTR / weighted average position ~20.62.
- Because the missing 17–23 family was never backfilled and the 24–30 family remains stale/incomplete, fresh finalized week-over-week analysis is blocked.
- Generic public brand search remains ambiguous because unrelated products use the AgentSight name.

## Off-site visibility

- Alibaba Cloud Linux 4 Agentic Edition documentation lists AgentSight as a runtime-layer/core component and describes eBPF-based AI-agent observability.
- Alibaba's `alibaba/anolisa` repository provides primary-source provenance: its `NOTICE` states that `src/agentsight/` is based on `https://github.com/eunomia-bpf/agentsight` and credits eunomia-bpf contributors.
- This is an independent downstream open-source/product reference, not a verified backlink to `agentsight.us`, customer proof, partnership claim, or endorsement.

## npm publication state

- The former scoped-npm first-publication blocker is resolved. v1.0.30 release commit `934f441eff8ca210807333633f47b2efcb8cd020` successfully published `@eunomia-bpf/agentsight@1.0.30` with provenance.
- This does not itself make npm a website-recommended install path; public install guidance continues to follow the authoritative product README/release documentation.

## Content clock

- Previous qualifying publication: `/blog/how-agentsight-shares-versioned-agent-skills/`, production completion `2026-09-02T16:59:04Z` (09:59:04 PDT).
- Current qualifying publication: major evergreen refresh of `/blog/system-boundary-observability/`, production completion `2026-09-03T17:02:26Z` (10:02:26 PDT).
- The publication time is recorded from exact successful production workflow `33782122899`, not PR creation or merge time.
- Next rolling 48-hour deadline: `2026-09-05T17:02:26Z` (10:02:26 PDT).

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and refresh 24–30 August after the configured finalization cutoff. The current scheduled operator can inspect Drive but has no connected Apps Script execution/configuration surface.
