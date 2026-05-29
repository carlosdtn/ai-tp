import { describe, expect, it } from "vitest";
import { scoreCandidate } from "./scoring-engine";

describe("scoreCandidate", () => {
  it("produces normalized scores", () => {
    const score = scoreCandidate({
      analysis: {
        workflowRunId: "run_1" as never,
        instrumentId: "inst_1" as never,
        providerId: "mock-ai",
        inputRef: "input",
        summary: "summary",
        rationale: "rationale",
        confidence: 0.8,
        rawResponseRef: "raw",
        risksMentioned: [],
        sourceRefs: [],
        traceId: "trace_1" as never,
      },
      marketData: {
        workflowRunId: "run_1" as never,
        instrumentId: "inst_1" as never,
        providerId: "mock-market-data",
        sourceRefs: [],
        snapshot: { momentum: 0.8, valuation: 0.6 },
        asOf: "2026-05-29T00:00:00.000Z",
        freshnessStatus: "fresh",
        traceId: "trace_1" as never,
      },
    });
    expect(score.score).toBeGreaterThan(0);
    expect(score.score).toBeLessThanOrEqual(1);
  });
});
