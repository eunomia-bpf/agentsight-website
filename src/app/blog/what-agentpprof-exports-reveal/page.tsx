import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentpprof-exports-reveal/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'What AgentSight agentpprof exports reveal after previews are hidden',
  description: 'A v1.0.35 source audit of pprof sample labels, folded stacks, SVG frames, JSON metadata, preview redaction, and what to review before sharing profiles.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What AgentSight agentpprof exports reveal after previews are hidden',
    description: 'Hidden prompts are not anonymous profiles. Compare the real fields retained by each agentpprof output format before sending a trace to others.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const formatMatrix = [
  {
    format: 'JSON, default (no --include-previews)',
    visible: 'Prompt, command, and LLM-output preview fields become the literal text "redacted". The export still carries session IDs, file basename, timestamps, models, tags, hashes, process-chain information, path groups and domains when available.',
    limit: 'Preview suppression is not anonymization. Correlation keys and metadata may identify a run or organization.',
  },
  {
    format: 'JSON with --include-previews',
    visible: 'The prompt and LLM preview values and the tool command text are serialized instead of the redacted placeholders.',
    limit: 'Do not use this flag for public artifacts unless the inputs have already been sanitized and the output reviewed.',
  },
  {
    format: 'Pprof protobuf (.pb or .pb.gz)',
    visible: 'The stack functions plus sample labels: project, agent, session, source/evidence IDs, a normalized but unhashed call ID, prompt/response hashes, timestamp, skill and status when present. Pprof stores these strings in its own string table.',
    limit: 'Keeping project, agent and session outside the default stack does not remove them: inspect sample labels separately.',
  },
  {
    format: 'Folded stacks (.folded)',
    visible: 'One line per aggregated semantic frame sequence with a numeric width. Frame text survives as readable stack content.',
    limit: 'No pprof-specific per-sample label set here, but semantic labels and object names can still reveal task or repository structure.',
  },
  {
    format: 'SVG flamegraph (.svg)',
    visible: 'A visual projection of the same folded stack labels and their weights; labels and tooltip text are part of the generated SVG.',
    limit: 'An image-looking artifact can still disclose readable text. Preview before embedding it on a public page.',
  },
  {
    format: 'Any format with customized --stack / --stack-rule / --op-map',
    visible: 'Operator-selected fields and mapped labels become stack frames when their source values are present.',
    limit: 'Custom mapping changes the disclosure surface. Do not assume the default stack and its sanitization properties still describe the output.',
  },
] as const;

const fieldMatrix = [
  {
    field: 'session_id / agent_sight_session_id',
    interpretation: 'Default JSON contains source-native and constructed session identity, not just a hashed anonymous label.',
    review: 'Remove or replace stable run identifiers before external sharing when they could be linked to other logs.',
  },
  {
    field: 'session_file / cwd_hash / source',
    interpretation: 'A source-file basename, working-directory hash, and agent family can survive preview redaction.',
    review: 'A basename may encode an identifier; a hash is a pseudonym and still allows equality matching.',
  },
  {
    field: 'tool_events, path_groups, domains, process_chain',
    interpretation: 'These structured metadata fields are exported independently of command_preview.',
    review: 'A host, tool, or path category may disclose environment details without showing the underlying prompt.',
  },
  {
    field: 'model, usage counts, timestamps, tags',
    interpretation: 'LLM model and token usage, operation times, and semantic task labels remain useful for profiling.',
    review: 'Their combination can reveal workflows and activity patterns even if content previews are absent.',
  },
  {
    field: 'pprof evidence labels',
    interpretation: 'The profile builder passes its evidence-label field set through safe_frame and serializes key/value strings into pprof samples.',
    review: 'Run pprof tag inspection; ordinary flamegraph screenshots do not show every label retained by the binary.',
  },
  {
    field: 'safe_frame and private-marker handling',
    interpretation: 'Source normalizes characters and some path/username/private-marker cases. It does not implement a universal sensitive-string redactor.',
    review: 'Test your actual labels and custom rules; never substitute normalization for data classification.',
  },
] as const;

const references = [
  ['v1.0.35 profile serialization, output formats, labels, and safe_frame', sourceRoot + '/ext/pprof/src/profile.rs'],
  ['v1.0.35 agentpprof CLI options, including --include-previews', sourceRoot + '/ext/pprof/src/main.rs'],
  ['v1.0.35 documented output and privacy caveats', sourceRoot + '/ext/pprof/README.md'],
  ['v1.0.35 session record model and discovery', sourceRoot + '/ext/pprof/src/session.rs'],
  ['AgentSight agentpprof semantic profiling reference', sourceRoot + '/docs/agentpprof.md'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function AgentpprofSharingBoundaryArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What AgentSight agentpprof exports reveal after previews are hidden',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-07',
    dateModified: '2026-11-07',
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
            <span aria-current="page">agentpprof export privacy</span>
          </nav>
          <Eyebrow>Source-level privacy audit · AgentSight v1.0.35 · 7 November 2026</Eyebrow>
          <h1>What AgentSight agentpprof exports reveal after previews are hidden</h1>
          <p className="hero-lede">
            A redacted prompt preview is not an anonymous agent profile. In AgentSight v1.0.35,
            <strong> JSON, pprof, folded stacks and SVG flamegraphs preserve different evidence</strong>.
            Before sharing a performance profile, inspect the actual format—not merely whether raw prompt text is visible.
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: hiding content previews does not hide the run</h2>
              <p>
                The default JSON exporter replaces prompt, command and LLM-output previews with
                the string <code>redacted</code>. But its session summaries still include identifiers,
                hashes, models, timestamps, categorized file and network effects, and other structured
                evidence. The pprof exporter does not use that JSON preview switch at all: its samples
                carry semantic stacks plus a separate list of evidence labels. A folded stack or SVG
                presents fewer fields than the JSON session records, but its frames remain readable.
              </p>
              <p>
                This is an inspection of the released <strong>v1.0.35 source</strong> at
                <code> {productCommit}</code>, not a demonstration that a specific private token escaped
                or a claim that every session contains all these fields. For the general capture/export
                boundary, see <Link href="/security/">AgentSight security and local data handling</Link>;
                for deciding what the flamegraph widths mean, see
                <Link href="/guides/agent-flamegraph/"> the Agent Flamegraph guide</Link>.
              </p>
            </section>
            <section>
              <h2>What each output format actually retains</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.91rem' }}>
                  <thead><tr>
                    <th style={header}>Export format or option</th>
                    <th style={header}>Evidence retained in v1.0.35</th>
                    <th style={header}>Sharing decision</th>
                  </tr></thead>
                  <tbody>
                    {formatMatrix.map((row) => (
                      <tr key={row.format}>
                        <td style={cell}><strong>{row.format}</strong></td>
                        <td style={cell}>{row.visible}</td>
                        <td style={cell}>{row.limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                These are <strong>source-derived format contracts</strong>, not measured occurrence
                frequencies. Actual field presence depends on the input agent transcript, parsed
                events, view, filters and tagging options. A profile containing zero samples will not
                disclose all of the fields listed above; a custom stack can disclose others.
              </p>
            </section>
            <section>
              <h2>The default JSON redaction is deliberately narrow</h2>
              <p>
                The implementation serializes <code>session_to_json(session, include_previews)</code>
                alongside each JSON profile. Without the flag, it substitutes the literal
                <code> redacted</code> for prompt previews, command previews, and LLM response previews.
                It does <em>not</em> replace the surrounding records with aggregate totals. For example,
                <code> tool_events</code> can retain <code>process_chain</code>,
                <code> path_groups</code>, <code>domains</code>, tool classifications and
                a command hash; <code>llm_events</code> retain model names and token counts.
              </p>
              <p>
                A digest such as <code>cwd_hash</code> or <code>command_hash</code> is not encryption.
                It can support matching the same value across artifacts and, for a small candidate
                dictionary, sometimes guesses about the original value. Conversely, the presence of
                a hash does not establish that the original plaintext is exported. Judge each field
                by the concrete sharing threat model.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.91rem' }}>
                  <thead><tr>
                    <th style={header}>Surviving field family</th>
                    <th style={header}>What the source guarantees</th>
                    <th style={header}>Question before publication</th>
                  </tr></thead>
                  <tbody>
                    {fieldMatrix.map((row) => (
                      <tr key={row.field}>
                        <td style={cell}><code>{row.field}</code></td>
                        <td style={cell}>{row.interpretation}</td>
                        <td style={cell}>{row.review}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2>Pprof sample labels are not the same as flamegraph frames</h2>
              <p>
                The default operation stack is
                <code> task,skill,phase,action,object,repeat,result,outcome</code>, with
                a further <code>token</code> frame in the token view. Project, agent and session are
                not default stack frames, but the pprof builder separately serializes a set of
                evidence labels. The source-defined list includes <code>project</code>,
                <code> agent</code>, <code>session</code>, <code>source_kind</code>,
                <code> evidence_id</code>, <code>status</code>, <code>source_session</code>,
                <code> call_id</code> (normalized, not hashed), prompt/response hashes, timestamp, and skill, where available.
                Thus a screenshot showing only broad task rectangles is not a complete inventory of
                what the corresponding <code>.pb.gz</code> file contains.
              </p>
              <p>
                The builder passes label values through <code>safe_frame</code> and puts them into
                the pprof string table. That function lowercases and normalizes punctuation,
                and performs some path or private-marker substitutions. The source does not promise
                to detect arbitrary API keys, repository names or confidential task labels.
                The <Link href="/blog/what-agentsight-json-snapshot-exports-contain/">
                separate AgentSight JSON snapshot contract</Link> is a different exporter and
                must not be used as evidence for agentpprof field behavior.
              </p>
            </section>
            <section>
              <h2>How to audit your own profile before sending it</h2>
              <p>
                Use a synthetic or otherwise authorized session first. These commands are
                <strong> inspection steps, not a measured sample run</strong>; they assume the
                released <code>agentpprof</code> executable is available and the selected local
                project has readable supported sessions. Do not paste unredacted outputs into
                an issue or public chat.
              </p>
              <pre style={{ overflowX: 'auto' }}><code>{'agentpprof --project-root . --view operations -o review.json\n# Examine which keys remain in default no-preview JSON:\njq \'{root_keys: keys, session_keys: ((.sessions[0] // {}) | keys)}\' review.json\n\nagentpprof --project-root . --view operations -o review.pb.gz\n# pprof labels can disclose fields outside the displayed stack:\ngo tool pprof -tags review.pb.gz\n\nagentpprof --project-root . --view operations -o review.folded\n# Examine the human-readable semantic stack labels:\nhead -n 10 review.folded'}</code></pre>
              <p>
                Before considering <code>--include-previews</code>, first check the default output
                for unique identifiers, recognizable paths, external destinations, semantic tags,
                model identifiers, timestamps and retained hash values. If you need to publish an
                example, use a deliberately synthetic transcript or a separately reviewed, minimal
                aggregate. Merely renaming the file or converting a binary pprof into SVG does not
                define a disclosure policy.
              </p>
            </section>
            <section>
              <h2>A six-question disclosure review</h2>
              <ol>
                <li>Does the recipient need raw per-session evidence, or would a category-level total answer the question?</li>
                <li>Is the output JSON, pprof, folded, or SVG, and have you inspected that exact artifact?</li>
                <li>Did <code>--include-previews</code>, <code>--stack</code>, <code>--stack-rule</code>, or <code>--op-map</code> alter default disclosure?</li>
                <li>Can a model name, domain, project path, source file basename, timestamp or session ID identify the task?</li>
                <li>Do label normalization and hashes only pseudonymize values that can be linked elsewhere?</li>
                <li>Does the recipient have explicit authorization to receive the selected telemetry, including its retention and access conditions?</li>
              </ol>
              <p>
                A negative answer to the first question often means producing a smaller artifact,
                not increasing the number of redaction rules. A useful shared finding can retain
                category labels and relative weights while removing session-level identity and
                sensitive effects. That transformed artifact should itself be reviewed.
              </p>
            </section>
            <section>
              <h2>Limits of this source audit</h2>
              <p>
                This analysis checks the release implementation and documented formats, not every
                optional tagger, future output format, plugin, local transcript parser, or deployment.
                It does not prove a particular secret appears in a generated trace. Output may vary
                when custom rules, source-agent versions, or content are changed. The
                <code> time</code> view's widths represent event-derived elapsed intervals, not
                CPU samples, while <code>tokens</code> can use estimates when logs lack native token
                counts; neither should be silently relabeled as billed cost or CPU utilization.
                Local profiling is also distinct from exporting model-call telemetry via
                <Link href="/blog/how-agentsight-exports-opentelemetry-genai-spans/"> OpenTelemetry</Link>.
              </p>
              <p>
                To reproduce the source audit against this release, inspect the
                <code> PPROF_EVIDENCE_LABEL_FIELDS</code>, <code>session_to_json</code>,
                <code> safe_frame</code>, <code>write_pprof_samples</code>, and
                <code> write_projection</code> definitions in the pinned file. Compare them with
                the CLI flag in <code>main.rs</code> and the privacy warning in the agentpprof README.
              </p>
            </section>
            <section>
              <h2>Primary sources</h2>
              <p>
                All format claims are anchored to the AgentSight v1.0.35 product source released
                23 October 2026. This article was researched on 7 November 2026; it contains
                no invented user trace, real-world breach example, benchmark, or profile measurement.
              </p>
              <ul>{references.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                Next: <Link href="/security/">set the telemetry sharing boundary</Link> before
                circulating a flamegraph, and use the
                <Link href="/guides/agent-flamegraph/"> Agent Flamegraph guide</Link> to interpret its axes.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
