import Image from 'next/image';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentPages';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { getPages } from '@/lib/public-content';
import { site } from '@/lib/site';
import styles from './homepage-product-tour.module.css';

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: site.name,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux',
  description: site.description,
  url: site.url,
  codeRepository: site.repository,
  softwareVersion: site.version,
  releaseNotes: site.releaseUrl,
  screenshot: `${site.assetBase}/docs/dashboard-overview.png`,
  license: 'https://opensource.org/license/mit',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
};

const capabilities = [
  {
    title: 'Live agent sessions',
    description: 'See active agents, models, tokens, health, tool calls, file activity, and network activity in one live view.',
    label: 'top',
  },
  {
    title: 'Model and tool activity',
    description: 'Connect prompts, responses, model timing, and tool decisions to the rest of the run.',
    label: 'llm',
  },
  {
    title: 'Processes and resources',
    description: 'Follow commands and child processes with exit status, CPU, memory, I/O, and duration.',
    label: 'proc',
  },
  {
    title: 'Files and network',
    description: 'Track files created, changed, renamed, or deleted and the remote destinations contacted by the run.',
    label: 'io',
  },
];

const productViews = [
  {
    eyebrow: 'Overview dashboard',
    title: 'Start with the whole run.',
    description: 'Review duration, tokens, model calls, processes, files, endpoints, activity over time, resource shape, and friction signals before drilling into detailed views.',
    src: `${site.assetBase}/docs/dashboard-overview.png`,
    alt: 'AgentSight Overview dashboard summarizing duration, tokens, model calls, system effects, resource shape, and friction signals for a recorded AI agent run',
  },
  {
    eyebrow: 'Timeline',
    title: 'Follow the run in order.',
    description: 'Line up model calls, tool activity, processes, file operations, and network events on one timeline.',
    src: `${site.assetBase}/docs/demo-timeline.png`,
    alt: 'AgentSight timeline showing model, process, file, and network events from a recorded AI agent run',
  },
  {
    eyebrow: 'Process tree',
    title: 'See which agent launched each command.',
    description: 'Inspect child processes and file activity under the agent session that caused them.',
    src: `${site.assetBase}/docs/demo-tree.png`,
    alt: 'AgentSight process tree showing agent subprocesses and file activity',
  },
  {
    eyebrow: 'Resource metrics',
    title: 'Find expensive and stalled phases.',
    description: 'Compare CPU and memory behavior with the model and tool activity happening at the same time.',
    src: `${site.assetBase}/docs/demo-metrics.png`,
    alt: 'AgentSight resource metrics showing CPU and memory usage for a recorded AI agent run',
  },
];

const credibility = [
  { value: `v${site.version}`, label: 'Current release' },
  { value: 'MIT', label: 'Open-source license' },
  { value: 'arXiv + ACM', label: 'Published system research' },
  { value: 'OTel GenAI', label: 'Model-call export' },
  { value: 'Local first', label: 'SQLite session artifacts' },
];

const postRunQueries = [
  {
    command: 'agentsight report audit --json',
    title: 'Audit process, file, and API activity',
    description: 'Inspect process spawns, file opens, and captured API activity from a saved run instead of relying on the final agent answer alone.',
    href: '/security/',
    link: 'Review data and security →',
  },
  {
    command: 'agentsight report token',
    title: 'Profile token use across sessions',
    description: 'Summarize token usage from the latest AgentSight database or supported local agent sessions, then move to Agent Flamegraphs for deeper aggregation.',
    href: '/guides/agent-flamegraph/',
    link: 'Explore token profiling →',
  },
  {
    command: 'agentsight report serve',
    title: 'Reopen a recorded session in the web UI',
    description: 'Use the same Overview, timeline, process-tree, log, and metrics views on saved SQLite sessions after the original command has finished.',
    href: site.demo,
    link: 'Open the recorded demo →',
  },
  {
    command: 'agentsight vis',
    title: 'Replay repository changes',
    description: 'Turn local Claude, Codex, and Gemini session history into an Agent Nebula replay of reads, writes, creates, renames, and deletes in a Git worktree.',
    href: '/use-cases/review-ai-generated-prs/',
    link: 'See the review workflow →',
  },
];

export default function HomePage() {
  const featured = [
    getPages('use-case')[0],
    getPages('use-case')[1],
    getPages('use-case')[2],
    getPages('use-case')[3],
    getPages('comparison')[1],
    getPages('integration')[0],
  ].filter((page) => page !== undefined);

  return (
    <SiteShell>
      <JsonLd value={softwareJsonLd} />

      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="shell">
          <a className={styles.releasePill} href={site.releaseUrl}>
            <span>New</span> AgentSight v{site.version} is available <b aria-hidden="true">→</b>
          </a>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <Eyebrow>Open-source observability for AI agents</Eyebrow>
              <h1>See what AI agents actually do.</h1>
              <p className={styles.heroLede}>
                AgentSight is a local-first <code>top</code>/<code>strace</code>-like profiler for AI agents.
                It connects prompts and model calls to commands, files, processes, network activity,
                and resource use—without an SDK or proxy.
              </p>
              <div className="hero-actions">
                <a className="button button-accent button-large" href={site.demo}>
                  Open the live demo <span aria-hidden="true">→</span>
                </a>
                <a className="button button-ghost button-large" href={site.repository}>
                  View on GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className={styles.heroBadges} aria-label="AgentSight product characteristics">
                <span>No SDK</span><span>No proxy</span><span>Linux + eBPF</span><span>MIT licensed</span>
              </div>
            </div>

            <a className={styles.heroProduct} href={site.demo} aria-label="Open the AgentSight recorded demo">
              <div className={styles.windowBar}>
                <span><i /> AgentSight live sessions</span>
                <b>recorded demo</b>
              </div>
              <Image
                src="/images/top-mode-demo.png"
                alt="AgentSight live session view showing AI agent sessions, model calls, processes, files, network activity, and resources"
                width={2266}
                height={1034}
                priority
                sizes="(max-width: 960px) 100vw, 56vw"
              />
              <div className={styles.windowFooter}>
                <span>Live sessions</span><span>Model & tool calls</span><span>Processes & files</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.platformBar} aria-label="Supported agent workflows">
        <div className="shell">
          <p>Works with the agents and runtimes you already use</p>
          <div>
            <span>Claude Code</span><span>Codex</span><span>Gemini CLI</span><span>OpenCode</span>
            <span>OpenClaw</span><span>Python</span><span>Node.js</span><span>Containers</span>
          </div>
        </div>
      </section>

      <section className={styles.credibilitySection} aria-label="AgentSight project facts">
        <div className="shell">
          <div className={styles.credibilityGrid}>
            {credibility.map((item) => (
              <div className={styles.credibilityItem} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>One view of the whole run</Eyebrow>
              <h2>From model request to system activity.</h2>
            </div>
            <p>
              Native agent telemetry is strongest for model, tool, and session semantics. AgentSight adds
              independent process-family, file, network, and resource observations when execution crosses
              those instrumentation boundaries.
            </p>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((item) => (
              <article className={styles.capabilityCard} key={item.title}>
                <span className={styles.capabilityLabel}>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.showcaseSection}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Explore the product</Eyebrow>
              <h2>Move from a busy run to a clear explanation.</h2>
            </div>
            <p>
              Start with the Overview dashboard, then use the timeline, process tree, resource views,
              repository replay, and flamegraphs to inspect the part of the run that matters.
            </p>
          </div>

          <div className={styles.showcaseList}>
            {productViews.map((view, index) => (
              <article className={styles.showcaseRow} key={view.title}>
                <div className={styles.showcaseCopy}>
                  <span className={styles.step}>0{index + 1}</span>
                  <Eyebrow>{view.eyebrow}</Eyebrow>
                  <h3>{view.title}</h3>
                  <p>{view.description}</p>
                  <a className="arrow-link" href={site.demo}>Open this view <span aria-hidden="true">→</span></a>
                </div>
                <a className={styles.showcaseMedia} href={site.demo} aria-label={`Open the ${view.eyebrow} view in the AgentSight demo`}>
                  <img src={view.src} alt={view.alt} loading="lazy" decoding="async" />
                </a>
              </article>
            ))}
          </div>

          <div className={styles.secondaryShowcase}>
            <article className={styles.mediaCard}>
              <div>
                <Eyebrow>Repository replay</Eyebrow>
                <h3>Watch how an agent changed a codebase.</h3>
                <p>Agent Nebula replays file reads, writes, creates, renames, and deletes across a Git worktree.</p>
              </div>
              <img
                src={`${site.assetBase}/agentvis/examples/actplane-agent-nebula.png`}
                alt="Agent Nebula preview showing coding agent file activity across the ACTplane repository"
                loading="lazy"
                decoding="async"
              />
            </article>
            <article className={`${styles.mediaCard} ${styles.flameCard}`}>
              <div>
                <Eyebrow>Agent Flamegraph</Eyebrow>
                <h3>Find where tokens and time went.</h3>
                <p>Aggregate real local agent sessions by project, agent, prompt category, model, and token type.</p>
              </div>
              <img
                src={`${site.assetBase}/docs/flamegraph-example/bpf-benchmark-tokens.svg`}
                alt="AgentSight token flamegraph generated from real local coding agent sessions"
                loading="lazy"
                decoding="async"
              />
            </article>
          </div>
          <p className={styles.sourceNote}>Product screenshots and examples are pinned to AgentSight commit {site.productCommit}.</p>
        </div>
      </section>

      <section className={styles.querySection}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>After the run</Eyebrow>
              <h2>Query the session from several angles.</h2>
            </div>
            <p>
              A recorded run is a reusable local artifact. Use focused report commands, the saved-session web UI,
              repository replay, and profiling views without turning the product website into duplicate CLI documentation.
            </p>
          </div>
          <div className={styles.queryGrid}>
            {postRunQueries.map((item) => (
              <article className={styles.queryCard} key={item.command}>
                <code>{item.command}</code>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.href.startsWith('/') ? <Link href={item.href}>{item.link}</Link> : <a href={item.href}>{item.link}</a>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Built for real engineering work</Eyebrow>
              <h2>Debug slow runs, review changes, and inspect agent tools.</h2>
            </div>
            <p>
              Use AgentSight when the final answer or code diff is not enough to explain how the agent
              reached it or what it changed along the way.
            </p>
          </div>
          <div className="card-grid">
            {featured.map((page) => (
              <ContentCard key={`${page.kind}:${page.slug}`} page={page} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.researchSection}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Research and operating boundaries</Eyebrow>
              <h2>Technical claims should be inspectable.</h2>
            </div>
            <p>
              AgentSight is an open-source systems project with a published paper, versioned source,
              public product artifacts, and explicit data-handling limits. The website should expose those facts directly.
            </p>
          </div>
          <div className={styles.researchGrid}>
            <article className={styles.researchCard}>
              <span className={styles.researchMeta}>Evergreen research · refreshed Aug 2026</span>
              <h3>Native agent telemetry vs. system observation: where does the boundary actually sit?</h3>
              <p>
                We reviewed current Claude Code telemetry, Gemini CLI at an exact commit, Codex OpenTelemetry source,
                OpenTelemetry GenAI conventions, MCP, and AgentSight. Native telemetry is already rich; independent
                system observation becomes most useful when execution crosses into descendant processes and low-level effects.
              </p>
              <Link href="/blog/system-boundary-observability/">Read the boundary map →</Link>
            </article>
            <article className={styles.researchCard}>
              <span className={styles.researchMeta}>Published research</span>
              <h3>AgentSight: System-Level Observability for AI Agents Using eBPF</h3>
              <p>
                The AgentSight paper describes boundary tracing, correlation across model and system activity,
                the system design, and the evaluation behind the project.
              </p>
              <a href="https://arxiv.org/abs/2508.02736">Read the paper on arXiv →</a>
            </article>
            <article className={styles.researchCard}>
              <span className={styles.researchMeta}>Local data handling</span>
              <h3>Recorded sessions are useful because they are detailed—and should be treated as sensitive.</h3>
              <p>
                Session databases and exports can contain prompts, responses, paths, headers, and network targets.
                Keep raw artifacts local or handle them with the same care as other development telemetry.
              </p>
              <Link href="/security/">Read Security and data handling →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.openSourceSection}>
        <div className="shell">
          <div className={styles.openSourceGrid}>
            <div>
              <Eyebrow>Open source and local first</Eyebrow>
              <h2>Run it around the command you already use.</h2>
              <p>
                AgentSight records locally, works with closed-source CLIs, and exports captured model calls as
                OpenTelemetry GenAI spans when you want to connect them to an existing telemetry stack.
              </p>
              <ul className={styles.openSourceList}>
                <li><span>✓</span> Existing CLI and terminal workflow</li>
                <li><span>✓</span> Local SQLite sessions and saved-session web UI</li>
                <li><span>✓</span> eBPF process and file monitoring</li>
                <li><span>✓</span> TLS tracing without a model proxy</li>
              </ul>
              <div className="hero-actions">
                <a className="button button-accent" href={site.docs}>Read the documentation</a>
                <a className="button button-ghost" href={site.releaseUrl}>View v{site.version} release</a>
              </div>
            </div>
            <div className={styles.commandPreview} aria-label="AgentSight example commands">
              <div><span>01</span><code>agentsight top</code></div>
              <div><span>02</span><code>sudo agentsight record -- claude</code></div>
              <div><span>03</span><code>agentsight report audit --json</code></div>
              <div><span>04</span><code>agentsight report token</code></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className="shell">
          <div>
            <Eyebrow>Try AgentSight</Eyebrow>
            <h2>Open a real recorded run in your browser.</h2>
            <p>No registration. Inspect the product before recording a run on your own Linux machine.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-accent button-large" href={site.demo}>Open the demo</a>
            <a className="button button-outline button-large" href={site.repository}>View source</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
