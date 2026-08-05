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

## Autonomous SEO operations

`.github/seo-data/daily-task.md` is the site-specific operating contract.
Shared collection and site-change skills are pinned as the
`.github/seo-skills` submodule. Scheduled runs are authorized to research,
edit the site, create non-draft pull requests, explicitly run and wait for CI,
perform the final self-review, squash-merge, publish the exact squash commit,
verify production, and merge a metadata closeout without human review.

Automated SEO work must use a fresh `seo/agentsight-` branch and must never
push directly to `main`, bypass checks, force-push, fabricate evidence, or
expose private data. Normal SEO cycles may not edit the protected automation
control plane listed in `daily-task.md`.
