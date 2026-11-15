import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/how-agentsight-report-selects-a-session/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;
const title = 'How AgentSight report chooses a database or native history';

export const metadata: Metadata = {
  title,
  description: 'A v1.0.35 source audit of report input selection: explicit SQLite paths, modification-time ordering, agent-native fallback, and AGENTSIGHT_DB_PATH asymmetry.',
  alternates: { canonical: articlePath },
  openGraph: { type: 'article', title, description: 'A source-pinned decision matrix for AgentSight report input provenance.', url: articlePath },
};
const cell = { border: '1px solid #d8dee8', padding: '0.7rem', verticalAlign: 'top' as const };
const head = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const cases = [
  ['report --db run.db', 'run.db', 'Explicit path; unreadable or missing DB raises an error rather than falling back'],
  ['report token --db run.db', 'run.db', 'The token subcommand accepts its own DB path'],
  ['report --db A.db token --db B.db', 'B.db', 'For token/audit/prompts/export/serve, subcommand --db wins'],
  ['report --local token --db run.db', 'Agent-native history', 'The parent --local flag wins over the explicit path'],
  ['report, with agentsight-*.db in CWD', 'Newest filesystem-modified matching DB', 'Modification time, not filename timestamp or SQLite session start'],
  ['report, no agentsight-*.db in CWD', 'Recent agent-native history', 'Emits a warning; imports up to 25 native sessions'],
  ['report list', 'Matching DB filenames in CWD', 'Lists files, not native sessions or all saved captures on disk'],
  ['AGENTSIGHT_DB_PATH=run.db agentsight report', 'Normal report search', 'The environment variable is wired into record/bind, not report'],
] as const;

const examples = [
  ['One named candidate in CWD', 'Selected even if a newer recording exists in another directory'],
  ['A copied old DB gets a new modification time', 'That copy can become the latest selected DB'],
  ['Only run.db exists, not agentsight-*.db', 'No default match: native fallback instead'],
  ['--db missing.db', 'SQLite load fails; regression test confirms no blank DB is created'],
  ['--local with a valid --db for token', 'Native history chosen; explicit DB bypassed'],
  ['Recorder wrote outside CWD via environment variable', 'Report needs an explicit --db to select that file'],
] as const;

const sources = [
  ['Report CLI parsing and precedence', sourceRoot + '/collector/src/main.rs'],
  ['Current-directory DB discovery and mtime sort', sourceRoot + '/collector/src/sources/session_db.rs'],
  ['Native import and missing-DB regression test', sourceRoot + '/collector/src/cli_db.rs'],
  ['Default recorder database location', sourceRoot + '/collector/src/cmd_exec.rs'],
  ['Report fallback warning', sourceRoot + '/collector/src/output/format.rs'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function ReportDatabaseSelectionArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-15',
    dateModified: '2026-11-15',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };
  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><Link href="/blog/">Blog</Link>
            <span aria-current="page">Report input provenance</span>
          </nav>
          <Eyebrow>Evidence provenance · AgentSight v1.0.35 · 15 November 2026</Eyebrow>
          <h1>{title}</h1>
          <p className="hero-lede">
            Without <code>--db</code>, <code>agentsight report</code> reads the most recently
            <strong> filesystem-modified</strong> <code>agentsight-*.db</code> file in the
            current directory. When none matches, it warns and imports recent native
            agent history instead. An unexpectedly different report is not necessarily
            evidence that the recorder failed.
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Why does report show a different run after changing directories?</h2>
              <p>
                The input selector is separate from the event and token aggregation.
                Released <code>report_db_or_local</code> checks the <code>--local</code>
                choice, then the explicit database path, then <code>latest_session_db()</code>.
                That last function scans <em>only</em> the current working directory.
                A change of directory, a copied database with a newer modification
                time, or a missing matching filename can change the underlying source
                without changing the report command.
              </p>
              <p>
                This analysis is pinned to AgentSight v1.0.35 at product commit
                <code>{' ' + productCommit}</code>. It reconstructs the Rust dispatch
                and its regression tests; it is not a new runtime benchmark or a
                production incident. The
                <Link href="/blog/how-agentsight-discovers-local-agent-sessions/">
                  {' '}native session discovery article
                </Link> explains provider history import. This article instead answers
                the narrower decision: <strong>which input a report invocation reads</strong>.
              </p>
            </section>
            <section>
              <h2>Report input decision matrix</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px' }}>
                  <thead><tr><th style={head}>Condition</th><th style={head}>Selected evidence</th><th style={head}>Consequence</th></tr></thead>
                  <tbody>{cases.map(([condition, selected, consequence]) => (
                    <tr key={condition}><td style={cell}><code>{condition}</code></td><td style={cell}>{selected}</td><td style={cell}>{consequence}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              <p>
                The nested-path precedence comes from
                <code> own.as_ref().or(db.as_ref())</code> in the token, audit,
                prompts, export, and serve branches. The summary subcommand has
                its own DB and local values, so avoid mixing contradictory
                parent/subcommand flags. For a repeatable report, specify one
                database path on the command you use.
              </p>
            </section>
            <section>
              <h2>Latest means filesystem mtime, not session time</h2>
              <p>
                <code>sorted_session_dbs</code> includes names beginning
                <code> agentsight-</code> with extension <code>.db</code>, then
                sorts descending by <code>metadata().modified()</code>. It does
                not parse a timestamp from the name, inspect the SQLite session
                start timestamp, or recurse through other directories. A restored
                capture can therefore outrank a chronologically newer run after
                its file modification time changes. Equal or unreadable timestamps
                should not be treated as a guaranteed chronological tie-break.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '740px' }}>
                  <thead><tr><th style={head}>Test condition</th><th style={head}>Expected outcome from the code</th></tr></thead>
                  <tbody>{examples.map(([condition, result]) => (
                    <tr key={condition}><td style={cell}>{condition}</td><td style={cell}>{result}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </section>
            <section>
              <h2>The AGENTSIGHT_DB_PATH configuration asymmetry</h2>
              <p>
                The helper <code>configured_db_path()</code> takes an explicit
                CLI value first, then <code>AGENTSIGHT_DB_PATH</code>. The recorder
                and <code>bind</code> call this helper. In contrast, report dispatch
                invokes <code>report_db_or_local</code> directly. In this release,
                setting the environment variable for recording does not mean
                an unqualified report will read that same file. This is a real
                code-level configuration asymmetry, but not proof of data loss.
              </p>
              <pre><code>{[
                '# Inspect matching databases in the current directory',
                'agentsight report list',
                '',
                '# Use the actual recording path instead of the implicit selection',
                'agentsight report summary --db ./agentsight-20261115-090000.db',
                'agentsight report token --db ./agentsight-20261115-090000.db --json',
                '',
                '# Intentionally choose native agent transcripts',
                'agentsight report --local token --json',
              ].join('\n')}</code></pre>
              <p>
                The path above is illustrative rather than a generated artifact
                or a measured run. Use the actual filename produced by your
                recorder, and do not upload raw session databases publicly:
                they may contain prompts, responses, paths, headers or network
                targets.
              </p>
            </section>
            <section>
              <h2>What happens when no matching DB exists?</h2>
              <p>
                The CLI prints a warning that no <code>agentsight-*.db</code>
                was found in the current directory. The view loader then sets
                its source to agent-native and calls <code>import_recent</code>
                with a limit of 25. Agent-native transcripts can contain model
                and tool information, but are not equivalent to independent
                system-level process, file, and TLS capture from a saved record.
              </p>
              <p>
                An <em>explicit</em> nonexistent SQLite filename follows a
                different path: the loader returns an error. Its regression
                test verifies that it does not silently create a blank DB.
                An empty process list or different token total should therefore
                trigger a provenance check before an assertion about sensor
                loss or capture quality.
              </p>
            </section>
            <section>
              <h2>Reproducible diagnostic checklist</h2>
              <ol>
                <li>Record the working directory, complete invocation, and any parent or nested <code>--db</code>/<code>--local</code> flags.</li>
                <li>Run <code>agentsight report list</code> and inspect matching filenames; use filesystem tools to compare modification times when there is more than one.</li>
                <li>Run a comparison using an explicit known SQLite path. Do not infer the selected run from the amount of activity alone.</li>
                <li>Check whether recording used <code>AGENTSIGHT_DB_PATH</code> to store the DB elsewhere.</li>
                <li>Only after selecting the intended source investigate incomplete event capture, SQLite persistence, or native transcript limitations.</li>
              </ol>
              <p>
                This decision matrix is an implementation-derived test plan,
                not evidence that each scenario was run in a test environment.
                It does not guarantee full telemetry in either evidence mode.
                Keep selected-source provenance with any report used for
                performance, compliance or debugging comparisons.
              </p>
            </section>
            <section>
              <h2>Primary sources</h2>
              <ul>{sources.map(([label, href]) => (
                <li key={href}><a href={href} rel="noopener noreferrer">{label}</a></li>
              ))}</ul>
              <p>
                For supported CLI setup and options, follow the
                <a href="https://eunomia.dev/agentsight/"> canonical AgentSight documentation</a>.
                For data exported after selection, read the
                <Link href="/blog/what-agentsight-json-snapshot-exports-contain/">
                  {' '}JSON snapshot field audit
                </Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
