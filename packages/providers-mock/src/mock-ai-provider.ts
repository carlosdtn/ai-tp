import type { AIProvider } from "@ai-tp/core";
import { ok } from "@ai-tp/core";

export const createMockAIProvider = (): AIProvider => ({
  providerId: "mock-ai",
  async analyze(request) {
    const bearish = request.scenarioId === "bearish";
    return ok({
      workflowRunId: request.workflowRunId,
      instrumentId: request.instrument.id,
      providerId: "mock-ai",
      inputRef: `mock://ai/input/${request.instrument.symbol}`,
      summary: bearish
        ? `${request.instrument.symbol} shows weak mock conditions.`
        : `${request.instrument.symbol} shows constructive mock conditions.`,
      rationale: bearish
        ? "Momentum is weak and confidence is intentionally conservative."
        : "Momentum, valuation, and simulated analysis confidence are aligned.",
      confidence: bearish ? 0.42 : 0.82,
      rawResponseRef: `mock://ai/raw/${request.instrument.symbol}/${request.scenarioId ?? "default"}`,
      risksMentioned: bearish ? ["Weak momentum", "Low confidence"] : ["Scenario is simulated"],
      sourceRefs: [`mock://ai/source/${request.instrument.symbol}`],
      traceId: request.traceId,
    });
  },
});
