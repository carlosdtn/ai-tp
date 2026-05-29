import type { MarketDataProvider } from "@ai-tp/core";
import { err, ok } from "@ai-tp/core";

export const createMockMarketDataProvider = (): MarketDataProvider => ({
  providerId: "mock-market-data",
  async getSnapshot(request) {
    if (!request.instrument.isActive) {
      return err("UNSUPPORTED_INSTRUMENT", `${request.instrument.symbol} is not active.`);
    }
    const bearish = request.scenarioId === "bearish";
    return ok({
      workflowRunId: request.workflowRunId,
      instrumentId: request.instrument.id,
      providerId: "mock-market-data",
      sourceRefs: [
        `mock://market-data/${request.instrument.symbol}/${request.scenarioId ?? "default"}`,
      ],
      snapshot: {
        symbol: request.instrument.symbol,
        price: bearish ? 88.4 : 124.32,
        momentum: bearish ? 0.28 : 0.76,
        valuation: bearish ? 0.42 : 0.68,
      },
      asOf: "2026-05-29T00:00:00.000Z",
      freshnessStatus: "fresh",
      traceId: request.traceId,
    });
  },
});
