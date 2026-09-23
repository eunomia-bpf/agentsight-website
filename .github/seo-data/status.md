# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.31**, tag/release/product `master` commit `bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3`, published 5 September 2026.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` still equals the same commit.
- Latest qualifying substantive publication: major evergreen refresh of `/blog/how-agentsight-discovers-local-agent-sessions/`, rendered PR `#139`, squash commit `673c7e4493acee6d83648b98ba1d2ea3e0fa6ed1`, exact production completion **`2026-09-22T16:18:49Z` (09:18:49 PDT)**.
- Exact production `Publish static site` run for that qualifying publication: `35753194697`, conclusion `success`.
- Current production `site/.source-sha` is **`eaed59a92b67a0ba41a6f8fe7ef517d9b814ad87`** after dependency-only main merges `#144`, `#143`, and `#141` published successfully on 23 September. Those dependency publications do not qualify as substantive search-facing content and do not reset the content clock.
- The current rolling substantive-publication deadline remains **`2026-09-24T16:18:49Z` (09:18:49 PDT)**. The next daily cycle begins before that deadline; if no earlier qualifying publication appears, the 24 September cycle must complete qualifying publication before the deadline rather than merely start work.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy. Cloudflare Pages may appear as a CI/deployment check and is not analytics evidence.

## Current public content ownership boundaries

- `/ebpf-ai-agent-monitoring/`: v1.0.31 top-level mechanism/evidence-boundary owner. It distinguishes bounded Linux `record` capture, sampled background `monitor`, portable native-session workflows, and TLS/plaintext user-space probes; documents the two-second / 25-session / 30-second bounded-detail monitor contract, `/proc/<pid>/fd` file-target semantics, sampled IP:port endpoints, platform/privilege boundaries, and why an absent row does not prove no activity.
- `/guides/agent-flamegraph/`: v1.0.31 semantic-profiler method owner — session selection, five width projections, semantic stacks/mapping/filter behavior, tagging gates, privacy/output boundaries, and the separation between `agentpprof --view tokens` profile weight and `agentsight report token` source reconciliation.
- `/compare/opentelemetry/`: v1.0.31 architecture/decision owner for OpenTelemetry instrumentation, semantic conventions, OTLP/Collector pipelines, and AgentSight's local system/session boundary.
- `/blog/how-agentsight-discovers-local-agent-sessions/`: v1.0.31 provider-native discovery/index owner for Claude, Codex, Gemini, and Cursor. It covers provider roots and format ownership, bounded recent-list discovery versus direct ID lookup, Codex read-only `state_5.sqlite` indexing, Cursor read-only `state.vscdb` enrichment and delegated-subagent token rollup, 64 KiB ID-header resolution, Codex 1 MiB tail-summary caching, bounded hydration, missing-session diagnostics, and the distinction between provider state and independent system evidence.
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

### Native-session discovery and hydration

- Native-session discovery uses provider-owned local state rather than a universal coding-agent API: Claude Code under `~/.claude/projects`, Codex under absolute `$CODEX_HOME/sessions` or `~/.codex/sessions`, Gemini CLI under `~/.gemini/tmp`, and Cursor under `~/.cursor/projects`.
- The ordinary native-session list path is bounded to at most 25 rows. Direct detail lookup uses a separate ID-to-path index, so an older known session is not made unreachable merely because it falls outside the recent list.
- Codex can use read-only `state_5.sqlite` as its recent-thread index. Summary enrichment reads at most the final 1 MiB of a rollout and caches the result by path, length, and modification time in a cache bounded to 64 entries. Codex/Gemini ID indexing uses at most the first 64 KiB when provider-native IDs must be extracted from file content.
- Cursor transcript discovery can include sibling `subagents/*.jsonl` freshness and deduplicates same-stem candidates, preferring a non-`empty-window` path and otherwise the newer candidate. A separate read-only Cursor `state.vscdb` enrichment path can add composer timestamps, model/workspace metadata, parent bubble token counts, and token counts from discovered delegated subagent IDs.
- Hydrated native detail is bounded: at most 1,000 prompts, 2,000 LLM responses, and 2,000 tool events; prompt and response text each have 2 MiB budgets, tool command text has 1 MiB, per-tool process chains are capped at 16, and path groups/paths/domains at 32 each. Returned detail is therefore a bounded recent representation, not proof that every byte of an arbitrarily large provider transcript was returned.
- The v1.0.31 session parser/native-analysis implementation above is unchanged from the v1.0.30 source snapshot previously cited by the canonical discovery article. The 22 September refresh re-verifies it against the current release and documents current behavior more completely rather than claiming a new implementation change.

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

- Rendered PR `#139` final head `7a88a262fc2f58be5505c3c3f0ff587b7c5bb103` passed exact-head Website CI run `35752584830`; scope guard, `npm ci`, `npm run verify`, and static artifact upload all succeeded. GitGuardian succeeded with no detected secrets and Cloudflare Pages succeeded on the exact final head. Copilot's optional reviewer reported its quota limit and produced no correctness finding or inline thread; the required from-scratch operator review remained clean.
- The final static-site artifact for #139 had digest `sha256:fab76b55aa9b27ded62270bb9d4e172b07182f4bff4e8870b9712407b3e47695`. Generated output contained the single canonical discovery route with `refreshed 22 September 2026 · AgentSight v1.0.31`, the Cursor state-database/delegated-token material, the refreshed Blog card, and `2026-09-22` sitemap freshness.
- PR `#139` was squash-merged as `673c7e4493acee6d83648b98ba1d2ea3e0fa6ed1`. Exact `Publish static site` run `35753194697` succeeded from that commit; its publish job completed at `2026-09-22T16:18:49Z`. At that publication point, production `site/.source-sha` matched `673c7e4493acee6d83648b98ba1d2ea3e0fa6ed1`, and exact-main Website CI run `35753194874` also succeeded.
- The publication finished 5 minutes 33 seconds before the prior rolling deadline and reset the content clock to `2026-09-24T16:18:49Z` (09:18:49 PDT).
- The 23 September dependency-only main sequence subsequently advanced the production source identity to `eaed59a92b67a0ba41a6f8fe7ef517d9b814ad87`. Exact current-head Website CI run `35833230773` and `Publish static site` run `35833230492` both succeeded; the publish job completed at `2026-09-23T07:44:22Z`. Because these are dependency/build updates rather than a substantive search-facing publication, the qualifying-content clock remains anchored to the 22 September article publication.
- Public acceptance for the discovery article remains qualified by retrieval freshness. At approximately `2026-09-23T16:55Z`, the canonical article crawler still returned the older v1.0.30 body while the public homepage returned v1.0.31 and the current generated `site` route contains the v1.0.31 article. The successful publication history, current production marker, generated output, and healthy homepage do not indicate a build/deployment incident, so this remains **retrieval/crawler freshness**. Do not force a cache change without contradictory evidence.
- Metadata-only closeout PR **#140** recorded the 22 September rendered publication. Its merge did not itself change rendered output; later dependency-only main merges legitimately advanced `site/.source-sha` because the normal publication workflow rebuilt the site from those commits.
- The earlier `/ebpf-ai-agent-monitoring/` post-publication retrieval-freshness qualification is resolved; no cache-forcing or deployment repair is required for that route.
- Production generated `index.html` still includes the expected Google Analytics loader. Source `src/app/layout.tsx` continues to report `page_location` as origin + pathname and `page_path` as pathname, preserving the configured path-only policy without query strings.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- The newest family remains `2026-09-14_to_2026-09-20`, generated the morning after the window at approximately `2026-09-21T16:04Z`. It has now reached the site's configured three-day finalization boundary without a post-lag regeneration. Its Search Console date export still contains only 14–19 September and omits 20 September, so it remains directional and must not be treated as finalized weekly KPI evidence.
- That GA4 organic-landing export contains **17 sessions** across its rows and **0 key events**: `/` has 10 sessions, `(not set)` 5, `/integrations/opencode-openclaw/` 1, and `/use-cases/audit-mcp-servers-skills-plugins/` 1. Active-user values are retained at row level and are not summed here as a site-wide unique-user count.
- The six available Search Console dates contain **8 clicks / 383 impressions / 2.09% CTR / impression-weighted average position approximately 9.67**. For directional context only, the prior next-morning `2026-09-07_to_2026-09-13` snapshot contained 3 clicks / 375 impressions / 0.80% CTR / weighted position approximately 8.43 over its available 7–12 September dates. This is not a finalized week-over-week comparison.
- Directional page rows in the new family show the homepage at 6 clicks / 170 impressions / position approximately 5.64; `/blog/how-agentsight-discovers-local-agent-sessions/` at 0 clicks / 60 impressions / position 6.15; `/guides/agent-flamegraph/` at 0 clicks / 18 impressions / position 6.5; and `/use-cases/audit-mcp-servers-skills-plugins/` at 1 click / 26 impressions / position 45.5. The 22 September evergreen refresh used the discovery page's impression row only as directional evidence and was justified primarily by current-source depth gaps, not by an unfinalized CTR result.
- Public-safe SHA-256 checksums remain unchanged: `2026-09-14_to_2026-09-20_ga4_organic_landing_pages.csv` = `187539f96588c4a78326889e9dab5767243eeb6da3fc32a3a2a9ea4dc1986fa1`; `2026-09-14_to_2026-09-20_gsc_dates.csv` = `4536263be68f196fa703bb232d37a1cf1fbacbcb39c79419cc53569539b4b1a7`.
- `2026-08-17_to_2026-08-23` remains completely absent.
- `2026-08-24_to_2026-08-30`, `2026-08-31_to_2026-09-06`, `2026-09-07_to_2026-09-13`, and now `2026-09-14_to_2026-09-20` lack a usable post-lag refresh. The first three older Search Console date exports still omit 30 August, 6 September, and 13 September respectively; the newest family omits 20 September.
- Because these completed windows were either missing or captured before their configured finalization cutoffs and have not been regenerated afterward, their movement remains directional and must not be reported as finalized week-over-week performance.
- The site's GA4 bootstrap records origin + pathname / pathname and excludes query strings from page-view identity. No analytics implementation defect is currently known.
- Daily public search still finds the canonical AgentSight site, but the generic `AgentSight` brand result remains ambiguous because unrelated products use the same name. Search result order/count is directional only.

## Off-site visibility and package state

- Alibaba Cloud Linux 4 Agentic Edition documentation independently lists AgentSight as a runtime-layer/core component and describes eBPF-based AI-agent observability; this is downstream project evidence, not customer proof.
- A Mycelium Protocol / Mushroom article published 5 September 2026 independently links to `agentsight.us`, the GitHub repository, paper, and DOI. Its release-version wording is stale and is not used as product truth.
- No new verified independent external link was established by the bounded 23 September public scan. Search-only discoveries are not promoted to backlink evidence without fetching the external page.
- The former scoped-npm first-publication blocker remains resolved: `@eunomia-bpf/agentsight@1.0.30` was successfully published with provenance. Public install guidance continues to follow the authoritative product README/release documentation.

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and post-lag refresh 24–30 August, 31 August–6 September, 7–13 September, and now 14–20 September. The latest family has reached the configured finalization boundary without regeneration and still omits 20 September from its Search Console date export. The current operator can inspect Drive but has no connected Apps Script execution/configuration surface.
