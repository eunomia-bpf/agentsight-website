import Link from 'next/link';
import type { Metadata } from 'next';
import { CommandBlock, Eyebrow, JsonLd, OutcomeList } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const cursorSourceCommit = 'ac1e6cb7a8398c57c1ad0ba04ff032cd271d99c8';
const cursorDocs = `https://github.com/eunomia-bpf/agentsight/blob/${cursorSourceCommit}/docs/agents.md#cursor`;
const cursorPullRequest = 'https://github.com/eunomia-bpf/agentsight/pull/149';
const cursorRelease = 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.4';
const cursorAgentTools = 'https://docs.cursor.com/en/agent/tools';
const cursorSubagents = 'https://cursor.com/changelog/2-4';

export const metadata: Metadata = {
  title: 'AgentSight for Cursor IDE sessions',
  description:
    'Inspect Cursor agent sessions from local transcripts and state metadata without eBPF, sudo, a proxy, or launching Cursor through AgentSight.',
  alternates: { canonical: '/integrations/cursor/' },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function CursorIntegrationPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'AgentSight for Cursor IDE sessions',
      description: metadata.description,
      url: `${site.url}/integrations/cursor/`,
      dateModified: '2026-08-10',
      author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
      publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'AgentSight', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Integrations', item: `${site.url}/integrations/` },
        { '@type': 'ListItem', position: 3, name: 'Cursor', item: `${site.url}/integrations/cursor/` },
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
            <Link href="/integrations/">Integrations</Link>
            <span aria-current="page">Cursor</span>
          </nav>
          <Eyebrow>Cursor integration · AgentSight v1.0.4</Eyebrow>
          <h1>Inspect Cursor agent sessions without attaching eBPF to the IDE.</h1>
          <p className="hero-lede">
            Cursor is a different observability boundary from a local CLI. AgentSight v1.0.4 reads
            Cursor&apos;s local agent transcripts and state metadata instead of asking you to launch the
            IDE through <code>record</code> or attach TLS probes to Electron.
          </p>
          <OutcomeList
            items={[
              'Read prompts, tool calls, file activity, and delegated sub-agent work from local Cursor sessions.',
              'Enrich sessions with model, timing, and workspace metadata when Cursor state is available.',
              'Keep the limits explicit: no live API-body capture and recent Cursor sessions may have no local token totals.',
            ]}
          />
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer: use the agent-native path, not <code>record</code></h2>
              <p>
                AgentSight&apos;s normal CLI workflow observes a process family and, on supported Linux
                binaries, can add TLS plaintext capture. That is the wrong starting point for Cursor.
                The v1.0.4 implementation documents three independent blockers: most Cursor desktop
                installs are on macOS or Windows where the eBPF probes do not load; Electron keeps
                BoringSSL in a large stripped framework/helper rather than the launcher binary; and
                Cursor&apos;s backend traffic uses HTTP/2 Connect with protobuf bodies while AgentSight&apos;s
                LLM extraction expects JSON payloads. Solving only the attach problem would still not
                produce normal LLM events.
              </p>
              <p>
                The supported path therefore starts from the durable artifacts Cursor already writes
                locally. There is no special Cursor launch command and no sudo requirement for this
                path. Existing sessions can appear in AgentSight&apos;s local-session views after Cursor
                has run normally.
              </p>
            </section>

            <section>
              <h2>What AgentSight v1.0.4 reads from Cursor</h2>
              <p>
                The implementation combines two read-only local sources. The transcript is the primary
                source for event-level behavior; Cursor&apos;s state database is optional enrichment. If
                the database is unavailable or locked, the transcript-derived session remains usable
                rather than disappearing.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '720px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Local source</th>
                      <th style={header}>AgentSight uses it for</th>
                      <th style={header}>Important boundary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>~/.cursor/projects/&lt;workspace&gt;/agent-transcripts/</code></td>
                      <td style={cell}>Prompts, assistant output, tool calls, file activity, delegated transcripts, and per-event timestamps.</td>
                      <td style={cell}>This is recorded session history, not a packet or TLS transcript of every backend request.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>state.vscdb</code></td>
                      <td style={cell}>Session start/end timing, model, and working-directory enrichment joined by Cursor&apos;s composer identifier.</td>
                      <td style={cell}>Enrichment is optional; missing or locked database access degrades to parsed transcript data.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Delegated work is folded back into the parent session</h2>
              <p>
                Cursor supports subagents for delegated parts of an agent task. AgentSight&apos;s Cursor
                parser treats the parent transcript as the session candidate and folds delegated
                <code>subagents/*.jsonl</code> work back into that parent. This matters for attribution:
                a file operation performed by delegated work should remain part of the user-visible
                session instead of looking like an unrelated second run.
              </p>
              <p>
                The discovery logic also considers the newest modification time across the parent and
                its delegated transcripts. A later subagent write therefore invalidates the cached
                candidate even when the parent transcript itself did not change. This is a concrete
                compatibility detail from the v1.0.4 implementation, not a generic claim about every
                IDE agent format.
              </p>
            </section>

            <section>
              <h2>Use local-session commands instead of an attach command</h2>
              <p>
                Start with the views that consume local agent history. <code>top</code> includes Cursor
                sessions in the ranked session view, <code>report --local</code> summarizes supported
                native sessions without requiring a recorded AgentSight database, and <code>vis</code>
                can replay transcript-derived file activity for a repository. These commands read the
                artifacts already on disk; they do not need to wrap the Cursor application.
              </p>
              <CommandBlock
                commands={[
                  'agentsight top',
                  'agentsight report --local',
                  'agentsight vis',
                ]}
              />
            </section>

            <section>
              <h2>Cursor and CLI capture answer different questions</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Question</th>
                      <th style={header}>Cursor agent-native path</th>
                      <th style={header}>Typical Linux CLI record path</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>How is data collected?</td>
                      <td style={cell}>Parse Cursor&apos;s local transcript files and optionally enrich from its local state database.</td>
                      <td style={cell}>Observe the selected process family; compatible runtimes can add eBPF/TLS capture.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Does it require sudo?</td>
                      <td style={cell}>No for the local-session path.</td>
                      <td style={cell}>eBPF live capture normally requires elevated tracing privileges.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Are raw live API request/response bodies available?</td>
                      <td style={cell}>No. Cursor support does not come from TLS payload capture.</td>
                      <td style={cell}>Sometimes, when AgentSight supports the exact TLS runtime and plaintext hook point.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Where do tool and file events come from?</td>
                      <td style={cell}>Cursor&apos;s recorded session transcript, including delegated subagent transcripts.</td>
                      <td style={cell}>Application/native session data plus observed system activity, depending on the agent and mode.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Two limitations should change how you interpret the output</h2>
              <p>
                First, recent Cursor sessions may show no token totals. The AgentSight v1.0.4 work
                reports that current Cursor versions stopped recording per-turn usage locally around
                March 2026; older sessions that still contain usage events can expose totals, while a
                zero or absent total on a recent session is expected and should not be reported as an
                AgentSight capture failure.
              </p>
              <p>
                Second, the two sources have different time semantics. Transcript events carry
                minute-resolution timestamps, while session-level timing can be enriched from
                <code>state.vscdb</code>. Database-derived per-event times are intentionally not injected,
                so consumers that cannot read Cursor&apos;s database see the same transcript event model.
                The product change also keeps SQLite enrichment out of the standalone
                <code>agent-session</code> parser; <code>agentpprof</code> and <code>agentvis</code> therefore
                operate on transcript-derived data rather than silently depending on the database.
              </p>
            </section>

            <section>
              <h2>Local does not mean non-sensitive</h2>
              <p>
                Cursor transcripts can contain prompts, assistant output, tool calls, and file paths,
                and AgentSight&apos;s local views are designed to read those records. Treat the source
                files and any derived report or replay as development data that may contain sensitive
                context. Keep raw artifacts local unless you have reviewed what will be exported or
                shared; the same rule applies to AgentSight session databases and reports.
              </p>
            </section>

            <section>
              <h2>Research scope and primary sources</h2>
              <p>
                This integration note was refreshed for AgentSight <strong>v1.0.4</strong>, released on
                10 August 2026 from product commit <code>{cursorSourceCommit}</code>. Cursor&apos;s own
                documentation is useful for understanding the Agent tool surface and subagent model;
                the AgentSight repository remains authoritative for what AgentSight actually parses,
                enriches, and cannot capture.
              </p>
              <ul>
                <li><a href={cursorRelease}>AgentSight v1.0.4 release</a></li>
                <li><a href={cursorDocs}>AgentSight v1.0.4 Cursor and IDE-agent documentation</a></li>
                <li><a href={cursorPullRequest}>AgentSight PR #149 implementation notes and validation</a></li>
                <li><a href={cursorAgentTools}>Cursor Agent tools documentation</a></li>
                <li><a href={cursorSubagents}>Cursor 2.4 subagents release notes</a></li>
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <Link className="arrow-link" href="/use-cases/trace-closed-source-agent-clis/">
              Why observation boundaries differ <span aria-hidden="true">→</span>
            </Link>
            <Link className="arrow-link" href="/guides/agent-flamegraph/">
              Aggregate local agent sessions <span aria-hidden="true">→</span>
            </Link>
            <Link className="arrow-link" href="/security/">
              Review local data handling <span aria-hidden="true">→</span>
            </Link>
            <hr />
            <a className="button button-accent" href={site.demo}>Open the recorded demo</a>
            <a className="button button-outline" href={site.repository}>View AgentSight on GitHub</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
