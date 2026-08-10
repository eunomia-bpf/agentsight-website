# SEO status

## Current state

- Authoritative AgentSight product release: `v1.0.4`, published `2026-08-10` from product commit `ac1e6cb7a8398c57c1ad0ba04ff032cd271d99c8`.
- `v1.0.4` adds Cursor IDE sessions through the agent-native local-session path. The website's August 10 rendered outcome synchronizes the release metadata and adds a source-grounded `/integrations/cursor/` reference rather than treating Cursor as another eBPF/TLS CLI target.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- The existing Blog, use-case, comparison, guide, integration, landing, Security, release, and changelog route families remain canonical. No existing URL, redirect, or canonical owner is removed or renamed by the Cursor release synchronization.
- The Cursor integration is intentionally standalone from the four generic CLI/runtime integration pages. Its reader decision is to use local Cursor session artifacts instead of `record`/TLS attachment; the page pins AgentSight `v1.0.4` and states the live-payload, token-availability, timestamp, and enrichment limits explicitly.
- The site-wide legacy-content remediation remains in force: 22 generic legacy pages have explicit deep-content upgrades with at least five substantive sections and at least two supporting references, and Security retains its expanded local-data/export/capture-limit guidance.
- Existing long-form research anchors remain `/blog/system-boundary-observability/` and `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`; `/blog/from-agent-trace-to-review-artifact/` remains the upgraded review-method article.
- Visual Phase 1 and Phase 2 remain delivered; the current release work does not change the shared visual system or information architecture.
- Runtime analytics remains Google Analytics 4 with path-only reporting. Query strings, Google signals, and ad-personalization signals remain excluded by the current implementation.
- Repository-hosted model-running SEO automation remains prohibited by the website's current instructions.
- Model-provider credential requirement in the repository: none.

## Cursor product boundary

- Supported source path: Cursor transcripts below `~/.cursor/projects/<workspace>/agent-transcripts/`, with delegated subagent transcripts folded into the parent session.
- Optional enrichment source: Cursor's local `state.vscdb` for session timing, model, and working-directory data; transcript parsing remains usable when the database is missing or locked.
- User workflow: existing local sessions are consumed by commands such as `agentsight top`, `agentsight report --local`, and `agentsight vis`; the Cursor path does not require launching the IDE through AgentSight or using sudo for eBPF capture.
- Live TLS/API-body capture is not the supported Cursor mechanism. The authoritative product documentation identifies desktop platform, Electron helper/stripped TLS attachment, and protobuf Connect payload semantics as separate obstacles.
- Current Cursor versions may not record local per-turn token usage. Missing recent token totals must not be interpreted as a failed AgentSight capture.

## Current public verification baseline

- At the start of the August 10 cycle, direct public retrieval still exposes the successfully published `v1.0.3` homepage and its pre-Cursor supported-agent text. This is a real product-version drift relative to the newly published `v1.0.4` release, not a cache-only inference.
- Public search sampling remains lagged relative to production: a sampled `agentsight.us` result still represents an older homepage generation. Search-result freshness is directional evidence only while Search Console exports are unavailable.
- Earlier detail-route crawler results remain inconsistent with exact publication output. Exact CI, publication-branch, sitemap, robots, and direct-route evidence should be used together; do not manufacture duplicate pages solely to force search/crawler refresh.
- The post-merge acceptance check for the August 10 rendered change must verify the exact deployment plus public homepage `v1.0.4`, integrations hub, `/integrations/cursor/`, changelog, sitemap, and one representative unchanged route. Any crawler qualification will be recorded in the metadata closeout rather than hidden.

## Current analytics and search data

- Latest configured source check: `2026-08-10`; latest eligible finalized calendar date under the three-day lag is `2026-08-07`.
- The configured Drive folder resolves uniquely.
- A new `2026-08-03_to_2026-08-09_ga4_source.json` manifest for `agentsight.us` was generated on `2026-08-10`; public-safe SHA-256: `8cf76880e864e891ff4459cd8775d18dcdf0c7f9547fec1788b90ce898b6282a`.
- The prior `2026-07-27_to_2026-08-02_ga4_source.json` manifest remains present.
- Neither manifest has the required paired `*_ga4_organic_landing_pages.csv`, and no matching `*_gsc_*.csv` exports are present. The new weekly manifest also extends beyond the current finalized watermark. No source-native GA4 or Search Console comparison is valid; missing CSV data is unavailable, not zero.
- The fresh August 10 manifest is meaningful exporter-health evidence: the external job is still creating source manifests, but its artifact set remains incomplete. The human-only Google Apps Script repair in `block.md` remains unresolved.
- Runtime GA4 remains present in source with the configured path-only URL policy. Provider-side evidence cannot be reconciled until the export pipeline is repaired.
- Cloudflare analytics remains not configured.
- The npm scoped-package first-publication blocker remains unresolved; the website must not claim `@eunomia-bpf/agentsight` is installable until a registry lookup verifies it.

## Shared SEO skill state

- Consuming repository pointer before this cycle: `d1194eeb23a6dd5cf04956f5efcfe8e3f0105003`.
- New compatible allowed-upstream commit selected this cycle: `9f0bd4f0b33b28fc22592e5463d95f63cda4d165`.
- The upstream change adds an automation-first `autoaction` contract for deterministic mechanical operations. The AgentSight website currently has no site-owned `autoaction.md`, and its protected repository instructions continue to limit GitHub Actions to ordinary CI and static publication.
- Adoption in this cycle is therefore gitlink-only. No new workflow, direct-default-branch write lane, scheduler, model runner, or credential is created. A future autoaction would require an owner-authorized protected-control-plane change under the website's own rules.

## Content clock and portfolio

- Latest qualifying substantive publication before the current cycle: the full legacy-content major evergreen refresh, exact static publication completed `2026-08-09 00:17:27` PDT.
- At the August 10 cycle start that publication is roughly 33.5 hours old. Waiting until the next normal cycle around August 11 09:00 PDT would exceed the rolling 48-hour target.
- The selected Cursor integration is intended to satisfy the current content SLO only after it passes exact-head CI, is squash-merged, and is published from the exact squash commit. A release-number edit or changelog-only change would not qualify by itself.
- The Cursor page adds a distinct reader answer and durable implementation information: agent-native versus eBPF/TLS boundary, exact local sources, delegated-subagent handling, commands, source/version scope, and concrete limitations.
- After this release-driven integration, rotate away from another immediate Cursor/IDE variant unless a materially new source or reader decision appears. Preferred future families remain first-party run studies, MCP audits, Agent Flamegraph analyses, performance/cost work with real measurements, and implementation changes that materially move an observability boundary.

## Outstanding follow-up

- Complete the August 10 `v1.0.4` / Cursor rendered delivery through exact-head CI, from-scratch final review, squash merge, exact-commit publication, public acceptance, and metadata closeout.
- Re-check public search/index visibility after the new route has had time to be discovered; do not infer deindexing from cached public search alone.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum external action and resolution evidence.
- Resolve the npm scoped-package first publication before adding npm installation claims.
