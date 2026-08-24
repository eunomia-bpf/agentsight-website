import type { Metadata } from 'next';
import { CommandBlock, Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AgentSight releases',
  description:
    'Install AgentSight from crates.io or GitHub Releases, verify the selected version, and follow authoritative release artifacts.',
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
            Cargo and GitHub Releases are the supported distribution paths described by the product
            repository. Use the tag and artifact you tested in any repeatable audit workflow.
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
