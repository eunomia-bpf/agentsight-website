# SEO status

## Current product and site state

- Canonical product website: `https://agentsight.us/`.
- Canonical installation/CLI/build/runtime documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product repository: `eunomia-bpf/agentsight`.
- Current authoritative release: **AgentSight v1.0.34**, tag/release/product `master` commit `85bdb152653999bb5bf24a5b13c863bf8c949581`, published 5 October 2026.
- Current shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; allowed upstream `main` equals the same commit.
- Current website `main` and production `site/.source-sha`: **`ce5b66a84e009795df13b8f38b947d85ade84434`**. Exact current-head Website CI run `36679643441` succeeded.
- Before the 5 October branch, the live homepage still advertised AgentSight v1.0.31, so current release identity is materially stale even though the deployed source marker matches `main`.
- Latest qualifying substantive publication remains the evergreen refresh of `/blog/how-agentsight-discovers-local-agent-sessions/`, exact production completion `2026-09-22T16:18:49Z`.
- Its rolling 48-hour deadline was `2026-09-24T16:18:49Z`; the substantive-publication SLO is missed until a new qualifying rendered change completes exact-commit production publication.
- Repository-hosted model/SEO scheduler: none. The recurring authorized external operations schedule remains enabled.
- Cloudflare traffic analytics remain disabled by repository policy.

## Current public content ownership

- `/ebpf-ai-agent-monitoring/`: top-level product mechanism and evidence-boundary owner.
- `/guides/agent-flamegraph/`: semantic-profiler and token/time aggregation owner.
- `/compare/opentelemetry/`: OpenTelemetry architecture and decision owner.
- `/blog/how-agentsight-discovers-local-agent-sessions/`: local provider-session discovery/index owner.
- `/blog/how-agentsight-normalizes-agent-session-data/`: provider transcript normalization owner.
- `/blog/how-agentsight-reconciles-token-usage/`: token source-reconciliation owner.
- `/blog/how-agentsight-background-monitoring-works/`: background monitor persistence owner.
- `/blog/why-ai-agent-tls-traffic-is-hard-to-trace/`: runtime-specific encrypted-transport diagnostics owner.
- `/blog/when-agentsight-works-without-ebpf/`: native-session versus Linux system-observation decision owner.
- `/blog/system-boundary-observability/`: broad architecture and reader-decision owner.
- `/integrations/cursor/`: Cursor-specific local-session integration owner; it is still stale on public production and needs a later deliberate refresh rather than being silently duplicated.
- `/integrations/codebuddy-cli/`: selected 5 October canonical owner for CodeBuddy CLI local-session discovery versus Linux `record`, the project-session location and `CODEBUDDY_CONFIG_DIR`, Node process identity, and the explicit CLI-only/native-binary/IDE scope boundary.

Avoid keyword variants that do not add a new reader decision, mechanism, artifact, benchmark, or reproducible method. Prefer updating the existing canonical owner when an intent is already covered.

## Current release facts relevant to the website

- v1.0.32 introduced CodeBuddy CLI local-session and Linux record support plus Codex runtime-tracing fixes and resolved regular-file-open evidence.
- AgentSight v1.0.34 discovers CodeBuddy session files under `~/.codebuddy/projects/<project>/<session-id>.jsonl`, honors `CODEBUDDY_CONFIG_DIR`, and does not treat `~/.codebuddy/history.jsonl` as a complete session.
- The CodeBuddy compatibility path reviewed for the website is the Node.js CLI path documented by AgentSight. CodeBuddy's IDE plugin and separately distributed native-binary path are separate compatibility questions.
- v1.0.33 and v1.0.34 include additional process-observation and HTTP/runtime robustness fixes. GitHub Releases remain authoritative for the exact patch list.
- Existing research pages that pin older product commits keep those exact snapshots unless a deliberate evergreen refresh re-verifies their claims.

## Analytics and search evidence

- Configured Drive folder: `agentsight.us SEO Weekly CSV`.
- Newest family: `2026-09-28_to_2026-10-04`, generated at approximately `2026-10-05T16:06Z`. It is a next-morning preliminary snapshot and is **not finalized** under the configured three-day lag.
- Preliminary GA4 organic landing rows contain **12 sessions** and **0 key events**. `/guides/agent-flamegraph/` has 4 sessions. Active-user values remain row-level and are not summed into a site-wide unique-user count. SHA-256 for the GA4 landing export: `410ea71566208ab1a49955ecbd023489572742c489e4b671c55678a7d1c54e3a`.
- Search Console currently covers only 28 September–3 October and omits 4 October. Available dates total **5 clicks / 225 impressions / 2.22% CTR / impression-weighted average position 11.04**. Preliminary page rows show `/guides/agent-flamegraph/` at 3 clicks / 14 impressions / position about 3.86 and the homepage at 2 clicks / 107 impressions / position about 4.74. SHA-256 for the GSC date export: `52ac96a4fa31f6e7c1c1d51457b45ad8e1ff14b85e65a18a74cf24ab53651f44`.
- The preceding `2026-09-21_to_2026-09-27` family remains only its 28 September next-morning snapshot after the finalization boundary; its Search Console date export omits 26–27 September. It joins the exporter blocker rather than becoming finalized KPI evidence.
- `2026-08-17_to_2026-08-23` remains completely absent. Completed windows from 24 August through 27 September still lack usable post-lag refreshes.
- Public search still finds the canonical `agentsight.us` site. The generic `AgentSight` brand query remains ambiguous because unrelated products use the same name. Search-result order/count is directional only.
- No analytics implementation defect is currently known; page identity remains path-only.

## Production verification

- Website `main` and production source identity agree at `ce5b66a84e009795df13b8f38b947d85ade84434`.
- Current-head Website CI succeeded. The public homepage is reachable, so there is no current deployment-source incident.
- The current release drift is a factual/content defect: production still advertises v1.0.31 while the product repository has released v1.0.34.
- Any rendered change remains incomplete until its exact pull-request head passes CI, receives a fresh review, squash-merges, the exact squash commit publishes successfully, and public acceptance is verified.

## Human-only blockers

- **Google SEO export finalization timing:** an authorized external Google Apps Script operator needs to backfill 17–23 August and post-lag refresh every completed weekly family from 24 August through 27 September. The newest 28 September–4 October family is the expected next-morning preliminary snapshot and is not yet overdue for post-lag refresh. The current scheduled operator can inspect Drive artifacts but has no connected Apps Script execution/configuration surface.
- **Pull request creation:** the prepared 5 October branch exists, but two non-draft PR creation attempts were rejected by the connected GitHub action before GitHub created a PR. Manual PR creation from `seo/agentsight-2026-10-05-codebuddy-v1-0-34` to `main` is currently the minimum external action; checks and review must not be bypassed.
