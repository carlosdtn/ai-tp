import { createId, createTraceId, nowIso } from "@ai-tp/core";
import { createPostgresRepositories, initializeDatabase } from "@ai-tp/persistence-drizzle";
import { createSeedWatchlist } from "@ai-tp/shared/testing";
import { describe, expect, it } from "vitest";

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDatabase("postgres repositories", () => {
  it("persists watchlists, recommendations, outcomes, and summaries across repository instances", async () => {
    const databaseUrl = process.env.DATABASE_URL;
    expect(databaseUrl).toBeTruthy();
    if (!databaseUrl) {
      return;
    }

    await initializeDatabase(databaseUrl);
    const first = createPostgresRepositories(databaseUrl);
    const watchlist = createSeedWatchlist();
    await first.watchlists.save(watchlist);

    const workflowRun = {
      id: createId("WorkflowRun"),
      watchlistId: watchlist.id,
      status: "completed" as const,
      startedAt: nowIso(),
      completedAt: nowIso(),
      triggeredBy: "test" as const,
      traceId: createTraceId(),
    };
    await first.workflowRuns.save(workflowRun);

    const recommendation = {
      id: createId("Recommendation"),
      workflowRunId: workflowRun.id,
      instrumentId: watchlist.instruments[0].id,
      action: "buy" as const,
      status: "actionable" as const,
      inputSnapshot: { watchlistId: watchlist.id },
      sourceRefs: ["mock://test"],
      providerIds: { ai: "mock-ai", broker: "mock-broker", "market-data": "mock-market-data" },
      score: 80,
      confidence: 0.8,
      risks: {
        workflowRunId: workflowRun.id,
        instrumentId: watchlist.instruments[0].id,
        status: "passed" as const,
        riskFactors: [],
        warnings: [],
        rejectionReasons: [],
        constraints: {},
      },
      explanation: "Persisted test recommendation",
      traceId: workflowRun.traceId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await first.recommendations.save(recommendation);

    const outcome = {
      id: createId("RecommendationOutcome"),
      recommendationId: recommendation.id,
      policy: {
        id: createId("EvaluationPolicy"),
        recommendationId: recommendation.id,
        expectedDirection: "up" as const,
        horizonDays: 5,
        neutralThresholdPct: 1,
        method: "absolute-return" as const,
        createdAt: nowIso(),
      },
      classification: "win" as const,
      absoluteReturn: 3,
      percentReturn: 3,
      evaluator: "test" as const,
      method: "absolute-return" as const,
      sourceRefs: ["mock://test"],
      traceId: workflowRun.traceId,
      createdAt: nowIso(),
    };
    await first.outcomes.save(outcome);

    const second = createPostgresRepositories(databaseUrl);
    expect(await second.watchlists.findById(watchlist.id)).toMatchObject({ id: watchlist.id });
    expect(await second.recommendations.findById(recommendation.id)).toMatchObject({
      id: recommendation.id,
    });
    expect(await second.outcomes.list({ recommendationId: recommendation.id })).toHaveLength(1);
  });
});
