import type {
  JournalEntry,
  ProviderExecutionLog,
  Recommendation,
  RecommendationOutcome,
  Watchlist,
  WorkflowRun,
} from "@ai-tp/core";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const watchlists = pgTable("watchlists", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  payload: jsonb("payload").$type<Watchlist>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});

export const workflowRuns = pgTable("workflow_runs", {
  id: varchar("id", { length: 128 }).primaryKey(),
  watchlistId: varchar("watchlist_id", { length: 128 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  triggeredBy: varchar("triggered_by", { length: 32 }).notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  payload: jsonb("payload").$type<WorkflowRun>().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "string" }),
});

export const recommendations = pgTable("recommendations", {
  id: varchar("id", { length: 128 }).primaryKey(),
  workflowRunId: varchar("workflow_run_id", { length: 128 }).notNull(),
  instrumentId: varchar("instrument_id", { length: 128 }).notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  payload: jsonb("payload").$type<Recommendation>().notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});

export const providerExecutionLogs = pgTable("provider_execution_logs", {
  id: varchar("id", { length: 128 }).primaryKey(),
  workflowRunId: varchar("workflow_run_id", { length: 128 }).notNull(),
  providerType: varchar("provider_type", { length: 64 }).notNull(),
  providerName: text("provider_name").notNull(),
  operation: text("operation").notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  payload: jsonb("payload").$type<ProviderExecutionLog>().notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id", { length: 128 }).primaryKey(),
  recommendationId: varchar("recommendation_id", { length: 128 }),
  instrumentId: varchar("instrument_id", { length: 128 }),
  paperSimulationId: varchar("paper_simulation_id", { length: 128 }),
  entryType: varchar("entry_type", { length: 32 }).notNull(),
  content: text("content").notNull(),
  payload: jsonb("payload").$type<JournalEntry>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});

export const recommendationOutcomes = pgTable("recommendation_outcomes", {
  id: varchar("id", { length: 128 }).primaryKey(),
  recommendationId: varchar("recommendation_id", { length: 128 }).notNull(),
  classification: varchar("classification", { length: 32 }).notNull(),
  payload: jsonb("payload").$type<RecommendationOutcome>().notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
});
