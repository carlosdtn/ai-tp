# Quickstart: AI Trading Platform V1

## Prerequisites

- Node.js active LTS
- pnpm
- PostgreSQL-compatible database for persistence checks, or a local test database
  once implementation tasks add migrations

## Setup

```bash
pnpm install
pnpm check
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
pnpm cli watchlist create --name "AI Paper Ideas"
pnpm cli watchlist add-instrument --watchlist "AI Paper Ideas" --symbol "AAPL"
pnpm cli recommendations run --watchlist "AI Paper Ideas" --scenario default
pnpm cli provider-logs list --workflow-run "<workflow-run-id>"
pnpm cli recommendations show --id "<recommendation-id>"
pnpm cli journal add --recommendation "<recommendation-id>" --content "Reviewed thesis and risk notes."
```

## Quality Checks

```bash
pnpm format:check
pnpm lint
pnpm check
pnpm test
```

## Safety Expectations

- No command or dashboard action places live trades.
- No real provider credentials are required for V1.
- Recommendation details show paper-only labels, sources, score, confidence,
  risks, explanation, and trace ids.
- Provider failures are logged and visible.
