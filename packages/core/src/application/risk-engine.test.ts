import { describe, expect, it } from "vitest";
import { assessRisk } from "./risk-engine";

describe("assessRisk", () => {
  it("rejects low scores", () => {
    const risk = assessRisk({
      workflowRunId: "run_1" as never,
      instrumentId: "inst_1" as never,
      score: 0.2,
      confidence: 0.8,
      factors: [],
      thresholds: {},
    });
    expect(risk.status).toBe("rejected");
  });
});
