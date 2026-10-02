# SEO status

## Current product and site state

- Canonical website: `https://agentsight.us/`; documentation: `https://eunomia.dev/agentsight/`.
- Authoritative product: `eunomia-bpf/agentsight` **v1.0.31**, commit `bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3`, published 5 September 2026.
- Shared SEO skill pointer: `f42128a3f05c73cf10c786a2711c488bb3a14839`; upstream `main` is unchanged.
- Website `main` and production `site/.source-sha`: `ce5b66a84e009795df13b8f38b947d85ade84434`. Website CI `36679643441` and publication run `36679643447` succeeded.
- Latest qualifying substantive publication: `/blog/how-agentsight-discovers-local-agent-sessions/`, exact production completion `2026-09-22T16:18:49Z`. The 48-hour deadline `2026-09-24T16:18:49Z` is missed and remains anchored there until another qualifying rendered publication succeeds.
- Public homepage and local-session discovery content report v1.0.31. At the 1 October cycle start, `/integrations/cursor/` still reports v1.0.4 and is the selected evergreen refresh target.

## Current implementation boundaries

- Native sessions come from provider-owned local state; ordinary recent listing is bounded, while direct known-session lookup uses a separate path index.
- Cursor uses `~/.cursor/projects/<workspace>/agent-transcripts/` plus optional read-only `state.vscdb` enrichment on macOS, Linux, and Windows.
- Cursor delegated `subagents/*.jsonl` work is folded into the parent session. When local `bubbleId` usage records exist, v1.0.31 can sum parent input/output tokens and delegated subagent counters; absent local usage is unavailable evidence, not a measured zero.
- Cursor native-session support does not provide live API request/response bodies. Repository replay uses the Cursor parser so delegated file/tool actions remain attributed to the parent session.
- `top`, `bind`, `vis`, and `report` can use supported native-session data without eBPF on Windows, macOS, or Linux; `record` and eBPF-backed debug commands are Linux system-capture paths.
- Generated production HTML contains the GA4 loader. Source reporting remains origin + pathname / pathname without query strings.

## Analytics and search evidence

- Newest Drive family: `2026-09-21_to_2026-09-27`, generated 28 September around `16:06Z`; there is no post-lag regeneration.
- GA4 organic landing rows: **10 sessions / 0 key events**.
- Search Console dates cover only 21–25 September: **6 clicks / 269 impressions / 2.23% CTR / impression-weighted position approximately 7.71**. The missing 26–27 September dates make this directional, not finalized.
- Checksums: GA4 organic landing `2f74d0eef200eef8f1635e46ffb247e1fdac79906551842e77967feaccc224ef`; GSC dates `c70c57587b0b18206a021af9a8ad1f63835db86db6dac48b896f2a3906697cb2`.
- `2026-08-17_to_2026-08-23` remains absent. The weekly families from 24 August through 27 September still lack usable post-lag refreshes, so finalized week-over-week movement is unavailable.
- Public search finds the canonical site; generic `AgentSight` results remain ambiguous because unrelated products use the same name.

## Human-only blockers

- The weekly Google export process needs a backfill for 17–23 August and post-lag regeneration for the completed weekly families from 24 August through 27 September.
- Delivery gate: branch `seo/agentsight-2026-10-01-cursor-refresh` is prepared, but no review object exists after two normal delivery attempts; required checks, review, merge, and publication cannot begin until that repository object exists.
