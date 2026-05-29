import type { ProviderExecutionLogId, Timestamp, TraceId, WorkflowRunId } from "./primitives";

export type ProviderType = "ai" | "broker" | "market-data" | "persistence";
export type ProviderExecutionStatus = "success" | "failed" | "rejected";

export type ProviderExecutionLog = {
  id: ProviderExecutionLogId;
  workflowRunId: WorkflowRunId;
  providerType: ProviderType;
  providerName: string;
  operation: string;
  requestMetadata: Record<string, unknown>;
  responseMetadata: Record<string, unknown>;
  status: ProviderExecutionStatus;
  durationMs: number;
  error?: {
    code: string;
    message: string;
  };
  traceId: TraceId;
  createdAt: Timestamp;
};
