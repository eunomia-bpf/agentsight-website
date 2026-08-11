export const productCommit = 'ad0cdcd3d77fee053b3b1ab81bb63239af4a6535';

export const site = {
  name: 'AgentSight',
  url: 'https://agentsight.us',
  description:
    'Agent-native observability and evolution for AI agents. Connect runtime evidence to repeated failures, evolve skills, evaluate candidates, and promote or roll back improvements.',
  repository: 'https://github.com/eunomia-bpf/agentsight',
  websiteRepository: 'https://github.com/eunomia-bpf/agentsight-website',
  docs: 'https://eunomia.dev/agentsight/',
  demo: 'https://app.agentsight.us/',
  version: '1.0.6',
  releaseDate: '2026-08-11',
  releaseUrl: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.6',
  productCommit,
  assetBase: `https://raw.githubusercontent.com/eunomia-bpf/agentsight/${productCommit}`,
} as const;

export const navigation = [
  { href: '/use-cases/', label: 'Use cases' },
  { href: '/architecture/', label: 'Architecture' },
  { href: '/integrations/', label: 'Integrations' },
  { href: '/compare/', label: 'Compare' },
  { href: '/pricing/', label: 'Pricing' },
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
      'Profile supported local CLIs, IDE agents, and process families with the capture path that matches the runtime.',
  },
} as const;
