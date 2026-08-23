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
- Independent canonical-homepage retrieval on 23 August exposes the current v1.0.26 generation. The immediate post-publication homepage freshness mismatch recorded on 22 August is no longer reproduced on the direct canonical fetch.
- The 23 August substantive publication is PR `#79`, **Explain repository replay with Agent Nebula**.
- PR `#79` exact final head `aca96a70a3e56ff20b66c53b993b06149b14b911` passed Website CI `32652121829`, including the autonomous SEO scope guard, `npm ci`, `npm run verify`, static export, and artifact upload.
- Exact static artifact `9496473475` has digest `sha256:70f2bbadb4e802b7e053e8e26d29f25be0a2e68cda5c8ea66e986da0ca21a3d9`.
- Exact artifact review found 39 normal generated pages and 39 unique sitemap URLs, up by one from the previous 38/38 baseline. Every normal page has exactly one canonical and one H1, and `/blog/replay-coding-agent-repository-changes/` appears once in the sitemap.
- PR `#79` was squash-merged as `936bc397c658ed3cabd953c161ae4eee34f09bfa` at `2026-08-23T16:36:54Z`.
- The normal `Publish static site` workflow rebuilt and verified that exact `main` commit before publication. Publication branch commit `1884b21fc7ebce76ab0473b1d961aff91ec63e89` was created at `2026-08-23T16:37:33Z` with message `Publish 936bc397c658ed3cabd953c161ae4eee34f09bfa`.
- `site/.source-sha` exactly identifies `936bc397c658ed3cabd953c161ae4eee34f09bfa`, proving the publication branch is generated from the rendered squash commit.
- Published HTML for the new route contains the intended title, description, canonical, article OpenGraph metadata, GA4 loader, exact v1.0.26 product source references, and the pinned ACTplane Agent Nebula image.
- Immediate independent search did not yet surface the new Blog URL and the Blog-hub crawler returned a cache miss during the acceptance window. Because the exact publication branch already contains the route and source marker, this is crawler/index freshness, not evidence of a 404 or failed static publication.
- Public search can still expose older cached AgentSight snippets alongside current GitHub/product results. Treat those search-index copies as index freshness unless direct canonical retrieval or exact publication evidence regresses.

## Current analytics and search data

- Configured finalization lag: three days. On 23 August 2026, the latest fully finalized calendar date is 20 August.
- Direct enumeration of the exact configured Drive folder corrected a material earlier finding: GA4 landing-page CSVs and Search Console CSV families are present for both the 3–9 August and 10–16 August weekly windows. The previous “manifest-only” state was inaccurate and is superseded.
- The 10–16 August snapshot includes `2026-08-10_to_2026-08-16_ga4_organic_landing_pages.csv` plus matching GSC query/page/country/device/search-appearance/date files. The 3–9 August snapshot has the same file families.
- A different exporter-quality issue remains. Both weekly sets were generated the morning after their window ended, before the configured three-day lag, and have not been refreshed afterward. The 10–16 August GSC date file has rows through 15 August but no 16 August row; the 3–9 August date file has 4–8 August but omits the boundary dates. These are real source snapshots, but they are not treated as finalized weekly evidence.
- Directional GA4 snapshot: exported organic landing sessions move from 5 on the 3–9 August file to 20 on the 10–16 August file (19 homepage sessions plus 1 `/guides/` session). Homepage engagement in the later snapshot is 42.1% versus 0 in the earlier file; both report zero key events. Volume is very small and the snapshots are pre-finalization, so this is not attributed to a specific SEO change.
- Directional GSC homepage snapshot: 2 clicks / 134 impressions / 1.49% CTR / 7.16 average position on 3–9 August versus 5 clicks / 131 impressions / 3.82% CTR / 9.35 average position on 10–16 August. Impressions are essentially flat while clicks/CTR rise in the exported snapshot, but the position and finalization qualifications prevent a causal conclusion.
- Directional GSC brand query `agentsight`: 1 click / 53 impressions / 1.89% CTR / 6.68 position versus 2 clicks / 49 impressions / 4.08% CTR / 5.65 position across the same two snapshots.
- The later page/query snapshots begin to expose low-volume discovery for eBPF monitoring, Agent Flamegraph, Cursor, Langfuse observability, MCP security-audit, OpenTelemetry comparison, and agent-graph wording. These are single-digit or low-teen impression signals and do not support broad keyword rewrites.
- The external Apps Script exporter remains a human-only blocker for **post-finalization refresh timing**, not for missing CSV generation. See `block.md`.
- Cloudflare analytics is not configured for this site.
- No new independently verified external link to `agentsight.us` was established in the 23 August bounded scan. Search-only discoveries are not treated as backlinks.
- A fresh public registry-oriented check still did not establish that `@eunomia-bpf/agentsight@1.0.0` has been published. The website must continue to avoid claiming the scoped npm package as an available install path.

## Content clock and portfolio

- Latest qualifying substantive publication: `/blog/replay-coding-agent-repository-changes/`.
- Exact static publication completed at `2026-08-23T16:37:33Z` (09:37 PDT), resetting the rolling 48-hour substantive-content clock.
- The article is a methods-first Agent Nebula reference grounded in AgentSight v1.0.26 commit `92d634ec02d116a52acae62eb3b9b00c771e0b9d` and the committed ACTplane replay artifact.
- Its reader decision is distinct: reconstruct the ordered repository trajectory of an already-completed coding-agent run from native local session history, and understand what that replay can and cannot prove.
- `/ai-agent-file-access-monitoring/` continues to own system-observed file-operation attribution; `/use-cases/review-ai-generated-prs/` owns the code-review decision; `/guides/agent-flamegraph/` owns aggregate profile analysis. The new Blog does not replace those canonicals or product installation documentation.
- Future content should continue to prefer public-safe first-party measurements, artifacts, and implementation-specific method analysis over generic summaries. Do not immediately create another Agent Nebula URL unless a distinct reader problem and new source material justify it.

## Outstanding follow-up

- Adjust or rerun the external Google Apps Script exporter after the configured three-day finalization cutoff; see `block.md` for the human action required.
- Re-check `/blog/replay-coding-agent-repository-changes/` and `/blog/` as normal crawler/index freshness catches up; do not make cache-forcing content changes without an independently reproduced production defect.
- Re-evaluate the directional GA4/GSC movement only after one post-finalization weekly export is available; do not promote the current next-morning snapshots to finalized KPIs.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
