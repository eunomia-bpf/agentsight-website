# SEO status

## Current state

- Authoritative AgentSight product release: `v1.0.15`, published `2026-08-12` from release target commit `ba14044491d2fdb52e8b9d0f3e9a94c5d3a12dd1`.
- The website's rendered product snapshot was synchronized from `v1.0.6` to `v1.0.15` through PR `#56`.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- No existing URL, redirect, canonical owner, primary navigation destination, analytics policy, or documentation boundary was removed or renamed by the `v1.0.15` synchronization.
- Runtime analytics remains Google Analytics 4 with path-only reporting. Query strings, Google signals, and ad-personalization signals remain excluded by the current implementation.
- Repository-hosted model-running SEO automation remains prohibited. No workflow, scheduler, direct-main model lane, or provider credential was added by this cycle.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`.

## Current v1.0.15 product boundary

- Detailed runtime data remains authoritative on AgentSight Nodes. Controller is a coordination plane rather than the telemetry data plane.
- Controller stores OAuth identity, organizations and memberships, built-in roles, organization configuration, plan and entitlement metadata, Node registration, relay credentials and presence, and the authorization decision used before a relayed operation.
- Controller does not persist snapshots, session transcripts, prompts, process data, or relay response bodies. Relay payloads pass through Controller runtime memory only while a request is active.
- Direct is an independent browser transport. A browser-reachable Node can be used by explicit HTTP(S) endpoint even when Controller Relay is unavailable or not deployed.
- Direct pairing exchanges the bootstrap credential for a Node-local scoped capability. The normal browser connection does not persist the bootstrap credential as its access token.
- Node-local capability actions are `node.info`, `evidence.read`, `session.read`, and `session.message`, with optional restriction to one session.
- Nodes are registered into organization namespaces rather than being owned directly by a user.
- Built-in organization roles are `viewer`, `operator`, `admin`, and `owner`.
- Canonical Controller plans are Free (`$0`), Pro (`$5/month` or `$49/year`), Team (`$10/user/month`), and Enterprise (`custom`). Contributor Lifetime Pro applies to a contributor's personal organization and does not waive Team or Enterprise billing.
- Current public product copy does not present Site Gateway/federation design work as a released feature. Product and Pricing describe the shipped Node, Direct, Controller, organization, role, and capability boundary instead.
- Current GitHub Releases publish `agentsight` and `agentpprof` binaries for x86_64 and aarch64 Linux. Unsuffixed compatibility assets remain x86_64.

## Cursor historical boundary

- `/integrations/cursor/` remains intentionally scoped to the `v1.0.4` Cursor implementation at product commit `ac1e6cb7a8398c57c1ad0ba04ff032cd271d99c8`.
- Cursor transcripts below `~/.cursor/projects/<workspace>/agent-transcripts/` remain the event-level source, with delegated `subagents/*.jsonl` folded into the parent session and optional `state.vscdb` enrichment.
- The page continues to state the agent-native local-session workflow, the absence of live Cursor API-body capture, and current token/timestamp limitations.
- Its primary release citation is pinned directly to `v1.0.4` so a moving site-wide current-release URL cannot silently rewrite the historical research source.

## v1.0.15 delivery evidence

- Rendered change PR: `#56`, **Sync v1.0.15 and document the released distributed authorization model**.
- Exact final PR head: `45c48078a38b7fb029f92e93182b21fe23e684eb`.
- Exact-head Website CI: `31617116016`, successful.
- Exact static artifact: `9149700793`, digest `sha256:4b6e7010a560de4de2c4bdf8e0f103791f710a9ffc614ab10f6b963f7e42d481`.
- Squash commit: `f06b6097a8698cf79d9591b12fe1cdb7ad2f8392`.
- Main Website CI: `31617295979`, successful.
- Publish static site: `31617295883`, successful; publication completed `2026-08-12T16:23:49Z` (`2026-08-12 09:23:49` PDT).
- At rendered-change acceptance, `site/.source-sha` exactly identified `f06b6097a8698cf79d9591b12fe1cdb7ad2f8392`.
- Exact static review found 39 generated index pages and 37 unique sitemap URLs. Every generated page retained exactly one H1 and one canonical, and the route inventory was unchanged.
- `/architecture/` is now a substantive release-pinned reference for Node-authoritative runtime data, Direct/Relay transport behavior, Controller persistence, organization roles, Node capabilities, and trust/failure boundaries.
- Product and Pricing preserve the owner-authored Free/Pro/Team pricing and contributor benefit while removing current-product Site Gateway claims.
- `llms.txt`, Changelog, release metadata, and sitemap freshness reflect `v1.0.15`.

## Current public verification

- Independent canonical public retrieval immediately after the `v1.0.15` publication still exposes a cached `v1.0.6` homepage generation. Direct Architecture and Pricing retrieval through the same crawler currently returns cache misses rather than fresh page bodies.
- Exact-main CI, exact publication, the `site` branch, and `site/.source-sha` are internally consistent at the rendered-change acceptance point. Treat the public mismatch as crawler/cache freshness, not successful direct live acceptance and not a reproducible rendered regression.
- Do not create another rendered edit merely to force refresh. Retry canonical public verification on a later cycle and investigate deployment/domain routing only if stale content becomes independently reproducible beyond ordinary propagation.

## Current analytics and search data

- Latest configured source check: `2026-08-12`; latest eligible finalized calendar date under the three-day lag is `2026-08-09`.
- The configured Google Drive folder resolves uniquely.
- Its direct-child artifacts remain the GA4 source manifests for `2026-07-27` through `2026-08-02` and `2026-08-03` through `2026-08-09`.
- The `2026-08-03` through `2026-08-09` window is now fully inside the finalized watermark, but neither manifest has the required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` export is present.
- No source-native GA4 or Search Console comparison is valid. Missing CSV data is unavailable, not zero.
- The Google Apps Script exporter repair in `block.md` remains a genuine human-only blocker because this operator has no Apps Script execution/configuration surface.
- Runtime GA4 source remains path-only: `page_location` is origin plus pathname and `page_path` is pathname; Google signals and ad-personalization signals remain disabled.
- Cloudflare analytics remains not configured.
- A fresh public search does not establish successful publication of the previously blocked `@eunomia-bpf/agentsight` scoped npm package; the npm first-publication blocker remains open and the website must not add npm installation claims.

## Content clock and portfolio

- Latest qualifying substantive publication: `/architecture/`, refreshed against AgentSight `v1.0.15`.
- Exact qualifying squash commit: `f06b6097a8698cf79d9591b12fe1cdb7ad2f8392`.
- Exact static publication completed `2026-08-12 09:23:49` PDT (`2026-08-12T16:23:49Z`).
- The Architecture refresh qualifies as a major evergreen publication because it adds current primary-source synthesis, exact release semantics, implementation-level capability names, organization roles, and explicit data/trust boundaries rather than a release-summary wrapper.
- The rolling 48-hour substantive-content clock resets from this publication.
- The next cycle should not manufacture another release-summary page. Prefer a public-safe first-party experiment, MCP audit, Agent Flamegraph analysis, measured performance/cost work, or another distinct technical question when substantive content is next required.

## Outstanding follow-up

- Retry direct canonical production retrieval and public search after cache/index propagation; investigate deployment/domain routing only if the stale generation remains independently reproducible beyond normal freshness lag.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum human action and resolution evidence.
- Resolve the npm scoped-package first publication before adding npm installation claims.
