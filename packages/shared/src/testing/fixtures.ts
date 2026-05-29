import { type Instrument, type Watchlist, createId, nowIso } from "@ai-tp/core";

export const createSeedInstrument = (symbol = "AAPL"): Instrument => {
  const timestamp = nowIso();
  return {
    id: createId("Instrument"),
    symbol,
    displayName: symbol,
    assetClass: "equity",
    currency: "USD",
    market: "NASDAQ",
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const createSeedWatchlist = (): Watchlist => {
  const timestamp = nowIso();
  return {
    id: createId("Watchlist"),
    name: "AI Paper Ideas",
    description: "Seeded paper-trading watchlist",
    instruments: [createSeedInstrument()],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};
