import {
  type RecommendationId,
  type Watchlist,
  evaluateRecommendationOutcome,
  generateRecommendations,
  summarizePerformance,
} from "@ai-tp/core";
import { createMockProviderSet } from "@ai-tp/providers-mock";
import { createSeedInstrument, createSeedWatchlist } from "@ai-tp/shared/testing";
import { createInMemoryRepositories } from "@ai-tp/shared/testing";

const seedWatchlist = createSeedWatchlist();
export const repositories = createInMemoryRepositories({ watchlists: [seedWatchlist] });

export const createWatchlist = async (name: string): Promise<Watchlist> => {
  const base = createSeedWatchlist();
  const watchlist = { ...base, name };
  await repositories.watchlists.save(watchlist);
  return watchlist;
};

export const addInstrument = async (watchlistName: string, symbol: string): Promise<Watchlist> => {
  const watchlists = await repositories.watchlists.list();
  const watchlist = watchlists.find((item) => item.name === watchlistName) ?? seedWatchlist;
  const updated = {
    ...watchlist,
    instruments: [...watchlist.instruments, createSeedInstrument(symbol)],
  };
  await repositories.watchlists.save(updated);
  return updated;
};

export const runRecommendations = async (watchlistName: string, scenario?: string) => {
  const watchlists = await repositories.watchlists.list();
  const watchlist = watchlists.find((item) => item.name === watchlistName) ?? seedWatchlist;
  const providers = createMockProviderSet();
  return generateRecommendations(
    {
      watchlistId: watchlist.id,
      triggeredBy: "cli",
      ...(scenario ? { scenarioId: scenario } : {}),
    },
    {
      repositories,
      aiProvider: providers.aiProvider,
      brokerProvider: providers.brokerProvider,
      marketDataProvider: providers.marketDataProvider,
    },
  );
};

export const evaluatePerformance = async (input: {
  recommendationId: string;
  entryPrice: number;
  evaluationPrice: number;
  expectedDirection?: "up" | "down" | "flat";
  horizonDays?: number;
}) =>
  evaluateRecommendationOutcome(
    {
      recommendationId: input.recommendationId as RecommendationId,
      ...(input.expectedDirection ? { expectedDirection: input.expectedDirection } : {}),
      ...(input.horizonDays === undefined ? {} : { horizonDays: input.horizonDays }),
      entrySnapshot: {
        price: input.entryPrice,
        timestamp: new Date().toISOString(),
        sourceRefs: ["mock://cli/entry-price"],
        providerId: "mock-market-data",
      },
      evaluationSnapshot: {
        price: input.evaluationPrice,
        timestamp: new Date().toISOString(),
        sourceRefs: ["mock://cli/evaluation-price"],
        providerId: "mock-market-data",
      },
      evaluator: "cli",
    },
    repositories.outcomes,
  );

export const loadPerformanceSummary = async () => {
  const outcomes = await repositories.outcomes.list();
  const recommendations = await repositories.recommendations.list();
  return summarizePerformance(
    outcomes.map((outcome) => ({
      outcome,
      ...(() => {
        const confidence = recommendations.find(
          (recommendation) => recommendation.id === outcome.recommendationId,
        )?.confidence;
        return confidence === undefined ? {} : { confidence };
      })(),
    })),
  );
};
