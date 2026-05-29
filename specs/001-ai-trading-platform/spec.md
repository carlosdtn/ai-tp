# Feature Specification: AI Trading Platform

**Feature Branch**: `001-ai-trading-platform`
**Created**: 2026-05-29
**Status**: Draft
**Input**: User description: "Create the initial specification for an AI Trading Platform using GitHub Spec Kit / Spec-Driven Development. The project must be TypeScript-first and use Next.js App Router, Node.js, TypeScript, Neon PostgreSQL, Drizzle ORM, pnpm workspaces or Turborepo, TailwindCSS, Zod, CLI support, Web dashboard, and mock providers first. The platform must be AI-provider agnostic, broker-provider agnostic, market-data-provider agnostic, paper-trading only, explainable, auditable, modular, and based on Clean Architecture / Hexagonal Architecture. Do not implement live trading."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Auditable Paper-Trade Recommendations (Priority: P1)

As a platform user, I want the system to analyze watchlisted instruments using mock market data and mock AI analysis, score the opportunity, validate risk separately, and produce a paper-trading recommendation with a complete explanation so that I can evaluate strategy behavior before connecting real providers.

**Why this priority**: Recommendation generation is the core product loop and validates the provider-agnostic, explainable, auditable architecture without requiring live integrations.

**Independent Test**: Can be fully tested by seeding a watchlist, running the recommendation workflow with mock providers, and verifying that each recommendation stores inputs, sources, provider metadata, score, confidence, risks, and explanation.

**Acceptance Scenarios**:

1. **Given** a watchlist with at least one supported instrument and mock market data is available, **When** the user requests analysis, **Then** the platform creates a paper-trade recommendation with direction, rationale, score, confidence, risks, explanation, and source references.
2. **Given** the mock AI provider returns an analysis, **When** the recommendation is evaluated, **Then** the scoring engine assigns a normalized score independently from the AI provider's raw response.
3. **Given** a recommendation candidate has been scored, **When** risk validation runs, **Then** the risk engine records pass/fail status, risk factors, and constraints separately from the AI analysis.
4. **Given** a recommendation has been generated, **When** the user inspects it later, **Then** the stored record includes the original input payload, market data sources, AI provider identifier, broker provider identifier when applicable, score, confidence, risks, explanation, timestamps, and execution logs.

---

### User Story 2 - Review Recommendations in a Web Dashboard (Priority: P1)

As a platform user, I want a dashboard that shows watchlists, recommendations, risk status, scores, confidence, explanations, and audit trails so that I can review and compare paper-trading decisions.

**Why this priority**: The web dashboard is the main human review surface and must make decisions explainable and auditable from the first version.

**Independent Test**: Can be fully tested by creating mock recommendations and verifying that the dashboard displays recommendation details, filters by status/provider/instrument, and links to audit logs.

**Acceptance Scenarios**:

1. **Given** recommendations exist, **When** the user opens the dashboard, **Then** the user sees recent recommendations with instrument, action, score, confidence, risk status, provider, and creation time.
2. **Given** the user opens a recommendation detail view, **When** the page loads, **Then** the page displays the full explanation, input snapshot, source list, risk validation result, scoring breakdown, and provider execution logs.
3. **Given** the user filters recommendations by watchlist, provider, instrument, or risk status, **When** filters are applied, **Then** only matching recommendations are shown without mutating the underlying records.

---

### User Story 3 - Operate Core Workflows from a CLI (Priority: P2)

As a platform user, I want a CLI for watchlist management, mock provider runs, recommendation generation, and journal review so that core workflows can be automated and tested outside the web dashboard.

**Why this priority**: CLI support proves the core business logic does not depend on Next.js and enables repeatable local workflows.

**Independent Test**: Can be fully tested by running CLI commands against mock providers and verifying the same application services and persisted records used by the dashboard.

**Acceptance Scenarios**:

1. **Given** the CLI is installed in the workspace, **When** the user runs a command to add an instrument to a watchlist, **Then** the watchlist is updated through the core application service.
2. **Given** a watchlist exists, **When** the user runs a CLI recommendation command, **Then** the platform generates recommendations using mock providers and persists audit records.
3. **Given** provider execution logs exist, **When** the user runs a CLI log inspection command, **Then** the CLI prints a readable summary with provider name, request timestamp, status, and correlation identifier.

---

### User Story 4 - Maintain Provider-Agnostic Boundaries (Priority: P2)

As a developer, I want AI, broker, market data, database, dashboard, and CLI concerns isolated behind ports and adapters so that future integrations with real providers can be added without changing core business rules.

**Why this priority**: Provider agnosticism and Clean Architecture are hard constraints; enforcing them early reduces expensive rework.

**Independent Test**: Can be fully tested by dependency checks, contract tests against mock adapters, and verifying that the core package imports no Next.js, Neon, Drizzle, Claude, OpenAI, Alpaca, Finnhub, or Polygon modules.

**Acceptance Scenarios**:

1. **Given** the core package is inspected, **When** dependency boundaries are checked, **Then** core business logic depends only on domain types, application ports, validation schemas, and platform-neutral utilities.
2. **Given** a mock AI provider is replaced by another mock implementation, **When** recommendations are generated, **Then** no core business logic changes are required.
3. **Given** a mock market data provider returns malformed data, **When** the application service validates the response, **Then** the invalid provider response is rejected and logged without creating an invalid recommendation.

---

### User Story 5 - Keep a Journal of Paper-Trading Decisions (Priority: P3)

As a platform user, I want a journal connected to recommendations and paper-trading outcomes so that I can review the history of decisions, assumptions, and follow-up notes.

**Why this priority**: The journal completes the audit loop and supports learning from paper-trading decisions over time.

**Independent Test**: Can be fully tested by attaching notes to recommendations, recording paper outcome snapshots, and retrieving journal entries by instrument, recommendation, or date range.

**Acceptance Scenarios**:

1. **Given** a recommendation exists, **When** the user adds a journal note, **Then** the note is linked to the recommendation and includes author, timestamp, content, and optional tags.
2. **Given** a paper-trading recommendation is later reviewed, **When** the user records an outcome snapshot, **Then** the journal stores the observed result without implying live order execution.
3. **Given** journal entries exist, **When** the user filters by instrument or recommendation, **Then** matching entries are returned with their linked recommendation context.

### Edge Cases

- Mock AI provider returns low confidence, contradictory analysis, incomplete reasoning, or malformed JSON.
- Mock market data is stale, missing required fields, contains unsupported instruments, or has impossible values.
- Mock broker provider rejects a paper order simulation because of risk constraints, insufficient mock buying power, or invalid order shape.
- Risk engine rejects a recommendation after AI analysis has passed.
- Scoring engine produces a score near threshold boundaries.
- Multiple providers are run for the same instrument and produce conflicting results.
- A recommendation workflow is retried after a provider failure and must preserve idempotency and audit history.
- A user attempts to configure or trigger live trading.
- A real provider credential is accidentally supplied in v1.
- The dashboard and CLI read the same recommendation while a workflow is still in progress.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support a TypeScript-first monorepo architecture suitable for either pnpm workspaces or Turborepo.
- **FR-002**: The system MUST include a web dashboard built with Next.js App Router and TailwindCSS.
- **FR-003**: The system MUST include a Node.js CLI for operating supported platform workflows outside the dashboard.
- **FR-004**: The system MUST define core business logic in framework-independent TypeScript modules that do not depend on Next.js.
- **FR-005**: The core business logic MUST NOT depend directly on Claude, OpenAI, Alpaca, Finnhub, Polygon, Neon, Drizzle, or any concrete external provider SDK.
- **FR-006**: The platform MUST use Clean Architecture / Hexagonal Architecture, with provider implementations behind ports and adapters.
- **FR-007**: The first version MUST use mock AI, broker, and market data providers only.
- **FR-008**: The first version MUST NOT implement live trading, live order placement, real brokerage execution, or real-money workflows.
- **FR-009**: The system MUST reject or disable any attempt to perform live trading.
- **FR-010**: The platform MUST be AI-provider agnostic through an AI Provider Layer abstraction.
- **FR-011**: The platform MUST be broker-provider agnostic through a Broker Provider Layer abstraction.
- **FR-012**: The platform MUST be market-data-provider agnostic through a Market Data Provider Layer abstraction.
- **FR-013**: The Decision Engine MUST coordinate analysis inputs, provider responses, scoring, risk validation, and recommendation creation.
- **FR-014**: AI analysis and risk validation MUST be separate workflow steps with independently stored outputs.
- **FR-015**: The Scoring Engine MUST produce normalized scores and confidence values for recommendation candidates.
- **FR-016**: The Risk Engine MUST validate recommendation candidates against explicit paper-trading risk rules before a recommendation is finalized as actionable.
- **FR-017**: Every recommendation MUST store the input, sources, provider identifiers, score, confidence, risks, explanation, and timestamps.
- **FR-018**: Every provider call MUST create a provider execution log containing provider type, provider name, request metadata, response metadata, status, duration, correlation identifier, and error information when applicable.
- **FR-019**: The platform MUST persist recommendations, watchlists, journal entries, provider execution logs, and relevant audit records in PostgreSQL.
- **FR-020**: The persistence adapter SHOULD target Neon PostgreSQL through a database abstraction and use Drizzle ORM outside the core business logic.
- **FR-021**: Zod schemas MUST validate external inputs, provider responses, command inputs, and API request/response boundaries.
- **FR-022**: The Watchlist module MUST allow users to create watchlists and manage instruments.
- **FR-023**: The Recommendations module MUST allow users to generate, list, filter, and inspect recommendations.
- **FR-024**: The Journal module MUST allow users to attach notes and paper outcome observations to recommendations.
- **FR-025**: The Web Dashboard MUST display watchlists, recommendations, explanations, risk status, scoring details, provider execution logs, and journal entries.
- **FR-026**: The CLI MUST support watchlist management, recommendation generation, provider log inspection, and journal inspection for v1 workflows.
- **FR-027**: The system MUST expose deterministic mock provider fixtures for repeatable local testing.
- **FR-028**: The system MUST provide audit-friendly identifiers for workflow runs, provider calls, recommendations, and journal entries.
- **FR-029**: The system MUST make recommendation explanations available to both dashboard and CLI users.
- **FR-030**: The system MUST preserve provider raw input and response snapshots in a controlled audit format while avoiding accidental storage of real credentials or secrets.
- **FR-031**: The project MUST use Biome as the default formatter and lint/check tool for TypeScript, JavaScript, JSON, and supported project files.

### Non-Functional Requirements

- **NFR-001**: The platform MUST be modular, with independently testable packages or modules for core, providers, persistence, CLI, and web dashboard.
- **NFR-002**: Core domain and application services MUST be testable without a web server, database connection, or real provider network access.
- **NFR-003**: Provider adapters MUST be replaceable through interfaces without changing use cases or domain entities.
- **NFR-004**: The system MUST favor explicit types, strict TypeScript settings, and Zod validation at trust boundaries.
- **NFR-005**: Recommendation generation SHOULD be traceable end-to-end from user command or dashboard action to provider logs and persisted recommendation.
- **NFR-006**: The system SHOULD support local development with mock data and reproducible seed scenarios.
- **NFR-007**: The system SHOULD avoid storing secrets in source-controlled files, logs, recommendations, or provider execution records.
- **NFR-008**: The user interface SHOULD clearly label all recommendations and simulated broker actions as paper-trading only.
- **NFR-009**: Formatting and import organization SHOULD be reproducible through Biome commands runnable from the workspace root.

### Explicitly Out of Scope for V1

- Live trading or real brokerage order placement.
- Real-money portfolio management.
- Direct integrations with Claude, OpenAI, Alpaca, Finnhub, Polygon, or other real external providers.
- Automated trade execution without human review.
- Financial advice personalization, suitability assessment, tax advice, or regulated advisory workflows.
- Mobile applications beyond responsive web support.
- Multi-user organization management unless required by a later specification.

### Key Entities *(include if feature involves data)*

- **Instrument**: A tradable symbol or market identifier tracked by the platform; includes symbol, display name, asset class, currency, market, and active status.
- **Watchlist**: A named collection of instruments used as input for analysis workflows.
- **MarketDataSnapshot**: A provider-sourced snapshot of market data used by a recommendation workflow; includes provider identity, source references, prices, timestamps, and freshness metadata.
- **AIAnalysis**: The structured output from an AI provider adapter; includes provider identity, prompt/input reference, analysis summary, rationale, confidence, and raw response snapshot.
- **ScoreResult**: The normalized scoring output for a recommendation candidate; includes score, confidence, scoring factors, and threshold metadata.
- **RiskAssessment**: The independent risk validation output; includes pass/fail status, risk factors, constraints, warnings, and rejection reasons.
- **Recommendation**: The auditable paper-trading decision record; includes instrument, action, input snapshot, sources, provider identifiers, score, confidence, risks, explanation, status, and timestamps.
- **ProviderExecutionLog**: The audit record for each provider call; includes provider type, provider name, operation, correlation identifier, request metadata, response metadata, status, duration, and errors.
- **PaperOrderSimulation**: A simulated broker action used only for paper trading; includes intended action, quantity, price assumptions, simulated status, and linked recommendation.
- **JournalEntry**: A user-authored or system-authored note linked to recommendations, instruments, or paper outcomes; includes content, tags, timestamps, and references.
- **WorkflowRun**: A traceable execution of a platform workflow such as recommendation generation; links inputs, provider calls, decisions, logs, and outputs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can generate at least one fully persisted paper-trading recommendation from a seeded watchlist using only mock providers.
- **SC-002**: 100% of persisted recommendations include input snapshot, sources, provider identifiers, score, confidence, risks, explanation, and timestamps.
- **SC-003**: 100% of provider calls made during recommendation generation produce provider execution logs with correlation identifiers.
- **SC-004**: Core business logic tests run without importing Next.js, Drizzle, Neon, Claude, OpenAI, Alpaca, Finnhub, Polygon, or other concrete external provider SDKs.
- **SC-005**: The dashboard allows a user to inspect a recommendation's explanation, risk assessment, score details, source references, and provider execution logs from a single detail view.
- **SC-006**: The CLI can create or update a watchlist, trigger mock recommendation generation, and display generated recommendation summaries.
- **SC-007**: Attempts to trigger live trading are blocked by configuration, domain policy, or application service validation.
- **SC-008**: Mock provider fixtures allow deterministic recommendation workflow tests that produce repeatable outputs across local runs.
- **SC-009**: AI analysis and risk validation outputs are stored as separate records or separate clearly identifiable sections of the audit trail.
- **SC-010**: A developer can add a new mock provider implementation by satisfying a provider port contract without modifying domain entities or core use cases.

## Assumptions

- The initial project will be created under `~/Dev/ai-trading-platform`.
- The first specification covers the product baseline and architecture constraints; technical package layout will be detailed in the subsequent Spec Kit plan.
- The project will use TypeScript across application code, configuration, validation, and tests wherever practical.
- The database target is Neon PostgreSQL, but the core domain must remain persistence-agnostic.
- Drizzle ORM belongs in the infrastructure/persistence adapter layer, not in core domain logic.
- Mock providers will be deterministic by default, with optional scenario configuration for testing different market and analysis conditions.
- Authentication and multi-user permissions are not part of the first spec unless introduced by a later feature specification.
- The platform is for education, strategy research, and paper-trading simulation only, not financial advice or regulated investment management.

## Compliance Notes

- This specification intentionally stops before technical planning, task generation, or implementation.
- Next step in the Spec Kit workflow: generate `plan.md` from this `spec.md`.
- Implementation must not begin until the technical plan and implementation tasks have both been generated and reviewed.
