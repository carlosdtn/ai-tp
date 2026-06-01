import { describe, expect, it } from "vitest";
import { evaluatePerformance, loadPerformanceSummary } from "../../apps/cli/src/application";

describe("cli performance workflow", () => {
  it("evaluates an outcome and includes it in performance summary", async () => {
    const result = await evaluatePerformance({
      recommendationId: "Recommendation_cli_test",
      entryPrice: 100,
      evaluationPrice: 103,
      expectedDirection: "up",
    });

    expect(result.ok).toBe(true);

    const summary = await loadPerformanceSummary();
    expect(summary.evaluatedCount).toBeGreaterThanOrEqual(1);
    expect(summary.winRate).toBeGreaterThan(0);
  });
});
