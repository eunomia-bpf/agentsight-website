import Image from 'next/image';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentPages';
import { Icon } from '@/components/Icons';
import { CommandBlock, Eyebrow, JsonLd, SectionHeading } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { getPages } from '@/lib/content';
import { site } from '@/lib/site';

const softwareJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AgentSight',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Linux',
    description: site.description,
    url: site.url,
    codeRepository: site.repository,
    softwareVersion: site.version,
    releaseNotes: site.releaseUrl,
    screenshot: `${site.url}/images/top-mode-demo.png`,
    image: `${site.url}/opengraph-image`,
    license: 'https://opensource.org/license/mit',
    author: { '@type': 'Person', name: site.maintainer.name, url: site.maintainer.url },
    publisher: {
      '@type': 'Organization',
      name: site.organization.name,
      url: site.organization.url,
      logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png` },
    },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
  },
];

const evidence = [
  { icon: 'trace' as const, title: 'Intent', description: 'Prompts, turns, tool decisions, and the question that initiated the run.' },
  { icon: 'token' as const, title: 'Models', description: 'Calls, tokens, timing, provider traffic, and the loops that consumed budget.' },
  { icon: 'process' as const, title: 'Processes', description: 'Commands, children, exit status, CPU, memory, and wait-heavy phases.' },
  { icon: 'network' as const, title: 'Effects', description: 'File access, rewrites, deletes, network targets, and reviewable artifacts.' },
];

const questions = [
  ['time', 'Why was the run slow?', 'Separate model time, shell work, retries, waits, and repeated repository scans.'],
  ['code', 'How was this patch produced?', 'Pair the final diff with commands, tests, failures, touched paths, and remote dependencies.'],
  ['shield', 'Did an extension stay in scope?', 'Compare declared capability with observed subprocess, file, and network effects.'],
  ['eye', 'What did a closed CLI actually do?', 'Observe the process family without requiring source changes, SDK hooks, or a proxy.'],
] as const;

export default function HomePage() {
  const featured = [
    getPages('use-case')[0],
    getPages('use-case')[1],
    getPages('use-case')[3],
    getPages('comparison')[1],
    getPages('guide')[0],
    getPages('integration')[0],
  ].filter((page) => page !== undefined);

  return (
    <SiteShell>
      <JsonLd value={softwareJsonLd} />
      <section className="home-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="shell home-hero-grid">
          <div className="home-hero-copy">
            <a className="release-pill" href={site.releaseUrl}>
              <span className="release-dot" aria-hidden="true" />
              AgentSight v{site.version} is available
              <Icon name="arrow" size={16} />
            </a>
            <Eyebrow>System-level AI agent observability</Eyebrow>
            <h1>Profile AI agents like programs.</h1>
            <p className="hero-lede">
              Connect prompts and model calls to commands, file rewrites, processes, network activity,
              and resource use—without adding an SDK, proxy, or vendor integration.
            </p>
            <div className="hero-actions">
              <a className="button button-accent button-large" href={site.demo}>
                Explore a recorded run <Icon name="arrow" size={18} />
              </a>
              <Link className="button button-outline button-large" href="/guides/getting-started/">
                Record your first run
              </Link>
            </div>
            <div className="hero-proof" aria-label="Product characteristics">
              <div><Icon name="shield" size={18} /><span><strong>Local-first</strong> data path</span></div>
              <div><Icon name="code" size={18} /><span><strong>Zero SDK</strong> integration</span></div>
              <div><Icon name="github" size={18} /><span><strong>MIT</strong> open source</span></div>
            </div>
          </div>
          <div className="hero-console">
            <div className="hero-console-glow" aria-hidden="true" />
            <div className="product-window">
              <div className="window-bar">
                <span><i /> AgentSight live sessions</span>
                <b>recorded demo</b>
              </div>
              <Image
                src="/images/top-mode-demo.png"
                alt="AgentSight live session view showing recorded AI agent activity"
                width={2266}
                height={1034}
                priority
                sizes="(max-width: 900px) 100vw, 52vw"
              />
              <div className="window-foot">
                <span>claude</span><span>codex</span><span>gemini</span><span>any command</span>
              </div>
            </div>
            <div className="floating-signal signal-a"><Icon name="file" size={16} /> 42 touched paths</div>
            <div className="floating-signal signal-b"><Icon name="network" size={16} /> causal network edges</div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Supported workflows">
        <div className="shell trust-inner">
          <span>Observe the tools engineers already use</span>
          <div>
            <strong>Claude Code</strong>
            <strong>Codex</strong>
            <strong>Gemini CLI</strong>
            <strong>OpenCode</strong>
            <strong>Custom agents</strong>
          </div>
        </div>
      </section>

      <section className="section evidence-section">
        <div className="shell">
          <SectionHeading
            eyebrow="One causal run profile"
            title="See the layers normal LLM traces leave apart."
            description="AgentSight joins model activity and operating-system evidence into one investigation surface, so an engineer can explain what the agent intended and what the machine did."
          />
          <div className="evidence-grid">
            {evidence.map((item, index) => (
              <article key={item.title} className="feature-card">
                <div className="feature-card-head">
                  <span className="feature-number">0{index + 1}</span>
                  <span className="icon-badge"><Icon name={item.icon} size={20} /></span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="causal-rail" aria-label="AgentSight evidence flow">
            <span><Icon name="spark" size={17} />Intent</span>
            <i aria-hidden="true" />
            <span><Icon name="token" size={17} />Model calls</span>
            <i aria-hidden="true" />
            <span><Icon name="process" size={17} />Processes</span>
            <i aria-hidden="true" />
            <span><Icon name="file" size={17} />System effects</span>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Bounded engineering questions"
            title="Use evidence where the cost of guessing is high."
            description="Start with a concrete decision. AgentSight is most useful when a dashboard summary is not enough to explain the run."
          />
          <div className="question-grid">
            {questions.map(([icon, title, description]) => (
              <article key={title} className="question-card">
                <span className="icon-badge"><Icon name={icon} size={21} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section boundary-section">
        <div className="shell boundary-grid">
          <div>
            <Eyebrow>Choose the right boundary</Eyebrow>
            <h2>Application traces explain the code you instrument. AgentSight explains the effects the process family produced.</h2>
            <p>
              Keep framework spans, OpenTelemetry, and hosted LLM observability when they provide useful semantic context.
              Add AgentSight when review requires independent evidence about commands, files, network destinations,
              closed-source components, or resource use.
            </p>
            <Link className="arrow-link" href="/compare/">Compare observability approaches <Icon name="arrow" size={17} /></Link>
          </div>
          <div className="boundary-table" role="table" aria-label="Observability boundary comparison">
            <div className="boundary-row boundary-head" role="row">
              <span role="columnheader">Evidence</span>
              <span role="columnheader">App trace</span>
              <span role="columnheader">AgentSight</span>
            </div>
            {[
              ['Internal framework spans', 'Strong', 'Correlates'],
              ['Closed-source CLI', 'Limited', 'System boundary'],
              ['Child processes', 'Partial', 'Attributed'],
              ['File and network effects', 'Hook-dependent', 'Observed'],
              ['Resource profile', 'App-level', 'Process family'],
            ].map(([label, app, agent]) => (
              <div className="boundary-row" role="row" key={label}>
                <strong role="cell">{label}</strong>
                <span role="cell">{app}</span>
                <span role="cell"><Icon name="check" size={15} />{agent}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section artifact-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Proof, not another dashboard"
            title="Reduce a noisy trace into a reviewable artifact."
            description="The useful output is not raw event volume. It is a bounded explanation that keeps source evidence, uncertainty, and the next engineering decision together."
          />
          <div className="artifact-grid">
            <article className="artifact-card">
              <div className="artifact-visual flame-visual" aria-hidden="true">
                <span style={{ width: '100%' }} />
                <span style={{ width: '82%' }} />
                <span style={{ width: '61%' }} />
                <span style={{ width: '38%' }} />
              </div>
              <p className="card-label">Semantic profile</p>
              <h3>Agent Flamegraph</h3>
              <p>Aggregate tokens, time, operations, files, and network activity by stable semantic intent.</p>
              <Link className="arrow-link" href="/guides/agent-flamegraph/">Read the guide <Icon name="arrow" size={17} /></Link>
            </article>
            <article className="artifact-card">
              <div className="artifact-visual trace-visual" aria-hidden="true">
                <span /><i /><span /><i /><span /><i /><span />
              </div>
              <p className="card-label">Causal evidence</p>
              <h3>Run reconstruction</h3>
              <p>Connect a model decision to the command, process, path, destination, and resulting effect.</p>
              <Link className="arrow-link" href="/runs/recorded-demo/">Inspect the demo <Icon name="arrow" size={17} /></Link>
            </article>
            <article className="artifact-card">
              <div className="artifact-visual report-visual" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              <p className="card-label">Review artifact</p>
              <h3>PR execution record</h3>
              <p>Pair a generated diff with tests, failures, retries, touched paths, and unresolved evidence gaps.</p>
              <Link className="arrow-link" href="/runs/review-artifact/">See the workflow <Icon name="arrow" size={17} /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Start with a real run</Eyebrow>
            <h2>Record the agent command you already use.</h2>
            <p>
              AgentSight attaches at the system boundary. Keep Claude Code, Codex, Gemini CLI,
              OpenCode, or your own command unchanged, then inspect the saved session or export a bounded review artifact.
            </p>
            <div className="inline-links">
              <Link className="arrow-link" href="/guides/getting-started/">Getting started <Icon name="arrow" size={17} /></Link>
              <Link className="arrow-link" href="/methodology/">Read the methodology <Icon name="arrow" size={17} /></Link>
            </div>
          </div>
          <CommandBlock
            commands={[
              'cargo install agentsight',
              'sudo agentsight record -- claude',
              'agentsight report export -o snapshot.json',
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Explore by decision"
            title="Go deeper without losing the evidence boundary."
            description="Every page states what AgentSight can observe, which primary source supports the claim, and where uncertainty remains."
          />
          <div className="card-grid">
            {featured.map((page) => (
              <ContentCard key={`${page.kind}:${page.slug}`} page={page} />
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell final-cta-inner">
          <div>
            <Eyebrow>Open source · local first</Eyebrow>
            <h2>Make the next agent run explain itself.</h2>
            <p>Start with the public recorded demo, then capture one bounded task in your own environment.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-accent button-large" href={site.demo}>Explore the demo</a>
            <a className="button button-outline button-large" href={site.repository}><Icon name="github" size={18} />View source</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
