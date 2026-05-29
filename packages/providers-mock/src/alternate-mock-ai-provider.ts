import type { AIProvider } from "@ai-tp/core";
import { ok } from "@ai-tp/core";

export const createAlternateMockAIProvider = (): AIProvider => ({
  providerId: "alternate-mock-ai",
  async analyze(request) {
    return ok({
      workflowRunId: request.workflowRunId,
      instrumentId: request.instrument.id,
      providerId: "alternate-mock-ai",
      inputRef: `mock://alternate-ai/input/${request.instrument.symbol}`,
      summary: `${request.instrument.symbol} receives a neutral alternate mock view.`,
      rationale:
        "Alternate provider keeps the same contract while changing provider-specific output.",
      confidence: 0.61,
      rawResponseRef: `mock://alternate-ai/raw/${request.instrument.symbol}`,
      risksMentioned: ["Alternate mock scenario"],
      sourceRefs: [`mock://alternate-ai/source/${request.instrument.symbol}`],
      traceId: request.traceId,
    });
  },
});
