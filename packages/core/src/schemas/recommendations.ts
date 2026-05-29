import { z } from "zod";

export const scoreResultSchema = z.object({
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  factors: z.array(
    z.object({
      name: z.string().min(1),
      value: z.number().min(0).max(1),
      weight: z.number().min(0).max(1),
      explanation: z.string().min(1),
    }),
  ),
  thresholds: z.record(z.number()),
});

export const riskAssessmentSchema = z.object({
  status: z.enum(["passed", "warning", "rejected"]),
  riskFactors: z.array(z.string()),
  warnings: z.array(z.string()),
  rejectionReasons: z.array(z.string()),
  constraints: z.record(z.unknown()),
});

export const recommendationSchema = z.object({
  id: z.string().min(1),
  workflowRunId: z.string().min(1),
  instrumentId: z.string().min(1),
  action: z.enum(["buy", "sell", "hold", "avoid"]),
  status: z.enum(["draft", "actionable", "warning", "rejected"]),
  inputSnapshot: z.record(z.unknown()),
  sourceRefs: z.array(z.string().min(1)),
  providerIds: z.record(z.string()),
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  risks: riskAssessmentSchema,
  explanation: z.string().min(1),
  traceId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
