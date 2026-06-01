# Contract: Performance CLI

## `performance evaluate`

Evaluates a recommendation using paper-only entry and evaluation snapshots.

**Arguments**:

- `--recommendation <id>`
- `--entry-price <number>`
- `--evaluation-price <number>`
- optional `--horizon-days <number>`
- optional `--json`

**Success output**:

- outcome id
- classification
- absolute return
- percent return
- trace id

## `performance summary`

Prints aggregate outcome metrics.

**Arguments**:

- optional `--provider <id>`
- optional `--scenario <id>`
- optional `--json`

**Success output**:

- evaluated count
- unresolved count
- win/loss/neutral rates
- average return

## CLI Rules

- Commands must call core application services.
- Commands must label results as paper-trading performance.
- JSON output must be stable for automation.
