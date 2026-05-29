import type { TraceId, WorkflowRunId } from "../domain/primitives";
import type { MarketDataSnapshot } from "../domain/recommendation";
import type { Result } from "../domain/result";
import type { Instrument } from "../domain/watchlist";

export type MarketDataRequest = {
  traceId: TraceId;
  workflowRunId: WorkflowRunId;
  instrument: Instrument;
  scenarioId?: string;
};

export type MarketDataProvider = {
  readonly providerId: string;
  getSnapshot(request: MarketDataRequest): Promise<Result<MarketDataSnapshot>>;
};
