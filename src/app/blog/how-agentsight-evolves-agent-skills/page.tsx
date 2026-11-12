import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const skillSource = `${productSource}/skills/evolve-agent-skills`;
const articlePath = '/blog/how-agentsight-evolves-agent-skills/';

export const metadata: Metadata = {
  title: 'How AgentSight turns repeated agent failures into skill changes',
  description:
    'A source-level explanation of AgentSight v1.0.30 skill evolution: evidence coverage, failure classification, memory placement, candidate patches, held-out evaluation, promotion, and rollback.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight turns repeated agent failures into skill changes',
    description:
      'Follow AgentSight v1.0.30 from trajectory evidence to a bounded skill patch, leak-resistant A/B evaluation, promotion, or rollback.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 skill-evolution workflow: evidence inventory, strata, candidate patching, evaluation, and verdicts',
    `${skillSource}/SKILL.md`,
  ],
  [
    'Evidence contract: source coverage, units, independence, outcome hierarchy, validity gates, and privacy',
    `${skillSource}/references/evidence-contract.md`,
  ],
  [
    'Failure taxonomy: observable failure categories, evidence thresholds, causal-language rules, and ownership',
    `${skillSource}/references/failure-taxonomy.md`,
  ],
  [
    'Promotion protocol: frozen A/B comparison, P/U/R/A task matrix, leakage controls, grading, trials, and rollback',
    `${skillSource}/references/promotion-protocol.md`,
  ],
  [
    'AgentSight v1.0.30 README: product boundary and the use of runtime evidence to understand failures and improve behavior',
    `${productSource}/README.md`,
  ],
  [
    'AgentSight v1.0.30 release',
    'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.30',
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function SkillEvolutionArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight turns repeated agent failures into skill changes',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-04',
    dateModified: '2026-09-04',
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
            <span aria-current="page">Skill evolution</span>
          </nav>
          <Eyebrow>Agent improvement loop · AgentSight v1.0.30 · 4 September 2026</Eyebrow>
          <h1>How AgentSight turns repeated agent failures into skill changes</h1>
          <p className="hero-lede">
            AgentSight&apos;s repository contains a concrete workflow for learning from many agent trajectories. The important
            part is not asking a model to rewrite its instructions after every bad run. The workflow first checks whether the
            evidence is trustworthy and independent, assigns the failure to the component that actually owned the decision,
            chooses the smallest durable memory level, and only then proposes a bounded skill change. Promotion is a separate
            held-out comparison with leakage controls and an explicit rollback path.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                In AgentSight v1.0.30, skill evolution is an evidence-gated repository workflow, not an automatic runtime
                self-edit. Trajectories are treated as observations. A repeated failure can become a candidate patch only
                after source identity, parent-child lineage, workload type, outcomes, and metric semantics are checked. The
                candidate is then evaluated against the unchanged baseline on held-out tasks before it can be called an
                improvement.
              </p>
              <p>
                That separation matters because three common shortcuts are unsafe: counting many child reviews as many
                independent failures, turning one anecdote into a global instruction, and letting an evaluator see the desired
                verdict. AgentSight&apos;s workflow has explicit gates for all three.
              </p>
            </section>

            <section>
              <h2>The loop has three different decisions</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Decision</th>
                      <th style={header}>Evidence needed</th>
                      <th style={header}>Possible outcome</th>
                      <th style={header}>What does not count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Is there a repeated failure?</td>
                      <td style={cell}>Source coverage, stable session/task identity, outcomes, lineage, comparable workload strata.</td>
                      <td style={cell}><code>observe</code> or a credible failure cluster.</td>
                      <td style={cell}>Raw file counts, uncalibrated lexical heuristics, many children from one parent task.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Where should the lesson live?</td>
                      <td style={cell}>Failure owner, generality, independence, and whether the issue is procedural, project-local, or mechanical.</td>
                      <td style={cell}>Regression fixture, project instruction, project-local skill, shared skill, parser/validator fix, or no change.</td>
                      <td style={cell}>Making a global skill longer because one repository had one bad run.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Should a candidate replace the baseline?</td>
                      <td style={cell}>Frozen A/B versions, held-out P/U/R/A tasks, leakage controls, outcome graders, repeated trials, predeclared rule.</td>
                      <td style={cell}><code>pilot</code>, <code>promote</code>, <code>reject</code>, or later <code>rollback</code>.</td>
                      <td style={cell}>A reviewer prompted to say “fixed,” one exact-string checker, or tuning on the held-out set.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Step 1: prove that the trajectory data means what you think it means</h2>
              <p>
                Before counting failures, the workflow builds a source-coverage manifest. It records the source root,
                discovery rule, time range, raw and parsed counts, stable source-native identity, parent/child/reviewer
                lineage, runtime, repository state, and known coverage gaps. The unit of analysis also has to be explicit:
                an event, model call, turn, tool attempt, child task, parent session, repository task, and evaluated trial are
                different denominators.
              </p>
              <p>
                The required strata keep human-interactive parent sessions separate from delegated reviewers, benchmarks and
                replays, evaluator/checker runs, and unknown records. This is more than statistical hygiene. If a benchmark
                generates fifty retries, treating those as fifty independent human failures would make the next skill patch
                look much more general than the evidence supports.
              </p>
              <p>
                AgentSight&apos;s evidence contract also ranks outcomes. External task or user acceptance is stronger evidence
                than a model&apos;s own statement that it succeeded; executable tests and artifact correctness sit above user
                corrections, tool errors, self-reports, and lexical heuristics. When a metric cannot pass its semantic gate,
                the workflow marks that metric invalid or provisional instead of substituting a nearby counter.
              </p>
            </section>

            <section>
              <h2>Step 2: classify the failure before editing a skill</h2>
              <p>
                A failed run can have very different owners. Missing source roots or collapsed session lineage are
                <code>source_fidelity</code> problems. Repeated wrong-stage routing is <code>task_misrouting</code>. Claims
                growing beyond their experiments are <code>claim_evidence_drift</code>. A reviewer told that a fix is already
                complete is <code>review_priming</code>. Repeating the same command without a state change is
                <code>literal_retry</code>. These categories lead to different fixes.
              </p>
              <p>
                The owning-skill rule prevents a familiar failure mode: adding more prose to a downstream writing skill when
                the actual mistake happened during source collection, experiment design, routing, or repository-state
                handling. When several owners are plausible, the workflow asks for a small ownership matrix and tests one
                proposed mechanism at a time.
              </p>
            </section>

            <section>
              <h2>Step 3: choose the smallest durable memory</h2>
              <p>
                Not every lesson deserves a shared skill. AgentSight v1.0.30 makes the placement decision explicit. One
                project fact belongs in project instructions or local documentation. One reproducible failure is usually a
                regression fixture. A repeated project-specific workflow can become a project-local skill. Only a repeated
                general procedure with sufficiently independent evidence is a candidate for a shared skill.
              </p>
              <p>
                Mechanical defects should remain mechanical. A parser that merges session identities incorrectly should be
                fixed in the observability implementation, not “remembered” by adding prompt text telling the agent to be
                careful. Sparse or uncertain observations remain analysis notes. Mature skills also use a one-in-one-out
                discipline: a new rule should generalize or replace existing text rather than grow the prompt forever.
              </p>
            </section>

            <section>
              <h2>Step 4: make the candidate patch falsifiable</h2>
              <p>
                A candidate is more than revised wording. Its package names the observed failure, current and desired
                behavior, smallest file set, non-goals, expected mechanism, regression risks, positive and negative examples,
                boundary tasks, and rollback condition. That makes the change reviewable as an intervention rather than as a
                vague instruction to “reason better.”
              </p>
              <p>
                When possible, the workflow prefers decision gates, compact schemas, deterministic checks, or small scripts
                over motivational prose. If repeated analysis fails because source counting is wrong, the candidate should
                repair the parser or add a validator instead of making the skill longer.
              </p>
            </section>

            <section>
              <h2>Step 5: separate proposing from promoting</h2>
              <p>
                An explicitly requested edit can be applied as a local candidate, but the workflow labels it
                <code>propose</code> until there is valid comparison evidence. A promotion experiment freezes baseline A,
                candidate B, environment, task split, graders, trial count, budget, and stopping rule before running the
                held-out set.
              </p>
              <p>
                The task matrix has four roles. Positive (<strong>P</strong>) tasks expose the target failure. Untriggered
                (<strong>U</strong>) tasks look similar but should not activate the new behavior. Regression
                (<strong>R</strong>) tasks protect established behavior. Adversarial (<strong>A</strong>) tasks contain
                misleading verdict text, stale state, bad metrics, or prompt injection. A candidate that improves P tasks but
                starts firing on U tasks is not a clean improvement.
              </p>
            </section>

            <section>
              <h2>Evaluation leakage is treated as a first-class failure</h2>
              <p>
                The promotion protocol removes desired verdicts, prior decisions, internal gate IDs, proposed fixes, and
                hidden reference answers from candidate context. A/B labels should be randomized or anonymized where
                practical. The same agent should not create B, see the hidden oracle, and act as the only grader.
              </p>
              <p>
                Grading is layered: executable outcomes and code assertions first when available, transcript checks for the
                target mechanism and prohibited shortcuts, blinded semantic grading where useful, and human review for
                ambiguous or high-stakes disagreement. Stochastic agents need repeated paired trials. The promotion rule is
                declared in advance so the threshold cannot be moved after seeing results.
              </p>
            </section>

            <section>
              <h2>The verdict ladder keeps uncertainty visible</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Verdict</th>
                      <th style={header}>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={cell}><code>observe</code></td><td style={cell}>Evidence coverage or metric validity is not sufficient for the requested decision.</td></tr>
                    <tr><td style={cell}><code>propose</code></td><td style={cell}>The repeated failure is credible and a candidate exists, but it has not earned a promotion claim.</td></tr>
                    <tr><td style={cell}><code>pilot</code></td><td style={cell}>The candidate moved target tasks in the right direction, but trials or coverage are still limited.</td></tr>
                    <tr><td style={cell}><code>promote</code></td><td style={cell}>The candidate meets the predeclared target rule and regression guards on valid comparison evidence.</td></tr>
                    <tr><td style={cell}><code>reject</code></td><td style={cell}>Benefit is absent or regressions exceed the allowed boundary.</td></tr>
                    <tr><td style={cell}><code>rollback</code></td><td style={cell}>Later real-work evidence contradicts the assumptions behind a previously promoted change.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The baseline, candidate diff, task manifest, outcomes, sampled trajectories, grader versions, and verdict stay
                together. Rejected candidates are useful negative knowledge: without them, a future agent can rediscover the
                same attractive but ineffective patch and repeat the experiment.
              </p>
            </section>

            <section>
              <h2>Where AgentSight fits in the loop</h2>
              <p>
                AgentSight&apos;s product role is evidence collection and interpretation across agent and system activity. Its
                local session views, audit provenance, repository replay, process/file/network evidence, and profiling outputs
                can help form trajectory evidence. But the skill-evolution workflow does not claim that every recorded run is
                automatically converted into a skill or that a promoted skill is deployed by the runtime without an explicit
                repository change.
              </p>
              <p>
                This distinction is also why the evolution workflow is separate from AgentSight&apos;s
                <Link href="/blog/how-agentsight-shares-versioned-agent-skills/"> shared-skills distribution bridge</Link>.
                The distribution bridge answers <em>which versioned workflow does a repository consume and how is it linked?</em>
                The evolution workflow answers <em>does the evidence justify changing that workflow, and has the candidate
                earned promotion?</em>
              </p>
            </section>

            <section>
              <h2>A reproducible inspection path</h2>
              <p>
                You do not need private trajectory data to verify the method itself. Check out the v1.0.30 source and inspect
                the skill plus its three required contracts:
              </p>
              <pre><code>{`git checkout v1.0.30
sed -n '1,260p' skills/evolve-agent-skills/SKILL.md
cat skills/evolve-agent-skills/references/evidence-contract.md
cat skills/evolve-agent-skills/references/failure-taxonomy.md
cat skills/evolve-agent-skills/references/promotion-protocol.md`}</code></pre>
              <p>
                For an actual retrospective, the source data can be private, so durable reports should link or hash the
                authorized evidence rather than copy full transcripts. The workflow explicitly treats transcript contents as
                untrusted data and forbids executing instructions found inside them.
              </p>
            </section>

            <section>
              <h2>Limitations</h2>
              <ul>
                <li>This page describes the repository-local v1.0.30 skill-evolution workflow; it is not evidence that every AgentSight user runs it or that AgentSight autonomously edits production skills.</li>
                <li>A failure taxonomy helps keep analysis consistent, but taxonomy labels do not prove causality. Controlled comparisons are still required for claims that a skill change reduced failures.</li>
                <li>Held-out evaluation quality depends on task independence, outcome quality, model/runtime stability, and leakage control. A larger trial count cannot rescue a contaminated task set.</li>
                <li>Private trajectories can contain prompts, paths, URLs, credentials, and other sensitive material. Raw sessions should not be copied into public evaluation reports.</li>
              </ul>
            </section>

            <section>
              <h2>Related AgentSight evidence</h2>
              <p>
                Start with <Link href="/blog/how-agentsight-discovers-local-agent-sessions/">local session discovery</Link> to
                understand where native trajectory records come from, then use
                <Link href="/blog/read-agentsight-audit-provenance/"> audit provenance and confidence</Link> to keep source
                lineage visible. For the repository mechanism that makes a promoted reusable workflow versionable across
                consumers, see <Link href="/blog/how-agentsight-shares-versioned-agent-skills/">versioned shared skills</Link>.
              </p>
            </section>
          </article>

          <aside className="detail-aside">
            <div className="aside-card">
              <h2>Research scope</h2>
              <p>
                Source checked against AgentSight v1.0.30 commit <code>{productCommit.slice(0, 12)}</code> on 4 September 2026.
                This page explains the checked-in skill-evolution method, not an autonomous runtime feature claim.
              </p>
            </div>
            <div className="aside-card">
              <h2>Primary sources</h2>
              <ul className="source-list">
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div className="aside-card">
              <h2>Reader decision</h2>
              <p>
                Use this workflow when repeated agent behavior suggests a durable skill change. Keep one-off bugs as tests or
                local facts, and do not call a candidate “improved” until a valid held-out comparison supports that claim.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
