# AI Trading Platform

Spec-driven, TypeScript-first AI trading research platform for explainable and
auditable paper-trading recommendations.

This project is built with GitHub Spec Kit and follows a specification-driven
workflow: product specification, technical plan, implementation tasks, and then
implementation. The first version uses mock providers only and does not implement
live trading.

## Status

The current branch implements the V1 baseline:

- TypeScript monorepo managed with Bun workspaces
- Next.js App Router dashboard scaffold
- Bun-powered CLI
- Framework-independent core package
- Mock AI, broker, and market-data providers
- Decision, scoring, and risk engines
- Recommendation audit trail and provider execution logs
- Recommendation performance tracking for paper outcomes
- Journal domain and basic workflow support
- Drizzle/PostgreSQL persistence adapter skeleton
- Architecture, contract, unit, and integration tests

## Safety Boundary

This platform is paper-trading only.

It does not place live trades, submit live orders, connect to real broker
execution, or require real provider credentials. All broker behavior in V1 is
simulated through mock providers. Recommendations are research artifacts and are
not financial advice.

## Architecture

The project follows Clean Architecture / Hexagonal Architecture.

Core business logic lives in `packages/core` and does not depend on Next.js,
React, Drizzle, Neon, broker SDKs, AI SDKs, market-data SDKs, or CLI frameworks.
External concerns are implemented as adapters around core ports.

```text
apps/
├── web/                 # Next.js dashboard
└── cli/                 # Bun CLI

packages/
├── core/                # Domain, use cases, engines, ports, schemas
├── providers-mock/      # Mock AI, broker, and market-data providers
├── persistence-drizzle/ # Drizzle/PostgreSQL adapter skeleton
├── shared/              # Fixtures and test utilities
└── config/              # Shared TypeScript configuration

tests/
├── architecture/        # Boundary checks
├── contract/            # Provider and validation contracts
└── integration/         # End-to-end workflow checks
```

## Technology Stack

- Bun
- TypeScript
- Next.js App Router
- TailwindCSS
- Zod
- Drizzle ORM
- PostgreSQL / Neon target
- Turborepo
- Biome
- Vitest

## Getting Started

Install dependencies:

```bash
bun install
```

Run the full quality gate:

```bash
bun run check
bun run test
```

Run a mock recommendation workflow from the CLI:

```bash
bun run cli recommendations run --watchlist "AI Paper Ideas" --scenario default
```

Evaluate a paper recommendation outcome:

```bash
bun run cli performance evaluate --recommendation "<recommendation-id>" --entry-price 100 --evaluation-price 103
bun run cli performance summary
```

## Common Commands

```bash
bun run format
bun run format:check
bun run lint
bun run check
bun run test
bun run cli watchlist create --name "AI Paper Ideas"
bun run cli watchlist add-instrument --watchlist "AI Paper Ideas" --symbol "AAPL"
bun run cli recommendations run --watchlist "AI Paper Ideas" --scenario default
bun run cli performance evaluate --recommendation "<recommendation-id>" --entry-price 100 --evaluation-price 103
bun run cli performance summary
```

## Spec Kit Artifacts

The active feature specification is stored in:

```text
specs/001-ai-trading-platform/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

Implementation tasks are tracked in `tasks.md` and currently marked complete for
the V1 baseline.

The recommendation performance tracking feature is stored in:

```text
specs/002-recommendation-performance-tracking/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

## Provider Model

V1 uses deterministic mock providers:

- `mock-ai`
- `mock-market-data`
- `mock-broker`

Future real providers must be added by implementing the existing provider ports.
Core domain entities and use cases should not change when adding a new provider.

## Auditability

Every recommendation is designed to preserve:

- Input snapshot
- Source references
- Provider identifiers
- Score and confidence
- Risk assessment
- Explanation
- Timestamps
- Trace identifiers
- Provider execution logs

AI analysis, scoring, and risk validation are separate workflow steps.

## Performance Tracking

Performance tracking compares a recommendation's entry snapshot against a later
mock market-data snapshot. Outcomes are classified as `win`, `loss`, `neutral`,
or `unresolved` using an explicit evaluation policy. The current default policy
uses a 5-day paper horizon and a 1% neutral threshold.

Outcome records are immutable audit artifacts. They preserve recommendation ID,
entry and evaluation prices, source references, evaluation policy, evaluator,
return metrics, classification, trace ID, and creation timestamp. Aggregated
summaries report evaluated count, unresolved count, win/loss/neutral rates,
average return, and confidence grouped by outcome.

## Development Notes

- Keep business rules in `packages/core`.
- Keep provider integrations behind ports.
- Keep V1 mock-only and paper-trading-only.
- Use Zod at runtime trust boundaries.
- Run `bun run check` and `bun run test` before opening a pull request.
