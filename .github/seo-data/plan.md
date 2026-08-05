# SEO plan

## Purpose

Make `agentsight.us` the canonical, technically accurate public entry point
for engineers who need to understand, compare, install, and use AgentSight for
system-level AI-agent profiling and observability.

The site should help a reader make a concrete decision or complete a real
workflow. It should not grow through thin keyword variants.

## Success signals

- Crawlable canonical pages, valid robots and sitemap output, coherent titles
  and descriptions, working internal links, and successful static builds.
- Distinct coverage of high-value reader decisions without semantic duplicate
  pages.
- Product claims, commands, compatibility, and limitations verified against
  the current `eunomia-bpf/agentsight` repository and primary sources.
- Useful movement from entry pages to relevant guides, comparisons, releases,
  the product repository, documentation, and live demo.
- Source-native GA4, Search Console, and Cloudflare trends only after those
  read-only sources are explicitly enabled; never a blended invented score.
- A complete daily operating record with exact PR, CI, deployment, and live
  verification evidence.

## Operating constraints

- Scheduling is owned by an authorized external session-level task, not this
  repository.
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
  with the same CI, self-review, and squash-merge rules.
- Normal operation requires no human approval.
- The protected operating control plane in `daily-task.md` is not editable by
  normal SEO cycles.
- No off-site automated posting, link schemes, fabricated evidence, invented
  benchmarks, customer claims, or roadmap promises.

Short-term findings and daily decisions belong in `daily/`, `status.md`, or
repository issues. This file contains durable strategy only.
