# Site metadata

## Identity

- Canonical URL: `https://agentsight.us`
- Site name: `AgentSight`
- Timezone: `America/Los_Angeles`

## Repository

- Website repository: `eunomia-bpf/agentsight-website`
- Product repository: `eunomia-bpf/agentsight`
- Default branch: `main`
- Automation branch prefix: `seo/agentsight-`
- Skill submodule path: `.github/seo-skills`
- Skill allowed branch: `main`
- Initial pinned skill commit: `516e9e2dcf012506a677a749049d64c5914643e9`

## Google data

- Google Drive enabled: no
- Google Drive folder name: `not configured`
- GA4 export filename pattern: `ga4-*.csv`
- Search Console export filename pattern: `gsc-*.csv`
- Lookback days: 28
- Finalization lag days: 3

Disabled sources are unavailable, not zero. Do not fabricate metrics. They may
be enabled later only after a read-only, unattended credential path exists.

## Cloudflare data

- Cloudflare enabled: no
- Zone hostname: `agentsight.us`
- Preferred dataset: `httpRequestsAdaptiveGroups`

## Deployment

- Provider: `github-actions`
- Production workflow: `Publish static site`
- Production workflow file: `publish.yml`
- Production branch: `site`
- Production environment: `branch-based deployment`
- Verification URL: `https://agentsight.us`

A site-changing run must dispatch `publish.yml` with the exact squash commit
in its `source_sha` input, wait for that run to succeed, confirm the `site`
branch publication identifies that source commit, and verify the intended
behavior on the public URL.

Store only durable public metadata here. Never add analytics property IDs,
Drive IDs, Cloudflare IDs, account identifiers, personal emails, credentials,
private URLs, or raw analytics.
