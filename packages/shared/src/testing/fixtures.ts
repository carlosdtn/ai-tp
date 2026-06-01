import {
  type Instrument,
  type PriceSnapshot,
  type RecommendationOutcome,
  type Watchlist,
  createDefaultEvaluationPolicy,
  createId,
  createTraceId,
  nowIso,
} from "@ai-tp/core";

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

export const createSeedPriceSnapshot = (price = 100): PriceSnapshot => ({
  price,
  timestamp: nowIso(),
  sourceRefs: ["mock://market-data/snapshot"],
  providerId: "mock-market-data",
});

export const createSeedOutcome = (
  classification: RecommendationOutcome["classification"] = "win",
): RecommendationOutcome => {
  const recommendationId = createId("Recommendation");
  const entrySnapshot = createSeedPriceSnapshot(100);
  const evaluationSnapshot = createSeedPriceSnapshot(
    classification === "loss" ? 95 : classification === "neutral" ? 100.5 : 105,
  );
  return {
    id: createId("RecommendationOutcome"),
    recommendationId,
    policy: createDefaultEvaluationPolicy(recommendationId, "up"),
    entrySnapshot,
    evaluationSnapshot,
    classification,
    ...(classification === "unresolved"
      ? { unresolvedReason: "seed-unresolved" }
      : {
          absoluteReturn: evaluationSnapshot.price - entrySnapshot.price,
          percentReturn:
            ((evaluationSnapshot.price - entrySnapshot.price) / entrySnapshot.price) * 100,
        }),
    evaluator: "test",
    method: "absolute-return",
    sourceRefs: [...entrySnapshot.sourceRefs, ...evaluationSnapshot.sourceRefs],
    traceId: createTraceId(),
    createdAt: nowIso(),
  };
};
