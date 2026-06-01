# Data Model: Recommendation Performance Tracking

## EvaluationPolicy

**Purpose**: Defines how a recommendation will be judged before outcome data is
known.

**Fields**: `id`, `recommendationId`, `expectedDirection`, `horizonDays`,
`neutralThresholdPct`, `benchmarkSymbol`, `method`, `createdAt`.

**Validation**: `horizonDays` must be positive; `neutralThresholdPct` must be
zero or positive; `expectedDirection` is `up`, `down`, or `flat`.

## EntrySnapshot

**Purpose**: Market snapshot at recommendation tracking start.

**Fields**: `price`, `timestamp`, `sourceRefs`, `providerId`.

**Validation**: `price` must be positive; source and provider are required.

## EvaluationSnapshot

**Purpose**: Market snapshot used to evaluate outcome after the configured
horizon.

**Fields**: `price`, `timestamp`, `sourceRefs`, `providerId`.

**Validation**: `price` must be positive; timestamp must be at or after entry
snapshot timestamp.

## RecommendationOutcome

**Purpose**: Immutable evaluation record linked to a recommendation.

**Fields**: `id`, `recommendationId`, `policy`, `entrySnapshot`,
`evaluationSnapshot`, `classification`, `absoluteReturn`, `percentReturn`,
`unresolvedReason`, `evaluator`, `method`, `sourceRefs`, `traceId`, `createdAt`.

**Validation**: Evaluated outcomes require entry/evaluation snapshots and return
values. Unresolved outcomes require an unresolved reason.

## PerformanceSummary

**Purpose**: Aggregate metrics across outcome records.

**Fields**: `evaluatedCount`, `unresolvedCount`, `winRate`, `lossRate`,
`neutralRate`, `averageReturnPct`, `averageConfidenceByOutcome`.

**Validation**: Rates are 0-1 and computed only over relevant outcome groups.

## OutcomeEvaluationRun

**Purpose**: Traceable execution of one or more recommendation evaluations.

**Fields**: `id`, `status`, `startedAt`, `completedAt`, `traceId`, `evaluated`,
`unresolved`, `errorSummary`.

**Validation**: Completed runs store counts and trace identifiers.
