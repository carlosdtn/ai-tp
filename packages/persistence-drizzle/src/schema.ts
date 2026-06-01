import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const watchlists = pgTable("watchlists", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: varchar("id", { length: 128 }).primaryKey(),
  workflowRunId: varchar("workflow_run_id", { length: 128 }).notNull(),
  instrumentId: varchar("instrument_id", { length: 128 }).notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  payload: jsonb("payload").notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const providerExecutionLogs = pgTable("provider_execution_logs", {
  id: varchar("id", { length: 128 }).primaryKey(),
  workflowRunId: varchar("workflow_run_id", { length: 128 }).notNull(),
  providerType: varchar("provider_type", { length: 64 }).notNull(),
  providerName: text("provider_name").notNull(),
  operation: text("operation").notNull(),
  payload: jsonb("payload").notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id", { length: 128 }).primaryKey(),
  content: text("content").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const recommendationOutcomes = pgTable("recommendation_outcomes", {
  id: varchar("id", { length: 128 }).primaryKey(),
  recommendationId: varchar("recommendation_id", { length: 128 }).notNull(),
  classification: varchar("classification", { length: 32 }).notNull(),
  payload: jsonb("payload").notNull(),
  traceId: varchar("trace_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});
