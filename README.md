# AgentSight Website

The public product, use-case, comparison, guide, integration, release, and security site for [AgentSight](https://github.com/eunomia-bpf/agentsight). It is a Next.js static export served at [agentsight.us](https://agentsight.us/); the interactive application remains at [app.agentsight.us](https://app.agentsight.us/).

## Local development

Use Node.js 20.9 or newer (the repository's `.nvmrc` selects Node.js 22).

```bash
npm ci
npm run dev
```

## Validate and export

```bash
npm run verify
```

The verification pipeline checks the 23-page content catalog, TypeScript, the production build, exported routes, unique titles, H1s, canonical URLs, sitemap, and deployment metadata. `next build` produces the fully static `out/` directory; no Next.js server runtime is required.

Product commands and compatibility facts come from the AgentSight product repository. The local `agentsight-seo-research` skill describes the evidence and semantic-overlap review required for new content.

See [MIGRATION.md](MIGRATION.md) for the repository split and production cutover checklist.
