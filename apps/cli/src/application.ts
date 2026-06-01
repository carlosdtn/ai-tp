import {
  type RecommendationId,
  type Watchlist,
  evaluateRecommendationOutcome,
  generateRecommendations,
  summarizePerformance,
} from "@ai-tp/core";
import { createPostgresRepositories, initializeDatabase } from "@ai-tp/persistence-drizzle";
import { createMockProviderSet } from "@ai-tp/providers-mock";
import { createSeedInstrument, createSeedWatchlist } from "@ai-tp/shared/testing";
import { createInMemoryRepositories } from "@ai-tp/shared/testing";

const seedWatchlist = createSeedWatchlist();
const databaseUrl = process.env.DATABASE_URL;
export const repositories = databaseUrl
  ? createPostgresRepositories(databaseUrl)
  : createInMemoryRepositories({ watchlists: [seedWatchlist] });

export const persistenceStatus = () => ({
  adapter: databaseUrl ? "postgresql" : "in-memory",
  databaseConfigured: Boolean(databaseUrl),
});

export const initializePersistence = async () => {
  if (!databaseUrl) {
    return { ...persistenceStatus(), initialized: false };
  }
  await initializeDatabase(databaseUrl);
  return { ...persistenceStatus(), initialized: true };
};

export const createWatchlist = async (name: string): Promise<Watchlist> => {
  const base = createSeedWatchlist();
  const watchlist = { ...base, name };
  await repositories.watchlists.save(watchlist);
  return watchlist;
};

export const addInstrument = async (watchlistName: string, symbol: string): Promise<Watchlist> => {
  const watchlists = await repositories.watchlists.list();
  const watchlist =
    watchlists.find((item) => item.name === watchlistName) ?? (await ensureSeedWatchlist());
  const updated = {
    ...watchlist,
    instruments: [...watchlist.instruments, createSeedInstrument(symbol)],
  };
  await repositories.watchlists.save(updated);
  return updated;
};

export const runRecommendations = async (watchlistName: string, scenario?: string) => {
  const watchlists = await repositories.watchlists.list();
  const watchlist =
    watchlists.find((item) => item.name === watchlistName) ?? (await ensureSeedWatchlist());
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

const ensureSeedWatchlist = async (): Promise<Watchlist> => {
  const existing = await repositories.watchlists.findById(seedWatchlist.id);
  if (existing) {
    return existing;
  }
  return repositories.watchlists.save(seedWatchlist);
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
