import { type Watchlist, generateRecommendations } from "@ai-tp/core";
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
