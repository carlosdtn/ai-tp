import { describe, expect, it } from "vitest";
import { createId, nowIso } from "../domain/primitives";
import type { Repositories } from "../ports/repositories";
import { generateRecommendations } from "./generate-recommendations";

describe("generateRecommendations", () => {
  it("creates auditable paper recommendations", async () => {
    const watchlist = createTestWatchlist();
    const repositories = createTestRepositories(watchlist);
    const result = await generateRecommendations(
      { watchlistId: watchlist.id, triggeredBy: "test" },
      {
        repositories,
        aiProvider: {
          providerId: "fake-ai",
          async analyze(request) {
            return {
              ok: true,
              value: {
                workflowRunId: request.workflowRunId,
                instrumentId: request.instrument.id,
                providerId: "fake-ai",
                inputRef: "input",
                summary: "fake mock conditions",
                rationale: "test rationale",
                confidence: 0.8,
                rawResponseRef: "raw",
                risksMentioned: [],
                sourceRefs: ["fake://ai"],
                traceId: request.traceId,
              },
            };
          },
        },
        brokerProvider: {
          providerId: "fake-broker",
          async simulatePaperAction() {
            return {
              ok: true,
              value: {
                providerId: "fake-broker",
                paperSimulationId: createId("PaperSimulation"),
                status: "accepted",
                reason: "accepted",
                buyingPowerImpact: 100,
              },
            };
          },
        },
        marketDataProvider: {
          providerId: "fake-market",
          async getSnapshot(request) {
            return {
              ok: true,
              value: {
                workflowRunId: request.workflowRunId,
                instrumentId: request.instrument.id,
                providerId: "fake-market",
                sourceRefs: ["fake://market"],
                snapshot: { price: 100, momentum: 0.8, valuation: 0.7 },
                asOf: "2026-05-29T00:00:00.000Z",
                freshnessStatus: "fresh",
                traceId: request.traceId,
              },
            };
          },
        },
      },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.recommendations[0]?.explanation).toContain("mock conditions");
    }
  });
});

const createTestWatchlist = () => {
  const timestamp = nowIso();
  return {
    id: createId("Watchlist"),
    name: "Core Test Watchlist",
    instruments: [
      {
        id: createId("Instrument"),
        symbol: "AAPL",
        displayName: "AAPL",
        assetClass: "equity" as const,
        currency: "USD",
        market: "NASDAQ",
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const createTestRepositories = (
  watchlist: ReturnType<typeof createTestWatchlist>,
): Repositories => {
  const recommendations: Awaited<ReturnType<Repositories["recommendations"]["list"]>> = [];
  return {
    watchlists: {
      async save(value) {
        return value;
      },
      async findById() {
        return watchlist;
      },
      async list() {
        return [watchlist];
      },
    },
    recommendations: {
      async save(value) {
        recommendations.push(value);
        return value;
      },
      async findById() {
        return recommendations[0];
      },
      async list() {
        return recommendations;
      },
    },
    workflowRuns: {
      async save(value) {
        return value;
      },
      async findById() {
        return undefined;
      },
    },
    providerLogs: {
      async save(value) {
        return value;
      },
      async list() {
        return [];
      },
    },
    journal: {
      async save(value) {
        return value;
      },
      async findById() {
        return undefined;
      },
      async list() {
        return [];
      },
    },
  };
};
