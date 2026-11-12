import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Follow AgentSight releases, installation paths, repository skills, audit provenance, Docker-backed sessions, recorded-demo coverage, session messaging, extension boundaries, fleet and session analysis, portable agent-native workflows, reports, repository replay, and Agent Flamegraph updates.',
  alternates: { canonical: '/changelog/' },
};

const updates = [
  {
    label: 'Current release',
    title: `AgentSight ${site.version}`,
    description:
      'v1.0.31 improves the web frontend for fleet loading, narrow screens, and live session messaging. Machine overviews appear as individual Nodes finish loading, process and analysis views load on demand, mobile layouts keep tabs and dialogs reachable, long chat messages wrap, IME composition is preserved, and ambiguous HTTPS message writes are no longer replayed automatically. Authentication, capability, organization, and backend policy are unchanged.',
    href: site.releaseUrl,
  },
  {
    label: 'Repository skills',
    title: 'Shared agent skills stay versioned without committing generated links',
    description:
      'v1.0.30 adds a repository-maintenance bridge for shared agent skills: the AgentSight repository pins eunomia-bpf/agent-skills under .agents/sources, provides small Bash and PowerShell sync entrypoints, and keeps generated .agents/skills links out of Git. The release does not change AgentSight product runtime code or existing repository-specific skills.',
    href: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.30',
  },
  {
    label: 'Installation',
    title: 'Homebrew installation is documented in the product repository',
    description:
      'v1.0.29 documents the official eunomia-bpf/tap Homebrew path for Linux x86-64, including the tap, formula install, and agentsight --version verification commands. Cargo and architecture-specific GitHub release binaries remain available.',
    href: 'https://github.com/eunomia-bpf/agentsight/pull/196',
  },
  {
    label: 'Audit provenance',
    title: 'Audit and LLM rows preserve source provenance and confidence',
    description:
      'v1.0.28 preserves row-level provenance for audit and LLM records across live capture, SQLite reconstruction, agent-native session parsing, and legacy data. The additive view_source and confidence fields keep lineage and correlation quality visible; confidence remains source-specific rather than a global probability score.',
    href: 'https://github.com/eunomia-bpf/agentsight/pull/204',
  },
  {
    label: 'Container sessions',
    title: 'Bind can include agent-native sessions from named Docker containers',
    description:
      'v1.0.27 adds repeatable agentsight bind --docker-container NAME support. The host runs AgentSight’s existing discovery and provider messaging inside the named container through a bounded JSONL bridge, keeps provider credentials and state in the container, merges those sessions into the normal snapshot/detail/message APIs, and fails closed on ambiguous or unavailable peers. Cursor is observable through the bridge but remains message-read-only.',
    href: 'https://github.com/eunomia-bpf/agentsight/pull/195',
  },
  {
    label: 'Recorded demo',
    title: 'Recorded Overview and session detail use one coherent fixture',
    description:
      'v1.0.26 fixes the recorded demo so it loads a recorded LiveOverview alongside the session snapshot. The demo exercises the normal Overview, Conversation, Process Tree & AI Prompts, and Analysis paths with coherent Codex and Claude sample data for processes, resources, tool calls, network activity, failures, plans, and source-reported subscriptions.',
    href: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.26',
  },
  {
    label: 'Messaging reliability',
    title: 'Live session messaging fails visibly and stays serialized',
    description:
      'v1.0.25 hardened live provider messaging across provider resume, Direct, and Controller relay paths. It preserves the recorded Codex CLI version when resuming when possible, reports provider start/resume/transport failures instead of false acceptance, serializes messages to the same session, and bounds relay concurrency, response sizes, and request deadlines.',
    href: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.25',
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
