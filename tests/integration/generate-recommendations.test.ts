import { generateRecommendations } from "@ai-tp/core";
import { createMockProviderSet } from "@ai-tp/providers-mock";
import { createInMemoryRepositories, createSeedWatchlist } from "@ai-tp/shared/testing";
import { describe, expect, it } from "vitest";

describe("recommendation workflow integration", () => {
  it("stores recommendations and provider logs", async () => {
    const watchlist = createSeedWatchlist();
    const repositories = createInMemoryRepositories({ watchlists: [watchlist] });
    const providers = createMockProviderSet();
    const result = await generateRecommendations(
      { watchlistId: watchlist.id, triggeredBy: "test" },
      {
        repositories,
        aiProvider: providers.aiProvider,
        brokerProvider: providers.brokerProvider,
        marketDataProvider: providers.marketDataProvider,
      },
    );
    expect(result.ok).toBe(true);
    const logs = await repositories.providerLogs.list();
    expect(logs.length).toBeGreaterThanOrEqual(3);
  });
});
