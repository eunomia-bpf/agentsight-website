import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/why-agentsight-top-counters-do-not-add/';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/c1574366122a90c451bca6a84713e28813ab95e2';
const title = 'Why AgentSight top does not add native and eBPF counters';

export const metadata: Metadata = {
  title,
  description: 'A source-level v1.0.35 audit of AgentSight top counter provenance: whole-summary fallback, native session precedence, live process enrichment, and three regression-test examples.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title,
    description: 'See why mixed live and native agent evidence is not added together, and when a zero can remain zero despite captured events.',
    url: articlePath,
  },
};

const cases = [
  ['Native 12 events / 4 calls / 100 tokens; capture 5 / 2 / 40', '12 / 4 / 100', 'Native summary wins as a whole; captured counts are not added.'],
  ['Native 0 / 0 / 0; capture 5 / 2 / 40', '5 / 2 / 40', 'Capture summary is the fallback when all three native counters are zero.'],
  ['Native 12 / 4 / 0; capture 5 / 2 / 40', '12 / 4 / 0', 'One nonzero native counter selects the entire native summary; no field-by-field token fallback.'],
] as const;

const sourceLinks = [
  ['AgentSight v1.0.35 LiveView merge and summary selection', sourceRoot + '/collector/src/view/live_top.rs'],
  ['AgentSight v1.0.35 top CLI and live capture options', sourceRoot + '/collector/src/main.rs'],
  ['AgentSight v1.0.35 native-session source model', sourceRoot + '/collector/src/sources/agent_native.rs'],
  ['AgentSight v1.0.35 README: top, record, and report boundaries', sourceRoot + '/README.md'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function TopCounterProvenanceArticle() {
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };

  return (
    <SiteShell>
      <JsonLd value={structured} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><Link href="/blog/">Blog</Link>
            <span aria-current="page">Top counter provenance</span>
          </nav>
          <Eyebrow>Live evidence reconciliation · AgentSight v1.0.35 · 18 November 2026</Eyebrow>
          <h1>{title}</h1>
          <p className="hero-lede">
            <code>agentsight top</code> can observe the same agent through its provider-native session
            and live process/eBPF evidence. Its overview does <strong>not</strong> sum those sources.
            In v1.0.35, any nonzero native summary counter makes the entire native summary authoritative;
            capture counters are used only when all three native summary counters are zero. This prevents
            double counting, but also means a native zero-token total can remain zero when capture
            has a nonzero token estimate.
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The question: why do the numbers not add up?</h2>
              <p>
                A coding agent might produce provider-native transcript entries and also generate live
                captured model/network events. Those are overlapping observations, not independent work.
                Adding the two sets would risk counting the same model call or tokens twice. AgentSight
                therefore chooses a summary source rather than merging numeric fields blindly. In the
                released <code>LiveView::build_top</code> implementation, a native summary is considered
                populated when <em>any</em> of <code>view_events</code>, <code>llm_calls</code>, or
                <code>total_tokens</code> is greater than zero. Otherwise a capture summary is used,
                if present.
              </p>
              <p>
                This is specifically the <strong>live top overview</strong> rule, not a universal
                policy for every report or stored event. A terminal row can still combine a
                native session identity with current process resource data and eBPF activity.
              </p>
            </section>
            <section>
              <h2>Three source-backed examples</h2>
              <p>
                The table transcribes three deterministic regression fixtures from the v1.0.35
                <code> live_top.rs</code> test module. Values are synthetic test inputs, not measured
                production traffic. Each numeric triple is events / LLM calls / total tokens.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead><tr><th style={header}>Input counters</th><th style={header}>Top overview</th><th style={header}>Reason</th></tr></thead>
                  <tbody>
                    {cases.map(([input, output, why]) => (
                      <tr key={input}><td style={cell}>{input}</td><td style={cell}>{output}</td><td style={cell}>{why}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The third case is the important counterexample: native events and calls exist, but
                native tokens are zero. The captured 40 tokens are <em>not</em> substituted. This is
                whole-summary selection, not per-counter coalescing or a maximum across sensors.
                Conversely, the second case does not prove capture always has complete data;
                it only shows what this fallback branch selects when native counters are empty.
              </p>
            </section>
            <section>
              <h2>What still gets enriched from live processes?</h2>
              <p>
                Source priority for top-level model totals does not prevent evidence enrichment.
                First, <code>build_top</code> obtains live process rows and candidate process trees.
                It matches local provider-native sessions to live roots using process information,
                open-descriptor paths, and relevant captured file-audit paths. A matched session row
                can carry native model/tool/token information alongside the live PID, CPU, RSS,
                process-family count, and command context. Unmatched live process rows can remain
                visible separately.
              </p>
              <p>
                When live eBPF audit events exist, <code>apply_live_capture</code> groups observed
                exec, failed exit, file and network counters by PID and traverses each displayed
                process family to enrich its row. It also marks eBPF evidence. These activity
                counters are a different class of evidence from the overview LLM-call and token
                totals; their presence does not authorize adding duplicate model totals.
              </p>
              <p>
                The page also reports explicit provenance notes: native sessions provide primary
                token and tool information, <code>/proc</code> provides CPU/RSS/process families,
                and eBPF provides live process activity. The eBPF capture still does not imply that
                complete TLS payload details are available in <code>top</code>; use the bounded
                <code> record</code> workflow for that question.
              </p>
            </section>
            <section>
              <h2>Sections can have their own source preference</h2>
              <p>
                Even when overview counters come from native sessions, the live top code separately
                builds detail sections. For the Network section, a nonempty captured network
                section may replace the native network section. If there is no useful Processes
                section, the implementation synthesizes one from visible process families. Recent
                failures continue to come from the native session snapshot. Thus the selected
                global counter source does not define the provenance of every row or section.
              </p>
            </section>
            <section>
              <h2>Reproduce the rule without inventing a workload</h2>
              <p>
                The most controlled check is to run the tests included in the exact product
                revision. Their fixtures do not require real provider credentials or live traffic.
                Use a checkout of the pinned commit, then locate the tests and run the collector
                tests with the crate/package configuration documented by that checkout.
              </p>
              <pre><code>{[
                'git checkout c1574366122a90c451bca6a84713e28813ab95e2',
                'rg -n "live_overview_(does_not_add|uses_capture|does_not_mix)" collector/src/view/live_top.rs',
                'rg -n "local_has_counters|overview_summary|apply_live_capture" collector/src/view/live_top.rs',
                '# Compare the three asserted totals with the case matrix above.',
              ].join('\n')}</code></pre>
              <p>
                For a real session, inspect <code>agentsight top</code> while an agent is active;
                preserve both the provider-native transcript and any separately recorded capture
                before reconciling totals. Compare source identity, time window, and aggregation
                scope first. Do not assume every observed process event maps one-to-one to a
                provider model call, or treat a displayed zero as proof of no work.
              </p>
            </section>
            <section>
              <h2>Scope, limitations, and next decision</h2>
              <p>
                This analysis is a <strong>source-level audit of v1.0.35</strong>, with test fixtures
                rather than a new runtime benchmark. It does not establish field accuracy for every
                agent provider, capture completeness, an eBPF runtime overhead result, or whether
                one particular live session experienced duplicate observations. Fields such as
                native token usage can themselves be unavailable or delayed.
              </p>
              <p>
                If the question is why transcript-derived token counts disagree across a
                completed session, see <Link href="/blog/how-agentsight-reconciles-token-usage/">
                token reconciliation</Link>. If a provider-native session cannot be found,
                start with <Link href="/blog/how-agentsight-discovers-local-agent-sessions/">
                native session discovery</Link>. For repeatable saved-run evidence, consult the
                <Link href="https://eunomia.dev/agentsight/"> canonical AgentSight documentation</Link>.
              </p>
            </section>
            <section>
              <h2>Versioned primary sources</h2>
              <ul>{sourceLinks.map(([label, url]) => <li key={label}><Link href={url}>{label}</Link></li>)}</ul>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
