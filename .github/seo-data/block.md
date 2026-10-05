# Human-only blockers

## Google SEO export finalization timing

- As of 5 October 2026, `2026-09-21_to_2026-09-27` still has only its 28 September preliminary export even though the configured three-day finalization lag has passed; the Search Console date file covers only 21–25 September.
- `2026-08-17_to_2026-08-23` remains missing, and completed weekly windows from 24 August through 27 September still need post-lag regeneration.
- The new `2026-09-28_to_2026-10-04` family was generated on 5 October and is still within its expected preliminary period.
- Resolution requires the external export owner to backfill the missing week and regenerate completed windows after their finalization cutoffs with the full intended date range.

The recurring AgentSight operations schedule remains external to this repository
and stays enabled.

## Pull request creation path

- Prepared branch head before this blocker note: `4a5b28c02690c3f856d706bad44dd0686061ee9e`.
- Two non-draft pull-request creation attempts were rejected by the connected GitHub action before a GitHub PR was created, including a minimal title/head/base request.
- Repository search confirms there is still no open PR for `seo/agentsight-2026-10-05-codebuddy-v1-0-34`.
- Minimum external action: open a non-draft PR from that branch to `main`. Do not merge or bypass checks; exact-head Website CI and the normal final-review lifecycle still apply.
