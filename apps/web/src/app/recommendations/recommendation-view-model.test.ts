import { describe, expect, it } from "vitest";
import { toRecommendationViewModel } from "./recommendation-view-model";

describe("toRecommendationViewModel", () => {
  it("maps audit fields for display", () => {
    const vm = toRecommendationViewModel(
      {
        id: "rec_1" as never,
        workflowRunId: "run_1" as never,
        instrumentId: "inst_1" as never,
        action: "buy",
        status: "actionable",
        inputSnapshot: {},
        sourceRefs: [],
        providerIds: {},
        score: 0.8,
        confidence: 0.75,
        risks: {
          workflowRunId: "run_1" as never,
          instrumentId: "inst_1" as never,
          status: "passed",
          riskFactors: [],
          warnings: [],
          rejectionReasons: [],
          constraints: {},
        },
        explanation: "test explanation",
        traceId: "trace_1" as never,
        createdAt: "2026-05-29T00:00:00.000Z",
        updatedAt: "2026-05-29T00:00:00.000Z",
      },
      [],
    );
    expect(vm.riskStatus).toBe("passed");
  });
});
