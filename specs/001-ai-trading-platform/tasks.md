# Tasks: AI Trading Platform

**Input**: Design documents from `/specs/001-ai-trading-platform/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required for core logic, provider contracts, audit behavior, architecture
boundaries, and CLI/dashboard integration paths by project constitution.

**Organization**: Tasks are grouped by user story so each story can be implemented
and validated independently after foundational work is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no
  dependency on incomplete tasks.
- **[Story]**: User story label for story phases only.
- Every task includes an exact target path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the monorepo, package boundaries, and quality tooling.

- [X] T001 Create Bun workspace configuration in package.json
- [X] T002 Create Turborepo task pipeline in turbo.json
- [X] T003 Update root package scripts and workspace metadata in package.json
- [X] T004 [P] Create shared TypeScript base config in packages/config/tsconfig/base.json
- [X] T005 [P] Create Node TypeScript config in packages/config/tsconfig/node.json
- [X] T006 [P] Create Next.js TypeScript config in packages/config/tsconfig/next.json
- [X] T007 [P] Create core package manifest in packages/core/package.json
- [X] T008 [P] Create mock providers package manifest in packages/providers-mock/package.json
- [X] T009 [P] Create persistence adapter package manifest in packages/persistence-drizzle/package.json
- [X] T010 [P] Create shared package manifest in packages/shared/package.json
- [X] T011 [P] Create CLI app package manifest in apps/cli/package.json
- [X] T012 [P] Create web app package manifest in apps/web/package.json
- [X] T013 Configure test runner workspace settings in vitest.config.ts
- [X] T014 Add environment example for paper-only local development in .env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish domain boundaries, ports, validation, persistence shape, and
test harnesses required before any user story implementation.

**Critical**: No user story work starts until this phase is complete.

- [X] T015 Create domain primitive types and ids in packages/core/src/domain/primitives.ts
- [X] T016 Create core error and result types in packages/core/src/domain/result.ts
- [X] T017 Create Zod schemas for instruments and watchlists in packages/core/src/schemas/watchlist.ts
- [X] T018 Create Zod schemas for provider payloads in packages/core/src/schemas/providers.ts
- [X] T019 Create Zod schemas for recommendations and audit records in packages/core/src/schemas/recommendations.ts
- [X] T020 Create AI provider port in packages/core/src/ports/ai-provider.ts
- [X] T021 Create market-data provider port in packages/core/src/ports/market-data-provider.ts
- [X] T022 Create broker provider port in packages/core/src/ports/broker-provider.ts
- [X] T023 Create repository ports in packages/core/src/ports/repositories.ts
- [X] T024 Create trace and clock ports in packages/core/src/ports/platform.ts
- [X] T025 Create architecture boundary test in tests/architecture/core-boundaries.test.ts
- [X] T026 Create provider contract test harness in tests/contract/provider-contracts.ts
- [X] T027 Create Drizzle schema skeleton in packages/persistence-drizzle/src/schema.ts
- [X] T028 Create persistence adapter index in packages/persistence-drizzle/src/index.ts
- [X] T029 Create in-memory repository test double in packages/shared/src/testing/in-memory-repositories.ts
- [X] T030 Create deterministic fixture catalog in packages/shared/src/testing/fixtures.ts
- [X] T031 Create paper-only configuration guard in packages/core/src/application/paper-trading-policy.ts
- [X] T032 Create core public exports in packages/core/src/index.ts
- [X] T033 Create mock providers public exports in packages/providers-mock/src/index.ts

**Checkpoint**: Core boundaries, ports, schemas, fixtures, and test harnesses are
ready for story work.

---

## Phase 3: User Story 1 - Generate Auditable Paper Recommendations (Priority: P1) MVP

**Goal**: Generate a persisted, explainable, risk-validated paper recommendation
from a seeded watchlist using mock providers.

**Independent Test**: Seed a watchlist, run the recommendation workflow, and
verify stored input, sources, provider ids, score, confidence, risks, explanation,
timestamps, and trace id.

### Tests for User Story 1

- [X] T034 [P] [US1] Add decision workflow unit tests in packages/core/src/application/generate-recommendations.test.ts
- [X] T035 [P] [US1] Add scoring engine unit tests in packages/core/src/application/scoring-engine.test.ts
- [X] T036 [P] [US1] Add risk engine unit tests in packages/core/src/application/risk-engine.test.ts
- [X] T037 [P] [US1] Add provider log audit tests in packages/core/src/application/provider-execution-log.test.ts
- [X] T038 [P] [US1] Add mock provider contract tests in packages/providers-mock/src/mock-providers.contract.test.ts

### Implementation for User Story 1

- [X] T039 [P] [US1] Create instrument and watchlist domain models in packages/core/src/domain/watchlist.ts
- [X] T040 [P] [US1] Create recommendation domain models in packages/core/src/domain/recommendation.ts
- [X] T041 [P] [US1] Create provider audit domain models in packages/core/src/domain/provider-execution-log.ts
- [X] T042 [P] [US1] Create workflow run domain model in packages/core/src/domain/workflow-run.ts
- [X] T043 [US1] Implement scoring engine in packages/core/src/application/scoring-engine.ts
- [X] T044 [US1] Implement risk engine in packages/core/src/application/risk-engine.ts
- [X] T045 [US1] Implement provider execution logger service in packages/core/src/application/provider-execution-logger.ts
- [X] T046 [US1] Implement recommendation generation use case in packages/core/src/application/generate-recommendations.ts
- [X] T047 [P] [US1] Implement mock market-data provider in packages/providers-mock/src/mock-market-data-provider.ts
- [X] T048 [P] [US1] Implement mock AI provider in packages/providers-mock/src/mock-ai-provider.ts
- [X] T049 [P] [US1] Implement mock broker provider in packages/providers-mock/src/mock-broker-provider.ts
- [X] T050 [US1] Wire mock provider scenario factory in packages/providers-mock/src/mock-provider-factory.ts
- [X] T051 [US1] Add workflow integration test in tests/integration/generate-recommendations.test.ts

**Checkpoint**: MVP recommendation workflow is functional and independently
testable without web dashboard or CLI.

---

## Phase 4: User Story 2 - Review Decisions in a Dashboard (Priority: P1)

**Goal**: Display watchlists, recommendations, scoring details, risk details,
provider logs, and audit trail in the web dashboard.

**Independent Test**: Load seeded recommendations and verify list, filter, and
detail views expose the full audit story.

### Tests for User Story 2

- [X] T052 [P] [US2] Add dashboard data contract tests in apps/web/src/app/recommendations/recommendation-view-model.test.ts
- [X] T053 [P] [US2] Add recommendation detail rendering test in apps/web/src/app/recommendations/[id]/page.test.tsx

### Implementation for User Story 2

- [X] T054 [P] [US2] Create Next.js app shell in apps/web/src/app/layout.tsx
- [X] T055 [P] [US2] Create dashboard home page in apps/web/src/app/page.tsx
- [X] T056 [P] [US2] Create dashboard Tailwind styles in apps/web/src/app/globals.css
- [X] T057 [US2] Create dashboard application service adapter in apps/web/src/lib/application.ts
- [X] T058 [US2] Create recommendation list view model in apps/web/src/app/recommendations/recommendation-view-model.ts
- [X] T059 [US2] Create recommendations list page in apps/web/src/app/recommendations/page.tsx
- [X] T060 [US2] Create recommendation detail page in apps/web/src/app/recommendations/[id]/page.tsx
- [X] T061 [US2] Create provider log summary component in apps/web/src/components/provider-log-summary.tsx
- [X] T062 [US2] Create risk assessment component in apps/web/src/components/risk-assessment.tsx
- [X] T063 [US2] Create score breakdown component in apps/web/src/components/score-breakdown.tsx

**Checkpoint**: Dashboard review flow works from seeded data and shows audit
details without owning business rules.

---

## Phase 5: User Story 3 - Operate Workflows from a CLI (Priority: P2)

**Goal**: Provide command-line workflows for watchlists, recommendations,
provider logs, and recommendation inspection using the same application services.

**Independent Test**: Use CLI commands to create a watchlist, add an instrument,
run recommendations, inspect provider logs, and show a recommendation.

### Tests for User Story 3

- [X] T064 [P] [US3] Add CLI command parser tests in apps/cli/src/commands/commands.test.ts
- [X] T065 [P] [US3] Add CLI recommendation workflow integration test in tests/integration/cli-recommendations.test.ts

### Implementation for User Story 3

- [X] T066 [P] [US3] Create CLI entrypoint in apps/cli/src/index.ts
- [X] T067 [P] [US3] Create CLI output formatters in apps/cli/src/output.ts
- [X] T068 [US3] Create CLI application service adapter in apps/cli/src/application.ts
- [X] T069 [US3] Implement watchlist commands in apps/cli/src/commands/watchlist.ts
- [X] T070 [US3] Implement recommendations commands in apps/cli/src/commands/recommendations.ts
- [X] T071 [US3] Implement provider log commands in apps/cli/src/commands/provider-logs.ts
- [X] T072 [US3] Add CLI package binary configuration in apps/cli/package.json

**Checkpoint**: CLI can execute core paper-trading workflows without dashboard
code.

---

## Phase 6: User Story 4 - Preserve Provider Independence (Priority: P2)

**Goal**: Make provider contracts explicit and prove mock implementations can be
replaced without changing core business behavior.

**Independent Test**: Swap a mock provider implementation in contract tests and
verify recommendation generation still uses the provider through ports only.

### Tests for User Story 4

- [X] T073 [P] [US4] Add alternate mock AI provider contract test in packages/providers-mock/src/alternate-ai-provider.contract.test.ts
- [X] T074 [P] [US4] Add malformed provider response test in tests/contract/invalid-provider-response.test.ts
- [X] T075 [P] [US4] Add architecture regression test for adapter imports in tests/architecture/adapter-boundaries.test.ts

### Implementation for User Story 4

- [X] T076 [US4] Create provider contract documentation exports in packages/core/src/ports/provider-contracts.ts
- [X] T077 [US4] Implement alternate mock AI provider in packages/providers-mock/src/alternate-mock-ai-provider.ts
- [X] T078 [US4] Implement provider validation wrappers in packages/core/src/application/validated-providers.ts
- [X] T079 [US4] Add provider failure mapping in packages/core/src/application/provider-errors.ts
- [X] T080 [US4] Update mock provider factory to support provider replacement in packages/providers-mock/src/mock-provider-factory.ts

**Checkpoint**: Provider replacement and malformed provider behavior are covered
by tests and contracts.

---

## Phase 7: User Story 5 - Keep a Decision Journal (Priority: P3)

**Goal**: Attach notes and paper outcome observations to instruments,
recommendations, and paper simulations.

**Independent Test**: Create a journal entry linked to a recommendation and
retrieve entries by recommendation, instrument, tag, and date range.

### Tests for User Story 5

- [X] T081 [P] [US5] Add journal use case unit tests in packages/core/src/application/journal.test.ts
- [X] T082 [P] [US5] Add CLI journal integration test in tests/integration/cli-journal.test.ts

### Implementation for User Story 5

- [X] T083 [P] [US5] Create journal domain model in packages/core/src/domain/journal.ts
- [X] T084 [P] [US5] Create journal Zod schemas in packages/core/src/schemas/journal.ts
- [X] T085 [US5] Implement journal use cases in packages/core/src/application/journal.ts
- [X] T086 [US5] Implement journal CLI command in apps/cli/src/commands/journal.ts
- [X] T087 [US5] Create journal dashboard page in apps/web/src/app/journal/page.tsx
- [X] T088 [US5] Create journal entry component in apps/web/src/components/journal-entry.tsx

**Checkpoint**: Journal entries and paper outcome observations are linked to the
audit trail.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete V1 baseline, documentation, and safety gates.

- [X] T089 Run Biome format check and fix issues in biome.json
- [X] T090 Run all unit, contract, architecture, and integration tests from package.json
- [X] T091 Validate quickstart commands and update specs/001-ai-trading-platform/quickstart.md
- [X] T092 [P] Update root README with project overview in README.md
- [X] T093 [P] Add live-trading safety note to docs/safety.md
- [X] T094 Verify no live provider credentials or live-trading settings are committed in .env.example
- [X] T095 Review all recommendation views and CLI outputs for paper-only labeling in apps/web/src and apps/cli/src

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2 and is the MVP.
- **Phase 4 US2**: Depends on Phase 2; works best after US1 produces seeded recommendation data.
- **Phase 5 US3**: Depends on Phase 2; can run in parallel with US2 after US1 application services are available.
- **Phase 6 US4**: Depends on Phase 2 and overlaps with US1 provider work; complete before real provider planning.
- **Phase 7 US5**: Depends on Phase 2 and benefits from US1 recommendation records.
- **Phase 8 Polish**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 Generate Auditable Paper Recommendations**: Foundational dependency only.
- **US2 Review Decisions in a Dashboard**: Needs shared application services and seeded/readable recommendation data from US1.
- **US3 Operate Workflows from a CLI**: Needs shared application services from US1.
- **US4 Preserve Provider Independence**: Needs provider ports from foundation and provider workflows from US1.
- **US5 Keep a Decision Journal**: Needs recommendation/instrument records from US1 for full value.

### Within Each User Story

- Write tests before implementation tasks in the same story.
- Domain models and schemas before application services.
- Application services before web, CLI, or adapter integration.
- Provider contract tests before provider replacement work.
- Story checkpoint must pass before moving to lower-priority stories in a serial workflow.

## Parallel Opportunities

- Setup package manifests and TypeScript configs T004-T012 can run in parallel.
- Foundational schemas, ports, and fixtures T017-T024 and T029-T030 can run in parallel after primitives exist.
- US1 test tasks T034-T038 can run in parallel.
- US1 domain models T039-T042 and mock providers T047-T049 can run in parallel.
- US2 component tasks T061-T063 can run in parallel after view model shape is defined.
- US3 command tasks T069-T071 can run in parallel after CLI application adapter exists.
- US4 tests T073-T075 can run in parallel.
- US5 model/schema tests and dashboard/CLI surfaces can run in parallel after journal use cases exist.

## Parallel Example: User Story 1

```bash
# Parallel tests:
Task T034: Add decision workflow unit tests in packages/core/src/application/generate-recommendations.test.ts
Task T035: Add scoring engine unit tests in packages/core/src/application/scoring-engine.test.ts
Task T036: Add risk engine unit tests in packages/core/src/application/risk-engine.test.ts
Task T037: Add provider log audit tests in packages/core/src/application/provider-execution-log.test.ts
Task T038: Add mock provider contract tests in packages/providers-mock/src/mock-providers.contract.test.ts

# Parallel implementation:
Task T039: Create instrument and watchlist domain models in packages/core/src/domain/watchlist.ts
Task T040: Create recommendation domain models in packages/core/src/domain/recommendation.ts
Task T041: Create provider audit domain models in packages/core/src/domain/provider-execution-log.ts
Task T042: Create workflow run domain model in packages/core/src/domain/workflow-run.ts
Task T047: Implement mock market-data provider in packages/providers-mock/src/mock-market-data-provider.ts
Task T048: Implement mock AI provider in packages/providers-mock/src/mock-ai-provider.ts
Task T049: Implement mock broker provider in packages/providers-mock/src/mock-broker-provider.ts
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 User Story 1.
4. Stop and validate the paper recommendation workflow through tests and seeded
   data before building broader UI/CLI surfaces.

### Incremental Delivery

1. US1 delivers the paper recommendation workflow.
2. US2 adds human dashboard review.
3. US3 adds automation and local operation through CLI.
4. US4 hardens provider contracts for future integrations.
5. US5 adds the decision journal and outcome notes.

### Safety Gate

Do not start implementation of real provider integrations or live trading in this
feature. Any task that introduces live provider credentials, live brokerage order
placement, or real-money execution violates the constitution and must be rejected.
