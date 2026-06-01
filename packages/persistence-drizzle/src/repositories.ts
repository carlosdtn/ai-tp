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
import { and, eq } from "drizzle-orm";
import { type Database, createDatabaseFromUrl } from "./database";
import {
  journalEntries,
  providerExecutionLogs,
  recommendationOutcomes,
  recommendations,
  watchlists,
  workflowRuns,
} from "./schema";

export const createPostgresRepositories = (databaseUrl: string): Repositories =>
  createDrizzleRepositories(createDatabaseFromUrl(databaseUrl));

export const createDrizzleRepositories = (db: Database): Repositories => ({
  watchlists: {
    async save(watchlist) {
      await db
        .insert(watchlists)
        .values({
          id: watchlist.id,
          name: watchlist.name,
          description: watchlist.description ?? null,
          payload: watchlist,
          createdAt: watchlist.createdAt,
          updatedAt: watchlist.updatedAt,
        })
        .onConflictDoUpdate({
          target: watchlists.id,
          set: {
            name: watchlist.name,
            description: watchlist.description ?? null,
            payload: watchlist,
            updatedAt: watchlist.updatedAt,
          },
        });
      return watchlist;
    },
    async findById(id) {
      const rows = await db.select().from(watchlists).where(eq(watchlists.id, id)).limit(1);
      return rows[0]?.payload as Watchlist | undefined;
    },
    async list() {
      const rows = await db.select().from(watchlists);
      return rows.map((row) => row.payload as Watchlist);
    },
  },
  recommendations: {
    async save(recommendation) {
      await db
        .insert(recommendations)
        .values({
          id: recommendation.id,
          workflowRunId: recommendation.workflowRunId,
          instrumentId: recommendation.instrumentId,
          action: recommendation.action,
          status: recommendation.status,
          payload: recommendation,
          traceId: recommendation.traceId,
          createdAt: recommendation.createdAt,
          updatedAt: recommendation.updatedAt,
        })
        .onConflictDoUpdate({
          target: recommendations.id,
          set: {
            action: recommendation.action,
            status: recommendation.status,
            payload: recommendation,
            traceId: recommendation.traceId,
            updatedAt: recommendation.updatedAt,
          },
        });
      return recommendation;
    },
    async findById(id) {
      const rows = await db
        .select()
        .from(recommendations)
        .where(eq(recommendations.id, id))
        .limit(1);
      return rows[0]?.payload as Recommendation | undefined;
    },
    async list(filters?: { watchlistId?: WatchlistId; traceId?: TraceId }) {
      const rows = await db
        .select()
        .from(recommendations)
        .where(filters?.traceId ? eq(recommendations.traceId, filters.traceId) : undefined);
      const values = rows.map((row) => row.payload as Recommendation);
      return filters?.watchlistId
        ? values.filter((item) => item.inputSnapshot?.watchlistId === filters.watchlistId)
        : values;
    },
  },
  workflowRuns: {
    async save(workflowRun) {
      await db
        .insert(workflowRuns)
        .values({
          id: workflowRun.id,
          watchlistId: workflowRun.watchlistId,
          status: workflowRun.status,
          triggeredBy: workflowRun.triggeredBy,
          traceId: workflowRun.traceId,
          payload: workflowRun,
          startedAt: workflowRun.startedAt,
          completedAt: workflowRun.completedAt ?? null,
        })
        .onConflictDoUpdate({
          target: workflowRuns.id,
          set: {
            status: workflowRun.status,
            traceId: workflowRun.traceId,
            payload: workflowRun,
            completedAt: workflowRun.completedAt ?? null,
          },
        });
      return workflowRun;
    },
    async findById(id) {
      const rows = await db.select().from(workflowRuns).where(eq(workflowRuns.id, id)).limit(1);
      return rows[0]?.payload as WorkflowRun | undefined;
    },
  },
  providerLogs: {
    async save(log) {
      await db
        .insert(providerExecutionLogs)
        .values({
          id: log.id,
          workflowRunId: log.workflowRunId,
          providerType: log.providerType,
          providerName: log.providerName,
          operation: log.operation,
          status: log.status,
          payload: log,
          traceId: log.traceId,
          createdAt: log.createdAt,
        })
        .onConflictDoUpdate({
          target: providerExecutionLogs.id,
          set: {
            status: log.status,
            payload: log,
            traceId: log.traceId,
          },
        });
      return log;
    },
    async list(filters?: { workflowRunId?: WorkflowRunId; traceId?: TraceId }) {
      const rows = await db.select().from(providerExecutionLogs).where(providerLogFilter(filters));
      return rows.map((row) => row.payload as ProviderExecutionLog);
    },
  },
  journal: {
    async save(entry) {
      await db
        .insert(journalEntries)
        .values({
          id: entry.id,
          recommendationId: entry.recommendationId ?? null,
          instrumentId: entry.instrumentId ?? null,
          paperSimulationId: entry.paperSimulationId ?? null,
          entryType: entry.entryType,
          content: entry.content,
          payload: entry,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
        })
        .onConflictDoUpdate({
          target: journalEntries.id,
          set: {
            content: entry.content,
            payload: entry,
            updatedAt: entry.updatedAt,
          },
        });
      return entry;
    },
    async findById(id) {
      const rows = await db.select().from(journalEntries).where(eq(journalEntries.id, id)).limit(1);
      return rows[0]?.payload as JournalEntry | undefined;
    },
    async list(filters?: { recommendationId?: RecommendationId }) {
      const rows = await db
        .select()
        .from(journalEntries)
        .where(
          filters?.recommendationId
            ? eq(journalEntries.recommendationId, filters.recommendationId)
            : undefined,
        );
      return rows.map((row) => row.payload as JournalEntry);
    },
  },
  outcomes: {
    async save(outcome) {
      await db
        .insert(recommendationOutcomes)
        .values({
          id: outcome.id,
          recommendationId: outcome.recommendationId,
          classification: outcome.classification,
          payload: outcome,
          traceId: outcome.traceId,
          createdAt: outcome.createdAt,
        })
        .onConflictDoNothing();
      return outcome;
    },
    async list(filters?: { recommendationId?: RecommendationId }) {
      const rows = await db
        .select()
        .from(recommendationOutcomes)
        .where(
          filters?.recommendationId
            ? eq(recommendationOutcomes.recommendationId, filters.recommendationId)
            : undefined,
        );
      return rows.map((row) => row.payload as RecommendationOutcome);
    },
  },
});

const providerLogFilter = (filters?: { workflowRunId?: WorkflowRunId; traceId?: TraceId }) => {
  if (filters?.workflowRunId && filters.traceId) {
    return and(
      eq(providerExecutionLogs.workflowRunId, filters.workflowRunId),
      eq(providerExecutionLogs.traceId, filters.traceId),
    );
  }
  if (filters?.workflowRunId) {
    return eq(providerExecutionLogs.workflowRunId, filters.workflowRunId);
  }
  if (filters?.traceId) {
    return eq(providerExecutionLogs.traceId, filters.traceId);
  }
  return undefined;
};
