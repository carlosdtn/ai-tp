# Data Model: PostgreSQL Persistence

## Tables

### watchlists

- `id` primary key
- `name`
- `description`
- `payload` complete `Watchlist`
- `created_at`
- `updated_at`

### workflow_runs

- `id` primary key
- `watchlist_id`
- `status`
- `triggered_by`
- `trace_id`
- `payload` complete `WorkflowRun`
- `started_at`
- `completed_at`

### recommendations

- `id` primary key
- `workflow_run_id`
- `instrument_id`
- `action`
- `status`
- `trace_id`
- `payload` complete `Recommendation`
- `created_at`
- `updated_at`

### provider_execution_logs

- `id` primary key
- `workflow_run_id`
- `provider_type`
- `provider_name`
- `operation`
- `status`
- `trace_id`
- `payload` complete `ProviderExecutionLog`
- `created_at`

### journal_entries

- `id` primary key
- `recommendation_id`
- `instrument_id`
- `paper_simulation_id`
- `entry_type`
- `content`
- `payload` complete `JournalEntry`
- `created_at`
- `updated_at`

### recommendation_outcomes

- `id` primary key
- `recommendation_id`
- `classification`
- `trace_id`
- `payload` complete `RecommendationOutcome`
- `created_at`

## Reconstruction Rule

Repositories reconstruct domain entities from `payload`. Query columns are used for filters, listing, and future indexing.
