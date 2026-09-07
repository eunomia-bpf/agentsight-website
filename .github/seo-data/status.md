# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.31**, tag/release/product `master` commit `bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3`, published 5 September 2026.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication: `/blog/how-agentsight-loads-agent-fleets-progressively/`, rendered PR `#111`, squash commit `95b7ded7319c3c8273051190379f22f6dd4d00a5`, exact production completion `2026-09-06T16:53:06Z` (09:53:06 PDT).
- Exact production `Publish static site` run for that publication: `34046834602`, conclusion `success`.
- Production `site/.source-sha` at the start of the 7 September cycle exactly equals `95b7ded7319c3c8273051190379f22f6dd4d00a5`.
- The previous 48-hour deadline was `2026-09-06T16:53:04Z`; exact production completion was two seconds later, so the SLO missed by **2 seconds**. The new rolling deadline is `2026-09-08T16:53:06Z` (09:53:06 PDT).
- The 7 September cycle found no product/release or shared-skill drift. A normal 8 September daily cycle can still occur before the content deadline, so the current factual repair does not reset the substantive publication clock.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may appear as a CI/deployment check and is not analytics evidence.

## Current public content ownership boundaries

- `/blog/how-agentsight-loads-agent-fleets-progressively/`: v1.0.31 fleet frontend latency/failure isolation — concurrent per-Node probes, incremental sample publication, Direct/relay per-Node behavior, generation guards, global refresh barrier, lazy process/analysis views, request timeouts, and the read/write retry boundary. It does not claim a general device/network latency benchmark or an auth/backend-policy change.
- `/blog/how-agentsight-evolves-agent-skills/`: v1.0.30 repository-local skill-evolution method — source-fidelity gates, workload strata, failure ownership, durable-memory placement, candidate patch boundaries, held-out evaluation, promotion verdicts, and rollback. It does not claim autonomous runtime self-editing.
- `/blog/system-boundary-observability/`: broad architecture and reader decision across native agent telemetry, tool-protocol evidence, independent system execution, provider traffic, cross-boundary correlation, and the v1.0.30 OpenTelemetry export/provenance boundary.
- `/blog/how-agentsight-shares-versioned-agent-skills/`: v1.0.30 shared-skills repository bridge — pinned shared-skill submodule, generated `.agents/skills` links, overwrite guards, and Windows junction fallback.
- `/blog/how-agentsight-discovers-local-agent-sessions/`: provider-native discovery roots/formats, provider-specific IDs, Codex `state_5.sqlite`, bounded list/detail behavior, caching/lazy hydration, Cursor subagent freshness/deduplication, and missing-session troubleshooting.
- `/blog/when-agentsight-works-without-ebpf/`: practical choice between native-session workflows and Linux eBPF/system-boundary capture.
- `/blog/read-agentsight-audit-provenance/`: audit/LLM `view_source`, source-specific `confidence`, reconstruction, legacy fallback, and evidence-lineage interpretation.
- `/blog/observe-ai-agent-sessions-in-docker/`: named-container native-session bridge, exact routing, bounds, provider state location, and Docker daemon trust boundary.
- `/blog/how-agentsight-direct-node-credentials-work/`: persistent bootstrap key, URL-fragment pairing, Direct/relay scoped capabilities, and optional encrypted cross-browser Direct configuration.
- `/blog/replay-coding-agent-repository-changes/`: native-session repository replay and its intent/system-evidence limits.

These owners are intentionally separate. Avoid publishing keyword variants that do not add a new reader decision, mechanism, artifact, benchmark, or reproducible method. Existing research pages remain pinned to the exact product snapshot they analyzed rather than being bulk-retagged when a new release ships.

## v1.0.31 fleet/frontend facts

- Product PR `#209` is the primary release change behind the current fleet-loading article.
- `refreshFleet` fans out independent Node probes and writes each completed Node sample into `fleetSamples` before the outer `Promise.all` resolves; the outer barrier remains relevant for end-of-refresh bookkeeping and the all-unreachable fleet error.
- Direct and Controller-relay availability are resolved per Node rather than as one fleet-wide transport result.
- Directory, fleet, and active-Node generation counters prevent late results from stale organization/activation work from overwriting newer frontend state.
- Session conversation/process/analysis are separate views; process and analysis components are dynamically imported, and analysis event-display work is tab-scoped.
- Browser requests use a 12-second default timeout and session requests use a 30-second timeout in the inspected v1.0.31 client.
- Ambiguous HTTPS write failures are not automatically replayed; fallback after such a failure is limited to safe read methods (`GET`/`HEAD`).
- Product PR `#209` explicitly leaves authentication, capability, organization, and backend policy unchanged. Its build/browser validation is not a general physical-device latency benchmark.

## Production verification

- Rendered PR `#111` final exact head `53e468bcc4743ed040adbc5870ae3fd7579d9b6b` passed Website CI run `34046632222`, including scope guard, `npm ci`, `npm run verify`, and static-site artifact upload.
- Exact-head GitGuardian and Cloudflare Pages preview succeeded.
- Copilot initially raised two concrete issues: leading whitespace inside two source-link texts and a stale `/blog/` hub sitemap last-modified value. Both were fixed before merge, replied to, and resolved.
- Final static-site artifact `9993297953`, digest `sha256:c2e9da53391595be83202ca52c31f9e44cac17e8ea61fe0bfaa280d2d4ca46ab`, was downloaded and inspected. The new article title/canonical/v1.0.31 scope, Blog-hub discovery, article sitemap entry, and Blog-hub sitemap timestamp were correct.
- A from-scratch final review confirmed exactly three rendered files changed: the new article, the Blog hub, and sitemap.
- PR `#111` was squash-merged as `95b7ded7319c3c8273051190379f22f6dd4d00a5`.
- Exact `Publish static site` run `34046834602` succeeded from that commit at `2026-09-06T16:53:06Z`.
- Production `site/.source-sha` exactly matched `95b7ded7319c3c8273051190379f22f6dd4d00a5` at the start of 7 September.
- Generated production article HTML contains the intended title, v1.0.31 description, and canonical URL. Production `sitemap.xml` contains the new route and records both it and `/blog/` with `2026-09-06T00:00:00.000Z` last-modified timestamps.
- Immediate exact-title public search still does not surface the fleet-loading route. Direct homepage retrieval is current v1.0.31, while some indexed pages retain cached v1.0.30 text; with exact deployment artifacts agreeing, this remains indexing/retrieval freshness rather than a production incident.
- The 7 September public search pass exposed a separate site-owned factual defect: `/product/`, `/architecture/`, and `/pricing/` combined old fixed review dates (13 or 24 August) with the dynamically current `site.version`/`productCommit`, producing impossible claims that those August reviews were performed against the 5 September v1.0.31 release. The current rendered repair revalidates those source sections against v1.0.31 and separates the fixed substantive-review date from the dynamically current source target so a future release cannot silently rewrite the historical review claim.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- `2026-08-17_to_2026-08-23` remains completely absent as of 7 September.
- `2026-08-24_to_2026-08-30` remains the next-morning 31 August family. No post-lag refresh is present even though the completed window is beyond the configured three-day finalization lag; its GSC date export still omits 30 August.
- The 24–30 GA4 landing export still lists 17 sessions: 11 homepage, 2 `(not set)`, and one each for `/architecture/`, `/blog/`, `/guides/agent-flamegraph/`, and `/guides/getting-started/`; listed key events are zero. Public-safe SHA-256: `2372c487f122aa3aabb72a1008408619d2036d06061542f92df898163afc1f3a`.
- The 24–30 GSC date export still contains 24–29 August but no 30 August row: 9 clicks / 180 impressions / 5.00% CTR / weighted average position approximately 20.62. Public-safe SHA-256: `70d69b7fd6a372d2ffec14cfb77dace8abfd63113e3027ddaeb499f6a6024f99`.
- A new `2026-08-31_to_2026-09-06` family was generated 7 September around 09:05 PDT, the morning immediately after the covered window. It is therefore **pre-finalization directional evidence**, not a finalized weekly KPI family.
- The new GA4 organic landing file lists 12 sessions / 11 active users, all on `/`, engagement rate `58.33%`, and zero listed key events. Public-safe SHA-256: `45a3ab61f21fdfcce3d8ef6ba7c8ce301a353a2bb2a95fc0ef090069a322ffe9`.
- The new GSC date file contains 31 August through 5 September but omits 6 September: 4 clicks / 260 impressions / 1.54% CTR / weighted average position approximately 11.68. Public-safe SHA-256: `dc3a35240a6b2d311d36a873bccf74e26d34e8dfcdac7866c573cab2d46bc67e`.
- Like-for-like only as six-day next-morning snapshots, impressions rose from 180 to 260 and apparent weighted position improved from approximately 20.62 to 11.68, while clicks fell from 9 to 4 and CTR from 5.00% to 1.54%. This is directional and must not be reported as finalized week-over-week performance.
- Directional GSC page rows in the new family include homepage 4 clicks / 123 impressions / average position approximately 5.50, `/integrations/cursor/` 25 impressions, `/releases/` 17, `/blog/read-agentsight-audit-provenance/` 12, `/use-cases/audit-mcp-servers-skills-plugins/` 12, `/guides/agent-flamegraph/` 11, and `/blog/` 11.
- The new next-morning family confirms that the exporter continues to run, but the missing 17–23 family and stale/incomplete 24–30 family still block fresh finalized week-over-week analysis.
- Generic public brand search remains ambiguous because unrelated products use the AgentSight name.

## Off-site visibility

- Alibaba Cloud Linux 4 Agentic Edition documentation lists AgentSight as a runtime-layer/core component and describes eBPF-based AI-agent observability.
- Alibaba's `alibaba/anolisa` repository provides primary-source provenance: its `NOTICE` states that `src/agentsight/` is based on `https://github.com/eunomia-bpf/agentsight` and credits eunomia-bpf contributors.
- This is an independent downstream open-source/product reference, not a verified backlink to `agentsight.us`, customer proof, partnership claim, or endorsement.
- The bounded 7 September search scan did not establish a new independently verified external link or citation requiring a status change.

## npm publication state

- The former scoped-npm first-publication blocker remains resolved. v1.0.30 release commit `934f441eff8ca210807333633f47b2efcb8cd020` successfully published `@eunomia-bpf/agentsight@1.0.30` with provenance.
- This does not itself make npm a website-recommended install path; public install guidance continues to follow the authoritative product README/release documentation.

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and refresh 24–30 August after the configured finalization cutoff. A new 31 August–6 September next-morning family exists but is still inside its own three-day lag and again omits the boundary date in GSC. The current operator can inspect Drive but has no connected Apps Script execution/configuration surface.
