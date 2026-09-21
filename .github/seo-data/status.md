# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.31**, tag/release/product `master` commit `bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3`, published 5 September 2026.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication: major evergreen refresh of `/ebpf-ai-agent-monitoring/`, rendered PR `#135`, squash commit `c511bb053c44e2d2d5c697369a26aef4955a4668`, exact production completion **`2026-09-20T16:24:22Z` (09:24:22 PDT)**.
- Exact production `Publish static site` run for that publication: `35522571762`, conclusion `success`.
- Current production `site/.source-sha` exactly equals `c511bb053c44e2d2d5c697369a26aef4955a4668`.
- The current rolling substantive-publication deadline is **`2026-09-22T16:24:22Z` (09:24:22 PDT)**. The nominal next daily cycle begins before that deadline; if no earlier qualifying publication appears, the 22 September cycle must complete qualifying publication before the deadline rather than merely start work.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may appear as a CI/deployment check and is not analytics evidence.

## Current public content ownership boundaries

- `/ebpf-ai-agent-monitoring/`: v1.0.31 top-level mechanism/evidence-boundary owner. It distinguishes bounded Linux `record` capture, sampled background `monitor`, portable native-session workflows, and TLS/plaintext user-space probes; documents the two-second / 25-session / 30-second bounded-detail monitor contract, `/proc/<pid>/fd` file-target semantics, sampled IP:port endpoints, platform/privilege boundaries, and why an absent row does not prove no activity.
- `/guides/agent-flamegraph/`: v1.0.31 semantic-profiler method owner — session selection, five width projections, semantic stacks/mapping/filter behavior, tagging gates, privacy/output boundaries, and the separation between `agentpprof --view tokens` profile weight and `agentsight report token` source reconciliation.
- `/compare/opentelemetry/`: v1.0.31 architecture/decision owner for OpenTelemetry instrumentation, semantic conventions, OTLP/Collector pipelines, and AgentSight's local system/session boundary.
- `/blog/how-agentsight-normalizes-agent-session-data/`: v1.0.31 provider-native transcript normalization into shared `AgentSession` / `SessionEvents` IR while preserving provider/source identity and missing-field boundaries.
- `/blog/how-agentsight-exports-opentelemetry-genai-spans/`: v1.0.31 implementation-level OTel export semantics, including completed-call eligibility, trace-ID precedence, selected GenAI/HTTP fields, optional content, asynchronous delivery, and evidence that remains local.
- `/blog/how-agentsight-reconciles-token-usage/`: v1.0.31 token-report semantics and source reconciliation.
- `/blog/how-agentsight-background-monitoring-works/`: v1.0.31 detailed background-monitor persistence semantics; it remains the deeper owner for monitor windows, bounded detail persistence, and restart/week-boundary behavior.
- `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`: v1.0.31 runtime-specific TLS diagnostics owner; it remains the deeper owner for Node/OpenSSL, Bun/BoringSSL, rustls, Electron/helper-process, container/Kubernetes, browser, and MCP stdio boundaries.
- `/blog/when-agentsight-works-without-ebpf/`: practical decision owner for native-session workflows versus Linux eBPF/system-boundary capture.
- `/blog/system-boundary-observability/`: broad architecture and reader-decision owner across native telemetry, tool-protocol evidence, independent system execution, provider traffic, correlation, and the OpenTelemetry boundary.
- Other existing research pages remain pinned to the exact product snapshot they analyzed unless a deliberate evergreen refresh re-verifies claims against a newer authoritative product commit.

Avoid publishing keyword variants that do not add a new reader decision, mechanism, artifact, benchmark, or reproducible method. Prefer updating the existing canonical owner when the information need is already covered by a stable route.

## Current v1.0.31 implementation facts

### Native-session and Linux eBPF boundaries

- `top`, `bind`, `vis`, and `report` can use supported native agent-session data on Windows, macOS, or Linux without eBPF. `record` and eBPF-backed debug commands are Linux system-capture paths. `top` is hybrid: with suitable privilege it can add eBPF capture; without it, process snapshots and native session sources remain useful.
- With `record -- <command>`, probe setup is elevated while the monitored agent still runs as the normal user.
- Native session sources are generally stronger for provider-specific prompts, responses, model metadata, tool semantics, and token fields; eBPF/system capture is useful for independent process/file effects that the agent itself did not persist.

### Background monitor

- `agentsight monitor` samples on a two-second loop and inspects up to 25 matched live sessions per refresh in v1.0.31. Aggregate rows retain process/resource deltas and target counts; detailed process/file/network rows are bounded samples written when a sample crosses a 30-second bucket boundary.
- File targets come from current `/proc/<pid>/fd` observations with PID start-time checks; network targets are sampled IP:port endpoints from Linux process/socket state. These tables are sampled state, not a complete syscall/network event ledger.
- Positive evidence can establish that a target was observed during a sampled window. Absence cannot establish that an event never occurred outside the selected process family, interval, probe/runtime coverage, or parser path.
- The default weekly monitor DB filename is chosen when the monitor process starts; a continuously running v1.0.31 monitor can keep writing to its start-week filename across an ISO-week boundary until restart. Window timestamps are the authoritative time boundary.

### TLS and OTel boundaries

- TLS tracing is executable/runtime specific. Linux uprobes attach to a user-space object/symbol or offset; AgentSight has separate handling for supported OpenSSL/Node, stripped Bun/BoringSSL, rustls, Electron/helper-process, browser, and stdio cases. eBPF does not generically decrypt ciphertext in the kernel.
- Browser plaintext capture and local MCP stdio capture belong to `browsertrace` and `stdiocap`, not the TLS `sslsniff` path.
- `agentsight debug trace --otel` exports a selected projection of completed materialized LLM calls. Process/file/network/resource evidence, tool/workflow rows, and AgentSight provenance/confidence are not automatically converted into GenAI spans. Export POSTs are asynchronous, so local materialization does not itself prove Collector receipt.

## Production verification

- Rendered PR `#135` final head `8284da0836d4d86e850842544769f293b1662be2` passed exact-head Website CI run `35522494293`; scope guard, `npm ci`, `npm run verify`, artifact upload, GitGuardian, and Cloudflare Pages succeeded.
- PR `#135` was squash-merged as `c511bb053c44e2d2d5c697369a26aef4955a4668`. Exact `Publish static site` run `35522571762` succeeded from that commit; its publish job completed at `2026-09-20T16:24:22Z`. Production `site/.source-sha` matches exactly.
- Generated production `/ebpf-ai-agent-monitoring/` HTML has canonical `https://agentsight.us/ebpf-ai-agent-monitoring/`, `refreshed 20 September 2026 · AgentSight v1.0.31`, the observation-plane table, current v1.0.31 source pins, and the bounded monitor/absence semantics. Generated `sitemap.xml` reports `2026-09-20T00:00:00.000Z` as the route lastmod.
- The temporary post-publication retrieval-freshness qualification is **resolved**. A public crawler recheck on `2026-09-21` returned the refreshed v1.0.31 eBPF page directly, while the homepage also remained healthy on v1.0.31. No cache-forcing or deployment repair is required.
- Production generated `index.html` still includes the expected Google Analytics loader. Source `src/app/layout.tsx` continues to report `page_location` as origin + pathname and `page_path` as pathname, preserving the configured path-only policy without query strings.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- A new **preliminary** `2026-09-14_to_2026-09-20` export family appeared at approximately `2026-09-21T16:04Z`. It was generated the morning after the window and has not passed the site's configured three-day finalization lag. Its Search Console date export currently contains only 14–19 September and omits 20 September, so it must not be treated as finalized weekly KPI evidence.
- The new GA4 organic-landing export contains **17 sessions** across its rows and **0 key events**: `/` has 10 sessions, `(not set)` 5, `/integrations/opencode-openclaw/` 1, and `/use-cases/audit-mcp-servers-skills-plugins/` 1. Active-user values are retained at row level and are not summed here as a site-wide unique-user count.
- The six available Search Console dates in the new family contain **8 clicks / 383 impressions / 2.09% CTR / impression-weighted average position approximately 9.67**. For directional context only, the prior next-morning `2026-09-07_to_2026-09-13` snapshot contained 3 clicks / 375 impressions / 0.80% CTR / weighted position approximately 8.43 over its available 7–12 September dates. This is not a finalized week-over-week comparison.
- Directional page rows in the new family show the homepage at 6 clicks / 170 impressions / position approximately 5.64; `/blog/how-agentsight-discovers-local-agent-sessions/` at 0 clicks / 60 impressions / position 6.15; `/guides/agent-flamegraph/` at 0 clicks / 18 impressions / position 6.5; and `/use-cases/audit-mcp-servers-skills-plugins/` at 1 click / 26 impressions / position 45.5. These observations are useful for later finalized review but do not justify a rewrite from a next-morning snapshot.
- Public-safe SHA-256 checksums recorded for the two aggregate files used in today's summary: `2026-09-14_to_2026-09-20_ga4_organic_landing_pages.csv` = `187539f96588c4a78326889e9dab5767243eeb6da3fc32a3a2a9ea4dc1986fa1`; `2026-09-14_to_2026-09-20_gsc_dates.csv` = `4536263be68f196fa703bb232d37a1cf1fbacbcb39c79419cc53569539b4b1a7`.
- `2026-08-17_to_2026-08-23` remains completely absent.
- `2026-08-24_to_2026-08-30`, `2026-08-31_to_2026-09-06`, and `2026-09-07_to_2026-09-13` remain next-morning families without post-lag refreshes; their Search Console date exports still omit 30 August, 6 September, and 13 September respectively.
- Because those older completed windows were captured before their configured finalization cutoffs and have not been regenerated afterward, their movement remains directional and must not be reported as finalized week-over-week performance.
- The site's GA4 bootstrap records origin + pathname / pathname and excludes query strings from page-view identity. No analytics implementation defect is currently known.
- Daily public search still finds the canonical AgentSight site and current eBPF page, but the generic `AgentSight` brand result remains ambiguous because unrelated products use the same name. Search result order/count is directional only.

## Off-site visibility and package state

- Alibaba Cloud Linux 4 Agentic Edition documentation independently lists AgentSight as a runtime-layer/core component and describes eBPF-based AI-agent observability; this is downstream project evidence, not customer proof.
- A Mycelium Protocol / Mushroom article published 5 September 2026 independently links to `agentsight.us`, the GitHub repository, paper, and DOI. Its release-version wording is stale and is not used as product truth.
- No new verified independent external link was established by the bounded 21 September public scan. Search-only discoveries are not promoted to backlink evidence without fetching the external page.
- The former scoped-npm first-publication blocker remains resolved: `@eunomia-bpf/agentsight@1.0.30` was successfully published with provenance. Public install guidance continues to follow the authoritative product README/release documentation.

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator still needs to backfill 17–23 August and post-lag refresh 24–30 August, 31 August–6 September, and 7–13 September. The new 14–20 September next-morning family is present but is still inside its finalization lag, so it is not yet an additional missed-refresh blocker. The current operator can inspect Drive but has no connected Apps Script execution/configuration surface.
