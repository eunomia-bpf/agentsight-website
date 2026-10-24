import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/pid-namespace-scoping-for-agent-sidecars/';
const commit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const source = 'https://github.com/eunomia-bpf/agentsight/blob/' + commit;

export const metadata: Metadata = {
  title: 'PID namespace tracing for AI agent sidecars: what gets captured?',
  description:
    'A v1.0.35 source-level analysis of AgentSight --pidns-of: namespace descendants, docker exec, cgroup filters, probe liveness, pinned identity, and visibility limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'PID namespace tracing for AI agent sidecars: what gets captured?',
    description:
      'Compare PID, cgroup, and namespace scoping in an AgentSight v1.0.35 Linux process probe, with a reproducible investigation checklist and negative cases.',
    url: articlePath,
  },
};

const cell = {
  border: '1px solid #d8dee8',
  padding: '0.7rem',
  verticalAlign: 'top' as const,
};
const head = { ...cell, background: '#f4f7fa', fontWeight: 700 };
const cases = [
  {
    situation: 'Target process in the selected PID namespace',
    expected: 'Included, subject to additional process/cgroup filters.',
    why: 'Its namespace is the selected namespace.',
  },
  {
    situation: 'Child inside a nested PID namespace',
    expected: 'Included, subject to additional filters.',
    why: 'The target namespace occurs in the child task’s namespace ancestry, even if it is not the innermost namespace.',
  },
  {
    situation: 'Independently launched process in the same namespace (for example docker exec)',
    expected: 'Included with namespace scoping alone.',
    why: 'The BPF check asks where the task is visible, not whether its parent PID descends from the original container init.',
  },
  {
    situation: 'Process outside the selected namespace and its descendants',
    expected: 'Excluded.',
    why: 'The task’s namespace chain never contains the pinned namespace identity.',
  },
  {
    situation: 'Another container sharing the same PID namespace',
    expected: 'Not isolated from the target by this filter.',
    why: 'A PID namespace is not a container identity or authorization boundary.',
  },
  {
    situation: 'Process in the namespace but rejected by an additional PID or cgroup filter',
    expected: 'Excluded.',
    why: 'Combined filters intersect; namespace membership does not override narrower selectors.',
  },
] as const;
const references = [
  ['v1.0.35 process probe reference and examples', source + '/bpf/README.md'],
  ['BPF namespace ancestry check and filter composition', source + '/bpf/process_ext/bpf_common.h'],
  ['Probe argument parsing, namespace pinning, and heartbeat', source + '/bpf/process.c'],
  ['Namespace runtime and liveness regression tests', source + '/bpf/tests/test_process_runtime.py'],
  ['Collector liveness normalization and parser tests', source + '/agentsight-capture/src/runners/process.rs'],
  ['Implementation PR #237: reproduction scope and limitations', 'https://github.com/eunomia-bpf/agentsight/pull/237'],
  ['Nested namespace inclusion fix, PR #244', 'https://github.com/eunomia-bpf/agentsight/pull/244'],
  ['Docker child-thread resolution fix, PR #246', 'https://github.com/eunomia-bpf/agentsight/pull/246'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function PidNamespaceSidecarArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'PID namespace tracing for AI agent sidecars: what gets captured?',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-24',
    dateModified: '2026-10-24',
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
            <span aria-current="page">Sidecar PID namespace scope</span>
          </nav>
          <Eyebrow>Linux capture methods · AgentSight v1.0.35 · 24 October 2026</Eyebrow>
          <h1>PID namespace tracing for AI agent sidecars: what gets captured?</h1>
          <p className="hero-lede">
            A privileged observation sidecar may see a target container&apos;s tasks through host
            <code> /proc</code> but not see its cgroup hierarchy through the sidecar&apos;s private
            mount. Filtering on a container init PID also misses unrelated processes started later
            in the same container namespace. AgentSight v1.0.35 adds a third option to its
            <strong> Linux process probe</strong>: scope by the target&apos;s PID namespace, including
            nested namespaces, while retaining explicit limits on what that scope proves.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: namespace membership, not parentage, defines the scope</h2>
              <p>
                In the v1.0.35 <code>process</code> probe, <code>--pidns-of PID</code> opens
                <code> /proc/PID/ns/pid</code> and pins the target namespace. The in-kernel
                filter accepts a task if the target PID namespace appears anywhere in that task&apos;s
                namespace ancestry. That includes tasks in the selected namespace and nested
                namespaces, including independently parented processes in the same namespace.
                It excludes tasks outside that ancestry. Separate PID, command, and cgroup
                filters can narrow the result further.
              </p>
              <p>
                This is an inspection of AgentSight release <code>v1.0.35</code>, product commit
                <code> {commit}</code>, not a measured production coverage claim. The switch
                belongs to the Linux <strong>process probe</strong>, demonstrated through
                <code> agentsight debug process</code>; do not assume it is a universal
                <code> agentsight record</code> flag, a container security policy, or an
                automatically configured Kubernetes sidecar.
              </p>
            </section>

            <section>
              <h2>Why the two usual selectors fail in a sidecar</h2>
              <p>
                A parent-PID/process-tree selector starts from a chosen process. But
                <code> docker exec</code>-style tasks may be independently parented instead
                of descendants of the container init. A container cgroup selector is useful when
                the observer can resolve that cgroup. A sidecar with private mount and cgroup
                namespaces may not see a sibling workload&apos;s cgroup path under its own
                <code> /sys/fs/cgroup</code>. Neither failure says that eBPF itself cannot
                see the target task; it says that the chosen <em>selection key</em> is unsuitable.
              </p>
              <p>
                PID namespace membership answers a different question: which running tasks
                are visible from the target&apos;s PID namespace? The sidecar must still see the
                target PID under its own <code>/proc</code>, have the needed tracing privileges,
                and run on a Linux host with compatible probe support.
              </p>
            </section>

            <section>
              <h2>Scope matrix: what would a selected namespace include?</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '780px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={head}>Task topology</th>
                      <th style={head}>Expected process-probe result</th>
                      <th style={head}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map(({ situation, expected, why }) => (
                      <tr key={situation}>
                        <td style={cell}>{situation}</td>
                        <td style={cell}>{expected}</td>
                        <td style={cell}>{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The table describes the filter predicate, <em>not</em> a guarantee that every
                syscall, open, or network event is emitted. Event categories depend on the
                probe&apos;s enabled flags, kernel hooks, buffering, deduplication, and loss.
                In particular, the filter cannot distinguish two containers sharing a PID
                namespace. A nested sandbox is included because the selected namespace is
                an ancestor, not because its inner PID values match the outer namespace.
              </p>
            </section>

            <section>
              <h2>The actual BPF test walks namespace ancestry</h2>
              <p>
                The source function <code>task_visible_in_target_pidns()</code> obtains the
                current task&apos;s <code>thread_pid</code>, walks its kernel
                <code> struct pid</code> namespace-number chain up to the bounded maximum
                of 32 levels, and compares each namespace&apos;s inode with the pinned target.
                That matters for tools such as <code>bubblewrap</code> or
                <code> unshare --pid</code>: their innermost PID namespace differs from the
                selected outer namespace, but they remain visible to that outer namespace.
              </p>
              <p>
                The code intentionally does not depend on
                <code> bpf_get_ns_current_pid_tgid()</code> as a simple equality test:
                that helper does not express the ancestor-membership check needed here.
                The loader opens the namespace descriptor before attaching, obtains its
                device/inode, and keeps the descriptor open until cleanup to protect the
                scope from inode reuse after the original PID exits.
                The BPF path applies this predicate before other configured cgroup selection.
              </p>
              <p>
                Because the namespace itself is pinned, replacing the target container does
                <strong> not</strong> silently retarget the probe. The operator must resolve
                the replacement&apos;s PID and restart the probe. That is an intentionally
                conservative failure mode, not automatic container discovery.
              </p>
            </section>

            <section>
              <h2>Reproduce a bounded process-scope check</h2>
              <p>
                First choose a PID visible from the sidecar&apos;s <code>/proc</code> that
                belongs to the target namespace. Verify that choice independently by inspecting
                the namespace symlink on the host. Next run the documented standalone process
                probe or its wrapped debug command, enable only the event categories needed
                for the question, and observe a bounded interval:
              </p>
              <pre><code>{'readlink /proc/<target-host-pid>/ns/pid\n# From the v1.0.35 build on a privileged Linux host:\nsudo agentsight debug process -- -m 0 --pidns-of <target-host-pid> --trace-net --heartbeat 2'}</code></pre>
              <p>
                During that interval, examine a known in-namespace command, an independently
                launched process in the same namespace when one is available, and a control
                process outside the namespace. Add a nested PID namespace case when your
                environment supports it. Treat an absent file or network row as inconclusive
                until you have checked its hook, flags, aggregation, and loss reports. This
                is a <strong>reproduction method</strong>, not an assertion that the command
                was run in this editorial cycle.
              </p>
              <p>
                The v1.0.35 implementation PR documents a real Linux namespace reproduction
                with private cgroup/mount/PID namespaces: an independent <code>nsenter</code>
                process, file open, listener, and accepted peer were captured, while an outside
                workload was excluded. The PR explicitly reports <strong>no Docker daemon</strong>
                in that test environment. It therefore validates namespace behavior, not
                every Docker or Kubernetes deployment topology.
              </p>
            </section>

            <section>
              <h2>Probe liveness answers a different question from event coverage</h2>
              <p>
                Add <code>--heartbeat 2</code> to receive a start record and periodic
                <code> PROBE_LIVENESS</code> events. The process runner normalizes them onto
                the ordinary process event stream using <code>pid: 0</code> and
                <code>comm: &quot;process&quot;</code>. The heartbeat
                <code> timestamp</code> is monotonic, consistent with BPF event timing;
                <code> wall_time_ns</code> is Unix epoch nanoseconds for external
                freshness checking. The start record includes the enabled trace flags.
              </p>
              <p>
                A recent heartbeat establishes that the probe&apos;s event loop is alive;
                it does <em>not</em> establish correct target identity, comprehensive hook
                coverage, or zero data loss. A missing heartbeat after a crash is a
                monitoring signal, not evidence that the target agent stopped.
                Preserve the difference between <strong>observer health</strong>,
                <strong> namespace scope</strong>, and <strong>observed effects</strong>.
              </p>
            </section>

            <section>
              <h2>Decide which observation plane you actually need</h2>
              <p>
                This probe concerns process, file, network, and selected extension events
                from Linux execution. It does not reconstruct prompts, model usage,
                or provider sessions merely because the process was in scope. For TLS
                plaintext you still need a compatible runtime/binary attachment and
                HTTP parser; see <Link href="/blog/why-ai-agent-tls-traffic-is-hard-to-trace/">
                  TLS capture boundaries</Link> and
                <Link href="/blog/how-agentsight-correlates-http-exchanges/">
                  HTTP exchange correlation</Link>.
              </p>
              <p>
                The separate <Link href="/blog/observe-ai-agent-sessions-in-docker/">
                  Docker native-session bridge</Link> accesses provider-owned session
                data through a Node inside the container; it is not the same mechanism
                as the privileged Linux PID namespace probe. A hybrid investigation may
                need both, and should preserve their provenance independently.
              </p>
              <p>
                In an incident, record the AgentSight version, selected host PID,
                namespace symlink identity, host kernel, sidecar <code>/proc</code>
                visibility, trace flags, any other filters, and time interval. Also
                check event-loss and fallback notices. Without these details, a
                negative trace is too ambiguous to support a security conclusion.
              </p>
            </section>

            <section>
              <h2>Primary sources and limitations</h2>
              <p>
                All AgentSight implementation claims are pinned to the public
                <code> v1.0.35</code> commit <code>{commit}</code>. The scope matrix is
                deduced from the documented BPF predicate, not measured coverage
                percentages. No new benchmark, customer case, or independent
                Kubernetes sidecar test is claimed here. Privileged host tracing
                entails its own deployment and data-handling risks; event streams
                can contain executable names, paths, peers, and other sensitive
                evidence. Keep captures local or redact them before sharing.
              </p>
              <ul>
                {references.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
              <p>
                For the higher-level question of when to select system capture
                instead of native agent records, read
                <Link href="/ebpf-ai-agent-monitoring/"> eBPF monitoring evidence boundaries</Link>.
                Installation, privilege setup, and maintained CLI reference
                remain on the <a href="https://eunomia.dev/agentsight/">canonical product documentation</a>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
