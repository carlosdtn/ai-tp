export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type Id<Name extends string> = Brand<string, `${Name}Id`>;

export type InstrumentId = Id<"Instrument">;
export type WatchlistId = Id<"Watchlist">;
export type WorkflowRunId = Id<"WorkflowRun">;
export type RecommendationId = Id<"Recommendation">;
export type ProviderExecutionLogId = Id<"ProviderExecutionLog">;
export type JournalEntryId = Id<"JournalEntry">;
export type PaperSimulationId = Id<"PaperSimulation">;
export type TraceId = Brand<string, "TraceId">;

export const createId = <Name extends string>(prefix: Name): Id<Name> =>
  `${prefix}_${Math.random().toString(36).slice(2, 12)}` as Id<Name>;

export const createTraceId = (): TraceId =>
  `trace_${Math.random().toString(36).slice(2, 12)}` as TraceId;

export type Timestamp = string;

export const nowIso = (): Timestamp => new Date().toISOString();
