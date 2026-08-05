# Human-only blockers

No human-only blockers.

The SEO scheduler intentionally lives outside this repository in an authorized
session-level task. The absence of a repository-hosted agent workflow or
`OPENAI_API_KEY` is expected and is not a blocker. Add an item here only when an
external system truly requires a human-only action or a required connected-tool
permission is absent. Include the blocked action, evidence, impact, and minimum
human action needed, then remove resolved items in the next pull request.
