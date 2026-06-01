# Research: Recommendation Performance Tracking

## Decision: Store Evaluation Policy Before Outcome Evaluation

**Rationale**: Correctness must not be decided after seeing results. A policy
captures horizon, expected direction, neutral threshold, benchmark reference, and
method before evaluation.

**Alternatives considered**:

- Infer success rules at evaluation time: rejected because it weakens auditability.
- Use one global hard-coded policy only: rejected because future recommendations
  may need different horizons.

## Decision: Immutable Outcome Records

**Rationale**: Provider corrections and recalculations must preserve history. New
evaluations are appended and linked to the recommendation instead of overwriting
prior outcomes.

**Alternatives considered**:

- Mutate latest outcome in place: rejected because prior reports would become
  unreconstructable.

## Decision: Directional Classification with Neutral Threshold

**Rationale**: The first implementation needs clear, deterministic labels: win,
loss, neutral, and unresolved. A neutral threshold prevents tiny price moves from
being treated as meaningful correctness signals.

**Alternatives considered**:

- PnL-only reporting: rejected because users asked whether decisions were
  correct, not only what return was produced.
- Complex benchmark attribution in V1: deferred until real market data exists.

## Decision: Mock Evaluation Snapshots First

**Rationale**: The current platform is mock-provider first. Deterministic
evaluation snapshots let the feature be tested without real market-data costs.

**Alternatives considered**:

- Finnhub/Alpaca data immediately: deferred until provider integration specs are
  created.

## Decision: Performance Summary in Core

**Rationale**: Win rate, average return, unresolved count, and confidence/outcome
relationships are business metrics. CLI and dashboard should render these values,
not calculate them independently.

**Alternatives considered**:

- Dashboard-only metrics: rejected because CLI must expose the same workflow.
