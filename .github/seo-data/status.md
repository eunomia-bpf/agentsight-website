# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.30**, tag/release/product `master` commit `934f441eff8ca210807333633f47b2efcb8cd020`, published 25 August 2026. Rechecked 4 September; no newer product release or unreleased `master` drift is present.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication: `/blog/how-agentsight-evolves-agent-skills/`, rendered PR `#107`, squash commit `632d0d8437b4a4cd5cbcbbfb7826996fbf628b5d`.
- Exact `Publish static site` run `33897496330` succeeded at `2026-09-04T16:53:04Z` (09:53:04 PDT).
- Current production `site/.source-sha` exactly equals `632d0d8437b4a4cd5cbcbbfb7826996fbf628b5d`.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may still appear as a CI/deployment check and is not treated as analytics evidence.

## Current public content ownership boundaries

- `/blog/how-agentsight-evolves-agent-skills/`: v1.0.30 repository-local skill-evolution method — source-fidelity gates, workload strata, failure ownership, durable-memory placement, candidate patch boundaries, leak-resistant held-out evaluation, promotion verdicts, and rollback. It explicitly does not claim autonomous runtime self-editing.
- `/blog/system-boundary-observability/`: broad architecture and reader decision across native agent telemetry, tool-protocol evidence, independent system execution, provider traffic, and cross-boundary correlation. The 3 September refresh also owns the exact AgentSight v1.0.30 OpenTelemetry export/provenance boundary.
- `/blog/how-agentsight-shares-versioned-agent-skills/`: v1.0.30 shared-skills repository bridge — pinned `agent-skills` gitlink, generated `.agents/skills` links, Bash/PowerShell sync behavior, overwrite guards, Windows junction fallback, and the boundary between reusable and repository-specific skills.
- `/blog/how-agentsight-discovers-local-agent-sessions/`: provider-native discovery roots/formats, provider-specific ID resolution, Codex `state_5.sqlite` indexing, bounded list/detail behavior, caching/lazy hydration, Cursor subagent freshness/deduplication, and missing-session troubleshooting.
- `/blog/when-agentsight-works-without-ebpf/`: practical choice between native-session workflows and Linux eBPF/system-boundary capture.
- `/blog/read-agentsight-audit-provenance/`: audit/LLM `view_source`, source-specific `confidence`, reconstruction, legacy fallback, and evidence-lineage interpretation.
- `/blog/observe-ai-agent-sessions-in-docker/`: named-container native-session bridge, exact routing, bounds, provider state location, and Docker daemon trust boundary.
- `/blog/how-agentsight-direct-node-credentials-work/`: persistent bootstrap key, URL-fragment pairing, Direct/relay scoped capabilities, and optional encrypted cross-browser Direct configuration.
- `/blog/replay-coding-agent-repository-changes/`: native-session repository replay and its intent/system-evidence limits.

These owners are intentionally separate. Avoid publishing keyword variants that do not add a new reader decision, mechanism, artifact, benchmark, or reproducible method.

## Skill-evolution method retained from v1.0.30

- `skills/evolve-agent-skills/SKILL.md` treats trajectories as evidence rather than instructions and separates analysis/proposal from promotion claims.
- Source coverage is inventoried before behavioral aggregation: source roots, discovery rules, time ranges, parse results, stable identity, parent/child/reviewer lineage, runtime, repository state, and coverage gaps are explicit.
- Human-interactive parents, delegated children/reviewers, benchmark/replay/synthetic/exec workloads, evaluator/checker runs, and unknown records are kept as separate strata until synthesis.
- Failure classification separates source-fidelity and metric defects from routing, claim/evidence drift, review priming, retry/churn, stale-state, workflow-duplication, overgeneralized-memory, skill-bloat, workload-leakage, and outcome-blindness problems.
- Durable-memory placement is intentionally narrow: project facts stay project-local; one reproducible failure is generally a regression fixture; repeated project workflow can become a project-local skill; repeated general procedures can justify a shared skill; parser/identity defects belong in observability implementation; sparse evidence can remain an analysis note.
- A candidate patch package must name the failure, current/desired observable behavior, smallest file set, mechanism, non-goals, regression risks, positive/negative/boundary evals, and rollback condition.
- Promotion uses frozen baseline/candidate revisions, held-out P/U/R/A tasks, leakage controls, layered grading, repeated trials where stochastic, and a predeclared decision rule.
- Verdicts are `observe`, `propose`, `pilot`, `promote`, `reject`, or `rollback`; an explicitly requested local edit can be `propose`, but a causal improvement or promotion claim requires valid comparison evidence.
- This is a checked-in repository workflow. It is not evidence that every AgentSight user executes it or that the runtime automatically edits/deploys production skills.

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

- PR `#107` exact head `37d89686268c9f9e7e1234715a84b69bcf52f851` passed Website CI run `33897228086`; the autonomous SEO scope guard, `npm ci`, `npm run verify`, and static-site artifact upload all succeeded.
- Successful static-site artifact `9946219497`, digest `sha256:234df7563f6719192f149211e1effc126aed123ad6a98328ea34e1a3332ebaf8`, was downloaded and inspected.
- Exact-head GitGuardian succeeded and Cloudflare Pages reported a successful preview deployment. No unresolved review thread was present at the final review gate.
- After CI was green, the complete base-to-head diff and generated static-site artifact were reviewed from scratch.
- PR `#107` was squash-merged as `632d0d8437b4a4cd5cbcbbfb7826996fbf628b5d`.
- Exact production workflow `33897496330` succeeded from that exact `main` commit at `2026-09-04T16:53:04Z`.
- Production `site/.source-sha` exactly matches `632d0d8437b4a4cd5cbcbbfb7826996fbf628b5d`.
- Generated production HTML for `/blog/how-agentsight-evolves-agent-skills/` contains the intended v1.0.30 title/description, canonical URL, and article Open Graph metadata. Generated `sitemap.xml` contains that route with `2026-09-04T00:00:00.000Z` lastmod.
- Immediate exact-title search after publication did not yet index the new page. This is a retrieval/indexing freshness qualification, not a production incident, because exact workflow state, `site/.source-sha`, generated production HTML, and sitemap all agree.
- Fresh public search for the homepage returns the current v1.0.30 observe → diagnose → evolve → evaluate content. The system-boundary article still shows mixed search-cache freshness in some retrieval paths, with refreshed body text alongside an older v1.0.3 snippet.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- The `2026-08-17_to_2026-08-23` family remains completely absent as of 4 September.
- The latest family remains `2026-08-24_to_2026-08-30`, generated 31 August around 09:05 PDT. No post-lag refresh is present; the stored files remain the next-morning snapshot even though the completed window is beyond the configured three-day finalization lag.
- The 24–30 GA4 landing export still lists 17 sessions: 11 homepage, 2 `(not set)`, and one each for `/architecture/`, `/blog/`, `/guides/agent-flamegraph/`, and `/guides/getting-started/`; listed key events are zero. Public-safe SHA-256: `2372c487f122aa3aabb72a1008408619d2036d06061542f92df898163afc1f3a`.
- The 24–30 GSC date export still contains 24–29 August but no 30 August row: 9 clicks / 180 impressions / 5.00% CTR / weighted average position ~20.62. Public-safe SHA-256: `70d69b7fd6a372d2ffec14cfb77dace8abfd63113e3027ddaeb499f6a6024f99`.
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

- Previous qualifying publication: major evergreen refresh of `/blog/system-boundary-observability/`, production completion `2026-09-03T17:02:26Z` (10:02:26 PDT).
- Current qualifying publication: `/blog/how-agentsight-evolves-agent-skills/`, production completion `2026-09-04T16:53:04Z` (09:53:04 PDT).
- The publication time is recorded from exact successful production workflow `33897496330`, not PR creation or merge time.
- The current publication completed approximately 24 hours 9 minutes before the prior rolling deadline.
- Next rolling 48-hour deadline: `2026-09-06T16:53:04Z` (09:53:04 PDT).

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and refresh 24–30 August after the configured finalization cutoff. The current scheduled operator can inspect Drive but has no connected Apps Script execution/configuration surface.
