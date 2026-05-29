import type { Recommendation } from "@ai-tp/core";

export const printJson = (value: unknown): void => {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

export const formatRecommendationSummary = (recommendation: Recommendation): string =>
  [
    `Recommendation ${recommendation.id}`,
    `Action: ${recommendation.action} (${recommendation.status})`,
    `Score: ${recommendation.score}`,
    `Confidence: ${recommendation.confidence}`,
    `Risk: ${recommendation.risks.status}`,
    `Trace: ${recommendation.traceId}`,
    `Explanation: ${recommendation.explanation}`,
  ].join("\n");
