import type { ProviderExecutionLog, Recommendation } from "@ai-tp/core";

export type RecommendationViewModel = {
  id: string;
  action: string;
  status: string;
  score: number;
  confidence: number;
  riskStatus: string;
  explanation: string;
  traceId: string;
  providerLogs: ProviderExecutionLog[];
};

export const toRecommendationViewModel = (
  recommendation: Recommendation,
  providerLogs: ProviderExecutionLog[],
): RecommendationViewModel => ({
  id: recommendation.id,
  action: recommendation.action,
  status: recommendation.status,
  score: recommendation.score,
  confidence: recommendation.confidence,
  riskStatus: recommendation.risks.status,
  explanation: recommendation.explanation,
  traceId: recommendation.traceId,
  providerLogs: providerLogs.filter((log) => log.traceId === recommendation.traceId),
});
