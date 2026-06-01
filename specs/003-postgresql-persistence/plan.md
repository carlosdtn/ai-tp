# Implementation Plan: PostgreSQL Persistence

## Technical Context

**Language/Version**: TypeScript, Bun
**Primary Dependencies**: Drizzle ORM, `postgres`, Zod, Next.js App Router
**Storage**: PostgreSQL-compatible database, including Neon
**Testing**: Vitest; database smoke tests gated by `DATABASE_URL`
**Architecture**: Clean/Hexagonal. `packages/core` defines ports; `packages/persistence-drizzle` implements adapters.

## Constitution Check

- Paper-trading only: PASS. Persistence stores research artifacts only.
- Provider agnostic: PASS. No real AI, broker, or market-data provider is introduced.
- Core independence: PASS. Drizzle/Postgres live only in persistence adapter and app composition.
- Auditability: PASS. Payload columns preserve complete domain objects.
- Explainability: PASS. Stored recommendations retain score, confidence, risks, explanation, and sources.

## Design Decisions

1. Use JSONB payload columns as the complete source for domain reconstruction in V1.
2. Keep query columns for ids, timestamps, status, trace IDs, and classifications.
3. Provide `createPostgresRepositories(databaseUrl)` and `createRepositoriesFromEnv(fallback)`.
4. Add an explicit `initializeDatabase(databaseUrl)` helper using safe `CREATE TABLE IF NOT EXISTS` statements for local/test setup.
5. Avoid running database migrations automatically on app startup.

## Project Structure

```text
packages/persistence-drizzle/
├── src/
│   ├── database.ts
│   ├── index.ts
│   ├── repositories.ts
│   └── schema.ts

apps/cli/src/
└── application.ts

apps/web/src/lib/
└── application.ts

tests/integration/persistence/
└── postgres-repositories.test.ts
```

## Validation

- Unit/integration tests for repository behavior with in-memory fallback.
- Optional PostgreSQL smoke test when `DATABASE_URL` is available.
- TypeScript checks through Turbo.
- Biome targeted checks for changed files.
