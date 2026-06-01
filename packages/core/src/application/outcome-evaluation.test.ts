import { describe, expect, it } from "vitest";
import { createId } from "../domain/primitives";
import type { RecommendationOutcomeRepository } from "../ports/repositories";
import {
  classifyOutcome,
  evaluateRecommendationOutcome,
  rejectPolicyMutationAfterEvaluation,
} from "./outcome-evaluation";

describe("outcome evaluation", () => {
  it("classifies an upward recommendation as a win when evaluated price rises", async () => {
    const repository = createOutcomeRepository();
    const result = await evaluateRecommendationOutcome(
      {
        recommendationId: createId("Recommendation"),
        expectedDirection: "up",
        entrySnapshot: priceSnapshot(100),
        evaluationSnapshot: priceSnapshot(104),
        evaluator: "test",
      },
      repository,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe("win");
      expect(result.value.percentReturn).toBe(4);
      expect(result.value.policy.neutralThresholdPct).toBe(1);
    }
  });

  it("marks outcomes unresolved when an evaluation price is missing", async () => {
    const repository = createOutcomeRepository();
    const result = await evaluateRecommendationOutcome(
      {
        recommendationId: createId("Recommendation"),
        entrySnapshot: priceSnapshot(100),
        evaluator: "test",
      },
      repository,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe("unresolved");
      expect(result.value.unresolvedReason).toBe("missing-evaluation-snapshot");
    }
  });

  it("does not allow rewriting policy after an outcome exists", async () => {
    const recommendationId = createId("Recommendation");
    const repository = createOutcomeRepository();
    await evaluateRecommendationOutcome(
      {
        recommendationId,
        entrySnapshot: priceSnapshot(100),
        evaluationSnapshot: priceSnapshot(102),
        evaluator: "test",
      },
      repository,
    );

    const result = await rejectPolicyMutationAfterEvaluation(recommendationId, repository);

    expect(result.ok).toBe(false);
  });

  it("honors down and neutral classification policy", () => {
    expect(classifyOutcome(-3, { expectedDirection: "down", neutralThresholdPct: 1 })).toBe("win");
    expect(classifyOutcome(0.5, { expectedDirection: "up", neutralThresholdPct: 1 })).toBe(
      "neutral",
    );
    expect(classifyOutcome(2, { expectedDirection: "flat", neutralThresholdPct: 1 })).toBe("loss");
  });
});

const priceSnapshot = (price: number) => ({
  price,
  timestamp: "2026-05-31T00:00:00.000Z",
  sourceRefs: ["mock://market/snapshot"],
  providerId: "mock-market-data",
});

const createOutcomeRepository = (): RecommendationOutcomeRepository => {
  const outcomes: Awaited<ReturnType<RecommendationOutcomeRepository["list"]>> = [];
  return {
    async save(outcome) {
      outcomes.push(outcome);
      return outcome;
    },
    async list(filters) {
      return filters?.recommendationId
        ? outcomes.filter((outcome) => outcome.recommendationId === filters.recommendationId)
        : outcomes;
    },
  };
};
