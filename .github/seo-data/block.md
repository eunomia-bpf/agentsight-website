# Human-only blockers

## Google SEO export finalization timing

The 17–23 August family is absent. Completed weekly families from 24 August through 27 September still lack a usable post-lag regeneration; the newest 21–27 September Search Console dates stop at 25 September. An authorized Google Apps Script operator needs to backfill the missing family and regenerate completed windows after the configured finalization lag.

## Delivery gate

Branch `seo/agentsight-2026-10-02-cursor-refresh` is prepared. A normal non-draft pull-request creation attempt was blocked before GitHub created a review object, and repository search confirms no PR exists. The minimum human action is to open this branch against `main` without bypassing checks; CI, final review, merge, publication, and public verification must still run normally.
