import type { TraceId, WorkflowRunId } from "../domain/primitives";
import type { AIAnalysis, MarketDataSnapshot } from "../domain/recommendation";
import type { Result } from "../domain/result";
import type { Instrument } from "../domain/watchlist";

export type AIAnalysisRequest = {
  traceId: TraceId;
  workflowRunId: WorkflowRunId;
  instrument: Instrument;
  marketDataSnapshot: MarketDataSnapshot;
  analysisPrompt: string;
  scenarioId?: string;
};

export type AIProvider = {
  readonly providerId: string;
  analyze(request: AIAnalysisRequest): Promise<Result<AIAnalysis>>;
};
