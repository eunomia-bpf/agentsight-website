# Daily SEO task

## Objective

Run one fully autonomous, evidence-backed SEO operating cycle for
`https://agentsight.us`. No normal collection, research, editing, pull-request,
CI, self-review, merge, deployment-verification, or closeout step requires human
approval.

The operating goal has two parts:

1. keep the product site technically accurate, crawlable, measurable, and
   synchronized with the authoritative AgentSight product repository; and
2. publish at least one substantive search-facing technical article or major
   evergreen refresh within every rolling 48-hour window.

The content cadence is a quality SLO, not permission to publish filler. A
qualifying publication must answer a distinct reader question, contain primary
or first-party information that is difficult to replace with a shallow search
summary, and pass the research, semantic-overlap, CI, publication, and live
verification gates below. Metadata-only edits, thin release notes, keyword
substitutions, cosmetic copy changes, and near-duplicate pages do not count.

Every local calendar day still checks configured SEO data, public search
signals, product drift, production health, and the content clock. A
no-rendered-change day is valid only when the next scheduled daily cycle can
still occur without breaching the rolling 48-hour publication SLO and no higher
priority defect requires repair.

## Schedule

- Frequency: daily
- Configuration owner: authorized ChatGPT or equivalent session-level task outside this repository
- Timezone for reports and data windows: `America/Los_Angeles`
- Data window: use the lookback and finalization lag in `site.md`
- Content publication SLO: at least one qualifying publication in every rolling 48 hours
- Maximum coherent rendered outcomes per main pull request: one
- Maximum concurrent cycles: one

The invoking session supplies model access and connected tools. Do not add a
GitHub Actions workflow, repository cron job, webhook, hosted agent runner,
provider SDK, or model-provider credential to execute this task. No
model-provider credential belongs in this repository. Existing CI and
publication workflows validate and deliver repository changes; they do not run
the SEO agent.

## Evidence and editorial policy

- Treat `eunomia-bpf/agentsight` source, current CLI behavior, release notes,
  screenshots, reports, public-safe traces, and public documentation as the
  source of truth for product claims.
- Inspect the generated static site and the live public site for crawlability,
  metadata, canonical URLs, structured data, links, redirects, and content.
- Use primary sources for external technical claims. For fast-moving coding
  agents, standards, and open-source tools, pin important implementation claims
  to an exact version or commit when practical.
- Read `.agents/skills/agentsight-seo-research/SKILL.md` before proposing or
  materially refreshing a content page. Compare the candidate with current
  pages by reader problem, decision, mechanism, sources, and expected output;
  reject keyword-swapped or semantically duplicate pages.
- Prefer enriching an existing canonical page when it already owns the reader
  decision. Create a new URL only when the reader problem is materially distinct
  and the current route inventory has no canonical owner for it.
- A qualifying publication should contain at least one durable information gain:
  original synthesis across primary sources, an exact implementation comparison,
  a reproducible AgentSight experiment, a real first-party trace/report/image,
  a measured product behavior, a failure/limitation analysis, or a technical
  reference table that is expensive to reconstruct from ordinary search results.
- State limitations and counterexamples directly. Do not make AgentSight win a
  comparison by understating current native telemetry from Claude Code, Codex,
  Gemini CLI, OpenTelemetry, MCP, or competing observability products.
- For a flagship long-form research article whose scope is compatible with the
  pinned `$research-blog` skill, use that skill. Routine 48-hour publications
  still require the site-specific research workflow and primary-source quality,
  but do not manufacture an academic-paper-sized article when a focused,
  reproducible engineering analysis answers the reader question better.
- Optimize for both search and answer engines by making the central question,
  conclusion, scope, source date/version, comparison dimensions, limitations,
  and primary references explicit in the page itself. Do not keyword-stuff or
  write generic FAQ padding for GEO.
- Search the configured Google Drive folder every day. Use the newest finalized
  matching GA4 and Search Console exports, even when they were not refreshed
  that day, and record their freshness and comparison basis. If the folder is
  empty, missing, unchanged, stale, or lacks a matching export, record that
  exact state; never convert missing data into zero or guessed values.
- Check public search visibility every day using the baseline queries in
  `site.md`. Treat public results as directional index evidence, not a
  replacement for Search Console metrics.
- Cloudflare remains unavailable until `site.md` explicitly enables a connected
  read-only source. Record it as not configured.
- Never commit raw rows, search queries, user events, IP addresses, private
  identifiers, credentials, personal information, full API responses, Drive
  IDs, analytics property IDs, or account identifiers.

## Protected operating control plane

Normal SEO cycles must not modify `.github/workflows/**`, `.gitmodules`,
`AGENTS.md`, `.agents/**`, `.github/seo-data/site.md`,
`.github/seo-data/daily-task.md`, or
`scripts/check-seo-automation-scope.py`. They may update the
`.github/seo-skills` gitlink to a newer compatible commit on its allowed branch,
but must not edit files inside the submodule.

Owner-directed maintenance may update these protected operating files through a
focused pull request, ordinary CI, and final review. Normal scheduled cycles
consume the resulting rules; they do not rewrite the control plane themselves.

## Required sequence

1. Read `AGENTS.md`, the pinned `$operate-seo-site`, `$collect-seo-data`, and
   `$deliver-github-pr` skills, this file, all other `.github/seo-data/*.md`
   files, and the newest daily reports.
2. Fetch `origin/main`, ensure no earlier `seo/agentsight-` run remains open,
   and create a fresh branch from the current remote `main` using the configured
   prefix and local date.
3. Fetch the `seo-skills` submodule's allowed branch. Include a newer compatible
   commit in the first suitable pull request when one exists; otherwise record
   that no update was available.
4. Collect every configured source:
   - search the Google Drive folder named in `site.md` and inspect the newest
     matching `gsc-*.csv` and `ga4-*.csv` exports;
   - record source presence, modification time, covered date window, freshness,
     and public-safe checksum without committing raw rows;
   - compare finalized metrics with the prior comparable window when the data
     analysis trigger in `site.md` is met, including clicks, impressions, CTR,
     average position, landing-page movement, indexed-page signals, users or
     sessions, and qualified outbound actions when those columns are available;
   - run the public index and brand-result checks configured in `site.md`;
   - inspect current repository, product, release, generated-site, and live-site
     evidence relevant to the day's decision;
   - resolve the last successfully deployed qualifying content publication and
     calculate whether waiting until the next scheduled daily cycle would breach
     the 48-hour SLO;
   - record unavailable or unchanged sources accurately.
5. Always write or append `.github/seo-data/daily/YYYY-MM-DD.md` and refresh
   `status.md`. Maintain durable priorities and candidate themes in `plan.md`,
   and keep `block.md` limited to genuine permission or external human-only
   blockers. The daily report must state the data window, source freshness,
   content-clock state, material changes, anomalies, decision, validation, and
   delivery evidence.
6. Triage work in this order:
   - repair a reproducible production, crawlability, analytics, or factual defect
     first when delaying it would harm the site;
   - synchronize material product-source drift;
   - if the next scheduled run would breach the content SLO, select and deliver
     one qualifying publication today;
   - otherwise use new finalized analytics/search evidence, existing-page depth
     gaps, or the content rotation in `plan.md` to choose at most one coherent
     rendered improvement.
7. For content work, run the site-specific research workflow before drafting.
   Prefer an existing canonical URL when it owns the intent. Define the reader
   question, unique information gain, sources, AgentSight artifact or
   reproducibility anchor, overlap decision, affected public behavior,
   validation, deployment target, and live acceptance check before editing.
8. Implement narrowly. Preserve static export compatibility, canonical path
   ownership, primary-source accuracy, documentation ownership, and one canonical
   page per reader decision.
9. Run `npm run verify` and any smaller relevant check. Inspect the complete
   intended diff and generated output. Long-form pages must also be reviewed for
   headings, tables/code/media overflow, source links, concrete claims,
   limitations, and representative unchanged routes.
10. Commit only intended files, push the fresh branch, and create a real
    non-draft pull request. Its body must state evidence, source freshness,
    content-SLO context when relevant, scope, tests, deployment target,
    acceptance check, rollback point, and any submodule movement.
11. Wait for the ordinary pull-request CI associated with the exact current
    head commit. Missing, approval-pending, queued, skipped, cancelled,
    timed-out, or failed checks are not success. Do not create or dispatch a
    model-running workflow.
12. After green CI, read the final PR diff, commits, generated output, and check
    results from scratch. Review correctness, source support, semantic
    distinctness, SEO/GEO usefulness, public-data safety, scope, and regressions.
    Fix every issue on the same branch, wait for CI again, and repeat the
    complete review.
13. Squash-merge the PR and delete its branch only after green CI and a clean
    final self-review. Capture the PR URL and resulting squash commit. Never
    push an automated change directly to `main`, force-push, or bypass checks.
14. On a no-site-change day, the merged daily data/status pull request completes
    repository delivery. Do not create a redundant closeout pull request.
15. When rendered site behavior changed, wait for the repository's existing
    push-triggered `Publish static site` workflow associated with the exact
    squash commit. Confirm successful publication and verify the predefined
    acceptance check on `https://agentsight.us`. An HTTP 200, preview, PR
    check, publication branch alone, or unrelated workflow run is not public
    verification.
16. For a site-change day, create a fresh metadata-only closeout branch and
    non-draft pull request. Update the same day's report and `status.md` with the
    change PR, exact squash commit, CI run, deployment, verification time,
    observed result, closeout PR, and whether the publication satisfies the
    48-hour content SLO. Wait for ordinary PR CI, self-review the complete
    closeout diff, squash-merge, and delete the branch.
17. Continue autonomously while safe progress is possible. If a genuine
    external blocker makes the 48-hour content SLO impossible, record the SLO
    miss and blocker truthfully. Never lower the quality gate, duplicate an
    existing intent, or fabricate completion to preserve cadence.

## Daily completion

A no-site-change day is complete when its daily data/status pull request is
squash-merged, expected CI succeeded, the final self-review was clean, the final
daily record is present on `origin/main`, and waiting until the next scheduled
cycle does not breach the content SLO.

A site-change day is complete only when its main pull request and required
metadata closeout pull request are squash-merged, every expected CI run
succeeded, the final self-reviews were clean, the exact main squash commit was
published, the changed behavior was verified on the public site or truthfully
qualified as an unresolved acceptance item, and the final daily record is
present on `origin/main`.

A publication counts toward the rolling 48-hour content SLO only after the
qualifying rendered content has passed exact-head CI, been squash-merged, and
been published from the exact squash commit. If direct public retrieval is
temporarily unavailable to the operator, record that acceptance qualification
and retry it; do not create a duplicate publication merely to reset the clock.

An issue, draft PR, local commit, open branch, unverified merge, stale or
unidentified deployment, or workflow URL without a successful matching run is
not completion.
