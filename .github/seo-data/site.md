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
- Pinned skill commit: `0440402cf5713994969ccd2b9998985367a2797b`

## Scheduler

- Owner: authorized ChatGPT or equivalent session-level task outside the repository
- Entrypoint: `.github/seo-data/daily-task.md`
- Intended cadence: daily at approximately `09:00` in `America/Los_Angeles`, flexible within one hour
- Task prompt policy: keep the external task short; it points to the current `main` branch and invokes the repository entrypoint
- Authority policy: current repository instructions override copied scheduler text and prior conversation context
- Repository-hosted agent scheduler: prohibited
- Model-provider credentials in repository: prohibited

The invoking session owns model access and connected-tool credentials. The
external task should contain only enough information to locate this repository
and invoke `daily-task.md`; durable operating rules, state, priorities, data
contracts, and completion criteria belong in this repository. This repository
must not contain a GitHub Actions workflow, cron job, webhook, or provider
secret whose purpose is to run the SEO agent.

## Google data

- Runtime analytics required: yes
- Primary runtime provider: Google Analytics 4
- Runtime implementation location: `src/app/layout.tsx`
- Runtime verification URL: `https://agentsight.us/`
- URL reporting: `path-only`
- Search analytics required: Google Search Console
- Search evidence route: weekly CSV exports in the configured Google Drive folder
- Infrastructure analytics: not configured
- Analytics payload policy: default public page-view metadata only; query strings and custom fields derived from credentials, cookies, authorization values, private identifiers, or application storage are prohibited
- Google Drive enabled: yes
- Google Drive folder name: `agentsight.us SEO Weekly CSV`
- Folder lookup: search by folder name through the connected Google Drive account
- Daily source check: yes
- Full comparative analysis trigger: a new finalized export window, a changed public-safe checksum, or the scheduled weekly review
- Export refresh expectation: weekly or whenever a newer export is available
- GA4 export filename pattern: `*_ga4_organic_landing_pages.csv`
- Search Console export filename pattern: `*_gsc_*.csv`
- Lookback days: 28
- Finalization lag days: 3

The scheduled session checks the configured folder every day. It records source
presence, filenames, date windows, modification times, freshness, and
public-safe checksums. When a finalized export is new or changed, analyze it
against the prior comparable period and record source-native findings. When the
same export is unchanged, record that state and carry forward the prior finding;
do not repeatedly recompute identical data or invent a site change. When the
folder is empty, missing, stale, or contains no matching export, record that
exact source state. Missing evidence is not zero. Do not commit the Drive folder
ID, raw rows, search-query exports, or account identifiers.

## Public search visibility

- Public index checks enabled: yes
- Daily baseline queries: `site:agentsight.us`, `agentsight.us`, and the AgentSight brand query
- Priority-query sampling: use only evidence-backed product and use-case terms already present on the site

Public search results are directional evidence for discovery, indexing, titles,
and competing results. They are not a substitute for Search Console clicks,
impressions, CTR, average position, or page-indexing reports.

## Cloudflare data

- Cloudflare enabled: no
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

Store only durable public metadata here. Public browser measurement IDs may
remain in runtime source because clients must receive them. Never add private
analytics property IDs, Drive IDs, Cloudflare IDs, account identifiers,
personal emails, credentials, private URLs, or raw analytics.
