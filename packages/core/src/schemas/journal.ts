import { z } from "zod";

export const journalEntrySchema = z.object({
  id: z.string().min(1),
  instrumentId: z.string().optional(),
  recommendationId: z.string().optional(),
  paperSimulationId: z.string().optional(),
  author: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()),
  entryType: z.enum(["note", "outcome", "system"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createJournalEntryInputSchema = journalEntrySchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .refine(
    (entry) => entry.instrumentId || entry.recommendationId || entry.paperSimulationId,
    "At least one contextual link is required",
  );
