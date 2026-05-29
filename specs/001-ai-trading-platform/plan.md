# Implementation Plan: AI Trading Platform

**Branch**: `001-ai-trading-platform` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-ai-trading-platform/spec.md`

## Summary

Build the V1 baseline for an explainable, auditable, paper-trading-only AI Trading
Platform. The implementation will use a TypeScript monorepo with strict
hexagonal boundaries: core domain/application logic in framework-independent
packages, mock-only provider adapters for AI, broker, and market data, persistence
behind ports, a Next.js dashboard, and a Node.js CLI that both call the same
application services.

## Technical Context

**Language/Version**: TypeScript with strict settings; Node.js active LTS runtime.

**Primary Dependencies**: Next.js App Router, React, TailwindCSS, Zod, Drizzle ORM,
PostgreSQL driver, pnpm workspaces, Turborepo, Biome, and a Node.js CLI framework
selected during implementation.

**Storage**: PostgreSQL target compatible with Neon. Drizzle ORM belongs only in
the infrastructure/persistence adapter package.

**Testing**: TypeScript test runner for unit, contract, and integration tests;
Playwright or equivalent browser checks for dashboard flows after UI
implementation; Biome for format/lint/check.

**Target Platform**: Local development and server-side Node.js runtime, with a
web dashboard and CLI. V1 provider behavior is deterministic and offline-capable
except for database access when persistence is enabled.

**Project Type**: Monorepo containing web app, CLI app, core packages, provider
adapters, persistence adapter, and shared validation/contracts packages.

**Performance Goals**: Local recommendation workflow for a seeded watchlist item
completes in under 5 minutes including review; dashboard recommendation detail
view is usable without blocking on provider network calls in V1; seeded mock
workflow outputs are repeatable across local runs.

**Constraints**: Paper-trading only; mock providers only in V1; no live trading;
no real provider credentials; core cannot import web, database, provider SDK, CLI,
or framework-specific modules; AI analysis, scoring, and risk validation must be
separate.

**Scale/Scope**: Single-user V1 research platform with watchlists,
recommendations, provider execution logs, journal entries, dashboard views, and
CLI workflows. Authentication, organizations, live trading, and real providers
are out of scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Core boundary: PASS. Planned package layout isolates domain and application
  services in `packages/core`, with adapters in sibling packages.
- Paper-trading safety: PASS. V1 allows only simulated provider behavior and
  paper simulation records; live-trading configuration is rejected.
- Provider agnosticism: PASS. AI, broker, market-data, and persistence access are
  defined as application ports, with mock adapters as the only active providers.
- Auditability: PASS. Recommendation, workflow, and provider log entities include
  input snapshots, source references, provider identifiers, score, confidence,
  risk assessment, explanation, timestamps, and trace identifiers.
- Separation of concerns: PASS. AI analysis, scoring, and risk validation are
  modeled as separate services and persisted outputs.
- TypeScript quality: PASS. Plan requires strict TypeScript, Zod validation,
  Biome checks, and tests for core behavior and provider contracts.

**Post-Design Recheck**: PASS. The generated data model and contracts preserve
the same boundaries and keep all V1 execution mock-only and paper-only.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-trading-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cli.md
│   ├── http-api.md
│   └── provider-ports.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── web/                         # Next.js App Router dashboard
└── cli/                         # Node.js CLI entrypoints

packages/
├── core/                        # Domain entities, use cases, ports, engines
│   └── src/
│       ├── domain/
│       ├── application/
│       ├── ports/
│       └── schemas/
├── providers-mock/              # Mock AI, broker, and market-data adapters
│   └── src/
├── persistence-drizzle/         # Drizzle + PostgreSQL adapter
│   └── src/
├── shared/                      # Shared primitives and test fixtures
│   └── src/
└── config/                      # Shared tsconfig, test, and tooling config

tests/
├── architecture/                # Dependency boundary checks
├── contract/                    # Provider and interface contract tests
├── integration/                 # Core workflow + persistence integration tests
└── e2e/                         # Dashboard/CLI smoke tests after implementation
```

**Structure Decision**: Use a pnpm workspace with Turborepo-compatible package
boundaries. `packages/core` owns all business rules and ports. `apps/web`,
`apps/cli`, `packages/providers-mock`, and `packages/persistence-drizzle` are
adapters that depend inward on core contracts.

## Complexity Tracking

No constitution violations.
