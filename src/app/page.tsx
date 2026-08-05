import Image from 'next/image';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentPages';
import { CommandBlock, Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { getPages } from '@/lib/content';
import { site } from '@/lib/site';

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AgentSight',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux',
  description: site.description,
  url: site.url,
  codeRepository: site.repository,
  license: 'https://opensource.org/license/mit',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
};

const evidence = [
  ['Intent', 'Prompts, turns, and tool decisions'],
  ['Models', 'Calls, tokens, timing, and provider traffic'],
  ['Processes', 'Commands, children, status, CPU, and memory'],
  ['Effects', 'File reads and writes, deletes, and network targets'],
];

export default function HomePage() {
  const featured = [
    getPages('use-case')[0],
    getPages('use-case')[1],
    getPages('use-case')[2],
    getPages('use-case')[3],
    getPages('guide')[2],
    getPages('comparison')[1],
  ].filter((page) => page !== undefined);

  return (
    <SiteShell>
      <JsonLd value={softwareJsonLd} />
      <section className="home-hero">
        <div className="shell home-hero-grid">
          <div className="home-hero-copy">
            <Eyebrow>System-level AI agent observability</Eyebrow>
            <h1>Profile AI agents like programs.</h1>
            <p className="hero-lede">
              Connect prompts and model calls to commands, file rewrites, processes, network activity,
              and resource use—without adding an SDK, proxy, or vendor integration.
            </p>
            <div className="hero-actions">
              <a className="button button-accent" href={site.demo}>
                Explore a recorded run <span aria-hidden="true">→</span>
              </a>
              <a className="button button-outline" href={site.repository}>
                View source on GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="hero-metrics" aria-label="Product characteristics">
              <div><strong>Local-first</strong><span>data path</span></div>
              <div><strong>Zero SDK</strong><span>integration</span></div>
              <div><strong>Open source</strong><span>MIT licensed</span></div>
            </div>
          </div>
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
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div className="window-foot">
              <span>claude</span><span>codex</span><span>gemini</span><span>any command</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section evidence-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>One causal run profile</Eyebrow>
              <h2>Observe the layers normal LLM traces leave apart.</h2>
            </div>
            <p>
              AgentSight brings model activity and operating-system evidence into one investigation
              surface, so an engineer can explain what the agent intended and what the machine did.
            </p>
          </div>
          <div className="evidence-grid">
            {evidence.map(([title, description], index) => (
              <article key={title} className="feature-card">
                <span className="feature-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
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
              OpenCode, OpenClaw, or your own command unchanged, then inspect the saved session or
              export a bounded review artifact.
            </p>
            <Link className="arrow-link" href="/guides/getting-started/">
              Follow the getting-started guide <span aria-hidden="true">→</span>
            </Link>
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
          <div className="section-heading">
            <div>
              <Eyebrow>Engineering decisions</Eyebrow>
              <h2>Use the evidence where the cost of guessing is high.</h2>
            </div>
            <p>
              Begin with a bounded question: why the run was slow, how a patch was generated, what a
              closed CLI executed, or whether an agent extension stayed inside its declared scope.
            </p>
          </div>
          <div className="card-grid">
            {featured.map((page) => (
              <ContentCard key={`${page.kind}:${page.slug}`} page={page} />
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Observer-agent workflow</Eyebrow>
            <h2>Give an independent reviewer the system evidence.</h2>
            <p>
              AgentSight tools collect the run. Analysis skills select the relevant evidence,
              preserve uncertainty, redact sensitive details, and build an artifact for a human or
              another agent to review.
            </p>
          </div>
          <ol className="workflow-list">
            <li><span>1</span><div><strong>Choose the question</strong><p>Performance, code review, compatibility, or extension audit.</p></div></li>
            <li><span>2</span><div><strong>Record the bounded run</strong><p>Capture model and system activity around the selected command.</p></div></li>
            <li><span>3</span><div><strong>Build the artifact</strong><p>Reduce raw events to evidence that supports a concrete decision.</p></div></li>
          </ol>
        </div>
      </section>
    </SiteShell>
  );
}
