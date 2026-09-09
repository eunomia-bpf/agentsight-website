# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.31**, tag/release/product `master` commit `bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3`, published 5 September 2026.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication: `/blog/how-agentsight-background-monitoring-works/`, rendered PR `#117`, squash commit `b5149c564002664f1cfaf4a1e59fa270a511d8a8`, exact production completion `2026-09-08T16:51:41Z` (09:51:41 PDT).
- Exact production `Publish static site` run for that publication: `34253555793`, conclusion `success`.
- Current production `site/.source-sha` exactly equals `b5149c564002664f1cfaf4a1e59fa270a511d8a8`.
- The prior rolling deadline was `2026-09-08T16:53:06Z`; exact production completion was **1 minute 25 seconds early**. The new rolling deadline is `2026-09-10T16:51:41Z` (09:51:41 PDT).
- Current prepared publication: PR `#119`, `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`, refreshes the existing canonical TLS article in place for AgentSight v1.0.31. It is not a qualifying publication until exact-head CI, final review, squash merge, exact production publication, and public acceptance complete.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may appear as a CI/deployment check and is not analytics evidence.

## Current public content ownership boundaries

- `/blog/how-agentsight-background-monitoring-works/`: v1.0.31 background-monitor persistence semantics — two-second aggregate windows, 30-second bounded detail sampling, process/resource deltas, open-descriptor file targets, sampled IP:port network targets, PID/start-time identity, five-plus-five detail bounding, and the start-week filename/restart boundary. It explicitly does not treat monitor DBs as complete event traces or missing sampled rows as proof that an event never occurred.
- `/blog/how-agentsight-loads-agent-fleets-progressively/`: v1.0.31 fleet frontend latency/failure isolation — concurrent per-Node probes, incremental sample publication, Direct/relay per-Node behavior, generation guards, global refresh barrier, lazy process/analysis views, request timeouts, and the read/write retry boundary. It does not claim a general device/network latency benchmark or an auth/backend-policy change.
- `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`: existing canonical TLS-diagnostics owner being refreshed in PR `#119` for v1.0.31. It distinguishes attachment, plaintext-hook, protocol-parser, and non-TLS evidence-path failures across Node OpenSSL, stripped Bun/BoringSSL, rustls, Electron/Cursor, Docker/Kubernetes, browsers, and local MCP stdio. The page should remain a single `ContentPage` registry entry rather than a duplicate route override.
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
- `refreshFleet` fans out independent Node probes and writes each completed Node sample into `fleetSamples` before the outer `Promise.all` resolves; the outer barrier remains relevant for end-of-refresh bookkeeping and the all-unreachable fleet error.
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

- Rendered PR `#117` initially failed exact-head Website CI run `34253105838` because the new article referenced nonexistent `site.repo`. The exact TypeScript failure was fixed to the existing `site.repository`; the failing head was not merged.
- Final rendered head `ea34d3737b4f95161c6eb02cc7358daef54ff856` passed Website CI run `34253422609`, including the autonomous SEO scope guard, `npm ci`, `npm run verify`, and static-site artifact upload.
- Final base-to-head review found exactly four rendered-PR paths: the new article, Blog hub, sitemap, and 8 September daily record. No unrelated product, navigation, analytics, workflow, redirect, or repository-scope mutation was included.
- PR `#117` was squash-merged as `b5149c564002664f1cfaf4a1e59fa270a511d8a8` at `2026-09-08T16:50:56Z`.
- Exact `Publish static site` run `34253555793` succeeded from that commit; the publish job completed at `2026-09-08T16:51:41Z` (09:51:41 PDT), 1 minute 25 seconds before the rolling content deadline.
- Production `site/.source-sha` exactly matches `b5149c564002664f1cfaf4a1e59fa270a511d8a8`.
- Generated production article HTML contains the intended title, v1.0.31 description, canonical `https://agentsight.us/blog/how-agentsight-background-monitoring-works/`, and index/follow robots metadata.
- Production `sitemap.xml` contains the new route and records both it and `/blog/` with `2026-09-08T00:00:00.000Z` last-modified timestamps.
- Direct public homepage retrieval is current v1.0.31. Immediate public `/blog/` retrieval returned a crawler cache miss and exact-title search did not yet surface the new article. Exact workflow, production marker, generated HTML, and sitemap agree, so this is indexing/retrieval freshness rather than a production incident. No cache-forcing change was made.
- Previous fleet publication PR `#111` was squash-merged as `95b7ded7319c3c8273051190379f22f6dd4d00a5`; exact `Publish static site` run `34046834602` completed at `2026-09-06T16:53:06Z`, two seconds after its prior deadline. That historical 2-second miss remains recorded and is superseded by the new Sep10 rolling deadline.
- The 7 September factual repair PR `#114` corrected impossible review-date/current-version combinations on Product/Architecture/Pricing and was squash-merged as `d30e4f5bc5fbc9ffce3fb02b54d487a45b38b1c2`. Its exact publish run `34145435986` succeeded at `2026-09-07T16:56:17Z`; the repair did not reset the substantive content clock.
- PR `#119` had a patrol finding at head `159df59b11917cb9ce2546f604841a9cbad71000`: the TLS refresh used a dedicated renderer while the public-content registry still carried stale v1.0.3 page data for the same canonical slug, and this file had not been refreshed for the 9 September cycle. Corrective head `b11ec77683e9e5e289007b3a551be9c3a0932449` consolidated the TLS article back into one `ContentPage` registry record and removed the temporary route/hub substitution glue. Exact-head Website CI run `34399276680` / job `102626806807`, GitGuardian, and Cloudflare preview `https://989a3674.agentsight.pages.dev` succeeded; merge, exact production deployment, and live acceptance remain pending.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- `2026-08-17_to_2026-08-23` remains completely absent as of 8 September.
- `2026-08-24_to_2026-08-30` remains the next-morning 31 August family. No post-lag refresh is present even though the completed window is beyond the configured three-day finalization lag; its GSC date export still omits 30 August.
- The 24–30 GA4 landing export still lists 17 sessions: 11 homepage, 2 `(not set)`, and one each for `/architecture/`, `/blog/`, `/guides/agent-flamegraph/`, and `/guides/getting-started/`; listed key events are zero. Public-safe SHA-256: `2372c487f122aa3aabb72a1008408619d2036d06061542f92df898163afc1f3a`.
- The 24–30 GSC date export still contains 24–29 August but no 30 August row: 9 clicks / 180 impressions / 5.00% CTR / weighted average position approximately 20.62. Public-safe SHA-256: `70d69b7fd6a372d2ffec14cfb77dace8abfd63113e3027ddaeb499f6a6024f99`.
- The `2026-08-31_to_2026-09-06` family was generated 7 September around 09:05 PDT, the morning immediately after the covered window. As of 9 September, that window has reached the configured three-day finalization boundary without a post-lag refresh, so it remains directional rather than finalized KPI evidence.
- The newest GA4 organic landing file lists 12 sessions / 11 active users, all on `/`, engagement rate `58.33%`, and zero listed key events. Public-safe SHA-256: `45a3ab61f21fdfcce3d8ef6ba7c8ce301a353a2bb2a95fc0ef090069a322ffe9`.
- The newest GSC date file contains 31 August through 5 September but omits 6 September: 4 clicks / 260 impressions / 1.54% CTR / weighted average position approximately 11.68. Public-safe SHA-256: `dc3a35240a6b2d311d36a873bccf74e26d34e8dfcdac7866c573cab2d46bc67e`.
- Like-for-like only as six-day next-morning snapshots, impressions rose from 180 to 260 and apparent weighted position improved from approximately 20.62 to 11.68, while clicks fell from 9 to 4 and CTR from 5.00% to 1.54%. This remains directional and must not be reported as finalized week-over-week performance.
- The next-morning families confirm that the exporter continues to run, but the missing 17–23 family and stale/incomplete 24–30 family still block fresh finalized week-over-week analysis.
- The site's GA4 bootstrap records `page_location` as origin + pathname and `page_path` as pathname, so query strings are intentionally excluded from page-view identity.
- Generic public brand search remains ambiguous because unrelated products use the AgentSight name.

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

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and post-lag refresh 24–30 August and 31 August–6 September after the configured finalization cutoff. The 31 August–6 September next-morning family exists but has now reached its finalization boundary and still omits the boundary date in GSC. The current operator can inspect Drive but has no connected Apps Script execution/configuration surface.
