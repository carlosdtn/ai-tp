import { type Result, err, ok } from "../domain/result";
import {
  aiAnalysisSchema,
  marketDataSnapshotSchema,
  paperSimulationSchema,
} from "../schemas/providers";

export const validateMarketDataOutput = <T>(value: T): Result<T> => {
  const parsed = marketDataSnapshotSchema.safeParse(value);
  return parsed.success
    ? ok(value)
    : err("INVALID_PROVIDER_RESPONSE", "Invalid market data output.");
};

export const validateAIAnalysisOutput = <T>(value: T): Result<T> => {
  const parsed = aiAnalysisSchema.safeParse(value);
  return parsed.success
    ? ok(value)
    : err("INVALID_PROVIDER_RESPONSE", "Invalid AI analysis output.");
};

export const validatePaperSimulationOutput = <T>(value: T): Result<T> => {
  const parsed = paperSimulationSchema.safeParse(value);
  return parsed.success
    ? ok(value)
    : err("INVALID_PROVIDER_RESPONSE", "Invalid paper simulation output.");
};
