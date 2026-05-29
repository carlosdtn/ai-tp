import type { AIAnalysis, MarketDataSnapshot, ScoreResult } from "../domain/recommendation";

export const scoreCandidate = (input: {
  analysis: AIAnalysis;
  marketData: MarketDataSnapshot;
}): ScoreResult => {
  const momentum = Number(input.marketData.snapshot.momentum ?? 0.5);
  const valuation = Number(input.marketData.snapshot.valuation ?? 0.5);
  const sentiment = input.analysis.confidence;
  const factors = [
    { name: "momentum", value: clamp(momentum), weight: 0.35, explanation: "Mock momentum signal" },
    {
      name: "valuation",
      value: clamp(valuation),
      weight: 0.25,
      explanation: "Mock valuation signal",
    },
    {
      name: "analysis",
      value: clamp(sentiment),
      weight: 0.4,
      explanation: "AI analysis confidence",
    },
  ];
  const score = factors.reduce((sum, factor) => sum + factor.value * factor.weight, 0);

  return {
    workflowRunId: input.analysis.workflowRunId,
    instrumentId: input.analysis.instrumentId,
    score: round(score),
    confidence: round((input.analysis.confidence + score) / 2),
    factors,
    thresholds: { actionable: 0.7, warning: 0.55, reject: 0.35 },
  };
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const round = (value: number) => Math.round(value * 100) / 100;
