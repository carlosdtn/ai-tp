# Research: AI Trading Platform

## Decision: Use Bun Workspaces with Turborepo-Compatible Tasks

**Rationale**: Bun workspaces provide package linking, a fast package manager, and
a TypeScript runtime for the CLI. Turborepo-compatible scripts allow later task
caching and graph-aware execution without changing package boundaries.

**Alternatives considered**:

- Single Next.js app: rejected because the core must not depend on the dashboard.
- Separate repositories: rejected because V1 benefits from shared contracts,
  fixtures, and atomic changes.

## Decision: Core Package Owns Domain, Use Cases, Ports, and Engines

**Rationale**: A single core package keeps domain rules, application services,
provider ports, scoring, decision, and risk logic close together while blocking
adapter imports through architecture tests.

**Alternatives considered**:

- Separate packages for every engine: deferred until complexity justifies it.
- Framework services inside the dashboard: rejected by constitution.

## Decision: Mock Providers Are First-Class Adapters

**Rationale**: Mock AI, broker, and market-data providers validate contracts,
audit behavior, and product flows before any real integration exists.

**Alternatives considered**:

- Stubbing providers inside tests only: rejected because the app and CLI need
  usable deterministic workflows.
- Real provider sandbox integrations in V1: rejected because V1 is mock-only.

## Decision: Drizzle and PostgreSQL Live Only in Persistence Adapter

**Rationale**: Persistence is required for auditability, but database concerns
must stay outside core. A repository/port boundary allows tests to use in-memory
or fake repositories for core workflows.

**Alternatives considered**:

- Core imports Drizzle schemas directly: rejected by constitution.
- File-only storage for V1: rejected because audit persistence and future Neon
  compatibility are explicit project goals.

## Decision: Zod Validates Trust Boundaries and Provider Payloads

**Rationale**: Provider outputs, CLI inputs, web/API inputs, and persistence
payloads need runtime validation so malformed data cannot create invalid
recommendations.

**Alternatives considered**:

- TypeScript-only types: rejected because provider and user inputs are runtime
  data.
- Ad hoc validation: rejected because contracts must be explicit and testable.

## Decision: CLI and Dashboard Share Application Services

**Rationale**: The CLI proves the core is interface-independent and makes local
workflows repeatable. The dashboard focuses on review and inspection but does not
own business rules.

**Alternatives considered**:

- Separate CLI workflow logic: rejected because it would duplicate business
  behavior.
- Dashboard-only V1: rejected because CLI support is a stated feature.

## Decision: Architecture Tests Are Required Foundation

**Rationale**: The most important long-term risk is accidental boundary erosion.
Automated checks must fail if `packages/core` imports web, persistence, provider
SDK, CLI, or framework-specific modules.

**Alternatives considered**:

- Code review only: rejected because dependency mistakes are easy to miss.
- Enforce boundaries later: rejected because early package layout determines
  future integration cost.
