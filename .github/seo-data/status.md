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
- Metadata-only closeout lane for this publication: PR `#130`, branch `seo/agentsight-2026-09-16-closeout`; it is restricted to SEO operating records and does not alter rendered site source or scheduling state.
- The prior rolling deadline was `2026-09-16T16:35:21Z` (09:35:21 PDT); exact production completion was **9 minutes 6 seconds early**. The new rolling deadline is `2026-09-18T16:26:15Z` (09:26:15 PDT).
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

## v1.0.31 native-session normalization facts

- `agent-session` is a reusable local intermediate representation for supported native coding-agent session data; its documented responsibilities do not include OTLP export, UI/report rendering, database schema, or eBPF capture.
- `AgentSession` keeps agent/provider identity, source path, source-derived session/conversation identifiers, timing/model metadata, aggregate usage, working directory, and normalized event collections instead of flattening all providers into display strings.
- Prompts, tool events, and model responses keep prompt indexes so consumers can group source-recorded interaction events around a user turn without claiming complete causal tracing.
- `ToolPath` retains access semantics such as read/write/create/delete/rename and can preserve a rename source; a path mention is therefore not silently promoted into a read or write.
- `LlmResponse.source_id` preserves source-native completion identity for merging split records; response phase and decomposed token fields remain present when the provider supplies them.
- Missing native fields remain missing evidence. The normalization layer does not manufacture conversation IDs, host-level file/process/network effects, billing cost, or complete provenance that the source transcript did not establish.
- `agentpprof` reuses the shared prompt/tool/response types, keeping provider parsing semantics in one library boundary rather than reproducing them in each consumer.

## v1.0.31 OpenTelemetry export facts

- `agentsight debug trace --otel` attaches `OtelExporter` to the shared materialized-call pipeline; request/response correlation and token extraction occur upstream of the sink.
- Only completed materialized LLM calls with an end timestamp are eligible. A completed SSE body that cannot be reparsed can still produce request attributes and HTTP status without parsed response/token fields.
- Trace identity prefers an explicit recognized conversation/thread identifier, then AgentSight session identity, then a recording-scoped fallback. Generic response IDs are not promoted to conversation IDs, and parent/child model-call span trees are not inferred.
- The sink emits the GenAI operation/provider/conversation/request/response/usage/finish-reason fields supported by the row plus `server.address` and HTTP response status when available; HTTP status >=400 marks the span ERROR.
- Prompt/completion material is opt-in through `--otel-capture-content`; it is not exported by default.
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` is used as a signal-specific URL. Otherwise the CLI/base endpoint, `OTEL_EXPORTER_OTLP_ENDPOINT`, or localhost:4318 is treated as a base and `/v1/traces` is appended. The current sink sends OTLP/HTTP JSON.
- Export POSTs are detached asynchronous tasks. Failures are warnings, and `run_trace` does not retain/await those tasks at shutdown, so local materialization does not prove remote collector acceptance.
- The public v1.0.31 OTel switches live on `debug trace`; normal `agentsight record` does not expose them even though both paths share trace infrastructure.
- Process/file/network/resource rows, AgentSight provenance/confidence, and tool/workflow rows are not automatically mapped by this OTel GenAI sink.

## v1.0.31 background-monitor facts

- `agentsight monitor` uses a two-second sampling loop and scans up to 25 matched live sessions per refresh in the inspected v1.0.31 implementation.
- Each sampled session persists an aggregate `monitor_windows` row containing session/process identity, process count, CPU delta, RSS, read/write byte deltas, and counts of distinct visible file/network targets.
- Detailed process/file/network sample rows are written only when a sample crosses a 30-second bucket boundary; they are not an exhaustive event log for the entire interval.
- File targets come from current `/proc/<pid>/fd` descriptor observations, with PID start-time checks to reduce PID-reuse attribution errors. Absence from a monitor DB does not prove that a short-lived file operation did not happen between samples.
- Network targets are sampled IP:port endpoints resolved from Linux `/proc` TCP tables. They are not DNS names, HTTP routes, model payloads, or security verdicts.
- Detail tables use a five-plus-five edge bound when candidate sets are large; aggregate totals remain in the window row. Detail row counts must not be interpreted as the complete process/target count.
- Session identity includes root PID plus root process start-time ticks rather than relying on numeric PID alone.
- The default monitor DB filename is selected from the local ISO week when the monitor process starts and the store is opened once before the loop. In v1.0.31, a continuously running process can therefore continue writing to its start-week filename across a week boundary until restart. Window timestamps are the authoritative boundary evidence.
- Product installation documentation explicitly separates `monitor` from `bind`: monitor writes local sampled history; bind serves the authenticated Node API / optional Controller relay.

## v1.0.31 fleet/frontend facts

- Product PR `#209` is the primary release change behind the fleet-loading article.
- `refreshFleet` fans out independent per-Node probes and writes each completed Node sample into `fleetSamples` before the outer `Promise.all` resolves; the outer barrier remains relevant for end-of-refresh bookkeeping and the all-unreachable fleet error.
- Direct and Controller-relay availability are resolved per Node rather than as one fleet-wide transport result.
- Directory, fleet, and active-Node generation counters prevent late results from stale organization/activation work from overwriting newer frontend state.
- Session conversation/process/analysis are separate views; process and analysis components are dynamically imported, and analysis event-display work is tab-scoped.
- Browser requests use a 12-second default timeout and session requests use a 30-second timeout in the inspected v1.0.31 client.
- Ambiguous HTTPS write failures are not automatically replayed; fallback after such a failure is limited to safe read methods (`GET`/`HEAD`).
- Product PR `#209` explicitly leaves authentication, capability, organization, and backend policy unchanged. Its build/browser validation is not a general physical-device latency benchmark.

## v1.0.31 TLS tracing facts

- AgentSight v1.0.31 `record` resolves commands through `PATH`, symlinks, and shebang interpreters so wrapper scripts can lead to the actual executable that owns TLS.
- Node-based agents are treated as embedded-OpenSSL cases; `record -c node` has a Node-specific discovery path, while `--binary-path` remains the override for selecting a specific executable.
- Claude Code's Bun/BoringSSL path remains version-sensitive: `sslsniff` tries symbols first, then validates stripped-binary byte patterns and known relative placement for supported Bun 1.3.x builds.
- rustls detection is separate from OpenSSL/BoringSSL tracing. The current `codex_offsets.h` path identifies supported rustls plaintext instruction sequences rather than looking for `SSL_read` or `SSL_write`.
- Electron/IDE agents can fail at platform, helper-process, or protocol-parser boundaries even when transport capture works. Cursor remains better supported through native local session files for many questions.
- Docker and `k8s://` forms are executable resolvers that find the host process owning TLS; they do not create a separate tracing primitive.
- Browser plaintext capture and local MCP stdio capture belong to `browsertrace` and `stdiocap` respectively, not to the TLS `sslsniff` path.
- Plaintext capture can expose prompts, responses, headers, tool payloads, and other sensitive development telemetry. Negative claims must stay scoped to the exact binary, filter, hook, and parser that were verified.

## Production verification

- Rendered PR `#129` final head `28eda43530efb66730ea1d7868e1e42aedef5106` passed exact-head Website CI run `35000467922`, GitGuardian, and Cloudflare Pages. The final source points GenAI semantic-convention readers to the maintained `open-telemetry/semantic-conventions-genai` documentation, and no unresolved review thread remained.
- PR `#129` was squash-merged as `89669d1e8a53b6f8ed9c8bde44eab7c31eb36817`. Exact `Publish static site` run `35121801735` succeeded from that commit; its publish job completed at `2026-09-16T16:26:15Z`. Production `site/.source-sha` matches exactly.
- Generated production `/compare/opentelemetry/` HTML contains the refreshed v1.0.31 decision boundary, canonical `https://agentsight.us/compare/opentelemetry/`, index/follow metadata, GA4 bootstrap, maintained OpenTelemetry/AgentSight primary sources, and intended related links.
- Public verification at `2026-09-16T16:36:41Z` (09:36:41 PDT) still returned the pre-refresh v1.0.3 comparison body while the exact production branch already contained the new HTML; the homepage remained retrievable on v1.0.31. Keep this as a CDN/retrieval freshness qualification and recheck the canonical page on the next cycle; there is no evidence of a build/publication failure.
- Metadata-only closeout PR `#130` records the 16 September production/public-verification evidence and Google-exporter blocker state. Its scope is operating metadata only and is intended to leave rendered output and production identity unchanged.
- The 16 September publication satisfied the previous 48-hour deadline and resets the rolling deadline to `2026-09-18T16:26:15Z` (09:26:15 PDT).
- Metadata-only closeout PR `#128` is the closeout lane for the 14 September publication. Its diff is limited to the 14 September daily record and this status file and is intended to leave rendered output and production identity unchanged.
- Rendered PR `#127` final head `26afa398df27a5abed62cbb7b3afd7cb54974fdc` passed exact-head Website CI run `34869253587`, GitGuardian, and Cloudflare Pages. Copilot's three suppressed observations were addressed in the final source and no unresolved review thread remained.
- PR `#127` was squash-merged as `d7b00655ac5cfe21bc8251d0f2492bde8e935bd1`. Exact `Publish static site` run `34869461043` succeeded from that commit; its publish job completed at `2026-09-14T16:35:21Z`. Production `site/.source-sha` matched that commit before the 16 September publication.
- Generated production article HTML contains the intended title, v1.0.31 description, index/follow robots metadata, and canonical `https://agentsight.us/blog/how-agentsight-normalizes-agent-session-data/`. A public re-verification ending at `2026-09-14T16:50:06Z` (09:50:06 PDT) successfully retrieved the article and the Blog hub with the new card present.
- The same re-verification ending at `2026-09-14T16:50:06Z` retrieved representative unaffected route `/blog/how-agentsight-discovers-local-agent-sessions/`. Exact-title search had not yet surfaced the new route immediately after publication; direct retrieval succeeded, so this is index freshness rather than a deployment incident.
- Metadata-only closeout PR `#126` records the post-merge evidence for the 13 September publication. It changes only the daily record and this status file; no rendered site or scheduling state is changed.
- Rendered PR `#125` final head `c78624024a78deb9c3649965247cd03ea928f0b1` passed exact-head Website CI `verify` run `34768863518`, GitGuardian, and Cloudflare Pages. Its two inline review threads are resolved; the final source also addresses all four suppressed Copilot observations by removing the stale comparison continuation link, bounding the `debug trace` recipe, completing the emitted-attribute inventory, and documenting the SSE parseability caveat.
- PR `#125` was squash-merged as `7fb8f4ad307e9777318ed85275cc72dd9fde5b5a`. Exact `Publish static site` run `34769052166` succeeded from that commit; its publish job completed at `2026-09-13T16:36:21Z`. Production `site/.source-sha` matched that commit before the 14 September publication.
- Rendered PR `#122` initially received three Copilot findings at head `bdef093da9b6d5dc7d97cbaacce62322e5009fe8`: the source-priority table omitted the final fallback, Codex cumulative-session and latest-response token paths were conflated, and the `state_5.sqlite` implementation source was not linked. The final head `39a98d6f32d99c12a9d79b2d578683186ee8a6f6` corrected those findings and explicitly scoped precedence to rows sharing a selection key.
- Final head `39a98d6f32d99c12a9d79b2d578683186ee8a6f6` passed exact-head Website CI run `34622703853`, GitGuardian, and Cloudflare preview `https://986e16aa.agentsight.pages.dev`. Independent local build, TypeScript, content, and static SEO snapshot validation also passed; the snapshot contained 49 pages and 49 sitemap URLs.
- PR `#122` was squash-merged as `1d20018c989680c28f8b931a29fff229fd5108eb`. Exact `Publish static site` run `34704301599` succeeded and completed at `2026-09-12T16:08:44Z`; production `site/.source-sha` matched that squash commit before the 13 September publication.
- Live verification after PR `#122` returned HTTP 200 for the token article, Blog hub, sitemap, homepage, and prior TLS article. The article exposed one matching canonical URL, GA4 tag `G-VVRNSCMWBX`, `TechArticle` JSON-LD, and the intended `state_5.sqlite` evidence boundary; the Blog hub linked it, the sitemap contained it with 11 September freshness, and the homepage remained on v1.0.31.
- PR `#119` had a patrol finding at head `159df59b11917cb9ce2546f604841a9cbad71000`: the TLS refresh used a dedicated renderer while the public-content registry still carried stale v1.0.3 page data for the same canonical slug. Final head `d3a0bc924a86786ca1933a41245c903549c1baf5` consolidated the TLS article back into one `ContentPage` registry record. Exact-head Website CI run `34400101439`, GitGuardian, and Cloudflare preview succeeded; PR `#119` was squash-merged as `a2acfac71e75e7ee41539c5acd583c1605d1a0bd`, exact publish run `34400475435` succeeded, and a 10 September crawler recheck cleared its temporary direct-retrieval qualification.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- The `2026-09-07_to_2026-09-13` family appeared on 14 September around 09:05 PDT as a next-morning snapshot. As of 16 September it has reached the configured three-day finalization boundary without regeneration; no file in the configured folder was modified after 15 September, so the family remains directional rather than finalized.
- Its GA4 landing rows list 6 sessions / 4 active users / 0 key events: 5 sessions / 4 active users on `/`, plus one blank landing row.
- Its GSC date rows still cover only 7–12 September and omit 13 September: 3 clicks / 375 impressions / 0.80% CTR / weighted average position approximately 8.43. The homepage contributes 3 clicks / 169 impressions; among non-home pages, the existing local-session discovery article has 30 impressions at average position approximately 6.87, `/blog/` has 49 impressions, the Cursor integration has 17, and the Agent Flamegraph guide has 15.
- `2026-08-17_to_2026-08-23` remains completely absent as of 16 September.
- `2026-08-24_to_2026-08-30` remains the next-morning 31 August family. No post-lag refresh is present even though the completed window is beyond the configured three-day finalization lag; its GSC date export still omits 30 August.
- The 24–30 GA4 landing export still lists 17 sessions: 11 homepage, 2 `(not set)`, and one each for `/architecture/`, `/blog/`, `/guides/agent-flamegraph/`, and `/guides/getting-started/`; listed key events are zero. Public-safe SHA-256: `2372c487f122aa3aabb72a1008408619d2036d06061542f92df898163afc1f3a`.
- The 24–30 GSC date export still contains 24–29 August but no 30 August row: 9 clicks / 180 impressions / 5.00% CTR / weighted average position approximately 20.62. Public-safe SHA-256: `70d69b7fd6a372d2ffec14cfb77dace8abfd63113e3027ddaeb499f6a6024f99`.
- The `2026-08-31_to_2026-09-06` family was generated 7 September around 09:05 PDT, the morning immediately after the covered window. That window is beyond the configured three-day finalization boundary without a post-lag refresh, so it remains directional rather than finalized KPI evidence.
- The 31 August–6 September GA4 organic landing file lists 12 sessions / 11 active users, all on `/`, engagement rate `58.33%`, and zero listed key events. Public-safe SHA-256: `45a3ab61f21fdfcce3d8ef6ba7c8ce301a353a2bb2a95fc0ef090069a322ffe9`.
- The 31 August–6 September GSC date file contains 31 August through 5 September but omits 6 September: 4 clicks / 260 impressions / 1.54% CTR / weighted average position approximately 11.68. Public-safe SHA-256: `dc3a35240a6b2d311d36a873bccf74e26d34e8dfcdac7866c573cab2d46bc67e`.
- Like-for-like only as six-day next-morning snapshots, impressions rose from 180 to 260 and apparent weighted position improved from approximately 20.62 to 11.68, while clicks fell from 9 to 4 and CTR from 5.00% to 1.54%. This remains directional and must not be reported as finalized week-over-week performance.
- Direct folder enumeration on 16 September still finds no 17–23 August family and no post-lag replacement for the three completed-window families that now require one. The exporter continues to lack the post-lag refresh/backfill path needed for fresh finalized weekly analysis.
- The site's GA4 bootstrap records `page_location` as origin + pathname and `page_path` as pathname, so query strings are intentionally excluded from page-view identity.
- Generic public brand search remains ambiguous because unrelated products use the AgentSight name. Public search still returns the canonical AgentSight homepage and existing technical pages; crawler retrieval of the refreshed OpenTelemetry comparison at `2026-09-16T16:36:41Z` still lagged the exact production artifact.

## Off-site visibility

- Alibaba Cloud Linux 4 Agentic Edition documentation lists AgentSight as a runtime-layer/core component and describes eBPF-based AI-agent observability.
- Alibaba's `alibaba/anolisa` repository provides primary-source provenance: its `NOTICE` states that `src/agentsight/` is based on `https://github.com/eunomia-bpf/agentsight` and credits eunomia-bpf contributors.
- This is an independent downstream open-source/product reference, not a verified backlink to `agentsight.us`, customer proof, partnership claim, or endorsement.
- A Mycelium Protocol / Mushroom article published 5 September 2026 independently links directly to `https://agentsight.us` and also links the AgentSight GitHub repository, paper, and DOI. This is a verified external website reference, not merely a search-result mention.
- The Mycelium article still calls v1.0.30 the latest release while the authoritative release is v1.0.31, so it is useful as external visibility evidence but not as an authoritative current product description.

## npm publication state

- The former scoped-npm first-publication blocker remains resolved. v1.0.30 release commit `934f441eff8ca210807333633f47b2efcb8cd020` successfully published `@eunomia-bpf/agentsight@1.0.30` with provenance.
- This does not itself make npm a website-recommended install path; public install guidance continues to follow the authoritative product README/release documentation.

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and post-lag refresh 24–30 August, 31 August–6 September, and 7–13 September after the configured finalization cutoff. The three existing completed-window snapshots remain their next-morning versions and their GSC date files omit the boundary date. The current operator can inspect Drive but has no connected Apps Script execution/configuration surface.
