import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Follow AgentSight releases, session messaging, extension boundaries, fleet and session analysis, portable agent-native workflows, distributed Node access, reports, repository replay, and Agent Flamegraph updates.',
  alternates: { canonical: '/changelog/' },
};

const updates = [
  {
    label: 'Current release',
    title: `AgentSight ${site.version}`,
    description:
      'v1.0.25 hardens live session messaging across provider resume, Direct, and Controller relay paths. It preserves the recorded Codex CLI version when resuming when possible, reports provider start/resume/transport failures instead of false acceptance, serializes messages to the same session, and bounds relay concurrency, response sizes, and request deadlines.',
    href: site.releaseUrl,
  },
  {
    label: 'Node freshness',
    title: 'Relay reconnect refreshes the running Node version',
    description:
      'v1.0.24 refreshes the persisted Node version on authenticated Controller relay reconnects, so a Node that was upgraded and restarted no longer needs Direct re-pairing just to update the fleet version label. Older Nodes that omit the version header keep their existing stored value.',
    href: 'https://github.com/eunomia-bpf/agentsight/pull/192',
  },
  {
    label: 'Extension architecture',
    title: 'Composable product boundaries with one bounded session Component',
    description:
      'v1.0.23 made ext/ the canonical cross-platform source layout for independently composable product functionality while keeping platform capture native. Only ext/session currently executes as a wasm32-wasip2 Component; dynamic extension discovery, extension-defined CLI commands, and generic remote extension routing are not shipped capabilities.',
    href: '/architecture/',
  },
  {
    label: 'Fleet overview',
    title: 'All machines is aggregated in the browser',
    description:
      'Signed-in users can filter and compare reachable Nodes, active and stopped sessions, reported Tokens, CPU/RSS, Agent Plans, and source-reported subscription windows. The browser reads bounded Node overviews through Direct or Relay and combines them in memory; Controller keeps the machine directory and access policy rather than the Node snapshots.',
    href: '/architecture/',
  },
  {
    label: 'Session analysis',
    title: 'One Analysis workspace replaces separate Timeline and Detailed Events tabs',
    description:
      'Analysis summarizes duration, LLM turns, tool activity, failures, token and model usage, files, network targets, processes, and resources above an interactive timeline. Selecting a timeline event keeps the lower-level event detail available without a separate raw-log tab.',
    href: '/product/',
  },
  {
    label: 'Cross-platform',
    title: 'Portable native-session workflows on Windows, macOS, and Linux',
    description:
      'top, bind, vis, and report can use agent-native session files without eBPF. Native Windows session management is supported by CI and provider shims, while record and eBPF-backed tracing remain Linux-only; current GitHub Releases do not publish a Windows binary asset.',
    href: '/product/',
  },
  {
    label: 'Hosted architecture',
    title: 'Frontend and Controller deploy together while Direct stays independent',
    description:
      'The hosted frontend and Controller API/relay deploy from one Cloudflare Worker revision. Direct browser-to-Node access remains independent, and detailed runtime data remains authoritative on Nodes rather than Controller.',
    href: '/architecture/',
  },
  {
    label: 'Release artifacts',
    title: 'Native Linux x86_64 and ARM64 binaries',
    description:
      'Current GitHub Releases publish agentsight and agentpprof binaries for x86_64 and aarch64 Linux. The unsuffixed compatibility assets remain x86_64; use the architecture-specific artifact when pinning a reproducible deployment.',
    href: `${site.repository}/releases/latest`,
  },
  {
    label: 'Profiling',
    title: 'Agent Flamegraphs',
    description:
      'agentpprof derives configurable task, skill, phase, action, object, repeat, result, outcome, and token stacks from local agent sessions, with pprof, folded, SVG, and JSON outputs.',
    href: `${site.repository}/blob/master/docs/agentpprof.md`,
  },
  {
    label: 'Product',
    title: 'Local session replay and reports',
    description:
      'AgentSight can inspect Claude, Codex, Gemini, and Cursor session history, replay repository changes, serve recorded sessions, and export portable report snapshots.',
    href: site.docs,
  },
];

export default function ChangelogPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Changelog</Eyebrow>
          <h1>Product updates and release highlights.</h1>
          <p className="hero-lede">
            This page summarizes major user-facing changes. GitHub Releases and the AgentSight
            repository remain authoritative for a specific version.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell timeline">
          {updates.map((update) => (
            <article key={update.title}>
              <p className="card-label">{update.label}</p>
              <h2>{update.title}</h2>
              <p>{update.description}</p>
              <a className="arrow-link" href={update.href}>Read the source <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
