import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, JsonLd, OutcomeList } from './PageParts';
import { SiteShell } from './SiteShell';
import { contentPath, type ContentPage } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const sourceBase = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const pprofReadme = `${sourceBase}/ext/pprof/README.md`;
const pprofGuide = `${sourceBase}/docs/agentpprof.md`;
const flamegraphSkill = `${sourceBase}/skills/agentpprof-flamegraph/SKILL.md`;
const tokenCli = `${sourceBase}/collector/src/cli_db.rs`;
const tokenView = `${sourceBase}/ext/analysis/src/view/mod.rs`;
const reportCli = `${sourceBase}/collector/src/main.rs`;
const exampleGallery = `${sourceBase}/docs/flamegraph-example`;
const tokenExample = `https://raw.githubusercontent.com/eunomia-bpf/agentsight/${productCommit}/docs/flamegraph-example/agentsight-tokens.svg`;

const cell = { border: '1px solid #d8dee8', padding: '0.72rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export function AgentFlamegraphGuide({ page }: { page: ContentPage }) {
  const path = contentPath(page);
  const hub = hubConfig.guide;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: `${site.url}${path}`,
      dateModified: '2026-09-18',
      author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
      publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'AgentSight', item: site.url },
        { '@type': 'ListItem', position: 2, name: hub.eyebrow, item: `${site.url}${hub.path}` },
        { '@type': 'ListItem', position: 3, name: page.title, item: `${site.url}${path}` },
      ],
    },
  ];

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Link href={hub.path}>{hub.eyebrow}</Link>
            <span aria-current="page">{page.title}</span>
          </nav>
          <Eyebrow>Analysis guide · refreshed 18 September 2026 · AgentSight v1.0.31</Eyebrow>
          <h1>{page.title}</h1>
          <p className="hero-lede">
            An Agent Flamegraph is an offline semantic profile of coding-agent history, not a CPU profile, a billing statement, or a live eBPF trace. In AgentSight v1.0.31, <code>agentpprof</code> reads local Codex and Claude Code sessions, projects operations into a configurable semantic stack, and uses width to represent tokens, elapsed time, operation count, file effects, or network effects.
          </p>
          <OutcomeList
            items={[
              'Freeze the input sessions and tagging rules before comparing flamegraphs.',
              'Choose the projection whose width actually matches the engineering question.',
              'Keep semantic aggregation separate from AgentSight token-source reconciliation and provider billing.',
            ]}
          />
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short version: use flamegraphs for aggregation, not chronology</h2>
              <p>
                A timeline is best when you need to know what happened at a particular instant. A semantic flamegraph is better when the question is “where did the model budget accumulate across these sessions?” or “which task families touched the most files?” <code>agentpprof</code> merges operations with the same semantic stack, so repeated behavior becomes wider instead of remaining thousands of isolated events.
              </p>
              <p>
                The stack is a projection over agent activity rather than a literal call stack. The current tool reads agent-native history through AgentSight&apos;s <code>agent-session</code> layer and does not load eBPF probes or require root. That makes it useful for already-recorded local history, but it also means a flamegraph does not independently prove every process, filesystem, network, or resource effect that happened on the host.
              </p>
            </section>

            <section>
              <h2>Start with a frozen input set if the result must be reproducible</h2>
              <p>
                By default, <code>agentpprof --project-root</code> scans recent local Codex and Claude Code sessions that match the project. That is convenient for exploration, but the source set changes as new sessions appear. A publishable comparison should name the project revision and pass explicit <code>--session-file</code> inputs so another reviewer can profile the same records later.
              </p>
              <CommandBlock
                commands={[
                  'agentpprof --project-root /work/repo --session-file ~/.codex/sessions/.../session.jsonl --session-file ~/.claude/projects/.../session.jsonl --view tokens -o tokens.svg',
                  'agentpprof --project-root /work/repo --session-file ~/.codex/sessions/.../session.jsonl --view time -o time.svg',
                ]}
              />
              <p>
                Record the AgentSight version, session files or stable identifiers, project revision, selected view, tag rules, operation mappings, filters, stack definition, and output format. If any of those change, two charts with the same title can represent different measurements.
              </p>
            </section>

            <section>
              <h2>Current agentpprof support is narrower than the shared session parser</h2>
              <p>
                AgentSight&apos;s reusable session layer can normalize several native agent formats, but <code>agentpprof</code> v1.0.31 specifically documents direct local-history input from Codex and Claude Code JSONL. Do not infer flamegraph support for every provider merely because another AgentSight view can discover that provider&apos;s sessions. Treat the <code>agentpprof</code> README and CLI as the compatibility boundary for this guide.
              </p>
              <p>
                This distinction matters when comparing agents. A missing provider in a flamegraph is not evidence that the provider used zero tokens or produced no effects; it can simply be outside the profiler&apos;s current input path.
              </p>
            </section>

            <section>
              <h2>Five views share a stack model but use different units</h2>
              <p>
                Width has no universal meaning. Pick the view before looking for a hotspot, and never compare bar widths from two different views as if they were the same quantity.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '720px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>View</th>
                      <th style={header}>Width means</th>
                      <th style={header}>Question it answers</th>
                      <th style={header}>Important caveat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>operations</code></td>
                      <td style={cell}>One count per prompt, tool, or LLM operation</td>
                      <td style={cell}>Which semantic paths occur most often?</td>
                      <td style={cell}>Frequency is not cost or importance.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>tokens</code></td>
                      <td style={cell}>Reported token count, otherwise a bounded text estimate</td>
                      <td style={cell}>Where did model budget accumulate?</td>
                      <td style={cell}>It is a profile weight, not reconciled billing.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>time</code></td>
                      <td style={cell}>Seconds between successive timestamped events</td>
                      <td style={cell}>Which activities occupy wall-clock intervals?</td>
                      <td style={cell}>It is not sampled CPU time.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>files</code></td>
                      <td style={cell}>File/path effect count</td>
                      <td style={cell}>Which semantic paths touch the most paths?</td>
                      <td style={cell}>A count is not a security verdict.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>network</code></td>
                      <td style={cell}>Network/domain effect count</td>
                      <td style={cell}>Which tasks are associated with destinations?</td>
                      <td style={cell}>Frequency is not payload volume.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>The default stack is a semantic field projection</h2>
              <p>
                Current <code>agentpprof</code> operations are field bags. The default stack is <code>task → skill → phase → action → object → repeat → result → outcome</code>, with an additional <code>token</code> frame in the tokens view. <code>project</code>, <code>agent</code>, and <code>session</code> remain pprof sample labels rather than default frames, so <code>go tool pprof -tags</code> can group them without making every visual stack deeper.
              </p>
              <p>
                <code>--op-map</code> or <code>--op-map-file</code> derives or rewrites operation fields, <code>--where</code> filters after mapping, and <code>--stack</code> plus <code>--stack-rule</code> selects the hierarchy shown in the output. Those transformations are part of the measurement method because they control which operations merge.
              </p>
              <CommandBlock
                commands={[
                  "agentpprof --project-root . --op-map 'task:verify=(?i)cmd=cargo|effect=test' --where 'task=verify' --stack task,action,result,object --view operations -o verify.folded",
                ]}
              />
            </section>

            <section>
              <h2>Tagging quality is part of the measurement, not decoration</h2>
              <p>
                Raw prompts are poor frame names: they are long, multilingual, non-deterministic, and often sensitive. The deterministic workflow uses ordered regex rules; an LLM tagger and an experimental clustering backend can help discover categories, but a reproducible chart should retain the final rules or tag cache that produced its labels.
              </p>
              <p>
                The current v1.0.31 flamegraph skill treats all three unmatched categories — prompts, sessions, and LLM calls — as coverage gates below 5%. Its distribution heuristics aim for roughly 10–20 categories, top-1 share below 40%, top-3 share below 70%, and normalized entropy above 0.7. These are diagnostics for coarse or incomplete taxonomies, not statistical confidence intervals. Never satisfy the thresholds with a catch-all <code>misc</code> rule; that only hides missing classification work.
              </p>
              <CommandBlock
                commands={[
                  "agentpprof --project-root . --tagger regex --tag-rule 'prompt:review=(?i)review|diff|regression' --tag-rule 'prompt:debug=(?i)fix|bug|error|broken' --view tokens -o tagged.json --format json",
                ]}
              />
            </section>

            <section>
              <h2>Agent Flamegraph and report token answer different token questions</h2>
              <p>
                The most important v1.0.31 interpretation boundary is that <code>agentpprof --view tokens</code> and <code>agentsight report token</code> are not interchangeable accounting commands. A flamegraph assigns token weight to semantic stacks from the selected native Codex/Claude sessions. <code>report token</code> summarizes an AgentSight materialized view: with <code>--db</code> it reads a saved database, while the no-DB path imports recent native sessions.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Question</th>
                      <th style={header}><code>agentpprof --view tokens</code></th>
                      <th style={header}><code>agentsight report token</code></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Primary job</td>
                      <td style={cell}>Aggregate token weight under semantic task/action stacks.</td>
                      <td style={cell}>Reconcile and summarize effective token rows by model, provider, process, PID, or working directory.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Input boundary</td>
                      <td style={cell}>Local Codex/Claude Code session files selected by project or explicit file.</td>
                      <td style={cell}>Saved AgentSight DB when supplied; otherwise recent agent-native sessions.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Missing token counts</td>
                      <td style={cell}>Can use bounded text estimates; unsafe huge estimates become <code>unknown=1</code>.</td>
                      <td style={cell}>Uses recorded token rows and source-specific reconciliation; it does not turn absent usage into a text estimate.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Duplicate/source handling</td>
                      <td style={cell}>Profile semantics follow the selected native session records.</td>
                      <td style={cell}>Chooses effective rows by call/source priority and has special aggregate reconciliation for Gemini stdout totals.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                In the current materialized view, response-observed usage has higher priority than orphan response usage, Gemini CLI stdout statistics, Claude telemetry, and agent-native rows for the same effective call key. Gemini aggregate stdout rows also have a separate comparison against captured network totals. That reconciliation is useful for source accounting, but it is not what gives a semantic flamegraph its category widths.
              </p>
              <CommandBlock
                commands={[
                  'agentsight report token --db run.db --group-by model',
                  'agentsight report token --db run.db --group-by dir --json',
                  'agentpprof --project-root . --session-file ~/.codex/sessions/.../session.jsonl --view tokens -o tokens.svg',
                ]}
              />
              <p>
                Therefore, a difference between the two totals is not automatically a bug. First compare the exact session set, whether a saved DB was used, whether network/telemetry/native rows were reconciled, and whether <code>agentpprof</code> had to estimate any missing token counts. Use <code>report token</code> when the question is source accounting; use <code>agentpprof</code> when the question is semantic distribution. Neither command converts token counts into provider invoice cost by itself.
              </p>
            </section>

            <section>
              <h2>Token width has a deliberate failure mode</h2>
              <p>
                Flamegraph token profiles prefer counts reported by the source agent. When those are unavailable, the current implementation can use bounded text estimates. Very large unsafe estimates are recorded as <code>unknown=1</code> rather than allowed to dominate the profile. A wide token bar should therefore be traceable to a reported or bounded source, not silently interpreted as an exact provider bill.
              </p>
              <p>
                For cost analysis, also separate input, output, and cache-related token kinds when the source exposes them. Provider prices, cache discounts, subscription allowances, and model-specific billing rules belong in a separate dated calculation.
              </p>
            </section>

            <section>
              <h2>Output format changes what can leak</h2>
              <p>
                pprof protobuf and folded stacks are useful for tooling; SVG is a self-contained visual artifact; JSON adds redacted session summaries and the stack table. Current <code>agentpprof</code> groups paths outside the selected project root into stable <code>external/*</code> buckets so home-directory names do not have to appear in public profiles. JSON previews are different: <code>--include-previews</code> can include prompt, command, and LLM-output snippets and should only be used on already-sanitized sessions.
              </p>
              <CommandBlock
                commands={[
                  'agentpprof --project-root . --view tokens -o tokens.pb.gz',
                  'agentpprof --project-root . --view time -o time.folded',
                  'agentpprof --project-root . --view files -o files.svg',
                  'agentpprof --project-root . --view network -o network.json',
                ]}
              />
            </section>

            <section>
              <h2>A first-party example shows the format, not your workload</h2>
              <p>
                The AgentSight repository ships token, time, file, network, benchmark, and OSWorld-Human examples. The token image below is pinned to the same v1.0.31 product commit used by this guide. It demonstrates prefix merging and width allocation; it is not a benchmark or a claim about another team&apos;s sessions.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tokenExample}
                alt="AgentSight token semantic flamegraph generated from first-party local coding-agent sessions"
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto', border: '1px solid #d8dee8', borderRadius: '8px', margin: '1.25rem 0' }}
              />
              <p>
                For a real investigation, regenerate the chart from the bounded session set you care about. If the conclusion changes when you switch from tokens to time, that is useful information: model budget and elapsed time are concentrated in different parts of the workflow.
              </p>
            </section>

            <section>
              <h2>Aggregate first, then return to the original session</h2>
              <p>
                Aggregation deliberately removes chronology. A wide <code>review</code> or <code>debug</code> category tells you where to look, but it does not tell you which command failed or why an agent repeated a step. After identifying a hotspot, filter to the relevant project, agent, session, or semantic field and inspect the original trace, AgentSight report, or timeline for the causal sequence.
              </p>
              <p>
                This two-stage workflow is the useful complement to a long span list: aggregate to find dominant categories, then drill into source records only where the profile says budget or effects are concentrated.
              </p>
            </section>

            <section>
              <h2>A reproducible publication needs the method, not only the SVG</h2>
              <p>
                A reviewer should be able to answer: which sessions were included, which AgentSight commit parsed them, which view and unit set width, which tag rules were used, whether operation fields were rewritten, which filters and stack frames were selected, whether previews were enabled, and which project revision the sessions refer to. Save that method next to the image or report.
              </p>
              <p>
                If you compare two periods or agents, keep the taxonomy and stack definition fixed unless the experiment is explicitly about changing them. Otherwise a visual difference can come from the classification method rather than agent behavior.
              </p>
            </section>

            <section className="source-section">
              <h2>Primary and first-party sources</h2>
              <ul>
                <li><a href={pprofReadme}>agentpprof v1.0.31 README: inputs, views, formats, privacy, and selectors</a></li>
                <li><a href={pprofGuide}>AgentSight v1.0.31 semantic flamegraph guide and examples</a></li>
                <li><a href={flamegraphSkill}>AgentSight v1.0.31 iterative tagging workflow and quality gates</a></li>
                <li><a href={reportCli}>AgentSight v1.0.31 report token CLI contract</a></li>
                <li><a href={tokenCli}>AgentSight v1.0.31 report data-source loading</a></li>
                <li><a href={tokenView}>AgentSight v1.0.31 effective-token reconciliation and grouping</a></li>
                <li><a href={exampleGallery}>AgentSight v1.0.31 first-party flamegraph example gallery</a></li>
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <ArrowLink href="/blog/how-agentsight-reconciles-token-usage/">Understand token-source reconciliation</ArrowLink>
            <ArrowLink href="/use-cases/profile-slow-expensive-agent-runs/">Profile a slow or expensive run</ArrowLink>
            <ArrowLink href="/blog/how-agentsight-normalizes-agent-session-data/">See how native sessions are normalized</ArrowLink>
            <hr />
            <a className="button button-accent" href={site.demo}>Open the AgentSight app</a>
            <a className="button button-outline" href={pprofReadme}>Read the current agentpprof reference</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
