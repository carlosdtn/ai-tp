# Feature Specification: Recommendation Performance Tracking

**Feature Branch**: `002-recommendation-performance-tracking`
**Created**: 2026-05-31
**Status**: Draft
**Input**: User description: "Track whether the bot's paper-trading recommendations were correct over time, with specifications for measuring outcomes and deciding what the next project step should be."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Track Recommendation Outcomes (Priority: P1)

As a platform user, I want each paper-trading recommendation to be evaluated after a defined time horizon so that I can see whether the recommendation was directionally correct.

**Why this priority**: The platform is only useful if users can learn whether recommendations worked after they were created.

**Independent Test**: Create a paper recommendation, attach an entry price snapshot, attach an evaluation price snapshot after the configured horizon, and verify that the platform classifies the outcome as win, loss, neutral, or unresolved.

**Acceptance Scenarios**:

1. **Given** a buy recommendation has an entry price and an evaluation price above the entry price, **When** the outcome is evaluated, **Then** the platform classifies the result as a win and stores the return percentage.
2. **Given** a buy recommendation has an evaluation price below the entry price beyond the neutral threshold, **When** the outcome is evaluated, **Then** the platform classifies the result as a loss and stores the return percentage.
3. **Given** a hold recommendation has limited price movement within the neutral threshold, **When** the outcome is evaluated, **Then** the platform classifies the result as neutral.
4. **Given** the evaluation horizon has not elapsed or the evaluation price is unavailable, **When** the platform checks the recommendation, **Then** the outcome remains unresolved and records the missing requirement.

---

### User Story 2 - Define Evaluation Rules Per Recommendation (Priority: P1)

As a platform user, I want every recommendation to store its evaluation horizon and success criteria so that correctness is measured consistently and not decided after the fact.

**Why this priority**: Outcome tracking must be auditable and fair; evaluation rules must be defined before performance is known.

**Independent Test**: Generate or create a recommendation with a default evaluation policy and verify that horizon, benchmark, neutral threshold, and expected direction are stored before outcome evaluation.

**Acceptance Scenarios**:

1. **Given** a recommendation is created, **When** the recommendation is stored, **Then** it includes an evaluation policy with horizon, expected direction, neutral threshold, and benchmark reference.
2. **Given** a user selects a custom horizon before evaluation, **When** the policy is saved, **Then** the platform stores the custom horizon in the recommendation audit trail.
3. **Given** a recommendation is already evaluated, **When** a user tries to change its original success policy, **Then** the platform blocks the change or stores it as a separate revised policy without rewriting history.

---

### User Story 3 - Review Performance Metrics (Priority: P2)

As a platform user, I want aggregate performance metrics across recommendations so that I can understand whether the bot is improving research quality over time.

**Why this priority**: Individual wins and losses are useful, but the user needs aggregate metrics to judge reliability.

**Independent Test**: Seed multiple evaluated recommendations and verify that the platform reports win rate, average return, average confidence by outcome, unresolved count, and performance by provider/scenario.

**Acceptance Scenarios**:

1. **Given** evaluated recommendations exist, **When** the user opens the performance summary, **Then** the platform displays total evaluated recommendations, win rate, loss rate, neutral rate, unresolved count, and average return.
2. **Given** recommendations have different providers or scenarios, **When** the user filters performance by provider or scenario, **Then** the metrics update to only include matching recommendations.
3. **Given** recommendations include scores and confidence, **When** performance is summarized, **Then** the platform shows how score and confidence relate to outcomes.

---

### User Story 4 - Preserve Auditability of Outcome Evaluation (Priority: P2)

As a developer or reviewer, I want outcome evaluations to store the data used, evaluation time, evaluator, and calculation method so that performance claims can be audited later.

**Why this priority**: Performance tracking must be explainable; otherwise users cannot trust reported accuracy.

**Independent Test**: Evaluate a recommendation and verify that the outcome record stores entry snapshot, evaluation snapshot, calculation method, evaluator, timestamps, source references, and trace identifier.

**Acceptance Scenarios**:

1. **Given** an outcome is evaluated, **When** the record is inspected, **Then** it includes entry price, evaluation price, return percentage, source references, evaluation method, evaluator, and timestamps.
2. **Given** an outcome is recalculated with new data, **When** the recalculation is saved, **Then** the platform preserves the previous outcome record and links the new record as a later evaluation.
3. **Given** market data is missing or stale, **When** evaluation is attempted, **Then** the platform records the failure reason and does not invent an outcome.

---

### User Story 5 - Display Outcome Tracking in Dashboard and CLI (Priority: P3)

As a platform user, I want to review recommendation outcomes in the dashboard and CLI so that I can inspect both individual results and aggregate performance from either interface.

**Why this priority**: The feature must be available through the same operating surfaces as recommendations.

**Independent Test**: Evaluate recommendations, then verify that dashboard and CLI can show individual outcomes and aggregate metrics.

**Acceptance Scenarios**:

1. **Given** a recommendation has an evaluated outcome, **When** the user opens recommendation detail, **Then** the outcome classification, return, horizon, and evaluation snapshot are visible.
2. **Given** multiple recommendations are evaluated, **When** the user opens performance dashboard, **Then** aggregate metrics are visible.
3. **Given** the user runs the CLI performance command, **When** metrics exist, **Then** the CLI prints a readable summary and supports JSON output.

### Edge Cases

- Recommendation has no entry price snapshot.
- Evaluation horizon has not elapsed.
- Evaluation market data is stale, missing, or malformed.
- Symbol was delisted or changed after recommendation creation.
- Recommendation action is hold or avoid and does not map to simple long return.
- Price moves within the neutral threshold.
- Multiple evaluations exist for the same recommendation.
- Evaluation is attempted with a different policy than the original recommendation policy.
- Benchmark data is unavailable.
- Provider data corrections change a previously computed result.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The platform MUST store an evaluation policy for each recommendation before the recommendation can be evaluated.
- **FR-002**: The evaluation policy MUST include expected direction, evaluation horizon, neutral threshold, benchmark reference, and calculation method.
- **FR-003**: The platform MUST store an entry snapshot for each recommendation, including price, timestamp, source references, and provider identifier.
- **FR-004**: The platform MUST evaluate recommendations using an evaluation snapshot captured at or after the configured horizon.
- **FR-005**: The platform MUST classify each evaluated recommendation as win, loss, neutral, or unresolved.
- **FR-006**: The platform MUST calculate and store absolute return and percentage return for evaluated recommendations when enough data exists.
- **FR-007**: The platform MUST store the source data, calculation method, evaluator, timestamps, and trace identifier for every outcome evaluation.
- **FR-008**: The platform MUST NOT overwrite historical outcome evaluations; recalculations MUST create new evaluation records linked to the original recommendation.
- **FR-009**: The platform MUST record unresolved outcomes with a reason such as missing data, stale data, horizon not elapsed, or unsupported action.
- **FR-010**: The platform MUST provide aggregate performance metrics including evaluated count, unresolved count, win rate, loss rate, neutral rate, and average return.
- **FR-011**: The platform MUST allow performance metrics to be filtered by instrument, watchlist, provider, scenario, score range, confidence range, outcome, and date range.
- **FR-012**: The platform MUST show individual outcome details on the recommendation detail view.
- **FR-013**: The platform MUST expose CLI commands to evaluate pending recommendations and display performance summaries.
- **FR-014**: The platform MUST preserve paper-trading-only labels in all outcome and performance views.
- **FR-015**: The platform MUST keep AI analysis, risk validation, recommendation generation, and outcome evaluation as separately identifiable audit steps.

### Key Entities *(include if feature involves data)*

- **EvaluationPolicy**: Rules defined before outcome evaluation; includes horizon, expected direction, neutral threshold, benchmark, and method.
- **EntrySnapshot**: Price and market context captured when the recommendation becomes trackable.
- **EvaluationSnapshot**: Price and market context captured at evaluation time.
- **RecommendationOutcome**: Auditable result record for a recommendation; includes classification, returns, policy, snapshots, evaluator, source references, timestamps, and trace identifier.
- **PerformanceSummary**: Aggregated metrics across a filtered recommendation set.
- **OutcomeEvaluationRun**: Traceable batch or single-recommendation evaluation workflow.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of evaluated recommendations have an immutable outcome record with policy, snapshots, classification, returns, sources, timestamps, and trace identifier.
- **SC-002**: The platform can classify seeded buy, hold, and avoid recommendations as win, loss, neutral, or unresolved using deterministic test data.
- **SC-003**: Aggregate performance summaries show evaluated count, unresolved count, win rate, loss rate, neutral rate, and average return.
- **SC-004**: Users can filter performance summaries by at least provider, scenario, instrument, confidence range, and date range.
- **SC-005**: Recalculating an outcome creates a new evaluation record without deleting or mutating the prior evaluation.
- **SC-006**: Dashboard and CLI both expose individual outcome details and aggregate performance summaries.

## Assumptions

- V1 outcome tracking remains paper-trading only.
- The first implementation can use mock market data for deterministic evaluation.
- Evaluation policies are created when recommendations are created or before the first evaluation.
- Benchmark-relative performance is supported by storing benchmark references, even if benchmark data is mock-only in the first implementation.
- Outcome tracking does not imply financial advice or live execution.
