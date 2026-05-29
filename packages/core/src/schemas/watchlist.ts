import { z } from "zod";

export const assetClassSchema = z.enum(["equity", "etf", "crypto", "forex"]);

export const instrumentSchema = z.object({
  id: z.string().min(1),
  symbol: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.toUpperCase()),
  displayName: z.string().min(1),
  assetClass: assetClassSchema,
  currency: z.string().length(3),
  market: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const watchlistSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  description: z.string().optional(),
  instruments: z.array(instrumentSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createWatchlistInputSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
});

export const addInstrumentInputSchema = z.object({
  watchlistId: z.string().min(1),
  symbol: z.string().trim().min(1),
  displayName: z.string().optional(),
  assetClass: assetClassSchema.default("equity"),
  currency: z.string().length(3).default("USD"),
  market: z.string().min(1).default("NASDAQ"),
});
