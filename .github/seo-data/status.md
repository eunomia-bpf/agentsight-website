# SEO status

## Current state

- AgentSight `v1.0.3` is the current product release used by the website, with AgentSight-specific product material pinned to `07a83a32257b8c8dcba911bd9db23f77e71dc085` where exact source anchoring is useful.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Blog is a first-class desktop/mobile navigation destination at `/blog/`.
- The Blog contains three substantive entries. The two long-form research anchors are `/blog/system-boundary-observability/` and `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`; the older `/blog/from-agent-trace-to-review-artifact/` has now also been upgraded from the thin legacy template into a decision-oriented review-method article.
- Owner-directed legacy-content remediation is delivered through PR `#44`: all 22 remaining generic legacy content pages now have explicit deep-content upgrades with at least five substantive sections and at least two supporting references. The custom Security page is also substantially expanded.
- PR `#44` exact final head `a0b2dcd43a5c8b5463cbe10283b5f1293502a5b0` passed Website CI `31300709260`; exact artifact `9034396225` has digest `sha256:9d9ecaeee5310c31800150423e219aadedd334da366dd18558bcc084b182cf26`.
- PR `#44` was squash-merged as `f831d1c80be9285f2240ef7949a33ddc1a305806`. Main Website CI `31300787290` and Publish static site `31300787279` succeeded. At rendered acceptance time, `site/.source-sha` identified that exact squash commit; later non-rendered publications may advance the marker without changing substantive content.
- Remote `main` has since advanced to `ec64ba51b4080777c5453596d3c6d95ad4a967a8` through an already-merged Dependabot workflow update. Website CI `31301789415` and Publish static site `31301789407` both succeeded, and the publication branch now identifies that exact commit while retaining the same current `v1.0.3` rendered product site.
- Exact artifact review found 35 generated index pages and 33 unique sitemap URLs, with exactly one canonical and one H1 on every generated page. No public URL, redirect, canonical owner, or sitemap URL was removed or renamed by the quality pass.
- The 22 upgraded generic pages render roughly 350–575 article-body words each, with five to eight substantive sections before generic source/continuation UI. Security renders roughly 760 words. The two already-long-form research articles retain their existing deeper bodies.
- The CI quality floor requires every legacy generic page to retain an explicit deep upgrade with at least five substantive section bodies and at least two supporting references. This prevents a future regression back to two-paragraph keyword/template pages.
- Content responsibilities are intentionally separated: use cases explain reader decisions; integrations document current compatibility/runtime boundaries; Claude/Codex observability landings map the multi-layer telemetry stack; `/mcp-server-audit/` is a concrete audit method; comparison pages use current primary sources and complementary-use-case analysis; product reference/install material stays on eunomia.dev.
- Current primary-source comparison set includes OpenTelemetry, Claude Code, Gemini CLI, the open-source Codex OpenTelemetry implementation, Cloudflare AI Gateway, Langfuse, LangSmith, Model Context Protocol, Linux kernel uprobes, and exact AgentSight v1.0.3 source/docs.
- Security explicitly distinguishes local-first storage from data sensitivity, documents privileged observation and bounded capture, treats export/OTLP as new data boundaries, preserves absence uncertainty, and gives redaction/reproduction guidance without inventing a private vulnerability channel.
- Visual Phase 1 and Phase 2 remain delivered: shared shell and homepage align with the Eunomia visual family while preserving AgentSight identity, URLs, canonical ownership, documentation ownership, and product imagery.
- Current shared SEO skill pointer: `d1194eeb23a6dd5cf04956f5efcfe8e3f0105003`; the allowed upstream `main` is at the same commit, so no skill update is currently available.
- Runtime analytics: GA4 remains present with path-only reporting and excludes query strings, Google signals, and ad-personalization signals.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current public verification

- Independent canonical-homepage retrieval on `2026-08-09` is fresh and exposes AgentSight `v1.0.3`, Blog navigation, current product-tour content, and the pinned product snapshot.
- Exact published `robots.txt` allows crawling and points to the canonical sitemap; exact published `sitemap.xml` retains the established 33 canonical URLs.
- Independent detail-route retrieval remains inconsistent with the exact publication branch: the sampled slow-run page still returns the crawler's older cached `v0.2.67` generation, while the TLS deep-dive route returned a crawler error.
- Public search sampling is also stale relative to production: a sampled `agentsight.us` result shows an older three-week-old homepage title/snippet, and the sampled `site:agentsight.us` query returned no result during the latest patrol. The live homepage itself is current.
- The exact current publication branch, sitemap, robots output, successful CI, and successful publication do not reproduce a route or crawlability defect. Treat the mismatch as per-route crawler/index freshness unless Search Console or a direct live failure proves otherwise; do not create rendered changes solely to force refresh.

## Current analytics and search data

- Latest configured source check: `2026-08-09`; latest eligible finalized calendar date under the three-day lag is `2026-08-06`.
- The configured Drive folder resolves uniquely and still contains only the `2026-07-27_to_2026-08-02_ga4_source.json` manifest for the completed weekly window. Its fetched public-safe SHA-256 is `5540f82a9be791348f828fd718c4e11c6c2bc83130dc448796eb3958118ae6c8`.
- The required paired `*_ga4_organic_landing_pages.csv` remains absent and no matching `*_gsc_*.csv` exports are present. The manifest-only state is an exporter error under the current shared skill, not valid analytics evidence. Source-native traffic and search metrics therefore remain unavailable for comparison, not zero.
- Runtime GA4 remains present in source and exact published output with the configured path-only URL policy. Provider-side evidence cannot be reconciled while the external export pipeline remains incomplete.
- Restoring the external Google Apps Script exporter remains recorded in `block.md` because the scheduled operator has Drive access but no connected Apps Script execution/configuration surface.
- Public search/crawler sampling remains directional only while Search Console exports are unavailable and detail-route caches are inconsistent.
- Cloudflare analytics: not configured.

## Content clock and portfolio

- Latest new Blog publication: `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`, published at `2026-08-08 17:02` PDT.
- Latest qualifying substantive publication under the rolling 48-hour policy: the full legacy-content major evergreen refresh, exact static publication completed at `2026-08-09 00:17:27` PDT (`2026-08-09T07:17:27Z`).
- Waiting until the next normal daily cycle around `2026-08-10 09:00` PDT would put the clock at approximately 32 hours 43 minutes, still below the 48-hour limit. No new publication is required in the current patrol.
- The quality pass upgrades the entire old portfolio; the next cycle should not immediately manufacture another rewrite of the same pages.
- Next preferred substantive outcome is a new research Blog or first-party experiment that adds information the current portfolio does not already contain, for example a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph token/time study built from public-safe session material.
- On every daily cycle, resolve the latest qualifying publication dynamically. If waiting until the next scheduled run would breach the 48-hour target, deliver another qualifying article or major evergreen refresh after higher-priority production/factual repairs.

## Outstanding follow-up

- Re-check representative upgraded detail routes after crawler/index freshness catches up; do not alter rendered content merely to force a refresh.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum external action and resolution evidence.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
