# Quickstart: PostgreSQL Persistence

## Local or Neon Database

Set a PostgreSQL-compatible connection string:

```bash
export DATABASE_URL="postgres://user:password@host:5432/database"
```

Initialize tables:

```bash
bun run cli db init
```

Run a persisted mock workflow:

```bash
bun run cli recommendations run --watchlist "AI Paper Ideas" --scenario default
```

Copy a recommendation id from the JSON output and evaluate it:

```bash
bun run cli performance evaluate --recommendation "<recommendation-id>" --entry-price 100 --evaluation-price 103
bun run cli performance summary
```

Start the dashboard:

```bash
bun run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/performance
```

## Safety

This feature persists paper-trading research data only. It does not add live trading.
