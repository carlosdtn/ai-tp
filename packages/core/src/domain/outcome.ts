import type {
  EvaluationPolicyId,
  RecommendationId,
  RecommendationOutcomeId,
  Timestamp,
  TraceId,
} from "./primitives";

export type ExpectedDirection = "up" | "down" | "flat";
export type OutcomeClassification = "win" | "loss" | "neutral" | "unresolved";

export type EvaluationPolicy = {
  id: EvaluationPolicyId;
  recommendationId: RecommendationId;
  expectedDirection: ExpectedDirection;
  horizonDays: number;
  neutralThresholdPct: number;
  benchmarkSymbol?: string;
  method: "absolute-return";
  createdAt: Timestamp;
};

export type PriceSnapshot = {
  price: number;
  timestamp: Timestamp;
  sourceRefs: string[];
  providerId: string;
};

export type RecommendationOutcome = {
  id: RecommendationOutcomeId;
  recommendationId: RecommendationId;
  policy: EvaluationPolicy;
  entrySnapshot?: PriceSnapshot;
  evaluationSnapshot?: PriceSnapshot;
  classification: OutcomeClassification;
  absoluteReturn?: number;
  percentReturn?: number;
  unresolvedReason?: string;
  evaluator: "system" | "cli" | "dashboard" | "test";
  method: "absolute-return";
  sourceRefs: string[];
  traceId: TraceId;
  createdAt: Timestamp;
};

export type PerformanceSummary = {
  evaluatedCount: number;
  unresolvedCount: number;
  winRate: number;
  lossRate: number;
  neutralRate: number;
  averageReturnPct: number;
  averageConfidenceByOutcome: Partial<Record<OutcomeClassification, number>>;
};
