import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const skillPackCommit = '80b46492986ec55b39d6c514d35e574afaa3c0ef';
const skillPackSource = `https://github.com/eunomia-bpf/agent-skills/blob/${skillPackCommit}`;
const articlePath = '/blog/how-agentsight-shares-versioned-agent-skills/';

export const metadata: Metadata = {
  title: 'How AgentSight shares versioned agent skills without copying them',
  description:
    'A source-level explanation of AgentSight v1.0.30 shared skills: a pinned agent-skills submodule, generated local links, Bash and PowerShell safety rules, Windows junction fallback, and why repository-specific skills stay separate.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight shares versioned agent skills without copying them',
    description:
      'Follow AgentSight v1.0.30 from a pinned agent-skills gitlink to generated .agents/skills links, including overwrite guards and the Windows junction fallback.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 .gitmodules: the shared skills source is pinned under .agents/sources/agent-skills',
    `${productSource}/.gitmodules`,
  ],
  [
    'AgentSight v1.0.30 Bash sync wrapper: initialize the pinned submodule, then invoke its linker',
    `${productSource}/scripts/sync-agent-skills.sh`,
  ],
  [
    'AgentSight v1.0.30 ignore rule: generated .agents/skills links remain local instead of entering Git',
    `${productSource}/.gitignore`,
  ],
  [
    'Pinned agent-skills README: seven reusable workflows, symbolic-link installation, and repository-local exclusion rule',
    `${skillPackSource}/README.md`,
  ],
  [
    'Pinned Bash linker: only directories containing SKILL.md are linked and real target paths are never overwritten',
    `${skillPackSource}/scripts/link-skills.sh`,
  ],
  [
    'Pinned PowerShell linker: matching reparse points are reused; Windows can fall back from symlinks to junctions',
    `${skillPackSource}/scripts/link-skills.ps1`,
  ],
  [
    'AgentSight PR #206: release change that added the shared skills bridge without changing product runtime code',
    'https://github.com/eunomia-bpf/agentsight/pull/206',
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function SharedAgentSkillsArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight shares versioned agent skills without copying them',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Link href="/blog/">Blog</Link>
            <span aria-current="page">Versioned agent skills</span>
          </nav>
          <Eyebrow>Repository architecture · AgentSight v1.0.30 · 2 September 2026</Eyebrow>
          <h1>How AgentSight shares versioned agent skills without copying them</h1>
          <p className="hero-lede">
            AgentSight v1.0.30 added a small repository bridge for reusable agent skills. It does not copy a skill pack into
            the product tree or update agent behavior at runtime. Instead, Git pins one exact <code>agent-skills</code>
            revision as a submodule, local sync scripts materialize links under <code>.agents/skills</code>, and those generated
            links stay out of Git. The result is one versioned source of truth with explicit update boundaries.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                The bridge has three layers. AgentSight pins <code>eunomia-bpf/agent-skills</code> at a specific commit under
                <code>.agents/sources/agent-skills</code>. Its Bash or PowerShell wrapper initializes that submodule and calls
                the linker's script. The linker then creates one local link per valid skill directory under
                <code>.agents/skills</code>. Because the generated target directory is ignored, Git records the upstream
                revision but not machine-specific link objects.
              </p>
              <p>
                This matters when the same maintainer workflow should be reusable across repositories without creating
                divergent copies. An upstream change does not silently modify an AgentSight checkout: the consumer's gitlink
                must move before a new skill-pack revision becomes part of the repository state.
              </p>
            </section>

            <section>
              <h2>The four pieces of the bridge</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Piece</th>
                      <th style={header}>Committed?</th>
                      <th style={header}>Job</th>
                      <th style={header}>Failure boundary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>.agents/sources/agent-skills</code></td>
                      <td style={cell}>Yes, as a Git submodule pointer</td>
                      <td style={cell}>Pins the reusable pack to one exact upstream commit.</td>
                      <td style={cell}>Upstream can advance without changing the consumer until the gitlink is deliberately updated.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>scripts/sync-agent-skills.sh</code> / <code>.ps1</code></td>
                      <td style={cell}>Yes</td>
                      <td style={cell}>Initializes the pinned submodule and invokes its linking helper.</td>
                      <td style={cell}>A missing submodule or linker error fails the sync instead of fabricating partial skills.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>.agents/skills/*</code></td>
                      <td style={cell}>No</td>
                      <td style={cell}>Provides local links to the pinned canonical skill directories.</td>
                      <td style={cell}>Machine-specific link representation never becomes repository state.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Linker overwrite guards</td>
                      <td style={cell}>Implemented in the pinned pack</td>
                      <td style={cell}>Refuse to replace a real file or directory at a skill target.</td>
                      <td style={cell}>A local repository-specific path wins over destructive synchronization.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Pinning the pack is different from copying the pack</h2>
              <p>
                A copied skill directory loses its upstream identity unless the repository adds another synchronization
                convention. The AgentSight bridge uses Git's submodule object as that identity. At v1.0.30, the product tree
                points <code>.agents/sources/agent-skills</code> at commit <code>{skillPackCommit.slice(0, 12)}</code>. A clone
                can therefore answer two separate questions: which skill pack was intended, and which local links have been
                generated from it.
              </p>
              <p>
                The split also makes updates reviewable. Pulling the latest <code>agent-skills</code> repository by itself is
                not a product update. AgentSight only adopts a new shared pack when its committed gitlink changes. That keeps
                a maintainer workflow change closer to a dependency update than an invisible mutable global install.
              </p>
            </section>

            <section>
              <h2>The generated links are deliberately not committed</h2>
              <p>
                AgentSight's <code>.gitignore</code> excludes <code>/.agents/skills/</code>. The repository therefore commits
                the source location and synchronization entrypoints, not the output of linking on one developer's machine.
                This avoids checking in absolute paths, platform-specific reparse-point behavior, or a second copy of each
                <code>SKILL.md</code> tree.
              </p>
              <p>
                The Bash wrapper is intentionally small: initialize exactly the <code>.agents/sources/agent-skills</code>
                submodule, then run that pinned revision's <code>scripts/link-skills.sh</code> with the repository's
                <code>.agents/skills</code> directory as the destination. The policy for what counts as a skill therefore
                travels with the pinned source instead of being duplicated in the consumer wrapper.
              </p>
            </section>

            <section>
              <h2>The linker is conservative about existing paths</h2>
              <p>
                On Bash, only child directories that contain a <code>SKILL.md</code> are candidates. Before creating a link,
                the script checks the target path. If a real file or directory exists there, it exits with
                <code>Refusing to replace real path</code>. An existing symbolic link can be replaced, but an ordinary local
                directory cannot be silently converted into a shared skill.
              </p>
              <p>
                The PowerShell implementation follows the same ownership rule with Windows filesystem semantics. A normal
                existing path is rejected. A reparse point that already targets the intended skill is left in place. A stale
                reparse point may be replaced. In <code>Auto</code> mode, Windows first tries a symbolic link and falls back to
                a directory junction when symlink creation is unavailable. The fallback changes the filesystem mechanism,
                not the canonical source directory.
              </p>
            </section>

            <section>
              <h2>What is actually in the pinned shared pack?</h2>
              <p>
                The revision used by AgentSight v1.0.30 contains seven reusable workflows. Six are general open-source
                maintainer workflows—<code>agent-cli-tools</code>, <code>gh-workflow</code>, <code>oss-change-workflow</code>,
                <code>oss-issue-triage</code>, <code>oss-release-readiness</code>, and <code>project-bootstrap-workflow</code>—and
                one is the organization-level <code>eunomia-community-patrol</code> workflow. The pack's README explicitly
                excludes skills tied to one consumer's content tree, publishing ledger, site paths, SEO operation, or
                repository-specific research workflow.
              </p>
              <p>
                That exclusion is useful architecture, not housekeeping. A skill becomes shareable when its evidence and
                workflow contract make sense across consumers. A repository-specific skill should stay with the repository
                that owns its paths, data model, or publication semantics rather than being generalized only to reduce file
                count.
              </p>
            </section>

            <section>
              <h2>Do not confuse the shared bridge with AgentSight's repo-local prototype skills</h2>
              <p>
                AgentSight also has a committed <code>skills/</code> directory for behavior-analysis prototypes such as
                semantic flamegraphs, interaction insights, skill evolution, system-friction analysis, and testing. Its own
                README describes those as repo-local prototypes for a possible shareable pack, not runtime code. The
                repository's <code>.claude/skills</code> link points at that local <code>skills/</code> directory.
              </p>
              <p>
                The v1.0.30 shared bridge is a separate path: <code>.agents/sources/agent-skills</code> is the pinned reusable
                source and <code>.agents/skills</code> is generated locally. Keeping those two mechanisms distinct prevents a
                release note about “shared skills” from being misread as “all AgentSight analysis skills are now installed
                globally” or “AgentSight runtime automatically executes these skills.” Neither claim is supported by the
                source.
              </p>
            </section>

            <section>
              <h2>A reproducible way to inspect the bridge</h2>
              <p>
                The useful verification is not “does a directory named skills exist?” Check the committed dependency, run
                the repository wrapper, and verify that each generated target resolves back into the pinned submodule. Also
                verify that the generated directory remains untracked. On a clean v1.0.30 checkout, the sequence is:
              </p>
              <pre><code>{`git submodule status .agents/sources/agent-skills
./scripts/sync-agent-skills.sh
find .agents/skills -maxdepth 1 -type l -print
readlink .agents/skills/oss-change-workflow
git status --short -- .agents/skills`}</code></pre>
              <p>
                Windows users can run <code>scripts/sync-agent-skills.ps1</code> instead and inspect whether each target is a
                symbolic link or junction. Either representation is acceptable when it resolves to the pinned source. The
                final <code>git status</code> check should stay quiet for generated links because the directory is ignored.
              </p>
            </section>

            <section>
              <h2>When this pattern is useful—and when it is not</h2>
              <p>
                A pinned source plus generated links works well when several repositories should consume the same workflow
                definitions, updates need reviewable version boundaries, and users should edit one canonical copy instead of
                seven local clones. It is less useful when a consumer intentionally wants an independent fork, cannot use
                submodules, or needs to change the skill's assumptions to match repository-owned data and paths.
              </p>
              <p>
                The broader lesson is to separate <em>version ownership</em> from <em>local discovery</em>. Git should record
                which reusable workflow version the repository depends on. Local setup should make that workflow visible to
                the agent without turning OS-specific links into source files. And synchronization should fail rather than
                overwrite a path whose ownership is ambiguous.
              </p>
            </section>

            <section>
              <h2>Related AgentSight evidence</h2>
              <p>
                If you are interested in how AgentSight observes the behavior that later feeds skill improvements, start
                with <Link href="/blog/read-agentsight-audit-provenance/">audit provenance and confidence</Link>. For a
                different kind of reusable evidence artifact, see how
                <Link href="/blog/replay-coding-agent-repository-changes/"> repository replay reconstructs file evolution</Link>.
                The shared-skills bridge itself is repository infrastructure: it makes reusable workflow definitions
                versioned and discoverable, but it does not create new runtime telemetry.
              </p>
            </section>
          </article>

          <aside className="detail-aside">
            <div className="aside-card">
              <h2>Research scope</h2>
              <p>
                Source checked against AgentSight v1.0.30 commit <code>{productCommit.slice(0, 12)}</code> and its pinned
                <code>agent-skills</code> commit <code>{skillPackCommit.slice(0, 12)}</code> on 2 September 2026.
              </p>
            </div>
            <div className="aside-card">
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div className="aside-card">
              <h2>Claims this page does not make</h2>
              <ul>
                <li>The bridge does not automatically update to upstream HEAD.</li>
                <li>It does not prove every coding agent consumes <code>.agents/skills</code> identically.</li>
                <li>It does not turn repository-local AgentSight analysis prototypes into shared runtime features.</li>
                <li>It does not overwrite a real local skill directory when names collide.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
