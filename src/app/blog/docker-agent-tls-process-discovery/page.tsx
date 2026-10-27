import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const productSource = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;
const articlePath = '/blog/docker-agent-tls-process-discovery/';

export const metadata: Metadata = {
  title: 'How AgentSight finds TLS attach targets in threaded Docker process trees',
  description:
    'Inspect v1.0.35 Docker TLS target discovery: worker-thread forks, /proc children traversal, SSL binary selection, regression tests, and failure boundaries.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight finds TLS attach targets in threaded Docker process trees',
    description:
      'Why the container init PID is not always the TLS uprobe target, and how AgentSight finds children launched by worker threads.',
    url: articlePath,
  },
};

const cases = [
  {
    scenario: 'Container init embeds a detectable SSL implementation',
    behavior: 'The breadth-first walk checks the init PID before descendants.',
    inference: 'A matching init binary is selected; this does not prove model traffic was captured.',
  },
  {
    scenario: 'Single-threaded tini-style init launches Node',
    behavior: 'The main-thread children list leads the resolver to Node.',
    inference: 'Docker init identity and TLS executable identity differ.',
  },
  {
    scenario: 'Worker thread launches the agent, not the leader',
    behavior: 'v1.0.35 reads every /proc/<pid>/task/<tid>/children file.',
    inference: 'Leader-only traversal can falsely report no agent: the PR #246 regression.',
  },
  {
    scenario: 'An SSL-bearing process is a grandchild',
    behavior: 'The queue visits successive descendant levels, breadth-first.',
    inference: 'This is recursive process discovery, not one-hop lookup.',
  },
  {
    scenario: 'Process maps dynamically linked libssl.so',
    behavior: 'After the embedded-SSL check, /proc/<pid>/maps supplies a library target.',
    inference: 'Dynamic-library and executable probes have distinct attach paths.',
  },
  {
    scenario: 'Several descendants contain candidate TLS targets',
    behavior: 'The resolver returns the first qualifying candidate in search order.',
    inference: 'It does not attach to every possible SSL-using descendant.',
  },
  {
    scenario: 'Child exits, task cannot be read, or child starts later',
    behavior: 'Unreadable children files are skipped and new children are not awaited.',
    inference: 'No target found is not proof the container never ran a TLS agent.',
  },
  {
    scenario: 'Container stopped or no supported SSL target exists',
    behavior: 'PID zero and running-tree-without-target produce different errors.',
    inference: 'Diagnose lifecycle, discovery, probe setup, and decoding separately.',
  },
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const references = [
  ['AgentSight v1.0.35 binary resolver and regression tests', productSource + '/agentsight-capture/src/binary_resolver.rs'],
  ['PR #246: all-thread children traversal and test evidence', 'https://github.com/eunomia-bpf/agentsight/pull/246'],
  ['AgentSight OpenClaw Docker target-discovery example', productSource + '/docs/experiment/openclaw.md'],
  ['AgentSight supported-agent command forms', productSource + '/docs/agents.md'],
  ['AgentSight Docker privileges and host process requirements', productSource + '/docs/docker.md'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function DockerTlsProcessDiscoveryArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight finds TLS attach targets in threaded Docker process trees',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-27',
    dateModified: '2026-10-27',
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
            <span aria-current="page">Container TLS target discovery</span>
          </nav>
          <Eyebrow>Container process tracing · AgentSight v1.0.35 · 27 October 2026</Eyebrow>
          <h1>How AgentSight finds TLS attach targets in threaded Docker process trees</h1>
          <p className="hero-lede">
            A Docker container&apos;s init PID is not necessarily the executable carrying
            its agent&apos;s TLS stack. AgentSight resolves a host process from the
            container, traverses descendants and chooses an SSL attach path. Since
            v1.0.35, that traversal includes children forked by <em>any</em> thread,
            not just the process leader. The fix matters when multithreaded
            runtimes launch an agent from worker threads.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: container identity is not TLS executable identity</h2>
              <p>
                For <code>--binary-path docker://name</code>, AgentSight first
                runs <code>docker inspect</code> to resolve the container&apos;s
                host init PID. It searches that process and its descendants for
                an executable embedding SSL or a loaded <code>libssl.so</code>,
                then returns an attach path for the TLS uprobe. This is necessary
                for a layout such as <code>tini</code> launching <code>node</code>:
                the wrapper itself does not contain the relevant SSL code.
              </p>
              <p>
                The v1.0.35 fix in
                {' '}<a href="https://github.com/eunomia-bpf/agentsight/pull/246">product PR #246</a>
                {' '}addresses a less obvious case. On Linux,
                <code> /proc/&lt;pid&gt;/task/&lt;tid&gt;/children</code> describes
                children forked by one particular thread. Reading only
                <code> /proc/&lt;pid&gt;/task/&lt;pid&gt;/children</code> can miss
                a worker&apos;s child even when it belongs to the same process.
                AgentSight now checks every thread&apos;s children file for
                each visited process.
              </p>
              <p>
                This is a source-level study of released AgentSight v1.0.35 at
                product commit <code>{productCommit}</code>, reviewed on
                27 October 2026. It does not claim a new container experiment,
                live TLS capture, or measured coverage from this article&apos;s author.
              </p>
            </section>

            <section>
              <h2>From Docker reference to an SSL attach target</h2>
              <p>
                The resolver accepts <code>docker://name</code>,
                <code>docker:name</code>, and container IDs. Invalid empty and
                slash-separated Docker references fail validation. The Docker
                lookup uses <code>docker inspect --format</code> to read
                <code> .State.Pid</code>, rejecting PID zero as a stopped
                container. A running tree without any candidate produces
                a different no-SSL-target error.
              </p>
              <p>
                For each queued PID, <code>find_ssl_target_in_tree</code>
                first checks <code>/proc/&lt;pid&gt;/exe</code> for embedded
                SSL markers. If none match, it checks
                <code> /proc/&lt;pid&gt;/maps</code> for a mapped
                <code> libssl.so</code> and resolves the library path under
                <code> /proc/&lt;pid&gt;/root</code>. If neither matches, it
                appends the child PIDs. A <code>VecDeque</code> maintains the
                breadth-first walk and a <code>HashSet</code> prevents
                revisiting a PID.
              </p>
              <p>
                The new helper <code>child_pids</code> enumerates numeric
                thread IDs under <code>/proc/&lt;pid&gt;/task</code>, sorts
                the main thread first, then reads each thread&apos;s children
                file. Unreadable entries are skipped. Main-thread-first
                ordering preserves the former single-threaded preference, but
                searching all threads prevents the leader-only omission. The
                output is the <em>first</em> SSL candidate found, not a
                comprehensive list of every TLS-using child.
              </p>
            </section>

            <section>
              <h2>Eight cases that change an empty-capture diagnosis</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '810px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Process or container layout</th>
                      <th style={header}>v1.0.35 resolver behavior</th>
                      <th style={header}>Safe inference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item.scenario}>
                        <td style={cell}>{item.scenario}</td>
                        <td style={cell}>{item.behavior}</td>
                        <td style={cell}>{item.inference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                These are implementation-derived cases, not measured success
                rates. A resolved target alone does not prove that sslsniff
                attached to correct symbols or offsets, that the runtime used
                that particular TLS library, or that HTTP/LLM parsing succeeded.
              </p>
            </section>

            <section>
              <h2>What the worker-thread regression tests actually establish</h2>
              <p>
                Before product PR #246, the walker only read the leader&apos;s
                children list. The patch adds three tests: a synthetic process
                whose main thread forked nothing while worker threads forked
                children; an ordering and missing-file fixture; and a live
                local Linux test that spawns <code>sleep</code> from a worker
                thread. The last test verifies that leader-only enumeration
                misses the child while the all-thread helper finds it. It
                skips if the kernel lacks the required proc children interface.
              </p>
              <p>
                These are first-party tests for <em>process discovery</em>.
                They do not assert an end-to-end Docker/OpenClaw TLS transaction,
                HTTP/2 decoding, or a completed model request. The change does
                not install a continuous process watcher, alter Docker&apos;s
                container API, or modify the subsequent TLS parser. A probe
                failure after selecting the correct PID is a separate issue.
              </p>
            </section>

            <section>
              <h2>A bounded, read-only check on your own Linux host</h2>
              <p>
                With authorization to inspect a disposable container, compare
                the container init leader&apos;s children against the children
                listed by all of its threads. This diagnostic illustrates one
                traversal level, not AgentSight&apos;s full recursive search.
              </p>
              <pre><code>{"# Run on an authorized Linux Docker host\ninit_pid=$(docker inspect --format '{{.State.Pid}}' openclaw)\nprintf 'init host PID: %s\\n' \"$init_pid\"\nprintf 'leader children: '\ncat \"/proc/$init_pid/task/$init_pid/children\" 2>/dev/null || true\nfor task in \"/proc/$init_pid\"/task/*; do\n  [ -d \"$task\" ] || continue\n  printf 'TID %s children: ' \"$(basename \"$task\")\"\n  cat \"$task/children\" 2>/dev/null || true\n  printf '\\n'\ndone"}</code></pre>
              <p>
                Replace <code>openclaw</code> with a container you control.
                A child found under a worker thread but absent from the leader
                list reproduces the old discovery blind spot. Repeat while the
                agent is active: tasks may start or exit between <code>/proc</code>
                reads, and access permissions can hide entries. No sample output
                is invented or presented as a run performed here.
              </p>
              <p>
                For end-to-end recording, the pinned product README documents
                <code> sudo agentsight record -c node --binary-path docker://openclaw</code>.
                Check the resolved host PID and attach path before investigating
                decrypted traffic. Installation and detailed flags belong to
                the <a href="https://eunomia.dev/agentsight/">canonical AgentSight documentation</a>.
              </p>
            </section>

            <section>
              <h2>Limits and boundaries that matter in a real audit</h2>
              <p>
                This discovery is a snapshot of the process tree. A child that
                starts later, exits, or has an unreadable task file can be missed.
                A multithreaded container may also have several possible SSL
                executables, while the resolver selects only its first match.
                Docker CLI availability, kernel permissions and supported TLS
                implementations determine whether attachment is possible.
              </p>
              <p>
                Process <em>selection</em> is different from process-event
                <em> scope</em>. The
                {' '}<Link href="/blog/pid-namespace-scoping-for-agent-sidecars/">PID namespace article</Link>
                {' '}explains scope filtering, while the
                {' '}<Link href="/blog/observe-ai-agent-sessions-in-docker/">Docker native-session article</Link>
                {' '}describes a separate container JSONL bridge without relying
                on the same TLS probe discovery. If an attach succeeded but
                paired HTTP requests are missing, consult the
                {' '}<Link href="/blog/how-agentsight-correlates-http-exchanges/">HTTP correlation reference</Link>.
              </p>
              <p>
                Root-level process inspection and eBPF permissions remain
                sensitive; a <code>docker://</code> reference is not a
                security isolation mechanism. Recorded runs may contain
                prompts, responses, file paths, headers and network targets.
                Keep raw captures out of public issues and search-facing pages.
              </p>
            </section>

            <section>
              <h2>Primary references and validation scope</h2>
              <p>
                All implementation claims are pinned to v1.0.35 and the
                merged all-thread traversal patch. This article introduces
                an eight-case interpretation matrix and a read-only diagnostic
                but does not claim to have executed that diagnostic or obtained
                new performance, security or compatibility measurements.
              </p>
              <ul>
                {references.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
