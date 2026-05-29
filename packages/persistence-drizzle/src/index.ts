export * as schema from "./schema";

export type PersistenceAdapterStatus = {
  adapter: "drizzle-postgresql";
  coreDependencyDirection: "adapter-depends-on-core";
};

export const persistenceAdapterStatus: PersistenceAdapterStatus = {
  adapter: "drizzle-postgresql",
  coreDependencyDirection: "adapter-depends-on-core",
};
