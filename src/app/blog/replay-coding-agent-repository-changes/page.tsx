import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '92d634ec02d116a52acae62eb3b9b00c771e0b9d';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const currentProductCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const currentProductSource = `https://github.com/eunomia-bpf/agentsight/blob/${currentProductCommit}`;
const articlePath = '/blog/replay-coding-agent-repository-changes/';
const nebulaImage = `https://raw.githubusercontent.com/eunomia-bpf/agentsight/${productCommit}/ext/vis/examples/actplane-agent-nebula.png`;

export const metadata: Metadata = {
  title: 'What repository replay can tell you about a coding agent',
  description:
    'Updated for AgentSight v1.0.35: source-tested repository replay path evidence, failed tools, rename identity, Cursor sessions, media compaction, and limits of inferred file actions.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What repository replay can tell you about a coding agent',
    description:
      'A source-verified Agent Nebula guide to file-action confidence, failed tool frames, repository scoping, renames, compact media, and the separation between native logs and system effects.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.26 README: current agentsight vis workflow and platform boundary',
    `${productSource}/README.md`,
  ],
  [
    'agentvis v1.0.26 README: repository scoping, output formats, compaction, and action retention',
    `${productSource}/ext/vis/README.md`,
  ],
  [
    'agentvis v1.0.26 CLI source: path, --global, output, and --compact-rate contract',
    `${productSource}/ext/vis/src/main.rs`,
  ],
  [
    'Agent Nebula design contract: action/effect/intent boundaries and repository projection model',
    `${productSource}/docs/repository-nebula.zh-CN.md`,
  ],
  ['AgentSight v1.0.35 native repository replay projection and regression tests', `${currentProductSource}/ext/vis/src/repository.rs`],
  ['AgentSight v1.0.35 replay event normalization and path-evidence weighting', `${currentProductSource}/ext/vis/web/repository-nebula.js`],
  ['AgentSight v1.0.35 media frame selection and deterministic compaction test', `${currentProductSource}/ext/vis/src/export.rs`],
  ['AgentSight v1.0.35 native Cursor replay source and limitations', `${currentProductSource}/docs/agents.md`],
  ['AgentSight v1.0.35 stable release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
  [
    'Pinned ACTplane Agent Nebula example used in this article',
    nebulaImage,
  ],
] as const;

export default function RepositoryReplayArticle() {
  const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
  const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What repository replay can tell you about a coding agent',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-23',
    dateModified: '2026-11-19',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Link href="/blog/">Blog</Link>
            <span aria-current="page">Repository replay</span>
          </nav>
          <Eyebrow>Agent replay methods · 23 August 2026 · Updated 19 November 2026 for v1.0.35</Eyebrow>
          <h1>What repository replay can tell you about a coding agent</h1>
          <p className="hero-lede">
            A final diff tells you where a repository ended. A transcript tells you everything the agent said and
            called. Repository replay answers a narrower process question: <strong>in what order did the agent move
            through the codebase, and which files changed along the way?</strong> The original walkthrough covered AgentSight v1.0.26. This November 2026 update checks
            v1.0.35 source and regression fixtures, including native Cursor replay. No prior eBPF recording is required,
            but a replayed file action is not proof of a filesystem syscall.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer: replay preserves sequence that a final diff throws away</h2>
              <p>
                Code review usually begins with the final tree because that is the artifact that ships. But the same
                final patch can come from very different paths: inspect first and edit once; edit immediately and then
                repair; repeatedly touch one test; bounce between two modules; or spend most of the run reading files
                that never appear in the diff. Those paths matter when you are debugging an agent workflow or trying to
                understand a long autonomous run after the fact.
              </p>
              <p>
                Agent Nebula turns ordered repository file actions into a replay. Files are the visual objects, path
                areas use stable grouping, and agent actions advance the timeline. The useful claim is deliberately
                bounded: the replay makes the <em>repository trajectory</em> visible. It does not turn file movement
                into a reliable explanation of why the model chose an action.
              </p>
            </section>

            <section>
              <h2>You do not need to have recorded the run with eBPF</h2>
              <p>
                The <code>agentsight vis</code> path is agent-native. Run it inside a Git worktree: it scans
                matching local Claude, Codex, and Gemini sessions, and v1.0.35 also has a repository matcher for Cursor
                transcripts and delegated subagent actions. The replay is built from the Tool actions those agents saved. The product README explicitly lists <code>vis</code> among the
                Windows, macOS, and Linux commands that can operate from native session files without eBPF. That makes
                repository replay useful for a common retrospective case: the agent already worked for hours or days,
                no system recorder was running, and you now want a compact process view.
              </p>
              <pre><code>{`cd your-repository
agentsight vis

# Generate a self-contained interactive artifact instead of the default GIF
agentsight vis -o output/agent-nebula.html`}</code></pre>
              <p>
                This boundary is important. Native session history can recover what the agent logged as Tool actions and
                file targets. It is not equivalent to an independent kernel trace of every descendant process or every
                filesystem operation. If the review requires proof of low-level effects, pair the replay with a recorded
                system trace rather than upgrading the native log into stronger evidence than it actually contains.
              </p>
            </section>

            <section>
              <h2>Worktree matching is part of the reconstruction</h2>
              <p>
                A machine can hold many projects and many agent sessions. Agent Nebula therefore needs a repository
                boundary before it can make a meaningful timeline. The current <code>agentvis</code> documentation says
                normal discovery includes sessions whose working directory, project identity, or Git remote belongs to
                the worktree. That is more useful than merely asking whether a transcript file happened to be created
                while your shell was inside the repository.
              </p>
              <p>
                <code>--global</code> broadens discovery when the relevant session was rooted elsewhere. The flag scans
                every local session and retains operations that target the repository being visualized. This is useful
                for agents launched from a parent workspace, monorepo orchestration, or other cases where session cwd is
                not a sufficient project key. It also gives the flag a concrete meaning: global discovery does not mean
                “draw every file the agent ever touched.” The repository remains the visualization boundary.
              </p>
            </section>

            <section>
              <h2>A missing file effect should remain missing, not become a guessed edit</h2>
              <p>
                A replay becomes misleading if it fills gaps with plausible-looking behavior. The current agentvis
                contract keeps each retained Tool action on the timeline even when no repository file effect can be
                proven. In that case the layout frame stays unchanged instead of inventing a read or write. This small
                rule is one of the most important properties of the visualization: time can advance without the picture
                pretending that a file changed.
              </p>
              <p>
                The deeper Agent Nebula design contract uses the same observation/interpretation split. Native agent
                actions describe what the agent invoked; optional system observations can describe real file effects;
                semantic text is needed to answer “why.” Those sources can be correlated, but none should silently stand
                in for another. Even when you only use the native-session path, that distinction is a good rule for
                reading the replay.
              </p>
            </section>


            <section>
              <h2>Source audit: what creates a star, and what does not?</h2>
              <p>
                The v1.0.35 <code>build_repository_trace</code> pipeline starts from parsed native Tool events,
                not kernel file-open events. Each action has a normalized repository-relative path, access
                operation, and optional previous path. A star therefore represents a <strong>file path inferred
                or reported by a recognized Tool action</strong>. It does not prove that a child process changed
                the bytes on disk, that a write reached storage, or that all related files were observed.
                Candidate sessions must first match the Git worktree, project identity, or recognized remote.
              </p>
              <p>
                <code>resolve_path</code> lexically normalizes paths against the session cwd or an absolute
                path and accepts them only within a matching Git worktree. The source rejects empty paths
                and strings with wildcards, dollar-sign variables, or newlines; files under
                <code> .git</code>, <code>node_modules</code>, <code>target</code>, or
                <code> .cache</code> are ignored. Missing stars can reflect an input-evidence or
                filtering boundary, not proof that no filesystem activity occurred.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '820px', fontSize: '0.92rem' }}>
                  <thead><tr><th style={header}>v1.0.35 source case</th><th style={header}>Timeline event</th><th style={header}>File action</th><th style={header}>What it establishes</th></tr></thead>
                  <tbody>
                    <tr><td style={cell}>Failed Tool names <code>src/failed.rs</code></td><td style={cell}>Retained for an in-repository session</td><td style={cell}>None</td><td style={cell}>A timed Tool was recorded; the failed call alone does not prove a file effect.</td></tr>
                    <tr><td style={cell}>Timed Tool with no path</td><td style={cell}>Retained for an in-repository session</td><td style={cell}>None</td><td style={cell}>Time advances without inventing a star.</td></tr>
                    <tr><td style={cell}>Successful native read of <code>src/read.rs</code></td><td style={cell}>Retained</td><td style={cell}>One read path</td><td style={cell}>A native Tool reported a repository-scoped read target.</td></tr>
                    <tr><td style={cell}>Outside-worktree or ignored dependency path</td><td style={cell}>Can remain as a Tool event</td><td style={cell}>Filtered out</td><td style={cell}>Not evidence of an absent external side effect.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The first three rows come from the in-source
                <code> repository_sessions_keep_every_timed_tool_action</code> test: three timed Tool
                events produce only one qualifying file action. The corresponding
                <code> external_sessions_keep_only_proven_repository_actions</code> test shows the
                stricter <code>--global</code> rule: an unrelated external session's pathless
                Tool event is not kept. These are <strong>deterministic fixtures</strong>, not
                recorded production workloads or measurements.
              </p>
            </section>
            <section>
              <h2>Why can a rename keep one star's identity?</h2>
              <p>
                The Rust projection attaches <code>previous_path</code> to the destination
                of a rename. The JavaScript renderer ignores the separate
                <code>rename_from</code> item, then uses the old and new paths together.
                If an earlier star exists at the old path, <code>applyAction</code>
                moves that same visual node to the new path. If the old node was never
                seen, the renderer creates a new node at the destination rather than
                asserting an unseen prior identity. For directory-scoped renames,
                known descendants are moved as a group; directory membership is
                inferred from tracked Git paths plus observed action paths.
              </p>
              <p>
                This is <em>visual continuity under available path evidence</em>, not
                inode identity or an independent proof of a successful filesystem rename.
                Similarly, a delete action changes a star's displayed lifecycle; it
                does not certify that all later reads were impossible. The Git commit
                timestamps are separate visual milestones, not substitutes for
                native Tool event timestamps.
              </p>
            </section>
            <section>
              <h2>Visual intensity is evidence weighting, not probability</h2>
              <p>
                The v1.0.35 renderer applies a relative visual weight of
                <strong> 1.00</strong> to a direct file Tool, <strong>0.68</strong>
                to recognized search Tools, <strong>0.42</strong> to shell-inferred
                paths, and <strong>0.10</strong> to a directory-scope hint.
                These constants help the replay distinguish concrete file targets
                from broad command or directory attention. They are
                <strong> not calibrated confidence scores</strong>, syscall success
                probabilities, or a measurement of time spent editing.
              </p>
              <p>
                For a reproducible inspection, pin the released source and check the
                projection tests and renderer, then generate a self-contained
                <code> .html</code> replay from a non-sensitive worktree.
              </p>
              <pre><code>{[
                'git checkout c1574366122a90c451bca6a84713e28813ab95e2',
                'rg -n "repository_sessions_keep_every_timed_tool_action|external_sessions_keep_only_proven_repository_actions" ext/vis/src/repository.rs',
                'rg -n "resolve_path|ignored_path|previous_path" ext/vis/src/repository.rs',
                'rg -n "SHELL_EVIDENCE|SEARCH_EVIDENCE|DIRECTORY_SCOPE_EVIDENCE|rename_from" ext/vis/web/repository-nebula.js',
                '# In your separate project worktree, inspect: agentsight vis -o output/agent-nebula.html',
              ].join('\n')}</code></pre>
            </section>
            <section>
              <h2>Diff, transcript, repository replay, and system trace answer different questions</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>View</th>
                      <th style={header}>Best question</th>
                      <th style={header}>What it loses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Final diff</td>
                      <td style={cell}>What source state changed?</td>
                      <td style={cell}>Exploration order, failed attempts, reads, and intermediate edits.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Agent transcript</td>
                      <td style={cell}>What did the agent say, request, and receive?</td>
                      <td style={cell}>Compact spatial understanding of how attention moved through the repository.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Repository replay</td>
                      <td style={cell}>How did file-focused activity move through the codebase over time?</td>
                      <td style={cell}>Intent that was not explicitly logged and low-level effects absent from native actions.</td>
                    </tr>
                    <tr>
                      <td style={cell}>System trace</td>
                      <td style={cell}>Which processes and filesystem/network effects actually occurred?</td>
                      <td style={cell}>Model intent and application semantics unless separately correlated.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The practical workflow is usually compositional rather than competitive. Start with the replay to find
                a phase or repository region worth inspecting, open the final diff to review the resulting code, then
                return to the transcript or a system trace when the question becomes semantic or forensic.
              </p>
            </section>

            <section>
              <h2>The picture is a time series, not a heatmap of the final repository</h2>
              <figure style={{ margin: '1.5rem 0' }}>
                <img
                  src={nebulaImage}
                  alt="Agent Nebula replay of coding-agent file activity across the ACTplane repository"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                <figcaption style={{ marginTop: '0.65rem', color: '#526174', fontSize: '0.92rem' }}>
                  First-party ACTplane example pinned to the AgentSight v1.0.26 source commit. The still image is one
                  view of the same layout sequence used by the replay outputs.
                </figcaption>
              </figure>
              <p>
                A conventional file heatmap can tell you that one module was touched frequently. Repository replay adds
                order: where the agent started, whether attention stayed concentrated, when it crossed directory
                boundaries, and whether it returned repeatedly to the same region. That sequence is often the useful
                clue in autonomous coding work, because “the agent edited these 12 files” does not tell you whether the
                work was a clean progression or a long loop of revisits.
              </p>
            </section>

            <section>
              <h2>Media compaction changes playback density, not the underlying HTML action history</h2>
              <p>
                Long-running agents can produce too many action frames for a useful GIF or MP4. The current agentvis
                CLI therefore has one media compaction control: <code>--compact-rate</code>, defaulting to
                <code>30s</code>. The documentation describes the selection as uniform by action, encoded at 30 fps.
                Use <code>--compact-rate full</code> when every action should become a media frame.
              </p>
              <p>
                HTML has a different contract: it keeps every action and ignores media compaction. That makes the
                self-contained HTML artifact the better review surface when exact step coverage matters, while a compact
                GIF or MP4 is better for quick communication. A reviewer should not mistake a visually compressed media
                export for a lossy source dataset; the choice of output format is part of how the replay is consumed.
                The v1.0.35 <code>compact_media_frames_are_uniform_by_action</code> test selects
                <strong> 900 media frames from 68,222 actions</strong> for a 30-second
                output, including the first and last action. These are fixture numbers,
                not a measured run. Uniform-by-action sampling is not uniform real-time spacing;
                a dense burst can occupy as much visual timeline as a much longer idle interval.
              </p>
              <pre><code>{`agentsight vis . --global \\
  --compact-rate 30s \\
  -o output/agent-nebula.html \\
  -o output/agent-nebula.png \\
  -o output/agent-nebula.gif \\
  -o output/agent-nebula.mp4`}</code></pre>
            </section>

            <section>
              <h2>Use HTML when you need a portable review artifact</h2>
              <p>
                The default AgentSight replay is a GIF. GIF generation needs local Chromium and FFmpeg, while the
                product README documents self-contained HTML as the dependency-light alternative. The standalone
                agentvis implementation can also emit PNG, SVG, GIF, and MP4, and repeated <code>-o</code> arguments
                share one session scan and layout calculation. That lets one reconstruction produce both an interactive
                artifact for inspection and smaller media for a pull request, issue, or research note.
              </p>
              <p>
                “Portable” does not mean “non-sensitive.” Repository paths, project structure, timing, and action shape
                can themselves disclose information. Review an artifact before sharing it outside the environment where
                the sessions originated, just as you would review a trace export or profiling report.
              </p>
            </section>

            <section>
              <h2>What the replay cannot tell you by itself</h2>
              <p>
                A bright path through tests followed by source files may suggest a test-first workflow, but the visual
                pattern alone cannot prove the agent’s reasoning. A repeatedly visited file may represent productive
                iteration, a failing loop, or a normal generated artifact. A Tool action can also omit lower-level work
                done by a child process. The safe interpretation is behavioral: these file-focused actions happened in
                this order according to the available session data.
              </p>
              <p>
                When “why?” matters, return to the original session content and tool results. When “what actually
                happened on the machine?” matters, use system-level process/file/network observation. When “is the final
                code correct?” matters, review the diff, tests, and product behavior. Repository replay is strongest as
                an index into those deeper questions, not as an automatic verdict about agent quality.
              </p>
            </section>

            <section>
              <h2>A practical review sequence for a long coding-agent run</h2>
              <p>
                Start in the repository and create the HTML replay. Scan the whole trajectory once without opening the
                transcript. Identify one or two intervals that look unusually repetitive, unusually broad, or centered
                on files outside the expected task area. Then inspect the final diff and Git history for those regions.
                If the sequence still needs explanation, open the native session around the corresponding Tool actions.
                If the concern is an unlogged subprocess or external file effect, reproduce it under AgentSight’s system
                recorder.
              </p>
              <p>
                This sequence keeps each source doing the job it is good at. The replay compresses a long history into a
                navigable shape; the diff establishes final source state; the transcript restores intent and tool
                context; the system trace supplies independent low-level effects. For multi-day agent work, that is often
                much faster than reading every JSONL event in chronological order and much safer than inferring a whole
                story from the final patch.
              </p>
            </section>

            <section>
              <h2>The current compatibility boundary is intentionally narrower than “all coding agents”</h2>
              <p>
                The August 2026 v1.0.26 walkthrough listed Claude, Codex, and Gemini. That is no longer a
                complete account of the <strong>v1.0.35 source</strong>. The repository candidate matcher now has
                explicit Cursor and CodeBuddy project-directory branches; for Cursor, <code>parse_session_file</code>
                also includes delegated <code>subagents</code> activity, and the product
                <Link href={currentProductSource + '/docs/agents.md'}> agent guide</Link> documents
                <code> agentsight vis</code> for Cursor. Support is conditional on local transcripts actually being
                present and resolvable to this repository. Do not generalize that support to all IDE agents or claim
                that native file replay can recover their encrypted or unlogged process activity.
              </p>
            </section>

            <section className="source-section">
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <Link href="/ai-agent-file-access-monitoring/">File-access monitoring and attribution</Link>
            <Link href="/use-cases/review-ai-generated-prs/">Review AI-generated pull requests</Link>
            <Link href="/guides/agent-flamegraph/">Build an Agent Flamegraph</Link>
            <hr />
            <a className="button button-accent" href={site.demo}>Open the AgentSight app</a>
            <a className="button button-outline" href={site.repository}>View AgentSight on GitHub</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
