import type { Metadata } from 'next';
import { CommandBlock, Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AgentSight releases',
  description:
    'Install the current AgentSight release from crates.io or GitHub Releases, and check the official Homebrew tap status for Linux x86-64.',
  alternates: { canonical: '/releases/' },
};

export default function ReleasesPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Releases</Eyebrow>
          <h1>Install the released profiler, then verify the exact version.</h1>
          <p className="hero-lede">
            Cargo and GitHub Releases are the current-release distribution paths. An official Homebrew
            tap also exists for Linux x86-64, but verify its formula version before using it in a
            repeatable deployment.
          </p>
        </div>
      </section>
      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Install</Eyebrow>
            <h2>Start from the current release artifacts.</h2>
            <p>
              Current GitHub Releases publish Linux binaries for both x86_64 and aarch64. The
              unsuffixed compatibility asset remains x86_64; choose the architecture-specific artifact
              when you need an explicitly pinned deployment. The website does not mirror binaries, so
              GitHub Releases remains the authoritative download location.
            </p>
            <p>
              The official Homebrew tap is available on Linux x86-64, but its formula can lag the
              current AgentSight release. If you use it, run <code>brew tap eunomia-bpf/tap</code> and
              <code> brew install eunomia-bpf/tap/agentsight</code>, then verify the installed version
              with <code>agentsight --version</code>. Use Cargo or the current GitHub release when you
              need the latest published AgentSight version.
            </p>
            <div className="hero-actions">
              <a className="button button-accent" href={`${site.repository}/releases/latest`}>Latest GitHub release</a>
              <a className="button button-outline" href="https://crates.io/crates/agentsight">agentsight on crates.io</a>
            </div>
          </div>
          <CommandBlock commands={['cargo install agentsight', 'agentsight --version']} />
        </div>
      </section>
    </SiteShell>
  );
}
