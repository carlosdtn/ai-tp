import { type TraceId, type WorkflowRunId, createId, nowIso } from "../domain/primitives";
import type { ProviderExecutionLog, ProviderType } from "../domain/provider-execution-log";
import type { ProviderExecutionLogRepository } from "../ports/repositories";

export type ProviderExecutionLogger = {
  record(input: {
    workflowRunId: WorkflowRunId;
    traceId: TraceId;
    providerType: ProviderType;
    providerName: string;
    operation: string;
    requestMetadata: Record<string, unknown>;
    responseMetadata?: Record<string, unknown>;
    status: "success" | "failed" | "rejected";
    durationMs: number;
    error?: { code: string; message: string };
  }): Promise<ProviderExecutionLog>;
};

export const createProviderExecutionLogger = (
  repository: ProviderExecutionLogRepository,
): ProviderExecutionLogger => ({
  async record(input) {
    const log: ProviderExecutionLog = {
      id: createId("ProviderExecutionLog"),
      workflowRunId: input.workflowRunId,
      providerType: input.providerType,
      providerName: input.providerName,
      operation: input.operation,
      requestMetadata: input.requestMetadata,
      responseMetadata: input.responseMetadata ?? {},
      status: input.status,
      durationMs: input.durationMs,
      ...(input.error ? { error: input.error } : {}),
      traceId: input.traceId,
      createdAt: nowIso(),
    };
    return repository.save(log);
  },
});
