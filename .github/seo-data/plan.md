# SEO plan

## Purpose

Make `agentsight.us` the canonical, technically accurate public entry point
for engineers who need to understand, compare, install, and use AgentSight for
system-level AI-agent profiling and observability.

The site should help a reader make a concrete decision or complete a real
workflow. It should not grow through thin keyword variants or a daily content
quota.

## Success signals

- Crawlable canonical pages, valid robots and sitemap output, coherent titles
  and descriptions, working internal links, and successful static builds.
- Distinct coverage of high-value reader decisions without semantic duplicate
  pages.
- Product claims, commands, compatibility, releases, and limitations verified
  against the current `eunomia-bpf/agentsight` repository and primary sources.
- Important product pages use real first-party screenshots, outputs, reports,
  flamegraphs, or other public-safe artifacts when they help the reader.
- Useful movement from entry pages to relevant guides, comparisons, releases,
  the product repository, documentation, and live demo.
- Source-native GA4 and Search Console trends only after finalized data exists;
  never a blended invented score.
- A complete operating record with exact PR, CI, deployment, and live
  verification evidence whenever repository or production state changes.

## Daily operating priorities

Use this order when selecting work:

1. Production incidents, failed publication, broken assets or links, indexing
   defects, and inaccurate product claims.
2. Product-source drift such as a new release, changed CLI behavior, new
   supported agents, changed screenshots, or updated limitations.
3. New finalized GA4 or Search Console evidence that identifies a concrete
   page, query cluster, CTR, indexing, engagement, or outbound-action problem.
4. Content-completeness work on an existing important page: a clear reader
   decision, current facts, a concrete workflow, real output or visual evidence,
   limitations, and a useful next action.
5. Semantic-overlap cleanup and durable internal-link improvements.

A daily run may conclude that no rendered change is justified. At most one
small, coherent, reversible site outcome is selected per cycle.

## Data-analysis cadence

- Every day: check source presence and freshness, production health, product
  release and commit drift, public index visibility, and material anomalies.
- When finalized GA4 or Search Console exports are new or changed: perform a
  comparative analysis against the prior comparable finalized period.
- When exports are unchanged: record freshness and retain the prior conclusion;
  do not repeatedly recompute identical inputs or manufacture an action.
- Weekly: summarize page and query-cluster movement, clicks, impressions, CTR,
  average position, landing-page behavior, users or sessions, engagement, and
  qualified outbound actions when those source columns exist.
- Longer-term decisions require repeated evidence across comparable periods;
  one noisy day or a partial window is not sufficient for a broad rewrite.

## Operating constraints

- Scheduling is owned by an authorized external session-level task, not this
  repository. The scheduler prompt stays thin and invokes the current
  repository entrypoint; this repository is the authority.
- Do not add a GitHub Actions agent workflow, repository cron, webhook, hosted
  model runner, provider SDK, or model-provider credential for SEO execution.
- Raw analytics and private identifiers stay outside Git.
- Every automated change uses a fresh `seo/agentsight-` branch and a real
  non-draft pull request.
- Required and expected existing CI must pass before final automated
  self-review and squash merge.
- Site changes wait for the exact squash commit's normal production publication
  and public verification.
- Post-merge evidence is recorded through a metadata-only closeout pull request
  when it could not have existed before the rendered merge.
- Normal operation requires no human approval.
- The protected operating control plane in `daily-task.md` is not editable by
  normal SEO cycles.
- No off-site automated posting, link schemes, fabricated evidence, invented
  benchmarks, customer claims, or roadmap promises.

Short-term findings and daily decisions belong in `daily/`, `status.md`, or
repository issues. This file contains durable strategy only.
