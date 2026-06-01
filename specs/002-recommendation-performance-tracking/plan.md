# Implementation Plan: Recommendation Performance Tracking

**Branch**: `001-ai-trading-platform` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-recommendation-performance-tracking/spec.md`

## Summary

Add paper-trading performance tracking so users can evaluate whether prior
recommendations were directionally correct. The implementation will extend the
framework-independent core with evaluation policies, entry/evaluation snapshots,
immutable outcome records, and aggregate performance metrics. CLI and dashboard
adapters will expose evaluation and reporting while preserving mock-only,
paper-only boundaries.

## Technical Context

**Language/Version**: TypeScript with strict settings; Bun workspace runtime.

**Primary Dependencies**: Existing Bun workspaces, Turborepo, Zod, Vitest, Biome,
Next.js dashboard, Bun CLI, mock providers, and core package ports.

**Storage**: In-memory repositories for current V1 testing; repository ports will
be extended so Drizzle/PostgreSQL can persist outcomes later.

**Testing**: Vitest unit and integration tests for outcome classification,
metrics, repository behavior, CLI reporting, and architecture boundaries.

**Target Platform**: Local Bun/Node-compatible runtime, dashboard, and CLI.

**Project Type**: Existing monorepo with core package, CLI app, dashboard app,
mock provider package, and shared fixtures.

**Performance Goals**: Evaluate seeded recommendations and compute aggregate
metrics in under one second locally for test-sized datasets.

**Constraints**: Paper-trading only; no live provider credentials; outcome
evaluation must not mutate prior evaluation records; AI analysis, risk
validation, recommendation generation, and outcome evaluation remain separate.

**Scale/Scope**: Single-user V1 feature for deterministic mock evaluation,
individual outcome details, aggregate metrics, dashboard visibility, and CLI
commands. Real market data integration is deferred.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Core boundary: PASS. Outcome rules live in `packages/core`; CLI/dashboard are
  adapters.
- Paper-trading safety: PASS. Outcome tracking evaluates paper recommendations
  only and never creates live orders.
- Provider agnosticism: PASS. Evaluation snapshots are data records; future
  market-data providers can feed snapshots through ports without changing core.
- Auditability: PASS. Outcome records store policy, snapshots, calculation
  method, evaluator, timestamps, sources, and trace identifiers.
- Separation of concerns: PASS. Outcome evaluation is a separate application
  service and audit step.
- TypeScript quality: PASS. Zod schemas and Vitest tests are planned.

**Post-Design Recheck**: PASS. Design artifacts keep outcome evaluation in core,
preserve immutable history, and expose metrics through adapters.

## Project Structure

### Documentation (this feature)

```text
specs/002-recommendation-performance-tracking/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cli.md
│   └── http-api.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
packages/core/src/
├── domain/outcome.ts
├── schemas/outcome.ts
├── ports/repositories.ts
└── application/
    ├── outcome-evaluation.ts
    └── performance-summary.ts

packages/shared/src/testing/
├── fixtures.ts
└── in-memory-repositories.ts

apps/cli/src/commands/
└── performance.ts

apps/web/src/
├── app/performance/page.tsx
└── components/performance-summary.tsx

tests/integration/
└── performance-tracking.test.ts
```

**Structure Decision**: Extend the existing core and adapters rather than adding a
new package. Outcome tracking is business logic and belongs in `packages/core`.

## Complexity Tracking

No constitution violations.
