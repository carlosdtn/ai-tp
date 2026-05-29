import { z } from "zod";

export const providerTypeSchema = z.enum(["ai", "broker", "market-data", "persistence"]);

export const marketDataSnapshotSchema = z.object({
  providerId: z.string().min(1),
  asOf: z.string().datetime(),
  freshnessStatus: z.enum(["fresh", "stale"]),
  snapshot: z.record(z.unknown()),
  sourceRefs: z.array(z.string().min(1)),
});

export const aiAnalysisSchema = z.object({
  providerId: z.string().min(1),
  summary: z.string().min(1),
  rationale: z.string().min(1),
  confidence: z.number().min(0).max(1),
  risksMentioned: z.array(z.string()),
  rawResponseRef: z.string().min(1),
  sourceRefs: z.array(z.string().min(1)),
});

export const paperSimulationSchema = z.object({
  providerId: z.string().min(1),
  paperSimulationId: z.string().min(1),
  status: z.enum(["accepted", "rejected"]),
  reason: z.string(),
  buyingPowerImpact: z.number(),
});
