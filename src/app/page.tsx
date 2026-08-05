import Image from 'next/image';
import { ContentCard } from '@/components/ContentPages';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { getPages } from '@/lib/content';
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
  screenshot: `${site.url}/images/top-mode-demo.png`,
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

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>One view of the whole run</Eyebrow>
              <h2>From model request to system activity.</h2>
            </div>
            <p>
              Application traces stop where their instrumentation stops. AgentSight watches the local
              process family and connects agent activity to what happened on the machine.
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
              Start from live sessions, then use the timeline, process tree, resource views, repository
              replay, and flamegraphs to inspect the part of the run that matters.
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
                src={`${site.assetBase}/agentvis/examples/actplane-agent-nebula.gif`}
                alt="Agent Nebula animated replay of coding agent file activity across the ACTplane repository"
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

      <section className={styles.openSourceSection}>
        <div className="shell">
          <div className={styles.openSourceGrid}>
            <div>
              <Eyebrow>Open source and local first</Eyebrow>
              <h2>Run it around the command you already use.</h2>
              <p>
                AgentSight records locally, works with closed-source CLIs, and exports model calls as
                OpenTelemetry GenAI spans when you want to connect it to an existing telemetry stack.
              </p>
              <ul className={styles.openSourceList}>
                <li><span>✓</span> Existing CLI and terminal workflow</li>
                <li><span>✓</span> Local SQLite sessions and web UI</li>
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
              <div><span>03</span><code>agentsight report serve</code></div>
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
