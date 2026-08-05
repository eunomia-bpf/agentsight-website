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
- Initial pinned skill commit: `53ef5e7027c40bb1f57d05673d5b4eecae70d605`

## Scheduler

- Owner: authorized ChatGPT or equivalent session-level task outside the repository
- Entrypoint: `.github/seo-data/daily-task.md`
- Repository-hosted agent scheduler: prohibited
- Model-provider credentials in repository: prohibited

The invoking session owns model access and connected-tool credentials. This
repository must not contain a GitHub Actions workflow, cron job, webhook, or
provider secret whose purpose is to run the SEO agent.

## Google data

- Google Drive enabled: yes
- Google Drive folder name: `agentsight.us SEO Weekly CSV`
- GA4 export filename pattern: `ga4-*.csv`
- Search Console export filename pattern: `gsc-*.csv`
- Lookback days: 28
- Finalization lag days: 3

The invoking session reads finalized GA4 and Search Console CSV exports from
the exact configured folder. Missing exports are unavailable, not zero.

## Cloudflare data

- Cloudflare enabled: yes
- Zone hostname: `agentsight.us`
- Preferred dataset: `httpRequestsAdaptiveGroups`

## Deployment

- Provider: `github-actions`
- Production workflow: `Publish static site`
- Production workflow file: `publish.yml`
- Production trigger: push to `main`
- Production branch: `site`
- Production environment: `branch-based deployment`
- Verification URL: `https://agentsight.us`

The production workflow only builds and publishes the website; it does not host
or schedule the SEO agent. For a site-changing run, the external session waits
for the publication triggered by the exact squash commit, confirms the `site`
branch identifies that rendered source commit, and verifies the intended public
behavior.

Store only durable public metadata here. Never add analytics property IDs,
Drive IDs, Cloudflare IDs, account identifiers, personal emails, credentials,
private URLs, or raw analytics.
