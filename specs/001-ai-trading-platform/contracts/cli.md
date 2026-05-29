# Contract: CLI

## Commands

### `watchlist create`

Creates a watchlist.

**Arguments**: `--name`, optional `--description`

**Success output**: watchlist id, name, created timestamp.

### `watchlist add-instrument`

Adds an instrument to a watchlist.

**Arguments**: `--watchlist`, `--symbol`, optional `--market`, `--asset-class`

**Success output**: watchlist id, instrument id, normalized symbol.

### `recommendations run`

Runs a simulated recommendation workflow for a watchlist.

**Arguments**: `--watchlist`, optional `--scenario`, optional `--json`

**Success output**: workflow run id, trace id, recommendation summaries.

### `recommendations show`

Displays a recommendation audit summary.

**Arguments**: `--id`, optional `--json`

**Success output**: action, score, confidence, risk result, explanation, sources,
provider ids, trace id.

### `provider-logs list`

Lists provider execution logs for a workflow or recommendation.

**Arguments**: `--workflow-run` or `--recommendation`, optional `--json`

**Success output**: provider type, provider name, operation, status, duration,
timestamp, trace id.

### `journal add`

Adds a journal entry.

**Arguments**: optional `--instrument`, optional `--recommendation`, `--content`,
optional `--tag`

**Success output**: journal entry id and linked context.

## CLI Rules

- Commands must call application services, not duplicate business logic.
- Text output must be readable; JSON output must be stable for automation.
- Attempts to enable live trading must fail with a clear paper-only error.
- Errors must include a human-readable message and trace id when available.
