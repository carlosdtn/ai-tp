import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DatabaseClient = ReturnType<typeof createPostgresClient>;
export type Database = ReturnType<typeof createDatabase>;

export const createPostgresClient = (databaseUrl: string) =>
  postgres(databaseUrl, {
    max: 5,
  });

export const createDatabase = (client: DatabaseClient) => drizzle(client, { schema });

export const createDatabaseFromUrl = (databaseUrl: string) =>
  createDatabase(createPostgresClient(databaseUrl));

export const initializeDatabase = async (databaseUrl: string): Promise<void> => {
  const client = createPostgresClient(databaseUrl);
  try {
    await client`
      CREATE TABLE IF NOT EXISTS watchlists (
        id varchar(128) PRIMARY KEY,
        name text NOT NULL,
        description text,
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS workflow_runs (
        id varchar(128) PRIMARY KEY,
        watchlist_id varchar(128) NOT NULL,
        status varchar(32) NOT NULL,
        triggered_by varchar(32) NOT NULL,
        trace_id varchar(128) NOT NULL,
        payload jsonb NOT NULL,
        started_at timestamptz NOT NULL,
        completed_at timestamptz
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS recommendations (
        id varchar(128) PRIMARY KEY,
        workflow_run_id varchar(128) NOT NULL,
        instrument_id varchar(128) NOT NULL,
        action varchar(32) NOT NULL,
        status varchar(32) NOT NULL,
        payload jsonb NOT NULL,
        trace_id varchar(128) NOT NULL,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS provider_execution_logs (
        id varchar(128) PRIMARY KEY,
        workflow_run_id varchar(128) NOT NULL,
        provider_type varchar(64) NOT NULL,
        provider_name text NOT NULL,
        operation text NOT NULL,
        status varchar(32) NOT NULL,
        payload jsonb NOT NULL,
        trace_id varchar(128) NOT NULL,
        created_at timestamptz NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id varchar(128) PRIMARY KEY,
        recommendation_id varchar(128),
        instrument_id varchar(128),
        paper_simulation_id varchar(128),
        entry_type varchar(32) NOT NULL,
        content text NOT NULL,
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS recommendation_outcomes (
        id varchar(128) PRIMARY KEY,
        recommendation_id varchar(128) NOT NULL,
        classification varchar(32) NOT NULL,
        payload jsonb NOT NULL,
        trace_id varchar(128) NOT NULL,
        created_at timestamptz NOT NULL
      )
    `;
  } finally {
    await client.end();
  }
};
