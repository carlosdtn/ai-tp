# Quickstart: AI Trading Platform V1

## Prerequisites

- Node.js active LTS
- Bun
- PostgreSQL-compatible database for persistence checks, or a local test database
  once implementation tasks add migrations

## Setup

```bash
bun install
bun run check
```

## Expected V1 Demo Flow

1. Create a watchlist.
2. Add one supported instrument.
3. Run a simulated recommendation workflow with the default mock scenario.
4. Open the dashboard and review the recommendation detail.
5. Inspect provider execution logs for the workflow.
6. Add a journal note to the recommendation.
7. Repeat the same seeded scenario and verify the provider inputs/outputs are
   reproducible.

## Expected CLI Flow

```bash
bun run cli watchlist create --name "AI Paper Ideas"
bun run cli watchlist add-instrument --watchlist "AI Paper Ideas" --symbol "AAPL"
bun run cli recommendations run --watchlist "AI Paper Ideas" --scenario default
bun run cli provider-logs list --workflow-run "<workflow-run-id>"
bun run cli recommendations show --id "<recommendation-id>"
bun run cli journal add --recommendation "<recommendation-id>" --content "Reviewed thesis and risk notes."
```

## Quality Checks

```bash
bun run format:check
bun run lint
bun run check
bun run test
```

## Safety Expectations

- No command or dashboard action places live trades.
- No real provider credentials are required for V1.
- Recommendation details show paper-only labels, sources, score, confidence,
  risks, explanation, and trace ids.
- Provider failures are logged and visible.
