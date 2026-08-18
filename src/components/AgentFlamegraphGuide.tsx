import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, JsonLd, OutcomeList } from './PageParts';
import { SiteShell } from './SiteShell';
import { contentPath, type ContentPage } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

const productCommit = '0080545f7c6b110ec2d4a4af5100b58f514c84d5';
const sourceBase = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const pprofReadme = `${sourceBase}/ext/pprof/README.md`;
const pprofGuide = `${sourceBase}/docs/agentpprof.md`;
const flamegraphSkill = `${sourceBase}/skills/agentpprof-flamegraph/SKILL.md`;
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
      dateModified: '2026-08-18',
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
          <Eyebrow>Analysis guide · AgentSight v1.0.25 · 18 August 2026</Eyebrow>
          <h1>{page.title}</h1>
          <p className="hero-lede">
            An Agent Flamegraph is an offline semantic profile of coding-agent history, not a CPU profile and not a live eBPF trace. In AgentSight v1.0.25, <code>agentpprof</code> reads local Codex and Claude Code sessions, projects each operation into a stable semantic stack, and uses width to represent tokens, elapsed time, operation count, file effects, or network effects.
          </p>
          <OutcomeList
            items={[
              'Build a profile from a repeatable, explicit session set instead of a drifting local-history scan.',
              'Interpret every width according to its unit and validate semantic tags before making cost or workflow claims.',
              'Publish useful aggregate artifacts without leaking raw prompts, home-directory paths, or unbounded token estimates.',
            ]}
          />
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short version: use flamegraphs when the question is aggregate</h2>
              <p>
                A timeline is best when you need to know what happened at 14:03. A semantic flamegraph is better when the question is “where did the budget go across this set of sessions?” or “which task families touched the most files?” <code>agentpprof</code> merges operations with the same semantic stack, so repeated behavior becomes wider instead of remaining thousands of isolated events. The chart is a projection over agent activity; it does not claim that natural-language intent is a literal function-call stack.
              </p>
              <p>
                The current implementation is also independent from AgentSight&apos;s live Linux capture path. It reads agent-native history through the <code>agent-session</code> parser and does not load eBPF probes or require root. That distinction matters on macOS and Windows and when you want to profile an existing Codex or Claude Code history without re-running the workload.
              </p>
            </section>

            <section>
              <h2>Start with a frozen input set if you want a reproducible result</h2>
              <p>
                By default, <code>agentpprof --project-root</code> scans recent local Codex and Claude Code sessions matching the project. That is convenient for exploration, but the input set can change as new sessions appear. A publishable comparison should name the project revision and pass explicit <code>--session-file</code> inputs so a second reviewer can run the same source set later.
              </p>
              <CommandBlock
                commands={[
                  'agentpprof --project-root /work/repo --session-file ~/.codex/sessions/.../session.jsonl --session-file ~/.claude/projects/.../session.jsonl --view tokens -o tokens.svg',
                  'agentpprof --project-root /work/repo --session-file ~/.codex/sessions/.../session.jsonl --view time -o time.svg',
                ]}
              />
              <p>
                Record the AgentSight version, session filenames or stable session identifiers, project revision, selected view, tag rules, stack definition, filters, and output format with the artifact. Without those inputs, two charts with the same title may be profiling different data.
              </p>
            </section>

            <section>
              <h2>Five views share a stack model but use different units</h2>
              <p>
                Width has no universal meaning. The current extension exposes five projections, and the same semantic path can be wide in one view and narrow in another. Choose the view before looking for a hotspot.
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
                      <td style={cell}>Source accounting varies; unsafe huge estimates become <code>unknown=1</code>.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>time</code></td>
                      <td style={cell}>Seconds between successive timestamped events</td>
                      <td style={cell}>Which activities occupy wall-clock intervals?</td>
                      <td style={cell}>It is not sampled CPU time and concurrent work can overlap conceptually.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>files</code></td>
                      <td style={cell}>File/path effect count</td>
                      <td style={cell}>Which semantic paths touch the most paths?</td>
                      <td style={cell}>A count does not tell you whether an effect was necessary or risky.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>network</code></td>
                      <td style={cell}>Network/domain effect count</td>
                      <td style={cell}>Which tasks are associated with external destinations?</td>
                      <td style={cell}>Destination frequency is not payload volume or security severity.</td>
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
                This model is intentionally configurable. <code>--op-map</code> or <code>--op-map-file</code> derives or rewrites operation fields, <code>--where</code> filters after mapping, and <code>--stack</code> plus <code>--stack-rule</code> selects the hierarchy shown in the output. A useful analysis states these transformations because they change which paths merge.
              </p>
              <CommandBlock
                commands={[
                  "agentpprof --project-root . --op-map 'task:verify=(?i)cmd=cargo|effect=test' --where 'task=verify' --stack task,action,result,object --view operations -o verify.folded",
                ]}
              />
            </section>

            <section>
              <h2>Tagging quality is part of the measurement method</h2>
              <p>
                Raw prompts are poor frame names: they are long, multilingual, non-deterministic, and often sensitive. <code>agentpprof</code> therefore attaches semantic tags. The deterministic path uses ordered regex rules; an LLM tagger and an experimental clustering path can help discover categories, but a published chart should retain the exact rules or tag cache that produced its labels.
              </p>
              <p>
                The shipped AgentSight flamegraph skill gives operational checks for iterative rule development: drive unmatched prompts, sessions, and LLM calls below 5%; aim for roughly 10–20 categories; keep the largest category below 40% and the top three below 70%; and inspect normalized entropy and unmatched samples. These are workflow heuristics for catching obviously coarse or incomplete taxonomies, not statistical confidence guarantees.
              </p>
              <CommandBlock
                commands={[
                  "agentpprof --project-root . --tagger regex --tag-rule 'prompt:review=(?i)review|diff|regression' --tag-rule 'prompt:debug=(?i)fix|bug|error|broken' --view tokens -o tagged.json --format json",
                ]}
              />
            </section>

            <section>
              <h2>Token width has a deliberate failure mode</h2>
              <p>
                Token profiles prefer counts reported by the source agent. When those are unavailable, the current implementation can use bounded text estimates. Very large unsafe estimates are recorded as <code>unknown=1</code> rather than allowed to dominate the profile. That behavior is worth preserving in any downstream analysis: a wide token bar should be traceable to a reported or bounded source, not silently interpreted as an exact provider bill.
              </p>
              <p>
                For cost comparisons, also separate input, output, and cache-related token kinds when the source exposes them. “Tokens” is an accounting dimension, not a currency conversion; provider pricing, cache discounts, and model-specific billing belong in a separate calculation with their own dated price source.
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
                The AgentSight repository ships token, time, file, network, benchmark, and OSWorld-Human examples. The token image below is pinned to the same v1.0.25 product commit used by this guide. It demonstrates prefix merging and width allocation; it is not a benchmark or a claim about the distribution of another team&apos;s sessions.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tokenExample}
                alt="AgentSight token semantic flamegraph generated from first-party local coding-agent sessions"
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto', border: '1px solid #d8dee8', borderRadius: '8px', margin: '1.25rem 0' }}
              />
              <p>
                For a real investigation, regenerate the chart from the bounded session set you care about. If the conclusion changes when you switch from tokens to time, that is useful information: it means model budget and elapsed time are concentrated in different parts of the workflow.
              </p>
            </section>

            <section>
              <h2>Use the flamegraph to find a category, then return to the session</h2>
              <p>
                Aggregation deliberately removes chronology. A wide <code>review</code> or <code>debug</code> category tells you where to look, but it does not tell you which exact command failed or why an agent repeated a step. After identifying a hotspot, filter to the relevant project, agent, session, or semantic field and inspect the original trace, AgentSight report, or timeline for the causal sequence.
              </p>
              <p>
                This two-stage workflow is the main advantage over reading thousands of spans one by one: aggregate first to find the dominant category, then drill into the original records only where the chart says the budget or effects are concentrated.
              </p>
            </section>

            <section>
              <h2>Three common interpretation mistakes</h2>
              <p>
                First, do not compare widths across different views as if they share a unit. Second, do not treat a semantic tag as ground truth about intent; spot-check samples, especially vague continuation prompts and multilingual fragments. Third, do not treat a file or network count as a security verdict. The projection tells you which observed effects aggregate under a semantic path; authorization and necessity still require context from the task and source session.
              </p>
              <p>
                The same caution applies to time. The current time view derives duration from timestamped event intervals. It is useful for locating wall-clock-heavy semantic regions, but it is not a sampled CPU profiler. Use AgentSight&apos;s runtime resource views when the question is CPU or memory behavior during a live or recorded system-level run.
              </p>
            </section>

            <section>
              <h2>A reproducible publication should include the method, not only the SVG</h2>
              <p>
                A reviewer should be able to answer: which sessions were included, what AgentSight version parsed them, which view and unit set width, which tag rules were used, whether operation fields were rewritten, which filters and stack frames were selected, whether previews were enabled, and which project revision the sessions refer to. Save that method next to the image or report.
              </p>
              <p>
                If you are comparing two periods or two agents, keep the taxonomy and stack definition fixed unless the experiment is explicitly about changing them. Otherwise a visual difference can come from the classification method rather than the agent behavior.
              </p>
            </section>

            <section className="source-section">
              <h2>Primary and first-party sources</h2>
              <ul>
                <li><a href={pprofReadme}>agentpprof v1.0.25 extension README: views, formats, privacy and selectors</a></li>
                <li><a href={pprofGuide}>AgentSight v1.0.25 semantic flamegraph guide and examples</a></li>
                <li><a href={flamegraphSkill}>AgentSight v1.0.25 iterative tagging workflow and quality checks</a></li>
                <li><a href={exampleGallery}>AgentSight v1.0.25 first-party flamegraph example gallery</a></li>
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <ArrowLink href="/use-cases/profile-slow-expensive-agent-runs/">Profile a slow or expensive run</ArrowLink>
            <ArrowLink href="/blog/from-agent-trace-to-review-artifact/">Turn a trace into a review artifact</ArrowLink>
            <ArrowLink href="/ai-agent-file-access-monitoring/">Review agent file access</ArrowLink>
            <hr />
            <a className="button button-accent" href={site.demo}>Open the AgentSight app</a>
            <a className="button button-outline" href={pprofReadme}>Read the current agentpprof reference</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
