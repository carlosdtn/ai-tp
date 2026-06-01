import type {
  JournalEntry,
  JournalEntryId,
  ProviderExecutionLog,
  Recommendation,
  RecommendationId,
  RecommendationOutcome,
  Repositories,
  TraceId,
  Watchlist,
  WatchlistId,
  WorkflowRun,
  WorkflowRunId,
} from "@ai-tp/core";

export const createInMemoryRepositories = (seed?: { watchlists?: Watchlist[] }): Repositories => {
  const watchlists = new Map<WatchlistId, Watchlist>();
  const recommendations = new Map<RecommendationId, Recommendation>();
  const workflowRuns = new Map<WorkflowRunId, WorkflowRun>();
  const providerLogs: ProviderExecutionLog[] = [];
  const journal = new Map<JournalEntryId, JournalEntry>();
  const outcomes: RecommendationOutcome[] = [];

  for (const watchlist of seed?.watchlists ?? []) {
    watchlists.set(watchlist.id, watchlist);
  }

  return {
    watchlists: {
      async save(watchlist) {
        watchlists.set(watchlist.id, watchlist);
        return watchlist;
      },
      async findById(id) {
        return watchlists.get(id);
      },
      async list() {
        return [...watchlists.values()];
      },
    },
    recommendations: {
      async save(recommendation) {
        recommendations.set(recommendation.id, recommendation);
        return recommendation;
      },
      async findById(id) {
        return recommendations.get(id);
      },
      async list(filters?: { traceId?: TraceId }) {
        const values = [...recommendations.values()];
        return filters?.traceId
          ? values.filter((item) => item.traceId === filters.traceId)
          : values;
      },
    },
    workflowRuns: {
      async save(workflowRun) {
        workflowRuns.set(workflowRun.id, workflowRun);
        return workflowRun;
      },
      async findById(id) {
        return workflowRuns.get(id);
      },
    },
    providerLogs: {
      async save(log) {
        providerLogs.push(log);
        return log;
      },
      async list(filters?: { workflowRunId?: WorkflowRunId; traceId?: TraceId }) {
        return providerLogs.filter(
          (log) =>
            (!filters?.workflowRunId || log.workflowRunId === filters.workflowRunId) &&
            (!filters?.traceId || log.traceId === filters.traceId),
        );
      },
    },
    journal: {
      async save(entry) {
        journal.set(entry.id, entry);
        return entry;
      },
      async findById(id) {
        return journal.get(id);
      },
      async list(filters?: { recommendationId?: RecommendationId }) {
        const values = [...journal.values()];
        return filters?.recommendationId
          ? values.filter((entry) => entry.recommendationId === filters.recommendationId)
          : values;
      },
    },
    outcomes: {
      async save(outcome) {
        const index = outcomes.findIndex((item) => item.id === outcome.id);
        if (index >= 0) {
          outcomes[index] = outcome;
        } else {
          outcomes.push(outcome);
        }
        return outcome;
      },
      async list(filters?: { recommendationId?: RecommendationId }) {
        return filters?.recommendationId
          ? outcomes.filter((item) => item.recommendationId === filters.recommendationId)
          : outcomes;
      },
    },
  };
};
