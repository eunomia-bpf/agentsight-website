# SEO status

## Current state

- AgentSight `v1.0.3` is the current product release used by the website, with AgentSight-specific product material pinned to `07a83a32257b8c8dcba911bd9db23f77e71dc085` where exact source anchoring is useful.
- Canonical product website: `https://agentsight.us/`.
- Canonical installation, CLI, build, Docker, runtime configuration, and troubleshooting documentation: `https://eunomia.dev/agentsight/`.
- Blog is a first-class desktop/mobile navigation destination at `/blog/`.
- The Blog contains three substantive entries. The two long-form research anchors are `/blog/system-boundary-observability/` and `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`; the older `/blog/from-agent-trace-to-review-artifact/` has now also been upgraded from the thin legacy template into a decision-oriented review-method article.
- Owner-directed legacy-content remediation is delivered through PR `#44`: all 22 remaining generic legacy content pages now have explicit deep-content upgrades with at least five substantive sections and at least two supporting references. The custom Security page is also substantially expanded.
- PR `#44` exact final head `a0b2dcd43a5c8b5463cbe10283b5f1293502a5b0` passed Website CI `31300709260`; exact artifact `9034396225` has digest `sha256:9d9ecaeee5310c31800150423e219aadedd334da366dd18558bcc084b182cf26`.
- PR `#44` was squash-merged as `f831d1c80be9285f2240ef7949a33ddc1a305806`. Main Website CI `31300787290` and Publish static site `31300787279` succeeded. At rendered acceptance time, `site/.source-sha` identified that exact squash commit; later metadata-only publication may advance the marker without changing rendered behavior.
- Exact artifact review found 35 generated index pages and 33 unique sitemap URLs, with exactly one canonical and one H1 on every generated page. No public URL, redirect, canonical owner, or sitemap URL was removed or renamed by the quality pass.
- The 22 upgraded generic pages now render roughly 350–575 article-body words each, with five to eight substantive sections before generic source/continuation UI. Security renders roughly 760 words. The two already-long-form research articles retain their existing deeper bodies.
- The new CI quality floor requires every legacy generic page to retain an explicit deep upgrade with at least five substantive section bodies and at least two supporting references. This prevents a future regression back to two-paragraph keyword/template pages.
- Content responsibilities are now intentionally separated: use cases explain reader decisions; integrations document current compatibility/runtime boundaries; Claude/Codex observability landings map the multi-layer telemetry stack; `/mcp-server-audit/` is a concrete audit method; comparison pages use current primary sources and complementary-use-case analysis; product reference/install material stays on eunomia.dev.
- Current primary-source comparison set includes OpenTelemetry, Claude Code, Gemini CLI, the open-source Codex OpenTelemetry implementation, Cloudflare AI Gateway, Langfuse, LangSmith, Model Context Protocol, Linux kernel uprobes, and exact AgentSight v1.0.3 source/docs.
- Security now explicitly distinguishes local-first storage from data sensitivity, documents privileged observation and bounded capture, treats export/OTLP as new data boundaries, preserves absence uncertainty, and gives redaction/reproduction guidance without inventing a private vulnerability channel.
- Visual Phase 1 and Phase 2 remain delivered: shared shell and homepage align with the Eunomia visual family while preserving AgentSight identity, URLs, canonical ownership, documentation ownership, and product imagery.
- Current shared SEO skill pointer: `d1194eeb23a6dd5cf04956f5efcfe8e3f0105003`.
- Runtime analytics: GA4 remains path-only and excludes query strings, Google signals, and ad-personalization signals.
- Repository-hosted SEO agent workflow: none.
- Model-provider credential requirement: none.

## Current public verification

- Independent canonical-homepage retrieval is fresh and exposes AgentSight `v1.0.3`, current homepage information, and Blog navigation.
- Independent detail-route retrieval is still inconsistent with the exact publication branch: a sampled slow-run page returned an older cached `v0.2.67` generation, while several other detail routes returned crawler cache misses.
- The exact rendered acceptance marker and static artifact prove that the upgraded routes were published from `f831d1c8...`; treat the current public mismatch as per-route crawler/cache freshness. Do not label it a 404 or claim direct live verification of every detail page.
- Do not create rendered changes solely to force crawler freshness. Retry representative detail routes in later operating cycles and use Search Console when valid source-native exports are restored.

## Current analytics and search data

- Latest known configured source state is from the `2026-08-08` patrol.
- The configured Google Drive folder contained a GA4 source manifest for the completed `2026-07-27` through `2026-08-02` window without its required paired `*_ga4_organic_landing_pages.csv`; no matching Search Console CSV exports were present.
- The manifest-only GA4 state is an exporter error under the current shared skill, not valid analytics evidence. Source-native traffic and search metrics remain unavailable for comparison, not zero.
- Restoring the external Google Apps Script exporter remains recorded in `block.md` because the scheduled operator has Drive access but no connected Apps Script execution/configuration surface.
- Public search/crawler sampling is directional only while Search Console exports are unavailable and detail-route caches are inconsistent.
- Cloudflare analytics: not configured.

## Content clock and portfolio

- Latest new Blog publication: `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`, published at `2026-08-08 17:02` PDT.
- Latest qualifying substantive publication under the rolling 48-hour policy: the full legacy-content major evergreen refresh, exact static publication completed at `2026-08-09 00:17` PDT (`2026-08-09T07:17:27Z`).
- The quality pass upgrades the entire old portfolio; the next cycle should not immediately manufacture another rewrite of the same pages.
- Next preferred substantive outcome is a new research Blog or first-party experiment that adds information the current portfolio does not already contain, for example a reproducible slow/expensive-run breakdown, a real MCP-server audit, or an Agent Flamegraph token/time study built from public-safe session material.
- On every daily cycle, resolve the latest qualifying publication dynamically. If waiting until the next scheduled run would breach the 48-hour target, deliver another qualifying article or major evergreen refresh after higher-priority production/factual repairs.

## Outstanding follow-up

- Re-check representative upgraded detail routes after crawler/CDN freshness catches up; do not alter rendered content merely to force a cache refresh.
- Restore valid weekly GA4 and Search Console exports through the external Google Apps Script exporter; see `block.md` for the minimum external action and resolution evidence.
- The npm scoped-package first-publication blocker remains active until registry availability is independently verified. The website must not claim that `@eunomia-bpf/agentsight` is installable.
