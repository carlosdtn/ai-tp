import { describe, expect, it } from "vitest";
import { createProviderExecutionLogger } from "./provider-execution-logger";

describe("createProviderExecutionLogger", () => {
  it("persists provider execution logs", async () => {
    const saved: unknown[] = [];
    const logger = createProviderExecutionLogger({
      async save(log) {
        saved.push(log);
        return log;
      },
      async list() {
        return [];
      },
    });
    await logger.record({
      workflowRunId: "run_1" as never,
      traceId: "trace_1" as never,
      providerType: "ai",
      providerName: "mock-ai",
      operation: "analyze",
      requestMetadata: {},
      status: "success",
      durationMs: 1,
    });
    expect(saved).toHaveLength(1);
  });
});
