# SEO status

## Current state

- Authoritative AgentSight product release: `v1.0.6`, published `2026-08-11` from release target commit `ad0cdcd3d77fee053b3b1ab81bb63239af4a6535`.
- The website's rendered product snapshot was synchronized from `v1.0.4` to `v1.0.6` through PR `#49`, including the Direct Node / hosted-app binding workflow and the current x86_64/aarch64 Linux release-artifact boundary.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- No existing URL, redirect, canonical owner, navigation destination, analytics policy, or documentation boundary was removed or renamed by the `v1.0.6` synchronization.
- Runtime analytics remains Google Analytics 4 with path-only reporting. Query strings, Google signals, and ad-personalization signals remain excluded by the current implementation.
- Repository-hosted model-running SEO automation remains prohibited. No workflow, scheduler, direct-main model lane, or provider credential was added by this cycle.
- Current shared SEO skill pointer: `9f0bd4f0b33b28fc22592e5463d95f63cda4d165`; the allowed upstream `main` currently points to the same commit.

## Current v1.0.6 product boundary

- `agentsight bind` is an opt-in, unprivileged Direct Node entry point; it does not replace the existing `top`, `record`, `report`, or `monitor` workflows.
- The default Direct Node API binds to `127.0.0.1:7395` and remains available while the command process is running.
- The binding URL carries a random process-lifetime access key in its URL fragment; the SPA removes that fragment after opening and the Node requires the bearer for protected Direct API access.
- `--db` selects a saved capture. Without an explicit DB, the current implementation can use the latest matching local AgentSight capture when present or the local agent-session index.
- `--listen`, `--server-port`, browser-facing `--endpoint`, and `--app-url` cover explicit network and self-hosted presentation choices. Non-loopback exposure should use browser-trusted HTTPS.
- Detailed session data remains on the Direct Node. Optional hosted sign-in/control-plane state is limited to identity, session, and Node metadata; a control-plane failure does not block local/direct data loading.
- The released scope does not claim managed relay, organization RBAC/capabilities, browser proof-of-possession, Site Gateway, or a complete enterprise lifecycle.
- Current GitHub Releases publish `agentsight` and `agentpprof` binaries for x86_64 and aarch64 Linux. Unsuffixed compatibility assets remain x86_64.

## Cursor historical boundary

- `/integrations/cursor/` remains intentionally scoped to the `v1.0.4` Cursor implementation at product commit `ac1e6cb7a8398c57c1ad0ba04ff032cd271d99c8`.
- Cursor transcripts below `~/.cursor/projects/<workspace>/agent-transcripts/` remain the event-level source, with delegated `subagents/*.jsonl` folded into the parent session and optional `state.vscdb` enrichment.
- The page continues to state the agent-native local-session workflow, the absence of live Cursor API-body capture, and current token/timestamp limitations.
- Its primary release citation is pinned directly to `v1.0.4` so a moving site-wide current-release URL cannot silently rewrite the historical research source.

## v1.0.6 delivery evidence

- Rendered change PR: `#49`, **Sync AgentSight v1.0.6 and Direct Node product facts**.
- Exact final PR head: `78920e7d18bb94784a18c1e028ce6401d1eae0a7`.
- Exact-head Website CI: `31515526412`, successful.
- Exact static artifact: `9110888637`, digest `sha256:c259f51bf21617a22dd1c37871b5bec4ad8b9f4a4f354dee37427fb57cee180a`.
- Squash commit: `feadc4a997ba0b8b6280129adb8dd89d0d389552`.
- Main Website CI: `31515813681`, successful.
- Publish static site: `31515813523`, successful for the exact squash commit; run completed `2026-08-11T17:06:24Z`.
- At rendered-change acceptance, `site/.source-sha` exactly identified `feadc4a997ba0b8b6280129adb8dd89d0d389552`.
- Exact static review confirms the homepage reports `v1.0.6` and `ad0cdcd3...`, exposes `agentsight bind`, releases/changelog describe x86_64 and aarch64 Linux assets, `llms.txt` reports `v1.0.6`, and the Cursor page remains pinned to `v1.0.4`.
- Representative generated pages retain one canonical and one H1; the sitemap retains 34 canonical URLs and robots remains crawlable.

## Subsequent main publication

- During metadata closeout, `main` independently advanced to `900a7f3790c165b9e3ca5469fb08dca8539ca3c8` (`Position AgentSight as hosted web app`), a two-label `SiteShell` change outside this SEO cycle.
- Its normal Website CI `31516623137` and Publish static site `31516623037` succeeded.
- The current `site/.source-sha` identifies `900a7f3790c165b9e3ca5469fb08dca8539ca3c8`.
- That commit descends directly from the v1.0.6 squash commit, so the current publication retains the v1.0.6 product synchronization. The SEO closeout preserves rather than rewrites this unrelated owner change.

## Current public verification

- Independent canonical public retrieval after the v1.0.6 publication still exposes the cached `v1.0.4` release pill and `ac1e6cb7...` product snapshot; public search has not yet established `v1.0.6` indexing.
- Treat this as a public crawler/cache freshness qualification, not successful direct live acceptance and not a reproducible rendered regression. Do not create another rendered edit merely to force refresh while the exact v1.0.6 artifact and its descendant publication are internally consistent.
- Retry canonical public verification on a later cycle. If the stale generation persists beyond ordinary propagation and becomes independently reproducible outside the crawler cache, investigate deployment/domain routing before content work.

## Current analytics and search data

- Latest configured source check: `2026-08-11`; latest eligible finalized calendar date under the three-day lag is `2026-08-08`.
- The configured Google Drive folder resolves uniquely.
- Its direct-child artifacts remain `2026-08-03_to_2026-08-09_ga4_source.json` and `2026-07-27_to_2026-08-02_ga4_source.json`.
- Public-safe checksums are `8cf76880e864e891ff4459cd8775d18dcdf0c7f9547fec1788b90ce898b6282a` for the newer manifest and `5540f82a9be791348f828fd718c4e11c6c2bc83130dc448796eb3958118ae6c8` for the prior manifest.
- Neither manifest has the required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` export is present. The newer manifest also extends beyond today's finalized watermark.
- No source-native GA4 or Search Console comparison is valid. Missing CSV data is unavailable, not zero.
- The Google Apps Script exporter repair in `block.md` remains a genuine human-only blocker because this operator has no Apps Script execution/configuration surface.
- Runtime GA4 source and generated output retain the configured path-only policy.
- Cloudflare analytics remains not configured.
- A fresh public search does not establish successful publication of the previously blocked `@eunomia-bpf/agentsight@1.0.0` npm package; the npm first-publication blocker remains open and the website must not add npm installation claims.

## Content clock and portfolio

- Latest qualifying substantive publication: `/integrations/cursor/` from the AgentSight `v1.0.4` release synchronization.
- Exact qualifying static publication completed `2026-08-10 10:11:26` PDT (`2026-08-10T17:11:26Z`).
- The `v1.0.6` synchronization is a factual product repair and does not reset the content clock.
- Waiting until the next normal daily cycle on August 12 remains inside the rolling 48-hour content SLO, so no thin release article or duplicate Direct Node page is justified on August 11.
- Preferred next substantive families remain public-safe first-party run studies, MCP audits, Agent Flamegraph analyses, measured performance/cost work, and implementation changes that materially move an observability boundary.

## Outstanding follow-up

- Retry direct canonical production retrieval and public search after cache/index propagation; investigate deployment/domain routing only if the stale `v1.0.4` generation remains independently reproducible beyond normal freshness lag.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum human action and resolution evidence.
- Resolve the npm scoped-package first publication before adding npm installation claims.
