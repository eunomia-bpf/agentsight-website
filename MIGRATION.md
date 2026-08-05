# Migration checklist

This repository is the sole source repository for `agentsight.us`. The AgentSight product repository keeps the CLI, eBPF programs, UI, documentation, and research code.

## Repository and CI

1. Create the public `eunomia-bpf/agentsight-website` repository from this `main` branch.
2. Confirm `Website CI` passes on the pushed commit.
3. Confirm `Publish static site` builds the same commit and updates the `site` branch.

## Cloudflare Pages

1. Connect the Pages project to `eunomia-bpf/agentsight-website`.
2. Either build `main` with `npm run build` and output directory `out`, or serve the generated `site` branch without rebuilding.
3. Attach `agentsight.us`. Keep the interactive application at `app.agentsight.us`.

## Production acceptance

Verify the home page, hubs, detail pages, `/security/`, `/changelog/`, `/releases/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, canonical tags, Open Graph image, redirects, and internal links. Then merge `eunomia-bpf/agentsight#137` to remove `docs/website/**` and the obsolete product-repository deployment workflow.
