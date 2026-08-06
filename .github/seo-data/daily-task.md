# Daily SEO task

## Objective

Run one fully autonomous, evidence-backed SEO operating cycle for
`https://agentsight.us`. No normal collection, editing, pull-request, CI,
self-review, merge, deployment-verification, or closeout step requires human
approval.

The objective is useful, technically accurate coverage for people evaluating
or using system-level AI-agent observability. It is not daily content volume.
Every local calendar day must still check the configured SEO data and public
search signals, update the public-safe daily record, and merge that record
through the normal pull-request lifecycle. A no-site-change day is valid.

## Schedule

- Frequency: daily
- Configuration owner: authorized ChatGPT or equivalent session-level task outside this repository
- Timezone for reports and data windows: `America/Los_Angeles`
- Data window: use the lookback and finalization lag in `site.md`
- Maximum site changes: one coherent change per main pull request
- Maximum concurrent cycles: one

The invoking session supplies model access and connected tools. Do not add a
GitHub Actions workflow, repository cron job, webhook, hosted agent runner,
provider SDK, or model-provider credential to execute this task. No
model-provider credential belongs in this repository. Existing CI and
publication workflows validate and deliver repository changes; they do not run
the SEO agent.

## Evidence policy

- Treat `eunomia-bpf/agentsight` source, current CLI behavior, release notes,
  and public documentation as the source of truth for product claims.
- Inspect the generated static site and the live public site for crawlability,
  metadata, canonical URLs, structured data, links, redirects, and content.
- Use primary sources for external technical claims.
- Read `.agents/skills/agentsight-seo-research/SKILL.md` before proposing a
  content page and reject keyword-swapped or semantically duplicate pages.
- Search the configured Google Drive folder every day. Use the newest finalized
  matching GA4 and Search Console exports, even when they were not refreshed
  that day, and record their freshness and comparison basis. If the folder is
  empty, missing, unchanged, stale, or lacks a matching export, record that
  exact state; never convert missing evidence into zero or guessed values.
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

## Required sequence

1. Read `AGENTS.md`, the pinned `$operate-seo-site`, `$collect-seo-data`, and
   `$deliver-github-pr` skills, this file, all other `.github/seo-data/*.md`
   files, and the newest daily reports.
2. Fetch `origin/main`, ensure no earlier `seo/agentsight-` run remains open,
   and create a fresh branch from the current remote `main` using the configured
   prefix and local date.
3. Fetch the `seo-skills` submodule's allowed branch. Include a newer compatible
   commit in the same pull request when one exists; otherwise record that no
   update was available.
4. Collect every configured source:
   - search the Google Drive folder named in `site.md` and inspect the newest
     matching `gsc-*.csv` and `ga4-*.csv` exports;
   - record source presence, modification time, covered date window, freshness,
     and public-safe checksum without committing raw rows;
   - compare finalized metrics with the prior comparable window when data
     exists, including clicks, impressions, CTR, average position, landing-page
     movement, indexed-page signals, users or sessions, and qualified outbound
     actions when those columns are available;
   - run the public index and brand-result checks configured in `site.md`;
   - inspect current repository, product, release, generated-site, and live-site
     evidence relevant to the day's decision;
   - record unavailable or unchanged sources accurately.
5. Always write or append `.github/seo-data/daily/YYYY-MM-DD.md` and refresh
   `status.md`. Maintain durable future work in `plan.md`, and keep `block.md`
   limited to genuine permission or external human-only blockers. The daily
   report must state the data window, source freshness, material changes,
   anomalies, decision, validation, and delivery evidence.
6. Select at most one coherent site improvement only when evidence supports it.
   Define the affected public behavior, files, validation, deployment target,
   and live acceptance check before editing. Do not invent a rendered change to
   satisfy the schedule.
7. Implement narrowly. Preserve static export compatibility, canonical path
   ownership, primary-source accuracy, and one page per reader decision.
8. Run `npm run verify` and any smaller relevant check. Inspect the complete
   intended diff and generated output.
9. Commit only intended files, push the fresh branch, and create a real
   non-draft pull request. Its body must state evidence, source freshness,
   scope, tests, deployment target, acceptance check, and any submodule
   movement.
10. Wait for the ordinary pull-request CI associated with the exact current
    head commit. Missing, approval-pending, queued, skipped, cancelled,
    timed-out, or failed checks are not success. Do not create or dispatch a
    model-running workflow.
11. After green CI, read the final PR diff, commits, generated output, and check
    results. Review correctness, evidence, SEO semantics, public-data safety,
    scope, and regressions. Fix every issue on the same branch, wait for CI
    again, and repeat the complete review.
12. Squash-merge the PR and delete its branch only after green CI and a clean
    final self-review. Capture the PR URL and resulting squash commit. Never
    push an automated change directly to `main`, force-push, or bypass checks.
13. On a no-site-change day, the merged daily data/status pull request completes
    the repository delivery. Do not create a redundant closeout pull request.
14. When rendered site behavior changed, wait for the repository's existing
    push-triggered `Publish static site` workflow associated with the exact
    squash commit. Confirm successful publication and verify the predefined
    acceptance check on `https://agentsight.us`. An HTTP 200, preview, PR
    check, or unrelated workflow run is not deployment proof.
15. For a site-change day, create a fresh metadata-only closeout branch and
    non-draft pull request. Update the same day's report and `status.md` with the
    change PR, exact squash commit, CI run, deployment, verification time,
    observed result, and closeout PR. Wait for ordinary PR CI, self-review the
    complete closeout diff, squash-merge, and delete the branch.
16. Continue autonomously while safe progress is possible. Record a blocker
    only when a required permission is absent or an external system truly
    enforces a human-only action. Never fabricate completion.

## Daily completion

A no-site-change day is complete when its daily data/status pull request is
squash-merged, expected CI succeeded, the final self-review was clean, and the
final daily record is present on `origin/main` with `- Status: completed`.

A site-change day is complete only when its main pull request and metadata
closeout pull request are squash-merged, every expected CI run succeeded, the
final self-reviews were clean, the exact main squash commit was published, the
changed behavior was verified on the public site, and the final daily record is
present on `origin/main` with `- Status: completed`.

An issue, draft PR, local commit, open branch, unverified merge, stale or
unidentified deployment, or workflow URL without a successful matching run is
not completion.
