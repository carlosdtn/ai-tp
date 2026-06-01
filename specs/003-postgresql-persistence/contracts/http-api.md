# HTTP/Web Contract: PostgreSQL Persistence

## Dashboard Composition

When `DATABASE_URL` is configured, dashboard loaders MUST use PostgreSQL repositories. Otherwise, they MAY seed in-memory mock data.

## Pages

- `/`: loads watchlist, recommendations, provider logs, and performance summary.
- `/recommendations`: lists persisted recommendations when available.
- `/recommendations/[id]`: opens persisted recommendation audit detail.
- `/performance`: lists persisted outcomes and aggregate performance.
