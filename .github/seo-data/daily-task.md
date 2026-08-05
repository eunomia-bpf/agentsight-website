# Daily SEO task

## Objective

Run one fully autonomous, evidence-backed SEO operating cycle for
`https://agentsight.us`. No normal collection, editing, pull-request, CI,
self-review, merge, deployment-verification, or closeout step requires human
approval.

The objective is useful, technically accurate coverage for people evaluating
or using system-level AI-agent observability. It is not daily content volume.
A no-site-change day is valid, but it still delivers a public-safe daily record
through the required pull-request lifecycle.

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
- Google Drive, GA4, Search Console, and Cloudflare are disabled until
  `site.md` explicitly enables them. Record them as not configured; never
  convert missing evidence into zero or guessed values.
- Never commit raw rows, search queries, user events, IP addresses, private
  identifiers, credentials, personal information, or full API responses.

## Protected operating control plane

Normal SEO cycles must not modify `.github/workflows/**`, `.gitmodules`,
`AGENTS.md`, `.agents/**`, `.github/seo-data/site.md`,
`.github/seo-data/daily-task.md`, or
`scripts/check-seo-automation-scope.py`. They may update the
`.github/seo-skills` gitlink to a newer compatible commit on its allowed branch,
but must not edit files inside the submodule.

## Required sequence

1. Read `AGENTS.md`, the pinned `$collect-seo-data` skill, the pinned
   `$change-seo-site` skill when a site change is justified, this file, all
   other `.github/seo-data/*.md` files, and the newest daily reports.
2. Fetch `origin/main`, ensure no earlier `seo/agentsight-` run remains open,
   and create a fresh branch from the current remote `main` using the configured
   prefix and local date.
3. Fetch the `seo-skills` submodule's allowed branch. Include a newer compatible
   commit in the same main pull request when one exists; otherwise record that
   no update was available.
4. Collect every configured finalized source. For disabled analytics sources,
   record `not configured`. Also inspect current public, repository, product,
   release, generated-site, and live-site evidence relevant to the day's
   decision.
5. Write or append `.github/seo-data/daily/YYYY-MM-DD.md`; refresh
   `status.md`, maintain durable future work in `plan.md`, and keep `block.md`
   limited to genuine permission or external human-only blockers.
6. Select at most one coherent site improvement only when evidence supports it.
   Define the affected public behavior, files, validation, deployment target,
   and live acceptance check before editing. Do not invent a change to satisfy
   the schedule.
7. Implement narrowly. Preserve static export compatibility, canonical path
   ownership, primary-source accuracy, and one page per reader decision.
8. Run `python3 .github/seo-skills/scripts/validate_seo_data.py --data-root
   .github/seo-data`, `npm run verify`, and any smaller relevant check. Inspect
   the complete intended diff and generated output.
9. Commit only intended files, push the fresh branch, and create a real
   non-draft pull request. Its body must state evidence, scope, tests,
   deployment target, acceptance check, and any submodule movement.
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
13. When rendered site behavior changed, wait for the repository's existing
    push-triggered `Publish static site` workflow associated with the exact
    squash commit. Confirm successful publication and verify the predefined
    acceptance check on `https://agentsight.us`. An HTTP 200, preview, PR
    check, or unrelated workflow run is not deployment proof.
14. Create a fresh metadata-only closeout branch and non-draft pull request.
    Update the same day's report and `status.md` with the main PR, exact squash
    commit, CI run, deployment, verification time, observed result, and
    closeout PR. Wait for ordinary PR CI, self-review the complete closeout
    diff, squash-merge, and delete the branch. A closeout that changes no
    rendered files does not need another production deployment.
15. Continue autonomously while safe progress is possible. Record a blocker
    only when a required permission is absent or an external system truly
    enforces a human-only action. Never fabricate completion.

## Daily completion

A day is complete only when its main pull request and metadata closeout pull
request are squash-merged, every expected CI run succeeded, the final
self-reviews were clean, and the final daily record is present on `origin/main`
with `- Status: completed`.

A site-change day additionally requires successful publication of the exact
main squash commit and verification of the changed behavior on the public
site. An issue, draft PR, local commit, open branch, unverified merge, or
workflow URL without a successful matching run is not completion.
