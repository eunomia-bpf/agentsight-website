# AgentSight website contributor guide

This repository owns the public `agentsight.us` website. Product code, CLI documentation, and release implementation live in [`eunomia-bpf/agentsight`](https://github.com/eunomia-bpf/agentsight).

Before changing product claims or commands, verify them against the current product repository. Use `.agents/skills/agentsight-seo-research/` for content research and semantic-overlap checks.

Run `npm run verify` before opening a pull request. Keep the site compatible with Next.js static export: do not add server-only routes, request-time APIs, or image optimization that requires a Next.js server.
