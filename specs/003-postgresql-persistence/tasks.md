# Tasks: PostgreSQL Persistence

**Input**: Design documents from `/specs/003-postgresql-persistence/`

## Phase 1: Specification and Schema

- [X] T001 Create product specification in specs/003-postgresql-persistence/spec.md
- [X] T002 Create technical plan in specs/003-postgresql-persistence/plan.md
- [X] T003 Create data model and contracts in specs/003-postgresql-persistence/
- [X] T004 Extend Drizzle schema with complete payload/query columns in packages/persistence-drizzle/src/schema.ts

## Phase 2: Persistence Adapter

- [X] T005 Add PostgreSQL database connection helper in packages/persistence-drizzle/src/database.ts
- [X] T006 Add explicit database initialization helper in packages/persistence-drizzle/src/database.ts
- [X] T007 Implement Drizzle repository adapter in packages/persistence-drizzle/src/repositories.ts
- [X] T008 Export persistence helpers from packages/persistence-drizzle/src/index.ts

## Phase 3: App Composition

- [X] T009 Add persistence dependency to CLI package
- [X] T010 Add persistence dependency to web package
- [X] T011 Wire CLI repository composition from DATABASE_URL in apps/cli/src/application.ts
- [X] T012 Add CLI db command in apps/cli/src/commands/db.ts
- [X] T013 Wire db command in apps/cli/src/index.ts
- [X] T014 Wire web repository composition from DATABASE_URL in apps/web/src/lib/application.ts

## Phase 4: Tests and Docs

- [X] T015 Add persistence adapter integration test in tests/integration/persistence/postgres-repositories.test.ts
- [X] T016 Update README with PostgreSQL/Neon setup and persisted testing flow
- [X] T017 Run targeted Biome checks
- [X] T018 Run Bun tests and Turbo checks

## MVP Scope

T004-T014 provide durable PostgreSQL persistence while keeping provider behavior mock-only.
