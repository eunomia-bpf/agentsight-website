# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.31**, tag/release/product `master` commit `bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3`, published 5 September 2026.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication: major evergreen refresh of `/compare/opentelemetry/`, rendered PR `#129`, squash commit `89669d1e8a53b6f8ed9c8bde44eab7c31eb36817`, exact production completion `2026-09-16T16:26:15Z` (09:26:15 PDT).
- Exact production `Publish static site` run for that publication: `35121801735`, conclusion `success`.
- Current production `site/.source-sha` exactly equals `89669d1e8a53b6f8ed9c8bde44eab7c31eb36817`.
- Metadata-only closeout PR `#130` was squash-merged as website `main` commit `b7e712012004429ad28ccf39c9e814b139b50b10`; it did not alter rendered output or production source identity.
- The current rolling substantive-publication deadline is `2026-09-18T16:26:15Z` (09:26:15 PDT). The 17 September metadata-only cycle does not reset that clock.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may appear as a CI/deployment check and is not analytics evidence.

## Current public content ownership boundaries

- `/compare/opentelemetry/`: v1.0.31 broad architecture/decision owner for how OpenTelemetry instrumentation, semantic conventions, OTLP/Collector pipelines, and AgentSight's local system/session boundary fit together. It treats AgentSight GenAI export as a selected projection of completed materialized LLM calls, not a lossless conversion of process/file/network/resource/tool/provenance evidence, and explicitly separates local materialization from Collector receipt.
- `/blog/how-agentsight-normalizes-agent-session-data/`: v1.0.31 native-session normalization owner — provider-specific transcript parsing into the shared `AgentSession` / `SessionEvents` IR while preserving provider/source identity, prompt indexes, tool/path access semantics, response identity, token components, plans, and explicit missing-field boundaries. It does not claim native transcripts prove independent process, filesystem, network, billing, or complete-causality evidence.
- `/blog/how-agentsight-exports-opentelemetry-genai-spans/`: v1.0.31 implementation-level OTel export semantics — completed materialized LLM-call eligibility, trace-ID precedence, emitted GenAI/HTTP attributes, endpoint precedence, content opt-in, asynchronous delivery/shutdown loss, and the evidence that stays local. It explicitly distinguishes the `debug trace` OTel flags from the normal `record` CLI and does not claim process/file/network/resource/provenance or tool/workflow rows are exported by this sink.
- `/blog/how-agentsight-reconciles-token-usage/`: v1.0.31 token-report evidence semantics — DB versus native-session inputs, keyed source precedence, separate Gemini aggregate reconciliation, Codex cumulative-session versus response fallback paths, grouping, and missing-usage interpretation. It explicitly does not claim a universal network/native join or turn observed tokens into billing cost.
- `/blog/how-agentsight-background-monitoring-works/`: v1.0.31 background-monitor persistence semantics — two-second aggregate windows, 30-second bounded detail sampling, process/resource deltas, open-descriptor file targets, sampled IP:port network targets, PID/start-time identity, five-plus-five detail bounding, and the start-week filename/restart boundary. It explicitly does not treat monitor DBs as complete event traces or missing sampled rows as proof that an event never occurred.
- `/blog/how-agentsight-loads-agent-fleets-progressively/`: v1.0.31 fleet frontend latency/failure isolation — concurrent per-Node probes, incremental sample publication, Direct/relay per-Node behavior, generation guards, global refresh barrier, lazy process/analysis views, request timeouts, and the read/write retry boundary. It does not claim a general device/network latency benchmark or an auth/backend-policy change.
- `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`: v1.0.31 TLS-diagnostics owner — attachment, plaintext-hook, protocol-parser, and non-TLS evidence-path failures across Node OpenSSL, stripped Bun/BoringSSL, rustls, Electron/Cursor, Docker/Kubernetes, browsers, and local MCP stdio. The page is a single `ContentPage` registry entry rather than a duplicate route override.
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

## Current v1.0.31 implementation facts

### Native-session normalization

- `agent-session` is a reusable local intermediate representation for supported native coding-agent session data. `AgentSession` preserves provider/source identity, source-derived session or conversation IDs when present, timing/model metadata, aggregate usage, working directory, prompts, tool events, responses, token components, and plans instead of flattening providers into display-only strings.
- Prompt, tool, and response records keep prompt indexes where the source supplies enough evidence for grouping. `ToolPath` preserves read/write/create/delete/rename semantics and can preserve a rename source; missing native fields remain missing rather than being inferred.
- The normalization layer does not manufacture host-level file/process/network effects, billing cost, complete provenance, or conversation IDs that the provider did not establish.

### OpenTelemetry GenAI export

- `agentsight debug trace --otel` attaches `OtelExporter` to the shared materialized-call pipeline. Only completed materialized LLM calls with an end timestamp are eligible; request/response correlation and token extraction happen upstream of the sink.
- Trace identity prefers an explicit recognized conversation/thread identifier, then AgentSight session identity, then a recording-scoped fallback. Generic response IDs are not promoted to conversation IDs, and parent/child model-call span trees are not inferred.
- The sink emits the supported GenAI request/response/provider/usage/finish-reason fields plus server address and HTTP response status when available. Prompt/completion content is opt-in through `--otel-capture-content`.
- Export POSTs are detached asynchronous tasks. Local materialization does not prove Collector receipt, and process/file/network/resource rows, tool/workflow rows, and AgentSight provenance/confidence are not automatically mapped by this GenAI sink.

### Background monitor

- `agentsight monitor` samples on a two-second loop and inspects up to 25 matched live sessions per refresh in v1.0.31. Aggregate `monitor_windows` rows retain process/resource deltas and target counts; detailed process/file/network rows are bounded samples written when a sample crosses a 30-second bucket boundary.
- File targets come from current `/proc/<pid>/fd` observations with PID start-time checks; network targets are sampled IP:port endpoints from Linux `/proc` TCP tables. Absence from the detail tables is not proof that an event never occurred between samples.
- Detail tables use a five-plus-five edge bound when candidate sets are large. The default weekly monitor DB filename is chosen when the monitor process starts; a continuously running v1.0.31 monitor can therefore keep writing to its start-week filename across an ISO-week boundary until restart. Window timestamps are the authoritative time boundary.

### Fleet/frontend and TLS boundaries

- Product PR `#209` is the primary v1.0.31 fleet change. Fleet refresh fans out per-Node probes and publishes completed Node samples incrementally while retaining an outer refresh barrier; Direct versus Controller-relay reachability is resolved per Node. Generation counters prevent stale organization/activation results from overwriting newer state.
- Browser requests use a 12-second default timeout and session requests use a 30-second timeout in the inspected client. Ambiguous HTTPS write failures are not automatically replayed; fallback after such a failure is limited to safe read methods (`GET`/`HEAD`).
- TLS tracing remains executable/runtime specific. Node is treated as embedded OpenSSL; supported stripped Bun/BoringSSL builds use validated binary patterns; rustls has a separate plaintext-offset path; Electron/IDE agents can fail at helper-process or protocol-parser boundaries even when transport capture works. Docker and `k8s://` forms resolve the host executable rather than introducing a separate tracing primitive.
- Browser plaintext capture and local MCP stdio capture belong to `browsertrace` and `stdiocap`, not the TLS `sslsniff` path. Plaintext capture can expose prompts, responses, headers, tool payloads, paths, and other sensitive development telemetry.

## Production verification

- Rendered PR `#129` final head `28eda43530efb66730ea1d7868e1e42aedef5106` passed exact-head Website CI run `35000467922`, GitGuardian, and Cloudflare Pages before squash merge.
- PR `#129` was squash-merged as `89669d1e8a53b6f8ed9c8bde44eab7c31eb36817`. Exact `Publish static site` run `35121801735` succeeded from that commit; its publish job completed at `2026-09-16T16:26:15Z`. Production `site/.source-sha` still matches exactly.
- Generated production `/compare/opentelemetry/` HTML contains the refreshed v1.0.31 decision boundary, canonical `https://agentsight.us/compare/opentelemetry/`, index/follow metadata, GA4 bootstrap, maintained OpenTelemetry/AgentSight primary sources, and intended related links.
- The temporary 16 September direct-retrieval freshness qualification is cleared. A 17 September public crawler recheck now returns the refreshed v1.0.31 comparison body, including the narrow completed-materialized-LLM-call OTLP projection and the explicit local process/file/network/resource/tool/provenance boundary. No cache-forcing repair is needed.
- The homepage is publicly retrievable on v1.0.31 and production source identity remains the rendered `#129` squash commit after metadata-only closeout `#130`.
- The current substantive-publication deadline remains `2026-09-18T16:26:15Z` (09:26:15 PDT).

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- As of 17 September, direct folder search finds no artifact modified after `2026-09-14T17:00:00Z`. No new weekly family or post-lag regeneration has appeared since the prior cycle.
- `2026-09-07_to_2026-09-13` remains the next-morning 14 September snapshot rather than finalized KPI evidence. Its GA4 landing rows list **6 sessions / 4 active users / 0 key events**: 5 sessions / 4 active users on `/`, plus one blank landing row.
- Its GSC date rows still cover only 7–12 September and omit 13 September: **3 clicks / 375 impressions / 0.80% CTR / weighted average position approximately 8.43**.
- `2026-08-17_to_2026-08-23` remains completely absent.
- `2026-08-24_to_2026-08-30` remains the next-morning 31 August family without a post-lag refresh; its GSC date export still omits 30 August. The existing directional snapshot records 17 GA4 sessions and 9 GSC clicks / 180 impressions / 5.00% CTR / weighted position approximately 20.62.
- `2026-08-31_to_2026-09-06` remains the next-morning 7 September family without a post-lag refresh; its GSC date export still omits 6 September. The existing directional snapshot records 12 GA4 sessions / 11 active users and 4 GSC clicks / 260 impressions / 1.54% CTR / weighted position approximately 11.68.
- Because the comparable completed windows were generated before their configured finalization cutoff and still omit boundary dates, their movement remains directional and must not be reported as finalized week-over-week performance.
- The site's GA4 bootstrap records `page_location` as origin + pathname and `page_path` as pathname, so query strings are intentionally excluded from page-view identity. No analytics implementation defect is currently known.
- Generic public brand search remains ambiguous because unrelated products use the AgentSight name. Public search continues to find the canonical homepage and existing technical pages; search-result counts/order are treated as directional only.

## Off-site visibility

- Alibaba Cloud Linux 4 Agentic Edition documentation lists AgentSight as a runtime-layer/core component and describes eBPF-based AI-agent observability. Alibaba's `alibaba/anolisa` `NOTICE` provides source provenance to `eunomia-bpf/agentsight`; this is an independent downstream project reference, not customer proof or a verified backlink to `agentsight.us`.
- A Mycelium Protocol / Mushroom article published 5 September 2026 independently links directly to `https://agentsight.us`, the AgentSight GitHub repository, paper, and DOI. It remains a verified external website reference, but its v1.0.30 “latest release” statement is stale and is not used as product truth.

## npm publication state

- The former scoped-npm first-publication blocker remains resolved. v1.0.30 successfully published `@eunomia-bpf/agentsight@1.0.30` with provenance.
- This does not itself make npm a website-recommended install path; public install guidance continues to follow the authoritative product README and release documentation.

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and post-lag refresh 24–30 August, 31 August–6 September, and 7–13 September after the configured finalization cutoff. The three existing completed-window snapshots remain their next-morning versions and their GSC date files omit the boundary date. The current operator can inspect Drive but has no connected Apps Script execution/configuration surface.
