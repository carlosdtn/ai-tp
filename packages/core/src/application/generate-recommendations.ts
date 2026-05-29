import { createId, createTraceId, nowIso } from "../domain/primitives";
import type { WatchlistId } from "../domain/primitives";
import type { Recommendation } from "../domain/recommendation";
import { type Result, err, ok } from "../domain/result";
import type { WorkflowRun } from "../domain/workflow-run";
import type { AIProvider } from "../ports/ai-provider";
import type { BrokerProvider } from "../ports/broker-provider";
import type { MarketDataProvider } from "../ports/market-data-provider";
import type { Repositories } from "../ports/repositories";
import { assertPaperTradingOnly } from "./paper-trading-policy";
import { createProviderExecutionLogger } from "./provider-execution-logger";
import { assessRisk } from "./risk-engine";
import { scoreCandidate } from "./scoring-engine";

export type GenerateRecommendationsInput = {
  watchlistId: WatchlistId;
  triggeredBy: WorkflowRun["triggeredBy"];
  scenarioId?: string;
  tradingMode?: "paper" | "live";
};

export type GenerateRecommendationsDependencies = {
  repositories: Repositories;
  marketDataProvider: MarketDataProvider;
  aiProvider: AIProvider;
  brokerProvider: BrokerProvider;
};

export type GenerateRecommendationsOutput = {
  workflowRun: WorkflowRun;
  recommendations: Recommendation[];
};

export const generateRecommendations = async (
  input: GenerateRecommendationsInput,
  dependencies: GenerateRecommendationsDependencies,
): Promise<Result<GenerateRecommendationsOutput>> => {
  const mode = assertPaperTradingOnly(input.tradingMode ?? "paper");
  if (!mode.ok) {
    return mode;
  }

  const watchlist = await dependencies.repositories.watchlists.findById(input.watchlistId);
  if (!watchlist) {
    return err("NOT_FOUND", `Watchlist ${input.watchlistId} was not found.`);
  }

  const traceId = createTraceId();
  const workflowRun: WorkflowRun = {
    id: createId("WorkflowRun"),
    watchlistId: watchlist.id,
    status: "running",
    startedAt: nowIso(),
    triggeredBy: input.triggeredBy,
    traceId,
  };
  await dependencies.repositories.workflowRuns.save(workflowRun);

  const logger = createProviderExecutionLogger(dependencies.repositories.providerLogs);
  const recommendations: Recommendation[] = [];

  for (const instrument of watchlist.instruments) {
    const marketStarted = Date.now();
    const scenario = input.scenarioId ? { scenarioId: input.scenarioId } : {};
    const marketData = await dependencies.marketDataProvider.getSnapshot({
      traceId,
      workflowRunId: workflowRun.id,
      instrument,
      ...scenario,
    });
    await logger.record({
      workflowRunId: workflowRun.id,
      traceId,
      providerType: "market-data",
      providerName: dependencies.marketDataProvider.providerId,
      operation: "getSnapshot",
      requestMetadata: { instrument: instrument.symbol, scenarioId: input.scenarioId },
      responseMetadata: marketData.ok ? { providerId: marketData.value.providerId } : {},
      status: marketData.ok ? "success" : "failed",
      durationMs: Date.now() - marketStarted,
      ...(marketData.ok ? {} : { error: marketData.error }),
    });
    if (!marketData.ok) {
      continue;
    }

    const aiStarted = Date.now();
    const analysis = await dependencies.aiProvider.analyze({
      traceId,
      workflowRunId: workflowRun.id,
      instrument,
      marketDataSnapshot: marketData.value,
      analysisPrompt: `Analyze ${instrument.symbol} for a paper-trading recommendation.`,
      ...scenario,
    });
    await logger.record({
      workflowRunId: workflowRun.id,
      traceId,
      providerType: "ai",
      providerName: dependencies.aiProvider.providerId,
      operation: "analyze",
      requestMetadata: { instrument: instrument.symbol, scenarioId: input.scenarioId },
      responseMetadata: analysis.ok ? { providerId: analysis.value.providerId } : {},
      status: analysis.ok ? "success" : "failed",
      durationMs: Date.now() - aiStarted,
      ...(analysis.ok ? {} : { error: analysis.error }),
    });
    if (!analysis.ok) {
      continue;
    }

    const score = scoreCandidate({ analysis: analysis.value, marketData: marketData.value });
    const risks = assessRisk(score);
    const action = risks.status === "rejected" ? "avoid" : score.score >= 0.7 ? "buy" : "hold";
    const timestamp = nowIso();
    const recommendation: Recommendation = {
      id: createId("Recommendation"),
      workflowRunId: workflowRun.id,
      instrumentId: instrument.id,
      action,
      status: risks.status === "passed" ? "actionable" : risks.status,
      inputSnapshot: {
        instrument,
        marketData: marketData.value.snapshot,
        analysis: analysis.value.summary,
      },
      sourceRefs: [...marketData.value.sourceRefs, ...analysis.value.sourceRefs],
      providerIds: {
        "market-data": marketData.value.providerId,
        ai: analysis.value.providerId,
        broker: dependencies.brokerProvider.providerId,
      },
      score: score.score,
      confidence: score.confidence,
      risks,
      explanation: `${analysis.value.summary} ${analysis.value.rationale}`.trim(),
      traceId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const brokerStarted = Date.now();
    const simulation = await dependencies.brokerProvider.simulatePaperAction({
      traceId,
      workflowRunId: workflowRun.id,
      recommendationId: recommendation.id,
      instrument,
      paperAction: recommendation.action,
      quantity: 1,
      priceAssumption: Number(marketData.value.snapshot.price ?? 0),
    });
    await logger.record({
      workflowRunId: workflowRun.id,
      traceId,
      providerType: "broker",
      providerName: dependencies.brokerProvider.providerId,
      operation: "simulatePaperAction",
      requestMetadata: { instrument: instrument.symbol, action: recommendation.action },
      responseMetadata: simulation.ok ? { status: simulation.value.status } : {},
      status: simulation.ok ? "success" : "rejected",
      durationMs: Date.now() - brokerStarted,
      ...(simulation.ok ? {} : { error: simulation.error }),
    });

    const saved = await dependencies.repositories.recommendations.save(recommendation);
    recommendations.push(saved);
  }

  const completed: WorkflowRun = {
    ...workflowRun,
    status: recommendations.length === watchlist.instruments.length ? "completed" : "partial",
    completedAt: nowIso(),
  };
  await dependencies.repositories.workflowRuns.save(completed);

  return ok({ workflowRun: completed, recommendations });
};
