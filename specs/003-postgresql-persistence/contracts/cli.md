# CLI Contract: PostgreSQL Persistence

## Environment

```bash
DATABASE_URL="postgres://..."
```

When `DATABASE_URL` is present, CLI commands use PostgreSQL repositories. When it is absent, CLI commands use in-memory repositories.

## Commands

```bash
bun run cli db init
bun run cli db status
bun run cli recommendations run --watchlist "AI Paper Ideas" --scenario default
bun run cli performance evaluate --recommendation "<recommendation-id>" --entry-price 100 --evaluation-price 103
bun run cli performance summary
```

## Responses

- `db init` returns JSON with adapter and initialized status.
- `db status` returns JSON with configured adapter and whether `DATABASE_URL` is present.
- Existing recommendation and performance commands preserve their current output shape.
