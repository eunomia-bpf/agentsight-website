import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const benchmarkCommit = '0080545f7c6b110ec2d4a4af5100b58f514c84d5';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${benchmarkCommit}`;
const articlePath = '/blog/how-much-overhead-does-agentsight-add/';

export const metadata: Metadata = {
  title: 'How much overhead does AgentSight add?',
  description:
    'Read the AgentSight 2.9% overhead result correctly: the three measured workflows, raw run variability, limits of the 2025 experiment, and how to re-benchmark your workload.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How much overhead does AgentSight add?',
    description:
      'A methods-first reading of AgentSight’s published 2.9% average runtime-overhead result and the raw three-run measurements behind it.',
    url: articlePath,
  },
};

const rows = [
  ['Understand repository', '127.98 s', '132.33 s', '3.4%', '11.76 s → 32.56 s'],
  ['Write code', '22.54 s', '23.64 s', '4.9%', '1.11 s → 4.73 s'],
  ['Compile repository', '92.40 s', '92.72 s', '0.4%', '0.35 s → 0.88 s'],
] as const;

const sources = [
  ['AgentSight paper, evaluation section (arXiv v2)', 'https://arxiv.org/html/2508.02736v2#S5.SS1'],
  ['Raw repository-understanding experiment retained at the v1.0.25 source commit', `${productSource}/docs/experiment/understand-repo/README.md`],
  ['Raw code-writing experiment retained at the v1.0.25 source commit', `${productSource}/docs/experiment/write-code/README.md`],
  ['Raw repository-compilation experiment retained at the v1.0.25 source commit', `${productSource}/docs/experiment/compile-repo/README.md`],
  ['Current v1.0.25 record workflow and saved-session commands', `${productSource}/README.md`],
] as const;

export default function AgentSightOverheadArticle() {
  const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
  const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How much overhead does AgentSight add?',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-21',
    dateModified: '2026-08-21',
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
            <span aria-current="page">AgentSight overhead</span>
          </nav>
          <Eyebrow>Performance methods · 21 August 2026</Eyebrow>
          <h1>How much overhead does AgentSight add?</h1>
          <p className="hero-lede">
            The published AgentSight evaluation reported <strong>2.9% average runtime overhead</strong> across three
            developer workflows. That number is useful, but narrower than a universal “AgentSight costs 3%” claim:
            the three task-level results were 3.4%, 4.9%, and 0.4%, each based on three runs per condition with a
            2025 Claude Code setup.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The direct answer: 2.9% was an average across three end-to-end workflows</h2>
              <p>
                AgentSight’s paper measured wall-clock runtime for repository understanding, code writing, and repository
                compilation with and without AgentSight. The reported task-level overheads were 3.4%, 4.9%, and 0.4%;
                their arithmetic mean is about 2.9%. The result supports a modest historical claim: in those three tested
                workflows, the original system added a small average end-to-end runtime cost. It does not establish a
                fixed overhead for every workload, capture mode, machine, agent, or current release.
              </p>
            </section>

            <section>
              <h2>What exactly was measured?</h2>
              <p>
                The paper records Ubuntu 22.04, Linux 6.14.0, Claude Code 1.0.62, Claude 4, and the
                <code> eunomia-bpf/bpf-developer-tutorial </code> repository. The three workflows were Claude’s
                <code> /init </code> repository-understanding task, generation of a bpftrace CPU-frequency script, and
                a parallel repository build. Each workflow was executed three times without AgentSight and three times
                with AgentSight. The raw experiment records are still available in the current v1.0.25 source tree at
                commit <code>{benchmarkCommit.slice(0, 12)}</code>, which makes it possible to inspect the individual
                timings rather than only the paper’s summary row.
              </p>
            </section>

            <section>
              <h2>The published means and the variability behind them</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Workflow</th>
                      <th style={header}>Baseline mean</th>
                      <th style={header}>AgentSight mean</th>
                      <th style={header}>Mean delta</th>
                      <th style={header}>Sample SD, baseline → AgentSight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row[0]}>{row.map((value) => <td style={cell} key={value}>{value}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The standard deviations above are recomputed from the raw three-run records, not copied from the paper.
                They matter because the sample is small. For repository understanding, the AgentSight runs were
                115.196 s, 111.916 s, and 169.884 s; that last run pulls the mean upward and produces a 32.56 s sample
                standard deviation. For code writing, the AgentSight runs ranged from 20.08 s to 29.01 s. Compilation
                was much tighter: 91.79–93.55 s with AgentSight.
              </p>
            </section>

            <section>
              <h2>This is runtime overhead, not a measured CPU-utilization percentage</h2>
              <p>
                The evaluation question and Table 1 are explicitly about <strong>runtime overhead</strong>. The measured
                quantity is elapsed task time. A 2.9% average wall-clock delta should not be silently restated as “2.9%
                CPU overhead,” because CPU utilization, CPU time, memory pressure, I/O, event volume, and wall-clock
                latency are different metrics. A current deployment can have low elapsed-time impact while still adding
                measurable CPU work, or vice versa when the workload is dominated by remote-model latency.
              </p>
            </section>

            <section>
              <h2>Three runs are enough for a smoke benchmark, not a tight confidence interval</h2>
              <p>
                With only three observations per condition, one slow agent response or external-service delay can move
                the mean materially. The repository-understanding AgentSight median is 115.196 s even though its mean is
                132.332 s; the baseline median is 131.221 s. That reversal is a warning against treating the 3.4% mean
                delta as a stable per-run tax. The compilation mean difference is only 0.32 s, smaller than the 0.88 s
                sample standard deviation of the AgentSight runs. These measurements are useful descriptive evidence,
                but they do not support a precise universal confidence bound.
              </p>
            </section>

            <section>
              <h2>The historical result is not a v1.0.25 performance guarantee</h2>
              <p>
                The benchmark environment used Claude Code 1.0.62 and the implementation described by the 2025 paper.
                AgentSight has changed substantially since then: current v1.0.25 includes additional agent-native,
                saved-session, Direct Node, and frontend workflows alongside Linux eBPF recording. The old benchmark is
                still valuable because the raw measurements are public and the experiment is understandable, but it
                should be cited as a historical evaluation of a particular workload and system configuration. If your
                decision depends on current overhead, benchmark the current binary and the exact capture path you plan
                to deploy.
              </p>
            </section>

            <section>
              <h2>Measure the capture mode you actually intend to use</h2>
              <p>
                “AgentSight overhead” is not one indivisible mechanism. A live Linux recording can include kernel event
                capture, process-lineage filtering, file/network observation, TLS uprobes, userspace parsing, SQLite
                writes, and an optional local web server. By contrast, <code>agentpprof</code> can analyze existing local
                session history offline without running the eBPF capture path at all. Decide first which features matter
                to your deployment, then measure that configuration instead of enabling every signal and generalizing
                the result to lighter modes.
              </p>
            </section>

            <section>
              <h2>A better current benchmark alternates conditions and keeps the raw runs</h2>
              <p>
                For a deployment decision, use the same repository snapshot, agent/model configuration, prompt, machine,
                kernel, network path, cache policy, and AgentSight version. Run more than three repetitions when the
                agent or network is noisy. Alternate or randomize baseline and traced conditions instead of running all
                baselines first, so time-of-day and service drift are less likely to bias one side. Record elapsed time,
                user/system CPU time, peak RSS, and AgentSight event counts; report the individual runs plus median,
                mean, dispersion, and a confidence interval when the sample supports one. For compilation-style tasks,
                state whether caches are warm or cold. For model-heavy tasks, separate provider latency from local
                instrumentation cost where possible.
              </p>
            </section>

            <section>
              <h2>Use the normal record path, but do not confuse correctness with low overhead</h2>
              <p>
                The current product workflow remains <code>sudo agentsight record -- &lt;command&gt;</code>. Before comparing
                timings, confirm that the traced run actually captured the signals you expected; a “fast” run with an
                attachment failure is not a valid overhead measurement. Conversely, a correct trace with higher event
                volume may legitimately cost more than one with aggressive filtering. Performance acceptance should
                therefore pair two tests: did the recorder capture the required behavior, and did the measured cost stay
                inside the latency/resource budget for this workload?
              </p>
              <pre><code>{`# Baseline: repeat the exact workload and retain /usr/bin/time output
/usr/bin/time -f 'elapsed=%e user=%U sys=%S maxrss_kb=%M' <agent-command>

# Traced: repeat the same workload under the current AgentSight recorder
/usr/bin/time -f 'elapsed=%e user=%U sys=%S maxrss_kb=%M' \\
  sudo agentsight record -- <agent-command>`}</code></pre>
            </section>

            <section>
              <h2>What number should you use?</h2>
              <p>
                For describing the published experiment, use: “AgentSight reported 2.9% average end-to-end runtime
                overhead across three tested developer workflows, with per-workflow means of 3.4%, 4.9%, and 0.4%.”
                For capacity planning, do not use 2.9% as a constant. Use a current benchmark of your own representative
                workload and state the AgentSight version, capture mode, environment, repetitions, and variability next
                to the result. The more model- or network-dominated the task, the less an end-to-end percentage tells you
                about the local cost of instrumentation by itself.
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
            <Link href="/use-cases/profile-slow-expensive-agent-runs/">Profile a slow or expensive run</Link>
            <Link href="/guides/agent-flamegraph/">Build an Agent Flamegraph</Link>
            <Link href="/blog/system-boundary-observability/">Native telemetry vs. system observation</Link>
            <hr />
            <a className="button button-accent" href={site.demo}>Open the AgentSight app</a>
            <a className="button button-outline" href={site.repository}>View AgentSight on GitHub</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
