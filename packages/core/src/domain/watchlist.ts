import type { InstrumentId, Timestamp, WatchlistId } from "./primitives";

export type AssetClass = "equity" | "etf" | "crypto" | "forex";

export type Instrument = {
  id: InstrumentId;
  symbol: string;
  displayName: string;
  assetClass: AssetClass;
  currency: string;
  market: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Watchlist = {
  id: WatchlistId;
  name: string;
  description?: string;
  instruments: Instrument[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
