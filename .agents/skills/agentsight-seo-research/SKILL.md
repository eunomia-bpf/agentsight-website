---
name: agentsight-seo-research
description: Research and prepare source-grounded content briefs for agentsight.us. Use when proposing or drafting AgentSight guides, integrations, comparisons, release pages, use cases, or SEO landing pages; when checking whether a proposed page duplicates existing site semantics; or when verifying AgentSight commands and claims against the current product repository and primary sources.
---

# AgentSight SEO Research

Create useful pages for real AgentSight users without producing
keyword-swapped duplicates.

## Research workflow

1. Read the current `eunomia-bpf/agentsight` README, relevant docs, release
   notes, and CLI help before describing product behavior.
2. Read this repository's content catalog and sitemap. Compare the proposed
   page with existing pages by problem, audience, mechanism, evidence, and
   decision, not only by keyword.
3. Search primary sources: official product documentation, standards, papers,
   and source repositories. Use third-party summaries only to discover a
   primary source.
4. Write a brief that states the reader's concrete problem, the decision the
   page supports, the AgentSight evidence or workflow it can show, the primary
   sources required, and the internal links that belong naturally.
5. Reject thin pages that only rename an existing concept. Expand an existing
   page when the new brief lacks a distinct problem, mechanism, or acceptance
   test.

## Content constraints

- Treat the AgentSight repository as the source of truth for current commands,
  supported agents, release versions, data paths, and limitations.
- Distinguish system-boundary observation from application instrumentation,
  model gateways, hosted tracing backends, and runtime enforcement.
- State that recorded sessions can contain prompts, responses, paths, headers,
  and network targets when data handling is relevant.
- Require primary-source links on comparison pages and describe complementary
  use cases as well as differences.
- Do not invent benchmarks, customer deployments, compatibility claims, or
  roadmap commitments.
- Preserve uncertainty. Label proposed workflows and typical scenarios when no
  public case study proves them.
- Keep one canonical page per search intent and reader decision.

## Brief output

Return:

- proposed title, slug, page type, and reader;
- user problem and decision supported;
- semantic-overlap audit against existing pages;
- source table with the exact claim each source supports;
- outline with a real AgentSight command, artifact, or verification step where
  appropriate;
- internal links and CTA;
- claims to avoid and open evidence gaps.

## Delivery mode

For a run invoked by the external session-level scheduler through
`.github/seo-data/daily-task.md`, lack of distinctness or source support is a
reason to reject the page, not a reason to wait for human review. When a page is
distinct and supported, follow the pinned `$change-seo-site` contract and the
repository's existing CI and deployment paths: use a real non-draft pull
request, complete final self-review, squash merge, exact-commit deployment,
live verification, and a metadata closeout.

The repository must not host or schedule the SEO agent and must not contain a
model-provider credential for this work. Outside the autonomous operating
contract, return the brief without publishing unless the user explicitly asks
for delivery.
