# SEO plan

## Purpose

Make `agentsight.us` the canonical, technically accurate product website and
engineering publication surface for people evaluating system-level AI-agent
profiling and observability.

The site should help a reader make a concrete decision or understand a real
technical boundary. Long-term search growth should come from useful information
that AgentSight is unusually well positioned to produce: current primary-source
analysis, real system traces, reproducible experiments, product outputs,
limitations, and comparisons across application and operating-system
boundaries.

Maintain at least one substantive search-facing publication or major evergreen
refresh in every rolling 48-hour window. Cadence never overrides source quality
or semantic distinctness. When a new URL would duplicate an existing reader
decision, deepen the existing canonical page instead.

## Positioning

Use this hierarchy consistently:

- broad category: AI agent observability;
- differentiated category: system-level AI agent profiling and observability;
- initial reader: engineers using coding agents and local agent CLIs such as
  Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, MCP servers, and agent
  plugins;
- core jobs: debug slow or expensive runs, inspect child processes and resource
  use, review file/network effects, audit agent extensions, compare observability
  boundaries, and connect model/tool activity to machine activity;
- durable differentiation: independent observation at system boundaries plus
  correlation with agent/model semantics, rather than a claim that native
  application telemetry is weak or unnecessary.

Do not position AgentSight as a generic replacement for every LLM tracing,
OpenTelemetry, gateway, evaluation, or hosted observability product. Explain
which boundary answers each question and where complementary telemetry is the
better design.

## Success signals

- Crawlable canonical pages, valid robots and sitemap output, coherent titles
  and descriptions, working internal links, and successful static builds.
- A qualifying substantive publication in every rolling 48-hour window.
- Distinct coverage of high-value reader decisions without semantic duplicate
  pages.
- Product claims, commands, compatibility, releases, and limitations verified
  against the current `eunomia-bpf/agentsight` repository and primary sources.
- Important pages contain real first-party screenshots, outputs, reports,
  traces, flamegraphs, implementation anchors, or other public-safe artifacts
  when those artifacts improve the answer.
- Evergreen articles expose a direct answer, dated/versioned research scope,
  comparison dimensions, limitations, and primary references in forms that are
  easy for both human readers and answer engines to extract accurately.
- Search Console and GA4 show growing discovery and useful movement from landing
  pages to the live demo, GitHub, releases, related product pages, and canonical
  documentation when finalized data is available.
- A complete operating record with exact PR, CI, deployment, and live
  verification evidence whenever repository or production state changes.

## Daily operating priorities

Use this order when selecting work:

1. Production incidents, failed publication, broken assets or links,
   crawlability/indexing defects, broken analytics, and inaccurate product
   claims.
2. Material product-source drift such as a new release, changed CLI behavior,
   new supported agents, changed screenshots, or updated limitations.
3. Content-SLO deadline: when waiting until the next scheduled daily run would
   exceed 48 hours since the last qualifying publication, publish one
   qualifying article or major evergreen refresh today.
4. New finalized GA4 or Search Console data that identifies a concrete page,
   query cluster, CTR, indexing, engagement, or outbound-action problem.
5. Content-completeness and research opportunities on important existing pages.
6. Semantic-overlap cleanup and durable internal-link improvements.

A normal non-deadline daily run may conclude that no rendered change is
justified. At most one coherent rendered outcome belongs in one main pull
request. Do not combine content publication, a site-wide visual migration, route
changes, and unrelated SEO work into one diff.

## The 48-hour content engine

### What qualifies

A qualifying publication is either:

- a new canonical page for a materially distinct reader problem; or
- a major evergreen refresh of an existing canonical page that adds substantial
  new research, first-party data/artifacts, implementation detail, comparison,
  or reproducible analysis.

A publication counts only after exact-head CI, squash merge, and exact-commit
static publication. Metadata-only work, thin changelog entries, cosmetic copy,
keyword swaps, generic summaries, and duplicate landing pages do not count.

### Topic sources

Every daily cycle should collect candidate questions from:

- new AgentSight releases, commits, README/docs changes, issues, screenshots,
  reports, flamegraphs, CLI behavior, limitations, and public-safe sample runs;
- changes in primary upstreams that affect the observability boundary, including
  Claude Code, Codex, Gemini CLI, OpenTelemetry, MCP, relevant runtimes, TLS
  stacks, containers, and agent tooling;
- concrete engineering questions implied by current use cases: slow runs,
  token/resource attribution, code-review reconstruction, file/network audit,
  MCP/plugin behavior, closed-source CLIs, and cross-agent comparison;
- finalized Search Console query/page movement and GA4 landing-page behavior;
- gaps in existing canonical pages where the reader cannot yet reach a useful
  decision from current content.

Do not create a separate backlog file. Durable candidate themes live in this
plan; short-lived findings and the next candidate live in `status.md` and the
current daily report.

### Candidate selection

Prefer questions that score well on all of these dimensions:

1. **Reader value** — a real engineering decision or debugging question.
2. **Information advantage** — AgentSight or primary-source research can add
   facts that are difficult to reconstruct from generic search results.
3. **Distinctness** — the problem is not already answered by an existing page,
   or the existing page can be materially deepened instead.
4. **Source quality** — product source, official documentation, specifications,
   papers, exact commits, or reproducible first-party observations support the
   central claims.
5. **Durability** — the article can remain useful after the immediate release
   cycle, with versioned sections refreshed when upstream behavior changes.
6. **Product relevance** — the answer naturally demonstrates where AgentSight
   helps without turning the article into a forced advertisement.

### Content families and rotation

Use a mixed portfolio so the site does not become a single-template content
farm. Rotate among:

- **Boundary references:** current primary-source maps of what native agent
  telemetry, OpenTelemetry, gateways, MCP, and system observation can actually
  see.
- **Reproducible run studies:** one bounded real task, exact agent/version,
  environment, AgentSight commands, timeline/process/file/network/resource
  outputs, findings, and limitations.
- **Performance and cost analysis:** Agent Flamegraph, token/resource profiles,
  retry loops, waits, build/test subprocesses, and measured overhead when a
  reproducible measurement exists.
- **Security and extension audits:** MCP servers, skills, plugins, file/network
  effects, data movement, and the difference between declared capabilities and
  observed execution. Avoid sensational threat claims without a public case.
- **Integration deep dives:** Claude Code, Codex, Gemini CLI, runtimes, TLS
  implementations, containers, or OTel export behavior with exact current
  versions/commits and documented limits.
- **Evergreen upgrades:** substantially improve an existing high-intent page
  when its answer, visuals, implementation detail, sources, or limitations have
  become thin relative to what is now known.

Do not force each family to have the same template, word count, or number of
headings. The common requirement is a concrete question and information gain.

### Initial durable topic queue

After the 2026-08-07 system-boundary article, prioritize candidates such as:

- a reproducible slow coding-agent run showing how model time, child processes,
  waits, files, CPU/memory, and retries divide the wall-clock time;
- an MCP-server audit that compares the MCP call/result with the actual child
  processes, paths, and network destinations produced by one bounded task;
- an Agent Flamegraph study using real local sessions to explain where tokens
  accumulate by project, prompt category, model, action, or repeat pattern;
- a primary-source Claude Code observability deep dive that maps native OTel
  events to the complementary system questions AgentSight can answer;
- a Codex or Gemini CLI implementation update when a pinned upstream change
  materially moves the observability boundary;
- a reproducible explanation of TLS capture and the practical differences among
  dynamically linked OpenSSL, statically linked runtimes, Bun/BoringSSL, Node,
  and containerized processes;
- a methods article for measuring AgentSight capture overhead with workload,
  kernel, hardware, sampling/capture mode, and confidence limitations stated
  explicitly, only after reproducible measurements are available;
- a repository-replay analysis using Agent Nebula to reconstruct how a coding
  agent read, wrote, renamed, and deleted files during a real public-safe task.

The queue is thematic, not a promise to publish unsupported claims. Replace a
candidate when primary research or semantic-overlap review shows that another
question offers more value.

## SEO and GEO publication quality

Search-facing and generative-answer optimization share the same core quality
requirements here:

- answer a named question early and directly;
- use descriptive titles/headings rather than keyword permutations;
- define the research date, product version, upstream commit, workload, or
  environment when facts can drift;
- expose compact comparison tables, lists, commands, measurements, or boundary
  maps when they clarify the answer;
- link the exact primary source supporting material claims;
- include counterexamples and limitations that prevent overgeneralization;
- use real AgentSight screenshots/artifacts where they carry information, not
  decorative stock art;
- keep one canonical URL per reader decision;
- make internal links follow the reader's next decision rather than a keyword
  graph;
- keep documentation tasks pointed to `eunomia.dev/agentsight/` instead of
  duplicating setup/reference pages on the product site;
- keep TechArticle/Product structured data factual and consistent with visible
  content;
- do not invent statistics, customers, benchmarks, testimonials, rankings,
  security incidents, or roadmap claims.

An answer engine should be able to quote the article's conclusion and identify
why it is supported. A search engine should see a page with original technical
value rather than a paraphrase of results already ranking elsewhere.

## Data-analysis cadence and feedback loop

- Every day: check analytics/export presence and freshness, production health,
  product release/commit drift, public index visibility, content-SLO clock, and
  material anomalies.
- When finalized GA4 or Search Console exports are new or changed: perform a
  comparative analysis against the prior comparable finalized period.
- When exports are unchanged: record freshness and retain the prior conclusion;
  do not repeatedly recompute identical inputs or manufacture an action.
- Weekly: summarize page and query-cluster movement, clicks, impressions, CTR,
  average position, landing-page behavior, users or sessions, engagement, and
  qualified outbound actions when those source columns exist. Also review the
  content mix, 48-hour SLO compliance, pages with impressions but weak CTR,
  pages with ranking movement, and new articles with no indexing signal yet.
- Monthly: review the portfolio for semantic duplication, stale implementation
  claims, weak/unsupported pages, internal-link gaps, and which content families
  produce useful demo/GitHub/docs movement. Prefer consolidating or deepening
  existing canonical pages over unlimited URL growth.
- Longer-term decisions require repeated evidence across comparable periods;
  one noisy day or a partial window is not sufficient for a broad rewrite.

Analytics prioritizes work; it does not define all valuable topics. Early or
low-volume content can still be justified by a strong product question,
first-party artifact, new upstream implementation fact, or durable technical
reference opportunity.

## Visual and information strategy

Align the product site's visual language with the current Eunomia family without
changing URLs, canonical ownership, or navigation meaning. Preserve AgentSight
as a recognizable product rather than cloning the documentation site.

Use these current Eunomia cues as the target family:

- light/white canvas with subtle technical grid or mist treatment;
- `#091627` dark ink and slate text/borders;
- cyan/azure as the primary informational accent;
- restrained `#ff9f1c` orange for selective emphasis rather than a full gradient
  palette;
- system sans body type with a restrained serif display treatment where it
  improves hierarchy;
- compact rounded cards, low-contrast borders, dark code/terminal surfaces,
  clear focus states, and restrained shadows;
- credibility, product-source, research, and open-source information presented
  as readable product facts rather than decorative badges.

Implement visual alignment in independently reviewable phases:

1. shared color/type/card/button/header/footer tokens and surfaces while keeping
   current routes, nav items, copy structure, and product screenshots;
2. homepage information hierarchy and richer first-party product/research facts
   using existing destinations and sections;
3. hub/detail/article surface consistency for tables, code, sources, related
   reading, and long-form technical content.

Each phase must have its own production baseline, representative unaffected
routes, mobile/desktop acceptance checks, exact deployment, and rollback point.
A visual phase must not silently migrate routes, duplicate documentation, or
reset the 48-hour content clock unless it also contains a genuinely qualifying
substantive publication—which routine design work normally should not.

## Operating constraints

- Scheduling is owned by an authorized external session-level task, not this
  repository. The scheduler prompt stays thin and invokes the current
  repository entrypoint; this repository is the authority.
- Do not add a GitHub Actions agent workflow, repository cron, webhook, hosted
  model runner, provider SDK, or model-provider credential for SEO execution.
- Raw analytics and private identifiers stay outside Git.
- Every automated change uses a fresh `seo/agentsight-` branch and a real
  non-draft pull request unless an owner-directed maintenance branch is
  explicitly appropriate for protected control-plane work.
- Required and expected existing CI must pass before final automated
  self-review and squash merge.
- Site changes wait for the exact squash commit's normal production publication
  and public verification.
- Post-merge evidence is recorded through a metadata-only closeout pull request
  when it could not have existed before the rendered merge.
- Normal operation requires no human approval.
- The protected operating control plane in `daily-task.md` is not editable by
  normal SEO cycles.
- No off-site automated posting, link schemes, fabricated data, invented
  benchmarks, customer claims, or roadmap promises.

Short-term findings and daily decisions belong in `daily/`, `status.md`, or
repository issues. This file contains durable strategy and the content-theme
queue; do not create a parallel content-planning file.
