import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/read-agentsight-audit-provenance/';

export const metadata: Metadata = {
  title: 'How to read AgentSight audit provenance and confidence',
  description:
    'A source-level guide to AgentSight view_source and confidence: direct capture, SQLite reconstruction, native agent sessions, correlation scores, legacy fallbacks, and safe snapshot review.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How to read AgentSight audit provenance and confidence',
    description:
      'Learn what AgentSight view_source and confidence actually mean before comparing audit, LLM, process, session, and tool evidence.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 snapshot schema: provenance fields, compatibility, and sensitive-data boundary',
    `${productSource}/docs/snapshot-schema.md`,
  ],
  [
    'AgentSight v1.0.30 analysis model: audit, process, tool, session, and LLM row definitions',
    `${productSource}/ext/analysis/src/model.rs`,
  ],
  [
    'AgentSight v1.0.30 live projection: request/response matching and source-specific confidence values',
    `${productSource}/ext/analysis/src/view/projection.rs`,
  ],
  [
    'AgentSight v1.0.30 SQLite source: reconstruction, prompt deduplication, and provenance hardening',
    `${productSource}/ext/analysis/src/sources/sqlite.rs`,
  ],
  [
    'AgentSight v1.0.30 native-session source: local agent session materialization',
    `${productSource}/ext/analysis/src/sources/agent_native.rs`,
  ],
  [
    'AgentSight product PR #204: reviewed provenance implementation and legacy-schema compatibility',
    'https://github.com/eunomia-bpf/agentsight/pull/204',
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function AuditProvenanceArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to read AgentSight audit provenance and confidence',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-27',
    dateModified: '2026-08-27',
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
            <span aria-current="page">Audit provenance</span>
          </nav>
          <Eyebrow>Evidence interpretation · AgentSight v1.0.30 · 27 August 2026</Eyebrow>
          <h1>How to read AgentSight audit provenance and confidence</h1>
          <p className="hero-lede">
            AgentSight can show two rows that refer to the same logical model call but come from different evidence paths.
            One may be emitted directly from captured runtime events; another may be reconstructed later from a saved
            SQLite database or parsed from an agent&apos;s native session history. The important question is therefore not
            only “what does this row say?” but also “where did this row come from, and what does its confidence number
            measure?” AgentSight v1.0.30 makes that lineage explicit with <code>view_source</code> and optional
            <code> confidence</code> fields.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer: treat provenance as a type, not as decoration</h2>
              <p>
                The exported snapshot schema defines four row-level provenance values. <code>view</code> means the row was
                emitted from captured events in the live materialized view. <code>sqlite</code> means AgentSight
                reconstructed or reprojected the row while loading normalized persisted data. <code>agent_native_session</code>
                means the evidence came from a supported agent&apos;s own native session files. <code>unknown</code> is the
                compatibility value for legacy or otherwise unclassified evidence.
              </p>
              <p>
                These values describe lineage. They do not say that one source is universally “better,” and they do not
                identify the logical operation by themselves. A directly captured LLM <code>call</code> row and a later
                reconstructed LLM <code>request</code> row can both describe the same interaction while correctly carrying
                different provenance. Review tools should keep that distinction instead of flattening all rows into one
                undifferentiated event stream.
              </p>
            </section>

            <section>
              <h2>The four sources answer different questions</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}><code>view_source</code></th>
                      <th style={header}>What happened</th>
                      <th style={header}>Good use</th>
                      <th style={header}>Main caveat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>view</code></td>
                      <td style={cell}>A runtime event was normalized and projected directly into the live materialized view.</td>
                      <td style={cell}>Reasoning about observed process, file, network, LLM, token, or tool activity near capture time.</td>
                      <td style={cell}>Correlation can still be heuristic; direct capture does not make every semantic join exact.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>sqlite</code></td>
                      <td style={cell}>A saved database was loaded and a row was reconstructed or derived from persisted normalized rows.</td>
                      <td style={cell}>Reopening completed runs, producing reports, and rebuilding audit views without the original live process.</td>
                      <td style={cell}>A reconstructed row may summarize or infer relationships rather than reproduce one original capture event byte-for-byte.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agent_native_session</code></td>
                      <td style={cell}>AgentSight parsed the agent&apos;s own local session history.</td>
                      <td style={cell}>Conversation/session identity, prompts, responses, tool history, and token metadata available from supported agent formats.</td>
                      <td style={cell}>Native history is application evidence, not an independent operating-system trace of every effect.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>unknown</code></td>
                      <td style={cell}>The old artifact or row does not carry a classified lineage.</td>
                      <td style={cell}>Compatibility with captures created before provenance columns existed.</td>
                      <td style={cell}>Do not silently promote it to a stronger source based on surrounding rows.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Confidence is local to the reconstruction rule that produced the row</h2>
              <p>
                AgentSight does not define <code>confidence</code> as a globally calibrated probability. The live LLM
                correlator illustrates why. When a response carries a request ID that exactly matches a pending request,
                the current code assigns <code>0.95</code>. If there is only one pending request on the stream, the match is
                <code>0.75</code>. If there are several pending requests but only one viable request candidate, it uses
                <code>0.70</code>. A response that cannot be paired is retained as an orphan response at <code>0.35</code>.
              </p>
              <p>
                Those numbers describe confidence in one particular request/response correlation procedure. A reconstructed
                prompt from SQLite can carry <code>0.50</code>. Agent-native rows can carry <code>0.95</code> for a different
                reason: confidence in extraction and lineage from the native session source. Therefore
                <code>0.95 view</code> and <code>0.95 agent_native_session</code> are not interchangeable measurements. The
                numeric equality does not mean the evidence has the same semantics or failure modes.
              </p>
            </section>

            <section>
              <h2>One logical call can legitimately create more than one audit row</h2>
              <p>
                During live capture, AgentSight records a pending LLM request, keeps a bounded queue per PID/TID stream,
                and later attempts to pair a response. The queue is capped at 16 pending requests per stream and entries
                older than five minutes are pruned. The resulting call, token, tool, and LLM audit rows retain the
                correlation confidence used by that pairing.
              </p>
              <p>
                When a saved database is reopened, AgentSight can project prompt-oriented audit rows from persisted LLM
                calls. That projection is useful for a report view, but it is a new row derived from normalized storage.
                Its <code>view_source</code> becomes <code>sqlite</code> instead of pretending it is the original direct
                capture. This is exactly the case where deduplicating by “same timestamp + same text” without preserving
                lineage can lose information.
              </p>
            </section>

            <section>
              <h2>The implementation prevents captured payloads from forging stronger provenance</h2>
              <p>
                Provenance is metadata assigned by AgentSight, not a field trusted from the application payload. The
                SQLite reconstruction path explicitly checks internally assigned call kinds when deciding whether a prompt
                came from an agent-native session. A captured request containing a user-controlled field that happens to
                say <code>agent_native_session</code> does not get promoted to that source. The regression tests in the
                pinned v1.0.30 source preserve the row as SQLite/captured evidence instead.
              </p>
              <p>
                This distinction matters when the observed workload is itself untrusted. Audit metadata that decides how
                strongly a reviewer interprets a row should not be forgeable by putting reserved-looking keys inside the
                traced JSON body.
              </p>
            </section>

            <section>
              <h2>Legacy databases remain readable, but missing provenance stays missing</h2>
              <p>
                PR #204 added writable SQLite migrations for the provenance columns while retaining read fallbacks for
                older schemas. If an old <code>audit_events</code> or <code>llm_calls</code> table lacks the columns,
                AgentSight reads the source as <code>unknown</code> and confidence as <code>null</code>. That is preferable
                to inventing certainty retroactively.
              </p>
              <p>
                Consumers should follow the same rule. Snapshot schema version 1 allows additive fields, so a parser should
                tolerate new fields and treat missing provenance on older example artifacts as unknown rather than failing
                the whole import or assigning a modern default score.
              </p>
            </section>

            <section>
              <h2>Use a small evidence hierarchy when reviewing a surprising finding</h2>
              <p>
                Start with the row&apos;s provenance and then ask whether the claim depends on correlation. A directly captured
                file-open event is different from a reconstructed process placeholder. A native session prompt is different
                from a TLS-captured request. If two sources agree, preserve both instead of converting the agreement into a
                higher made-up confidence number. If they disagree, identify which field is source-dependent and reproduce
                the bounded task before escalating.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Review question</th>
                      <th style={header}>What to inspect</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Was this row observed or reconstructed?</td>
                      <td style={cell}><code>view_source</code> first; do not infer lineage from the row&apos;s text.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Does the finding depend on an LLM request/response pair?</td>
                      <td style={cell}>Inspect the confidence and whether the row is a call, request, response, or orphan.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Do two rows describe the same logical operation?</td>
                      <td style={cell}>Compare stable IDs, session/conversation context, PID/TID context, timestamps, and source-specific fields before deduplication.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Can absence be treated as proof?</td>
                      <td style={cell}>Only after checking capture scope, source coverage, persistence, reconstruction rules, and any event/content bounds.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Export a snapshot, then keep the provenance fields in downstream tooling</h2>
              <p>
                <code>agentsight report export -o snapshot.json</code> writes schema version 1 of the materialized view. The
                same shape is available from <code>GET /api/v1/snapshot</code>. For a quick inspection, keep
                <code>view_source</code> and <code>confidence</code> beside the semantic fields instead of stripping them
                during normalization.
              </p>
              <pre><code>{`agentsight report export -o snapshot.json

jq '.audit_events[] |
  {audit_type, action, target, status, view_source, confidence}' snapshot.json

jq '.process_nodes[] |
  {pid, command, status, view_source, confidence}' snapshot.json`}</code></pre>
              <p>
                The top-level <code>summary.source</code> identifies the materialized-view source, while row-level
                <code>view_source</code> identifies lineage for individual evidence. Do not substitute one for the other in
                an export pipeline.
              </p>
            </section>

            <section>
              <h2>Snapshot provenance does not make the snapshot safe to publish</h2>
              <p>
                The schema documentation marks several fields as captured content. Request paths, command lines,
                <code>argv</code>, working directories, audit targets/details, session attributes, and tool inputs/outputs
                can contain repository names, user paths, prompts, responses, credentials, or other sensitive material.
                Provenance tells you where evidence came from; it is not a redaction layer.
              </p>
              <p>
                For a review artifact, keep only the fields needed to support the question, redact sensitive values, and
                preserve the provenance metadata for the rows you retain. A smaller evidence package with explicit lineage
                is usually easier to review than a raw snapshot with every captured detail.
              </p>
            </section>

            <section>
              <h2>The practical rule</h2>
              <p>
                Read <code>view_source</code> before interpreting <code>confidence</code>. Read the semantic row only after
                you know which evidence path produced it. Never rank heterogeneous sources by confidence score alone, and
                never convert agreement between sources into an invented probability. When the result matters, preserve the
                independent rows and reproduce the bounded run.
              </p>
              <p>
                That turns provenance from a UI label into an audit contract: the reviewer can distinguish direct runtime
                observation, persistence-time reconstruction, native application history, and legacy uncertainty without
                pretending they are the same measurement.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <div className="aside-card">
              <Eyebrow>Use this when</Eyebrow>
              <p>You are exporting, comparing, deduplicating, or reviewing AgentSight evidence from more than one source.</p>
            </div>
            <div className="aside-card">
              <Eyebrow>Related</Eyebrow>
              <ul>
                <li><Link href="/security/">Security and data handling</Link></li>
                <li><Link href="/use-cases/review-ai-generated-prs/">Review AI-generated pull requests</Link></li>
                <li><Link href="/mcp-server-audit/">Audit MCP server activity</Link></li>
                <li><Link href="/blog/observe-ai-agent-sessions-in-docker/">Docker-backed native sessions</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
