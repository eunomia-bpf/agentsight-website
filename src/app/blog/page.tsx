import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentPages';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { contentPath, getPages } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

const config = hubConfig.blog;
const snapshotContractArticle = {
  title: 'What AgentSight JSON snapshots contain—and what they omit',
  description:
    'A v1.0.35 source-pinned contract for schema 1, bounded audit history, absent per-call LLM rows, sensitive fields and downstream parsing.',
  href: '/blog/what-agentsight-json-snapshot-exports-contain/',
};
const processExitArticle = {
  title: 'What AgentSight process exit codes actually prove',
  description:
    'Inspect v1.0.35 Linux EXEC/EXIT events, status-byte ambiguity, signal termination, lifetime filters and why EXIT 0 is not task success.',
  href: '/blog/what-agentsight-process-exit-codes-mean/',
};
const captureLossArticle = {
  title: 'When AgentSight traces go missing: truncation, event loss, and evidence limits',
  description:
    'Distinguish v1.0.35 clipped TLS payloads, tracer-wide ring-buffer loss, nullable provenance, HTTP parser quarantine, and FILE_OPEN_LOST.',
  href: '/blog/how-agentsight-reports-capture-loss/',
};
const compressedResponseArticle = {
  title: 'Why a captured HTTP response can still look compressed in AgentSight',
  description:
    'Inspect v1.0.35 gzip, deflate, Brotli and Zstandard decoding, incomplete-body safeguards, exact byte semantics and SSE analyzer ordering.',
  href: '/blog/why-agentsight-compressed-http-responses-stay-encoded/',
};
const dockerTlsDiscoveryArticle = {
  title: 'How AgentSight finds TLS attach targets in threaded Docker process trees',
  description:
    'Analyze v1.0.35 worker-thread fork discovery, Docker init-to-SSL executable selection, first-match limitations, and regression tests.',
  href: '/blog/docker-agent-tls-process-discovery/',
};
const fileOpenEvidenceArticle = {
  title: 'What AgentSight FILE_OPEN events prove—and what they miss',
  description:
    'Compare v1.0.35 successful resolved-path opens with syscall fallback, access bits, LRU deduplication, overlay identities, path errors, and loss signals.',
  href: '/blog/what-agentsight-file-open-events-prove/',
};
const pidNamespaceSidecarArticle = {
  title: 'PID namespace tracing for AI agent sidecars: what gets captured?',
  description:
    'Inspect v1.0.35 PID namespace and nested-task filtering, independently launched container processes, cgroup limits, and probe heartbeat evidence.',
  href: '/blog/pid-namespace-scoping-for-agent-sidecars/',
};
const httpCorrelationArticle = {
  title: 'How AgentSight matches HTTP requests to responses in TLS captures',
  description:
    'Inspect v1.0.35 connection-scoped HTTP/1.1 and HTTP/2 exchange matching, inferred legacy evidence, truncated bodies, capture loss, and evidence limits.',
  href: '/blog/how-agentsight-correlates-http-exchanges/',
};
const sessionNormalizationArticle = {
  title: 'How AgentSight normalizes local agent transcripts into one session model',
  description:
    'Follow v1.0.31 provider-native transcript data into the shared AgentSession and SessionEvents IR, including prompts, tool effects, paths, responses, usage, plans, and missing-field boundaries.',
  href: '/blog/how-agentsight-normalizes-agent-session-data/',
};
const otelExportArticle = {
  title: 'How AgentSight exports OpenTelemetry GenAI spans',
  description:
    'Follow a completed v1.0.31 model call from the materialized view to an OTLP/HTTP GenAI CLIENT span, including trace grouping, attributes, privacy defaults, and evidence that stays local.',
  href: '/blog/how-agentsight-exports-opentelemetry-genai-spans/',
};
const tokenReconciliationArticle = {
  title: 'How AgentSight reconciles overlapping token usage',
  description:
    'Reconcile raw token observations, then inspect v1.0.35 Codex mixed-rollout precedence, per-response versus cumulative totals, cached input, and regression tests.',
  href: '/blog/how-agentsight-reconciles-token-usage/',
};
const backgroundMonitorArticle = {
  title: 'How AgentSight background monitoring samples agent sessions',
  description:
    'Trace the v1.0.31 monitor from two-second aggregate windows through 30-second bounded detail samples, weekly SQLite naming, process/file/network semantics, and sampled-evidence limits.',
  href: '/blog/how-agentsight-background-monitoring-works/',
};
const progressiveFleetArticle = {
  title: 'How AgentSight keeps a multi-node agent fleet responsive when one Node is slow',
  description:
    'Trace the v1.0.31 frontend from concurrent per-Node probes through incremental fleet rendering, stale-refresh guards, transport fallbacks, and lazy session views.',
  href: '/blog/how-agentsight-loads-agent-fleets-progressively/',
};
const skillEvolutionArticle = {
  title: 'How AgentSight turns repeated agent failures into skill changes',
  description:
    'Follow the v1.0.30 evidence-gated loop from trajectory source validation and failure ownership through bounded skill patches, held-out evaluation, promotion, and rollback.',
  href: '/blog/how-agentsight-evolves-agent-skills/',
};
const sharedSkillsArticle = {
  title: 'How AgentSight shares versioned agent skills without copying them',
  description:
    'Follow the v1.0.30 bridge from a pinned agent-skills submodule through generated .agents/skills links, overwrite guards, and the Windows junction fallback.',
  href: '/blog/how-agentsight-shares-versioned-agent-skills/',
};
const localSessionDiscoveryArticle = {
  title: 'How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions',
  description:
    'Follow the v1.0.31 discovery path from provider-native files through bounded indexing, Codex and Cursor read-only SQLite enrichment, delegated Cursor token rollup, caching, and lazy detail hydration.',
  href: '/blog/how-agentsight-discovers-local-agent-sessions/',
};
const noEbpfArticle = {
  title: 'When AgentSight works without eBPF—and when it does not',
  description:
    'Choose between agent-native session evidence and independent system observation: see which top, bind, vis, and report workflows work without sudo or eBPF, and when record is still the right sensor.',
  href: '/blog/when-agentsight-works-without-ebpf/',
};
const directNodeCredentialsArticle = {
  title: 'How AgentSight Direct Node credentials work',
  description:
    'Follow the exact v1.0.30 credential path from agentsight bind through URL-fragment pairing, Direct browser capabilities, Controller relay capabilities, and optional encrypted cross-browser Direct sync.',
  href: '/blog/how-agentsight-direct-node-credentials-work/',
};
const auditProvenanceArticle = {
  title: 'How to read AgentSight audit provenance and confidence',
  description:
    'Understand direct capture, SQLite reconstruction, native agent sessions, correlation confidence, legacy fallbacks, and how to preserve evidence lineage in exported snapshots.',
  href: '/blog/read-agentsight-audit-provenance/',
};
const dockerSessionsArticle = {
  title: 'How AgentSight observes AI agent sessions inside Docker',
  description:
    'See how the Docker-backed native-session bridge keeps provider state in the container, routes exact sessions, bounds JSONL operations, and separates AgentSight scope from Docker daemon authority.',
  href: '/blog/observe-ai-agent-sessions-in-docker/',
};
const repositoryReplayArticle = {
  title: 'What repository replay can tell you about a coding agent',
  description:
    'See how Agent Nebula reconstructs ordered repository evolution from local agent sessions, and where replay stops short of explaining intent or low-level system effects.',
  href: '/blog/replay-coding-agent-repository-changes/',
};
const overheadArticle = {
  title: 'How much overhead does AgentSight add?',
  description:
    'Read the published 2.9% average runtime-overhead result with the raw run variability, benchmark limits, and a method for measuring your own workload.',
  href: '/blog/how-much-overhead-does-agentsight-add/',
};

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: { canonical: config.path },
};

export default function BlogPage() {
  const pages = getPages('blog');
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `${site.url}${config.path}`,
    hasPart: [
      ...pages.map((page) => ({ '@type': 'WebPage', name: page.title, url: `${site.url}${contentPath(page)}` })),
      { '@type': 'WebPage', name: snapshotContractArticle.title, url: site.url + snapshotContractArticle.href },
      { '@type': 'WebPage', name: processExitArticle.title, url: site.url + processExitArticle.href },
      { '@type': 'WebPage', name: captureLossArticle.title, url: site.url + captureLossArticle.href },
      { '@type': 'WebPage', name: compressedResponseArticle.title, url: site.url + compressedResponseArticle.href },
      { '@type': 'WebPage', name: dockerTlsDiscoveryArticle.title, url: site.url + dockerTlsDiscoveryArticle.href },
      { '@type': 'WebPage', name: fileOpenEvidenceArticle.title, url: `${site.url}${fileOpenEvidenceArticle.href}` },
      { '@type': 'WebPage', name: pidNamespaceSidecarArticle.title, url: `${site.url}${pidNamespaceSidecarArticle.href}` },
      { '@type': 'WebPage', name: httpCorrelationArticle.title, url: `${site.url}${httpCorrelationArticle.href}` },
      { '@type': 'WebPage', name: sessionNormalizationArticle.title, url: `${site.url}${sessionNormalizationArticle.href}` },
      { '@type': 'WebPage', name: otelExportArticle.title, url: `${site.url}${otelExportArticle.href}` },
      { '@type': 'WebPage', name: tokenReconciliationArticle.title, url: `${site.url}${tokenReconciliationArticle.href}` },
      { '@type': 'WebPage', name: backgroundMonitorArticle.title, url: `${site.url}${backgroundMonitorArticle.href}` },
      { '@type': 'WebPage', name: progressiveFleetArticle.title, url: `${site.url}${progressiveFleetArticle.href}` },
      { '@type': 'WebPage', name: skillEvolutionArticle.title, url: `${site.url}${skillEvolutionArticle.href}` },
      { '@type': 'WebPage', name: sharedSkillsArticle.title, url: `${site.url}${sharedSkillsArticle.href}` },
      { '@type': 'WebPage', name: localSessionDiscoveryArticle.title, url: `${site.url}${localSessionDiscoveryArticle.href}` },
      { '@type': 'WebPage', name: noEbpfArticle.title, url: `${site.url}${noEbpfArticle.href}` },
      { '@type': 'WebPage', name: directNodeCredentialsArticle.title, url: `${site.url}${directNodeCredentialsArticle.href}` },
      { '@type': 'WebPage', name: auditProvenanceArticle.title, url: `${site.url}${auditProvenanceArticle.href}` },
      { '@type': 'WebPage', name: dockerSessionsArticle.title, url: `${site.url}${dockerSessionsArticle.href}` },
      { '@type': 'WebPage', name: repositoryReplayArticle.title, url: `${site.url}${repositoryReplayArticle.href}` },
      { '@type': 'WebPage', name: overheadArticle.title, url: `${site.url}${overheadArticle.href}` },
    ],
  };

  return (
    <SiteShell>
      <JsonLd value={collection} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <h1>{config.title}</h1>
          <p className="hero-lede">{config.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="shell card-grid">
          <article className="content-card">
            <p className="card-label">Snapshot export contracts · November 2026</p>
            <h2><Link href={snapshotContractArticle.href}>{snapshotContractArticle.title}</Link></h2>
            <p>{snapshotContractArticle.description}</p>
            <Link className="arrow-link" href={snapshotContractArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Process outcome evidence · October 2026</p>
            <h2><Link href={processExitArticle.href}>{processExitArticle.title}</Link></h2>
            <p>{processExitArticle.description}</p>
            <Link className="arrow-link" href={processExitArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">TLS capture reliability · October 2026</p>
            <h2><Link href={captureLossArticle.href}>{captureLossArticle.title}</Link></h2>
            <p>{captureLossArticle.description}</p>
            <Link className="arrow-link" href={captureLossArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Compressed HTTP evidence · October 2026</p>
            <h2><Link href={compressedResponseArticle.href}>{compressedResponseArticle.title}</Link></h2>
            <p>{compressedResponseArticle.description}</p>
            <Link className="arrow-link" href={compressedResponseArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Container TLS discovery · October 2026</p>
            <h2><Link href={dockerTlsDiscoveryArticle.href}>{dockerTlsDiscoveryArticle.title}</Link></h2>
            <p>{dockerTlsDiscoveryArticle.description}</p>
            <Link className="arrow-link" href={dockerTlsDiscoveryArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Linux file-open evidence · October 2026</p>
            <h2><Link href={fileOpenEvidenceArticle.href}>{fileOpenEvidenceArticle.title}</Link></h2>
            <p>{fileOpenEvidenceArticle.description}</p>
            <Link className="arrow-link" href={fileOpenEvidenceArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Linux process capture internals · October 2026</p>
            <h2><Link href={pidNamespaceSidecarArticle.href}>{pidNamespaceSidecarArticle.title}</Link></h2>
            <p>{pidNamespaceSidecarArticle.description}</p>
            <Link className="arrow-link" href={pidNamespaceSidecarArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">TLS / HTTP capture internals · October 2026</p>
            <h2><Link href={httpCorrelationArticle.href}>{httpCorrelationArticle.title}</Link></h2>
            <p>{httpCorrelationArticle.description}</p>
            <Link className="arrow-link" href={httpCorrelationArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Native session internals · September 2026</p>
            <h2><Link href={sessionNormalizationArticle.href}>{sessionNormalizationArticle.title}</Link></h2>
            <p>{sessionNormalizationArticle.description}</p>
            <Link className="arrow-link" href={sessionNormalizationArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Telemetry export internals · September 2026</p>
            <h2><Link href={otelExportArticle.href}>{otelExportArticle.title}</Link></h2>
            <p>{otelExportArticle.description}</p>
            <Link className="arrow-link" href={otelExportArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Token accounting internals · refreshed October 2026</p>
            <h2><Link href={tokenReconciliationArticle.href}>{tokenReconciliationArticle.title}</Link></h2>
            <p>{tokenReconciliationArticle.description}</p>
            <Link className="arrow-link" href={tokenReconciliationArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Sampling internals · September 2026</p>
            <h2><Link href={backgroundMonitorArticle.href}>{backgroundMonitorArticle.title}</Link></h2>
            <p>{backgroundMonitorArticle.description}</p>
            <Link className="arrow-link" href={backgroundMonitorArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Fleet UI internals · September 2026</p>
            <h2><Link href={progressiveFleetArticle.href}>{progressiveFleetArticle.title}</Link></h2>
            <p>{progressiveFleetArticle.description}</p>
            <Link className="arrow-link" href={progressiveFleetArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Skill evolution · September 2026</p>
            <h2><Link href={skillEvolutionArticle.href}>{skillEvolutionArticle.title}</Link></h2>
            <p>{skillEvolutionArticle.description}</p>
            <Link className="arrow-link" href={skillEvolutionArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Skill distribution · September 2026</p>
            <h2><Link href={sharedSkillsArticle.href}>{sharedSkillsArticle.title}</Link></h2>
            <p>{sharedSkillsArticle.description}</p>
            <Link className="arrow-link" href={sharedSkillsArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Native session internals · September 2026</p>
            <h2><Link href={localSessionDiscoveryArticle.href}>{localSessionDiscoveryArticle.title}</Link></h2>
            <p>{localSessionDiscoveryArticle.description}</p>
            <Link className="arrow-link" href={localSessionDiscoveryArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Evidence modes · August 2026</p>
            <h2><Link href={noEbpfArticle.href}>{noEbpfArticle.title}</Link></h2>
            <p>{noEbpfArticle.description}</p>
            <Link className="arrow-link" href={noEbpfArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Remote-access architecture · August 2026</p>
            <h2><Link href={directNodeCredentialsArticle.href}>{directNodeCredentialsArticle.title}</Link></h2>
            <p>{directNodeCredentialsArticle.description}</p>
            <Link className="arrow-link" href={directNodeCredentialsArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Evidence interpretation · August 2026</p>
            <h2><Link href={auditProvenanceArticle.href}>{auditProvenanceArticle.title}</Link></h2>
            <p>{auditProvenanceArticle.description}</p>
            <Link className="arrow-link" href={auditProvenanceArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Container session architecture · August 2026</p>
            <h2><Link href={dockerSessionsArticle.href}>{dockerSessionsArticle.title}</Link></h2>
            <p>{dockerSessionsArticle.description}</p>
            <Link className="arrow-link" href={dockerSessionsArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Agent replay methods · August 2026</p>
            <h2><Link href={repositoryReplayArticle.href}>{repositoryReplayArticle.title}</Link></h2>
            <p>{repositoryReplayArticle.description}</p>
            <Link className="arrow-link" href={repositoryReplayArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Performance methods · August 2026</p>
            <h2><Link href={overheadArticle.href}>{overheadArticle.title}</Link></h2>
            <p>{overheadArticle.description}</p>
            <Link className="arrow-link" href={overheadArticle.href}>Read the page</Link>
          </article>
          {pages.map((page) => (
            <ContentCard key={page.slug} page={page} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
