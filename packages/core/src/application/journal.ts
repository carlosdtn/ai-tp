import type { JournalEntry } from "../domain/journal";
import { createId, nowIso } from "../domain/primitives";
import { type Result, err, ok } from "../domain/result";
import type { JournalRepository } from "../ports/repositories";
import { createJournalEntryInputSchema } from "../schemas/journal";

export type CreateJournalEntryInput = Parameters<typeof createJournalEntryInputSchema.parse>[0];

export const createJournalEntry = async (
  input: CreateJournalEntryInput,
  repository: JournalRepository,
): Promise<Result<JournalEntry>> => {
  const parsed = createJournalEntryInputSchema.safeParse(input);
  if (!parsed.success) {
    return err("INVALID_INPUT", "Invalid journal entry input.", parsed.error);
  }
  const timestamp = nowIso();
  const entry: JournalEntry = {
    id: createId("JournalEntry"),
    ...parsed.data,
    createdAt: timestamp,
    updatedAt: timestamp,
  } as JournalEntry;
  return ok(await repository.save(entry));
};
