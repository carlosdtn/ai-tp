# Contract: Provider Ports

## AI Provider Port

**Operation**: Analyze an instrument using validated market context.

**Input**:

- `traceId`
- `workflowRunId`
- `instrument`
- `marketDataSnapshot`
- `analysisPrompt`
- `scenarioId` for mock providers

**Output**:

- `providerId`
- `summary`
- `rationale`
- `confidence`
- `risksMentioned`
- `rawResponseRef`
- `sourceRefs`

**Errors**:

- `PROVIDER_UNAVAILABLE`
- `INVALID_PROVIDER_RESPONSE`
- `LOW_CONFIDENCE_ANALYSIS`

## Market Data Provider Port

**Operation**: Fetch a market data snapshot for an instrument.

**Input**:

- `traceId`
- `workflowRunId`
- `instrument`
- `scenarioId` for mock providers

**Output**:

- `providerId`
- `asOf`
- `freshnessStatus`
- `snapshot`
- `sourceRefs`

**Errors**:

- `UNSUPPORTED_INSTRUMENT`
- `STALE_MARKET_DATA`
- `INVALID_MARKET_DATA`

## Broker Provider Port

**Operation**: Simulate a paper broker action.

**Input**:

- `traceId`
- `workflowRunId`
- `recommendationId`
- `instrument`
- `paperAction`
- `quantity`
- `priceAssumption`

**Output**:

- `providerId`
- `paperSimulationId`
- `status`
- `reason`
- `buyingPowerImpact`

**Errors**:

- `LIVE_TRADING_NOT_ALLOWED`
- `INVALID_PAPER_ORDER`
- `RISK_REJECTED`
- `INSUFFICIENT_SIMULATED_BUYING_POWER`

## Contract Rules

- Every provider operation must create a `ProviderExecutionLog`.
- Provider outputs must be runtime validated before use.
- Mock providers are the only V1 implementations.
- Provider identifiers are stored with recommendations and logs.
- Raw request/response snapshots must not contain secrets or live credentials.
