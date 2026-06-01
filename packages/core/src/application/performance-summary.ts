import type {
  OutcomeClassification,
  PerformanceSummary,
  RecommendationOutcome,
} from "../domain/outcome";

export type RecommendationPerformanceContext = {
  outcome: RecommendationOutcome;
  confidence?: number;
};

export const summarizePerformance = (
  items: RecommendationPerformanceContext[],
): PerformanceSummary => {
  const evaluated = items.filter((item) => item.outcome.classification !== "unresolved");
  const unresolvedCount = items.length - evaluated.length;
  const evaluatedCount = evaluated.length;
  const averageReturnPct =
    evaluated.length === 0
      ? 0
      : round(
          evaluated.reduce((sum, item) => sum + (item.outcome.percentReturn ?? 0), 0) /
            evaluated.length,
        );

  return {
    evaluatedCount,
    unresolvedCount,
    winRate: rate(evaluated, "win"),
    lossRate: rate(evaluated, "loss"),
    neutralRate: rate(evaluated, "neutral"),
    averageReturnPct,
    averageConfidenceByOutcome: confidenceByOutcome(items),
  };
};

const rate = (
  items: RecommendationPerformanceContext[],
  classification: OutcomeClassification,
): number => {
  if (items.length === 0) {
    return 0;
  }
  return roundRatio(
    items.filter((item) => item.outcome.classification === classification).length / items.length,
  );
};

const confidenceByOutcome = (
  items: RecommendationPerformanceContext[],
): PerformanceSummary["averageConfidenceByOutcome"] => {
  const groups = new Map<OutcomeClassification, number[]>();
  for (const item of items) {
    if (item.confidence === undefined) {
      continue;
    }
    groups.set(item.outcome.classification, [
      ...(groups.get(item.outcome.classification) ?? []),
      item.confidence,
    ]);
  }

  return Object.fromEntries(
    [...groups.entries()].map(([classification, values]) => [
      classification,
      roundRatio(values.reduce((sum, value) => sum + value, 0) / values.length),
    ]),
  );
};

const round = (value: number) => Math.round(value * 100) / 100;
const roundRatio = (value: number) => Math.round(value * 10000) / 10000;
