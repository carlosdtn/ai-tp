# Research: PostgreSQL Persistence

## Decision: JSONB payload plus indexed query columns

**Rationale**: The domain model is still evolving. JSONB payloads preserve complete audit records without forcing every nested object into relational tables too early. Query columns keep common lookups efficient and migration-friendly.

**Alternatives considered**:

- Fully normalized schema: rejected for V1 because recommendation payloads include nested risk, score, source, and provider metadata that will evolve.
- File storage: rejected because CLI and web need shared state across processes and future Neon compatibility.

## Decision: Explicit initialization helper

**Rationale**: Local and test users need a low-friction way to create tables. Production should not auto-mutate schema on every request.

**Alternatives considered**:

- Auto-create tables at app startup: rejected because it hides infrastructure changes.
- Drizzle Kit migrations now: deferred until schema stabilizes.

## Decision: Environment-driven repository composition

**Rationale**: `DATABASE_URL` is the natural boundary between durable PostgreSQL and mock in-memory operation. This keeps local onboarding simple while enabling persisted testing.

## Decision: Keep providers mock-only

**Rationale**: Persistence is independent from real providers. Real market-data test integrations should be a later feature with its own contracts and source attribution rules.
