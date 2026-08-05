export const productCommit = '4e1504e7f6713dcae7fb7762415bb93288abb931';

export const site = {
  name: 'AgentSight',
  url: 'https://agentsight.us',
  description:
    'Open-source, local-first observability for AI agents. Connect model calls to commands, files, processes, network activity, and resource use.',
  repository: 'https://github.com/eunomia-bpf/agentsight',
  websiteRepository: 'https://github.com/eunomia-bpf/agentsight-website',
  docs: 'https://eunomia.dev/agentsight/',
  demo: 'https://app.agentsight.us/',
  version: '0.2.68',
  releaseDate: '2026-08-05',
  releaseUrl: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v0.2.68',
  productCommit,
  assetBase: `https://raw.githubusercontent.com/eunomia-bpf/agentsight/${productCommit}`,
} as const;

export const navigation = [
  { href: '/use-cases/', label: 'Use cases' },
  { href: '/compare/', label: 'Compare' },
  { href: '/guides/', label: 'Guides' },
  { href: '/integrations/', label: 'Integrations' },
  { href: '/security/', label: 'Security' },
] as const;

export const hubConfig = {
  'use-case': {
    path: '/use-cases/',
    eyebrow: 'Use cases',
    title: 'Use AgentSight to debug and review real agent runs',
    description:
      'Start with a slow run, an AI-generated change, a closed-source agent, or an extension you need to inspect.',
  },
  comparison: {
    path: '/compare/',
    eyebrow: 'Compare',
    title: 'Choose the observability layer that fits the job',
    description:
      'AgentSight complements application traces, OpenTelemetry, gateways, and hosted LLM tools by showing local processes, files, network activity, and resources.',
  },
  guide: {
    path: '/guides/',
    eyebrow: 'Guides',
    title: 'Workflows for inspecting AgentSight runs',
    description:
      'Practical workflows for first capture, Claude Code profiling, and Agent Flamegraphs. Full product documentation lives on eunomia.dev.',
  },
  blog: {
    path: '/blog/',
    eyebrow: 'Blog',
    title: 'Engineering notes about AI agent observability',
    description:
      'How to connect model activity to local processes, files, network calls, and resource use.',
  },
  integration: {
    path: '/integrations/',
    eyebrow: 'Integrations',
    title: 'Use AgentSight with the agent you already run',
    description:
      'Profile supported local CLIs and process families without changing their source code or routing model traffic through a proxy.',
  },
} as const;
