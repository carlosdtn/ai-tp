import type {
  PaperSimulationId,
  RecommendationId,
  TraceId,
  WorkflowRunId,
} from "../domain/primitives";
import type { PaperAction } from "../domain/recommendation";
import type { Result } from "../domain/result";
import type { Instrument } from "../domain/watchlist";

export type PaperSimulation = {
  providerId: string;
  paperSimulationId: PaperSimulationId;
  status: "accepted" | "rejected";
  reason: string;
  buyingPowerImpact: number;
};

export type PaperSimulationRequest = {
  traceId: TraceId;
  workflowRunId: WorkflowRunId;
  recommendationId: RecommendationId;
  instrument: Instrument;
  paperAction: PaperAction;
  quantity: number;
  priceAssumption: number;
};

export type BrokerProvider = {
  readonly providerId: string;
  simulatePaperAction(request: PaperSimulationRequest): Promise<Result<PaperSimulation>>;
};
