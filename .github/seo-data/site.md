# Site metadata

## Identity

- Canonical URL: `https://agentsight.us`
- Site name: `AgentSight`
- Timezone: `America/Los_Angeles`
- Site role: product website and search-facing engineering publication surface
- Canonical product documentation: `https://eunomia.dev/agentsight/`

The product website explains what AgentSight is, what problems it solves, how it
compares with adjacent observability layers, and publishes durable engineering
analysis. Installation, getting started, CLI reference, build, Docker,
OpenTelemetry setup, runtime configuration, and troubleshooting remain owned by
the canonical documentation site.

## Repository

- Website repository: `eunomia-bpf/agentsight-website`
- Product repository: `eunomia-bpf/agentsight`
- Default branch: `main`
- Automation branch prefix: `seo/agentsight-`
- Skill submodule path: `.github/seo-skills`
- Skill allowed branch: `main`
- Pinned skill commit: `e7338af051ee9621b3033912d5c5751c7ebc241a`

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
contracts, editorial policy, and completion criteria belong in this repository.
This repository must not contain a GitHub Actions workflow, cron job, webhook,
or provider secret whose purpose is to run the SEO agent.

## Content publication contract

- Qualifying-content SLO: at least one substantive search-facing publication in every rolling 48 hours
- Clock source: the successful exact-commit static publication of the qualifying rendered change
- Daily deadline rule: if waiting until the next scheduled daily cycle would exceed 48 hours since the last qualifying publication, the current cycle must select and deliver qualifying content after higher-priority production/factual repairs
- New URL required: no; a major evergreen refresh of an existing canonical page qualifies when it adds substantial durable information
- New URL allowed: only for a materially distinct reader problem and decision with no existing canonical owner
- Thin-content fallback: prohibited; record an SLO miss rather than publish a duplicate or unsupported page

A qualifying publication must add durable information that a shallow search
summary cannot cheaply reproduce. At least one of the following should be
present when relevant:

- original synthesis across multiple primary sources;
- exact version/commit inspection of fast-moving agent or observability software;
- a reproducible AgentSight experiment with environment and method;
- a real public-safe AgentSight screenshot, report, trace summary, flamegraph,
  benchmark result, or other first-party artifact;
- a concrete limitation/failure analysis;
- a maintained technical comparison or reference table with explicit scope.

Metadata-only changes, daily operating records, changelog-only release notices,
cosmetic copy edits, keyword substitutions, machine-generated summaries without
new analysis, and near-duplicate search pages do not count toward the 48-hour
SLO.

For search and generative-answer usefulness, qualifying content should make its
reader question, direct answer, source/version date, comparison dimensions,
limitations, reproducibility anchors, and primary references easy to identify.
The objective is citation-worthy technical information, not keyword density.

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
exact source state. Missing data is not zero. Do not commit the Drive folder ID,
raw rows, search-query exports, or account identifiers.

## Content-performance feedback

When finalized data exists, evaluate content with source-native signals rather
than a blended score:

- Search Console: impressions, clicks, CTR, average position, indexed-page
  signals, page movement, and query-cluster movement;
- GA4: organic landing users/sessions, engagement when exported, and qualified
  outbound actions to the demo, GitHub, releases, and canonical documentation
  when those fields exist;
- public search: index/title/snippet/brand checks as directional context only.

Do not delete or broadly rewrite a recent publication from one noisy period.
Prefer repeated comparable windows, obvious factual drift, or a concrete reader
failure. Content can be refreshed before it earns traffic when new primary
sources materially change the answer.

## Public search visibility

- Public index checks enabled: yes
- Daily baseline queries: `site:agentsight.us`, `agentsight.us`, and the AgentSight brand query
- Priority-query sampling: use evidence-backed product, problem, integration, and comparison terms relevant to existing or researched content

Public search results are directional evidence for discovery, indexing, titles,
and competing results. They are not a substitute for Search Console clicks,
impressions, CTR, average position, or page-indexing reports.

## Visual brand relationship

AgentSight is a distinct product within the Eunomia ecosystem. Future visual
work may align the site with the current `eunomia.dev` family through a light
canvas, `#091627` ink, slate borders, cyan/azure accents, restrained orange
highlights, and compatible typography/card/code treatments. Preserve the
AgentSight name, mark, real product screenshots, product-specific information
hierarchy, URLs, canonical ownership, and navigation meaning. Visual alignment
must be phased as independently reviewable rendered changes rather than a route
or information-architecture migration.

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
