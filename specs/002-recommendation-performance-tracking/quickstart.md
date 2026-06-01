# Quickstart: Recommendation Performance Tracking

## Setup

```bash
bun install
bun run check
bun run test
```

## CLI Evaluation Flow

```bash
bun run cli recommendations run --watchlist "AI Paper Ideas" --scenario default
bun run cli performance evaluate --recommendation "<recommendation-id>" --entry-price 100 --evaluation-price 108
bun run cli performance summary
```

## Dashboard Flow

1. Open the dashboard.
2. Generate or inspect seeded recommendations.
3. Open the performance page.
4. Review win/loss/neutral/unresolved counts and average return.

## Expected Behavior

- Buy recommendation with positive return beyond threshold is classified as win.
- Buy recommendation with negative return beyond threshold is classified as loss.
- Small movement within the neutral threshold is classified as neutral.
- Missing snapshots produce unresolved outcomes.
