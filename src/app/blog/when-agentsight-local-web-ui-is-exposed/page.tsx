import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/when-agentsight-local-web-ui-is-exposed/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;
const title = 'When can an AgentSight local web UI expose recorded evidence?';

export const metadata: Metadata = {
  title,
  description: 'A v1.0.35 source audit of AgentSight report/record web UI loopback defaults, unauthenticated local API reads, Origin checks, and authenticated bind mode.',
  alternates: { canonical: articlePath },
  openGraph: { type: 'article', title, description: 'Separate loopback reachability, Origin filtering, and Direct Node capability authorization.', url: articlePath },
};

const matrix = [
  ['report serve; default --listen', '127.0.0.1:7395', 'No Direct Node auth configured', 'Only local host can connect under ordinary host networking; local callers can read the snapshot'],
  ['record with web UI enabled; default --listen', '127.0.0.1:7395', 'No Direct Node auth configured', 'Live capture endpoint is loopback-bound by default'],
  ['report serve --listen 0.0.0.0', 'All IPv4 interfaces', 'No Direct Node auth configured', 'A reachable same-network client without Origin can request evidence; do not expose without an independent access-control boundary'],
  ['bind; default --listen', '127.0.0.1:7395', 'Bootstrap bearer token and scoped capabilities', 'Protected protocol routes require bearer authorization; trusted app Origin is separately checked'],
  ['bind --listen 0.0.0.0 --endpoint ...', 'All IPv4 interfaces', 'Direct Node auth remains enabled', 'Explicit remote reachability does not remove capability checks; secure network transport and key handling still matter'],
] as const;

const sourceLinks = [
  ['CLI-wide --listen default and report serve dispatch', sourceRoot + '/collector/src/main.rs'],
  ['Loopback constant and local web-server construction', sourceRoot + '/collector/src/cmd_trace.rs'],
  ['HTTP request gating, snapshot contents, Origin handling, and regression tests', sourceRoot + '/collector/src/server/web.rs'],
  ['Direct Node bootstrap key and allowed Origin', sourceRoot + '/collector/src/cmd_bind.rs'],
  ['Capability validation and action/session scopes', sourceRoot + '/collector/src/server/capability.rs'],
  ['Public product data-sensitivity guidance', sourceRoot + '/README.md'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.7rem', verticalAlign: 'top' as const };
const head = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function LocalWebUiBoundaryArticle() {
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-17',
    dateModified: '2026-11-17',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };
  return (
    <SiteShell>
      <JsonLd value={structured} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><Link href="/blog/">Blog</Link>
            <span aria-current="page">Local web UI access boundary</span>
          </nav>
          <Eyebrow>Local telemetry access · v1.0.35 · 17 November 2026</Eyebrow>
          <h1>{title}</h1>
          <p className="hero-lede">
            AgentSight's ordinary <code>report serve</code> and capture web UI bind to
            <code> 127.0.0.1</code> by default. Their read API is designed for local access,
            not authenticated LAN exposure. If an operator changes <code>--listen</code> to
            <code> 0.0.0.0</code>, the web UI becomes network-reachable and a request
            without an <code>Origin</code> header can read its evidence API without a bearer
            token. The separately configured <code>agentsight bind</code> mode has a different,
            capability-protected access model.
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Why is loopback binding a security boundary?</h2>
              <p>
                The released CLI declares a global <code>--listen</code> flag whose default is
                <code> 127.0.0.1</code>. Both <code>report serve</code> and the optional record
                web UI route through <code>start_web_server_if_enabled</code>. The web server
                calls <code>TcpListener::bind</code> on the selected socket address, so the
                explicit bind address, not merely the URL printed to the terminal, defines
                which network interfaces accept connections.
              </p>
              <p>
                This review is pinned to <Link href="https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35">AgentSight v1.0.35</Link> at
                <code>{' ' + productCommit}</code>. It is a source-level reachability and
                request-gating audit, not a remote exploitation test or an observed production
                incident. Whether another machine can connect also depends on host firewalls,
                container port publishing, proxies, and network topology.
              </p>
            </section>
            <section>
              <h2>Five configurations, three different protections</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '830px' }}>
                  <thead><tr><th style={head}>Mode</th><th style={head}>Listener</th><th style={head}>API authorization</th><th style={head}>Interpretation</th></tr></thead>
                  <tbody>{matrix.map(([mode, listener, authorization, result]) => (
                    <tr key={mode}><td style={cell}>{mode}</td><td style={cell}><code>{listener}</code></td><td style={cell}>{authorization}</td><td style={cell}>{result}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              <p>
                A default loopback listener reduces network reachability. An HTTP
                <code> Origin</code> check controls a subset of cross-origin browser requests.
                A bearer capability check authorizes API reads. These controls are
                <strong> not interchangeable</strong>.
              </p>
            </section>
            <section>
              <h2>What does the local API actually authorize?</h2>
              <p>
                In <code>WebServer::new_with_db_path</code>, <code>direct_auth</code> is
                initially <code>None</code>. For <code>GET /api/v1/snapshot</code>,
                <code>protocol_access_allowed</code> returns
                <code> origin.is_none()</code> in that mode. A request that supplies an
                unapproved <code>Origin</code> is refused earlier, but a non-browser
                client or ordinary same-origin request may omit that header. Consequently
                an Origin check is <strong>not</strong> authentication for an explicitly
                network-exposed local server.
              </p>
              <p>
                The snapshot API can return reconstructed LLM and audit evidence:
                saved SQLite data when a DB path is selected, or the live materialized
                view with recent local native sessions otherwise. Captured artifacts can
                include prompts, responses, file paths, headers, and network targets.
                The non-authenticated local-mode branch does not mint capabilities;
                <code>POST /api/v1/capabilities</code> returns 404 without Direct access.
                Saved captures also refuse live overview and session messaging requests;
                read-only does not mean non-sensitive.
              </p>
            </section>
            <section>
              <h2>How is agentsight bind different?</h2>
              <p>
                <code>agentsight bind</code> constructs the web server with
                <code>with_direct_access</code>. The root bootstrap key is required to
                mint delegated capabilities, and protected protocol reads check bearer
                tokens against action and optional session scope. The allowed hosted-app
                Origin is enforced separately. Capability validity is bounded by expiry;
                a persisted capability is not equivalent to a permanent anonymous API.
                The <Link href="/blog/how-agentsight-direct-node-credentials-work/">Direct Node credential analysis</Link> examines
                token pairing, relay, and browser handling in more detail.
              </p>
              <p>
                Conversely, <code>bind</code> is not a generic TLS terminator. If exposing
                it beyond the local machine, evaluate network and endpoint transport
                separately; the existence of bearer tokens does not justify opening an
                unencrypted endpoint to an untrusted network.
              </p>
            </section>
            <section>
              <h2>Safe, reproducible checks on your own machine</h2>
              <p>
                To inspect the default behavior, use a non-sensitive local saved
                capture, keep the listener on loopback, and inspect the reported
                authorization flag. The following does not alter a firewall or open
                a public listener.
              </p>
              <pre><code>{[
                '# Terminal 1: keep the saved-session UI local',
                'agentsight report serve --db ./example.db --server-port 7395',
                '',
                '# Terminal 2: inspect only this host\'s listener and protocol metadata',
                'curl --silent http://127.0.0.1:7395/api/v1/info',
                '# For local-mode report serve, authorization_required is false',
                '',
                '# Do not replace the loopback listener with 0.0.0.0 just for inspection.',
              ].join('\n')}</code></pre>
              <p>
                Verify the exact listener with your operating system's socket tools
                and examine any reverse proxy, container port mapping, or forwarding.
                If evidence must be viewed remotely, use an explicitly authenticated
                architecture such as Direct Node with appropriately secured transport,
                or place a separate access-controlled tunnel in front of a loopback
                listener. Never assume that CORS is a network firewall.
              </p>
            </section>
            <section>
              <h2>Limitations and decision</h2>
              <p>
                This audit proves the released control flow and the threat boundary
                under an explicitly reachable listener; it does not establish
                unauthorized external access to any real deployment. Other users on
                the same host may have different local access depending on their OS
                privileges and process isolation. HTTP/1.1 routing, no-store JSON
                responses, and the Direct capability tests do not replace an end-to-end
                network deployment audit.
              </p>
              <p>
                The practical rule is simple: <strong>keep ordinary report/record web
                servers on loopback</strong>. If you need browser pairing or remote
                access, select a properly secured mechanism with actual authentication
                and transport controls. For selection of the saved evidence itself,
                read <Link href="/blog/how-agentsight-report-selects-a-session/">the report input-source analysis</Link>.
                For the canonical command reference, see <Link href="https://eunomia.dev/agentsight/">AgentSight documentation</Link>.
              </p>
            </section>
            <section>
              <h2>Versioned primary sources</h2>
              <ul>{sourceLinks.map(([label, url]) => <li key={label}><Link href={url}>{label}</Link></li>)}</ul>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
