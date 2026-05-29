<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Principle 1 placeholder -> I. Core Independence and Hexagonal Boundaries
- Principle 2 placeholder -> II. Paper-Trading Safety Only
- Principle 3 placeholder -> III. Provider Agnosticism Through Ports
- Principle 4 placeholder -> IV. Explainability, Auditability, and Traceability
- Principle 5 placeholder -> V. TypeScript-First Quality Gates
Added sections:
- Platform Constraints
- Development Workflow
Removed sections:
- Template placeholder comments and undefined placeholder sections
Templates requiring updates:
- Updated: .specify/templates/plan-template.md
- Updated: .specify/templates/tasks-template.md
- Reviewed: .specify/templates/spec-template.md
- Reviewed: .specify/templates/checklist-template.md
Follow-up TODOs:
- None
-->

# AI Trading Platform Constitution

## Core Principles

### I. Core Independence and Hexagonal Boundaries

Core business logic MUST live in framework-independent TypeScript modules organized
around domain entities, application use cases, and explicit ports. The core MUST
NOT import Next.js, React, Drizzle, Neon, provider SDKs, CLI frameworks, HTTP
frameworks, or adapter-specific code. Web, CLI, persistence, broker, AI, and
market-data integrations MUST be adapters outside the core boundary.

Rationale: the trading decision model must be testable, portable, and protected
from framework or provider churn.

### II. Paper-Trading Safety Only

The platform MUST remain paper-trading only. Live order placement, real-money
broker execution, production brokerage credentials, and automated real trade
execution are prohibited. Any workflow that resembles execution MUST be modeled
as a simulation with explicit paper-trading labels, persisted assumptions, and
domain-level guards that reject live-trading modes.

Rationale: safety is a product boundary, not a UI label. The system must make
unsafe states unrepresentable or explicitly rejected.

### III. Provider Agnosticism Through Ports

AI, broker, market-data, and persistence capabilities MUST be accessed through
application-defined ports. Concrete providers, including mock providers, MUST
implement those ports as adapters. V1 MUST use deterministic mock AI, broker, and
market-data providers only. Future real providers MUST be added by implementing
ports and contracts without changing domain entities or core use cases.

Rationale: provider independence is the basis for modularity, testability, and
future integration work.

### IV. Explainability, Auditability, and Traceability

Every recommendation MUST persist its input snapshot, source references, provider
identifiers, score, confidence, risk assessment, explanation, timestamps, and
correlation identifiers. AI analysis and risk validation MUST be separate steps
with separately identifiable outputs. Every provider call MUST produce an
execution log with request metadata, response metadata, status, duration, and
error details when applicable.

Rationale: users and developers must be able to reconstruct why a paper-trading
recommendation was made and which data and providers influenced it.

### V. TypeScript-First Quality Gates

Application code, validation, configuration, and tests SHOULD be TypeScript-first
unless a tool-specific file format is required. Strict typing, Zod validation at
trust boundaries, Biome formatting/linting, and automated tests are required for
core logic and provider contracts. New business behavior MUST be covered by tests
that can run without real provider network access.

Rationale: explicit types and repeatable checks reduce ambiguity in financial
decision workflows and preserve confidence as adapters are added.

## Platform Constraints

- The repository MUST use a pnpm workspace or Turborepo-compatible monorepo
  structure.
- The web dashboard MUST use Next.js App Router and TailwindCSS, but dashboard
  code MUST call core use cases through application boundaries.
- The CLI MUST run on Node.js and use the same core application services as the
  dashboard.
- PostgreSQL persistence SHOULD target Neon through an infrastructure adapter.
  Drizzle ORM is allowed only outside the core boundary.
- Provider response schemas, API inputs, CLI inputs, and persistence-facing
  payloads MUST be validated with Zod or generated schemas with equivalent
  runtime validation.
- Mock providers MUST be deterministic by default and support repeatable scenario
  fixtures for tests and demos.
- Secrets, real provider credentials, and live trading configuration MUST NOT be
  committed, logged, or stored in recommendation audit payloads.

## Development Workflow

- Spec Kit order is mandatory: specification, technical plan, implementation
  tasks, then implementation.
- Each plan MUST include a Constitution Check before research and again after
  design.
- Each task list MUST preserve user-story independence and include explicit
  tasks for boundary checks, provider contract tests, audit logging, risk/scoring
  separation, and Biome checks when relevant.
- Core tests MUST run without a web server, database connection, or networked
  provider.
- Adapter tests MAY use local infrastructure or mocked boundaries, but MUST NOT
  require real AI, broker, or market-data provider credentials in V1.
- Pull requests or implementation summaries MUST call out any constitution
  deviations and include a complexity justification when a simpler boundary would
  satisfy the requirement.

## Governance

This constitution supersedes informal project preferences and applies to all
specifications, plans, tasks, implementation, and reviews. Amendments require a
documented change to this file, a version bump, a sync impact report, and review
of dependent Spec Kit templates.

Versioning follows semantic versioning:

- MAJOR: removes or redefines a core principle or relaxes the paper-trading-only
  boundary.
- MINOR: adds a principle, required section, or materially expands governance.
- PATCH: clarifies wording without changing obligations.

Compliance is reviewed during Spec Kit planning, task generation, implementation
review, and before any future provider integration work. A plan that violates a
principle MUST either be revised or document the violation in Complexity
Tracking with a concrete rationale and safer alternatives considered.

**Version**: 1.0.0 | **Ratified**: 2026-05-29 | **Last Amended**: 2026-05-29
