# AI Trading Platform

Spec-driven, TypeScript-first AI trading research platform for explainable,
auditable paper-trading recommendations.

V1 is mock-provider only. It includes core domain/application packages, mock AI,
broker, and market-data adapters, a CLI surface, and a Next.js dashboard scaffold.

## Commands

```bash
pnpm install
pnpm check
pnpm test
pnpm cli recommendations run --watchlist "AI Paper Ideas"
```

## Safety

This project does not implement live trading. All recommendations, broker
actions, and outcomes are paper-trading artifacts.
