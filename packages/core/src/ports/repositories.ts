import type { JournalEntry } from "../domain/journal";
import type { RecommendationOutcome } from "../domain/outcome";
import type {
  JournalEntryId,
  RecommendationId,
  TraceId,
  WatchlistId,
  WorkflowRunId,
} from "../domain/primitives";
import type { ProviderExecutionLog } from "../domain/provider-execution-log";
import type { Recommendation } from "../domain/recommendation";
import type { Watchlist } from "../domain/watchlist";
import type { WorkflowRun } from "../domain/workflow-run";

export type WatchlistRepository = {
  save(watchlist: Watchlist): Promise<Watchlist>;
  findById(id: WatchlistId): Promise<Watchlist | undefined>;
  list(): Promise<Watchlist[]>;
};

export type RecommendationRepository = {
  save(recommendation: Recommendation): Promise<Recommendation>;
  findById(id: RecommendationId): Promise<Recommendation | undefined>;
  list(filters?: { watchlistId?: WatchlistId; traceId?: TraceId }): Promise<Recommendation[]>;
};

export type WorkflowRunRepository = {
  save(workflowRun: WorkflowRun): Promise<WorkflowRun>;
  findById(id: WorkflowRunId): Promise<WorkflowRun | undefined>;
};

export type ProviderExecutionLogRepository = {
  save(log: ProviderExecutionLog): Promise<ProviderExecutionLog>;
  list(filters?: { workflowRunId?: WorkflowRunId; traceId?: TraceId }): Promise<
    ProviderExecutionLog[]
  >;
};

export type JournalRepository = {
  save(entry: JournalEntry): Promise<JournalEntry>;
  findById(id: JournalEntryId): Promise<JournalEntry | undefined>;
  list(filters?: { recommendationId?: RecommendationId }): Promise<JournalEntry[]>;
};

export type RecommendationOutcomeRepository = {
  save(outcome: RecommendationOutcome): Promise<RecommendationOutcome>;
  list(filters?: { recommendationId?: RecommendationId }): Promise<RecommendationOutcome[]>;
};

export type Repositories = {
  watchlists: WatchlistRepository;
  recommendations: RecommendationRepository;
  workflowRuns: WorkflowRunRepository;
  providerLogs: ProviderExecutionLogRepository;
  journal: JournalRepository;
  outcomes: RecommendationOutcomeRepository;
};
