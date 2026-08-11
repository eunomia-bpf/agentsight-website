# SEO status

## Current state

- Authoritative AgentSight product release: `v1.0.6`, published `2026-08-11` from release target commit `ad0cdcd3d77fee053b3b1ab81bb63239af4a6535`.
- The current operating cycle selected a narrow synchronization from the website's prior `v1.0.4` snapshot to `v1.0.6`, including the Direct Node / hosted-app binding workflow and the current x86_64/aarch64 Linux release-artifact boundary.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- No existing URL, redirect, canonical owner, navigation destination, analytics policy, or documentation boundary is being removed or renamed by the `v1.0.6` synchronization.
- Runtime analytics remains Google Analytics 4 with path-only reporting. Query strings, Google signals, and ad-personalization signals remain excluded by the current implementation.
- Repository-hosted model-running SEO automation remains prohibited. No workflow, scheduler, direct-main model lane, or provider credential is being added.
- Current shared SEO skill pointer: `9f0bd4f0b33b28fc22592e5463d95f63cda4d165`; a fresh allowed-upstream check on `2026-08-11` finds no newer `main` commit.

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

## Current public verification

- The canonical homepage is directly retrievable on `2026-08-11` and exposes the previously deployed `v1.0.4` generation, including the `v1.0.4` release pill and the `ac1e6cb7...` product snapshot.
- This resolves the earlier homepage crawler-freshness qualification from the August 10 closeout. The remaining mismatch is now a genuine newer product-release drift: the authoritative product repository has advanced to `v1.0.6`.
- Baseline public search still exposes the AgentSight brand/homepage and product repository. Search sampling is directional only while Search Console exports are unavailable.
- Do not add duplicate Direct Node pages or route churn merely to accelerate indexing. The current synchronization updates existing canonical product/release surfaces.

## Current analytics and search data

- Latest configured source check: `2026-08-11`; latest eligible finalized calendar date under the three-day lag is `2026-08-08`.
- The configured Google Drive folder resolves uniquely.
- Its direct-child artifacts remain `2026-08-03_to_2026-08-09_ga4_source.json` and `2026-07-27_to_2026-08-02_ga4_source.json`.
- Neither manifest has the required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` export is present. The newer manifest also extends beyond today's finalized watermark.
- No source-native GA4 or Search Console comparison is valid. Missing CSV data is unavailable, not zero.
- The Google Apps Script exporter repair in `block.md` remains a genuine human-only blocker because this operator has no Apps Script execution/configuration surface.
- Runtime GA4 source retains the configured path-only policy.
- Cloudflare analytics remains not configured.
- A fresh public search does not establish successful publication of the previously blocked `@eunomia-bpf/agentsight@1.0.0` npm package; the npm first-publication blocker remains open and the website must not add npm installation claims.

## Content clock and portfolio

- Latest qualifying substantive publication: `/integrations/cursor/` from the AgentSight `v1.0.4` release synchronization.
- Exact qualifying static publication completed `2026-08-10 10:11:26` PDT (`2026-08-10T17:11:26Z`).
- Waiting until the next normal daily cycle on August 12 remains inside the rolling 48-hour content SLO, so the current `v1.0.6` factual repair is not padded with a thin release article and does not reset the content clock by itself.
- Preferred next substantive families remain public-safe first-party run studies, MCP audits, Agent Flamegraph analyses, measured performance/cost work, and implementation changes that materially move an observability boundary.

## Current delivery

- Starting website `main` for the August 11 cycle: `29bff773b1eef6009f06e0e89cf4dbb64e2c58c6`.
- Selected rendered scope: synchronize shared release/product-source metadata to `v1.0.6`, update existing changelog/release/LLM-facing product facts, and preserve the Cursor page's historical `v1.0.4` source boundary.
- No new canonical URL is created because the current reader decisions already have owners.
- Delivery uses a fresh `seo/agentsight-` branch, ordinary Website CI, from-scratch final review, squash merge, exact `Publish static site` verification, and a metadata-only closeout after post-merge evidence exists.

## Outstanding follow-up

- Complete the current `v1.0.6` rendered synchronization through CI, final review, squash merge, exact publication, and public acceptance; then record exact delivery evidence in a metadata-only closeout PR.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum human action and resolution evidence.
- Resolve the npm scoped-package first publication before adding npm installation claims.
