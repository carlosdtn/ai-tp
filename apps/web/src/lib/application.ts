import {
  evaluateRecommendationOutcome,
  generateRecommendations,
  summarizePerformance,
} from "@ai-tp/core";
import { createPostgresRepositories } from "@ai-tp/persistence-drizzle";
import { createMockProviderSet } from "@ai-tp/providers-mock";
import { createInMemoryRepositories, createSeedWatchlist } from "@ai-tp/shared/testing";

const seedWatchlist = createSeedWatchlist();
const databaseUrl = process.env.DATABASE_URL;
export const webRepositories = databaseUrl
  ? createPostgresRepositories(databaseUrl)
  : createInMemoryRepositories({ watchlists: [seedWatchlist] });

export const loadDashboardData = async () => {
  const watchlist = await ensureDashboardWatchlist();
  const providers = createMockProviderSet();
  const result = await generateRecommendations(
    { watchlistId: watchlist.id, triggeredBy: "dashboard", scenarioId: "default" },
    {
      repositories: webRepositories,
      aiProvider: providers.aiProvider,
      brokerProvider: providers.brokerProvider,
      marketDataProvider: providers.marketDataProvider,
    },
  );
  const recommendations = await webRepositories.recommendations.list();
  const existingOutcomes = await webRepositories.outcomes.list();
  if (existingOutcomes.length === 0 && recommendations[0]) {
    await evaluateRecommendationOutcome(
      {
        recommendationId: recommendations[0].id,
        expectedDirection: "up",
        entrySnapshot: {
          price: 100,
          timestamp: new Date().toISOString(),
          sourceRefs: ["mock://dashboard/entry-price"],
          providerId: "mock-market-data",
        },
        evaluationSnapshot: {
          price: 103,
          timestamp: new Date().toISOString(),
          sourceRefs: ["mock://dashboard/evaluation-price"],
          providerId: "mock-market-data",
        },
        evaluator: "dashboard",
      },
      webRepositories.outcomes,
    );
  }
  const outcomes = await webRepositories.outcomes.list();
  const performanceSummary = summarizePerformance(
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
  const providerLogs = await webRepositories.providerLogs.list();
  return {
    result,
    recommendations,
    providerLogs,
    outcomes,
    performanceSummary,
    watchlist,
  };
};

const ensureDashboardWatchlist = async () => {
  const watchlists = await webRepositories.watchlists.list();
  return watchlists[0] ?? webRepositories.watchlists.save(seedWatchlist);
};
