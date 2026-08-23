# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Current authoritative AgentSight release: `v1.0.26`, released 22 August 2026 at product commit `92d634ec02d116a52acae62eb3b9b00c771e0b9d`.
- v1.0.26 fixes the recorded demo so it loads a recorded `LiveOverview` beside the saved session snapshot. The release uses coherent Codex and Claude fixtures across Overview, Conversation, Process Tree & AI Prompts, and Analysis, including process/resource state, tools, network targets, failures, plans, and source-reported subscriptions. Product PR `#200` adds Playwright coverage for this complete demo path.
- v1.0.25 messaging hardening remains current behavior: provider initialization/resume/transport failures are surfaced rather than reported as false acceptance, same-session submissions are serialized, ambiguous delivery is not automatically resent, and Direct/relay request paths have bounded message, concurrency, response, and deadline contracts.
- v1.0.23 introduced the current product-source boundary: `ext/` is the canonical cross-platform layout for independently composable functionality while platform capture remains native in `agentsight-capture`.
- Only `ext/session` currently exports and executes a `wasm32-wasip2` WebAssembly Component. Dynamic extension discovery, extension-defined CLI commands, and opaque Controller-to-Node `/ext/*` extension routing remain follow-up work and must not be described as shipped behavior.
- The signed-in organization landing view remains **All machines**. The browser queries bounded overviews from reachable Nodes through Direct or Relay and aggregates the fleet in browser memory; Controller keeps machine directory/access policy rather than persisting Node snapshots or the browser-produced aggregate.
- A selected session has three primary views: Conversation, Process Tree & AI Prompts, and Analysis. Analysis retains event-level inspection through its interactive timeline.
- Portable agent-native `top`, `bind`, `vis`, and `report` workflows remain available on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed debug/tracing remain Linux-only.
- `agentsight vis` / `agentvis` currently reconstruct repository evolution from matching local Claude, Codex, and Gemini Tool actions. Normal discovery uses worktree/project/Git identity; `--global` broadens session discovery while retaining operations that target the selected repository. HTML retains every action, while GIF/MP4 use action-uniform media compaction by default.
- Current GitHub Releases publish Linux x86_64 and aarch64 binaries; Windows builds are exercised by CI/source workflows rather than published as release assets.
- The Free/Pro/Team/Enterprise plan catalog remains distinct from current hosted-preview effective access. Registered preview users receive the implemented hosted feature set through an `unlimited` effective plan; the website must not imply that catalog billing is already enforced.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` was rechecked on 23 August and is unchanged at the same commit.
- Runtime analytics remains GA4 with path-only URL reporting; Google signals and ad-personalization signals remain disabled.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement for website SEO operation: none.

## Production and public verification

- The v1.0.26 website synchronization remains delivered through rendered PR `#77`, squash commit `a1b21100ff12fe418a4777912583c3f6b8750da3`.
- `site/.source-sha` still identifies `a1b21100ff12fe418a4777912583c3f6b8750da3`, matching the rendered v1.0.26 publication.
- Independent canonical-homepage retrieval on 23 August now exposes the current v1.0.26 generation. The immediate post-publication homepage freshness mismatch recorded on 22 August is no longer reproduced on the direct canonical fetch.
- Public search can still expose older cached AgentSight snippets alongside current GitHub/product results. Treat those search-index copies as index freshness unless direct canonical retrieval or exact publication evidence regresses.
- The 23 August content cycle selects one new research Blog canonical, `/blog/replay-coding-agent-repository-changes/`, because waiting until the next normal cycle would breach the rolling 48-hour substantive-content target. Exact PR/CI/squash/publication evidence is recorded after delivery rather than guessed in advance.

## Current analytics and search data

- Configured finalization lag: three days. On 23 August 2026, the latest fully finalized calendar date is 20 August.
- Direct enumeration of the exact configured Drive folder corrected a material earlier finding: GA4 landing-page CSVs and Search Console CSV families are present for both the 3–9 August and 10–16 August weekly windows. The previous “manifest-only” state was inaccurate and is superseded.
- The 10–16 August snapshot includes `2026-08-10_to_2026-08-16_ga4_organic_landing_pages.csv` plus matching GSC query/page/country/device/search-appearance/date files. The 3–9 August snapshot has the same file families.
- A different exporter-quality issue remains. Both weekly sets were generated the morning after their window ended, before the configured three-day lag, and have not been refreshed afterward. The 10–16 August GSC date file has rows through 15 August but no 16 August row; the 3–9 August date file has 4–8 August but omits the boundary dates. These are real source snapshots, but they are not treated as finalized weekly evidence.
- Directional GA4 snapshot: exported organic landing sessions move from 5 on the 3–9 August file to 20 on the 10–16 August file (19 homepage sessions plus 1 `/guides/` session). Homepage engagement in the later snapshot is 42.1% versus 0 in the earlier file; both report zero key events. Volume is very small and the snapshots are pre-finalization, so this is not attributed to a specific SEO change.
- Directional GSC homepage snapshot: 2 clicks / 134 impressions / 1.49% CTR / 7.16 average position on 3–9 August versus 5 clicks / 131 impressions / 3.82% CTR / 9.35 average position on 10–16 August. Impressions are essentially flat while clicks/CTR rise in the exported snapshot, but the position and finalization qualifications prevent a causal conclusion.
- Directional GSC brand query `agentsight`: 1 click / 53 impressions / 1.89% CTR / 6.68 position versus 2 clicks / 49 impressions / 4.08% CTR / 5.65 position across the same two snapshots.
- The later page/query snapshots begin to expose low-volume discovery for eBPF monitoring, Agent Flamegraph, Cursor, Langfuse observability, MCP security-audit, OpenTelemetry comparison, and agent-graph wording. These are single-digit or low-teen impression signals and do not support broad keyword rewrites.
- The external Apps Script exporter therefore remains a human-only blocker for **post-finalization refresh timing**, not for missing CSV generation. See `block.md`.
- Cloudflare analytics is not configured for this site.
- No new independently verified external link to `agentsight.us` was established in the 23 August bounded scan. Search-only discoveries are not treated as backlinks.
- A fresh public registry-oriented check still did not establish that `@eunomia-bpf/agentsight@1.0.0` has been published. The website must continue to avoid claiming the scoped npm package as an available install path.

## Content clock and portfolio

- Before the 23 August publication, the latest qualifying substantive output is `/blog/how-much-overhead-does-agentsight-add/`, exactly published at `2026-08-21T16:39:40Z` (09:39 PDT).
- The 23 August cycle occurs close enough to the 48-hour boundary that waiting for the next normal daily cycle would breach the content SLO, so a qualifying publication is required today after product and analytics triage.
- Selected publication: `/blog/replay-coding-agent-repository-changes/`, a methods-first Agent Nebula article grounded in the exact v1.0.26 product source and committed ACTplane artifact.
- The article owns a distinct reader decision: reconstruct the ordered repository trajectory of an already-completed coding-agent run from native local session history, and understand what that replay can and cannot prove.
- `/ai-agent-file-access-monitoring/` continues to own system-observed file-operation attribution; `/use-cases/review-ai-generated-prs/` owns the code-review decision; `/guides/agent-flamegraph/` owns aggregate profile analysis. The new Blog does not replace those canonicals or product installation documentation.
- Future content should continue to prefer public-safe first-party measurements, artifacts, and implementation-specific method analysis over generic summaries.

## Outstanding follow-up

- Complete the Agent Nebula repository-replay Blog through exact-head CI, from-scratch final review, squash merge, exact static publication, public acceptance, and metadata closeout.
- Adjust or rerun the external Google Apps Script exporter after the configured three-day finalization cutoff; see `block.md` for the human action required.
- Re-check recently refreshed Blog/detail routes as normal crawler/index freshness catches up; do not make cache-forcing content changes without an independently reproduced production defect.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
