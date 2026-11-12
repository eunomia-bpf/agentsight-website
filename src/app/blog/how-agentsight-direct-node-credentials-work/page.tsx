import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-direct-node-credentials-work/';

export const metadata: Metadata = {
  title: 'How AgentSight Direct Node credentials work',
  description:
    'A source-level guide to AgentSight v1.0.30 Direct Node pairing, bootstrap keys, browser capabilities, Controller relay capabilities, URL fragments, local storage, and remote-access trust boundaries.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight Direct Node credentials work',
    description:
      'Trace the exact credential path from agentsight bind to a browser Direct connection or Controller relay, including storage, expiry, route scope, and failure boundaries.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 bind implementation: Node bootstrap key, URL fragment, endpoint normalization, CORS origin, and relay startup',
    `${productSource}/collector/src/cmd_bind.rs`,
  ],
  [
    'AgentSight v1.0.30 browser Node client: pairing, Direct capability minting, transport selection, and browser persistence',
    `${productSource}/frontend/src/lib/nodeClient.ts`,
  ],
  [
    'AgentSight v1.0.30 relay client: allowlisted Node routes, short-lived relay capabilities, request bounds, and local forwarding',
    `${productSource}/collector/src/server/relay_client.rs`,
  ],
  [
    'AgentSight v1.0.30 Controller crypto: optional Direct configuration encryption with HKDF-SHA-256 and AES-256-GCM',
    `${productSource}/controller/src/core.ts`,
  ],
  [
    'AgentSight v1.0.30 Node capability enforcement',
    `${productSource}/collector/src/server/capability.rs`,
  ],
  [
    'MDN URI fragment reference: fragments are handled by the client and are not sent with the resource request',
    'https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment',
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function DirectNodeCredentialArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight Direct Node credentials work',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-28',
    dateModified: '2026-08-28',
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
            <span aria-current="page">Direct Node credentials</span>
          </nav>
          <Eyebrow>Remote-access architecture · AgentSight v1.0.30 · 28 August 2026</Eyebrow>
          <h1>How AgentSight Direct Node credentials work</h1>
          <p className="hero-lede">
            <code>agentsight bind</code> does not give the browser one permanent bearer token and reuse it everywhere.
            AgentSight v1.0.30 separates a persistent Node bootstrap key from scoped capabilities. Direct browsers mint a
            longer-lived capability for normal Node requests; Controller relay mints a short-lived capability for each
            authorized action. Understanding that lifecycle matters before exposing a Node on a LAN, VPN, public HTTPS
            endpoint, or hosted relay.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short version: bootstrap authority and normal request authority are different</h2>
              <p>
                The Node creates a persistent bootstrap key under the local AgentSight configuration directory. On Unix,
                the file is created with mode <code>0600</code>. The binding URL carries that key only so the browser can
                identify the Node and ask it to mint a capability. The browser then uses the capability—not the bootstrap
                key—for ordinary snapshot, overview, session-read, and session-message requests.
              </p>
              <p>
                Controller relay follows the same principle with a shorter lifetime. Controller authorizes a semantic
                action, the Node relay client mints a local capability valid for 60 seconds for that action and optional
                session, and the relayed request is forwarded to the same Node HTTP protocol. The Node remains the final
                capability-enforcement boundary.
              </p>
            </section>

            <section>
              <h2>The credential lifecycle</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Credential</th>
                      <th style={header}>Created or supplied by</th>
                      <th style={header}>Where it lives</th>
                      <th style={header}>What it can do</th>
                      <th style={header}>Lifetime</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Node bootstrap key</td>
                      <td style={cell}><code>agentsight bind</code></td>
                      <td style={cell}>Persistent private Node config; temporarily present in the binding URL fragment.</td>
                      <td style={cell}>Pair a Direct browser and mint Node capabilities; authenticate the Node relay connection.</td>
                      <td style={cell}>Survives Node restarts until the local key is replaced.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Direct browser capability</td>
                      <td style={cell}>Node capability endpoint after Direct pairing</td>
                      <td style={cell}>Browser Direct-connection state and Node capability store.</td>
                      <td style={cell}><code>node.info</code>, <code>evidence.read</code>, <code>session.read</code>, and <code>session.message</code>.</td>
                      <td style={cell}>Requested for 12 hours by the v1.0.30 browser client.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Relay capability</td>
                      <td style={cell}>Node relay client after Controller authorizes the requested route/action</td>
                      <td style={cell}>Node-local capability state for the relayed operation.</td>
                      <td style={cell}>One semantic action, optionally restricted to one session.</td>
                      <td style={cell}>60 seconds in the v1.0.30 relay client.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Optional synced Direct configuration</td>
                      <td style={cell}>Signed-in user opt-in</td>
                      <td style={cell}>Controller D1 as ciphertext plus IV; decrypted only with the Controller secret and user/Node-derived key.</td>
                      <td style={cell}>Restore a compact Direct endpoint/bootstrap configuration in another browser.</td>
                      <td style={cell}>Until the account copy is deleted or replaced.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>The binding key is put in a URL fragment, not a query string</h2>
              <p>
                <code>cmd_bind.rs</code> serializes <code>action=bind</code>, protocol version, Node endpoint, and token
                after <code>#</code>. The unit test explicitly checks that the generated binding URL contains no query
                string. This is a meaningful boundary: standard browsers process URI fragments client-side and do not
                send the fragment as part of the HTTP request for the page.
              </p>
              <p>
                That design reduces accidental disclosure to the hosted page request path, but it does not make a
                binding URL harmless. Anything that can read the full URL before the browser consumes it—clipboard
                history, screenshots, shell history, another local process, or a person you send it to—can potentially
                obtain bootstrap authority. Treat the complete binding link as a secret until pairing is complete.
              </p>
            </section>

            <section>
              <h2>Direct pairing immediately exchanges bootstrap authority for scoped authority</h2>
              <p>
                The browser first normalizes the supplied Direct endpoint to an HTTP(S) origin with no embedded
                credentials, path, query, or fragment. It probes <code>/api/v1/info</code> with the bootstrap key, then
                POSTs to <code>/api/v1/capabilities</code> asking for the four normal Direct actions and a 12-hour TTL.
                The returned <code>cap_...</code> token becomes the credential used by the browser&apos;s normal Node client.
              </p>
              <p>
                This makes a leaked normal Direct capability materially different from a leaked bootstrap key. The
                capability is bounded by action and expiry. The bootstrap key can mint new capabilities and therefore
                should be exposed more narrowly. Do not copy the bootstrap key into automation or long-lived browser
                configuration when a scoped capability is enough.
              </p>
            </section>

            <section>
              <h2>Direct still means the browser talks to the Node</h2>
              <p>
                A Direct connection performs browser <code>fetch()</code> calls against the configured Node endpoint and
                supplies the capability in the <code>Authorization</code> header. The frontend marks loopback and local
                address spaces explicitly for browser local-network handling. A Direct endpoint can be loopback, a
                private address, or an HTTPS hostname; the browser has to be able to reach it.
              </p>
              <p>
                The Node&apos;s <code>--app-url</code> determines the allowed browser origin for Direct access. If the Node
                listens on an unspecified address such as <code>0.0.0.0</code> or <code>::</code>, AgentSight requires an
                explicit browser-reachable <code>--endpoint</code> instead of pretending the wildcard listen address is a
                usable URL. These checks solve endpoint identity and browser access; they do not provide network-layer
                encryption for a plain HTTP endpoint.
              </p>
            </section>

            <section>
              <h2>Relay changes the transport, not the Node protocol</h2>
              <p>
                With the default hosted app, <code>agentsight bind</code> also starts a WebSocket relay connection to the
                Controller. The Node authenticates that outbound connection with its bootstrap credential. Controller can
                then forward only an allowlisted subset of the Node protocol: capability minting internally, snapshot,
                overview, one-session reads, and session messages. Arbitrary Node paths and query shapes are rejected by
                the relay client before local forwarding.
              </p>
              <p>
                For normal relayed data and control operations, the relay client does not forward the persistent
                bootstrap key. It maps the request to a semantic action, mints a 60-second Node-local capability, and
                forwards the request to the local Node with that capability. The implementation also bounds concurrent
                relay requests to eight, sets a 24-second request timeout, and caps a relay response at 16 MiB.
              </p>
            </section>

            <section>
              <h2>Detailed payloads can transit Controller relay without becoming Controller history</h2>
              <p>
                “Node-authoritative” does not mean a relayed response never crosses Controller. A snapshot or session
                response requested through Relay necessarily transits the relay path while that request is active. The
                architecture boundary is persistence: Controller coordinates the request and the response can exist in
                runtime memory, while detailed Node payloads are not stored as a Controller telemetry history.
              </p>
              <p>
                This distinction matters when choosing a deployment mode. If the requirement is that detailed evidence
                never transit the hosted relay, use Local or a Direct path you control. If managed remote connectivity is
                acceptable, Relay provides a constrained path while the Node remains authoritative for the session data.
              </p>
            </section>

            <section>
              <h2>Cloud-synced Direct configuration is explicit and encrypted, but it is still bootstrap material</h2>
              <p>
                Direct configuration stays in the current browser by default. AgentSight also has an explicit signed-in
                opt-in that can save a compact Direct configuration for use from another browser. The Controller code
                encrypts that configuration with AES-256-GCM. The encryption key is derived with HKDF-SHA-256 from a
                32-byte Controller secret plus the user and Node identifiers; those identifiers are also bound as
                authenticated additional data.
              </p>
              <p>
                D1 stores ciphertext, IV, and version rather than plaintext Direct configuration. That is a storage
                protection boundary, not an argument that the synced configuration is low-value. The decrypted object
                still contains the endpoint and bootstrap access key, so enabling cross-browser sync deliberately moves
                recoverable bootstrap material into the hosted coordination path.
              </p>
            </section>

            <section>
              <h2>Choose the connection mode from the trust requirement</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Requirement</th>
                      <th style={header}>Prefer</th>
                      <th style={header}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>One machine; no hosted coordination needed</td>
                      <td style={cell}>Local</td>
                      <td style={cell}>No Controller account or remote transport is required.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Browser can reach the Node over loopback, LAN, VPN, or your HTTPS endpoint</td>
                      <td style={cell}>Direct</td>
                      <td style={cell}>The browser reads the Node directly with a scoped capability.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Need hosted identity, organization discovery, roles, or managed remote connectivity</td>
                      <td style={cell}>Controller-managed / Relay</td>
                      <td style={cell}>Controller authorizes access and relays the bounded Node protocol when Direct is unavailable.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Detailed runtime payload must not transit AgentSight-hosted infrastructure</td>
                      <td style={cell}>Local or Direct</td>
                      <td style={cell}>Do not use Relay for the payload path; keep connectivity under your control.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>What not to infer from the design</h2>
              <p>
                A capability system does not make an exposed HTTP Node safe on an untrusted network; transport security
                and endpoint exposure are separate controls. A URL fragment reduces server-side request leakage but does
                not protect a copied binding URL from whoever can read it. Encrypted cross-browser Direct sync protects
                stored plaintext in D1 but still places recoverable bootstrap material behind the Controller secret and
                account authorization. Finally, Relay being non-authoritative storage does not mean payload bytes never
                transit Relay memory.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Decision boundary</p>
            <h2>Direct is a transport choice, not a weaker authentication mode.</h2>
            <p>
              Both Direct and Relay end at Node capability enforcement. The important differences are who can reach the
              endpoint, which credential is in use, whether payloads transit Controller, and where configuration is
              persisted.
            </p>
            <Link className="arrow-link" href="/architecture/">See the full architecture</Link>
            <Link className="arrow-link" href="/security/">Review data handling</Link>
            <a className="arrow-link" href={site.docs}>Read product documentation</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
