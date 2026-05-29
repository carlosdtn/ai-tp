# Data Model: AI Trading Platform

## Instrument

**Purpose**: Tradable symbol or market identifier tracked by the platform.

**Fields**: `id`, `symbol`, `displayName`, `assetClass`, `currency`, `market`,
`isActive`, `createdAt`, `updatedAt`.

**Validation**: `symbol` is required and normalized; `assetClass`, `currency`,
and `market` must be from supported value sets.

**Relationships**: Many-to-many with Watchlist through watchlist items; linked to
recommendations, market snapshots, and journal entries.

## Watchlist

**Purpose**: Named set of instruments used as recommendation workflow input.

**Fields**: `id`, `name`, `description`, `createdAt`, `updatedAt`.

**Validation**: `name` is required and unique within V1 workspace scope.

**Relationships**: Contains many instruments; has many workflow runs and
recommendations through those runs.

## WorkflowRun

**Purpose**: Traceable execution of a recommendation workflow.

**Fields**: `id`, `watchlistId`, `status`, `startedAt`, `completedAt`,
`triggeredBy`, `traceId`, `errorSummary`.

**Validation**: `traceId` is required and unique; `status` transitions from
`pending` to `running`, then `completed`, `failed`, or `partial`.

**Relationships**: Has many provider execution logs, market data snapshots, AI
analyses, recommendations, and paper simulations.

## MarketDataSnapshot

**Purpose**: Provider-sourced market data used during recommendation generation.

**Fields**: `id`, `workflowRunId`, `instrumentId`, `providerId`, `sourceRefs`,
`snapshot`, `asOf`, `freshnessStatus`, `createdAt`, `traceId`.

**Validation**: `snapshot` must satisfy the market-data contract; stale or
malformed snapshots cannot be used for finalized recommendations.

## AIAnalysis

**Purpose**: Structured provider analysis of an instrument and market context.

**Fields**: `id`, `workflowRunId`, `instrumentId`, `providerId`, `inputRef`,
`summary`, `rationale`, `confidence`, `rawResponseRef`, `createdAt`, `traceId`.

**Validation**: `confidence` is 0-1; required structured fields must exist before
analysis can be scored.

## ScoreResult

**Purpose**: Normalized scoring output for a recommendation candidate.

**Fields**: `id`, `workflowRunId`, `instrumentId`, `score`, `confidence`,
`factors`, `thresholds`, `createdAt`.

**Validation**: `score` and `confidence` are 0-1; factors must include enough
detail to explain the score.

## RiskAssessment

**Purpose**: Independent validation of a recommendation candidate against
paper-trading risk rules.

**Fields**: `id`, `workflowRunId`, `instrumentId`, `status`, `riskFactors`,
`warnings`, `rejectionReasons`, `constraints`, `createdAt`.

**Validation**: `status` is `passed`, `warning`, or `rejected`; rejected
assessments must include at least one rejection reason.

## Recommendation

**Purpose**: Auditable paper-trading decision record.

**Fields**: `id`, `workflowRunId`, `instrumentId`, `action`, `status`,
`inputSnapshot`, `sourceRefs`, `providerIds`, `score`, `confidence`, `risks`,
`explanation`, `traceId`, `createdAt`, `updatedAt`.

**Validation**: Cannot be finalized without input snapshot, sources, provider
identifiers, score, confidence, risk details, explanation, timestamps, and trace
identifier. Must always be paper-only.

**State transitions**: `draft` -> `actionable`, `warning`, or `rejected`;
terminal records may be reviewed and journaled but not converted to live orders.

## ProviderExecutionLog

**Purpose**: Audit record for every provider interaction.

**Fields**: `id`, `workflowRunId`, `providerType`, `providerName`, `operation`,
`requestMetadata`, `responseMetadata`, `status`, `durationMs`, `error`,
`traceId`, `createdAt`.

**Validation**: Every provider call creates a log; failed calls include error
details and never silently influence recommendations.

## PaperSimulation

**Purpose**: Simulated broker action or outcome linked to a recommendation.

**Fields**: `id`, `recommendationId`, `workflowRunId`, `instrumentId`, `action`,
`quantity`, `priceAssumption`, `status`, `reason`, `createdAt`, `traceId`.

**Validation**: Must be explicitly marked paper-only; live execution identifiers
are prohibited in V1.

## JournalEntry

**Purpose**: User or system note linked to decision history.

**Fields**: `id`, `instrumentId`, `recommendationId`, `paperSimulationId`,
`author`, `content`, `tags`, `entryType`, `createdAt`, `updatedAt`.

**Validation**: `content` is required; at least one contextual link is required
when entry type is recommendation or outcome.
