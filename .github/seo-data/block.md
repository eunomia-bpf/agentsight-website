# Human-only blockers

## npm scoped package first publication

- Blocked action: publish `@eunomia-bpf/agentsight@1.0.0` to the npm registry.
- Evidence: AgentSight npm workflow run `31065880814` built, tested, and packed version `1.0.0`, then npm returned `E404 Not Found` / insufficient permission for the scoped package.
- Impact: the website and documentation must not claim that the npm package is currently installable. The `v1.0.0` GitHub Release, Rust crates, Docker publication, and repository release remain valid.
- Minimum human action: an npm administrator must ensure the `@eunomia-bpf` scope and package can be published by the authorized account, perform or authorize the first package publication, and configure the repository's `npm-publish.yml` trusted publisher if required.
- Resolution evidence: a successful registry lookup for `@eunomia-bpf/agentsight@1.0.0` and a successful matching publish workflow or verified first publication.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow and
model-provider credential is expected and is not a blocker. Add an item here
only when an external system truly requires a human-only action or a required
connected-tool permission is absent. Include the blocked action, evidence,
impact, and minimum human action needed, then remove resolved items in the next
pull request.
