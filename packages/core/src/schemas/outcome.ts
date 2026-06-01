import { z } from "zod";

export const expectedDirectionSchema = z.enum(["up", "down", "flat"]);
export const outcomeClassificationSchema = z.enum(["win", "loss", "neutral", "unresolved"]);

export const evaluationPolicySchema = z.object({
  id: z.string().min(1),
  recommendationId: z.string().min(1),
  expectedDirection: expectedDirectionSchema,
  horizonDays: z.number().int().positive(),
  neutralThresholdPct: z.number().min(0),
  benchmarkSymbol: z.string().optional(),
  method: z.literal("absolute-return"),
  createdAt: z.string().datetime(),
});

export const priceSnapshotSchema = z.object({
  price: z.number().positive(),
  timestamp: z.string().datetime(),
  sourceRefs: z.array(z.string().min(1)),
  providerId: z.string().min(1),
});

export const recommendationOutcomeSchema = z.object({
  id: z.string().min(1),
  recommendationId: z.string().min(1),
  policy: evaluationPolicySchema,
  entrySnapshot: priceSnapshotSchema.optional(),
  evaluationSnapshot: priceSnapshotSchema.optional(),
  classification: outcomeClassificationSchema,
  absoluteReturn: z.number().optional(),
  percentReturn: z.number().optional(),
  unresolvedReason: z.string().optional(),
  evaluator: z.enum(["system", "cli", "dashboard", "test"]),
  method: z.literal("absolute-return"),
  sourceRefs: z.array(z.string()),
  traceId: z.string().min(1),
  createdAt: z.string().datetime(),
});
