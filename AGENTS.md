# AgentSight website contributor guide

This repository owns the public `agentsight.us` website. Product code, CLI
documentation, and release implementation live in
[`eunomia-bpf/agentsight`](https://github.com/eunomia-bpf/agentsight).

Before changing product claims or commands, verify them against the current
product repository. Use `.agents/skills/agentsight-seo-research/` for content
research and semantic-overlap checks.

Run `npm run verify` before opening a pull request. Keep the site compatible
with Next.js static export: do not add server-only routes, request-time APIs,
or image optimization that requires a Next.js server.

## SEO operations

Shared SEO skills are pinned at `.github/seo-skills`; site-specific operating
state lives at `.github/seo-data`. The recurring scheduler is an authorized
ChatGPT or equivalent session-level task outside this repository.

Do not add a GitHub Actions workflow, repository cron job, webhook, hosted
agent runner, provider SDK, or model-provider secret to run the SEO agent. This
repository does not need `OPENAI_API_KEY`. Existing GitHub Actions are limited
to ordinary CI and static-site publication.

When the external session invokes `.github/seo-data/daily-task.md`, it uses a
fresh `seo/agentsight-` branch, a real non-draft pull request, the repository's
existing CI, final self-review, squash merge, production verification, and a
metadata closeout. It must never push directly to `main`, bypass checks,
force-push, fabricate evidence, or expose private data. Normal SEO cycles may
not edit the protected control plane listed in `daily-task.md`.
