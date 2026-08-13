# SEO status

## Current state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Authoritative current product release: AgentSight `v1.0.17`, target commit `32228e0377eec52203c9531130b8e516d8946ecb`, published 13 August 2026.
- The website entered the 13 August cycle on `v1.0.15`; a rendered synchronization and Product evergreen refresh is in progress on `seo/agentsight-2026-08-13-v1-0-17-session-first`.
- v1.0.17 makes the hosted app session-first: a live Node starts with a machine-level overview of agent state, token totals, coding plans, CPU/RSS, and process counts, then session selection opens Conversation, Process Tree & AI Prompts, Timeline, and Detailed Events.
- Portable agent-native workflows (`top`, `bind`, `vis`, `report`) are supported on Windows, macOS, and Linux without eBPF. `record` and eBPF-backed tracing remain Linux-only. Native Windows support does not claim ETW/eBPF parity, and current GitHub Releases do not publish a Windows binary asset.
- Detailed runtime data remains authoritative on AgentSight Nodes. Direct browser-to-Node access remains independent from Controller relay.
- The hosted frontend and Controller API/relay now deploy from one production Cloudflare Worker revision. Controller remains the coordination plane rather than the authoritative runtime-data store.
- Controller defines the Free, Pro, Team, and Enterprise catalog, but hosted billing gates are not currently enforced: registered users receive an `unlimited` effective plan during the hosted preview. Website Pricing is being aligned to distinguish this preview state from the future billing catalog.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; upstream `main` resolves to the same commit.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Repository-hosted SEO agent workflow: none. Model-provider credential requirement: none.

## Production and public verification

- At the start of the 13 August cycle, direct canonical homepage retrieval is fresh to the previously published `v1.0.15` generation and product commit `ba140444...`; the prior homepage crawler/cache qualification is therefore resolved before the new v1.0.17 publication.
- Search-index results remain slower than direct canonical retrieval and are directional only.
- No new independent external link to `agentsight.us` was verified in the current off-site scan. An unrelated `agentsight.io` product appears for some AgentSight brand queries and should not be treated as a citation or backlink to this site.

## Analytics and search data

- Latest finalized source window inspected: `2026-08-03` through `2026-08-09`.
- The exact configured Drive folder contains the GA4 source manifests for `2026-07-27` through `2026-08-02` and `2026-08-03` through `2026-08-09`, but no paired `*_ga4_organic_landing_pages.csv` and no matching Search Console CSV.
- The missing CSVs make source-native traffic comparison unavailable, not zero. The Google Apps Script exporter remains a genuine human-only blocker; see `block.md`.
- Cloudflare analytics is not configured for this site.

## Content clock and portfolio

- Last completed qualifying publication before this cycle: the `/architecture/` v1.0.15 major evergreen refresh, published `2026-08-12T16:23:49Z` (`2026-08-12 09:23:49` PDT).
- The current cycle must publish a qualifying substantive change because waiting for the next normal cycle risks exceeding the rolling 48-hour target.
- The selected qualifying outcome is a substantial refresh of the existing `/product/` canonical around the current session-first workflow and cross-platform session/system-capture boundary, rather than a thin new release page.

## Outstanding blockers and follow-up

- Restore valid GA4 and Search Console exports through the external Google Apps Script exporter. This environment can inspect Drive but cannot execute or reconfigure the exporter.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is publicly installable.
- Complete the v1.0.17 rendered PR, exact CI, from-scratch review, squash merge, exact static publication, public acceptance, and metadata closeout. Until then, do not record the new website generation as delivered.
