import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-event-timeline-bars-mean/';
const title = 'What AgentSight Events timeline bars do—and do not—measure';
const productCommit = '9d33c5b6e9d8586960b6246d40a8cfa87502340c';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title,
  description: 'Commit-pinned AgentSight Events timeline source audit: process lifetimes, matched model calls, aggregate network intervals, native Tool timestamps, and display width limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title,
    description: 'Understand why a displayed cross-source event bar is not necessarily a measured operation duration.',
    url: articlePath,
  },
};

const cases = [
  ['Process starts at 1,000 ms; no exit; capture ends 20,000 ms', 'Open bar extends to 20,000 ms', 'Observed start, but no confirmed exit or 19-second successful execution'],
  ['A child command has exit_code 2', 'Failed process bar; detail contains exit 2', 'The command exited nonzero; total agent outcome is a separate question'],
  ['Captured model requests A and B overlap', 'Captured call IDs pair each request with its response', 'Do not pair each request with the very next response globally'],
  ['The same model call is present in captured and native records', 'PID, start, end and label can collapse duplicate display spans', 'A heuristic is not a proof of perfect source de-duplication'],
  ['An endpoint has 40 aggregated observations, two errors', 'Network target spans first to last timestamps and appears successful', 'Aggregate color is not proof that every request succeeded or that the interval is one request'],
  ['A native transcript Tool row has only one timestamp', 'Point-like span with start equal to end', 'The real Tool duration is unknown; the model did not prove instant execution'],
  ['A Tool reports 3,000 ms start and 6,000 ms duration', 'Reported interval spans to 9,000 ms', 'This is the Tool-reported interval, unlike a process or network window'],
  ['A zero-duration row appears in a 10-second chart', 'Minimum 0.4% draw width produces a 40 ms visual bar', 'Visual width is not source measurement precision'],
] as const;

const sources = [
  ['Span construction, status and model pairing', sourceRoot + '/ext/web/utils/eventSpans.ts'],
  ['Regression fixtures for open processes, overlapping calls, tools and networks', sourceRoot + '/ext/web/utils/eventSpans.test.mjs'],
  ['Chart rendering, minimum bar width, filters and table size', sourceRoot + '/ext/web/components/SessionEvents.tsx'],
  ['Analysis-tab integration', sourceRoot + '/ext/web/components/SessionAnalysis.tsx'],
  ['Master commit introducing the Events implementation', 'https://github.com/eunomia-bpf/agentsight/commit/' + productCommit],
  ['Stable v1.0.35 release at research time', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;
const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function EventTimelineSemanticsArticle() {
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-20',
    dateModified: '2026-11-20',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };
  return (
    <SiteShell>
      <JsonLd value={structured} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Link href="/blog/">Blog</Link>
            <span aria-current="page">Events timeline evidence</span>
          </nav>
          <Eyebrow>Implementation research · master commit 9d33c5b · 20 November 2026</Eyebrow>
          <h1>{title}</h1>
          <p className="hero-lede">
            A timeline bar is not necessarily the duration of one operation. The AgentSight
            Events view reconstructs process lifetimes, model exchanges, network target
            windows, and Tool records from different evidence sources. Some endpoints
            are aggregates, some Tools are timestamps without durations, and some process
            bars end at the last captured moment because no exit was observed.
            <strong> Identify the source type before treating a bar as latency.</strong>
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Scope: source on master, not the stable release</h2>
              <p>
                This audit pins source to commit <code>{productCommit}</code>, merged on
                20 November 2026. At research time, the latest stable release remains
                <strong> v1.0.35</strong>, published before the Events view change.
                Do not assume an installed v1.0.35 binary includes this view.
                Demo snapshots and code fixtures are not benchmark measurements.
                This page documents the new master-branch implementation, not
                a new release or verified production incident.
              </p>
              <p>
                For an earlier layer—converting raw eBPF timestamps and SSE windows—
                see <Link href="/blog/what-agentsight-trace-timestamps-mean/">
                timestamp semantics</Link>. Here the question is how already-normalized
                snapshot records are transformed into <em>displayed</em> spans.
              </p>
            </section>
            <section>
              <h2>Four kinds of span, four evidence contracts</h2>
              <p>
                <code>eventSpans()</code> assembles ordered intervals from process nodes,
                LLM audit events, network targets and network audit events,
                structured Tool calls and native transcript Tool rows. A common
                x-axis does not imply identical durations or confidence.
              </p>
              <ol>
                <li><strong>Exec:</strong> a known start and optional process end.
                  If the end is absent, the span stays open through the capture
                  watermark, even when status is merely observed. An explicit
                  exit code determines success or failure.</li>
                <li><strong>LLM:</strong> captured audit request/response events
                  match using a call identifier even if calls overlap. Native
                  rows without that identity pair a request with a following
                  compatible response from the same process. The display also
                  de-duplicates matching PID/start/end/label combinations.</li>
                <li><strong>Network:</strong> a target row becomes an interval
                  between its first and last observation with aggregate counts.
                  A separate network audit event becomes a point. Neither
                  shape automatically measures the duration of one HTTP call.</li>
                <li><strong>Tool:</strong> structured calls can have explicit
                  start, end or duration fields. Native transcript audit Tool
                  events without duration become instantaneous points. The
                  latter lack enough evidence to reconstruct actual latency.</li>
              </ol>
            </section>
            <section>
              <h2>Eight source-level interpretation cases</h2>
              <p>
                These examples are <strong>synthetic inputs and source-derived
                outputs, not real workload measurements</strong>. The upstream
                <a href={sourceRoot + '/ext/web/utils/eventSpans.test.mjs'}>
                regression tests</a> exercise the important construction cases.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', minWidth: '850px', width: '100%', fontSize: '0.9rem' }}>
                  <thead><tr>
                    <th style={header}>Observation</th>
                    <th style={header}>Displayed construction</th>
                    <th style={header}>What it supports</th>
                  </tr></thead>
                  <tbody>{cases.map(([a,b,c]) => <tr key={a}>
                    <td style={cell}>{a}</td><td style={cell}>{b}</td><td style={cell}>{c}</td>
                  </tr>)}</tbody>
                </table>
              </div>
            </section>
            <section>
              <h2>Why a green network bar can still include errors</h2>
              <p>
                The network target is marked failed only when its count is
                positive and the error count is at least as large as the count.
                In the regression fixture, an endpoint with 40 observations
                and two errors is labeled successful; another endpoint
                with two observations and two errors is failed.
                These are UI aggregate statuses, <strong>not guarantees that
                every request completed successfully</strong>.
              </p>
              <p>
                Likewise, the bar stretches from the first to the last observed
                target timestamp. That duration might contain many requests and
                idle gaps. It is not necessarily one network round trip, one
                connection, or a contiguous task segment. See
                <Link href="/blog/what-agentsight-network-target-counts-mean/">
                network target semantics</Link> for why counts must not be
                equated with unique HTTP transactions or exfiltration events.
              </p>
            </section>
            <section>
              <h2>Rendering changes visible width, not the source interval</h2>
              <p>
                The Events chart gives tiny spans a minimum drawn width of
                <code> 0.4%</code> of the displayed range. In a ten-second range,
                even a zero-duration point can occupy 40 ms of visual width.
                Packing overlapping bars onto separate rows and maintaining
                a small display gap also shape the picture. Color follows
                normalized success, failed, running or unknown status; it is
                not an independent verification of the event.
              </p>
              <p>
                The table initially displays at most 300 visible rows,
                with an option to expand, while kind and failure filters
                change which records appear. Absence from the current view
                is not evidence that an action never occurred. Do not sum
                all bar widths to estimate wall-clock runtime or resource cost.
              </p>
            </section>
            <section>
              <h2>Verify the findings without collecting user data</h2>
              <p>
                Inspect the pinned public source and tests. These commands are
                read-only; they do not attach probes or expose local sessions.
              </p>
              <pre style={{ overflowX: 'auto' }}><code>{'git clone https://github.com/eunomia-bpf/agentsight.git\ncd agentsight\ngit checkout 9d33c5b6e9d8586960b6246d40a8cfa87502340c\nrg -n "eventSpans|llmSpans|networkSpan|toolSpan|MIN_BAR_PERCENT|TABLE_LIMIT" ext/web\nsed -n "1,220p" ext/web/utils/eventSpans.test.mjs'}</code></pre>
              <p>
                If you need evidence of actual command effects, correlate
                the event with a system trace and the
                <Link href="/blog/what-agentsight-process-exit-codes-mean/">
                process exit code semantics</Link>. For missing fields and
                exported-data limits, review the
                <Link href="/blog/what-agentsight-json-snapshot-exports-contain/">
                snapshot contract</Link>. Source timestamps, native-session
                data, and Linux capture have different observation boundaries;
                this visualization cannot reconstruct unobserved activity.
              </p>
            </section>
            <section>
              <h2>Primary sources and limitations</h2>
              <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                This is a source/test audit of an unreleased master-branch UI
                implementation. It does not assert precise latency accuracy,
                real-world capture completeness, a new runtime benchmark,
                or a future release date. CLI installation and configuration
                belong to <a href="https://eunomia.dev/agentsight/">the canonical docs</a>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
