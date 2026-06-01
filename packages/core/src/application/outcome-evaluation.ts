import type {
  EvaluationPolicy,
  ExpectedDirection,
  PriceSnapshot,
  RecommendationOutcome,
} from "../domain/outcome";
import { type RecommendationId, createId, createTraceId, nowIso } from "../domain/primitives";
import { type Result, err, ok } from "../domain/result";
import type { RecommendationOutcomeRepository } from "../ports/repositories";

export type EvaluateRecommendationInput = {
  recommendationId: RecommendationId;
  expectedDirection?: ExpectedDirection;
  horizonDays?: number;
  neutralThresholdPct?: number;
  benchmarkSymbol?: string;
  entrySnapshot?: PriceSnapshot;
  evaluationSnapshot?: PriceSnapshot;
  evaluator: RecommendationOutcome["evaluator"];
};

export const createDefaultEvaluationPolicy = (
  recommendationId: RecommendationId,
  expectedDirection: ExpectedDirection = "up",
): EvaluationPolicy => ({
  id: createId("EvaluationPolicy"),
  recommendationId,
  expectedDirection,
  horizonDays: 5,
  neutralThresholdPct: 1,
  method: "absolute-return",
  createdAt: nowIso(),
});

export const evaluateRecommendationOutcome = async (
  input: EvaluateRecommendationInput,
  repository: RecommendationOutcomeRepository,
): Promise<Result<RecommendationOutcome>> => {
  const policy: EvaluationPolicy = {
    ...createDefaultEvaluationPolicy(input.recommendationId, input.expectedDirection ?? "up"),
    horizonDays: input.horizonDays ?? 5,
    neutralThresholdPct: input.neutralThresholdPct ?? 1,
    ...(input.benchmarkSymbol ? { benchmarkSymbol: input.benchmarkSymbol } : {}),
  };

  const outcome = buildOutcome(input, policy);
  const saved = await repository.save(outcome);
  return ok(saved);
};

const buildOutcome = (
  input: EvaluateRecommendationInput,
  policy: EvaluationPolicy,
): RecommendationOutcome => {
  const base = {
    id: createId("RecommendationOutcome"),
    recommendationId: input.recommendationId,
    policy,
    ...(input.entrySnapshot ? { entrySnapshot: input.entrySnapshot } : {}),
    ...(input.evaluationSnapshot ? { evaluationSnapshot: input.evaluationSnapshot } : {}),
    evaluator: input.evaluator,
    method: "absolute-return" as const,
    sourceRefs: [
      ...(input.entrySnapshot?.sourceRefs ?? []),
      ...(input.evaluationSnapshot?.sourceRefs ?? []),
    ],
    traceId: createTraceId(),
    createdAt: nowIso(),
  };

  if (!input.entrySnapshot) {
    return { ...base, classification: "unresolved", unresolvedReason: "missing-entry-snapshot" };
  }

  if (!input.evaluationSnapshot) {
    return {
      ...base,
      classification: "unresolved",
      unresolvedReason: "missing-evaluation-snapshot",
    };
  }

  const absoluteReturn = round(input.evaluationSnapshot.price - input.entrySnapshot.price);
  const percentReturn = round((absoluteReturn / input.entrySnapshot.price) * 100);
  const classification = classifyOutcome(percentReturn, policy);

  return {
    ...base,
    classification,
    absoluteReturn,
    percentReturn,
  };
};

export const classifyOutcome = (
  percentReturn: number,
  policy: Pick<EvaluationPolicy, "expectedDirection" | "neutralThresholdPct">,
): RecommendationOutcome["classification"] => {
  if (Math.abs(percentReturn) <= policy.neutralThresholdPct) {
    return "neutral";
  }

  if (policy.expectedDirection === "flat") {
    return "loss";
  }

  if (policy.expectedDirection === "up") {
    return percentReturn > 0 ? "win" : "loss";
  }

  return percentReturn < 0 ? "win" : "loss";
};

export const rejectPolicyMutationAfterEvaluation = async (
  recommendationId: RecommendationId,
  repository: RecommendationOutcomeRepository,
): Promise<Result<"allowed">> => {
  const existing = await repository.list({ recommendationId });
  if (existing.length > 0) {
    return err("INVALID_INPUT", "Evaluation policy cannot be rewritten after outcomes exist.");
  }
  return ok("allowed");
};

const round = (value: number) => Math.round(value * 100) / 100;
