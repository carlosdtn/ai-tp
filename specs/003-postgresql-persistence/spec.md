# Feature Specification: PostgreSQL Persistence

**Feature Branch**: `001-ai-trading-platform`
**Created**: 2026-06-01
**Status**: Draft
**Input**: Persist AI Trading Platform paper-trading data so CLI and web can share recommendations, outcomes, journal entries, provider logs, workflow runs, and watchlists across processes.

## User Scenarios & Testing

### User Story 1 - Persist CLI generated recommendations (Priority: P1)

As a platform operator, I want CLI-generated watchlists and recommendations to be stored in PostgreSQL so that later commands and the dashboard can inspect the same audit trail.

**Independent Test**: With `DATABASE_URL` configured, create or seed a watchlist, run recommendations, then list or show the recommendation from a new process.

### User Story 2 - Persist recommendation performance outcomes (Priority: P1)

As a paper-trading evaluator, I want outcome evaluations to be stored in PostgreSQL so that correctness tracking survives command restarts.

**Independent Test**: Evaluate a recommendation, start a separate CLI process, and verify `performance summary` includes the saved outcome.

### User Story 3 - Keep mock-only provider safety boundary (Priority: P1)

As a developer, I want persistence to be real while AI, broker, and market-data providers remain mock-only so the platform can be tested safely without live trading.

**Independent Test**: Run the persisted workflow and verify no broker live execution provider is required or invoked.

### User Story 4 - Support dashboard read model (Priority: P2)

As a dashboard user, I want the web app to load persisted recommendations and outcomes when a database is configured, with a mock seeded fallback when empty.

**Independent Test**: Start the web app with `DATABASE_URL`, generate data through CLI, and verify dashboard pages show persisted records.

## Requirements

- **FR-001**: The system MUST provide a Drizzle/PostgreSQL implementation for all core repository ports.
- **FR-002**: The persistence adapter MUST live outside `packages/core`.
- **FR-003**: The core business logic MUST NOT import Drizzle, Postgres, Neon, Next.js, or provider SDKs.
- **FR-004**: Repository writes MUST store complete audit payloads sufficient to reconstruct domain entities.
- **FR-005**: Recommendation outcomes MUST persist policy, input snapshots, source references, return metrics, evaluator, trace ID, and timestamps.
- **FR-006**: The CLI MUST use PostgreSQL repositories when `DATABASE_URL` is present and fall back to in-memory repositories when it is absent.
- **FR-007**: The web dashboard MUST use PostgreSQL repositories when `DATABASE_URL` is present and fall back to in-memory repositories when it is absent.
- **FR-008**: The database schema MUST include workflow runs because recommendations and provider logs reference workflow runs.
- **FR-009**: Database initialization MUST be explicit and safe for local/test databases.
- **FR-010**: No live trading integration may be added in this feature.

## Out of Scope

- Live broker execution.
- Real AI provider integration.
- Real market-data provider integration.
- Production-grade migrations and rollback orchestration.

## Success Criteria

- **SC-001**: `bun run test` passes with persisted repository tests.
- **SC-002**: `bunx turbo check` passes.
- **SC-003**: A local or Neon PostgreSQL database can be initialized from the repository.
- **SC-004**: CLI `performance evaluate` followed by a separate `performance summary` can show persisted outcome data when `DATABASE_URL` is set.
