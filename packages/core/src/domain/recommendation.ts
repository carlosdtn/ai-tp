import type {
  InstrumentId,
  RecommendationId,
  Timestamp,
  TraceId,
  WorkflowRunId,
} from "./primitives";
import type { ProviderType } from "./provider-execution-log";

export type PaperAction = "buy" | "sell" | "hold" | "avoid";
export type RiskStatus = "passed" | "warning" | "rejected";
export type RecommendationStatus = "draft" | "actionable" | "warning" | "rejected";

export type MarketDataSnapshot = {
  workflowRunId: WorkflowRunId;
  instrumentId: InstrumentId;
  providerId: string;
  sourceRefs: string[];
  snapshot: Record<string, unknown>;
  asOf: Timestamp;
  freshnessStatus: "fresh" | "stale";
  traceId: TraceId;
};

export type AIAnalysis = {
  workflowRunId: WorkflowRunId;
  instrumentId: InstrumentId;
  providerId: string;
  inputRef: string;
  summary: string;
  rationale: string;
  confidence: number;
  rawResponseRef: string;
  risksMentioned: string[];
  sourceRefs: string[];
  traceId: TraceId;
};

export type ScoreResult = {
  workflowRunId: WorkflowRunId;
  instrumentId: InstrumentId;
  score: number;
  confidence: number;
  factors: Array<{ name: string; value: number; weight: number; explanation: string }>;
  thresholds: Record<string, number>;
};

export type RiskAssessment = {
  workflowRunId: WorkflowRunId;
  instrumentId: InstrumentId;
  status: RiskStatus;
  riskFactors: string[];
  warnings: string[];
  rejectionReasons: string[];
  constraints: Record<string, unknown>;
};

export type Recommendation = {
  id: RecommendationId;
  workflowRunId: WorkflowRunId;
  instrumentId: InstrumentId;
  action: PaperAction;
  status: RecommendationStatus;
  inputSnapshot: Record<string, unknown>;
  sourceRefs: string[];
  providerIds: Partial<Record<ProviderType, string>>;
  score: number;
  confidence: number;
  risks: RiskAssessment;
  explanation: string;
  traceId: TraceId;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
