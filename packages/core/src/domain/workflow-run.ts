import type { Timestamp, TraceId, WatchlistId, WorkflowRunId } from "./primitives";

export type WorkflowRunStatus = "pending" | "running" | "completed" | "failed" | "partial";

export type WorkflowRun = {
  id: WorkflowRunId;
  watchlistId: WatchlistId;
  status: WorkflowRunStatus;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  triggeredBy: "cli" | "dashboard" | "system" | "test";
  traceId: TraceId;
  errorSummary?: string;
};
