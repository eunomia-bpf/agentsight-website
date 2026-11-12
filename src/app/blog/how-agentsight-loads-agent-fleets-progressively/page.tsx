import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-loads-agent-fleets-progressively/';

export const metadata: Metadata = {
  title: 'How AgentSight keeps a multi-node agent fleet responsive when one Node is slow',
  description:
    'A source-level walkthrough of AgentSight v1.0.31 progressive fleet loading: concurrent per-Node probes, incremental rendering, stale-refresh guards, transport fallbacks, and lazy session views.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight keeps a multi-node agent fleet responsive when one Node is slow',
    description:
      'See how AgentSight v1.0.31 lets fast Nodes appear before slow peers finish, while keeping stale refreshes and expensive session views out of the critical path.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.31 release',
    'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.31',
  ],
  [
    'Product PR #209: progressive fleet loading, on-demand session views, mobile behavior, and validation',
    'https://github.com/eunomia-bpf/agentsight/pull/209',
  ],
  [
    'v1.0.31 fleet refresh and Node activation implementation',
    `${productSource}/ext/web/page.tsx`,
  ],
  [
    'v1.0.31 session workspace: lazy process/analysis components and detail refresh behavior',
    `${productSource}/ext/web/components/SessionWorkspace.tsx`,
  ],
  [
    'v1.0.31 Node client: request timeouts, Direct/relay transports, and write retry boundary',
    `${productSource}/frontend/src/lib/nodeClient.ts`,
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function ProgressiveFleetLoadingArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight keeps a multi-node agent fleet responsive when one Node is slow',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-06',
    dateModified: '2026-09-06',
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
            <span aria-current="page">Progressive fleet loading</span>
          </nav>
          <Eyebrow>Fleet UI internals · AgentSight v1.0.31 · 6 September 2026</Eyebrow>
          <h1>How AgentSight keeps a multi-node agent fleet responsive when one Node is slow</h1>
          <p className="hero-lede">
            A distributed observability UI has a simple failure mode: wait for every machine before showing any machine, and
            one slow or unreachable Node makes the whole fleet feel down. AgentSight v1.0.31 changes that critical path. It
            probes Nodes concurrently, publishes each completed overview into the visible fleet immediately, rejects stale
            refresh results, and defers heavier session views until a reader actually opens them.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                In AgentSight v1.0.31, a slow Node no longer has to delay useful results from fast peers. The fleet refresh
                starts one asynchronous probe per Node with <code>Promise.all</code>, but each probe calls
                <code>setFleetSamples</code> as soon as its own overview succeeds or fails. The outer promise is therefore an
                end-of-refresh barrier for bookkeeping, not the point at which rows first become visible.
              </p>
              <p>
                This is progressive rendering, not a claim that the network became faster. A particular Node can still take
                time to exhaust its Direct and relay paths, and the fleet-level loading state remains active until all probes
                settle. The useful difference is that already-resolved Nodes are no longer hidden behind the slowest one.
              </p>
            </section>

            <section>
              <h2>Why this is a distributed-systems problem in a frontend</h2>
              <p>
                A fleet page is aggregating independent machines with different failure modes: a laptop may be reachable by a
                browser-local Direct connection, a remote server may only have Controller relay, and another Node may be
                offline. Treating those requests as one atomic page load couples their tail latencies. If nine Nodes answer in
                200 ms and the tenth times out, an all-or-nothing UI can turn a partial-success system into an apparent outage.
              </p>
              <p>
                AgentSight already keeps detailed runtime data authoritative on each Node. The v1.0.31 frontend follows the
                same independence at presentation time: each machine owns its current sample, reachability result, transport,
                and update time instead of waiting for a single fleet response to become complete.
              </p>
            </section>

            <section>
              <h2>The refresh path has two different barriers</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '820px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Stage</th>
                      <th style={header}>What waits</th>
                      <th style={header}>What the user can see</th>
                      <th style={header}>Failure meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Refresh starts</td>
                      <td style={cell}>Nothing per Node yet.</td>
                      <td style={cell}>Existing rows are retained where possible; new rows enter a checking/unreachable placeholder state.</td>
                      <td style={cell}>The fleet is not declared failed just because work is still in flight.</td>
                    </tr>
                    <tr>
                      <td style={cell}>One Node settles</td>
                      <td style={cell}>Only that Node&apos;s Direct/relay attempts.</td>
                      <td style={cell}>Its sample is replaced immediately with online overview data or an unreachable result.</td>
                      <td style={cell}>Slow peers remain independent.</td>
                    </tr>
                    <tr>
                      <td style={cell}>All Node probes settle</td>
                      <td style={cell}>The outer <code>Promise.all</code>.</td>
                      <td style={cell}>The fleet leaves its global loading phase.</td>
                      <td style={cell}>Only if every sample is unreachable does the UI set the fleet-wide “no overview reachable” error.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Step 1: seed per-Node state before the network finishes</h2>
              <p>
                <code>refreshFleet</code> first snapshots the active organization and marks the refresh in flight. It then
                rebuilds the visible sample list from the known cloud Nodes. If a Node already has a sample, that sample is
                kept; otherwise the row starts as <code>checking</code> when there is a Direct connection or cloud session that
                could reach it, and <code>unreachable</code> when no transport exists.
              </p>
              <p>
                Keeping existing samples matters during refresh. The UI does not need to blank an already useful fleet while
                a new read is happening. The transient state belongs to the machine being checked, not to the entire page.
              </p>
            </section>

            <section>
              <h2>Step 2: fan out one independent probe per Node</h2>
              <p>
                The implementation maps the current Node directory to asynchronous probes. Each probe starts with an
                unreachable sample and then tries the transports available for that machine. A browser-saved Direct
                connection is attempted first. A Controller relay client can be attempted when the cloud session exists and
                the relay check reports the Node online.
              </p>
              <p>
                Relay status is also stored per Node. A failed relay probe does not erase a successful Direct result from a
                different machine, and a session-expiration error is handled separately from ordinary reachability failure.
                The transport decision is therefore local to the Node rather than a fleet-wide boolean.
              </p>
            </section>

            <section>
              <h2>Step 3: publish each result before the slowest peer finishes</h2>
              <p>
                The important line is inside the per-Node asynchronous function, before the outer
                <code>Promise.all</code> returns. Once a Node has a usable overview, its sample is marked online with the
                selected transport and an update timestamp. Whether the probe succeeds or exhausts its options, the code then
                replaces only the matching item in <code>fleetSamples</code>.
              </p>
              <p>
                This makes completion order visible. A fast machine can move from checking to online while a slow peer is
                still probing. The final array returned by <code>Promise.all</code> is used to decide whether every Node failed;
                it is not used as a batch payload that must be complete before the first row can render.
              </p>
            </section>

            <section>
              <h2>Generation guards keep old refreshes from winning races</h2>
              <p>
                Progressive updates create a second problem: an older request can finish after the user switches
                organizations or starts a newer activation. AgentSight uses generation counters for directory, fleet, and
                active-Node work. A fleet refresh captures its generation and checks that value before updating relay status,
                replacing a sample, reporting an error, or clearing the loading state.
              </p>
              <p>
                The code also records which organization currently owns the in-flight fleet refresh. Together, these guards
                make a late response harmless instead of allowing stale data from the previous organization to overwrite the
                current view. This is cancellation by result invalidation rather than assuming every underlying request can be
                physically cancelled at the same instant.
              </p>
            </section>

            <section>
              <h2>Session detail is kept out of the fleet critical path</h2>
              <p>
                v1.0.31 also narrows what must be loaded when a reader opens a session. The session workspace defines
                conversation, process, and analysis as separate tabs. <code>ProcessTreeView</code> and
                <code>SessionAnalysis</code> are dynamically imported, and event-display processing is performed only for the
                analysis tab. The initial session detail request is guarded against duplicate concurrent loads, while quiet
                refreshes can follow live-message changes.
              </p>
              <p>
                This does not mean the browser never downloads those components, nor does it establish a device-level latency
                benchmark. It means the source-level dependency graph no longer requires every process/analysis view to be in
                the initial path for every session. Product PR #209 separately reports successful production builds and browser
                tests at narrow viewports, but its asset-size comparison is explicitly not a physical-device load-time result.
              </p>
            </section>

            <section>
              <h2>The request timeout is still part of the tail</h2>
              <p>
                Progressive rendering does not eliminate per-machine timeout behavior. The v1.0.31 browser client uses a
                12-second default request timeout and a 30-second session-request timeout. A slow Direct or relay operation can
                therefore remain in flight while faster peers have already become useful. That is exactly the case progressive
                presentation is designed to tolerate.
              </p>
              <p>
                The same client also avoids automatically replaying ambiguous HTTPS writes. After a failed HTTPS fetch, only
                <code>GET</code> and <code>HEAD</code> reads are eligible for the local-address-space fallback; a write is
                rethrown because the remote side may already have accepted it. That rule is orthogonal to fleet loading, but it
                illustrates the same design principle: retries that are safe for reads are not automatically safe for effects.
              </p>
            </section>

            <section>
              <h2>What v1.0.31 does—and does not—guarantee</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '780px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Claim</th>
                      <th style={header}>v1.0.31 behavior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={cell}>One slow Node blocks every visible result.</td><td style={cell}>No. Completed per-Node samples are written into the fleet as they settle.</td></tr>
                    <tr><td style={cell}>The full refresh completes before the slowest probe settles.</td><td style={cell}>No. The global loading phase still waits for the outer probe set to settle.</td></tr>
                    <tr><td style={cell}>A late result from an old organization can overwrite the new view.</td><td style={cell}>Generation checks suppress stale state updates.</td></tr>
                    <tr><td style={cell}>Process and analysis views must be loaded for every fleet row.</td><td style={cell}>No. They are session-detail views and are dynamically loaded when that workspace needs them.</td></tr>
                    <tr><td style={cell}>The release changes authorization or Controller policy.</td><td style={cell}>No. Product PR #209 explicitly scopes those policies out of the change.</td></tr>
                    <tr><td style={cell}>The release proves lower end-user latency on arbitrary hardware.</td><td style={cell}>No. The source and tests establish the loading behavior; they do not provide a general device-latency benchmark.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>How to inspect the behavior yourself</h2>
              <p>
                The reproducible artifact for this article is the released source, not a synthetic timing number. Start at{' '}
                <a href={`${productSource}/ext/web/page.tsx`}><code>refreshFleet</code> in the v1.0.31 web page</a>. Follow the
                per-Node <code>map</code>, the transport loop, the in-probe <code>setFleetSamples</code>, and then the final
                all-unreachable check after <code>Promise.all</code>. Next inspect{' '}
                <a href={`${productSource}/ext/web/components/SessionWorkspace.tsx`}>the session workspace</a> for dynamic
                process/analysis imports and tab-scoped event processing.
              </p>
              <p>
                Product PR #209 is useful as the validation record: it documents narrow-screen browser coverage, a slow-Node
                test, pending-send unmount behavior, and the single-attempt failed-HTTPS-write case. The release tag fixes the
                exact product snapshot so future frontend changes do not silently change the claims on this page.
              </p>
            </section>

            <section>
              <h2>Where this fits in the AgentSight architecture</h2>
              <p>
                The broader <Link href="/architecture/">AgentSight architecture page</Link> explains why detailed runtime data
                remains Node-authoritative and how Direct and Controller paths fit together. The
                <Link href="/blog/how-agentsight-direct-node-credentials-work/"> Direct Node credential article</Link> owns the
                pairing and capability model. This page owns a narrower question: once the browser has several machines it can
                try to reach, how does the fleet UI avoid making the slowest machine the visibility barrier for every other
                one?
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <div className="detail-aside-card">
              <Eyebrow>Research scope</Eyebrow>
              <p>
                Source-inspected on 6 September 2026 against AgentSight v1.0.31 at <code>bb99b66f8f98</code>. This page
                describes frontend loading and failure-isolation behavior, not a general network-latency benchmark.
              </p>
            </div>
            <div className="detail-aside-card">
              <Eyebrow>Reader decision</Eyebrow>
              <p>
                Use this page when deciding whether one slow or unreachable AgentSight Node makes the rest of a distributed
                fleet unusable in the browser, and what remains on the critical path.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
