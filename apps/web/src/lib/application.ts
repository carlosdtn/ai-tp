import { generateRecommendations } from "@ai-tp/core";
import { createMockProviderSet } from "@ai-tp/providers-mock";
import { createInMemoryRepositories, createSeedWatchlist } from "@ai-tp/shared/testing";

const seedWatchlist = createSeedWatchlist();
export const webRepositories = createInMemoryRepositories({ watchlists: [seedWatchlist] });

export const loadDashboardData = async () => {
  const providers = createMockProviderSet();
  const result = await generateRecommendations(
    { watchlistId: seedWatchlist.id, triggeredBy: "dashboard", scenarioId: "default" },
    {
      repositories: webRepositories,
      aiProvider: providers.aiProvider,
      brokerProvider: providers.brokerProvider,
      marketDataProvider: providers.marketDataProvider,
    },
  );
  const recommendations = await webRepositories.recommendations.list();
  const providerLogs = await webRepositories.providerLogs.list();
  return { result, recommendations, providerLogs, watchlist: seedWatchlist };
};
