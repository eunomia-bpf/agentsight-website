# Human-only blockers

## Provide the OpenAI API credential required by the agent runner

- Status: open
- Blocked action: start the scheduled Codex SEO operating cycle.
- Evidence: bootstrap workflow run `https://github.com/eunomia-bpf/agentsight-website/actions/runs/30983349752` stopped in `Preflight` because the `OPENAI_API_KEY` Actions secret was empty. Repository-scoped GitHub permissions and the pinned skill checkout succeeded.
- Impact: the skill, schedule, delivery controls, CI, and publication contract are installed, but no model-driven SEO decision or repository change can run until the provider credential exists.
- Smallest human action: add a repository or organization GitHub Actions secret named `OPENAI_API_KEY` containing a valid OpenAI API key, then manually dispatch `Autonomous SEO operations` once. Later daily runs need no human approval.

GitHub Models cannot be substituted directly into the pinned Codex action: GitHub Models exposes the Chat Completions inference API, while the Codex action requires a provider key and a Responses API endpoint. Do not add an unreviewed protocol-translation proxy merely to avoid the credential.
