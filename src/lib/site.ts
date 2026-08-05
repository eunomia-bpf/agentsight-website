export const site = {
  name: 'AgentSight',
  url: 'https://agentsight.us',
  description:
    'Profile AI agent intent, model calls, processes, files, network activity, and resource use from the system boundary.',
  repository: 'https://github.com/eunomia-bpf/agentsight',
  websiteRepository: 'https://github.com/eunomia-bpf/agentsight-website',
  docs: 'https://github.com/eunomia-bpf/agentsight#readme',
  demo: 'https://app.agentsight.us/',
  version: '0.2.67',
  releaseDate: '2026-08-05',
  releaseUrl: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v0.2.67',
  updatedAt: '2026-08-05',
  organization: {
    name: 'Eunomia',
    url: 'https://eunomia.dev/',
  },
  maintainer: {
    name: 'Yusheng Zheng',
    handle: 'yunwei37',
    url: 'https://github.com/yunwei37',
    avatar: 'https://avatars.githubusercontent.com/u/34985212?v=4',
  },
} as const;

export const navigation = [
  { href: '/runs/', label: 'Run library' },
  { href: '/use-cases/', label: 'Use cases' },
  { href: '/guides/', label: 'Guides' },
  { href: '/compare/', label: 'Compare' },
  { href: '/methodology/', label: 'Methodology' },
] as const;

export const hubConfig = {
  'use-case': {
    path: '/use-cases/',
    eyebrow: 'Use cases',
    title: 'Profiles that answer a concrete engineering question',
    description:
      'Start with a slow run, a risky change, a closed-source agent, or an extension you need to audit.',
  },
  comparison: {
    path: '/compare/',
    eyebrow: 'Compare',
    title: 'Choose the right observability boundary',
    description:
      'AgentSight complements application traces, standards, gateways, and hosted LLM observability tools by recording system effects.',
  },
  guide: {
    path: '/guides/',
    eyebrow: 'Guides',
    title: 'Record, inspect, and explain a real agent run',
    description:
      'Practical workflows for first capture, Claude Code profiling, and semantic Agent Flamegraphs.',
  },
  blog: {
    path: '/blog/',
    eyebrow: 'Engineering notes',
    title: 'Engineering notes from the system boundary',
    description:
      'How to connect agent intent to low-level effects and turn traces into useful review artifacts.',
  },
  integration: {
    path: '/integrations/',
    eyebrow: 'Integrations',
    title: 'Use AgentSight with the agent you already run',
    description:
      'Attach to supported local CLIs and process families without changing their source or routing traffic through a proxy.',
  },
} as const;
