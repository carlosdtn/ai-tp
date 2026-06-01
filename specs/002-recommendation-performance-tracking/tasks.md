# Tasks: Recommendation Performance Tracking

**Input**: Design documents from `/specs/002-recommendation-performance-tracking/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup and Core Types

- [X] T001 Create outcome domain models in packages/core/src/domain/outcome.ts
- [X] T002 Create outcome Zod schemas in packages/core/src/schemas/outcome.ts
- [X] T003 Extend repository ports with outcome repository in packages/core/src/ports/repositories.ts
- [X] T004 Extend in-memory repositories with outcomes in packages/shared/src/testing/in-memory-repositories.ts
- [X] T005 Add outcome exports in packages/core/src/index.ts

## Phase 2: Outcome Evaluation

- [X] T006 [P] Add outcome evaluation tests in packages/core/src/application/outcome-evaluation.test.ts
- [X] T007 [P] Add performance summary tests in packages/core/src/application/performance-summary.test.ts
- [X] T008 Implement outcome evaluation service in packages/core/src/application/outcome-evaluation.ts
- [X] T009 Implement performance summary service in packages/core/src/application/performance-summary.ts
- [X] T010 Add seeded outcome fixtures in packages/shared/src/testing/fixtures.ts

## Phase 3: CLI and Dashboard Surfaces

- [X] T011 [P] Add CLI performance integration test in tests/integration/cli-performance.test.ts
- [X] T012 Implement performance CLI command in apps/cli/src/commands/performance.ts
- [X] T013 Wire performance command in apps/cli/src/index.ts
- [X] T014 Add performance dashboard component in apps/web/src/components/performance-summary.tsx
- [X] T015 Add performance dashboard page in apps/web/src/app/performance/page.tsx

## Phase 4: Persistence and Documentation

- [X] T016 Add outcome table skeleton in packages/persistence-drizzle/src/schema.ts
- [X] T017 Update README with performance tracking notes in README.md
- [X] T018 Validate quickstart in specs/002-recommendation-performance-tracking/quickstart.md
- [X] T019 Run Bun checks and tests

## Dependencies & Execution Order

- Phase 1 blocks all implementation work.
- Phase 2 creates core behavior and must pass before CLI/dashboard work.
- Phase 3 depends on Phase 2 services.
- Phase 4 completes persistence skeleton and documentation.

## Parallel Opportunities

- T006 and T007 can run in parallel.
- T011, T014, and T016 can run in parallel after Phase 2.

## MVP Scope

T001-T010 provide the core MVP: immutable outcome records and aggregate
performance metrics.
