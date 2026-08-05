# SEO status

## Current state

- Last completed autonomous SEO run: none
- Last data window: none
- Last site-change pull request: none
- Last autonomous squash merge: none
- Last autonomous closeout pull request: none
- Last verified production publication: `https://github.com/eunomia-bpf/agentsight-website/actions/runs/30984517192`
- Published source commit: `f48685b8be6db59659d1c8a3fd4e4ae4be5ab9c1`
- Last public verification: `2026-08-05 00:20 PDT`; `https://agentsight.us/` returned the AgentSight production homepage after the exact source commit was present in `site/.source-sha`.
- Static build identifier: `agentsight-112aa0016d7eb175c4f4dd26`, deterministically derived from site-affecting inputs and deployed by the verified publication above.
- Metadata-only publication behavior: this status-only installation closeout is the no-op verification case; its push-triggered publication must keep `site/.source-sha` at `f48685b8be6db59659d1c8a3fd4e4ae4be5ab9c1` because no rendered input changed.
- Skill submodule commit: `516e9e2dcf012506a677a749049d64c5914643e9`
- Automation bootstrap: scheduled workflow installed; first run `https://github.com/eunomia-bpf/agentsight-website/actions/runs/30983349752` stopped before agent execution because `OPENAI_API_KEY` was not available.

## Current signals

- Google Analytics 4: not configured
- Google Search Console: not configured
- Cloudflare analytics: not configured
- Public technical baseline: pending first autonomous verification
- Content and semantic-overlap baseline: pending first autonomous verification
- Agent credential: blocked; see `block.md`
- Repository CI, exact-commit static publication, and public delivery pipeline: verified
- Deterministic static build ID: deployed; metadata-only no-op verification is this closeout

## Active focus

Provide the one-time model-provider credential, rerun the bootstrap workflow,
complete the first unattended operating cycle, verify crawl and metadata
behavior, inventory existing search intents, and select a site change only if
the evidence supports one.

This file is the current verified summary. Detailed autonomous-run history
belongs in `daily/`.
