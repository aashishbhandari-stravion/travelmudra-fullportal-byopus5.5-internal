# Repository map

| Repository | Path | Holds | Remote | Who pushes |
|---|---|---|---|---|
| Product (public-bound) | project root | TravelMudra source, tests, build configuration, public docs | `origin` (private GitHub repository; visibility owned by the product owner) | Product owner only |
| Internal records | `internal/` (nested, own `.git`, excluded from the product repository) | Build specification, design records, traceability, verification evidence, engineering overrides, reviews | none configured | Product owner only |

Boundary: installed 2026-10-04 with `repo_boundary.py install . --layout nested` (hooks: pre-commit, commit-msg, pre-push). Extra project rules in `agent/repo-boundary.json`.
Agents never push. Milestones are committed and tagged on the product repository's local `main`.
