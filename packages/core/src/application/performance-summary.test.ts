import { describe, expect, it } from "vitest";
import type { RecommendationOutcome } from "../domain/outcome";
import { createId, createTraceId } from "../domain/primitives";
import { createDefaultEvaluationPolicy } from "./outcome-evaluation";
import { summarizePerformance } from "./performance-summary";

describe("performance summary", () => {
  it("summarizes evaluated and unresolved outcomes", () => {
    const recommendationId = createId("Recommendation");
    const summary = summarizePerformance([
      { outcome: outcome(recommendationId, "win", 4), confidence: 0.8 },
      { outcome: outcome(recommendationId, "loss", -3), confidence: 0.4 },
      { outcome: outcome(recommendationId, "neutral", 0.5), confidence: 0.6 },
      { outcome: outcome(recommendationId, "unresolved"), confidence: 0.9 },
    ]);

    expect(summary.evaluatedCount).toBe(3);
    expect(summary.unresolvedCount).toBe(1);
    expect(summary.winRate).toBe(0.3333);
    expect(summary.lossRate).toBe(0.3333);
    expect(summary.neutralRate).toBe(0.3333);
    expect(summary.averageReturnPct).toBe(0.5);
    expect(summary.averageConfidenceByOutcome.win).toBe(0.8);
  });
});

const outcome = (
  recommendationId: RecommendationOutcome["recommendationId"],
  classification: RecommendationOutcome["classification"],
  percentReturn?: number,
): RecommendationOutcome => ({
  id: createId("RecommendationOutcome"),
  recommendationId,
  policy: createDefaultEvaluationPolicy(recommendationId, "up"),
  classification,
  ...(percentReturn === undefined ? {} : { percentReturn, absoluteReturn: percentReturn }),
  evaluator: "test",
  method: "absolute-return",
  sourceRefs: ["mock://market/snapshot"],
  traceId: createTraceId(),
  createdAt: "2026-05-31T00:00:00.000Z",
});
